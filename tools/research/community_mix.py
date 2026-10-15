"""The mix of community lots in her plan: how many of each type across her owned worlds, and which everyday places
each world is missing. Report only (the write-up with the realistic ranges is research/community-lots-mix.md).

    python tools/research/community_mix.py

Lots with two types ("Park/Cemetery", "Restaurant/Bar") count once for each.
"""
import json, os, re, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, load

CATS = [('Restaurant', r'restaurant|diner'), ('Café', r'caf[eé]|bakery|ice cream|boba|bubble tea'), ('Bar/pub', r'\bbar\b|\bpub\b'),
        ('Nightclub', r'nightclub'), ('Lounge', r'lounge'), ('Karaoke', r'karaoke'), ('Backroom', r'backroom'), ('Library', r'library'),
        ('Museum', r'museum'), ('Arts Center', r'arts? cent'), ('Gym', r'\bgym\b|fitness'), ('Pool', r'\bpool\b'), ('Spa', r'\bspa\b'),
        ('Onsen', r'onsen'), ('Rec Center', r'rec(reation)? cent'), ('Park', r'\bpark\b|national park|campground'), ('Playground', r'playground'),
        ('Beach', r'beach'), ('Cemetery', r'cemetery'), ('Shops', r'retail|thrift|stores?|mall|small business|market'),
        ('Community Space', r'community space|maker|garden'), ('Wedding Venue', r'wedding'), ('Vet', r'\bvet\b'),
        ('Vacation Rental', r'vacation rental'), ('Custom Venue', r'custom venue')]
HOMES = r'^residential|residential rental|apartment|penthouse|university housing|dorm|tiny home|haunted house'
EVERYDAY = ['Restaurant', 'Café', 'Bar/pub', 'Library', 'Park', 'Gym', 'Shops']


def main():
    order = load(os.path.join(ROOT, 'data', 'worlds.json')); order = order['order'] if isinstance(order, dict) else order
    total, per_world = collections.Counter(), {}
    for ws in order:
        W = load(os.path.join(ROOT, 'data', 'worlds', ws + '.json'))
        if not W['owned']: continue
        have = collections.Counter()
        for h in W['neighbourhoods']:
            for l in h['lots']:
                t = l.get('type') or 'To be decided'
                if re.search(HOMES, t, re.I): continue
                for c, pat in CATS:
                    if re.search(pat, t, re.I): total[c] += 1; have[c] += 1
        per_world[W['name']] = have
    return total, per_world


if __name__ == '__main__':
    total, per_world = main()
    print('| Type | Lots | Worlds with one |\n|---|---|---|')
    for c, _ in CATS: print(f"| {c} | {total[c]} | {sum(1 for w in per_world.values() if w[c])} |")
    print('\n| World | ' + ' | '.join(EVERYDAY) + ' |\n|---|' + '---|' * len(EVERYDAY))
    for w, have in per_world.items(): print(f"| {w} | " + ' | '.join(str(have[c]) if have[c] else '–' for c in EVERYDAY) + ' |')
