"""Household and Sim pictures from her Library, as stand-ins until she has her own screenshots (her call, 19 Oct: "pull gallery sim
pics same as placeholders for lots I don't have pics of").

    python tools/library_pictures.py           report which households and Sims would get a picture (changes nothing)
    python tools/library_pictures.py --apply   write the pictures to site/library/ and data/library-pictures.json, then rebuild

Only her own Library households are used (made by JemmaTheSimmer, or saved without a creator); downloads by other creators are
never used. A household's picture comes from the Library copy whose Sims match it best (then the newest); a Sim's from that copy,
or else the newest copy holding a Sim of the same full name. Her own screenshots (`portrait` in data/) always win; the site only
shows these where there is no portrait. Library files are read from temporary copies (tray_pictures.read).
"""
import glob, json, os, re, struct, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
import tray_pictures as tp
from common import ROOT, load, save

S = s4.save_schema(); N = '.EA.Sims4.Network.'
TRAY = os.path.join(os.path.dirname(s4.SAVES), 'Tray')
OUT = os.path.join(ROOT, 'site', 'library'); MAP = os.path.join(ROOT, 'data', 'library-pictures.json')
MINE = {'JemmaTheSimmer', ''}
norm = lambda x: re.sub(r'[^a-z]', '', (x or '').lower())
slug = lambda x: re.sub(r'[^a-z0-9]+', '-', (x or '').lower()).strip('-')
LOW = (1 << 56) - 1   # a Sim picture's instance is the household's with the top byte changed and the Sim's number added


def library():
    """Her own Library households: [{stem, mtime, creator, family, sims: [name], hhi: path, sgi: {index: path}}]."""
    pics = {}
    for f in glob.glob(os.path.join(TRAY, '*.sgi')):
        t, inst = os.path.basename(f).split('.')[0].split('!')
        n = int(t, 16) >> 4; pics[((int(inst, 16) & LOW) - n, n)] = f
    out = []
    for f in glob.glob(os.path.join(TRAY, '*.householdbinary')):
        stem = os.path.basename(f).split('!')[1].split('.')[0]
        b = open(f, 'rb').read(); ver, ln = struct.unpack_from('<II', b, 0)   # small file, read only
        body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
        fa = s4.decode(body, N + 'FamilyData', S, depth=3).get('family_account', {})
        creator = fa.get('original_creator_string') or ''
        if creator not in MINE: continue
        sims = [(s.get('first_name', '') + ' ' + s.get('last_name', '')).strip() for s in fa.get('sim', [])]
        hhi = sorted(glob.glob(os.path.join(TRAY, '*!' + stem + '.hhi')))
        base = int(stem, 16) & LOW
        out.append({'stem': stem, 'mtime': os.path.getmtime(f), 'creator': creator, 'family': fa.get('familyname') or '', 'sims': sims,
                    'hhi': hhi[-1] if hhi else None, 'sgi': {i: pics[(base, i + 1)] for i in range(len(sims)) if (base, i + 1) in pics}})
    return out


def site_households():
    for wf in sorted(glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))):
        W = load(wf)
        for name, h in (W.get('households') or {}).items():
            yield os.path.basename(wf)[:-5], name, h


def main(apply):
    lib = library(); old = load(MAP) if os.path.exists(MAP) else {}
    plan = {'households': {}, 'sims': {}}; rows = []
    by_name = {}
    for c in lib:
        for i, n in enumerate(c['sims']):
            if i in c['sgi']: by_name.setdefault(norm(n), []).append((c['mtime'], c['sgi'][i]))
    for world, name, h in site_households():
        sims = [s for s in h.get('sims', []) if s.get('name')]
        if not sims: continue
        want = {norm(s['name']) for s in sims}
        best = max(((len(want & {norm(n) for n in c['sims']}) / len(want | {norm(n) for n in c['sims']}), c['mtime'], c) for c in lib
                    if want & {norm(n) for n in c['sims']}), default=None, key=lambda x: x[:2])
        got = []
        if best and best[0] >= 0.5 and best[2]['hhi'] and not h.get('portrait'):
            plan['households'][world + '|' + name] = (best[2]['hhi'], f"library/{world}/{slug(name)}.webp")
            got.append('household')
        for s in sims:
            sid = s.get('id')
            if not sid or s.get('portrait'): continue
            src = None
            if best and best[0] >= 0.5:
                c = best[2]; i = next((i for i, n in enumerate(c['sims']) if norm(n) == norm(s['name'])), None)
                src = c['sgi'].get(i) if i is not None else None
            if not src and by_name.get(norm(s['name'])): src = max(by_name[norm(s['name'])])[1]
            if src: plan['sims'][sid] = (src, f"library/sims/{sid}.webp"); got.append(s['name'].split()[0])
        if got: rows.append(f"{world:22} {name:28} {', '.join(got)}")
    print('\n'.join(rows))
    print(f"\n{len(plan['households'])} household pictures, {len(plan['sims'])} Sim pictures (from {len(lib)} of her Library households)")
    if not apply: return
    done = {'households': {}, 'sims': {}}
    for kind, items in plan.items():
        for key, (src, rel) in items.items():
            dest = os.path.join(ROOT, 'site', rel); os.makedirs(os.path.dirname(dest), exist_ok=True)
            im = tp.read(src); box = im.split()[3].getbbox()
            if box: im = im.crop(box)
            if kind == 'sims' and im.height > 520: im = im.resize((round(im.width * 520 / im.height), 520))
            im.save(dest, 'WEBP', quality=86, method=6)
            done[kind][key] = rel
    save(MAP, done)
    subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
