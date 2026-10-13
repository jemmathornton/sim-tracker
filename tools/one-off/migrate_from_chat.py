"""One-off (13 Oct 2026): turn the claude.ai chat build (build/ + live-site/) into the app's own data.

Reads only: build/*.json, build/template.html, build/gallery-picture-ids.txt, live-site/.
Writes: data/ (worlds, Gallery data, spreadsheet base) and the pictures under site/ (maps, shots, gallery).

Every change from build/live_overrides.json is folded into the data here, so the overrides file can be retired.
Kept for the record; there's no need to run it again.
"""
import os, re, shutil, sys, urllib.parse
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, DATA, SITE, GALLERY, path, slug, norm, load, save

B = lambda *p: path('build', *p)
LIVE = lambda *p: path('live-site', *p)

new = load(B('new.json'))
meta = {t['tab']: t for t in new[1:]}
O = load(B('live_overrides.json'))
tpl = open(B('template.html'), encoding='utf-8').read()
const = lambda name: __import__('json').loads(re.search(rf'^const {name} = (.*);$', tpl, re.M).group(1))
FAMILY_LINKS, TENANTS, NAME_FIX, CS_VERSIONS = const('FAMILY_LINKS'), const('TENANTS'), const('NAME_FIX'), const('CS_VERSIONS')
NB_PT = __import__('json').loads(re.search(r'^const NB_PT = (.*);$', tpl, re.M).group(1).replace('[.', '[0.').replace(',.', ',0.'))
live_line = next(l for l in open(LIVE('index.html'), encoding='utf-8') if l.startswith('const DATA = '))
LIVE_DATA = __import__('json').loads(live_line[len('const DATA = '):].rstrip().rstrip(';'))
live_worlds = {w['name']: w for w in LIVE_DATA['worlds']}

# name, pack, owned, accent colour, [deep, deep-2]  (build_site.py's W list; Britechester's colours from the overrides)
W = [
 ("Willow Creek","Base Game",True,"#2E6F80",["#123A4B","#1B5468"]), ("Oasis Springs","Base Game",True,"#C08440",["#43280F","#5E3A18"]),
 ("Newcrest","Base Game",True,"#4FA34A",["#173A16","#245723"]), ("Granite Falls","Outdoor Retreat",True,"#4A6F3E",["#16261A","#223B27"]),
 ("Magnolia Promenade","Get To Work",True,"#A2574F",["#3E1F1E","#57302D"]), ("Windenburg","Get Together",True,"#3F5E8C",["#162238","#213252"]),
 ("San Myshuno","City Living",True,"#5B4BB0",["#19163A","#272255"]), ("Forgotten Hollow","Vampires",False,"#6A4A6E",None),
 ("Selvadorada","Jungle Adventure",True,"#2E7D5B",["#0F2E22","#164333"]), ("Brindleton Bay","Cats & Dogs",True,"#2E5E73",["#112632","#1A3846"]),
 ("Del Sol Valley","Get Famous",True,"#AE8A30",["#382A0D","#523E14"]), ("StrangerVille","StrangerVille",True,"#C8675F",["#4A1D1E","#6A2E2D"]),
 ("Sulani","Island Living",True,"#DDBC34",["#4A3E08","#6C5B0E"]), ("Glimmerbrook","Realm of Magic",True,"#8A5AA8",["#2A1838","#3C2350"]),
 ("Britechester","Discover University",True,"#8E3B46",["#33141A","#4A1E27"]), ("Evergreen Harbor","Eco Lifestyle",True,"#4F7A6B",["#1A2D27","#263F37"]),
 ("Mt. Komorebi","Snowy Escape",True,"#7F8FA0",["#5A6573","#8E9BAA"]), ("Henford-on-Bagley","Cottage Living",True,"#6E8B5E",["#232E1F","#33432D"]),
 ("Tartosa","My Wedding Stories",False,"#B86A6A",None), ("Moonwood Mill","Werewolves",False,"#5A6E5E",None),
 ("Copperdale","High School Years",True,"#A85C3A",["#3A1E12","#53301D"]), ("San Sequoia","Growing Together",True,"#2A7D93",["#0F2F38","#164552"]),
 ("Chestnut Ridge","Horse Ranch",True,"#8A5434",["#301B10","#462818"]), ("Tomarang","For Rent",True,"#2C8A78",["#0F332C","#164A40"]),
 ("Ciudad Enamorada","Lovestruck",False,"#C2456B",None), ("Ravenwood","Life & Death",True,"#6B5F8E",["#211C30","#302943"]),
 ("Nordhaven","Businesses & Hobbies",True,"#6C747B",["#25292D","#383E44"]), ("Innisgreen","Enchanted by Nature",False,"#7C8B4E",None),
 ("Gibbi Point","Adventure Awaits",True,"#2F7FB8",["#0F2A40","#173D5C"]), ("Ondarion","Royalty & Legacy",True,"#A88A3E",["#372C12","#4F401C"]),
]
GLOW = {"Mt. Komorebi": "#AAB9C8"}

