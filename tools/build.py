"""Build the site's data file: data/ -> site/js/data.js.

    python tools/build.py

The page itself (site/index.html, css/, js/app.js) is hand-written and never generated; this only refreshes
the data it shows. Pictures are read from site/shots (Jemma's screenshots) and site/gallery (Gallery pictures).
"""
import os, re, sys, urllib.parse
from datetime import date
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import DATA, SITE, GALLERY, slug, load, nice_date, world_files

GALLERY_ITEM = "https://www.ea.com/games/the-sims/the-sims-4/gallery/item/"


# ---------- the plan's Residents column ----------
def residents(who):
    """Split the Residents column into a household name, an 'unsure' flag, or a note about the lot."""
    if who in (None, "N/A") or not str(who).strip(): return None, False, ""
    w = str(who).strip()
    if w.lower() == "empty": return None, False, "Empty"
    if re.search(r'\bbed(room)?s?\b', w, re.I) and not re.search(r'[a-z]{4,}\s*&', w, re.I): return None, False, w     # e.g. "2 Bed", "Large 3 Bedroom"
    if w.startswith("("): return None, False, w.strip("()")
    w = re.sub(r'\s*\(own\)', ' own', w, flags=re.I)   # "Cahyaputri (own)": the family owns this rental, so "(own)" is kept
    unsure = "?" in w
    name = re.sub(r'\*[^*]*\*|\([^)]*\)|\+$', '', w)   # planning marks like *WithUpdates*, (move!), (*NPC), trailing +
    name = re.sub(r'\?+', '', name).strip()
    if not name: return None, True, "To be decided"
    return name, unsure, ""


# ---------- Sims 4 Gallery ----------
uploads = load(os.path.join(GALLERY, 'uploads.json'))['uploads']
comments = load(os.path.join(GALLERY, 'comments.json'))['comments']
fixes = load(os.path.join(GALLERY, 'text-fixes.json'))['fixes']

def short_pack(p): return re.sub(r'\s+(Expansion Pack|Game Pack|Stuff Pack|Kit)$', '', p.replace('The Sims™ 4 ', '')).strip()
def clean_title(t): return re.sub(r'\s*\[[^\]]*\]\s*$', '', t).strip()     # "Kin-Ship [Simsie Shell]" -> "Kin-Ship"

def upload_entry(i):
    u = uploads[i]; desc = u['description'] or ''; k = desc.find('#')
    text = re.sub(r'\s+', ' ', desc[:k] if k >= 0 else desc).strip().replace("''", "'")
    for a, b in fixes.get(i, {}).get('description', []): text = text.replace(a, b)
    cl = comments.get(i, [])
    return {"url": GALLERY_ITEM + urllib.parse.quote(i, safe=''), "title": clean_title(u['title']), "description": text,
            "tags": re.findall(r'#(\w+)', desc), "packs": [short_pack(p) for p in u['packs']], "value": f"§{u['price']:,}",
            "likes": u['favourites'], "downloads": u['downloads'], "comments": len(cl), "commentList": cl,
            "beds": u['beds'], "baths": u['baths'], "lotType": u['lotType'], "checked": nice_date(u['checked'])}

VERSION_END = r'(Market|Gardens?|Makers|Space)$'
def version_label(e):
    m = re.search(VERSION_END, e['title']); x = m.group(1) if m else 'Space'
    return {'Space': 'Community space', 'Gardens': 'Garden'}.get(x, x)

def gallery_for(lot):
    """The Gallery card for a lot: its most popular upload, with every copy's comments added together.
    Residential rentals uploaded twice lead with the rental; Community Space lots lead with the plain version."""
    ups = [upload_entry(i) for i in lot.get('gallery', [])]
    if not ups: return None
    g = None
    for e in ups:
        if g is None or e['likes'] + e['downloads'] > g['likes'] + g['downloads']: g = e
    if len(ups) > 1:
        main = None
        if lot.get('versions'):
            main = next((e for e in ups if not re.search(r'\b' + VERSION_END, e['title'])), None) or next(e for e in ups if e['title'].endswith('Space'))
            label = version_label
        elif any(e['lotType'] == 'Residential Rental' for e in ups):
            main = max((e for e in ups if e['lotType'] == 'Residential Rental'), key=lambda e: e['likes'] + e['downloads'])
            label = lambda e: e['lotType'] or 'Other version'
        if main:
            main = dict(main, label=label(main))
            main['others'] = [{"title": e['title'], "url": e['url'], "likes": e['likes'], "downloads": e['downloads'], "label": label(e)} for e in ups if e['url'] != main['url']]
            g = main
    # apartments were uploaded as Rooms, which carry no bed/bath counts: those come from the plan
    if lot.get('beds') and not g.get('beds'): g['beds'] = lot['beds']; g['baths'] = lot.get('baths') or 0
    allc = [c for e in ups for c in e['commentList']]
    g['commentList'] = sorted(allc, key=lambda c: -c['t']); g['comments'] = len(allc)
    if lot.get('galleryOld'): g['old'] = True
    return g


# ---------- pictures ----------
EXTERIOR = ['front', 'outside', 'side', 'angle', 'back', 'rear', 'aerial', 'exterior', 'garden', 'entrance']

