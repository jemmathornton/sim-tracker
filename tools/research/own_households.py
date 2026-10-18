"""Her own households (not EA's) in her saves and her Library, matched to the households in her plan (18 Oct).

    python tools/research/own_households.py     read copies of every save and the Library, write research/data/own-households.json

Her spreadsheet says which households exist and where; a save or the Library only fills in their Sims, for now, for her
to double-check (her rule, 18 Oct). Every copy found is listed (saves hold different versions); she picks later.
Saves are read from temporary copies (sims4files.read_save); Library files are copied to a temporary folder first.
Report only; nothing in data/ changes.
"""
import glob, json, os, re, shutil, struct, sys, tempfile, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT, load

S = s4.save_schema(); P = '.EA.Sims4.Persistence.'; N = '.EA.Sims4.Network.'
TRAY = os.path.join(os.path.dirname(s4.SAVES), 'Tray')
AGES = {1: "Baby", 2: "Toddler", 4: "Child", 8: "Teen", 16: "Young Adult", 32: "Adult", 64: "Elder", 128: "Infant"}
norm = lambda x: re.sub(r'[^a-z]', '', (x or '').lower())


def plan_households():
    """{world name: [household names without Sims yet]}, from the site's data (built from her spreadsheet)."""
    out = {}
    for wf in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json')):
        W = load(wf); have = W.get('households') or {}
        names = set()
        for h in W.get('neighbourhoods', []):
            for l in h['lots']:
                r = l.get('residents')
                if not r or r in ('N/A', 'Empty') or re.search(r'\bbed', r, re.I) or r.startswith('('): continue
                n = re.sub(r'\*[^*]*\*|\([^)]*\)|\+$', '', r); n = re.sub(r'\?+', '', n).strip(); n = re.sub(r'\s+own$', '', n)
                if n: names.add(n)
                for t in l.get('tenants', []): names.add(t['name'])
        out[W['name']] = sorted(n for n in names if not (have.get(n) or {}).get('sims'))
    return out


def sim_brief(s):
    return {"name": f"{s.get('first_name', '')} {s.get('last_name', '')}".strip(), "age": AGES.get(s.get('age')), "sim_id": s.get('sim_id')}


def saves():
    for p in sorted(glob.glob(os.path.join(s4.SAVES, '*.save')), key=os.path.getmtime, reverse=True):
        try: data = s4.read_save(p)
        except Exception as e: print('skipped', p, e); continue
        name, base = s4.save_name(data, S)
        top = s4.fields(data); worlds, zones, hhs, sims = {}, {}, [], {}
        for f, wt, v in top:
            if f == 4: n = s4.decode(v, P + 'NeighborhoodData', S, depth=0); worlds[n.get('neighborhood_id')] = n.get('name', '')
        for f, wt, v in top:
            if f == 7: z = s4.decode(v, P + 'ZoneData', S, depth=0); zones[z.get('zone_id')] = (worlds.get(z.get('neighborhood_id'), ''), z.get('name', ''))
            elif f == 5: hhs.append(s4.decode(v, P + 'HouseholdData', S, depth=2))
            elif f == 6:
                sm = s4.decode(v, P + 'SimData', S, depth=0); sims[sm.get('sim_id')] = sm
        yield {"file": os.path.basename(p), "save": base or name, "autosave": name == 'Autosave',
               "date": time.strftime('%Y-%m-%d', time.localtime(os.path.getmtime(p)))}, zones, hhs, sims


def library():
    tmp = tempfile.mkdtemp()
    try:
        for f in glob.glob(os.path.join(TRAY, '*.householdbinary')):
            c = os.path.join(tmp, os.path.basename(f)); shutil.copy(f, c)
            b = open(c, 'rb').read(); ver, ln = struct.unpack_from('<II', b, 0)
            body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
            fa = s4.decode(body, N + 'FamilyData', S, depth=2).get('family_account', {})
            yield {"file": os.path.basename(f), "creator": fa.get('original_creator_string'), "date": time.strftime('%Y-%m-%d', time.localtime(os.path.getmtime(f)))}, fa
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    plan = plan_households()
    want = {(w, n): norm(n) for w, ns in plan.items() for n in ns}
    found = {f"{w}|{n}": [] for (w, n) in want}
    def match(name, members):
        k = norm(name)
        if len(k) < 3: return []   # nameless townie households
        hits = [key for key, v in want.items() if v and (v == k or (len(v) > 3 and len(k) > 3 and (v in k or k in v)))]
        # "The Scotts", "Sylvia & Kenny Cadberry": also match on members' surnames for one-surname plan names
        return hits
    for src, zones, hhs, sims in saves():
        print('save', src['save'], src['date'], len(hhs), 'households')
        for h in hhs:
            ids = (h.get('sims') or {}).get('ids', []) if isinstance(h.get('sims'), dict) else (h.get('sims') or [])
            mem = [sim_brief(sims[i]) for i in ids if i in sims]
            for key in match(h.get('name'), mem):
                w, lot = zones.get(h.get('home_zone'), ('', ''))
                found[f"{key[0]}|{key[1]}"].append({"source": "save", **src, "household": h.get('name'), "world": w, "lot": lot,
                                                    "premade": bool(h.get('premade_household_template_id')), "sims": mem})
    for src, fa in library():
        mem = [sim_brief(s) for s in fa.get('sim', [])]
        for key in match(fa.get('familyname'), mem):
            found[f"{key[0]}|{key[1]}"].append({"source": "library", **src, "household": fa.get('familyname'), "sims": mem})
    out = {"_note": "Her own households in her saves and Library (tools/research/own_households.py). Her spreadsheet wins; these only fill in Sims, to double-check.",
           "found": found}
    json.dump(out, open(os.path.join(ROOT, 'research', 'data', 'own-households.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(sum(1 for v in found.values() if v), 'of', len(found), 'plan households found somewhere;', sum(1 for v in found.values() if len(v) > 1), 'in more than one place')


if __name__ == '__main__':
    main()
