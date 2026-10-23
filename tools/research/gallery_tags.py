"""Her Gallery uploads' world hashtags (23 Oct, after in-game searches like #windenburg missed lots in the new save).
    python tools/research/gallery_tags.py     report: research/gallery-tags.md

For every upload linked to a lot: is the world's own hashtag there (#willowcreek, #oasissprings ...)? Flags close
misspellings (#windenberg), uploads with no world tag at all, and any tagged with another world's name. Report only.
"""
import os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, DATA, load, world_files

def dist(a, b):
    """Edit distance (small strings)."""
    prev = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        cur = [i]
        for j, y in enumerate(b, 1): cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x != y)))
        prev = cur
    return prev[-1]

ups = load(os.path.join(DATA, 'gallery', 'uploads.json'))['uploads']
worlds = [load(p) for p in world_files()]
key = lambda n: re.sub(r'[^a-z]', '', n.lower())
wtags = {key(W['name']): W['name'] for W in worlds}
rows = {'misspelt': [], 'missing': [], 'other': []}
total = 0
for W in worlds:
    want = key(W['name'])
    for h in W['neighbourhoods']:
        for l in h['lots']:
            for i in l.get('gallery', []) + [v['upload'] for v in l.get('versions', [])]:
                u = ups.get(i)
                if not u: continue
                total += 1
                tags = [t.lower() for t in re.findall(r'#(\w+)', u.get('description') or '')]
                if want in tags: continue
                near = [t for t in tags if t != want and dist(t, want) <= 2 and len(t) > 4]
                other = [wtags[t] for t in tags if t in wtags and t != want]
                line = f"| {W['name']} | {u['title']} | {', '.join('#' + t for t in near) or '–'} |"
                if near: rows['misspelt'].append(line)
                elif other: rows['other'].append(f"| {W['name']} | {u['title']} | {', '.join(other)} |")
                else: rows['missing'].append(f"| {W['name']} | {u['title']} | {len(tags)} tags |")
out = ["# Gallery world hashtags (23 Oct)", "",
       f"{total} uploads on the site's lots. In-game search by a world's hashtag only finds those that carry it exactly.", "",
       f"- **Misspelt world tag:** {len(rows['misspelt'])}", f"- **No world tag at all:** {len(rows['missing'])}",
       f"- **Tagged with another world only:** {len(rows['other'])}", "",
       "Search these by name instead (or fix the tag if you ever re-upload).", ""]
for k, head, cols in (('misspelt', 'Misspelt world tag', '| World | Upload | Tag it has |'), ('missing', 'No world tag', '| World | Upload | Tags |'), ('other', "Another world's tag", '| World | Upload | Tagged as |')):
    if rows[k]: out += [f"## {head}", "", cols, "|---|---|---|"] + sorted(rows[k]) + [""]
open(os.path.join(ROOT, 'research', 'gallery-tags.md'), 'w', encoding='utf-8').write("\n".join(out))
print(total, {k: len(v) for k, v in rows.items()})
