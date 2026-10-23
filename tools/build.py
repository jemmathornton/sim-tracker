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

# British spelling in her Gallery descriptions on the site (her call, 19 Oct; her uploads on EA are unchanged). Lower-case words only
# where the capitalised form is a proper name from the game (Evergreen Harbor, Rec Center, Information Center, a Theater's name).
BRITISH_ANY = {'neighborhood': 'neighbourhood', 'neighbor': 'neighbour', 'neighboring': 'neighbouring', 'color': 'colour', 'colorful': 'colourful',
               'colored': 'coloured', 'favorite': 'favourite', 'favor': 'favour', 'flavor': 'flavour', 'cozy': 'cosy', 'cozier': 'cosier',
               'coziest': 'cosiest', 'coziness': 'cosiness', 'gray': 'grey', 'honor': 'honour', 'labor': 'labour', 'organize': 'organise', 'organization': 'organisation', 'organizations': 'organisations',
               'organized': 'organised', 'organizing': 'organising', 'realize': 'realise', 'realized': 'realised', 'apologize': 'apologise',
               'traveler': 'traveller', 'travelers': 'travellers', 'traveling': 'travelling', 'traveled': 'travelled', 'jewelry': 'jewellery',
               'mom': 'mum', 'moms': 'mums', 'catalog': 'catalogue', 'aluminum': 'aluminium', 'pajamas': 'pyjamas', 'defense': 'defence',
               'mold': 'mould', 'moldy': 'mouldy', 'specialize': 'specialise', 'specialized': 'specialised', 'personalize': 'personalise',
               'personalized': 'personalised', 'modernized': 'modernised', 'modernize': 'modernise', 'center': 'centre', 'centers': 'centres',
               'harbor': 'harbour', 'theater': 'theatre', 'theaters': 'theatres'}
BRITISH_LOWER_ONLY = {'center', 'centers', 'harbor', 'theater', 'theaters'}
def british(text):
    def swap(m):
        w = m.group(0); low = w.lower(); plural = ''
        if low not in BRITISH_ANY and low.endswith('s') and low[:-1] in BRITISH_ANY: low, plural = low[:-1], 's'
        if low not in BRITISH_ANY: return w
        if w[0].isupper() and (low in BRITISH_LOWER_ONLY or low + plural in BRITISH_LOWER_ONLY): return w
        out = BRITISH_ANY[low] + plural
        return out.upper() if w.isupper() and len(w) > 1 else out[0].upper() + out[1:] if w[0].isupper() else out
    return re.sub(r"[A-Za-z]+", swap, text)


