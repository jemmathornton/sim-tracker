"""Script mods (.ts4script) against the game's current Python (30 Oct 2026, after patch 1.129). Report only.

Every module a mod imports from the game, every name it imports from them, and every module.attribute or
Class.attribute it then uses must still exist in the installed game; attributes it uses on anything else must at least
be defined or mentioned somewhere in the game or in one of her script mods. Used by mods_vs_game.py; on its own:

    python tools/research/script_names.py <a .ts4script> ...
"""
import builtins, os, sys, zipfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, pyc37

LOAD_CONST, IMPORT_NAME, IMPORT_FROM, LOAD_ATTR, LOAD_METHOD, LOAD_GLOBAL, LOAD_NAME, LOAD_FAST = 100, 108, 109, 106, 160, 116, 101, 124
STORE_NAME, STORE_GLOBAL, STORE_FAST, STORE_ATTR, LOAD_DEREF, STORE_DEREF = 90, 97, 125, 95, 136, 137
STORES = (STORE_NAME, STORE_GLOBAL, STORE_FAST, STORE_DEREF)
ZIPS = [os.path.join(s4.GAME, 'Data', 'Simulation', 'Gameplay', z) for z in ('simulation.zip', 'core.zip', 'base.zip')] + \
       [os.path.join(s4.GAME, 'Game', 'Bin', 'Python', 'generated.zip')]
BUILTIN = set(dir(builtins)) | {a for t in (str, list, dict, set, int, float, tuple, bytes, object, type, frozenset) for a in dir(t)}


def name_of(co, op, arg):
    if op in (LOAD_FAST, STORE_FAST): return co.varnames[arg]
    if op in (LOAD_DEREF, STORE_DEREF):
        cv = tuple(co.cellvars) + tuple(co.freevars); return cv[arg] if arg < len(cv) else None
    return co.names[arg]


def strings(c):
    for x in c.consts:
        if isinstance(x, str): yield x
        elif isinstance(x, tuple): yield from (y for y in x if isinstance(y, str))


def pycs(path):
    z = zipfile.ZipFile(path)
    for n in z.namelist():
        if n.endswith('.pyc'):
            try: yield n, pyc37.load(z.read(n))
            except Exception as e: print('unreadable', path, n, e, file=sys.stderr)


def index(paths):
    """modules {name: top-level names}, classes {(module, class): body names}, defined names, mentioned names."""
    modules, classes, defined, mentioned = {}, {}, set(), set()
    for zp in paths:
        for n, co in pycs(zp):
            mod = n[:-4].replace('/', '.')
            if mod.endswith('.__init__'): mod = mod[:-9]
            modules[mod] = {co.names[a] for o, a in pyc37.instrs(co) if o in (STORE_NAME, STORE_GLOBAL)}
            for c in pyc37.walk(co):
                defined.add(c.name); mentioned.update(c.names); mentioned.update(strings(c))
                body = [c.names[a] for o, a in pyc37.instrs(c) if o == STORE_NAME]
                if c is not co and body[:2] == ['__module__', '__qualname__']:
                    classes.setdefault((mod, c.name), set()).update(body); defined.update(body)
                for o, a in pyc37.instrs(c):
                    if o in (STORE_ATTR, STORE_GLOBAL): defined.add(c.names[a])
    return modules, classes, defined, mentioned


