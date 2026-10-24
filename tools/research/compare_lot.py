"""One of her lots in a save, her Library and the Gallery, side by side (24 Oct, her ask while saving households for the
Gallery: "is the lot in that save the same as the Gallery one?").
    python tools/research/compare_lot.py "Avarice Acres" [save name ...]
Prints, for the Gallery upload, each Library copy and the lot in each save: value, object count and the packs its
objects come from. Saves a picture sheet (Library copy beside the Gallery upload) in for-jemma/lot-compare/.
Saves and Library files are read from temporary copies. Report only.
"""
import collections, glob, io, json, os, pickle, re, shutil, sys, tempfile, urllib.request
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT, slug

P = '.EA.Sims4.Persistence.'
TRAY = os.path.join(os.path.dirname(s4.SAVES), 'Tray')
CACHE = os.path.join(ROOT, 'research', 'data', 'object-packs.json')
PACKS = {"EP01": "Get to Work", "EP02": "Get Together", "EP03": "City Living", "EP04": "Cats & Dogs", "EP05": "Seasons", "EP06": "Get Famous",
         "EP07": "Island Living", "EP08": "Discover University", "EP09": "Eco Lifestyle", "EP10": "Snowy Escape", "EP11": "Cottage Living",
         "EP12": "High School Years", "EP13": "Growing Together", "EP14": "Horse Ranch", "EP15": "For Rent", "EP16": "Lovestruck", "EP17": "Life & Death",
         "GP01": "Outdoor Retreat", "GP02": "Spa Day", "GP03": "Dine Out", "GP04": "Vampires", "GP05": "Parenthood", "GP06": "Jungle Adventure",
         "GP07": "StrangerVille", "GP08": "Realm of Magic", "GP09": "Journey to Batuu", "GP10": "Dream Home Decorator", "GP11": "My Wedding Stories", "GP12": "Werewolves",
         "SP01": "Luxury Party Stuff", "SP02": "Perfect Patio Stuff", "SP03": "Cool Kitchen Stuff", "SP04": "Spooky Stuff", "SP05": "Movie Hangout Stuff",
         "SP06": "Romantic Garden Stuff", "SP07": "Kids Room Stuff", "SP08": "Backyard Stuff", "SP09": "Vintage Glamour Stuff", "SP10": "Bowling Night Stuff",
         "SP11": "Fitness Stuff", "SP12": "Toddler Stuff", "SP13": "Laundry Day Stuff", "SP14": "My First Pet Stuff", "SP15": "Moschino Stuff",
         "SP16": "Tiny Living Stuff", "SP17": "Nifty Knitting", "SP18": "Paranormal Stuff"}
# the Gallery's own pack names that differ from the list above
GALLERY_NAMES = {"Build Lush Gardens": "Romantic Garden Stuff", "Watch Movies with Friends!": "Movie Hangout Stuff", "Strangerville": "StrangerVille", "Tiny Living": "Tiny Living Stuff"}


def object_packs():
    """Object definition id -> pack folder (EP01...), from the game's packages; cached."""
    if os.path.exists(CACHE): return {int(k): v for k, v in json.load(open(CACHE, encoding='utf-8')).items()}
    out = {}
    base = lambda p: os.path.relpath(p, s4.GAME).split(os.sep)[0]
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', '*.package'), recursive=True), key=lambda p: base(p) in ('Data', 'Delta', 'Game')):
        b = base(p); b = 'Base Game' if b in ('Data', 'Delta', 'Game') else b
        try:
            for e in s4.index(p):
                if e[0] in (0xC0DB5AE7, 0x319E4F1D): out.setdefault(e[2], b)
        except Exception: pass
    json.dump({str(k): v for k, v in out.items()}, open(CACHE, 'w', encoding='utf-8'))
    return out


def save_lot(fname, name, S):
    tmp = tempfile.mkdtemp(); c = os.path.join(tmp, 's'); shutil.copy(os.path.join(s4.SAVES, fname), c)
    try:
        ix = s4.index(c); data = s4.read(c, next(e for e in ix if e[0] == s4.SAVEGAME)); zone = None
        for fn, wt, v in s4.fields(data):
            if fn == 7:
                z = s4.decode(v, P + 'ZoneData', S, depth=0)
                if (z.get('name') or '').lower() == name.lower(): zone = z['zone_id']
        for e in ix:
            if e[0] == 0x6 and e[2] == zone:
                d = s4.decode(s4.read(c, e), P + 'ZoneObjectData', S, depth=3)
                ol = d.get('objects'); ol = ol if isinstance(ol, list) else [ol]
                return [ob for o in ol if isinstance(o, dict) for ob in o.get('objects', [])]
    finally: shutil.rmtree(tmp, ignore_errors=True)


