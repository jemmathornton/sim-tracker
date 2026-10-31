"""EA's family-tree ancestors (the Feb 2026 update's PremadeAncestor tuning): each one's portrait and how they died, in the
game's own words, for the Sims on the site (31 Oct 2026, overnight, her ask: a trial behind the bottom-right switch).

    python tools/research/ancestors.py      writes site/ancestors/<sim id>.png and data/game/ancestors.json, then rebuild

The portraits are the game's own 48-pixel pictures (DST5 textures in Data/Client, unshuffled to DXT5 and saved as PNG,
nothing else done to them). Matched to the site's Sims by name; the game's three unnamed ancestors ("Unknown") have no
picture or cause. Rerun after a game update.
"""
import glob, io, json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T
from common import ROOT, load
from PIL import Image

DDS = 0x00B2D882
OUT_DIR = os.path.join(ROOT, 'site', 'ancestors')
OUT = os.path.join(ROOT, 'data', 'game', 'ancestors.json')


def text_of(n, d=0):
    """A tuning node as indented text (enough to read the few fields we need)."""
    if not (isinstance(n, (list, tuple)) and len(n) == 3 and isinstance(n[1], dict)): return ['  ' * d + str(n).strip()]
    out = ['  ' * d + n[0] + ' ' + ' '.join(f'{k}={v}' for k, v in n[1].items() if k != 's')]
    for k in n[2]: out += text_of(k, d + 1)
    return out


def dst5_png(b):
    """EA's DST5 (DXT5 with its four block parts stored apart: alpha ends, colour ends, alpha bits, colour bits) as PNG."""
    h, d = bytearray(b[:128]), b[128:]
    assert h[84:88] == b'DST5', bytes(h[84:88])
    n = len(d) // 16; sizes = (2, 4, 6, 4); offs = [0, n * 2, n * 6, n * 12]
    out = bytearray()
    for i in range(n):
        ae, ce, ai, ci = (d[o + s * i:o + s * (i + 1)] for o, s in zip(offs, sizes))
        out += ae + ai + ce + ci
    h[84:88] = b'DXT5'
    buf = io.BytesIO(); Image.open(io.BytesIO(bytes(h) + bytes(out))).save(buf, 'PNG', optimize=True)
    return buf.getvalue()


def main():
    en = s4.english()
    traits, anc = {}, {}
    for p, root in T.trees():
        merged = {}
        if root[2] and root[2][0][0] == 'g' and root[2][0][1].get('s') == 'merged':
            merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]}
        stack = [root]
        while stack:
            x = stack.pop()
            if x[0] == 'I':
                if x[1].get('c') == 'Trait' and 'host' in x[1].get('n', ''): traits[x[1].get('s')] = '\n'.join(text_of(T.resolve(x, merged)))
                if x[1].get('c') == 'TunablePremadeAncestor': anc[x[1]['n']] = '\n'.join(text_of(T.resolve(x, merged)))
            else: stack.extend(k for k in x[2] if isinstance(k, (list, tuple)) and len(k) == 3 and k[2])
    found = {}
    for t in anc.values():
        fn = re.search(r'n=full_name[^\n]*\n[^\n]*\n\s*(0x[0-9A-Fa-f]+)', t)
        name = en.get(int(fn.group(1), 16)) if fn else None
        if not name or name == 'Unknown': continue
        d = re.search(r'n=death_trait[^\n]*\n[^\n]*\n\s*(\d+)', t); death = None
        if d and d.group(1) in traits:
            m = re.search(r'n=display_name[^\n]*\n\s*(0x[0-9A-Fa-f]+)', traits[d.group(1)])
            death = (en.get(int(m.group(1), 16)) or '').replace('Death by ', '') if m else None   # as premades.py does for ghosts
        th = re.search(r'n=thumbnail[^\n]*\n[^\n]*\n\s*[0-9a-f]+:[0-9a-f]+:([0-9a-f]+)', t)
        found[name] = {'death': death, 'thumb': int(th.group(1), 16) if th else None}
    # the site's Sims, by name
    ids = {}
    for f in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json')):
        for h in (load(f).get('households') or {}).values():
            for s in h.get('sims', []):
                if s.get('id'): ids.setdefault(s['name'], s['id'])
    for k, v in load(os.path.join(ROOT, 'data', 'people.json')).items():
        if not k.startswith('_') and not v.get('placeholder'): ids.setdefault(v['name'], k)
    want = {v['thumb']: n for n, v in found.items() if v['thumb'] and n in ids}
    pics = {}
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', '*.package'), recursive=True)):
        if len(pics) == len(want): break
        try: ix = s4.index(p)
        except Exception: continue
        for e in ix:
            if e[0] == DDS and e[2] in want and e[2] not in pics: pics[e[2]] = dst5_png(s4.read(p, e))
    os.makedirs(OUT_DIR, exist_ok=True)
    out = {}
    for name, v in sorted(found.items()):
        if name not in ids: print('not on the site:', name); continue
        sid = ids[name]; rec = {'name': name}
        if v['death']: rec['died'] = v['death']
        if v['thumb'] in pics:
            open(os.path.join(OUT_DIR, sid + '.png'), 'wb').write(pics[v['thumb']]); rec['portrait'] = f'ancestors/{sid}.png'
        out[sid] = rec
    json.dump(out, open(OUT, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    print('wrote', OUT, len(out), 'ancestors,', sum('portrait' in r for r in out.values()), 'portraits')


if __name__ == '__main__':
    main()
