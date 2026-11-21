"""Shared bits for the tests (9 Nov): paths, the plan loaded once, and ways to run a tool without it touching the project.

Nothing here writes into the project: anything a tool would write goes to a temporary folder (see temp_gallery, Capture).
"""
import contextlib, io, json, os, re, shutil, stat, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
RESEARCH = os.path.join(TOOLS, 'research')
for p in (TOOLS, RESEARCH):
    if p not in sys.path: sys.path.insert(0, p)
FIXTURES = os.path.join(ROOT, 'tests', 'fixtures')

from common import DATA, SITE, GALLERY, load, world_files, slug, norm   # noqa: E402

WORLDS = [(os.path.basename(p)[:-5], load(p)) for p in world_files()]
LOTS = [(ws, W, h, l) for ws, W in WORLDS for h in W['neighbourhoods'] for l in h['lots']]
UPLOADS = load(os.path.join(GALLERY, 'uploads.json'))['uploads']
PEOPLE = {k: v for k, v in load(os.path.join(DATA, 'people.json')).items() if not k.startswith('_')}
HOUSEHOLDS = [(W, hn, hh) for ws, W in WORLDS for hn, hh in (W.get('households') or {}).items()]
SIMS = [s for W, hn, hh in HOUSEHOLDS for s in hh.get('sims', [])]

# what "the project" is for the checks that nothing was written: everything but git's own folder, the test tools, Playwright's
# output, Python's caches and the refresh log (the weekly task may write it while the tests run)
SKIP_DIRS = {'.git', 'node_modules', '.tools', 'test-results', 'playwright-report', '__pycache__', 'logs'}
# and other Claude sessions' work going on at the same time (21 Nov review): their worktrees and scratch folders
SKIP_PATHS = {'.claude/worktrees', '.claude/scratch', '.claude/tmp'}


def snapshot():
    """{path: (modified time, size)} for every project file."""
    out = {}
    for d, ds, fs in os.walk(ROOT):
        ds[:] = [x for x in ds if x not in SKIP_DIRS and os.path.relpath(os.path.join(d, x), ROOT).replace(os.sep, '/') not in SKIP_PATHS]
        for f in fs:
            p = os.path.join(d, f)
            try: st = os.stat(p)
            except OSError: continue
            out[os.path.relpath(p, ROOT)] = (st.st_mtime_ns, st.st_size)
    return out


AT_START = snapshot()   # taken when the first test module is loaded, before any test runs (tests/test_zz_untouched.py compares)


def built_data():
    """site/js/data.js as the build last wrote it."""
    t = open(os.path.join(SITE, 'js', 'data.js'), encoding='utf-8').read()
    return json.loads(t[t.index('{'):t.rindex('}') + 1])


@contextlib.contextmanager
def quiet():
    """Run a tool with its printing swallowed; yields the text it printed."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        yield buf


@contextlib.contextmanager
def patched(obj, **values):
    """Set attributes on a module (or object) for the duration, then put them back."""
    old = {k: getattr(obj, k) for k in values if hasattr(obj, k)}
    missing = [k for k in values if not hasattr(obj, k)]
    for k, v in values.items(): setattr(obj, k, v)
    try:
        yield obj
    finally:
        for k, v in old.items(): setattr(obj, k, v)
        for k in missing: delattr(obj, k)


def _writable_then_retry(func, path, exc):
    """git keeps its objects read-only, and Windows won't delete a read-only file: make it writable and try again."""
    try:
        os.chmod(path, stat.S_IWRITE); func(path)
    except OSError:
        pass


def remove_tree(d):
    shutil.rmtree(d, onexc=_writable_then_retry)
    if os.path.exists(d): shutil.rmtree(d, ignore_errors=True)


@contextlib.contextmanager
def temp_dir():
    """A temporary folder, removed afterwards (git repos too: 19 Nov, their read-only objects used to leave the folder behind)."""
    d = tempfile.mkdtemp(prefix='simworld-test-')
    try:
        yield d
    finally:
        remove_tree(d)


@contextlib.contextmanager
def tools_copy(*files):
    """A temporary copy of tools/ (its own scripts, not research/ or one-off/), plus any project files named (read-only inputs
    a tool loads on start), so a tool can be run as a program without the real project anywhere near: its ROOT is the
    temporary folder (21 Nov review)."""
    with temp_dir() as d:
        shutil.copytree(TOOLS, os.path.join(d, 'tools'), ignore=shutil.ignore_patterns('__pycache__', 'one-off', 'research', 'git-hooks'))
        for f in files:
            os.makedirs(os.path.dirname(os.path.join(d, f)), exist_ok=True); shutil.copy(os.path.join(ROOT, f), os.path.join(d, f))
        yield os.path.join(d, 'tools')


@contextlib.contextmanager
def argv(*args):
    old = sys.argv[:]
    sys.argv = ['tool.py', *args]
    try:
        yield
    finally:
        sys.argv = old


def world(name='Testville', owned=True, lots=(), hood='Old Town', households=None):
    """A small world in the plan's own shape."""
    W = {"name": name, "pack": "Base Game", "owned": owned, "colour": "#123456",
         "neighbourhoods": [{"name": hood, "desc": "", "lots": [dict(l) for l in lots]}]}
    if households is not None: W['households'] = households
    return W


def lot(name, **kw):
    base = {"lot": name, "myName": None, "type": "Residential", "size": "30x20", "residents": "Empty",
            "built": True, "shared": True, "screenshots": False, "simsMade": False}
    base.update(kw)
    return base
