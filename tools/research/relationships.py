"""Relationships between Sims of different planned households, from her old saves and the new one (24 Oct, her ask:
"note down all inter-household relationships so they can be re-added manually in new save").

A household saved to the Library keeps only the relationships inside it, so every link to a Sim of another household
(family, partners, friends, enemies) is lost when it comes over. This lists them, save by save, and says which ones the
new save already has.
    python tools/research/relationships.py           report: research/inter-household-relationships.md (+ research/data/relationships.json)
    python tools/research/relationships.py --names   first run, or after a game update: the game's relationship names
Saves are read from temporary copies. Report only.
"""
import json, os, re, sys, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT, load, save

P = '.EA.Sims4.Persistence.'
NAMES = os.path.join(ROOT, 'research', 'data', 'relationship-names.json')
OUT_JSON = os.path.join(ROOT, 'research', 'data', 'relationships.json')
OUT_MD = os.path.join(ROOT, 'research', 'inter-household-relationships.md')
NEW_SAVE = "Jemma's Sim World"
# the saves her plan's Sims came from (the "from" on each Sim), plus Building #2
OLD_SAVES = ["Rotational", "Season Events", "Horses!", "Return to the HOB", "Not So Berry", "100 Baby Challenge!!", "Will the port be Promising?", "Building #2"]
# the game's relationship bits worth re-adding, by tuning name -> (kind, words); "Target is X of Actor"
WANTED = {
    'family_Target_IsParentOf_Actor': ('family', 'child of'), 'family_Target_IsSonOrDaughterOf_Actor': ('family', 'parent of'),
    'family_Target_IsBrotherSisterOf_Actor': ('family', 'sibling of'), 'family_Target_IsHalfsiblingOf_Actor': ('family', 'half-sibling of'),
    'family_Target_IsStepsiblingOf_Actor': ('family', 'step-sibling of'), 'family_Target_IsStepparentOf_Actor': ('family', 'step-child of'),
    'family_Target_IsStepchildOf_Actor': ('family', 'step-parent of'),
    'family_Target_IsGrandparentOf_Actor': ('family', 'grandchild of'), 'family_Target_IsGrandchildOf_Actor': ('family', 'grandparent of'),
    'family_Target_IsAuntUncleOf_Actor': ('family', 'niece/nephew of'), 'family_Target_IsNieceNephewOf_Actor': ('family', 'aunt/uncle of'),
    'family_Target_IsCousinOf_Actor': ('family', 'cousin of'),
    'family_husband_wife': ('romance', 'married to'), 'romantic-Married': ('romance', 'married to'), 'romantic-Engaged': ('romance', 'engaged to'),
    'romantic-Significant_Other': ('romance', 'going steady with'), 'romantic-SecretLover': ('romance', 'secret lover of'),
    'romantic-FatedMates': ('romance', 'fated mate of'), 'romantic-Divorced': ('romance', 'divorced from'),
    'romantic-Broken_Up': ('romance', 'broken up with'), 'romantic-Broken_Up_Engaged': ('romance', 'broke off engagement with'),
    'HaveBeenExes': ('romance', 'ex of'), 'romantic-Despised_Ex': ('romance', 'ex of'), 'romantic-Frustrated_Ex': ('romance', 'ex of'),
    'romantic-Widow': ('romance', 'widow of'), 'romantic-Widower': ('romance', 'widower of'),
    'friendship-bff': ('friends', 'best friends with'), 'friendship-bff_Evil': ('friends', 'best friends with'),
    'friendship-bff_BromanticPartner': ('friends', 'bromantic partner of'), 'friendship-Confidant': ('friends', 'confidant of'),
    'friendship-good_friends': ('friends', 'good friends with'), 'friendship-good_friends_Evil': ('friends', 'good friends with'),
    'friendship-friend': ('friends', 'friends with'), 'friendship-friend_Evil': ('friends', 'friends with'),
    'friendship-disliked': ('enemies', 'dislikes'), 'friendship-despised': ('enemies', 'despises'), 'friendship-nemesis': ('enemies', 'nemesis of'),
    'SpecialBits_Enemy': ('enemies', 'enemy of'), 'SpecialBits_DeclaredArchEnemy': ('enemies', 'arch-enemy of'),
}
RANK = {w: i for i, w in enumerate(['married to', 'engaged to', 'going steady with', 'secret lover of', 'fated mate of', 'widow of', 'widower of',
                                    'divorced from', 'broke off engagement with', 'broken up with', 'ex of',
                                    'best friends with', 'bromantic partner of', 'confidant of', 'good friends with', 'friends with',
                                    'arch-enemy of', 'nemesis of', 'enemy of', 'despises', 'dislikes'])}
