"""Which lot types (venues) the game lets each world use, read from the game's region tuning (read only).

    python tools/research/world_lot_types.py

Each world's Region instance lists its compatible venues. Writes research/data/world-lot-types.json with, per world,
the lot types allowed and the ones not allowed (e.g. Beach is only allowed in Sulani and Tartosa).
"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import tuning
from common import ROOT, load
from world_extras import REGION_WORLD, world_of_region


def ids(node, out):
    if node[0] == 'T' and node[2] and not node[2][0][2]: out.append(node[2][0][0])
    for k in node[2]: ids(k, out)


def main():
    venues = load(os.path.join(ROOT, 'research', 'data', 'game-venues.json'))['venues']
    t = tuning.Tuning({'Region'})
    out = {}
    for i, r in t.inst.items():
        wn = world_of_region(r['name'])
        if not wn or 'Debug' in r['name'] or wn in out: continue
        allowed = []
        for c in [k for k in r['tree'][2] if k[1].get('n') == 'compatible_venues']: ids(c, allowed)
        names = sorted({venues[v]['name'] for v in allowed if v in venues})
        every = sorted({v['name'] for v in venues.values()})
        out[wn] = {"region": r['name'], "allowed": names, "not allowed": [n for n in every if n not in names]}
    with open(os.path.join(ROOT, 'research', 'data', 'world-lot-types.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump({"_note": "Lot types each world allows, from the game's region tuning (compatible_venues). From tools/research/world_lot_types.py.",
                   "worlds": dict(sorted(out.items()))}, f, ensure_ascii=False, indent=1)
    return out


if __name__ == '__main__':
    for w, v in sorted(main().items()): print(f"{w}: {len(v['allowed'])} allowed")
