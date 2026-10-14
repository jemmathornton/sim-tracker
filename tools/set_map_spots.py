"""Put Jemma's neighbourhood map spots into the world files, from the answers tools/map-squares.html copies.

    python tools/set_map_spots.py answers.txt      (or paste the answers in when it asks)

One line per world, as the page writes them:
    Oasis Springs: Bedrock Strait C3 (0.31, 0.45) [0.25, 0.38, 0.37, 0.52]; Parched Prospect E4
A square on its own (no numbers) goes in at the middle of that square. The spots end up as mapSpot in
data/worlds/<world>.json, and a box she drew around the neighbourhood (left, top, right, bottom) as mapBox: its card
zooms to fit the box. Run tools/build.py afterwards to show them on the neighbourhood cards.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import DATA, slug, load, save

COLS = "ABCDEFGH"
ITEM = re.compile(r'^(?P<name>.+?)\s+(?P<sq>[A-H][1-6])(?:\s*\(\s*(?P<x>[\d.]+)\s*,\s*(?P<y>[\d.]+)\s*\))?(?:\s*\[(?P<box>[\d.,\s]+)\])?$', re.I)


def spot(m):
    if m['x'] is not None: return [round(float(m['x']), 2), round(float(m['y']), 2)]
    sq = m['sq'].upper()
    return [round((COLS.index(sq[0]) + .5) / 8, 2), round((int(sq[1]) - .5) / 6, 2)]


def main(text):
    changed, problems = [], []
    for line in text.splitlines():
        if ':' not in line: continue
        world, rest = (s.strip() for s in line.split(':', 1))
        p = os.path.join(DATA, 'worlds', slug(world) + '.json')
        if not os.path.exists(p): problems.append(f"No world called {world}"); continue
        W = load(p); hoods = {h['name']: h for h in W['neighbourhoods']}
        for item in filter(None, (s.strip() for s in rest.split(';'))):
            m = ITEM.match(item)
            if not m: problems.append(f"{world}: couldn't read “{item}”"); continue
            h = hoods.get(m['name'].strip())
            if not h: problems.append(f"{world}: no neighbourhood called {m['name'].strip()}"); continue
            # keep the key order the other neighbourhoods use: name, desc, mapSpot, mapBox, lots
            new = spot(m); box = [round(float(v), 2) for v in m['box'].split(',')] if m['box'] else None
            if box is not None and len(box) != 4: problems.append(f"{world}: couldn't read the box for {h['name']}"); continue
            if h.get('mapSpot') == new and h.get('mapBox') == box: continue
            items = [(k, v) for k, v in h.items() if k not in ('mapSpot', 'mapBox')]
            k = next((n for n, (key, _) in enumerate(items) if key == 'lots'), len(items))
            h.clear(); h.update(items[:k] + [('mapSpot', new)] + ([('mapBox', box)] if box else []) + items[k:])
            changed.append(f"{world} / {h['name']}: {m['sq'].upper()} {new}" + (f" box {box}" if box else ""))
        save(p, W)
    return changed, problems


if __name__ == '__main__':
    if len(sys.argv) > 1: text = open(sys.argv[1], encoding='utf-8').read()
    else: print("Paste the answers, then an empty line:"); text = '\n'.join(iter(input, ''))
    changed, problems = main(text)
    print('\n'.join(changed) or "No spots changed.")
    if problems: print("\nNot done:\n" + '\n'.join(problems))