FLIP = {'child of': 'parent of', 'parent of': 'child of', 'grandchild of': 'grandparent of', 'grandparent of': 'grandchild of',
        'niece/nephew of': 'aunt/uncle of', 'aunt/uncle of': 'niece/nephew of', 'step-child of': 'step-parent of', 'step-parent of': 'step-child of'}


def names():
    """Relationship bit ids -> tuning names, from the game's tuning (about a minute)."""
    import tuning
    out = {}
    for p, root in tuning.trees():
        def walk(n):
            if n[0] == 'I':
                if n[1].get('c') in ('RelationshipBit', 'RelationshipTrack'): out[n[1]['s']] = n[1].get('n')
                return
            for k in n[2]: walk(k)
        walk(root)
    save(NAMES, {"_note": "The game's relationship bits and tracks (tuning id -> name), read by tools/research/relationships.py --names.", "names": out})


def plan():
    """Sim name -> [(world, household)], and the family links the site's trees draw between Sims of different households."""
    t = open(os.path.join(ROOT, 'site', 'js', 'data.js'), encoding='utf-8').read()
    D = json.loads(t[t.index('{'):t.rindex('}') + 1])
    who, by_id = {}, {}
    for wn, HH in D['households'].items():
        for hn, hh in HH.items():
            for sm in hh.get('sims', []):
                if sm.get('state') in ('Cat', 'Dog', 'Horse', 'Fox'): continue
                who.setdefault(norm(sm['name']), []).append((wn, hn))
                if sm.get('id'): by_id[sm['id']] = (sm, (wn, hn))
    links = {}   # (name a, name b) sorted -> words from a's side
    def add(x, y, word):
        (sa, ha), (sb, hb) = by_id[x], by_id[y]
        if ha == hb: return
        a, b = sa['name'], sb['name']
        if norm(a) > norm(b): a, b, word = b, a, FLIP.get(word, word)
        links.setdefault((a, b), set()).add(word)
    kids = {}
    for i, (sm, _) in by_id.items():
        for par in sm.get('parents') or []:
            kids.setdefault(par, []).append(i)
            if par in by_id: add(par, i, 'parent of')
        for pa in sm.get('partners') or []:
            if pa[0] in by_id: add(i, pa[0], {'Spouse': 'married to', 'Engaged': 'engaged to', 'Partner': 'going steady with',
                                               'Ex-Spouse': 'divorced from', 'Late Spouse': 'widow of'}.get(pa[1], pa[1].lower()))
    for par, ks in kids.items():   # siblings: a shared parent (an empty "Unknown" box counts)
        for x in ks:
            for y in ks:
                if x < y: add(x, y, 'sibling of')
    return who, links


norm = lambda s: re.sub(r'\s+', ' ', (s or '').replace('’', "'")).strip().lower()


