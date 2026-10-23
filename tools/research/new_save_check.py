"""Her new save against the plan (23 Oct, the day she started "Jemma's Sim World" and began placing her builds).
    python tools/research/new_save_check.py            report: research/new-save-status.md (+ research/data/new-save-status.json)
    python tools/research/new_save_check.py --baseline  first run only: note the game's own lots (names and object
                                                        counts) from a fresh, untouched save, to tell placed lots apart

For every lot of every owned world: is her build placed (it differs from the game's own lot), the name in the save,
lot traits and challenges against the plan, rental units and their traits, the Community Space version that's active.
Then every household on the site with Sims: where it lives in the save, and where the plan puts it (tenants into their
units), so the ones moved out while she placed builds can go back. Saves are read from temporary copies. Report only.
"""
import json, os, re, shutil, sys, tempfile, time, unicodedata
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT, DATA, load, save

S = s4.save_schema(); P = '.EA.Sims4.Persistence.'
SAVE_NAME = "Jemma's Sim World"
BASELINE = os.path.join(ROOT, 'research', 'data', 'new-save-baseline.json')
SUBVENUES = {223944: "Community space", 223946: "Garden", 223945: "Market", 231465: "Makers"}   # research/data/game-venues.json
TN = {int(k): v['name'] for k, v in load(os.path.join(DATA, 'game', 'lot-traits.json'))['traits'].items()}
MOD_TRAITS = {14633906698125574705: "Dress Code (LittleMsSam mod)"}   # traits from her Mods folder (found 23 Oct); not counted as differences
TN.update(MOD_TRAITS)
OPTIONS = {}   # the save's game options, read with the save (23 Oct)
PETS = set()   # pets' names in the save (never counted as a household's extra Sims)
norm = lambda s: re.sub(r'\s+', ' ', (s or '').replace('’', "'")).strip().lower()


def unit_name(l, pos):
    """The plan's unit numbers are positions (1st, 2nd…); show the unit's own name (Taka Soi 15's 2nd unit is 09)."""
    names = [u['name'] for u in (l.get('units') or [])]
    return names[int(pos) - 1] if str(pos).isdigit() and 0 < int(pos) <= len(names) else str(pos)


def read(fname):
    """{(world, lot_id): zone info}, households, Sims, from a copy of one save."""
    tmp = tempfile.mkdtemp(); c = os.path.join(tmp, 's'); shutil.copy(os.path.join(s4.SAVES, fname), c)
    try:
        ix = s4.index(c); data = s4.read(c, next(e for e in ix if e[0] == s4.SAVEGAME))
        hoods, zones, hhs, sims = {}, {}, [], {}
        top = s4.fields(data)
        for fn, wt, v in top:
            if fn == 4: n = s4.decode(v, P + 'NeighborhoodData', S, depth=0); hoods[n.get('neighborhood_id')] = n.get('name', '')
        objs = {}
        for e in ix:
            if e[0] != 0x6: continue
            d = s4.decode(s4.read(c, e), P + 'ZoneObjectData', S, depth=2)
            ol = d.get('objects'); ol = ol if isinstance(ol, list) else [ol]
            objs[e[2]] = {"n": sum(len(o.get('objects', [])) for o in ol if isinstance(o, dict)), "active": d.get('active_data_index'), "subs": d.get('sub_venue_keys')}
        for fn, wt, v in top:
            if fn == 7:
                z = s4.decode(v, P + 'ZoneData', S, depth=0); o = objs.get(z['zone_id'], {})
                zones[z['zone_id']] = {"world": hoods.get(z.get('neighborhood_id'), ''), "lot_id": z.get('lot_id'), "name": z.get('name', ''),
                                       "plex": z.get('active_plex') or 0, "traits": [TN.get(t, str(t)) for t in z.get('lot_traits', [])],
                                       "objs": o.get('n', 0), "active": o.get('active'), "subs": o.get('subs')}
            elif fn == 5: hhs.append(s4.decode(v, P + 'HouseholdData', S, depth=2))
            elif fn == 6:
                sm = s4.decode(v, P + 'SimData', S, depth=0); sims[sm.get('sim_id')] = f"{sm.get('first_name', '')} {sm.get('last_name', '')}".strip()
                if sm.get('extended_species') not in (None, 0, 1): PETS.add(sims[sm.get('sim_id')])   # cats, dogs, horses, foxes
        name = s4.save_name(data, S)
        tops = {f: v for f, wt, v in top if f in (2, 3)}
        try:
            acct = s4.decode(tops[3], P + 'AccountData', S, depth=6); slot = s4.decode(tops[2], P + 'SaveSlotData', S, depth=6)
            OPTIONS.update((acct.get('gameplay_account_data') or {}).get('gameplay_options') or {})
            hs = (slot.get('gameplay_data') or {}).get('holiday_service') or {}
            OPTIONS['_own_holidays'] = [h.get('name') for h in hs.get('holidays', []) if h.get('name')]
        except Exception as e: OPTIONS['_error'] = str(e)
        return name, zones, hhs, sims
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def find_save():
    best = None
    for p in os.listdir(s4.SAVES):
        if not p.endswith('.save'): continue
        try: n = s4.save_name(s4.read_save(os.path.join(s4.SAVES, p)), S)
        except Exception: continue
        if SAVE_NAME in n and n[0] != 'Autosave':
            t = os.path.getmtime(os.path.join(s4.SAVES, p))
            if not best or t > best[1]: best = (p, t)
    return best


