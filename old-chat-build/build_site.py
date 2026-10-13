import json, os, re, shutil
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
d = json.load(open('new.json'))
meta = {t['tab']: t for t in d[1:]}

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and')).strip('-')
def norm(s): return re.sub(r'[^a-z0-9]', '', (s or '').lower().replace('&', 'and').replace('é', 'e'))

# name, pack, owned, accent colour, [deep, deep-2] — colours picked from each world's map
W = [
 ("Willow Creek","Base Game",True,"#2E6F80",["#123A4B","#1B5468"]),
 ("Oasis Springs","Base Game",True,"#C08440",["#43280F","#5E3A18"]),
 ("Newcrest","Base Game",True,"#4FA34A",["#173A16","#245723"]),
 ("Granite Falls","Outdoor Retreat",True,"#4A6F3E",["#16261A","#223B27"]),
 ("Magnolia Promenade","Get To Work",True,"#A2574F",["#3E1F1E","#57302D"]),
 ("Windenburg","Get Together",True,"#3F5E8C",["#162238","#213252"]),
 ("San Myshuno","City Living",True,"#5B4BB0",["#19163A","#272255"]),
 ("Forgotten Hollow","Vampires",False,"#6A4A6E",None),
 ("Selvadorada","Jungle Adventure",True,"#2E7D5B",["#0F2E22","#164333"]),
 ("Brindleton Bay","Cats & Dogs",True,"#2E5E73",["#112632","#1A3846"]),
 ("Del Sol Valley","Get Famous",True,"#AE8A30",["#382A0D","#523E14"]),
 ("StrangerVille","StrangerVille",True,"#C8675F",["#4A1D1E","#6A2E2D"]),
 ("Sulani","Island Living",True,"#DDBC34",["#4A3E08","#6C5B0E"]),
 ("Glimmerbrook","Realm of Magic",True,"#8A5AA8",["#2A1838","#3C2350"]),
 ("Britechester","Discover University",True,"#8E3B46",["#33141A","#4A1E27"]),
 ("Evergreen Harbor","Eco Lifestyle",True,"#4F7A6B",["#1A2D27","#263F37"]),
 ("Mt. Komorebi","Snowy Escape",True,"#7F8FA0",["#5A6573","#8E9BAA"]),
 ("Henford-on-Bagley","Cottage Living",True,"#6E8B5E",["#232E1F","#33432D"]),
 ("Tartosa","My Wedding Stories",False,"#B86A6A",None),
 ("Moonwood Mill","Werewolves",False,"#5A6E5E",None),
 ("Copperdale","High School Years",True,"#A85C3A",["#3A1E12","#53301D"]),
 ("San Sequoia","Growing Together",True,"#2A7D93",["#0F2F38","#164552"]),
 ("Chestnut Ridge","Horse Ranch",True,"#8A5434",["#301B10","#462818"]),
 ("Tomarang","For Rent",True,"#2C8A78",["#0F332C","#164A40"]),
 ("Ciudad Enamorada","Lovestruck",False,"#C2456B",None),
 ("Ravenwood","Life & Death",True,"#6B5F8E",["#211C30","#302943"]),
 ("Nordhaven","Businesses & Hobbies",True,"#6C747B",["#25292D","#383E44"]),
 ("Innisgreen","Enchanted by Nature",False,"#7C8B4E",None),
 ("Gibbi Point","Adventure Awaits",True,"#2F7FB8",["#0F2A40","#173D5C"]),
 ("Ondarion","Royalty & Legacy",True,"#A88A3E",["#372C12","#4F401C"]),
]

DESC = json.load(open('site/descriptions.json'))
DESC["Willow Creek"] = {"blurb": "A lush bayou of rolling hills and marshy riverways, inspired by New Orleans. Long-standing reputations, simple lifestyles and plenty of coastal hospitality.",
 "hoods": {"Foundry Cove":"Modest homes with a canal for fishing and a charming active railroad.",
  "Courtyard Lane":"Affordable homes for the upwardly mobile, with classic styling and larger shotgun houses.",
  "Pendula View":"The historical garden community, home to large mansions.",
  "Sage Estates":"Willow Creek's most desirable area, with sprawling estates and lush landscaping.",
  "Crawdad Quarter":"The heart of Willow Creek, from parks to nightlife.",
  "Magnolia Blossom Park":"A sprawling park in the heart of town."}}

