"""Lot traits for Jemma's shared lots, from her newest "Building" save.

    python tools/lot_traits.py            report only (changes nothing)
    python tools/lot_traits.py --apply    write the traits (and lot challenges) into data/worlds/*.json and rebuild the site
    python tools/lot_traits.py --game     also re-read the trait names from the game (after a game update or a new pack)

The save is read from a temporary copy; her saves and the game are never changed. Only lots marked shared in the plan
get traits (unshared lots may not be finished, her rule of 13 Oct). In the "Building" saves only lots are looked at, not Sims.
A save lot is matched to a plan lot in the same world by name: the save's lot name against the lot's in-game name,
her own name, its display name and its Gallery titles.
"""
import glob, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, DATA, GALLERY, norm, load, save, world_files
import sims4files as s4

TRAITS_FILE = os.path.join(DATA, 'game', 'lot-traits.json')
P = '.EA.Sims4.Persistence.'


def trait_names(refresh=False):
    """The game's own names for every lot trait and lot challenge (they're 'zone modifiers' in its files). Most names sit on
    a separate display record (ZoneModifierDisplayInfo) that points at the trait; older City Living ones carry their own.
    Zone modifiers with no name are hidden game markers and never shown."""
    if os.path.exists(TRAITS_FILE) and not refresh: return load(TRAITS_FILE)['traits']
    text = s4.english(); recs = s4.simdata_records('ZoneModifier', 'ZoneModifierDisplayInfo'); out = {}
    def add(i, row, tuning, kind):
        name = text.get(row.get('zone_modifier_name', ('text', 0))[1], '').strip()
        if name: out[str(i)] = {"name": name, "kind": kind, "tuning": tuning,
                                "description": text.get(row.get('zone_modifier_description', ('text', 0))[1], '').strip()}
    for i, rec in recs['ZoneModifier'].items():
        add(i, rec['row'], rec['tuning'], "trait")
    for rec in recs['ZoneModifierDisplayInfo'].values():
        ref = rec['row'].get('zone_modifier_reference')
        if ref: add(ref, rec['row'], recs['ZoneModifier'].get(ref, {}).get('tuning', rec['tuning']), "challenge" if rec['row'].get('modifier_type') else "trait")
    save(TRAITS_FILE, {"_note": "Lot traits and lot challenges, from the game's own files (tools/lot_traits.py --game). Keyed by the game's id.", "traits": out})
    return out


def newest_building_save(schema):
    """(file, data, name) of the most recently saved slot whose name, or the save it autosaved, starts with 'Building'."""
    for p in sorted(glob.glob(os.path.join(s4.SAVES, '*.save')), key=os.path.getmtime, reverse=True):
        data = s4.read_save(p)
        name, base = s4.save_name(data, SCHEMA)
        if name.startswith('Building') or base.startswith('Building'):
            return p, data, (base or name) + (' (autosave)' if name == 'Autosave' else '')
    sys.exit('No save called "Building…" found.')


# Lots whose name in the game differs from every name the plan knows (world|in-game lot name -> name in her save).
# Only add a line once Jemma has confirmed it.
SAVE_NAMES = {
    "Oasis Springs|Cacti Casa": "Palm Spring Public Pool",            # her Palm Springs Public Pool
    "Willow Creek|Magnolia Blossom Park": "Magnolia Blossom",
}


def bare(n): return norm(re.sub(r'\s*[\[(][^\])]*[\])]\s*$', '', n or ''))


def candidates(l, uploads):
    names = {l['lot'], l.get('myName') or '', l.get('displayName') or ''}
    names |= {uploads[i]['title'] for i in l.get('gallery', []) if i in uploads}
    return {bare(n) for n in names if n and n.strip('? ')}


def main():
    apply, refresh = '--apply' in sys.argv, '--game' in sys.argv
    traits = trait_names(refresh)
    path, data, sname = newest_building_save(SCHEMA)
    top = s4.fields(data)
    worlds = {}
    for f, wt, v in top:
        if f == 4:
            n = s4.decode(v, P + 'NeighborhoodData', SCHEMA, depth=0); worlds[n.get('neighborhood_id')] = n.get('name', '')
    zones = [s4.decode(v, P + 'ZoneData', SCHEMA, depth=0) for f, wt, v in top if f == 7]
    by_world = {}
    for z in zones: by_world.setdefault(worlds.get(z.get('neighborhood_id'), ''), []).append(z)
    uploads = load(os.path.join(GALLERY, 'uploads.json'))['uploads']

    print(f"Save: {sname}, {os.path.basename(path)}\n")
    changed, unmatched, ambiguous, n_shared, n_found = [], [], [], 0, 0
    files = world_files()
    for wf in files:
        W = load(wf); touched = False
        if not W['owned']: continue
        zs = by_world.get(W['name'], [])
        if not zs: print(f"  {W['name']}: not in this save"); continue
        for h in W['neighbourhoods']:
            for l in h['lots']:
                if l.get('shared') is not True: continue
                n_shared += 1
                alias = SAVE_NAMES.get(W['name'] + '|' + l['lot'])
                want = {bare(alias)} if alias else candidates(l, uploads)
                # special lots like The Magic Realm are a little world of their own in the save
                pool = list({id(z): z for z in zs + by_world.get(l.get('myName') or '', []) + by_world.get(l['lot'], [])}.values())
                hits = [z for z in pool if bare(z.get('name')) in want]
                if len(hits) > 1:   # prefer the lot whose save name is exactly her name for it
                    exact = [z for z in hits if bare(z.get('name')) == bare(alias or l.get('displayName') or l.get('myName') or l['lot'])]
                    hits = exact if len(exact) == 1 else hits
                if not hits: unmatched.append(f"{W['name']} / {l.get('myName') or l['lot']}"); continue
                if len(hits) > 1: ambiguous.append(f"{W['name']} / {l.get('myName') or l['lot']} ({len(hits)} lots in the save have that name)"); continue
                n_found += 1
                got = {"traits": [], "challenges": []}
                for t in hits[0].get('lot_traits', []):
                    if str(t) in traits: got["challenges" if traits[str(t)]['kind'] == 'challenge' else "traits"].append(traits[str(t)]['name'])
                if any(got[k] != l.get(k, []) for k in got):
                    changed.append(f"{W['name']} / {l.get('myName') or l['lot']}: {', '.join(got['traits']) or '(no traits)'}" + (f"; challenges: {', '.join(got['challenges'])}" if got['challenges'] else ""))
                    if apply:
                        for k, v in got.items():
                            if v: l[k] = v
                            else: l.pop(k, None)
                        touched = True
        if touched: save(wf, W)
    print(f"{n_found} of {n_shared} shared lots found in the save.\n")
    for title, items in [("Traits " + ("written" if apply else "to write (run with --apply)"), changed),
                         ("Shared lots not found in the save by name", unmatched), ("Several lots with the same name", ambiguous)]:
        print(f"{title}: {len(items)}")
        for x in items: print("  " + x)
        print()
    if apply and changed:
        r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
        print((r.stdout or r.stderr).strip())


SCHEMA = s4.save_schema()
if __name__ == '__main__':
    main()