# ---------- Gallery uploads ----------
gal_all = load(B('gallery_all.json'))
COMMENTS = load(B('comments.json'))
item_id = lambda h: urllib.parse.unquote(h.split('/item/')[1])
KIND = {'Lots': 'lot', 'Rooms': 'room', 'Households': 'household'}
uploads = {}
for g in gal_all:
    uploads[item_id(g['h'])] = {"title": g['t'], "kind": KIND[g['cat']], "description": g['desc'] or '', "lotType": g.get('type') or '',
        "size": g.get('size') or '', "price": g.get('price') or 0, "beds": g.get('beds') or 0, "baths": g.get('baths') or 0,
        "packs": g['packs'], "images": [], "favourites": g['likes'], "downloads": g['dl'], "checked": "2026-10-11"}
comments = {item_id('/item/' + k): v for k, v in COMMENTS.items()}

# the old build's matching rules (build_site.py), run once to record which uploads belong to which lot
all_lots = [(t['tab'], l) for t in new[1:] for s in t['sections'] for l in s['lots']]
GAL_ALIAS = {"Cookies 'n' Cream": ("Newcrest", "Hillside Highlands"), "Desert Bloom": ("Oasis Springs", "Desert Bloom Park")}
nt = lambda x: re.sub(r'^the', '', norm(x))
links, unmatched = {}, []
for g in gal_all:
    if g.get('err') or g.get('cat', 'Lots') not in ('Lots', 'Rooms'): continue
    desc = g['desc'] or ''; tags = [t.lower() for t in re.findall(r'#(\w+)', desc)]
    wtags = {norm(n) for n, *_ in W if norm(n) in tags or norm(n).replace('the', '') in tags}
    hits = [(wn, l) for wn, l in all_lots if norm(g['t']) in (norm(l['Lot Name']), norm(l['My Name']))]
    if not hits: hits = [(wn, l) for wn, l in all_lots if nt(g['t']) in (nt(l['Lot Name']), nt(l['My Name']))]
    if not hits and g['t'] in GAL_ALIAS: hits = [(wn, l) for wn, l in all_lots if (wn, l['Lot Name']) == GAL_ALIAS[g['t']]]
    if not hits and g.get('cat') == 'Rooms': continue
    if not hits: hits = [(wn, l) for wn, l in all_lots if norm(l['Lot Name']) in tags]
    if len(hits) > 1 and wtags: hits = [h for h in hits if norm(h[0]) in wtags]
    if len(hits) != 1: unmatched.append((item_id(g['h']), g['t'], [f"{h[0]} / {h[1]['Lot Name']}" for h in hits])); continue
    links.setdefault((hits[0][0], hits[0][1]['Lot Name']), []).append(item_id(g['h']))

# uploads added on 12 Oct (shell-challenge uploads credited to lilsimsie, plus an older Skye Fitness upload): only on the live page
def price(v): return int(v.replace('§', '').replace(',', ''))
for k, v in O['lots'].items():
    g = v.get('gallery')
    if not g or 'url' not in g or g.get('checked') != '12 Oct 2026': continue
    i = item_id(g['url'])
    uploads[i] = {"title": g['title'], "kind": "lot", "description": (g['description'] + ' ' + ' '.join('#' + t for t in g['tags'])).strip(),
        "lotType": g['lotType'], "size": "", "price": price(g['value']), "beds": g['beds'], "baths": g['baths'], "packs": g['packs'],
        "images": [], "favourites": g['likes'], "downloads": g['downloads'], "checked": "2026-10-12"}
    links[tuple(k.split('|'))] = [i]
# links Jemma removed on 12 Oct
unlinked = {}
REMOVED = {"Oasis Springs|Affluista Mansion": "Different build (the upload is a template for another house).",
           "Evergreen Harbor|The Waterfront": "Jemma: ignore this upload for Abandoned Views.",
           "Newcrest|Midtown Meadows": "On hold: Jemma will compare its two uploads."}