def check(path, game, own_tops, own_defined, extra=()):
    modules, classes, defined, mentioned = game; problems = []; vague = set()
    known = defined | mentioned | own_defined | BUILTIN | set(extra)
    for n, root in pycs(path):
        root_alias = {}
        for co in pyc37.walk(root):
            ins = list(pyc37.instrs(co)); alias = {}
            for i, (op, arg) in enumerate(ins):
                if op != IMPORT_NAME: continue
                mod = co.names[arg]
                lvl = co.consts[ins[i - 2][1]] if i >= 2 and ins[i - 2][0] == LOAD_CONST else 0
                top = mod.split('.')[0]
                if lvl or top in own_tops or top in sys.stdlib_module_names: continue
                if mod not in modules:
                    if any(m == top or m.startswith(top + '.') for m in modules): problems.append('%s: imports %s, which is no longer in the game' % (n, mod))
                    else: problems.append('%s: imports %s (not the game\'s, not one of her mods)' % (n, mod))
                    continue
                j = i + 1
                if j < len(ins) and ins[j][0] == IMPORT_FROM:
                    while j < len(ins) and ins[j][0] == IMPORT_FROM:
                        nm = co.names[ins[j][1]]
                        if nm not in modules[mod] and mod + '.' + nm not in modules:
                            problems.append('%s: from %s import %s, which is no longer there' % (n, mod, nm))
                        if j + 1 < len(ins) and ins[j + 1][0] in STORES:
                            a = name_of(co, *ins[j + 1])
                            alias[a] = ('cls', mod, nm) if (mod, nm) in classes else ('mod', mod + '.' + nm if mod + '.' + nm in modules else None, nm)
                        j += 2
                else:
                    k = j
                    while k < len(ins) and ins[k][0] == LOAD_ATTR: k += 1
                    if k < len(ins) and ins[k][0] in STORES:
                        a = name_of(co, *ins[k]); alias[a] = ('mod', mod if k > j or top != a else a, None)
            if co is root: root_alias = alias
            else: alias = {**root_alias, **alias}
            for i, (op, arg) in enumerate(ins):
                if op in (LOAD_GLOBAL, LOAD_NAME, LOAD_FAST, LOAD_DEREF) and name_of(co, op, arg) in alias:
                    kind, mod, nm = alias[name_of(co, op, arg)]
                    cur = ('cls', mod, nm) if kind == 'cls' else (('mod', mod, None) if mod else None)
                    j = i + 1
                    while cur and j < len(ins) and ins[j][0] in (LOAD_ATTR, LOAD_METHOD):
                        at = co.names[ins[j][1]]
                        if cur[0] == 'mod':
                            m = cur[1]
                            if m == 'services' and at.endswith('_manager'): cur = None   # made at start-up with globals()
                            elif m + '.' + at in modules: cur = ('mod', m + '.' + at, None)
                            elif at in modules.get(m, ()): cur = ('cls', m, at) if (m, at) in classes else None
                            else: problems.append('%s (%s): uses %s.%s, which is no longer in the game' % (n, co.name, m, at)); cur = None
                        else:
                            if at not in classes.get((cur[1], cur[2]), set()) and at not in known:
                                problems.append('%s (%s): uses %s.%s.%s, defined nowhere in the game' % (n, co.name, cur[1], cur[2], at))
                            cur = None
                        j += 1
            for op, arg in ins:
                if op in (LOAD_ATTR, LOAD_METHOD, STORE_ATTR):
                    at = co.names[arg]
                    if at not in known and at.isascii() and not at.startswith(('__', 'debug', 'is_debug')) and not at.isupper():
                        vague.add(at)
    out = sorted(set(problems))
    if vague: out.append('names used on other objects that nothing in the game or her mods defines or mentions (often fine: made at run time): ' + ', '.join(sorted(vague)[:20]))
    return out


def check_all(paths, extra=()):
    """extra: more names counted as known, e.g. every tuning field name in her mods' XML (module tuning sets them)."""
    game = index([z for z in ZIPS if os.path.exists(z)])
    own_tops, own_defined = set(), set()
    for p in paths:
        for n, co in pycs(p):
            own_tops.add(n.split('/')[0].replace('.pyc', ''))
            for c in pyc37.walk(co):
                own_defined.add(c.name); own_defined.update(strings(c))
                for o, a in pyc37.instrs(c):
                    if o in (STORE_ATTR, STORE_NAME, STORE_GLOBAL): own_defined.add(c.names[a])
    return {p: check(p, game, own_tops, own_defined, extra) for p in paths}


if __name__ == '__main__':
    for p, probs in check_all(sys.argv[1:]).items():
        print('==', p); print('\n'.join(probs) or 'all names still exist')