def read(path, S, bit):
    """{sim id: name}, relationships [(a, b, {words})] from one save (a temporary copy)."""
    data = s4.read_save(path)
    sims, pets = {}, set()
    slot = None
    for fn, wt, v in s4.fields(data):
        if fn == 6:
            sm = s4.decode(v, P + 'SimData', S, depth=0)
            sims[sm.get('sim_id')] = f"{sm.get('first_name', '')} {sm.get('last_name', '')}".strip()
            if sm.get('extended_species') not in (None, 0, 1): pets.add(sm.get('sim_id'))
        elif fn == 2: slot = v
    sd = s4.decode(slot, P + 'SaveSlotData', S, depth=0)
    gd = s4.decode(sd['gameplay_data'], P + 'GameplaySaveSlotData', S, depth=0)
    rs = s4.decode(gd.get('relationship_service', b''), P + 'PersistableRelationshipService', S, depth=0)
    rels = []
    for r in rs.get('relationships', []):
        r = s4.decode(r, P + 'PersistableServiceRelationship', S, depth=2)
        a, b = r.get('sim_id_a'), r.get('sim_id_b')
        if a in pets or b in pets or a not in sims or b not in sims: continue
        words = set()
        for key, actor, target in (('bidirectional_relationship_data', a, b), ('sim_a_relationship_data', a, b), ('sim_b_relationship_data', b, a)):
            for x in (r.get(key) or {}).get('bits', []):
                w = WANTED.get(bit.get(str(x)))
                if not w: continue
                # "Target is X of Actor": say it from a's side
                word = w[1] if actor == a else FLIP.get(w[1], w[1])   # WANTED words are the actor's role
                words.add((w[0], word))
        if words: rels.append((a, b, words))
    # the family tree (Feb 2026 update): a fresh save keeps EA's family links here, not as relationships yet
    tree = s4.decode(gd.get('family_tree_service', b''), P + 'PersistableFamilyTreeService', S, depth=6) if gd.get('family_tree_service') else {}
    extra, kids = {}, {}
    for n in ((tree.get('family_tree_graph') or {}).get('nodes') or []):
        x = n.get('sim_id')
        for e in n.get('outgoing_edges') or []:
            y, f = e.get('target_sim_id'), e.get('relationship_flags')
            if x not in sims or y not in sims or x in pets or y in pets: continue
            w = {1: 'parent of', 2: 'child of', 4: 'partner of'}.get(f)
            if not w: continue
            extra.setdefault((x, y), set()).add(('family' if f != 4 else 'romance', w))
            if f == 1: kids.setdefault(x, set()).add(y)
            if f == 2: kids.setdefault(y, set()).add(x)
    for ks in kids.values():
        for x in ks:
            for y in ks:
                if x < y: extra.setdefault((x, y), set()).add(('family', 'sibling of'))
    rels += [(x, y, w) for (x, y), w in extra.items()]
    return sims, rels


def main():
    if '--names' in sys.argv or not os.path.exists(NAMES): names()
    bit = load(NAMES)['names']
    S = s4.save_schema()
    who, plan_links = plan()
    saves = {}
    for p in os.listdir(s4.SAVES):
        if not p.endswith('.save') or '--' in p: continue
        try: n = s4.save_name(s4.read_save(os.path.join(s4.SAVES, p)), S)[0]
        except Exception: continue
        t = os.path.getmtime(os.path.join(s4.SAVES, p))
        if n in OLD_SAVES + [NEW_SAVE] and (n not in saves or t > saves[n][1]): saves[n] = (p, t)
    found = {}   # (sim a, sim b) sorted by name -> {save: words}
    new_pairs = {}
    for sv in OLD_SAVES + [NEW_SAVE]:
        if sv not in saves: print('not found:', sv); continue
        sims, rels = read(os.path.join(s4.SAVES, saves[sv][0]), S, bit)
        for a, b, words in rels:
            na, nb = sims[a], sims[b]
            ha, hb = who.get(norm(na)), who.get(norm(nb))
            if not ha or not hb or set(ha) & set(hb): continue   # both in the plan, in different households
            if norm(na) > norm(nb): na, nb, words = nb, na, {(k, FLIP.get(w, w)) for k, w in words}
            key = (na, nb)
            if sv == NEW_SAVE: new_pairs.setdefault(key, set()).update(words)
            else: found.setdefault(key, {}).setdefault(sv, set()).update(words)
        print(sv, len(rels))
    rows = []
    for key in plan_links:   # on the site's trees but in none of the old saves
        found.setdefault(key, {})
    for (na, nb), by_save in found.items():
        words = set().union(set(), *by_save.values())
        fam = sorted({w for k, w in words if k == 'family'})
        other = sorted({w for k, w in words if k != 'family'}, key=lambda w: RANK.get(w, 99))
        # keep the strongest friendship/romance word of each kind
        kinds = {}
        for k, w in sorted(((k, w) for k, w in words if k != 'family'), key=lambda x: RANK.get(x[1], 99)): kinds.setdefault(k, w)
        have = new_pairs.get((na, nb), set())
        rows.append({"a": na, "b": nb, "a_household": " / ".join(f"{h} ({w})" for w, h in who[norm(na)]), "b_household": " / ".join(f"{h} ({w})" for w, h in who[norm(nb)]),
                     "family": fam, "romance": kinds.get('romance'), "friends": kinds.get('friends'), "enemies": kinds.get('enemies'),
                     "site": sorted(plan_links.get((na, nb), [])), "saves": sorted(by_save), "in_new_save": sorted(w for k, w in have)})
    save(OUT_JSON, {"_note": "Relationships between Sims of different planned households, from her old saves (tools/research/relationships.py, " + time.strftime('%Y-%m-%d') + ").",
                    "saves": {k: v[0] for k, v in saves.items()}, "pairs": rows})
    write_md(rows, saves)


