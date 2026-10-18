"""Fill EA's premade households on the site from the game's own files (her choice, 17 Oct: game files, only households
that match her spreadsheet; EA townies are checked against the Sims Wiki as well).

    python tools/premade_import.py           report: which plan households would be filled, and from which EA household
    python tools/premade_import.py --apply   write the Sims into data/worlds/<world>.json (households[...].sims), then rebuild

Reads research/data/premades.json (tools/research/premades.py). A household that already has Sims on the site is left
alone. After a fresh import, run tools/premade_family_fix.py --apply for the unknown parents that join siblings and cousins. MATCHES below says which EA household fills which plan household, and which members go where when she has
split a family (Knox Greenburg lives apart from the rest). Anything not listed is hers to decide (or comes from her save).
"""
import json, os, re, sys, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, load, save

# plan household (as the site names it) -> EA household ("short" in premades.json), optionally only some members
MATCHES = {
    "willow-creek": {"Broke": "Broke", "Pancakes": "Pancakes", "Spencer-Kim-Lewis": "Spencer-Kim-Lewis"},
    "newcrest": {"BFF": "BFF"},
    "windenburg": {"Fyres": "Fyres", "Munch": "Munch", "Partihaus": "Partihaus", "Free Spirits": "Bohemian"},
    "san-myshuno": {"Behr": "Behr", "Benali": "Benali", "Bheeda": "Bheeda", "Jang": "Jang", "Jeong": "Jeong", "Lobo": "Lobo",
                    "Pizzazz": "Pizzazz", "Rasoya": "Rasoya", "Feng": "Hu"},
    "forgotten-hollow": {"Straud": "NPC_VS_Nosferatu", "Vatore": "NPC_VS_Wilsons"},
    "brindleton-bay": {"Delgato": "Delgato", "Hecking": "Hecking", "Lynx": "Lynx"},
    "del-sol-valley": {"Bailey-Moon": "BaileyMoon", "Ward": "Ward"},
    "strangerville": {"Cahill": "Strangerville_Hermit", "Roswell": "Strangerville_OldBlood", "Sigworth": "Strangerville_PatientZero"},
    "sulani": {"Hoapili": "Hoapili", "Kahananui": "Kahananui", "Kealoha": "Kealoha", "Ngata": "Ngata"},
    "glimmerbrook": {"Charm": "Charm", "Amicable Acolytes": "Acolytes"},
    "britechester": {"Elderberry": "ElderlyCouple"},
    "evergreen-harbor": {"Harris": "Harris", "Sterling Rico": "Entrepreneur", "Tinker": "Maker",
                         "Greenburg": ("Ecomaster", lambda s: s["name"] != "Knox Greenburg"), "Knox Greenburg": ("Ecomaster", lambda s: s["name"] == "Knox Greenburg")},
    "mt-komorebi": {"Akiyama": "Commuter", "Ito": "Affluent", "Nishidake": "Elder"},
    "henford-on-bagley": {"Moody & McMillan": "MoodyMacMillan", "The Scotts": "Scott", "The Watsons": "Watson"},
    "tartosa": {"Laurent": "Laurent", "Markovic": "Markovic", "Soto": "Soto", "Monticapp": "Monty"},   # renamed Monticapp (18 Oct)
    "moonwood-mill": {"Volkov": "WolfTown_Volkov"},
    "copperdale": {"Harjo": "HS_Harjo", "Prescott": "HS_Prescott", "Price": "HS_Price"},
    "san-sequoia": {"Michaelson": "Ep13_BayArea_Michaelson", "Robles": "Ep13_BayArea_Robles", "Robles-Ruano": "Ep13_BayArea_RoblesRuano",
                    "Luna-Sullivan": "Ep13_BayArea_LunaSullivan"},
    "chestnut-ridge": {"Gooseman": "RetiredHorseChampion", "The Grove Family": "AnimalFamily", "Sienna & Flapjack": "HorseTrainer"},
    "tomarang": {"Bun Ma": "BunMaFamily", "Cahyaputri": "CahyaputriFamily"},
    "ciudad-enamorada": {"Nadir": "RockyRelationship", "López": "SingleParent"},
    "ravenwood": {"Aether": "Aether", "Gomes": "Gomes", "Izadi-Gomes": "IzadiGomes"},
    "nordhaven": {"Koopman": "Koopman_Ep18World", "Loden": "Loden_Ep18World", "Sarpong": "Sarpong_Ep18World", "Urbane Housesharers household": "Urbz_Ep18World"},
    "gibbi-point": {"Addam Commune": "Addam", "Chavez-Ralston": "GomesRalston", "Perry": "Perry"},
    "ondarion": {"Abrantes": "Abrantes", "Ananou": "Ananou", "Capp": "Capp", "Darong": "Darong", "Thebe": "Thebe",
                 "Aloisio Romualdo": "Romualdo", "Enzo Alto": ("Alto", lambda s: s["name"] == "Enzo Alto")},
}
# degrees each university is distinguished in (the game's University tuning, prestige_degrees)
DISTINGUISHED = {"ScienceUniversity": {"Biology", "Computer Science", "Economics", "Physics", "Psychology", "Villainy"},
                 "ArtsUniversity": {"Art History", "Communications", "Culinary Arts", "Drama", "Fine Arts", "History", "Language & Literature"}}