def upload_entry(i):
    u = uploads[i]; desc = u['description'] or ''; k = desc.find('#')
    text = re.sub(r'\s+', ' ', desc[:k] if k >= 0 else desc).strip().replace("''", "'")
    for a, b in fixes.get(i, {}).get('description', []): text = text.replace(a, b)
    text = british(text)
    # EA sends some comment text HTML-escaped ("&lt;3"); the page escapes text itself, so turn it back into plain text first
    cl = [dict(c, m=html.unescape(c.get('m') or '')) for c in comments.get(i, [])]
    return {"url": GALLERY_ITEM + urllib.parse.quote(i, safe=''), "title": clean_title(u['title']), "description": text,
            "tags": re.findall(r'#(\w+)', desc), "packs": [short_pack(p) for p in u['packs']], "value": f"§{u['price']:,}",
            "likes": u['favourites'], "downloads": u['downloads'], "comments": len(cl), "commentList": cl,
            "beds": u['beds'], "baths": u['baths'], "lotType": u['lotType'], "checked": nice_date(u['checked']), "shared": shared_on(i), "creator": u.get('creator') or ""}

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
            # the Gallery has no English name for some newer lot types (Backroom, Community Space): "Missing sims translation".
            # Such an upload is taken to be the plan's type, so her Backroom re-uploads lead (21 Oct)
            for e in ups:
                if e['lotType'] == 'Missing sims translation': e['lotType'] = next((t for t in plan if t not in {x['lotType'] for x in ups}), plan[0])
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
        if not (has_upload and os.path.exists(os.path.join(SITE, cover))): return []
        # the upload's other three pictures (tools/gallery_more.py), marked "more"; lots show all four (her call, 23 Oct)
        more = [f"gallery-more/{ws}/{ls}-{n}.jpg" for n in (2, 3, 4) if os.path.exists(os.path.join(SITE, 'gallery-more', ws, f'{ls}-{n}.jpg'))]
        return [{"src": cover, "thumb": cover, "caption": "From the Gallery", "gallery": True}] + [{"src": m, "thumb": m, "caption": "From the Gallery", "gallery": True, "more": True} for m in more]
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
    residents_unit = {}
    family_links, tenants, name_fix, nb_pt, nb_box, nb_centred, nb_zoom, nb_banner, cs_versions = {}, {}, {}, {}, {}, {}, {}, {}, {}
    lot_of = {}   # Gallery id -> the lot page it belongs to
    lib_pics = load(os.path.join(DATA, 'library-pictures.json')) if os.path.exists(os.path.join(DATA, 'library-pictures.json')) else {'households': {}, 'sims': {}}
    for wf in world_files():
        W = load(wf); n, ws, owned = W['name'], slug(W['name']), W['owned']
        w = {"name": n, "pack": W['pack'], "owned": owned, "color": W['colour'], "deep": W.get('deep'), "ready": owned,
             "map": stamped(f"maps/{ws}.jpg") if owned and os.path.exists(os.path.join(SITE, 'maps', ws + '.jpg')) else "",
             "mapW": map_width(ws),
             "thumb": stamped(f"maps/{ws}.thumb.jpg") if os.path.exists(os.path.join(SITE, 'maps', ws + '.thumb.jpg')) else "",
             "blurb": W.get('blurb', ''), "hoods": []}
        if W.get('glow'): w["glow"] = W['glow']
        if W.get('heroY') is not None: w["heroY"] = W['heroY']   # how far down the world banner looks at its map (0 top, 100 bottom; her call)
        w.update({k: W[k] for k in ("weather", "weatherSeasons", "highlights") if W.get(k)})   # from the game (tools/research/world_extras.py --apply)
        if w.get("highlights"): w["highlights"] = [{**x, "text": british(x["text"])} for x in w["highlights"]]   # British spelling, like EA's bios (19 Oct)
        for hood in W['neighbourhoods']:
            lots = []
            if hood.get('mapSpot'): nb_pt.setdefault(ws, {})[hood['name']] = hood['mapSpot']
            if hood.get('mapBox'): nb_box.setdefault(ws, {})[hood['name']] = hood['mapBox']
            if hood.get('mapCentred'): nb_centred.setdefault(ws, []).append(hood['name'])   # card stays centred on its box (her choice)
            if hood.get('mapZoom'): nb_zoom.setdefault(ws, {})[hood['name']] = hood['mapZoom']   # card zoomed in closer than its box (her choice)
            if hood.get('bannerZoom') or hood.get('bannerShift') or hood.get('bannerTitle') or hood.get('cardShift') or hood.get('bannerOnlyZoom'): nb_banner.setdefault(ws, {})[hood['name']] = {'zoom': hood.get('bannerZoom', 1), 'shift': hood.get('bannerShift', [0, 0]), 'title': hood.get('bannerTitle'), 'card': hood.get('cardShift', [0, 0]), 'heroOnly': hood.get('bannerOnlyZoom', 1)}   # her own nudges to the banner (19 Oct)
            for l in hood['lots']:
                name, unsure, note = residents(l['residents'])
                who = name or note or None
                if name and l.get('tenants'): who = f"{name.removesuffix(' own')} ({'tenant' if l.get('noLandlord') else 'landlord'}) + " + ", ".join(f"{t['name']} (tenant)" for t in l['tenants'])
                elif name and 'rental' in (l['type'] or '').lower() and name.endswith(' own'): who = name[:-4] + ' (landlord)'   # her wording for rental owners (19 Oct)
                stats.append({"w": n, "n": hood['name'], "lot": l['lot'], "mine": l['myName'], "type": l['type'], "size": l['size'],
                              "built": l['built'], "shared": l['shared'], "sims": l['simsMade'], "who": l.get('statsResidents') or who})
                key = n + '|' + l['lot']
                if l.get('displayName'): name_fix[key] = l['displayName']
                if l.get('tenants'): tenants[key] = l['tenants']
                if l.get('noLandlord'): no_landlord.append(key)   # the household rents too: nobody on the lot is the landlord
                if l.get('residentsUnit'): residents_unit[key] = l['residentsUnit']   # which unit the residents live in (19 Oct)
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
                             "who": (name + ("?" if unsure else "")) if name else None, "whoNote": note, **({"npc": True} if re.search(r"\*NPC", str(l.get("residents") or ""), re.I) else {}),
                             "built": l['built'], "shared": l['shared'], "sims": l['simsMade'],
                             "gallery": g, "photos": photos_for(ws, slug(l['lot']), bool(g)),
                             **{k: l[k] for k in ("traits", "challenges", "units", "rebuild") if l.get(k)}})   # from her Building save (tools/lot_traits.py); units: a rental's own unit names and traits; rebuild: being rebuilt (her Admin checks skip it)
            if owned: w["hoods"].append({"name": hood['name'], "desc": hood.get('desc', ''), "color": W['colour'], "lots": lots,
                                         **{k: hood[k] for k in ("festivals", "ecoStart") if hood.get(k)}})
        if W.get('households'):
            for h in W['households'].values():   # EA's bios in British spelling too, proper names kept (her call, 19 Oct)
                if h.get('bio'): h['bio'] = british(h['bio'])
            for hn, h in W['households'].items():   # her Library pictures, stand-ins until her own screenshots (tools/library_pictures.py, 19 Oct)
                if lib_pics['households'].get(ws + '|' + hn): h['libraryPic'] = stamped(lib_pics['households'][ws + '|' + hn])
                for sm in h.get('sims', []):
                    if lib_pics['sims'].get(sm.get('id')): sm['libraryPic'] = stamped(lib_pics['sims'][sm['id']])
            households[n] = W['households']
        if W.get('familyLinks'): family_links[n] = W['familyLinks']
        out.append(w)
    checked = max((u['checked'] for u in uploads.values()), default=None)
    return {"worlds": out, "households": households, "stats": stats,
            "people": {k: v for k, v in load(os.path.join(DATA, 'people.json')).items() if not k.startswith('_')} if os.path.exists(os.path.join(DATA, 'people.json')) else {},   # relatives with no household on the site (17 Oct)
            "groups": {k: v for k, v in load(os.path.join(DATA, 'groups.json')).items() if not k.startswith('_')} if os.path.exists(os.path.join(DATA, 'groups.json')) else {},   # dynasties, clubs, university organisations (17 Oct)
            "calendar": {k: v for k, v in load(os.path.join(DATA, 'calendar.json')).items() if not k.startswith('_')} if os.path.exists(os.path.join(DATA, 'calendar.json')) else {},   # festivals, events and her holidays (19 Oct)
            "familyLinks": family_links, "tenants": tenants, "noLandlord": no_landlord, "residentsUnit": residents_unit, "nameFix": name_fix, "nbPt": nb_pt, "nbBox": nb_box, "nbCentred": nb_centred, "nbZoom": nb_zoom, "nbBanner": nb_banner, "csVersions": cs_versions,
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
                if k in ('src', 'thumb', 'map', 'libraryPic') and isinstance(v, str) and v: found.add(v.split('?')[0])   # fingerprinted maps carry ?v=
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
    try:   # the Admin pages' extra data (js/sections.js, 23 Oct); a problem there never stops the build
        import admin_data; admin_data.write()
    except Exception as e: print('Admin data not written:', e)
    stamp_page()
    lots = sum(len(h['lots']) for w in d['worlds'] for h in w['hoods'])
    print(f"Wrote {os.path.relpath(p)}: {len(d['worlds'])} worlds, {lots} lots on the site, {len(d['stats'])} in the plan, "
          f"{sum(1 for w in d['worlds'] for h in w['hoods'] for l in h['lots'] if l['gallery'])} with Gallery uploads")
