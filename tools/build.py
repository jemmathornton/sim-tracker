"""Build the site's data file: data/ -> site/js/data.js.

    python tools/build.py

The page itself (site/index.html, css/, js/app.js) is hand-written and never generated; this only refreshes
the data it shows. Pictures are read from site/shots (Jemma's screenshots) and site/gallery (Gallery pictures).
"""
import base64, html, os, re, sys, urllib.parse, uuid
from datetime import date, datetime, timedelta
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import DATA, SITE, GALLERY, slug, load, nice_date, world_files

GALLERY_ITEM = "https://www.ea.com/games/the-sims/the-sims-4/gallery/item/"


# ---------- the plan's Residents column ----------

def map_width(ws):
    """The map picture's width in pixels: neighbourhood banners zoom in only as far as it stays sharp."""
    f = os.path.join(SITE, 'maps', ws + '.jpg')
    if not os.path.exists(f): return 0
    from PIL import Image
    with Image.open(f) as im: return im.size[0]


def stamped(rel):
    """A picture's path with a fingerprint, so a browser never shows an old copy after the picture changes (maps, 16 Oct)."""
    import hashlib
    return f"{rel}?v={hashlib.md5(open(os.path.join(SITE, rel), 'rb').read()).hexdigest()[:8]}"

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

MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()   # short, as dates are shown elsewhere on the site
def shared_on(i):
    """The month an upload went on the Gallery. Ids from 2016 to early 2023 are time-based UUIDs with the upload time inside; newer ids are random, so no date."""
    u = uuid.UUID(bytes=base64.b64decode(i))
    if u.version != 1: return None
    d = datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)
    return f"{MONTHS[d.month - 1]} {d.year}"

def upload_entry(i):
    u = uploads[i]; desc = u['description'] or ''; k = desc.find('#')
    text = re.sub(r'\s+', ' ', desc[:k] if k >= 0 else desc).strip().replace("''", "'")
    for a, b in fixes.get(i, {}).get('description', []): text = text.replace(a, b)
    # EA sends some comment text HTML-escaped ("&lt;3"); the page escapes text itself, so turn it back into plain text first
    cl = [dict(c, m=html.unescape(c.get('m') or '')) for c in comments.get(i, [])]
    return {"url": GALLERY_ITEM + urllib.parse.quote(i, safe=''), "title": clean_title(u['title']), "description": text,
            "tags": re.findall(r'#(\w+)', desc), "packs": [short_pack(p) for p in u['packs']], "value": f"§{u['price']:,}",
            "likes": u['favourites'], "downloads": u['downloads'], "comments": len(cl), "commentList": cl,
            "beds": u['beds'], "baths": u['baths'], "lotType": u['lotType'], "checked": nice_date(u['checked']), "shared": shared_on(i)}

VERSION_END = r'(Market|Gardens?|Makers|Space)$'
def version_label(e):
    m = re.search(VERSION_END, e['title']); x = m.group(1) if m else 'Space'
    return {'Space': 'Community space', 'Gardens': 'Garden'}.get(x, x)

def gallery_for(lot):
    """The Gallery card for a lot. Jemma's rule (13 Oct): one upload per lot, the latest, unless the copies are versions she
    keeps on purpose: Community Space variants (tabs), rental + regular versions and `galleryVariants` lots (listed as
    "Other versions"). Lots still waiting for her choice show their most popular copy. Comments of all linked copies add up."""
    ups = [upload_entry(i) for i in lot.get('gallery', [])]
    if not ups: return None
    g = None
    for e in ups:
        if g is None or e['likes'] + e['downloads'] > g['likes'] + g['downloads']: g = e
    if lot.get('galleryLead') in lot['gallery']: g = ups[lot['gallery'].index(lot['galleryLead'])]   # the copy Jemma chose to lead
    if len(ups) > 1:
        main = None
        if lot.get('versions'):
            main = next((e for e in ups if not re.search(r'\b' + VERSION_END, e['title'])), None) or next(e for e in ups if e['title'].endswith('Space'))
            label = version_label
        elif lot.get('galleryVariants') or any(e['lotType'] == 'Residential Rental' for e in ups):
            # versions Jemma keeps on purpose (a rental and a regular version, a B&B as café and as home): the one matching
            # the lot type in her plan leads, then the rental, and the others are listed under "Other versions"
            plan = [t.strip() for t in re.sub(r'\s*\([^)]*\)', '', lot.get('type') or '').split('/')]
            pick = [e for e in ups if e['lotType'] in plan] or [e for e in ups if e['lotType'] == 'Residential Rental'] or ups
            main = max(pick, key=lambda e: e['likes'] + e['downloads'])
            if lot.get('galleryLead') in lot['gallery']: main = ups[lot['gallery'].index(lot['galleryLead'])]   # her choice wins
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