def plan():
    t = open(os.path.join(ROOT, 'site', 'js', 'data.js'), encoding='utf-8').read()
    return json.loads(t[t.index('{'):t.rindex('}') + 1])


def main():
    if '--baseline' in sys.argv:
        f = sys.argv[sys.argv.index('--baseline') + 1] if len(sys.argv) > sys.argv.index('--baseline') + 1 else 'Slot_00001119.save'
        name, zones, _, _ = read(f)
        save(BASELINE, {"_note": f"The game's own lots, from the untouched save {name[0]!r} ({f}, {time.strftime('%Y-%m-%d')}): name and object count by world|lot id|plex.",
                        "lots": {f"{z['world']}|{z['lot_id']}|{z['plex']}": {"name": z['name'], "objs": z['objs']} for z in zones.values()}})
        print('baseline from', f, name, len(zones)); return
    base = load(BASELINE)['lots']
    f = find_save()
    if not f: sys.exit(f"No save called {SAVE_NAME!r} found")
    fname, mtime = f
    name, zones, hhs, sims = read(fname)
    D = plan()
    by_lot = {}
    for zid, z in zones.items(): by_lot.setdefault((z['world'], z['lot_id']), []).append((zid, z))
    loose = lambda s: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', norm(s)).encode('ascii', 'ignore').decode())
    by_name = {}   # (world, game name, loosely) -> [(lot id, plex)], from the baseline (the game's own names; apartments are plex units)
    for k, v in base.items():
        w, lid, plex = k.split('|'); by_name.setdefault((w, loose(v['name'])), []).append((int(lid), int(plex)))
    def locate(wn, names):
        for n in names:
            hit = by_name.get((wn, loose(n)))
            if hit: return min(hit, key=lambda x: x[1] not in (0, 300))
        for n in names:   # "Desert Bloom Park" is "Desert Bloom" in the game
            near = [v for (w, k), v in by_name.items() if w == wn and len(loose(n)) > 6 and (k.startswith(loose(n)) or loose(n).startswith(k)) and len(k) > 6]
            if len(near) == 1: return min(near[0], key=lambda x: x[1] not in (0, 300))
        return None
    out = {"save": fname, "saved": time.strftime('%Y-%m-%d %H:%M', time.localtime(mtime)), "worlds": {}, "households": []}
    lot_zone = {}   # (world, game lot) -> {unit name or '': zone id}
    for w in D['worlds']:
        if not (w.get('owned') and w.get('ready')): continue
        wn = w['name']; rows = []
        for h in w['hoods']:
            for l in h['lots']:
                key = f"{wn}|{l['lot']}"
                shown = D['nameFix'].get(key) or (l.get('gallery') or {}).get('title') or (l['mine'] if l.get('mine') and l['mine'].strip('? ') else None) or l['lot']
                hit = locate(wn, [l['lot'], shown, l.get('mine') or ''])
                r = {"lot": l['lot'], "name": shown, "hood": h['name'], "built": l['built'], "shared": l['shared'], "type": l.get('type'), "issues": []}
                if hit is None: r['status'] = 'not found'; rows.append(r); continue
                lid, plex = hit
                zs = sorted(by_lot.get((wn, lid), []), key=lambda x: x[1]['plex'])
                if plex not in (0, 300): zs = [x for x in zs if x[1]['plex'] == plex]   # an apartment: its own unit only
                main = next((z for zid, z in zs if z['plex'] in (0, 300)), zs[0][1] if zs else None)
                units = [(zid, z) for zid, z in zs if z['plex'] > 300]
                b = base.get(f"{wn}|{lid}|{main['plex']}", {}) if main else {}
                n_objs = sum(z['objs'] for _, z in zs)
                b_objs = sum(v['objs'] for k, v in base.items() if k.startswith(f"{wn}|{lid}|") and (plex in (0, 300) or k == f"{wn}|{lid}|{plex}"))
                placed = bool(main) and (n_objs != b_objs or norm(main['name']) != norm(b.get('name')))
                r.update(save_name=main['name'] if main else None, placed=placed, objs=n_objs, game_objs=b_objs)
                lot_zone[(wn, l['lot'])] = {'': zs[0][0] if zs else None, **{str(z['plex'] - 300): zid for zid, z in units}}
                if units:   # the unit's plan name by position
                    names = [u['name'] for u in (l.get('units') or [])]
                    for zid, z in units:
                        i = z['plex'] - 301
                        if i < len(names): lot_zone[(wn, l['lot'])][names[i]] = zid
                if l['built'] is True and l.get('gallery') and not placed: r['status'] = 'to place'
                elif not placed: r['status'] = 'game lot'
                else:
                    r['status'] = 'placed'
                    want = set((l.get('traits') or []) + (l.get('challenges') or []))
                    have = set(main['traits']) | ({t for _, z in units for t in z['traits']} if not main['traits'] else set())
                    if l.get('traits') and not l.get('units') and set(l['traits']) - have: r['issues'].append("missing trait" + ("s" if len(set(l['traits']) - have) > 1 else "") + ": " + ", ".join(sorted(set(l['traits']) - have)))
                    extra = have - want - {'Quake Zone'} - set(MOD_TRAITS.values()) if (l.get('traits') or l.get('challenges')) else set()
                    if extra and not units: r['issues'].append("not in the plan: " + ", ".join(sorted(extra)))
                    if norm(main['name']) != norm(shown) and not (units and norm(main['name']) == norm(l['lot'])): r['issues'].append(f"named “{main['name']}” in the save")
                    if units and norm(main['name']) == norm(l['lot']) and norm(shown) != norm(l['lot']): r['issues'].append(f"building named “{main['name']}” (the game’s name)")
                    for u in (l.get('units') or []):
                        zid = lot_zone[(wn, l['lot'])].get(u['name'])
                        if not zid: continue
                        got = set(zones[zid]['traits']); need = set(u.get('traits') or [])
                        if need - got: r['issues'].append(f"unit {u['name']}: wants {', '.join(sorted(need))}, has {', '.join(sorted(got)) or 'none'}")
                    if not (l.get('traits') or l.get('challenges')) and not units and main['traits']:
                        r['newTraits'] = [t for t in main['traits'] if t not in MOD_TRAITS.values()]   # the site has none yet: ready to read in
                    cv = D['csVersions'].get(key)
                    if cv and main.get('subs'):
                        act = SUBVENUES.get(main['subs'][main.get('active') or 0], '?')
                        if norm(act) != norm(cv[0]['label']): r['issues'].append(f"active version {act}; your pick {cv[0]['label']} (switch on the voting board)")
                rows.append(r)
        out['worlds'][wn] = rows
    # households: where each household with Sims on the site lives in the save, against the plan
    # where each of her own households is now (research/library-ready.md, 23 Oct): her Library, only an old save, or nowhere yet
    lib = {}
    lr = os.path.join(ROOT, 'research', 'library-ready.md')
    if os.path.exists(lr):
        for line in open(lr, encoding='utf-8'):
            c = [x.strip() for x in line.strip().strip('|').split('|')]
            if len(c) >= 5 and re.match(r'[bcd]\. ', c[2]): lib[norm(c[0])] = (c[2][0], c[4])
    def how(hn, hh):
        k = lib.get(norm(hn)) or lib.get(norm(re.sub(r' \d$', '', hn)))
        if k and k[0] == 'c':
            m = re.search(r'“([^”]+)”', k[1]); return f"only in your “{m.group(1) if m else 'old'}” save: save it to your Library from there first"
        if k and k[0] == 'd': return "not in any save or your Library yet: make it"
        if any(re.search('Library|Gallery', s.get('from') or '') and (s.get('origin') or '') != 'Mine' for s in hh['sims']): return "Maxis’s Gallery copy: from your Library or the Gallery"
        if any((s.get('origin') or '').lower() == 'mine' or re.search('Library', s.get('from') or '') for s in hh['sims']):
            return "from your Library" + (" (your Library copy differs from the site: check ages and Sims)" if k and k[0] == 'b' and not re.search(r'^(matches|same)', k[1], re.I) and k[1] not in ('–', '') else "")
        return "not found by its Sims’ names (EA’s, maybe renamed)"
    zone_of_sim, members = {}, {}
    living = {}   # zone -> names of the save households living there
    for h in hhs:
        if h.get('home_zone'): living.setdefault(h['home_zone'], []).append(h.get('name') or '?')
    for h in hhs:
        ids = (h.get('sims') or {}).get('ids', []) if isinstance(h.get('sims'), dict) else []
        for i in ids: zone_of_sim[sims.get(i)] = (h.get('home_zone'), h.get('name'))
        members[h.get('name')] = members.get(h.get('name'), set()) | {sims.get(i) for i in ids if sims.get(i)}
    base_ = lambda n: re.sub(r'\s+own\??$', '', re.sub(r'\?$', '', n).strip(), flags=re.I).strip()
    for w in D['worlds']:
        if not (w.get('owned') and w.get('ready')): continue
        wn = w['name']; H = D['households'].get(wn, {})
        lots = [l for h in w['hoods'] for l in h['lots']]
        own_ = lambda l: re.search(r'\sown\??$', l.get('who') or '', re.I)
        # "Greenburg own" on a rental is the landlord's home when the family has no other home in the world (as the site reads it)
        homes_ = {re.sub(r'\?$', '', x['who']).strip() for x in lots if x.get('who') and x['sims'] != 'N/A' and not own_(x)}
        is_home = lambda l: l['sims'] != 'N/A' and (not own_(l) or ('Rental' in (l.get('type') or '') and re.sub(r'\s+own\??$', '', l['who'], flags=re.I).strip() not in homes_))
        total, seen, where = {}, {}, {}
        for l in lots:
            if l.get('who') and is_home(l): total[base_(l['who'])] = total.get(base_(l['who']), 0) + 1
        for l in lots:
            key = f"{wn}|{l['lot']}"
            if l.get('who') and is_home(l):
                b = base_(l['who']); seen[b] = seen.get(b, 0) + 1
                hn = f"{b} {seen[b]}" if total[b] > 1 else b
                unit = unit_name(l, D['residentsUnit'].get(key) or 1) if l.get('units') else ''
                where[hn] = (l, str(unit) if unit else '')
            for t in D['tenants'].get(key, []): where[t['name']] = (l, unit_name(l, t['unit']) if t.get('unit') else '')
        for hn, (l, unit) in where.items():
            hh = H.get(hn)
            if not hh or not hh.get('sims'): continue
            names = [s['name'] for s in hh['sims'] if not s.get('state') in ('Cat', 'Dog', 'Horse', 'Fox')]
            got = [zone_of_sim.get(n) for n in names]
            zs = lot_zone.get((wn, l['lot']), {})
            target = zs.get(unit) or zs.get('')
            lot_name = D['nameFix'].get(f"{wn}|{l['lot']}") or (l.get('gallery') or {}).get('title') or l.get('mine') or l['lot']
            row = {"world": wn, "household": hn, "lot": lot_name, "unit": unit, "sims": len(names)}
            if not any(got): row['state'] = 'not in the save' ; row['how'] = how(hn, hh)
            else:
                homes = {g[0] for g in got if g}
                save_hh = {g[1] for g in got if g}
                names_ok = {norm(l['lot']), norm(lot_name)}
                ok = set(zs.values()) | {z for z, v in zones.items() if v['world'] == wn and (norm(v['name']) in names_ok or any(len(norm(v['name'])) > 6 and (norm(v['name']) in n or n in norm(v['name'])) for n in names_ok))}
                if homes and homes <= ({target} if unit else ok): row['state'] = 'home'
                else:
                    now = [zones.get(z, {}).get('name') or 'no home' for z in homes if z]
                    row['state'] = 'move'; row['now'] = ", ".join(sorted(set(now))) or 'no home'; row['save_household'] = ", ".join(sorted(save_hh))
                    there = [n for n in living.get(target, []) if n not in save_hh]
                    if there: row['occupied'] = ", ".join(sorted(set(there)))
                    if len(homes) > 1: row['note'] = 'its Sims are in more than one household'
                    others = sorted({n for g in save_hh for n in members.get(g, set())} - set(names) - PETS)
                    if others and len(save_hh) == 1: row['note'] = f"split them out of {next(iter(save_hh))} first (it also has {', '.join(o.split()[0] for o in others[:4])}{'…' if len(others) > 4 else ''})"
                    elif len(save_hh) > 1: row['note'] = f"merge {' and '.join(sorted(save_hh))} first"
            out['households'].append(row)
    # households living on one of her placed lots that the plan doesn't put there (to move out, or elsewhere)
    planned_sims = {}   # zone -> Sim names the plan puts there
    for w in D['worlds']:
        if not (w.get('owned') and w.get('ready')): continue
        for r in out['worlds'].get(w['name'], []):
            if r.get('status') != 'placed': continue
            for unit, zid in lot_zone.get((w['name'], r['lot']), {}).items():
                if zid: planned_sims.setdefault(zid, set())
    for hn_row in out['households']:
        zs = lot_zone.get((hn_row['world'], next((r['lot'] for r in out['worlds'][hn_row['world']] if r['name'] == hn_row['lot']), '')), {})
        zid = zs.get(hn_row['unit']) or zs.get('')
        H = D['households'].get(hn_row['world'], {}).get(hn_row['household'], {})
        if zid in planned_sims: planned_sims[zid] |= {sm['name'] for sm in H.get('sims', [])}
    out['squatters'] = []
    for h in hhs:
        z = h.get('home_zone')
        if z not in planned_sims: continue
        ids = (h.get('sims') or {}).get('ids', []) if isinstance(h.get('sims'), dict) else []
        names = {sims.get(i) for i in ids}
        if names and not names & planned_sims[z]:
            out['squatters'].append({"world": zones[z]['world'], "lot": zones[z]['name'], "household": h.get('name') or '?', "sims": sorted(n for n in names if n)})
    # her own households joined by family (parents, partners) to Sims in another household: the Library keeps links only
    # inside one household, so save the family as one household, place it, then split it in the new save (research/moving-households.md)
    hh_of, links, name_of = {}, [], {}
    for wn2, HH in D['households'].items():
        for hn2, hh2 in HH.items():
            for sm in hh2.get('sims', []):
                if sm.get('id'): hh_of[sm['id']] = (wn2, hn2); name_of[sm['id']] = sm['name']
    for wn2, HH in D['households'].items():
        for hn2, hh2 in HH.items():
            for sm in hh2.get('sims', []):
                for par in sm.get('parents') or []: links.append((sm.get('id'), par, 'parent'))
                for pa in sm.get('partners') or []:
                    if pa[1] in ('Spouse', 'Partner', 'Engaged'): links.append((sm.get('id'), pa[0], pa[1].lower()))
    away = {(r['world'], r['household']) for r in out['households'] if r['state'] == 'not in the save'}
    groups = {}
    def find_(x):
        while groups.get(x, x) != x: x = groups[x]
        return x
    joined = []
    for a_, b_, kind in links:
        ha, hb = hh_of.get(a_), hh_of.get(b_)
        if not ha or not hb or ha == hb or not (ha in away or hb in away): continue
        groups.setdefault(ha, ha); groups.setdefault(hb, hb); groups[find_(ha)] = find_(hb); joined.append((ha, hb, a_, b_, kind))
    comp = {}
    for h_ in groups: comp.setdefault(find_(h_), set()).add(h_)
    size = lambda h_: len([x for x in D['households'][h_[0]][h_[1]].get('sims', []) if x.get('state') not in ('Cat', 'Dog', 'Horse', 'Fox')])
    out['saveTogether'] = [{"households": sorted(f"{h_[1]} ({h_[0]})" for h_ in c), "sims": sum(size(h_) for h_ in c),
                            "pairs": sorted({(f"{hb_[1]} with {name_of.get(a2, a2)}" if kind == 'parent' else f"{ha_[1]} with {name_of.get(b2, b2)}") for ha_, hb_, a2, b2, kind in joined if find_(ha_) == k})} for k, c in comp.items() if len(c) > 1]
    # lots still to place: who the game will move out when she places over them, and where the plan wants them
    plan_of_sim = {}
    home_of = {(r['world'], r['household']): r['lot'] + (f" unit {r['unit']}" if r['unit'] else '') for r in out['households']}
    for wn2, HH in D['households'].items():
        for hn2, hh2 in HH.items():
            for sm in hh2.get('sims', []): plan_of_sim.setdefault(sm['name'], (wn2, hn2))
    out['ahead'] = []
    for wn, rows in out['worlds'].items():
        for r in rows:
            if r.get('status') != 'to place': continue
            for unit, zid in lot_zone.get((wn, r['lot']), {}).items():
                for h in hhs:
                    if not zid or h.get('home_zone') != zid: continue
                    ids = (h.get('sims') or {}).get('ids', []) if isinstance(h.get('sims'), dict) else []
                    names = [sims.get(i) for i in ids if sims.get(i)]
                    dest = {plan_of_sim[n] for n in names if n in plan_of_sim}
                    goes = "; ".join(("" if d[1] == h.get('name') else f"{d[1]}: ") + home_of.get(d, 'no home lot in the plan') + (f" ({d[0]})" if d[0] != wn else '') for d in sorted(dest)) or 'not in the plan'
                    e = {"world": wn, "lot": r['name'], "household": h.get('name') or '?', "goes": goes}
                    if e not in out['ahead']: out['ahead'].append(e)
    # game options against her picks (for-jemma/new-save-checklist.md step 2; research/game-options.md)
    # a setting left at the game's default isn't written in the save (research/save-game-options.md): missing = default
    o = OPTIONS; opt = []
    if 'season_length' not in o: opt.append("Season Length: still the game's 7 days; your pick is 28 days (set it before the holidays)")
    elif not re.search(r'28|FOUR|4', str(o['season_length'])): opt.append(f"Season Length reads {o['season_length']}; your pick is 28 days")
    if (o.get('max_player_population') or 50) < 200: opt.append(f"Maximum Sim Count: {o.get('max_player_population') or 50}; your pick is Unlimited (or the most your PC copes with)")
    if o.get('npc_civic_voting_enabled', True): opt.append("Enable NPC Voting is on; your pick is off")
    if o.get('unplayed_aging_enabled', True): opt.append("Auto Age (Unplayed Households) is on; your pick is off")
    if o.get('npc_autonomy_breakups_enabled', True): opt.append("Allow Automatic Breakups is on; your pick is off")
    if o.get('dynasty_prestige_decay_enabled', True): opt.append("Enable Dynasty Prestige Decay is on; your pick is off")
    if o.get('story_progression_effects_enabled') is False: opt.append("Enable Neighbourhood Stories is off; your pick is on, with your rules")
    if not o.get('_own_holidays'): opt.append("holidays: still the game's own calendar (checklist step 3)")
    out['options'] = opt; out['optionsRaw'] = {k: v for k, v in o.items() if not isinstance(v, (bytes, dict))}
    save(os.path.join(ROOT, 'research', 'data', 'new-save-status.json'), out)
    # the report
    L = [f"# New save check: “{SAVE_NAME}” ({out['saved']})", "",
         "Made by tools/research/new_save_check.py from a copy of the save. Lots: placed / to place / the game’s lot; anything that differs from the plan is listed. Households: who isn’t home yet.", ""]
    tot = {'placed': 0, 'to place': 0}
    worlds_done = []
    for wn, rows in out['worlds'].items():
        p = sum(1 for r in rows if r.get('status') == 'placed'); tp = [r for r in rows if r.get('status') == 'to place']
        tot['placed'] += p; tot['to place'] += len(tp)
        if p: worlds_done.append(wn)
    L += [f"**At a glance:** {tot['placed']} lots placed in {len(worlds_done)} worlds; {tot['to place']} shared lots still to place. "
          f"{sum(1 for h in out['households'] if h['state'] == 'home')} households at home, {sum(1 for h in out['households'] if h['state'] == 'move')} to move, "
          f"{sum(1 for h in out['households'] if h['state'] == 'not in the save')} not in the save yet.", ""]
    if out['options']: L += ["## Game options", ""] + [f"- {x[0].upper() + x[1:]}" for x in out['options']] + [""]
    for wn, rows in out['worlds'].items():
        if not any(r.get('status') == 'placed' for r in rows): continue
        L += [f"## {wn}", ""]
        tp = [r['name'] for r in rows if r.get('status') == 'to place']
        iss = [r for r in rows if r.get('issues')]
        if tp: L.append("- **To place:** " + ", ".join(tp))
        for r in iss: L.append(f"- **{r['name']}:** " + "; ".join(r['issues']))
        if not tp and not iss: L.append("- All shared lots placed, all as planned.")
        mv = [h for h in out['households'] if h['world'] == wn and h['state'] != 'home']
        for h in mv:
            to = h['lot'] + (f" unit {h['unit']}" if h['unit'] else '')
            if h['state'] == 'move': L.append(f"- **Move {h['household']}** to {to} (now: {h['now']}{'; ' + h['note'] if h.get('note') else ''}{'; move out ' + h['occupied'] + ' first' if h.get('occupied') else ''})")
            else: L.append(f"- **{h['household']}** for {to}: {h['how']}")
        L.append("")
    if out['squatters']:
        L += ["## Living where the plan doesn’t put them", "", "On one of your placed lots, but planned elsewhere (or nowhere): move them out.", ""]
        L += [f"- {q['world']} / {q['lot']}: {q['household']} ({', '.join(q['sims'])})" for q in out['squatters']] + [""]
    if out['saveTogether']:
        L += ["## Save these together", "", "Family links to Sims in another household are lost when a household comes from the Library. Save each group as one household (8 Sims at most), place it, then split it:", ""]
        for g in out['saveTogether']:
            if g['sims'] <= 8: L.append(f"- {' + '.join(g['households'])} ({g['sims']} Sims)")
            else: L.append(f"- {' + '.join(g['households'])}: {g['sims']} Sims, too many for one household. Bring each family over with its relative from the other household instead ({'; '.join(g['pairs'])}), then split them off and merge them back into their own household in the new save, which keeps the links.")
        L.append("")
    if out['ahead']:
        L += ["## Living on lots still to place", "", "The game moves them out when you place your build. Where the plan wants them:", ""]
        L += [f"- {q['world']} / {q['lot']}: {q['household']} → {q['goes']}" for q in out['ahead']] + [""]
    nt = [(wn, r) for wn, rows in out['worlds'].items() for r in rows if r.get('newTraits')]
    if nt:
        L += ["## Traits the site doesn’t show yet", "", "In the new save but not on the site (read in once the save is set up):", ""]
        L += [f"- {wn} / {r['name']}: {', '.join(r['newTraits'])}" for wn, r in nt] + [""]
    rest = [wn for wn in out['worlds'] if wn not in worlds_done]
    if rest: L += ["## Not started", "", ", ".join(rest), ""]
    open(os.path.join(ROOT, 'research', 'new-save-status.md'), 'w', encoding='utf-8').write("\n".join(L))
    print("\n".join(L[:6])); print(fname, out['saved'])


if __name__ == '__main__':
    main()