def write_md(rows, saves):
    L = ["# Relationships between households (" + time.strftime('%d %b %Y').lstrip('0') + ")", "",
         "Made by tools/research/relationships.py from copies of your saves. A household brought in from the Library loses every link to Sims outside it, so these are the ones to put back by hand (MC Command Center, which you have, can set family and relationships), or to keep by saving the households together. Only Sims on the site, in two different planned households.", "",
         "Each line ends with what the new save “Jemma's Sim World” already has between them (EA’s premades start with their own links).", ""]
    hh = lambda r, s_: r[s_ + '_household']
    def line(r, words):
        have = r['in_new_save']
        partnered = 'partner of' in have
        missing = [w for w in words if w not in have and not (partnered and w in ('married to', 'engaged to', 'going steady with'))]
        status = "in the new save" if not missing else ("to add" if not have else f"to add ({', '.join(missing)}); new save has {', '.join(have)}")
        src = f" · saves: {', '.join(r['saves'])}" if r['saves'] else " · on the site only"
        return f"- **{r['a']}** ({hh(r, 'a')}) {'; '.join(words)} **{r['b']}** ({hh(r, 'b')}){src} · **{status}**"
    close = ('best friends with', 'bromantic partner of', 'confidant of', 'good friends with')
    site_rel = lambda r: [w for w in r['site']]
    groups = [("Family and partners on the site's trees", "From the site's family trees (parents, siblings, partners); the plan wins over any save.",
               [(r, site_rel(r)) for r in rows if r['site']]),
              ("Family only in an old save", "Links a save's own story made that the site's trees don't have. Your call: keep (Claude adds them to the site) or leave.",
               [(r, r['family']) for r in rows if r['family'] and not set(r['family']) & set(r['site'])]),
              ("Partners and exes from your saves", "Not on the site's trees.",
               [(r, [r['romance']]) for r in rows if r['romance'] and r['romance'] not in r['site'] and not r['family']]),
              ("Close friends from your saves", "Best friends, confidants and good friends.",
               [(r, [r['friends']]) for r in rows if r['friends'] in close and not r['family'] and not r['romance']]),
              ("Enemies from your saves", "",
               [(r, [r['enemies']]) for r in rows if r['enemies'] and r['enemies'] != 'dislikes' and not r['family'] and not r['romance']])]
    shown = 0
    for title, note, rs in groups:
        L += [f"## {title} ({len(rs)})", ""] + ([note, ""] if note else []) + [line(r, w) for r, w in sorted(rs, key=lambda x: (x[0]['a_household'], x[0]['a']))] + [""]
        shown += len(rs)
    L += [f"Not listed: lighter links (friends, acquaintances, dislikes); all {len(rows)} pairs are in research/data/relationships.json.", ""]
    L += ["Saves read: " + ", ".join(f"{k} ({v[0]})" for k, v in saves.items()), ""]
    open(OUT_MD, 'w', encoding='utf-8').write(chr(10).join(L))
    print('wrote', OUT_MD, len(rows))


if __name__ == '__main__':
    main()