def photos_for(ws, ls):
    """Jemma's screenshots (site/shots/<world>/<lot>/), exterior shots first and floor plans last; else the lot's Gallery picture."""
    dd = os.path.join(SITE, 'shots', ws, ls)
    if not os.path.isdir(dd):
        cover = f"gallery/{ws}/{ls}.jpg"
        return [{"src": cover, "thumb": cover, "caption": "From the Gallery", "gallery": True}] if os.path.exists(os.path.join(SITE, cover)) else []
    fs = [f for f in os.listdir(dd) if f.endswith('.jpg') and not f.endswith('.thumb.jpg')]
    def key(f):
        n = f[:-4]; i = next((k for k, w in enumerate(EXTERIOR) if w in n), 99)
        return (1 if 'floor' in n else 0, i, n)
    return [{"src": f"shots/{ws}/{ls}/{f}", "thumb": f"shots/{ws}/{ls}/{f[:-4]}.thumb.jpg", "caption": re.sub(r'\bi\b', 'I', f[:-4].replace('-', ' ')).title()}
            for f in sorted(fs, key=key)]

def version_photos(ws, ls, label):
    """Community Space version pictures: site/gallery/<world>/<lot>/<version>-<n>.jpg, in number order."""
    d, pre = os.path.join(SITE, 'gallery', ws, ls), slug(label) + '-'
    fs = sorted((f for f in os.listdir(d) if f.startswith(pre) and f[len(pre):-4].isdigit()), key=lambda f: int(f[len(pre):-4])) if os.path.isdir(d) else []
    return [{"src": f"gallery/{ws}/{ls}/{f}", "thumb": f"gallery/{ws}/{ls}/{f}", "caption": f"{label} · from the Gallery", "gallery": True} for f in fs]


# ---------- assemble ----------
def build():
    out, stats, households = [], [], {}
    family_links, tenants, name_fix, nb_pt, cs_versions = {}, {}, {}, {}, {}
    for wf in world_files():
        W = load(wf); n, ws, owned = W['name'], slug(W['name']), W['owned']
        w = {"name": n, "pack": W['pack'], "owned": owned, "color": W['colour'], "deep": W.get('deep'), "ready": owned,
             "map": f"maps/{ws}.jpg" if owned and os.path.exists(os.path.join(SITE, 'maps', ws + '.jpg')) else "",
             "thumb": f"maps/{ws}.thumb.jpg" if os.path.exists(os.path.join(SITE, 'maps', ws + '.thumb.jpg')) else "",
             "blurb": W.get('blurb', ''), "hoods": []}
        if W.get('glow'): w["glow"] = W['glow']
        for hood in W['neighbourhoods']:
            lots = []
            if hood.get('mapSpot'): nb_pt.setdefault(ws, {})[hood['name']] = hood['mapSpot']
            for l in hood['lots']:
                name, unsure, note = residents(l['residents'])
                who = name or note or None
                if name and l.get('tenants'): who = f"{name} (owners) + " + ", ".join(f"{t['name']} (tenant)" for t in l['tenants'])
                stats.append({"w": n, "n": hood['name'], "lot": l['lot'], "mine": l['myName'], "type": l['type'], "size": l['size'],
                              "built": l['built'], "shared": l['shared'], "sims": l['simsMade'], "who": l.get('statsResidents') or who})
                key = n + '|' + l['lot']
                if l.get('displayName'): name_fix[key] = l['displayName']
                if l.get('tenants'): tenants[key] = l['tenants']
                if not owned: continue
                g = gallery_for(l)
                if l.get('versions') and g:
                    vs = []
                    for v in l['versions']:
                        e = upload_entry(v['upload'])
                        vs.append({"label": v['label'], "title": e['title'], "url": e['url'], "likes": e['likes'], "downloads": e['downloads'], "value": e['value'],
                                   "packs": e['packs'], "description": e['description'], "tags": e['tags'], "photos": version_photos(ws, slug(l['lot']), v['label'])})
                    cs_versions[key] = vs
                lots.append({"lot": l['lot'], "mine": l['myName'], "type": l['type'], "size": l['size'],
                             "who": (name + ("?" if unsure else "")) if name else None, "whoNote": note,
                             "built": l['built'], "shared": l['shared'], "sims": l['simsMade'],
                             "gallery": g, "photos": photos_for(ws, slug(l['lot']))})
            if owned: w["hoods"].append({"name": hood['name'], "desc": hood.get('desc', ''), "color": W['colour'], "lots": lots})
        if W.get('households'): households[n] = W['households']
        if W.get('familyLinks'): family_links[n] = W['familyLinks']
        out.append(w)
    checked = max((u['checked'] for u in uploads.values()), default=None)
    return {"worlds": out, "households": households, "stats": stats,
            "familyLinks": family_links, "tenants": tenants, "nameFix": name_fix, "nbPt": nb_pt, "csVersions": cs_versions,
            "meta": {"built": date.today().isoformat(), "galleryChecked": checked}}


def missing_pictures(data):
    """Every picture path the site will ask for, that isn't in site/."""
    found = set()
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('src', 'thumb', 'map') and isinstance(v, str) and v: found.add(v)
                else: walk(v)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(data)
    return sorted(p for p in found if not os.path.exists(os.path.join(SITE, p)))


def write(data):
    import json
    p = os.path.join(SITE, 'js', 'data.js')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write("// Built by tools/build.py from the data/ folder. Don't edit this file: change data/ and run the build again.\n")
        f.write("const DATA = " + json.dumps(data, ensure_ascii=False) + ";\n")
    return p


if __name__ == '__main__':
    d = build()
    gone = missing_pictures(d)
    if gone: sys.exit("Pictures missing from site/: " + ", ".join(gone[:10]) + (" …" if len(gone) > 10 else ""))
    p = write(d)
    lots = sum(len(h['lots']) for w in d['worlds'] for h in w['hoods'])
    print(f"Wrote {os.path.relpath(p)}: {len(d['worlds'])} worlds, {lots} lots on the site, {len(d['stats'])} in the plan, "
          f"{sum(1 for w in d['worlds'] for h in w['hoods'] for l in h['lots'] if l['gallery'])} with Gallery uploads")
