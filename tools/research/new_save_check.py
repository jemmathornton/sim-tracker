"""Her new save against the plan (23 Oct, the day she started "Jemma's Sim World" and began placing her builds).
    python tools/research/new_save_check.py            report: research/new-save-status.md (+ research/data/new-save-status.json)
    python tools/research/new_save_check.py --baseline  first run only: note the game's own lots (names and object
                                                        counts) from a fresh, untouched save, to tell placed lots apart

For every lot of every owned world: is her build placed (it differs from the game's own lot), the name in the save,
lot traits and challenges against the plan, rental units and their traits, the Community Space version that's active.
Then every household on the site with Sims: where it lives in the save, and where the plan puts it (tenants into their
units), so the ones moved out while she placed builds can go back. Saves are read from temporary copies. Report only.
"""
import json, os, re, shutil, sys, tempfile, time
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
norm = lambda s: re.sub(r'\s+', ' ', (s or '').replace('’', "'")).strip().lower()


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
        name = s4.save_name(data, S)
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
    game_name = {}   # (world, game lot name) -> lot id, from the baseline (the game's own names)
    for k, v in base.items():
        w, lid, plex = k.split('|')
        if plex in ('0', '300'): game_name[(w, norm(v['name']))] = int(lid)
    out = {"save": fname, "saved": time.strftime('%Y-%m-%d %H:%M', time.localtime(mtime)), "worlds": {}, "households": []}
    lot_zone = {}   # (world, game lot) -> {unit name or '': zone id}
    for w in D['worlds']:
        if not (w.get('owned') and w.get('ready')): continue
        wn = w['name']; rows = []
        for h in w['hoods']:
            for l in h['lots']:
                key = f"{wn}|{l['lot']}"
                shown = D['nameFix'].get(key) or (l.get('gallery') or {}).get('title') or (l['mine'] if l.get('mine') and l['mine'].strip('? ') else None) or l['lot']
                lid = game_name.get((wn, norm(l['lot'])))
                r = {"lot": l['lot'], "name": shown, "hood": h['name'], "built": l['built'], "shared": l['shared'], "type": l.get('type'), "issues": []}
                if lid is None: r['status'] = 'not found'; rows.append(r); continue
                zs = sorted(by_lot.get((wn, lid), []), key=lambda x: x[1]['plex'])
                main = next((z for zid, z in zs if z['plex'] in (0, 300)), zs[0][1] if zs else None)
                units = [(zid, z) for zid, z in zs if z['plex'] > 300]
                b = base.get(f"{wn}|{lid}|{main['plex']}", {}) if main else {}
                n_objs = sum(z['objs'] for _, z in zs)
                b_objs = sum(v['objs'] for k, v in base.items() if k.startswith(f"{wn}|{lid}|"))
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
                    if units and not l.get('units'): pass
                    if l.get('traits') and not l.get('units') and set(l['traits']) - have:   # rentals: checked unit by unit below r['issues'].append("missing trait" + ("s" if len(set(l['traits']) - have) > 1 else "") + ": " + ", ".join(sorted(set(l['traits']) - have)))
                    extra = have - want - {'Quake Zone'} - set(MOD_TRAITS.values()) if (l.get('traits') or l.get('challenges')) else set()
                    if extra and not units: r['issues'].append("not in the plan: " + ", ".join(sorted(extra)))
                    if norm(main['name']) != norm(shown) and not (units and norm(main['name']) == norm(l['lot'])): r['issues'].append(f"named “{main['name']}” in the save")
                    if units and norm(main['name']) == norm(l['lot']) and norm(shown) != norm(l['lot']): r['issues'].append(f"building named “{main['name']}” (the game’s name)")
                    for u in (l.get('units') or []):
                        zid = lot_zone[(wn, l['lot'])].get(u['name'])
                        if not zid: continue
                        got = set(zones[zid]['traits']); need = set(u.get('traits') or [])
                        if need - got: r['issues'].append(f"unit {u['name']}: wants {', '.join(sorted(need))}, has {', '.join(sorted(got)) or 'none'}")
                    cv = D['csVersions'].get(key)
                    if cv and main.get('subs'):
                        act = SUBVENUES.get(main['subs'][main.get('active') or 0], '?')
                        if norm(act) != norm(cv[0]['label']): r['issues'].append(f"active version {act}; your pick {cv[0]['label']} (switch on the voting board)")
                rows.append(r)
        out['worlds'][wn] = rows
    # households: where each household with Sims on the site lives in the save, against the plan
    zone_of_sim = {}
    for h in hhs:
        ids = (h.get('sims') or {}).get('ids', []) if isinstance(h.get('sims'), dict) else []
        for i in ids: zone_of_sim[sims.get(i)] = (h.get('home_zone'), h.get('name'))
    base_ = lambda n: re.sub(r'\?$', '', n).strip()
    for w in D['worlds']:
        if not (w.get('owned') and w.get('ready')): continue
        wn = w['name']; H = D['households'].get(wn, {})
        lots = [l for h in w['hoods'] for l in h['lots']]
        is_home = lambda l: l['sims'] != 'N/A' and not re.search(r'\sown\??$', l.get('who') or '', re.I)
        total, seen, where = {}, {}, {}
        for l in lots:
            if l.get('who') and is_home(l): total[base_(l['who'])] = total.get(base_(l['who']), 0) + 1
        for l in lots:
            key = f"{wn}|{l['lot']}"
            if l.get('who') and is_home(l):
                b = base_(l['who']); seen[b] = seen.get(b, 0) + 1
                hn = f"{b} {seen[b]}" if total[b] > 1 else b
                unit = D['residentsUnit'].get(key) or ((l.get('units') or [{}])[0].get('name') if l.get('units') else '')
                where[hn] = (l, str(unit) if unit else '')
            for t in D['tenants'].get(key, []): where[t['name']] = (l, str(t.get('unit') or ''))
        for hn, (l, unit) in where.items():
            hh = H.get(hn)
            if not hh or not hh.get('sims'): continue
            names = [s['name'] for s in hh['sims'] if not s.get('state') in ('Cat', 'Dog', 'Horse', 'Fox')]
            got = [zone_of_sim.get(n) for n in names]
            zs = lot_zone.get((wn, l['lot']), {})
            target = zs.get(unit) or zs.get('')
            lot_name = D['nameFix'].get(f"{wn}|{l['lot']}") or (l.get('gallery') or {}).get('title') or l.get('mine') or l['lot']
            row = {"world": wn, "household": hn, "lot": lot_name, "unit": unit, "sims": len(names)}
            if not any(got): row['state'] = 'not in the save' ; row['how'] = 'bring from your Library' if any((s.get('origin') or '').lower() == 'mine' or re.search('Library|Gallery', s.get('from') or '') for s in hh['sims']) else 'not found by its Sims’ names (EA’s, maybe renamed or a Gallery copy)'
            else:
                homes = {g[0] for g in got if g}
                save_hh = {g[1] for g in got if g}
                names_ok = {norm(l['lot']), norm(lot_name)}
                ok = set(zs.values()) | {z for z, v in zones.items() if v['world'] == wn and (norm(v['name']) in names_ok or any(len(norm(v['name'])) > 6 and (norm(v['name']) in n or n in norm(v['name'])) for n in names_ok))}
                if homes and homes <= ({target} if unit else ok): row['state'] = 'home'
                else:
                    now = [zones.get(z, {}).get('name') or 'no home' for z in homes if z]
                    row['state'] = 'move'; row['now'] = ", ".join(sorted(set(now))) or 'no home'; row['save_household'] = ", ".join(sorted(save_hh))
                    if len(homes) > 1: row['note'] = 'its Sims are in more than one household'
            out['households'].append(row)
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
            if h['state'] == 'move': L.append(f"- **Move {h['household']}** to {to} (now: {h['now']}{'; ' + h['note'] if h.get('note') else ''})")
            else: L.append(f"- **{h['household']}** for {to}: {h['how']}")
        L.append("")
    rest = [wn for wn in out['worlds'] if wn not in worlds_done]
    if rest: L += ["## Not started", "", ", ".join(rest), ""]
    open(os.path.join(ROOT, 'research', 'new-save-status.md'), 'w', encoding='utf-8').write("\n".join(L))
    print("\n".join(L[:6])); print(fname, out['saved'])


if __name__ == '__main__':
    main()
