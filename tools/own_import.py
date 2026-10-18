"""Fill her own households (not EA's) from her saves or Library, for now, for her to double-check (her rule, 18 Oct).

    python tools/own_import.py           report: which copy would fill each household, and every other copy found
    python tools/own_import.py --apply   write the Sims into data/worlds/<world>.json, write the review list
                                         (research/own-households-review.md), then rebuild

Her spreadsheet says which households exist and where; this only fills in their Sims. Only exact name matches are used
(research/data/own-households.json, from tools/research/own_households.py). The newest copy wins, her Building save
last (its homes hold placeholder households). Named households ("Sylvia & Kenny Cadberry") take just those Sims, from
any household that has them. Households she will upload herself, or that need her, are skipped and listed.
Saves are read from temporary copies; Library files are copied first. Sims get "origin": "Mine" and "from" (the copy used).
"""
import glob, json, os, re, shutil, struct, subprocess, sys, tempfile, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
from common import ROOT, load, save

S = s4.save_schema(); P = '.EA.Sims4.Persistence.'; N = '.EA.Sims4.Network.'
TRAY = os.path.join(os.path.dirname(s4.SAVES), 'Tray')
AGES = {1: "Baby", 2: "Toddler", 4: "Child", 8: "Teen", 16: "Young Adult", 32: "Adult", 64: "Elder", 128: "Infant"}
SEX = {4096: "m", 8192: "f"}
SPECIES = {2: "Dog", 3: "Cat", 4: "Dog", 5: "Fox", 6: "Horse"}
# households to leave for her (she'll upload them, or they need her answer first), with why
SKIP = {"San Sequoia|Lovejoy": "she’ll upload the Lovejoys herself (two related households)",
        "Windenburg|Tiquelle": "four Tiquelle households in her plan",
        "Ondarion|Monty": "her recreated Sims 2 Montys (the save copies are EA’s Montys)",
        "Ondarion|Alto": "the vineyard Altos are still to be created",
        "Tomarang|Cadberry": "which Cadberrys live at Isda Riverfront is hers to say",
        "Ravenwood|Specter": "waiting on her answer (who owns Specter Row)",
        "San Myshuno|Bro & Kennedy": "waiting on her answer (who Kennedy is)"}
EA = {"Britechester|Pleasant"}
# her choice (19 Oct): her "Rotational" save matches her plan best, so these use its copy (save, world it lives in), replacing what's there
PREFER = {k: ("Rotational", w) for k, w in {"Brindleton Bay|Ventura": "Brindleton Bay", "Newcrest|LeBlanc": "Newcrest", "Oasis Springs|De Costa": "Oasis Springs",
          "Oasis Springs|Rivera": "Oasis Springs", "Willow Creek|Reynolds": "Willow Creek", "Willow Creek|Kopf": "Willow Creek",
          "Willow Creek|Davidson": "Willow Creek", "Willow Creek|Barraza": "Willow Creek"}.items()}
TARGET = {"Willow Creek|Davidson": "Davidson 1"}   # the plan has two Davidson homes; Evelyn, Ray and George live at Streamlet Single (the first)   # EA's own household (the Pleasant twins): game files, not a save
norm = lambda x: re.sub(r'[^a-z]', '', (x or '').lower())


def names_wanted(plan_name):
    """'Sylvia & Kenny Cadberry' -> ['Sylvia Cadberry', 'Kenny Cadberry']; 'Ella-Mint Cadberry' -> ['Ella-Mint Cadberry']."""
    m = re.match(r"^([A-Z][\w'-]+(?: & [A-Z][\w'-]+)*) ([A-Z][\w'-]+)$", plan_name)
    if not m: return None
    return [f"{f} {m.group(2)}" for f in m.group(1).split(' & ')]