for k, why in REMOVED.items():
    for i in links.pop(tuple(k.split('|')), []):
        unlinked[i] = {"title": uploads[i]['title'], "lot": k.replace('|', ' / '), "why": why}
for i, t, hits in unmatched:
    unlinked[i] = {"title": t, "lot": None, "why": "No single lot in the plan matches it" + (f" (could be {', '.join(hits)})" if hits else "") + "."}
for i, u in uploads.items():
    if u['kind'] in ('lot', 'room') and i not in unlinked and not any(i in v for v in links.values()):
        unlinked[i] = {"title": u['title'], "lot": None, "why": "Room upload with no apartment of that name in the plan." if u['kind'] == 'room' else "Not matched to a lot."}

# ---------- residents: the overrides' changes written back as plan values ----------
RESIDENTS = {  # lot -> Residents value that gives what the live page shows (planning notes kept in brackets)
 "Evergreen Harbor|Pinecrest Apartments #402": "Eco Roomies",
 "Henford-on-Bagley|3 Cobblebottom Street": "Moody & McMillan",          # Cecilia Kang is the lot's tenant (see "tenants")
 "Ravenwood|Moppy Manor": "Specter (rent out)",
 "Nordhaven|Koffieboon": "Loden", "Nordhaven|Terra-Potta": "Koopman", "Nordhaven|Spilled Neon": "Sarpong",
 "Gibbi Point|Prospector's Paradise": "? (Horses!)",
 "Tartosa|Celebrazioni d'Amore": "? (Capp/Monty)", "Tartosa|La Coppia Serena": "? (Capp/Monty)",
 "Willow Creek|Riverside Roost": "Kopf",                                 # was RESIDENT_FIX in build_site.py
}
ROOM_INFO = {("San Myshuno", "17 Culpepper House"): (1, None), ("San Myshuno", "18 Culpepper House"): (2, None),
             ("San Myshuno", "19 Culpepper House"): (2, None), ("San Myshuno", "2A Jasmine Suites"): (3, None),
             ("San Myshuno", "2B Jasmine Suites"): (3, None), ("San Myshuno", "920 Medina Studios"): (2, 2),
             ("San Myshuno", "930 Medina Studios"): (4, None), ("San Myshuno", "122 Hakim House"): (2, None),
             ("San Myshuno", "1310 21 Chic Street"): (1, None), ("Evergreen Harbor", "Stonestreet Apartments #3"): (2, None),
             ("Evergreen Harbor", "Stonestreet Apartments #4"): (1, None), ("Evergreen Harbor", "Pinecrest Apartments #404"): (2, None)}
CS_LABELS = {"Market": "market", "Garden": "garden", "Makers": "makers", "Community space": "community-space"}
url_id = lambda u: item_id(u)

# ---------- world files ----------
order, used_ids = [], set()
for n, pack, owned, color, deep in W:
    s = slug(n); order.append(s)
    lw = live_worlds[n]
    ov = O['worlds'].get(n, {})
    world = {"name": n, "pack": pack, "owned": owned,
             "colour": ov.get('color', color), "deep": ov.get('deep', deep)}
    if ov.get('glow') or n in GLOW: world["glow"] = ov.get('glow') or GLOW[n]
    world["blurb"] = lw.get('blurb', '')
    hood_desc = {h['name']: h['desc'] for h in lw['hoods']}
    world["neighbourhoods"] = []
    for sec in meta.get(n, {'sections': []})['sections']:
        hood = {"name": sec['name']}
        if owned: hood["desc"] = hood_desc.get(sec['name'], '')
        if (NB_PT.get(s) or {}).get(sec['name']): hood["mapSpot"] = NB_PT[s][sec['name']]
        hood["lots"] = []
        for l in sec['lots']:
            k = n + '|' + l['Lot Name']; ov = O['lots'].get(k, {})
            row = {"lot": l['Lot Name'], "myName": ov.get('mine', l['My Name']), "type": ov.get('type', l['Lot Type']), "size": ov.get('size', l['Lot Size']),
                   "residents": RESIDENTS.get(k, l['Residents/Owners']), "built": ov.get('built', l['Built']), "shared": ov.get('shared', l['Shared']),
                   "screenshots": l['Screenshots'], "simsMade": l['Sims Made']}
            if k in NAME_FIX: row["displayName"] = NAME_FIX[k]
            if (n, l['Lot Name']) in links:
                row["gallery"] = links[(n, l['Lot Name'])]; used_ids.update(row["gallery"])
            if (O['lots'].get(k, {}).get('gallery') or {}).get('old'): row["galleryOld"] = True
            if k in CS_VERSIONS:
                row["versions"] = [{"label": v['label'], "upload": url_id(v['url'])} for v in CS_VERSIONS[k]]
            if (n, l['Lot Name']) in ROOM_INFO:
                bd, ba = ROOM_INFO[(n, l['Lot Name'])]; row["beds"] = bd
                if ba: row["baths"] = ba
            if k in TENANTS: row["tenants"] = TENANTS[k]
            if k == "Ravenwood|Moppy Manor": row["statsResidents"] = "Specter + tenants"
            hood["lots"].append(row)
        world["neighbourhoods"].append(hood)
    hh = LIVE_DATA['households'].get(n)
    if hh: world["households"] = hh
    if n in FAMILY_LINKS: world["familyLinks"] = FAMILY_LINKS[n]
    save(os.path.join(DATA, 'worlds', s + '.json'), world)

