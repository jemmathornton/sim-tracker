"""Jemma's plan compared with the game's own files: lot names, sizes, neighbourhoods and lot types.

    python tools/research/plan_vs_game.py

Needs research/data/game-lots.json, world-lots.json and game-venues.json (game_lots.py, world_files.py, game_venues.py).
The current lot type in her game comes from her newest "Building" save, for shared lots only (her rule).
Writes research/data/plan-vs-game.json; the write-up is research/plan-vs-game.md.
"""
import json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, load, norm, world_files

D = lambda f: load(os.path.join(ROOT, 'research', 'data', f))
FOLDER_WORLD = {"EP01": "Magnolia Promenade", "EP02": "Windenburg", "EP03": "San Myshuno", "EP04": "Brindleton Bay", "EP06": "Del Sol Valley",
                "EP07": "Sulani", "EP08": "Britechester", "EP09": "Evergreen Harbor", "EP10": "Mt. Komorebi", "EP11": "Henford-on-Bagley",
                "EP12": "Copperdale", "EP13": "San Sequoia", "EP14": "Chestnut Ridge", "EP15": "Tomarang", "EP16": "Ciudad Enamorada",
                "EP17": "Ravenwood", "EP18": "Nordhaven", "EP19": "Innisgreen", "EP20": "Gibbi Point", "EP21": "Ondarion",
                "GP01": "Granite Falls", "GP04": "Forgotten Hollow", "GP06": "Selvadorada", "GP07": "StrangerVille", "GP08": "Glimmerbrook",
                "GP09": "Batuu", "GP11": "Tartosa", "GP12": "Moonwood Mill"}
PREFIX_WORLD = {"GD": "Willow Creek", "SO": "Oasis Springs", "BG": "Newcrest", "EP15": "Tomarang"}
TEST = re.compile(r'test|perftest|sqe|chiron', re.I)


def world_of(rec):
    if rec['folder'] in FOLDER_WORLD: return FOLDER_WORLD[rec['folder']]
    return PREFIX_WORLD.get(rec['area'].split('_')[0])


def size_key(s): return tuple(sorted(int(x) for x in re.findall(r'\d+', s or '')[:2])) if re.match(r'^\d+x\d+$', s or '') else None


def main():
    game, worldlots, venues = D('game-lots.json')['lots'], D('world-lots.json')['lots'], D('game-venues.json')['venues']
    # game lots by world
    by_world = {}
    for lid, w in worldlots.items():
        g = game.get(lid, {}); wn = world_of(w)
        if not wn or not g.get('name') or TEST.search(g['name']): continue
        by_world.setdefault(wn, []).append({"id": lid, "name": g['name'], "description": g.get('description', ''), "size": w['size'], "area": w['area'], "pos": w['pos']})
    # her save: current lot type for shared lots
    current = current_types()
    uploads = load(os.path.join(ROOT, 'data', 'gallery', 'uploads.json'))['uploads']
    def gallery_type(l):   # the lot type on the upload that leads (her choice, else the most favourited)
        ids = [i for i in l.get('gallery') or [] if i in uploads]
        lead = l.get('galleryLead') if l.get('galleryLead') in uploads else max(ids, key=lambda i: uploads[i].get('favourites', 0), default=None)
        return uploads[lead].get('lotType') or None if lead else None
    out = {}
    for wf in world_files():
        W = load(wf); wn = W['name']; glots = by_world.get(wn, [])
        gidx = {norm(g['name']): g for g in glots}
        matched, rows = set(), []
        for h in W['neighbourhoods']:
            for l in h['lots']:
                g = gidx.get(norm(l['lot']))
                unit_of = None
                if not g:   # an apartment unit of a building listed under another unit's name ("17 Culpepper House" -> "20 Culpepper House")
                    base = norm(re.sub(r'^\s*(\d+[A-Z]?|[IVXL]+)\s+|\s*#\s*\d+\s*$', '', l['lot']))
                    cands = [x for x in glots if norm(re.sub(r'^\s*(\d+[A-Z]?|[IVXL]+)\s+|\s*#\s*\d+\s*$', '', x['name'])) == base]
                    if len(cands) == 1: g = cands[0]; unit_of = g['name']
                if g: matched.add(g['id'])
                row = {"neighbourhood": h['name'], "lot": l['lot'], "myName": l.get('myName'), "planSize": l.get('size'), "planType": l.get('type'),
                       "shared": l.get('shared'), "game": g and {"name": g['name'], "size": g['size'], "area": g['area'], "id": g['id']}, "unitOf": unit_of}
                if g and l.get('shared') is True and g['id'] in current: row["typeInGame"] = venues.get(str(current[g['id']]), {}).get('name')
                if gallery_type(l): row["typeOnGallery"] = gallery_type(l)
                rows.append(row)
        missing = [g for g in glots if g['id'] not in matched]
        out[wn] = {"owned": W['owned'], "lots": rows, "gameLotsNotInPlan": missing,
                   "areas": sorted({g['area'] for g in glots})}
    # Innisgreen and Batuu have no plan file
    for wn in ('Innisgreen', 'Batuu'):
        if wn in by_world and not out.get(wn, {}).get('lots'):
            out[wn] = {"owned": False, "lots": [], "gameLotsNotInPlan": by_world[wn], "areas": sorted({g['area'] for g in by_world[wn]})}
    with open(os.path.join(ROOT, 'research', 'data', 'plan-vs-game.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump({"_note": "Plan lots matched to the game's lots (tools/research/plan_vs_game.py).", "worlds": out}, f, ensure_ascii=False, indent=1)
    return out


def current_types():
    """game lot id -> lot type id currently set in her newest Building save (lots only)."""
    import sims4files as s4
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import lot_traits as lt
    p, label, by_world = lt.building_saves()[0]
    cur = {}
    for zs in by_world.values():
        for z in zs:
            v = z.get('gameplay_zone_data')
            if isinstance(v, (bytes, bytearray)):
                gz = s4.decode(v, '.EA.Sims4.Persistence.GameplayZoneData', lt.SCHEMA, depth=0)
                if gz.get('venue_type_id_on_save'): cur[str(z.get('lot_id'))] = gz['venue_type_id_on_save']
    return cur


if __name__ == '__main__':
    out = main()
    n = sum(len(w['lots']) for w in out.values()); m = sum(1 for w in out.values() for r in w['lots'] if r['game'])
    print(f"{m} of {n} plan lots matched to a game lot; {sum(len(w['gameLotsNotInPlan']) for w in out.values())} game lots not in the plan")
