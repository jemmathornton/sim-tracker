"""Gallery deep dive: what does best on her Gallery (worlds, lot types, sizes, packs, age, hashtags), what's growing
between the weekly checks, and her comments in one place.

    python tools/research/gallery_deep_dive.py

Reads data/gallery/ (uploads, history, comments) and data/worlds (which lot each upload is on). Report only;
writes research/data/gallery-deep-dive.json.
"""
import base64, csv, json, os, re, statistics, sys, uuid, collections
from datetime import datetime, timedelta, timezone
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, GALLERY, load, world_files


def year_shared(i):
    try: u = uuid.UUID(bytes=base64.b64decode(i))
    except Exception: return None
    if u.version != 1: return None
    return (datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)).year


def group(rows, key):
    g = collections.defaultdict(list)
    for r in rows: g[key(r)].append(r)
    out = []
    for k, rs in g.items():
        d = [r['downloads'] for r in rs]; f = [r['favourites'] for r in rs]
        out.append({"group": k, "uploads": len(rs), "downloads": sum(d), "favourites": sum(f),
                    "median downloads": statistics.median(d), "favourites per 100 downloads": round(100 * sum(f) / max(1, sum(d)), 1)})
    return sorted(out, key=lambda x: -x['median downloads'])


def main():
    up = load(os.path.join(GALLERY, 'uploads.json'))['uploads']
    com = load(os.path.join(GALLERY, 'comments.json'))['comments']
    where = {}
    for wf in world_files():
        W = load(wf)
        for h in W['neighbourhoods']:
            for l in h['lots']:
                for i in l.get('gallery') or []: where[i] = (W['name'], l.get('displayName') or l.get('myName') or l['lot'])
    rows = []
    for i, u in up.items():
        tags = [t.lower() for t in re.findall(r'#(\w+)', u['description'] or '')]
        rows.append({**u, "id": i, "world": where.get(i, (None,))[0] or "(not on a lot)", "year": year_shared(i), "tags": tags,
                     "packs n": len(u.get('packs') or []), "comments n": len(com.get(i, []))})
    lots = [r for r in rows if r['kind'] == 'lot']
    packs_band = lambda r: "base game only" if r['packs n'] == 0 else "1–3 packs" if r['packs n'] <= 3 else "4–7 packs" if r['packs n'] <= 7 else "8 or more packs"
    size_band = lambda r: r['size'] if r['size'] in ('20x15', '20x20', '30x20', '30x30', '40x30', '40x40', '50x50', '64x64') else (r['size'] or '?')
    # history: first and last check
    hist = collections.defaultdict(dict)
    with open(os.path.join(GALLERY, 'history.csv'), encoding='utf-8') as f:
        for r in csv.DictReader(f): hist[r['id']][r['date']] = (int(r['favourites']), int(r['downloads']))
    dates = sorted({d for h in hist.values() for d in h})
    first, last = dates[0], dates[-1]
    gains = []
    for i, h in hist.items():
        if first in h and last in h and i in up:
            gains.append({"title": up[i]['title'], "world": where.get(i, ("",))[0], "downloads gained": h[last][1] - h[first][1], "favourites gained": h[last][0] - h[first][0]})
    gains.sort(key=lambda g: (-g['downloads gained'], -g['favourites gained']))
    tag_count = collections.Counter(t for r in lots for t in set(r['tags']))
    tag_effect = []
    for t, n in tag_count.most_common(40):
        if n < 8 or n > len(lots) - 8: continue
        with_t = [r['downloads'] for r in lots if t in r['tags']]; without = [r['downloads'] for r in lots if t not in r['tags']]
        tag_effect.append({"tag": t, "uploads": n, "median downloads with": statistics.median(with_t), "without": statistics.median(without)})
    out = {
        "totals": {k: {"uploads": len(v), "downloads": sum(r['downloads'] for r in v), "favourites": sum(r['favourites'] for r in v)} for k, v in group_kind(rows).items()},
        "top downloads": [{"title": r['title'], "world": r['world'], "downloads": r['downloads'], "favourites": r['favourites']} for r in sorted(rows, key=lambda r: -r['downloads'])[:12]],
        "top favourites": [{"title": r['title'], "world": r['world'], "favourites": r['favourites'], "downloads": r['downloads']} for r in sorted(rows, key=lambda r: -r['favourites'])[:12]],
        "most loved (favourites per 100 downloads, 50+ downloads)": [{"title": r['title'], "world": r['world'], "rate": round(100 * r['favourites'] / r['downloads'], 1), "downloads": r['downloads']}
                                                                    for r in sorted([r for r in rows if r['downloads'] >= 50], key=lambda r: -r['favourites'] / r['downloads'])[:10]],
        "by world": group(lots, lambda r: r['world']),
        "by lot type": [g for g in group(lots, lambda r: r['lotType'] or '?') if g['uploads'] >= 3],
        "by size": group(lots, size_band),
        "by packs needed": group(lots, packs_band),
        "by year shared": sorted(group(lots, lambda r: r['year'] or 'from 2023 (no date)'), key=lambda g: str(g['group'])),
        "hashtags": tag_effect,
        "growth": {"from": first, "to": last, "downloads gained": sum(g['downloads gained'] for g in gains), "favourites gained": sum(g['favourites gained'] for g in gains), "top": gains[:12]},
        "comments": {"total": sum(len(v) for v in com.values()), "uploads with comments": sum(1 for v in com.values() if v),
                     "by upload": sorted([{"title": up[i]['title'], "n": len(v)} for i, v in com.items() if v and i in up], key=lambda x: -x['n'])[:10],
                     "years": collections.Counter(datetime.fromtimestamp(c["t"] / 1000, timezone.utc).year for v in com.values() for c in v if c.get('t'))},
        "credited to others": [{"title": r['title'], "creator": r['creator']} for r in rows if r.get('creator') and r['creator'] != 'JemmaTheSimmer'],
    }
    with open(os.path.join(ROOT, 'research', 'data', 'gallery-deep-dive.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=1, default=str)
    return out


def group_kind(rows):
    g = collections.defaultdict(list)
    for r in rows: g[r['kind']].append(r)
    return g


if __name__ == '__main__':
    o = main()
    for k, v in o.items():
        print(f"\n## {k}")
        if isinstance(v, list):
            for x in v: print('  ', x)
        else: print('  ', json.dumps(v, ensure_ascii=False, default=str)[:1500])
