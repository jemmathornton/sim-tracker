"""Lot traits for Jemma's shared lots, from her newest "Building" save.

    python tools/lot_traits.py            report only (changes nothing)
    python tools/lot_traits.py --apply    write the traits (and lot challenges) into data/worlds/*.json and rebuild the site;
                                          rentals also get `units`: each unit's own name and traits, in the game's unit order
    python tools/lot_traits.py --game     also re-read the trait names from the game (after a game update or a new pack)

The save is read from a temporary copy; her saves and the game are never changed. Only lots marked shared in the plan
get traits (unshared lots may not be finished, her rule of 13 Oct). One exception, hers (16 Oct): rentals get their
unit names and unit traits even before they're shared. In the "Building" saves only lots are looked at, not Sims.
Her newest "Building" save is used first; an older one only for lots the newest no longer has (e.g. The Old Salt House,
whose lot now holds Bubble World). A save lot is matched to a plan lot in the same world by name: the save's lot name against the lot's in-game name,
her own name, its display name and its Gallery titles.
"""
import glob, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, DATA, GALLERY, norm, load, save, world_files
import sims4files as s4

# For Rent's hidden markers on rental units (the game's repair-event checks: has electrics, water, a toilet, a bin); not lot traits
HIDDEN = {347990, 347991, 347992, 347995}
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
STALE_COUNTS = {"Rio Verde", "Sequoia Cottage", "Spring Steppes"}   # unit 1's bedrooms/bathrooms are the whole building's (22 Oct)
SAVE_NAMES = {
    "Oasis Springs|Cacti Casa": "Palm Spring Public Pool",            # her Palm Springs Public Pool
    "Willow Creek|Magnolia Blossom Park": "Magnolia Blossom",
    # confirmed by Jemma 13 Oct: shell-challenge builds keep their challenge names in the game, and some lots were renamed
    "Windenburg|Coorinberg Cottage": "Shark Shell Challenge",
    "Glimmerbrook|Brooks Bridge Borough": "Simsie Puzzle Shell",
    "Windenburg|Von-Windenburg Estate": "Von Castle",
    "Henford-on-Bagley|5 Cobblebottom Street": "Finchwick Library",   # her Finchwick Village Hall
    "San Sequoia|Anchorpoint Abode": "On Point",                     # her Anchorpoint Works
    "Brindleton Bay|Bedlington Boathouse": "Barn Conversion",         # her Bedlington Barn (confirmed 14 Oct)
    "San Sequoia|Sequoia Cottage": "Sequoia Cottages",               # plural in game: two units (confirmed 22 Oct)
}