UNI = {"ScienceUniversity": "Foxbury Institute", "ArtsUniversity": "University of Britechester"}
OCCULT = {"VAMPIRE": "Vampire", "MERMAID": "Mermaid", "WEREWOLF": "Werewolf", "WITCH": "Spellcaster"}
FRIENDSHIP, ROMANCE = "16650", "16651"


def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and')).strip('-')


def friend_word(v):   # the game's own friendship thresholds (LTR_Friendship_Main)
    return "Despised" if v <= -70 else "Disliked" if v <= -20 else "Good Friends" if v >= 60 else "Friends" if v >= 35 else "Acquaintances"


def rel_label(loot, bits, tracks):
    named = [b for b in bits if b not in ("Close", "Distant", "Strict", "Permissive", "Supportive", "Difficult", "Jokesters",
                                          "Wholesome", "Steamy", "Strained", "Unpredictable", "Adopted", "Adopted by")]   # family and romance dynamics, adoption: not friendships
    if named: return named[0]
    if FRIENDSHIP in tracks: return friend_word(tracks[FRIENDSHIP])
    if ROMANCE in tracks and tracks[ROMANCE] >= 10: return "Romantic Interest"
    m = re.search(r'Starting_NPC_(\w+)', loot)
    words = {"GoodFriend": "Good Friends", "Friends": "Friends", "CloseFriends": "Good Friends", "MildlyDisliked": "Disliked", "SignificantOther": "Partner"}
    return words.get(re.sub(r'_-?\d+$', '', m.group(1)), "Acquaintances") if m else None


def school(s):
    c = (s["careers"] or [{}])[0]
    if s.get("degree"):
        deg, uni = s["degree"][0], s["degree"][-1]
        return f"{UNI.get(uni, uni)} · {deg}" + (" (distinguished)" if deg in DISTINGUISHED.get(uni, ()) else "")
    m = re.match(r'(High|Grade) School (\w) Student', c.get("title") or "")
    return f"{m.group(1)} school · grade {m.group(2)}" if m else None