# Residents/Owners fixes confirmed by Jemma
RESIDENT_FIX = {("Willow Creek","Riverside Roost"): "Kopf"}
def residents(world, lot, who):
    """Split the Residents column into a household name, an 'unsure' flag, or a note about the lot."""
    who = RESIDENT_FIX.get((world, lot), who)
    if who in (None, "N/A") or not str(who).strip(): return None, False, ""
    w = str(who).strip()
    if w.lower() == "empty": return None, False, "Empty"
    if re.search(r'\bbed(room)?s?\b', w, re.I) and not re.search(r'[a-z]{4,}\s*&', w, re.I): return None, False, w     # e.g. "2 Bed", "Large 3 Bedroom"
    if w.startswith("("): return None, False, w.strip("()")
    unsure = "?" in w
    name = re.sub(r'\*[^*]*\*|\([^)]*\)|\+$', '', w)       # planning marks like *WithUpdates*, (move!), (*NPC), trailing +
    name = re.sub(r'\?+', '', name).strip()
    if not name: return None, True, "To be decided"
    return name, unsure, ""

# ---------- Sims 4 Gallery uploads (checked 11 Oct 2026) ----------
def _pack(p): return re.sub(r'\s+(Expansion Pack|Game Pack|Stuff Pack|Kit)$', '', p.replace('The Sims™ 4 ', '')).strip()
gal_src = 'site/gallery_all.json' if os.path.exists('site/gallery_all.json') else 'site/gallery_raw.json'
# apartments were uploaded to the Gallery as Rooms, so Rooms count too (matched by exact title only)
uploads = [g for g in json.load(open(gal_src)) if not g.get('err') and g.get('cat', 'Lots') in ('Lots', 'Rooms')]
# Gallery titles that differ from the plan by a typo or a leading "The"
GAL_ALIAS = {"Cookies 'n' Cream": ("Newcrest", "Hillside Highlands"), "Desert Bloom": ("Oasis Springs", "Desert Bloom Park")}
nt = lambda x: re.sub(r'^the', '', norm(x))
all_lots = [(t['tab'], l) for t in d[1:] for s in t['sections'] for l in s['lots']]
GALLERY, gal_log, ALLC, ALLUP = {}, [], {}, {}
COMMENTS = json.load(open('site/comments.json')) if os.path.exists('site/comments.json') else {}
for g in uploads:
    desc = g['desc'] or ''; tags = [t.lower() for t in re.findall(r'#(\w+)', desc)]
    wtags = {norm(n) for n, *_ in W if norm(n) in tags or norm(n).replace('the','') in tags}
    hits = [(wn, l) for wn, l in all_lots if norm(g['t']) in (norm(l['Lot Name']), norm(l['My Name']))]
    if not hits: hits = [(wn, l) for wn, l in all_lots if nt(g['t']) in (nt(l['Lot Name']), nt(l['My Name']))]
    if not hits and g['t'] in GAL_ALIAS: hits = [(wn, l) for wn, l in all_lots if (wn, l['Lot Name']) == GAL_ALIAS[g['t']]]
    if not hits and g.get('cat') == 'Rooms': continue
    if not hits:   # fall back to hashtags naming the lot (e.g. #thebluevelvet)
        hits = [(wn, l) for wn, l in all_lots if norm(l['Lot Name']) in tags]
    if len(hits) > 1 and wtags: hits = [h for h in hits if norm(h[0]) in wtags]
    if len(hits) != 1: gal_log.append((g['t'], [f"{h[0]}/{h[1]['Lot Name']}" for h in hits])); continue
    key = (hits[0][0], hits[0][1]['Lot Name'])
    k = desc.find('#')
    entry = {"url": "https://www.ea.com" + g['h'], "title": g['t'], "description": re.sub(r'\s+', ' ', desc[:k] if k >= 0 else desc).strip().replace("''", "'"),
             "tags": re.findall(r'#(\w+)', desc), "packs": [_pack(p) for p in g['packs']], "value": f"§{g['price']:,}", "likes": g['likes'],
             "downloads": g['dl'], "comments": len(COMMENTS.get(g['h'].split('/item/')[1], [])), "commentList": COMMENTS.get(g['h'].split('/item/')[1], []), "beds": g['beds'], "baths": g['baths'], "lotType": g.get('type', ''), "checked": "11 Oct 2026"}
    ALLC.setdefault(key, []).extend(entry['commentList']); ALLUP.setdefault(key, []).append(entry)
    if key not in GALLERY or entry['likes'] + entry['downloads'] > GALLERY[key]['likes'] + GALLERY[key]['downloads']:
        GALLERY[key] = entry
