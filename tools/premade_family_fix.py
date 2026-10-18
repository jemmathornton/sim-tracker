"""Tidy the EA families filled from the game files (18 Oct), without re-importing them (so her later edits stay):

- couples the game stores as each other's significant other are married: "Spouse", not "Partner";
- pets, babies and toddlers have no aspiration or bonus trait;
- parents the game knows only as unnamed links get an "Unknown" box (data/people.json, "placeholder"), so siblings and
  cousins in different households join up (Lilith and Caleb Vatore, Holly and Enzo Alto, the Behr sisters), and a child
  whose only known relatives are grandparents gets an unknown parent between them (Rohan Elderberry, Kaori Nishidake).
  Only two generations up, and only where it links Sims who are on the site.

    python tools/premade_family_fix.py           report
    python tools/premade_family_fix.py --apply   write data/worlds/*.json and data/people.json, then rebuild
"""
import glob, os, sys, subprocess, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, load, save

NO_ASPIRATION = {"Baby", "Infant", "Toddler"}
PETS = {"Dog", "Cat", "Horse", "Fox"}
GRANDS = {"RELATIONSHIP_FATHERS_MOM": ("m", "f"), "RELATIONSHIP_FATHERS_FATHER": ("m", "m"),
          "RELATIONSHIP_MOTHERS_MOM": ("f", "f"), "RELATIONSHIP_MOTHERS_FATHER": ("f", "m")}


def main(apply):
    P = load(os.path.join(ROOT, 'research', 'data', 'premades.json'))
    worlds = {p: load(p) for p in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))}
    ppath = os.path.join(ROOT, 'data', 'people.json'); people = load(ppath)
    site = {}   # site id -> Sim dict (premade Sims only)
    for W in worlds.values():
        for hh in (W.get('households') or {}).values():
            for s in hh.get('sims', []):
                if s.get('id') and s.get('origin') == 'Premade': site[s['id']] = s
    report = collections.Counter()
    # 1. married couples, 2. no aspirations for pets and the very young
    for s in site.values():
        for pr in s.get('partners', []):
            if pr[1] == 'Partner': pr[1] = 'Spouse'; report['Partner -> Spouse'] += 1
        if s.get('state') in PETS or s.get('age') in NO_ASPIRATION:
            for f in ('aspiration', 'bonus'):
                if s.pop(f, None): report[f'{f} removed'] += 1
    # 3. unknown parents. Game Sims -> site ids (by name; the importer made ids from names)
    by_name = {s['name']: i for i, s in site.items()}
    game = {s['name']: s for h in P['households'] for s in h['sims']}
    node_of = {}   # template id / sim id -> site id
    for nm, s in game.items():
        if nm in by_name:
            if s.get('template'): node_of[('t', s['template'])] = by_name[nm]
            node_of[('s', s['sim_id'])] = by_name[nm]
    up = collections.defaultdict(set)   # child node -> parent nodes (nodes are site ids or ('t'/'s'/'g', ...))
    sex = {}
    for a, flag, b in P['between']['family']:
        A, B = node_of.get(('t', a), ('t', a)), node_of.get(('t', b), ('t', b))
        if flag in ('PARENT', 'SECRET_PARENT'): up[B].add(A)
        elif flag == 'CHILD': up[A].add(B)
    for nm, s in game.items():
        me = by_name.get(nm)
        if not me: continue
        for rel, other in s.get('family', []):
            o = node_of.get(('s', other), ('s', other))
            if rel in ('RELATIONSHIP_MOTHER', 'RELATIONSHIP_FATHER'):
                up[me].add(o)
                if not isinstance(o, str): sex[o] = 'f' if rel.endswith('MOTHER') else 'm'
            elif rel in GRANDS and isinstance(o, str):   # a grandparent on the site: put an unknown parent in between,
                side = GRANDS[rel][0]                   # unless that side's parent is already known (Amy Prescott has Mei)
                known = [p for p in site[me].get('parents', []) if p in site and site[p].get('sex') == side] +                         [p for p in (s2 for r2, s2 in s.get('family', []) if r2 == ('RELATIONSHIP_FATHER' if side == 'm' else 'RELATIONSHIP_MOTHER'))]
                if known: continue
                mid = ('g', me, rel.split('_')[1]); sex[mid] = side
                up[me].add(mid); up[mid].add(o)
    unknown = lambda n: not isinstance(n, str)
    def anc(n, d, out):   # unknown ancestors up to d generations, through unknown nodes only
        for p in up.get(n, ()):
            if unknown(p): out.setdefault(p, d); anc(p, d + 1, out) if d < 2 else None
        return out
    reach = collections.defaultdict(set)
    for sid in site:
        for n in anc(sid, 1, {}): reach[n].add(sid)
    keep = {n for n, r in reach.items() if len(r) >= 2 or any(isinstance(p, str) for p in up.get(n, ()))}
    changed = True
    while changed:   # the steps between a kept unknown and a Sim (Lily Zhu's unknown parent, below the cousins' shared grandparent)
        changed = False
        for n in list(reach):
            if n not in keep and any(p in keep for p in up.get(n, ())): keep.add(n); changed = True
    # which Sims (or kept unknowns) each kept unknown would become a parent of; a Sim never gets a third parent
    room = {sid: 2 - len(s.get('parents', [])) for sid, s in site.items()}
    kids_of = collections.defaultdict(list)
    for child, ps in up.items():
        for p in ps:
            if p in keep and (child in keep or (isinstance(child, str) and child in site)): kids_of[p].append(child)
    def has_kids(n, seen=()):
        return any((isinstance(c, str) and room.get(c, 0) > 0) or (c in keep and c not in seen and has_kids(c, seen + (n,))) for c in kids_of[n])
    keep = {n for n in keep if has_kids(n)}   # an unknown with no one to be a parent of is left out
    existing = [k for k in people if k.startswith('unknown-')]   # numbering carries on after any already there
    ph_id = {n: f"unknown-{len(existing) + i + 1}" for i, n in enumerate(sorted(keep, key=str))}
    added = 0
    for sid, s in site.items():
        for p in up.get(sid, ()):
            if p in ph_id and room[sid] > 0 and ph_id[p] not in s.setdefault('parents', []):
                s['parents'].append(ph_id[p]); room[sid] -= 1; added += 1
        if not s.get('parents'): s.pop('parents', None)
    for n, pid in ph_id.items():
        ps = [ph_id[p] if p in ph_id else p for p in up.get(n, ()) if p in ph_id or isinstance(p, str)]
        people[pid] = {"name": "Unknown", "sex": sex.get(n, "x"), "placeholder": True, **({"parents": ps[:2]} if ps else {})}
    report['unknown parents added'] = len(ph_id); report['parent links added'] = added
    for k, v in report.items(): print(f"{k}: {v}")
    for n, pid in ph_id.items():
        kids = [s['name'] for sid, s in site.items() if pid in s.get('parents', [])] + [k for k, v in people.items() if isinstance(v, dict) and pid in v.get('parents', [])]
        print(f"  {pid} ({sex.get(n, 'x')}): parent of {', '.join(kids)}; parents {people[pid].get('parents', [])}")
    if apply:
        for p, W in worlds.items(): save(p, W)
        save(ppath, people)
        subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