save(os.path.join(DATA, 'worlds.json'), {"_note": "World order (as the packs arrived). Each world's data is in worlds/<id>.json.", "order": order})

# ---------- Gallery data ----------
fixes = {}
for k, why in [("San Myshuno|18 Culpepper House", [["stones throw", "stone’s throw"]]), ("Britechester|Mossy Lane", [["stones throw", "stone’s throw"]]),
               ("Sulani|The Sand Bar", [["social hospot", "social hotspot"]])]:
    for i in links[tuple(k.split('|'))]: fixes[i] = {"lot": k.replace('|', ' / '), "description": why}
save(os.path.join(GALLERY, 'uploads.json'), {"_note": "Jemma's Sims 4 Gallery uploads, keyed by Gallery id. Refreshed weekly by tools/gallery_refresh.py; don't edit by hand.", "uploads": uploads})
save(os.path.join(GALLERY, 'comments.json'), {"_note": "Comments on her uploads, keyed by Gallery id (u = username, t = time in ms, m = message). Refreshed weekly.", "comments": comments})
save(os.path.join(GALLERY, 'unlinked.json'), {"_note": "Uploads not linked to any lot, and why. The weekly refresh leaves these alone.", "uploads": unlinked})
save(os.path.join(GALLERY, 'text-fixes.json'), {"_note": "Typo fixes applied to Gallery text on the site (her uploads on EA are unchanged).", "fixes": fixes})
with open(os.path.join(GALLERY, 'history.csv'), 'w', encoding='utf-8', newline='\n') as f:
    f.write('date,id,favourites,downloads,comments\n')
    for i, u in uploads.items():
        f.write(f"{u['checked']},{i},{u['favourites']},{u['downloads']},{len(comments.get(i, []))}\n")
# the spreadsheet as last imported (11-12 Oct): the base for telling her later spreadsheet edits apart from app edits
os.makedirs(os.path.join(DATA, 'spreadsheet'), exist_ok=True)
shutil.copy(B('new.json'), os.path.join(DATA, 'spreadsheet', 'last-import.json'))

# ---------- pictures ----------
for sub in ('maps', 'shots'):
    if not os.path.isdir(os.path.join(SITE, sub)): shutil.copytree(LIVE(sub), os.path.join(SITE, sub))
ids = {l.split()[0]: l.split()[1] for l in open(B('gallery-picture-ids.txt')) if l.strip()}
cs_world = {slug(k.split('|')[1]): (slug(k.split('|')[0]), slug(k.split('|')[1])) for k in CS_VERSIONS}
skip = {"oasis-springs__affluista-mansion", "evergreen-harbor__the-waterfront", "coorinberg-cottage"}   # unlinked, or replaced by screenshots
n = 0
for key, blob in ids.items():
    if key in skip: continue
    if '__' not in key:          # the 12 Oct additions were stored without their world
        key = next(slug(wn) for wn, l in all_lots if slug(l['Lot Name']) == key) + '__' + key
    a, b = key.split('__')
    if a in cs_world:            # a Community Space version picture, e.g. beech-byway__market-1
        w, l = cs_world[a]; dest = os.path.join(SITE, 'gallery', w, l, b + '.jpg')
    else:                        # the lot's first Gallery picture, used when there are no screenshots
        dest = os.path.join(SITE, 'gallery', a, b + '.jpg')
    os.makedirs(os.path.dirname(dest), exist_ok=True); shutil.copy(LIVE('_blob', blob), dest); n += 1
print(f"{len(order)} worlds, {len(uploads)} uploads ({len(used_ids)} linked, {len(unlinked)} unlinked), {n} Gallery pictures")
