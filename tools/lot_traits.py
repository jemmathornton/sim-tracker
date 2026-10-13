"""Lot traits for Jemma's shared lots, from her newest "Building" save.

    python tools/lot_traits.py            report only (changes nothing)
    python tools/lot_traits.py --apply    write the traits (and lot challenges) into data/worlds/*.json and rebuild the site
    python tools/lot_traits.py --game     also re-read the trait names from the game (after a game update or a new pack)

The save is read from a temporary copy; her saves and the game are never changed. Only lots marked shared in the plan
get traits (unshared lots may not be finished, her rule of 13 Oct). In the "Building" saves only lots are looked at, not Sims.
Her newest "Building" save is used first; an older one only for lots the newest no longer has (e.g. The Old Salt House,
whose lot now holds Bubble World). A save lot is matched to a plan lot in the same world by name: the save's lot name against the lot's in-game name,
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


def building_saves():
    """The newest copy of each of her "Building…" saves, newest first: [(file, label, {world name: [lot records]})].
    An autosave counts as the save it was made from."""
    out, seen = [], set()
    for p in sorted(glob.glob(os.path.join(s4.SAVES, '*.save')), key=os.path.getmtime, reverse=True):
        data = s4.read_save(p)
        name, base = s4.save_name(data, SCHEMA); own = base or name
        if not own.startswith('Building') or own in seen: continue
        seen.add(own)
        top = s4.fields(data); worlds, by_world = {}, {}
        for f, wt, v in top:
            if f == 4:
                n = s4.decode(v, P + 'NeighborhoodData', SCHEMA, depth=0); worlds[n.get('neighborhood_id')] = n.get('name', '')
        for f, wt, v in top:
            if f == 7:
                z = s4.decode(v, P + 'ZoneData', SCHEMA, depth=0); by_world.setdefault(worlds.get(z.get('neighborhood_id'), ''), []).append(z)
        out.append((p, own + (' (autosave)' if name == 'Autosave' else ''), by_world))
    if not out: sys.exit('No save called "Building…" found.')
    return out


# Lots whose name in the game differs from every name the plan knows (world|in-game lot name -> name in her save).
# Only add a line once Jemma has confirmed it.
SAVE_NAMES = {
    "Oasis Springs|Cacti Casa": "Palm Spring Public Pool",            # her Palm Springs Public Pool
    "Willow Creek|Magnolia Blossom Park": "Magnolia Blossom",
    # confirmed by Jemma 13 Oct: shell-challenge builds keep their challenge names in the game, and some lots were renamed
    "Windenburg|Coorinberg Cottage": "Shark Shell Challenge",
    "Evergreen Harbor|Rockridge Springs": "Simsie Townhouse Shell",
    "Glimmerbrook|Brooks Bridge Borough": "Simsie Puzzle Shell",
    "Windenburg|Von-Windenburg Estate": "Von Castle",
    "Henford-on-Bagley|5 Cobblebottom Street": "Finchwick Library",   # her Finchwick Village Hall
    "San Sequoia|Anchorpoint Abode": "On Point",                     # her Anchorpoint Works
}


def bare(n): return norm(re.sub(r'\s*[\[(][^\])]*[\])]\s*$', '', n or ''))


def candidates(l, uploads):
    names = {l['lot'], l.get('myName') or '', l.get('displayName') or ''}
    names |= {uploads[i]['title'] for i in l.get('gallery', []) if i in uploads}
    return {bare(n) for n in names if n and n.strip('? ')}


def main():
    apply, refresh = '--apply' in sys.argv, '--game' in sys.argv
    traits = trait_names(refresh)
    saves = building_saves()
    uploads = load(os.path.join(GALLERY, 'uploads.json'))['uploads']
    print("Saves: " + "; ".join(f"{label} ({os.path.basename(p)})" for p, label, _ in saves), end="\n\n")
    changed, unmatched, ambiguous, older, n_shared, n_found = [], [], [], [], 0, 0
    worlds = [(wf, load(wf)) for wf in world_files()]
    shared = [(W, l) for wf, W in worlds if W['owned'] for h in W['neighbourhoods'] for l in h['lots'] if l.get('shared') is True]

    def find(W, l, by_world, skip=()):
        alias = SAVE_NAMES.get(W['name'] + '|' + l['lot'])
        want = {bare(alias)} if alias else candidates(l, uploads)
        # special lots like The Magic Realm are a little world of their own in the save
        pool = list({id(z): z for z in by_world.get(W['name'], []) + by_world.get(l.get('myName') or '', []) + by_world.get(l['lot'], [])}.values())
        hits = [z for z in pool if bare(z.get('name')) in want and z.get('lot_id') not in skip]
        if len(hits) > 1:   # prefer the lot whose save name is exactly her name for it
            exact = [z for z in hits if bare(z.get('name')) == bare(alias or l.get('displayName') or l.get('myName') or l['lot'])]
            hits = exact if len(exact) == 1 else hits
        return hits

    # lots (by the game's lot id, which stays the same when a lot is renamed) already matched in the newest save
    # can't be handed to another plan lot from an older save: Bedlington Boathouse in "Building" is Brindleton Boathouse now
    first = {id(l): find(W, l, saves[0][2]) for W, l in shared}
    claimed = {h[0].get('lot_id') for h in first.values() if len(h) == 1}
    for wf, W in worlds:
        touched = False
        if not W['owned']: continue
        for h in W['neighbourhoods']:
            for l in h['lots']:
                if l.get('shared') is not True: continue
                n_shared += 1
                label = f"{W['name']} / {l.get('myName') or l['lot']}"
                hits = first[id(l)]
                for p, sname, by_world in ([] if hits else saves[1:]):    # older saves only for lots the newest doesn't have
                    hits = find(W, l, by_world, claimed)
                    if hits: older.append(f"{label} (from {sname})"); break
                if not hits: unmatched.append(label); continue
                if len(hits) > 1: ambiguous.append(f"{label} ({len(hits)} lots in the save have that name)"); continue
                n_found += 1
                got = {"traits": [], "challenges": []}
                for t in hits[0].get('lot_traits', []):
                    if str(t) in traits: got["challenges" if traits[str(t)]['kind'] == 'challenge' else "traits"].append(traits[str(t)]['name'])
                if any(got[k] != l.get(k, []) for k in got):
                    changed.append(f"{label}: {', '.join(got['traits']) or '(no traits)'}" + (f"; challenges: {', '.join(got['challenges'])}" if got['challenges'] else ""))
                    if apply:
                        for k, v in got.items():
                            if v: l[k] = v
                            else: l.pop(k, None)
                        touched = True
        if touched: save(wf, W)
    print(f"{n_found} of {n_shared} shared lots found in the saves.\n")
    for title, items in [("Traits " + ("written" if apply else "to write (run with --apply)"), changed), ("Found only in an older save", older),
                         ("Shared lots not found in the saves by name", unmatched), ("Several lots with the same name", ambiguous)]:
        print(f"{title}: {len(items)}")
        for x in items: print("  " + x)
        print()
    if apply and changed:
        r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
        print((r.stdout or r.stderr).strip())


SCHEMA = s4.save_schema()
if __name__ == '__main__':
    main()