def photos_for(ws, ls, has_upload):
    """Jemma's screenshots (site/shots/<world>/<lot>/), exterior shots first and floor plans last; else the lot's Gallery
    picture, but only while the lot has a Gallery upload (a picture left behind after an upload moves never shows)."""
    dd = os.path.join(SITE, 'shots', ws, ls)
    if not os.path.isdir(dd):
        cover = f"gallery/{ws}/{ls}.jpg"
        return [{"src": cover, "thumb": cover, "caption": "From the Gallery", "gallery": True}] if has_upload and os.path.exists(os.path.join(SITE, cover)) else []
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


# ---------- Gallery numbers over time (data/gallery/history.csv, one row per upload per refresh) ----------
def gallery_history(lot_of):
    """Totals per weekly refresh (newest first), and the builds that gained most since the refresh before.
    Only full refreshes count (the 12 Oct rows were a handful of uploads added by hand)."""
    snaps = {}
    for row in open(os.path.join(GALLERY, 'history.csv'), encoding='utf-8').read().splitlines()[1:]:
        if not row: continue
        d, i, fav, dl, com = row.split(','); snaps.setdefault(d, {})[i] = (int(fav), int(dl), int(com))
    biggest = max((len(s) for s in snaps.values()), default=0)
    days = sorted((d for d, s in snaps.items() if len(s) >= .8 * biggest), reverse=True)
    def gain(a, b):   # a = later snapshot, b = earlier: summed over uploads present in both
        both = [i for i in a if i in b]
        return [sum(a[i][k] - b[i][k] for i in both) for k in range(3)]
    dates = []
    for n, d in enumerate(days):
        s = snaps[d]; e = {"date": nice_date(d), "uploads": len(s), "favourites": sum(v[0] for v in s.values()),
                           "downloads": sum(v[1] for v in s.values()), "comments": sum(v[2] for v in s.values())}
        if n + 1 < len(days): e["gain"] = dict(zip(("favourites", "downloads", "comments"), gain(s, snaps[days[n + 1]])))
        dates.append(e)
    gains = []
    if len(days) > 1:
        a, b = snaps[days[0]], snaps[days[1]]
        for i in a:
            if i not in b or i not in uploads: continue
            g = [a[i][k] - b[i][k] for k in range(3)]
            if g[0] > 0 or g[1] > 0:
                gains.append({"title": clean_title(uploads[i]['title']), "url": GALLERY_ITEM + urllib.parse.quote(i, safe=''), "lot": lot_of.get(i),
                              "favourites": g[0], "downloads": g[1], "comments": g[2], "nowFavourites": a[i][0], "nowDownloads": a[i][1]})
        gains.sort(key=lambda x: (-x['downloads'], -x['favourites'], x['title']))
    return {"dates": dates, "since": nice_date(days[1]) if len(days) > 1 else None, "gains": gains[:10]}