def unit_name(name, lot_names):
    """A unit's own part of its name: '3A Cobblebottom Street' on the lot '3 Cobblebottom Street' is '3A', '1 Rio Verde' on Rio Verde is '1'.
    Words it shares at the end with the lot's name are dropped; a name with nothing in common is kept whole."""
    w = name.split()
    for ln in lot_names:
        lw, k = (ln or '').split(), 0
        while k < min(len(w) - 1, len(lw)) and w[-1 - k].lower() == lw[-1 - k].lower(): k += 1
        if k: return " ".join(w[:len(w) - k])
    return name


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
    unknown = set()
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

    def rental_units(l, hit, src):
        """Each unit of a rental: its own name (as she named it in the game, shortened to what isn't the lot's name) and traits,
        in the game's unit order. Empty for anything that isn't a rental split into units."""
        if not re.search(r'rental', l.get('type') or '', re.I): return []
        units = []
        for z in sorted({id(z): z for zs in src.values() for z in zs if z.get('lot_id') == hit.get('lot_id')}.values(), key=lambda z: z.get('active_plex') or 0):
            if z.get('active_plex') in (None, 0, 300): continue   # 300 is the building's own record, the units are 301, 302…
            u = {"name": unit_name(z.get('name', ''), [l['lot'], hit.get('name', '')])}
            # bedrooms and bathrooms where the game has recorded them for the unit (her ask, 22 Oct); 0 means not recorded.
            # Not where unit 1 still holds the whole building's count from before the split (STALE_COUNTS)
            if z.get('bedroom_count') and l['lot'] not in STALE_COUNTS: u.update(beds=z['bedroom_count'], baths=z.get('bathroom_count') or None)
            for t in z.get('lot_traits', []):
                if str(t) in traits: u.setdefault("challenges" if traits[str(t)]['kind'] == 'challenge' else "traits", []).append(traits[str(t)]['name'])
                elif t not in HIDDEN: unknown.add(t)
            units.append(u)
        # all-number names (Taka Soi 15's 09 and 08) in number order, not the game's (her call, 22 Oct)
        if all(u['name'].isdigit() for u in units): units.sort(key=lambda u: int(u['name']))
        return units if len(units) > 1 else []

    def note_units(label, l, units):
        if units == l.get('units', []): return False
        changed.append(f"{label}: units " + ("; ".join(u['name'] + (f" ({', '.join(u.get('traits', []) + u.get('challenges', []))})" if u.get('traits') or u.get('challenges') else "") for u in units) or "removed"))
        if apply:
            if units: l['units'] = units
            else: l.pop('units', None)
        return apply

    # lots (by the game's lot id, which stays the same when a lot is renamed) already matched in the newest save
    # can't be handed to another plan lot from an older save: Bedlington Boathouse in "Building" is Brindleton Boathouse now
    first = {id(l): find(W, l, saves[0][2]) for W, l in shared}
    claimed = {h[0].get('lot_id') for h in first.values() if len(h) == 1}
    for wf, W in worlds:
        touched = False
        if not W['owned']: continue
        for h in W['neighbourhoods']:
            for l in h['lots']:
                if l.get('shared') is not True:   # her rule: nothing from a save on unshared lots, so traits go if a lot stops being shared
                    if l.get('traits') or l.get('challenges'):
                        changed.append(f"{W['name']} / {l.get('myName') or l['lot']}: not shared any more, traits removed")
                        if apply: l.pop('traits', None); l.pop('challenges', None); touched = True
                    # her exception (16 Oct): rentals get their unit names and unit traits from the save even before they're shared
                    hits = find(W, l, saves[0][2]) if re.search(r'rental', l.get('type') or '', re.I) else []
                    if len(hits) == 1 and note_units(f"{W['name']} / {l.get('myName') or l['lot']} (not shared yet)", l, rental_units(l, hits[0], saves[0][2])): touched = True
                    continue
                n_shared += 1
                label = f"{W['name']} / {l.get('myName') or l['lot']}"
                hits, src = first[id(l)], saves[0][2]
                for p, sname, by_world in ([] if hits else saves[1:]):    # older saves only for lots the newest doesn't have
                    hits, src = find(W, l, by_world, claimed), by_world
                    if hits: older.append(f"{label} (from {sname})"); break
                if not hits: unmatched.append(label); continue
                if len(hits) > 1: ambiguous.append(f"{label} ({len(hits)} lots in the save have that name)"); continue
                n_found += 1
                got = {"traits": [], "challenges": []}
                # a rental split into units keeps its traits on the units ("1 Spring Steppes"), not on the building's own record
                # (apartment units share their building's id too, but each has its own traits, so only rentals look further)
                same = [hits[0]]
                if not hits[0].get('lot_traits') and re.search(r'rental', l.get('type') or '', re.I):
                    same += [z for z in {id(z): z for zs in src.values() for z in zs}.values() if z is not hits[0] and z.get('lot_id') == hits[0].get('lot_id')]
                for t in dict.fromkeys(t for z in same for t in z.get('lot_traits', [])):
                    if str(t) in traits: got["challenges" if traits[str(t)]['kind'] == 'challenge' else "traits"].append(traits[str(t)]['name'])
                units = rental_units(l, hits[0], src)
                if note_units(label, l, units): touched = True
                if any(got[k] != l.get(k, []) for k in got):
                    changed.append(f"{label}: {', '.join(got['traits']) or '(no traits)'}" + (f"; challenges: {', '.join(got['challenges'])}" if got['challenges'] else ""))
                    if apply:
                        for k, v in got.items():
                            if v: l[k] = v
                            else: l.pop(k, None)
                        touched = True
        if touched: save(wf, W)
    print(f"{n_found} of {n_shared} shared lots found in the saves.\n")
    if unknown: print("Trait ids with no name yet (run with --game after a game update): " + ", ".join(map(str, sorted(unknown))), end="\n\n")
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