def main(apply):
    G = load(os.path.join(ROOT, 'research', 'data', 'game-names.json'))
    found = load(os.path.join(ROOT, 'research', 'data', 'own-households.json'))['found']
    single = {}
    for wf in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json')):
        W = load(wf)
        for hn, hh in (W.get('households') or {}).items():
            if hh.get('single'): single[f"{W['name']}|{hn}"] = True
    # pick a copy for each household
    plan, review = {}, []
    def rank(c): return (c['source'] == 'save' and c['save'].startswith('Building'), -int(c['date'].replace('-', '')))
    for key, copies in sorted(found.items()):
        w, hn = key.split('|', 1)
        if key in SKIP: review.append((key, 'left for you: ' + SKIP[key], copies)); continue
        if key in EA: continue
        want = names_wanted(hn)
        if want and (single.get(key) or ' & ' in hn):
            # named Sims: any copy that has them
            ok = [c for c in copies if all(any(s['name'] == n for s in c['sims']) for n in want)]
            if ok: ok.sort(key=rank); plan[key] = (ok[0], want); review.append((key, 'filled', copies)); continue
            # not a Sim's name after all ("Santiago Ojo" is Alicia Santiago and Miko Ojo): fall back to the household name
        if key in PREFER:
            sv, ww = PREFER[key]
            pick = [c for c in copies if c['source'] == 'save' and c.get('save') == sv and c.get('world') == ww]
            if pick: plan[key] = (pick[0], None); review.append((key, 'filled', copies)); continue
        exact = [c for c in copies if norm(re.sub(r' Household$', '', c['household'] or '')) == norm(hn)]   # "Eclectic Arts Household" is her Eclectic Arts
        if not exact: review.append((key, 'not found in any save or the Library (only other names)', copies)); continue
        exact.sort(key=rank); plan[key] = (exact[0], None); review.append((key, 'filled', exact))
    for key in found:
        if not found[key] and key not in SKIP: pass
    # read the chosen copies' Sims in full
    need = {}
    for key, (c, want) in plan.items():
        need.setdefault((c['source'], c['file']), []).append((key, c, want))
    full = {}
    tmp = tempfile.mkdtemp()
    try:
        for (src, f), items in need.items():
            if src == 'save':
                data = s4.read_save(os.path.join(s4.SAVES, f)); sims, hhs = {}, []
                for fn, wt, v in s4.fields(data):
                    if fn == 6: sm = s4.decode(v, P + 'SimData', S, depth=8); sims[sm.get('sim_id')] = sm
                    elif fn == 5: hhs.append(s4.decode(v, P + 'HouseholdData', S, depth=2))
                for key, c, want in items:
                    ids = [s['sim_id'] for s in c['sims']]
                    if want: ids = [s['sim_id'] for s in c['sims'] if s['name'] in want]
                    full[key] = [sims[i] for i in ids if i in sims]
            else:
                cp = os.path.join(tmp, f); shutil.copy(os.path.join(TRAY, f), cp)
                b = open(cp, 'rb').read(); ver, ln = struct.unpack_from('<II', b, 0)
                body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
                fa = s4.decode(body, N + 'FamilyData', S, depth=10).get('family_account', {})
                for key, c, want in items:
                    full[key] = [s for s in fa.get('sim', []) if not want or f"{s.get('first_name', '')} {s.get('last_name', '')}".strip() in want]
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    def skill(h, v):
        k = G['skills'].get(str(h))
        if not k: return None
        name, start, kind = k
        if v <= start and kind != 'CHILD': return None
        lv, tot = 0, 0.0
        for st in G['skill_levels'].get(kind, G['skill_levels']['MAJOR']):
            tot += st
            if v >= tot: lv += 1
        return [name, lv, len(G['skill_levels'].get(kind, G['skill_levels']['MAJOR']))]
    def career(c):
        t = G['tracks'].get(str(c.get('track_uid')))
        if not t: return None
        i = c.get('track_level', 0); title = t['titles'][i] if i < len(t['titles']) else None
        return t['career'], title, c.get('user_display_level') or i + 1

    worlds = {load(p)['name']: p for p in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))}
    used = set()
    for p in worlds.values():
        W0 = load(p)
        for hn0, hh in (W0.get('households') or {}).items():
            if f"{W0['name']}|{hn0}" in PREFER or any(f"{W0['name']}|{k}" in TARGET and TARGET[f"{W0['name']}|{k}"] == hn0 for k in [hn0.rsplit(' ', 1)[0]]): continue   # being replaced
            used.update(s.get('id') for s in hh.get('sims', []) if s.get('id'))
    out_by_world = {}
    for key, sims in full.items():
        w, hn = key.split('|', 1); c, want = plan[key]
        src = f"{'Library' if c['source'] == 'library' else 'save “' + c['save'] + '”'} ({c['date']})"
        idmap = {}
        for s in sims:
            nm = f"{s.get('first_name', '')} {s.get('last_name', '')}".strip()
            sid = re.sub(r'[^a-z0-9]+', '-', nm.lower()).strip('-') or 'sim'
            while sid in used: sid += '-' + re.sub(r'[^a-z]+', '-', w.lower()).strip('-')
            used.add(sid); idmap[s.get('sim_id')] = (sid, nm)
        rows = []
        for s in sims:
            at = s.get('attributes') or {}; sid, nm = idmap[s.get('sim_id')]
            d = {"id": sid, "name": nm, "sex": SEX.get(s.get('gender'), 'x'), "origin": "Mine", "from": src, "age": AGES.get(s.get('age'))}
            sp = SPECIES.get(s.get('extended_species'))
            if sp: d["state"] = sp
            young = sp or d["age"] in ("Baby", "Infant", "Toddler")
            a = G['aspirations'].get(str(s.get('primary_aspiration')))
            if a and not young: d["aspiration"] = a[0]
            tr = [G['traits'][str(t)][0] for t in ((at.get('trait_tracker') or {}).get('trait_ids') or []) if str(t) in G['traits'] and G['traits'][str(t)][1] == 'PERSONALITY']
            if tr: d["traits"] = list(dict.fromkeys(tr))
            if a and a[1] and not young: d["bonus"] = a[1]
            cs = [x for x in (career(c2) for c2 in (at.get('sim_careers') or {}).get('careers', [])) if x]
            sch = next((x for x in cs if 'Student' in (x[1] or '') or 'School' in (x[0] or '')), None)
            job = next((x for x in cs if x is not sch), None)
            m = re.match(r'(High|Grade) School (\w) Student', (sch or ('', ''))[1] or '')
            d["career"] = f"{job[0]} · {job[1]} (level {job[2]})" if job and job[1] else (job[0] if job else "")
            if m: d["school"] = f"{m.group(1)} school · grade {m.group(2)}"
            sk = [x for x in (skill(k.get('name_hash'), k.get('value', 0)) for k in (at.get('skill_tracker') or {}).get('skills', [])) if x and x[1] > 0]
            if sk: d["skills"] = sk
            par = [idmap[r.get('sim_id')][0] for r in ((at.get('genealogy_tracker') or {}).get('family_relations') or [])
                   if r.get('relation_type') in ('RELATIONSHIP_MOTHER', 'RELATIONSHIP_FATHER') and r.get('sim_id') in idmap]
            if par: d["parents"] = par
            so = s.get('significant_other')
            if so in idmap: d["partners"] = [[idmap[so][0], "Spouse"]]
            elif s.get('fiance') in idmap: d["partners"] = [[idmap[s['fiance']][0], "Engaged"]]
            rows.append(d)
        out_by_world.setdefault(w, {})[TARGET.get(key, hn)] = (rows, src)
    # report and review list
    lines = ["# Your own households: where their Sims came from (18 Oct)", "",
             "Your spreadsheet says which households exist and where; these copies only fill in their Sims for now. "
             "The newest copy was used (your Building save last). Every other copy is listed so you can pick another.", ""]
    for key, why, copies in review:
        w, hn = key.split('|', 1)
        used_src = out_by_world.get(w, {}).get(hn, (None, None))[1]
        head = f"- **{hn}** ({w}): " + (f"filled from {used_src}" if why == 'filled' and used_src else why)
        lines.append(head)
        for c in copies:
            where = 'Library' if c['source'] == 'library' else f"save “{c['save']}”" + (f", {c['world']} / {c['lot']}" if c.get('world') else '')
            lines.append(f"  - {where} ({c['date']}), “{c['household']}”: {', '.join(s['name'] + (' (' + s['age'] + ')' if s.get('age') else '') for s in c['sims'])}")
    none = [k for k, v in found.items() if not v and k not in SKIP and k not in EA]
    if none:
        lines += ["", "**Not found in any save or the Library:** " + ", ".join(f"{k.split('|')[1]} ({k.split('|')[0]})" for k in sorted(none))]
    text = "\n".join(lines) + "\n"
    print("\n".join(l for l in lines if not l.startswith("  - ")))
    if apply:
        for w, hhs in out_by_world.items():
            p = worlds[w]; W = load(p)
            for hn, (rows, src) in hhs.items():
                h = W.setdefault('households', {}).setdefault(hn, {})
                if h.get('sims') and f"{w}|{hn}" not in PREFER and hn not in TARGET.values(): continue
                h['sims'] = rows
                if h.get('single') and len(rows) > 1: h.pop('single')
            save(p, W)
        open(os.path.join(ROOT, 'research', 'own-households-review.md'), 'w', encoding='utf-8').write(text)
        subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