# ---------- assemble ----------
def build():
    out, stats, households = [], [], {}
    no_landlord = []
    family_links, tenants, name_fix, nb_pt, nb_box, nb_centred, nb_zoom, cs_versions = {}, {}, {}, {}, {}, {}, {}, {}
    lot_of = {}   # Gallery id -> the lot page it belongs to
    for wf in world_files():
        W = load(wf); n, ws, owned = W['name'], slug(W['name']), W['owned']
        w = {"name": n, "pack": W['pack'], "owned": owned, "color": W['colour'], "deep": W.get('deep'), "ready": owned,
             "map": stamped(f"maps/{ws}.jpg") if owned and os.path.exists(os.path.join(SITE, 'maps', ws + '.jpg')) else "",
             "mapW": map_width(ws),
             "thumb": stamped(f"maps/{ws}.thumb.jpg") if os.path.exists(os.path.join(SITE, 'maps', ws + '.thumb.jpg')) else "",
             "blurb": W.get('blurb', ''), "hoods": []}
        if W.get('glow'): w["glow"] = W['glow']
        w.update({k: W[k] for k in ("weather", "highlights") if W.get(k)})   # from the game (tools/research/world_extras.py --apply)
        for hood in W['neighbourhoods']:
            lots = []
            if hood.get('mapSpot'): nb_pt.setdefault(ws, {})[hood['name']] = hood['mapSpot']
            if hood.get('mapBox'): nb_box.setdefault(ws, {})[hood['name']] = hood['mapBox']
            if hood.get('mapCentred'): nb_centred.setdefault(ws, []).append(hood['name'])   # card stays centred on its box (her choice)
            if hood.get('mapZoom'): nb_zoom.setdefault(ws, {})[hood['name']] = hood['mapZoom']   # card zoomed in closer than its box (her choice)
            for l in hood['lots']:
                name, unsure, note = residents(l['residents'])
                who = name or note or None
                if name and l.get('tenants'): who = f"{name} ({'tenant' if l.get('noLandlord') else 'owners'}) + " + ", ".join(f"{t['name']} (tenant)" for t in l['tenants'])
                stats.append({"w": n, "n": hood['name'], "lot": l['lot'], "mine": l['myName'], "type": l['type'], "size": l['size'],
                              "built": l['built'], "shared": l['shared'], "sims": l['simsMade'], "who": l.get('statsResidents') or who})
                key = n + '|' + l['lot']
                if l.get('displayName'): name_fix[key] = l['displayName']
                if l.get('tenants'): tenants[key] = l['tenants']
                if l.get('noLandlord'): no_landlord.append(key)   # the household rents too: nobody on the lot is the landlord
                if not owned: continue
                for i in l.get('gallery', []) + [v['upload'] for v in l.get('versions', [])]:
                    lot_of.setdefault(i, {"id": f"l-{ws}--{slug(l['lot'])}", "world": n})
                g = gallery_for(l)
                if l.get('versions') and g:
                    vs = []
                    for v in l['versions']:
                        e = upload_entry(v['upload'])
                        vs.append({"label": v['label'], "title": e['title'], "url": e['url'], "likes": e['likes'], "downloads": e['downloads'], "value": e['value'],
                                   "packs": e['packs'], "description": e['description'], "tags": e['tags'], "shared": e['shared'], "photos": version_photos(ws, slug(l['lot']), v['label'])})
                    cs_versions[key] = vs
                lots.append({"lot": l['lot'], "mine": l['myName'], "type": l['type'], "size": l['size'],
                             "who": (name + ("?" if unsure else "")) if name else None, "whoNote": note,
                             "built": l['built'], "shared": l['shared'], "sims": l['simsMade'],
                             "gallery": g, "photos": photos_for(ws, slug(l['lot']), bool(g)),
                             **{k: l[k] for k in ("traits", "challenges", "units") if l.get(k)}})   # from her Building save (tools/lot_traits.py); units: a rental's own unit names and traits
            if owned: w["hoods"].append({"name": hood['name'], "desc": hood.get('desc', ''), "color": W['colour'], "lots": lots,
                                         **{k: hood[k] for k in ("festivals", "ecoStart") if hood.get(k)}})
        if W.get('households'): households[n] = W['households']
        if W.get('familyLinks'): family_links[n] = W['familyLinks']
        out.append(w)
    checked = max((u['checked'] for u in uploads.values()), default=None)
    return {"worlds": out, "households": households, "stats": stats,
            "familyLinks": family_links, "tenants": tenants, "noLandlord": no_landlord, "nameFix": name_fix, "nbPt": nb_pt, "nbBox": nb_box, "nbCentred": nb_centred, "nbZoom": nb_zoom, "csVersions": cs_versions,
            "galleryHistory": gallery_history(lot_of),
            "meta": {"built": date.today().isoformat(), "galleryChecked": checked, "game": game_version()}}


def game_version():
    """The installed game's version (e.g. 1.128.90), from the game's own Default.ini; None if the game isn't on this PC."""
    p = os.path.join('C:' + os.sep, 'Program Files', 'EA Games', 'The Sims 4', 'Game', 'Bin', 'Default.ini')
    try:
        m = re.search(r'^gameversion\s*=\s*(\d+\.\d+\.\d+)', open(p, encoding='utf-8', errors='replace').read(), re.M)
        return m.group(1) if m else None
    except OSError:
        return None


def missing_pictures(data):
    """Every picture path the site will ask for, that isn't in site/."""
    found = set()
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('src', 'thumb', 'map') and isinstance(v, str) and v: found.add(v.split('?')[0])   # fingerprinted maps carry ?v=
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


def stamp_page():
    """Put a fingerprint of each code file into index.html (site.css?v=1a2b3c), so browsers fetch fresh copies after a change."""
    import hashlib
    p = os.path.join(SITE, 'index.html'); page = open(p, encoding='utf-8').read()
    def fp(m):
        f = os.path.join(SITE, m.group(2))
        return f'{m.group(1)}{m.group(2)}?v={hashlib.md5(open(f, "rb").read()).hexdigest()[:8]}"' if os.path.exists(f) else m.group(0)
    new = re.sub(r'((?:href|src)=")((?:js/[\w.-]+\.js)|site\.css)(?:\?v=\w+)?"', fp, page)
    if new != page:
        with open(p, 'w', encoding='utf-8', newline='\n') as f: f.write(new)


if __name__ == '__main__':
    d = build()
    gone = missing_pictures(d)
    if gone: sys.exit("Pictures missing from site/: " + ", ".join(gone[:10]) + (" …" if len(gone) > 10 else ""))
    p = write(d)
    stamp_page()
    lots = sum(len(h['lots']) for w in d['worlds'] for h in w['hoods'])
    print(f"Wrote {os.path.relpath(p)}: {len(d['worlds'])} worlds, {lots} lots on the site, {len(d['stats'])} in the plan, "
          f"{sum(1 for w in d['worlds'] for h in w['hoods'] for l in h['lots'] if l['gallery'])} with Gallery uploads")