# lots uploaded in several versions: Community Space variants (all linked) and residential rental + regular pairs (rental first)
COMMUNITY = {("Newcrest", "Beech Byway"), ("Evergreen Harbor", "The Shipping Views"), ("Sulani", "Admiral's Wreckage")}
for key, ups in ALLUP.items():
    if len(ups) < 2: continue
    if key in COMMUNITY:
        main = next((e for e in ups if not re.search(r'\b(Market|Gardens?|Makers|Space)$', e['title'])), None) or next(e for e in ups if e['title'].endswith('Space'))
        lab = lambda e: {'Space': 'Community space', 'Gardens': 'Garden'}.get((re.search(r'(Market|Gardens?|Makers|Space)$', e['title']) or [None, 'Space'])[1] if False else (m.group(1) if (m := re.search(r'(Market|Gardens?|Makers|Space)$', e['title'])) else 'Space'), (m.group(1) if m else 'Space'))
    elif any(e['lotType'] == 'Residential Rental' for e in ups):
        main = max((e for e in ups if e['lotType'] == 'Residential Rental'), key=lambda e: e['likes'] + e['downloads'])
        lab = lambda e: e['lotType'] or 'Other version'
    else: continue
    main = dict(main, commentList=GALLERY[key]['commentList'] if key in GALLERY else main['commentList'])
    main['label'] = lab(main)
    main['others'] = [{"title": e['title'], "url": e['url'], "likes": e['likes'], "downloads": e['downloads'], "label": lab(e)} for e in ups if e is not dict.get(main, '_') and e['url'] != main['url']]
    GALLERY[key] = main
# apartments were uploaded as Rooms, which carry no bed/bath counts: taken from the description, the plan note or screenshots
ROOM_INFO = {("San Myshuno", "17 Culpepper House"): (1, None), ("San Myshuno", "18 Culpepper House"): (2, None),
             ("San Myshuno", "19 Culpepper House"): (2, None), ("San Myshuno", "2A Jasmine Suites"): (3, None),
             ("San Myshuno", "2B Jasmine Suites"): (3, None), ("San Myshuno", "920 Medina Studios"): (2, 2),
             ("San Myshuno", "930 Medina Studios"): (4, None), ("San Myshuno", "122 Hakim House"): (2, None),
             ("San Myshuno", "1310 21 Chic Street"): (1, None), ("Evergreen Harbor", "Stonestreet Apartments #3"): (2, None),
             ("Evergreen Harbor", "Stonestreet Apartments #4"): (1, None), ("Evergreen Harbor", "Pinecrest Apartments #404"): (2, None)}
for key, (bd, ba) in ROOM_INFO.items():
    if key in GALLERY and not GALLERY[key].get('beds'): GALLERY[key]['beds'] = bd; GALLERY[key]['baths'] = ba or 0
for key, cl in ALLC.items():
    GALLERY[key]['commentList'] = sorted(cl, key=lambda c: -c['t']); GALLERY[key]['comments'] = len(cl)
json.dump({' / '.join(k): [[e['title'], e['likes'], e['downloads'], e['url']] for e in v] for k, v in ALLUP.items() if len(v) > 1}, open('site/gallery_dups.json', 'w'), indent=1, ensure_ascii=False)
json.dump(gal_log, open('site/gallery_unmatched.json', 'w'), indent=1, ensure_ascii=False)

# ---------- photos from Jemma's Builds folder ----------
EXTERIOR = ['front', 'outside', 'side', 'angle', 'back', 'rear', 'aerial', 'exterior', 'garden', 'entrance']
# first Gallery picture for builds with no screenshots, stored in the artifact's asset store
GAL_ASSETS = {p[0]: "/_blob/" + p[1] for p in (l.split() for l in open('gal_assets/ids.txt') if l.strip())}
def photos_for(world, lot):
    dd = f"site/shots/{slug(world)}/{slug(lot)}"
    if not os.path.isdir(dd):
        import unicodedata
        a = lambda t: slug(''.join(c for c in unicodedata.normalize('NFD', t) if not unicodedata.combining(c)))
        u = GAL_ASSETS.get(f"{a(world)}__{a(lot)}")
        return [{"src": u, "thumb": u, "caption": "From the Gallery", "gallery": True}] if u else []
    fs = [f for f in os.listdir(dd) if f.endswith('.jpg') and not f.endswith('.thumb.jpg')]
    def key(f):
        n = f[:-4]; i = next((k for k, w in enumerate(EXTERIOR) if w in n), 99)
        return (1 if 'floor' in n else 0, i, n)
    return [{"src": f"{dd[5:]}/{f}", "thumb": f"{dd[5:]}/{f[:-4]}.thumb.jpg", "caption": re.sub(r'\bi\b', 'I', f[:-4].replace('-', ' ')).title()} for f in sorted(fs, key=key)]

# ---------- maps as separate files ----------
os.makedirs('site/maps', exist_ok=True)
for n, *_ in W:
    s = slug(n)
    for a, b in ((f'maps/full/{s}.jpg', f'site/maps/{s}.jpg'), (f'maps/thumb/{s}.jpg', f'site/maps/{s}.thumb.jpg')):
        if os.path.exists(a) and not os.path.exists(b): shutil.copy(a, b)