def library(name, S):
    """Her Library copies of a lot: [(id, date, value, sku count, picture paths)]."""
    out = []
    for f in glob.glob(os.path.join(TRAY, '0x00000002!*.trayitem')):
        b = open(f, 'rb').read()
        if name.encode() not in b: continue
        try: d = s4.decode(b[8:], '.EA.Sims4.Network.TrayMetadata', S, depth=4)
        except Exception: continue
        bp = (d.get('metadata') or {}).get('bp_metadata')
        if d.get('name', '').lower() != name.lower() or not bp: continue
        iid = f.split('!')[1].split('.')[0]
        pics = sorted(glob.glob(os.path.join(TRAY, f'0x*03!{iid}.bpi')))
        out.append((iid, os.path.getmtime(f), bp.get('price_value'), len((d.get('metadata') or {}).get('sku_bits') or []), pics))
    return sorted(out, key=lambda x: -x[1])


def main():
    import time
    name = sys.argv[1]; save_names = sys.argv[2:]
    S = s4.save_schema(); packs = object_packs()
    t = open(os.path.join(ROOT, 'site', 'js', 'data.js'), encoding='utf-8').read(); D = json.loads(t[t.index('{'):t.rindex('}') + 1])
    lot = next(((w, l) for w in D['worlds'] for h in w['hoods'] for l in h['lots'] if l['lot'].lower() == name.lower() or (l.get('mine') or '').lower() == name.lower()), None)
    U = json.load(open(os.path.join(ROOT, 'data', 'gallery', 'uploads.json'), encoding='utf-8'))['uploads']
    raw = {}
    for f in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json')):
        for l in json.load(open(f, encoding='utf-8')).get('lots', []):
            if l.get('lot', '').lower() == name.lower() and l.get('gallery'): raw = l
    gid = raw['gallery'][-1] if raw else None
    if not gid:   # the site's lot record: find its upload by title
        gid = next((k for k, v in U.items() if v['title'].lower() == name.lower() and v['kind'] in ('lot', 'room') and not v.get('gone')), None)
    gp = set()
    if gid:
        u = U[gid]; gp = {GALLERY_NAMES.get(re.sub(r'^The Sims™ 4 ', '', p), re.sub(r'^The Sims™ 4 ', '', p)) for p in u['packs']}
        print(f"Gallery: §{u['price']:,}, {len(gp)} packs: {', '.join(sorted(gp))}")
    lib = library(name, S)
    for iid, mt, price, n, pics in lib: print(f"Library copy {time.strftime('%d %b %Y', time.localtime(mt))}: §{price:,}, {n} packs")
    names = {}
    for p in os.listdir(s4.SAVES):
        if p.endswith('.save') and '--' not in p and 'ffffffff' not in p:
            try: names.setdefault(s4.save_name(s4.read_save(os.path.join(s4.SAVES, p)), S)[0], p)
            except Exception: pass
    for sv in save_names:
        objs = save_lot(names[sv], name, S) if sv in names else None
        if not objs: print(f"“{sv}”: lot not found"); continue
        c = collections.Counter(PACKS.get(packs.get(o.get('guid'), '?'), packs.get(o.get('guid'), '?')) for o in objs)
        c.pop('Base Game', None)
        have = set(c)
        print(f"“{sv}”: {len(objs)} objects; packs {', '.join(f'{k} ({v})' for k, v in c.most_common())}")
        if gp: print(f"    not in the Gallery copy: {', '.join(sorted(have - gp)) or 'none'}; Gallery packs it lacks: {', '.join(sorted(gp - have)) or 'none'}")
    if lib and gid and lib[0][4]:
        sys.path.insert(0, os.path.join(ROOT, 'tools')); import tray_pictures as tp
        from PIL import Image, ImageDraw
        left = []
        for f in lib[0][4]:
            im = tp.read(f); left.append((im if isinstance(im, Image.Image) else Image.open(io.BytesIO(im))).convert('RGB'))
        right = []
        for x in U[gid]['images'][:len(left)]:
            im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(x, headers={'User-Agent': 'JemmasSimWorld/1.0'}), timeout=30).read())).convert('RGB')
            right.append(im.crop((67, 0, 677, 410)) if im.size == (744, 410) else im)
        w, h = 600, 400; out = Image.new('RGB', (2 * w + 20, len(left) * (h + 10) + 40), 'white'); d = ImageDraw.Draw(out)
        d.text((10, 10), f"Library copy ({time.strftime('%d %b %Y', time.localtime(lib[0][1]))})", fill='black'); d.text((w + 30, 10), 'Gallery upload', fill='black')
        for r, (a, b) in enumerate(zip(left, right)):
            out.paste(a.resize((w, h)), (0, 40 + r * (h + 10))); out.paste(b.resize((w, h)), (w + 20, 40 + r * (h + 10)))
        dest = os.path.join(ROOT, 'for-jemma', 'lot-compare', slug(name) + '.jpg'); os.makedirs(os.path.dirname(dest), exist_ok=True)
        out.save(dest, quality=85); print('pictures:', os.path.relpath(dest, ROOT))


if __name__ == '__main__':
    main()