def main(apply):
    P = load(os.path.join(ROOT, 'research', 'data', 'premades.json'))
    plan, report = {}, []
    used_ids = set()
    for wf in os.listdir(os.path.join(ROOT, 'data', 'worlds')):
        W = load(os.path.join(ROOT, 'data', 'worlds', wf))
        for hh in (W.get('households') or {}).values():
            for s in hh.get('sims', []):
                if s.get('id'): used_ids.add(s['id'])
    for w in (P and MATCHES):
        path = os.path.join(ROOT, 'data', 'worlds', f'{w}.json')
        if not os.path.exists(path): report.append(f"{w}: no world file"); continue
        W = load(path); plan[w] = (path, W)
    # ids for every Sim we will add, so family links and friendships can point across households
    ids, chosen = {}, []
    for w, m in MATCHES.items():
        if w not in plan: continue
        W = plan[w][1]
        for name, spec in m.items():
            short, keep = spec if isinstance(spec, tuple) else (spec, None)
            cands = [h for h in P["households"] if h["short"] == short and (not keep or any(keep(s) for s in h["sims"]))]   # two EA households can share a name (the Altos)
            h = cands[0] if cands else None
            if not h: report.append(f"{w} / {name}: EA household {short} not found"); continue
            have = (W.get('households') or {}).get(name, {}).get('sims')
            if have: report.append(f"{w} / {name}: already has Sims, left alone"); continue
            sims = [s for s in h["sims"] if not keep or keep(s)]
            for s in sims:
                sid = slug(s["name"])
                if sid in used_ids or sid in ids.values(): sid = f"{sid}-{w}"
                ids[(s["template"], s["sim_id"])] = sid
            chosen.append((w, name, h, sims))
            report.append(f"{w} / {name}  <-  {short}: {', '.join(s['name'] for s in sims)}")
    by_tpl = {k[0]: v for k, v in ids.items() if k[0]}
    by_sim = {k[1]: v for k, v in ids.items()}
    names = {v: s["name"] for (w, n, h, sims) in chosen for s in sims for k, v in ids.items() if k == (s["template"], s["sim_id"])}
    # family: parents and partners from each household file and template, plus EA's links between households
    parents, partners = {}, {}
    def add_parent(child, par):
        if child and par and par not in parents.setdefault(child, []): parents[child].append(par)
    def add_partner(a, b, kind):
        if a and b and a != b:
            if not any(p == b for p, _ in partners.setdefault(a, [])): partners[a].append([b, kind])
            if not any(p == a for p, _ in partners.setdefault(b, [])): partners[b].append([a, kind])
    for w, name, h, sims in chosen:
        for x, kind, y, bits in h["relationships"]:
            a, b = by_tpl.get(x), by_tpl.get(y)
            if kind in ("FATHER", "MOTHER"): add_parent(b, a)
            elif kind == "SPOUSE": add_partner(a, b, "Spouse")
        for s in sims:
            me = by_sim[s["sim_id"]]
            for rel, other in s["family"]:
                if rel in ("RELATIONSHIP_MOTHER", "RELATIONSHIP_FATHER"): add_parent(me, by_sim.get(other))
            if s.get("fiance") and by_sim.get(s["fiance"]): add_partner(me, by_sim[s["fiance"]], "Engaged")
            elif s.get("partner") and by_sim.get(s["partner"]) and not any(p == by_sim[s["partner"]] for p, _ in partners.get(me, [])):
                add_partner(me, by_sim[s["partner"]], "Spouse")   # the game's significant other is a spouse (a steady partner is kept elsewhere)
    for a, flag, b in P["between"]["family"]:
        A, B = by_tpl.get(a), by_tpl.get(b)
        if flag in ("PARENT", "SECRET_PARENT"): add_parent(B, A)
        elif flag == "CHILD": add_parent(A, B)
        elif flag == "SPOUSE": add_partner(A, B, "Spouse")
    # friendships: within a household file, and EA's starting ones between households
    rels = {}
    def add_rel(a, b, label):
        if a and b and label and a != b:
            for x, y in ((a, b), (b, a)):
                lst = rels.setdefault(x, [])
                if not any(n == names[y] for n, _ in lst): lst.append([names[y], label])
    for a, loot, b, bits, tracks in P["between"]["relationships"]:
        add_rel(by_tpl.get(a), by_tpl.get(b), rel_label(loot, bits, tracks))
    for w, name, h, sims in chosen:
        for s in sims:
            for other, bits in s.get("rels", []):
                b = [x for x in bits if x not in ("Has Met",)]
                if b: add_rel(by_sim[s["sim_id"]], by_sim.get(other), b[0])

    for w, name, h, sims in chosen:
        W = plan[w][1]; out = []
        for s in sims:
            me = by_sim[s["sim_id"]]; c = (s["careers"] or [None])[0]
            d = {"id": me, "name": s["name"], "sex": s["sex"] or "x", "origin": "Premade", "age": s["age"]}
            if s.get("species"): d["state"] = s["species"]
            elif s.get("occult"): d["state"] = OCCULT.get(s["occult"], s["occult"].title())
            young = s.get("species") or s["age"] in ("Baby", "Infant", "Toddler")   # pets and the very young have no aspiration
            if s.get("aspiration") and not young: d["aspiration"] = s["aspiration"]
            if s["traits"]: d["traits"] = s["traits"]
            if s.get("bonus") and not young: d["bonus"] = s["bonus"]
            sc = school(s)
            d["career"] = "" if sc or not c else " · ".join(x for x in (c["career"], c["title"]) if x) + (f" (level {c['level']})" if c.get("level") else "")
            if sc: d["school"] = sc
            if s["skills"]: d["skills"] = s["skills"]
            if rels.get(me): d["rels"] = rels[me]
            if parents.get(me): d["parents"] = parents[me]
            if partners.get(me): d["partners"] = partners[me]
            if s.get("dynasty") and s["dynasty"].get("name"): d["dynasty"] = {"name": s["dynasty"]["name"], "role": "head" if s["dynasty"].get("head") else "member"}
            if s.get("clubs"): d["clubs"] = [{"name": n, "role": "leader" if lead else "member"} for n, lead in s["clubs"] if n]
            out.append(d)
        W.setdefault('households', {}).setdefault(name, {})["sims"] = out
    print("\n".join(report))
    print(f"\n{len(chosen)} households, {sum(len(x[3]) for x in chosen)} Sims")
    if apply:
        for w, (path, W) in plan.items(): save(path, W)
        subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