HOUSEHOLDS = {"Willow Creek": {
 "Goth": {"source": [["Bella", "https://sims.fandom.com/wiki/Bella_Goth"], ["Mortimer", "https://sims.fandom.com/wiki/Mortimer_Goth"], ["Cassandra", "https://sims.fandom.com/wiki/Cassandra"], ["Alexander", "https://sims.fandom.com/wiki/Alex_Goth"]], "sims": [
   {"name":"Bella Goth","age":"Young Adult","aspiration":"Party Animal","traits":["Good","Family-Oriented","Romantic"],"bonus":"Gregarious","career":"Secret Agent · Intelligence Researcher","skills":[["Charisma",2,10],["Fitness",2,10],["Programming",2,10]],"rels":[["Mortimer Goth","Husband"],["Cassandra Goth","Daughter"],["Alexander Goth","Son"]]},
   {"name":"Mortimer Goth","age":"Adult","aspiration":"Renaissance Sim","traits":["Bookworm","Outgoing","Creative"],"bonus":"Quick Learner","career":"Writer · Freelance Article Writer (level 3)","skills":[["Writing",4,10]],"rels":[["Bella Goth","Wife"],["Cassandra Goth","Daughter"],["Alexander Goth","Son"]]},
   {"name":"Cassandra Goth","age":"Teen","aspiration":"Musical Genius","traits":["Creative","Gloomy"],"bonus":"Muser","career":"","school":"High school · grade C","skills":[["Violin",2,10]],"rels":[["Bella Goth","Mother"],["Mortimer Goth","Father"],["Alexander Goth","Brother"]]},
   {"name":"Alexander Goth","age":"Child","aspiration":"Whiz Kid","traits":["Bookworm"],"career":"","school":"Grade school","skills":[["Creativity",1,10],["Mental",1,10],["Motor",1,10],["Social",1,10]],"rels":[["Bella Goth","Mother"],["Mortimer Goth","Father"],["Cassandra Goth","Sister"]]}]}}}

# worlds whose dots and hero glow are lighter than their text colour (snowy white is unreadable as text)
GLOW = {"Mt. Komorebi": "#AAB9C8"}
out, STATS = [], []
for n, pack, owned, color, deep in W:
    s = slug(n)
    w = {"name": n, "pack": pack, "owned": owned, "color": color, "deep": deep, "ready": owned,
         "map": f"maps/{s}.jpg" if owned and os.path.exists(f'site/maps/{s}.jpg') else "",
         "thumb": f"maps/{s}.thumb.jpg" if os.path.exists(f'site/maps/{s}.thumb.jpg') else "",
         "blurb": DESC.get(n, {}).get("blurb", ""), "hoods": []}
    if n in GLOW: w["glow"] = GLOW[n]
    for sec in meta.get(n, {'sections': []})['sections']:
        lots = []
        for l in sec['lots']:
            name, unsure, note = residents(n, l['Lot Name'], l['Residents/Owners'])
            row = {"lot": l['Lot Name'], "mine": l['My Name'], "type": l['Lot Type'], "size": l['Lot Size'],
                   "who": (name + ("?" if unsure else "")) if name else None, "whoNote": note,
                   "built": l['Built'], "shared": l['Shared'], "sims": l['Sims Made']}
            STATS.append({"w": n, "n": sec['name'], **{k: row[k] for k in ("lot","mine","type","size","built","shared","sims")}, "who": name or note or None})
            if owned:
                row["gallery"] = GALLERY.get((n, l['Lot Name'])); row["photos"] = photos_for(n, l['Lot Name'])
                lots.append(row)
        if owned:
            w["hoods"].append({"name": sec['name'], "desc": DESC.get(n, {}).get("hoods", {}).get(sec['name'], ""), "color": color, "lots": lots})
    out.append(w)

# ---------- changes made on the live page after the build (12-13 Oct 2026) ----------
# The live site was edited directly; these overrides carry those edits so a rebuild matches it.
if os.path.exists('site/live_overrides.json'):
    OVR = json.load(open('site/live_overrides.json'))
    for w in out:
        w.update(OVR['worlds'].get(w['name'], {}))
        for h in w['hoods']:
            h.update(OVR['hoods'].get(w['name'] + '|' + h['name'], {}))
            for l in h['lots']: l.update(OVR['lots'].get(w['name'] + '|' + l['lot'], {}))
    for r in STATS: r.update(OVR['stats'].get(r['w'] + '|' + r['lot'], {}))

icons = open('site/icons.json').read()
html = open('site/template.html', encoding='utf-8').read().replace('__ICONS__', icons).replace('__DATA__', json.dumps({"worlds": out, "households": HOUSEHOLDS, "stats": STATS}, ensure_ascii=False))
open('site/jemmas-sim-world.html', 'w', encoding='utf-8').write(html)
print(len(html), "bytes;", len(GALLERY), "gallery matches;", len(gal_log), "unmatched uploads")
