"""One-off check (13 Oct 2026): does the new build show exactly what the live claude.ai page showed?

Compares the DATA in site/js/data.js with the DATA in live-site/index.html. Picture paths differ (the live page used
/_blob/<id>), so every picture is compared by its file contents instead of its path.
Pass --gallery-refreshed to ignore Gallery numbers and comments, which change with every refresh.
"""
import hashlib, json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import path, SITE

refreshed = '--gallery-refreshed' in sys.argv
live_line = next(l for l in open(path('live-site', 'index.html'), encoding='utf-8') if l.startswith('const DATA = '))
live = json.loads(live_line[len('const DATA = '):].rstrip().rstrip(';'))
new_text = open(os.path.join(SITE, 'js', 'data.js'), encoding='utf-8').read()
new = json.loads(re.search(r'^const DATA = (.*);$', new_text, re.M).group(1))
tpl = open(path('build', 'template.html'), encoding='utf-8').read()

_h = {}
def digest(p):
    if p not in _h:
        with open(p, 'rb') as f: _h[p] = hashlib.md5(f.read()).hexdigest()[:12]
    return _h[p]
def pic(src, root):
    if not src: return src
    f = os.path.join(root, src.lstrip('/'))
    return 'file:' + digest(f) if os.path.exists(f) else 'MISSING:' + src

def pics(o, root):
    """Replace picture paths with file fingerprints."""
    if isinstance(o, dict):
        return {k: (pic(v, root) if k in ('src', 'thumb', 'map') and isinstance(v, str) else pics(v, root)) for k, v in o.items()}
    if isinstance(o, list): return [pics(x, root) for x in o]
    return o

GALLERY_NUMBERS = {'likes', 'downloads', 'comments', 'commentList', 'checked'}
def walk(p, a, b, out):
    if refreshed and p.split('/')[-1] in GALLERY_NUMBERS: return
    if type(a) != type(b): out.append((p, a, b)); return
    if isinstance(a, dict):
        for k in sorted(set(a) | set(b)): walk(p + '/' + k, a.get(k, '<missing>'), b.get(k, '<missing>'), out)
    elif isinstance(a, list):
        if len(a) != len(b): out.append((p, f'{len(a)} items', f'{len(b)} items'))
        for i, (x, y) in enumerate(zip(a, b)): walk(f'{p}[{i}]', x, y, out)
    elif a != b: out.append((p, a, b))

out = []
for k in ('worlds', 'households', 'stats'):
    walk(k, pics(live[k], path('live-site')), pics(new[k], SITE), out)
# the constants that used to sit in the page's code
consts = {'FAMILY_LINKS': 'familyLinks', 'TENANTS': 'tenants', 'NAME_FIX': 'nameFix', 'CS_VERSIONS': 'csVersions'}
for js, key in consts.items():
    v = json.loads(re.search(rf'^const {js} = (.*);$', tpl, re.M).group(1))
    walk(key, pics(v, path('live-site')), pics(new[key], SITE), out)
nb = json.loads(re.search(r'^const NB_PT = (.*);$', tpl, re.M).group(1).replace('[.', '[0.').replace(',.', ',0.'))
walk('nbPt', nb, new['nbPt'], out)

for o in out[:60]: print(o[0], '|', str(o[1])[:90], '|', str(o[2])[:90])
print(f"{len(out)} differences" + (" (Gallery numbers ignored)" if refreshed else ""))
