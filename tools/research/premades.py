"""EA's premade households as the game starts them, read from the game's own files (17 Oct).

    python tools/research/premades.py      read the game (several minutes), write research/data/premades.json

Three layers:
- the premade household files (householdbinary, as in the Library): each Sim's name, life stage, aspiration, career
  and level, skills, partner, and the premade templates they come from;
- each Sim's own file (.siminfo): their traits;
- the tuning: household templates (who is whose parent or spouse), Sim templates (dynasty seeds), and
  world.premade_sim_relationships (EA's starting friendships and family links between households).
Names that are only text keys come from the game's English strings. Report only; nothing in data/ changes.
"""
import glob, json, os, re, struct, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
import tuning as T
from common import ROOT

HHBIN, SIMINFO = 0xB3C438F0, 0x025ED6F4
AGES = {1: "Baby", 2: "Toddler", 4: "Child", 8: "Teen", 16: "Young Adult", 32: "Adult", 64: "Elder", 128: "Infant"}
SEX = {4096: "m", 8192: "f"}
FAME_LEVEL = {191807: 1, 191819: 2, 191820: 3, 191817: 4, 191818: 5}   # fameTrait_Level1-5 (Rising Star … Global Superstar)
CLASSES = {'PremadeSimTemplate', 'PremadeHouseholdTemplate', 'Trait', 'AspirationTrack', 'Career', 'DetectiveCareer', 'NobleCareer',
           'SmallBusinessCareer', 'WorkFromHomeCareer', 'TunableCareerTrack', 'CareerLevel', 'Skill', 'LifeSkillStatistic', 'LootActions',
           'ClubSeed', 'DynastySeed', 'UniversityMajor', 'University', 'Clan', 'SmallBusinessSeed', 'RelationshipBit', 'Sentiment'}
SPECIES = {1: None, 2: "Dog", 3: "Cat", 4: "Dog", 5: "Fox", 6: "Horse"}
TEXT_FIELDS = ('name', 'display_name', 'dynasty_name', 'club_name', 'display_text', 'clan_name', 'business_name')


def text(key, en):
    if key is None: return None
    try: return en.get(int(key, 16) if str(key).startswith('0x') else int(key))
    except ValueError: return None


def main():
    en = s4.english()
    tu = T.Tuning(CLASSES); I = tu.inst
    val = lambda i, f: T.value(T.field(I[i]['tree'], f)) if i in I else None
    # skill levels: points needed per level, by the skill's level type
    levels = {}
    for p, root in T.trees():
        merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]} if root[2] and root[2][0][0] == 'g' else {}
        def walk(n):
            if n[0] == 'M' and n[1].get('n') in ('statistics.skill', 'world.premade_sim_relationships'):
                levels[n[1]['n']] = T.resolve(n, merged)
            for k in n[2]: walk(k)
        walk(root)
    sk = T.field(levels['statistics.skill'][2][0], 'SKILL_LEVEL_LIST')
    LEVELS = {T.leaves(u)[0]: [float(x) for x in T.leaves(u)[1:]] for u in sk[2]}

    def skill(name_hash, value):
        if name_hash not in I: return None
        start = float(val(name_hash, 'initial_value') or 0)
        if value <= start and (val(name_hash, 'skill_level_type') or 'MAJOR') != 'CHILD': return None   # every skill sits at its starting value until learnt
        n = text(val(name_hash, 'stat_name'), en); kind = val(name_hash, 'skill_level_type') or 'MAJOR'
        steps = LEVELS.get(kind, LEVELS['MAJOR']); lv, tot = 0, 0.0
        for s in steps:   # each entry is the points for the next level (cumulative)
            tot += s
            if value >= tot: lv += 1
        return [n, lv, len(steps)] if n else None

    level_at = {}
    tracks = {i: v for i, v in I.items() if v['class'] == 'TunableCareerTrack'}
    parent = {int(b): i for i, v in tracks.items() for b in T.leaves(T.field(v['tree'], 'branches') or ['', {}, []]) if b.isdigit()}
    def depth(t): return len(T.leaves(T.field(tracks[parent[t]]['tree'], 'career_levels') or ['', {}, []])) + depth(parent[t]) if t in parent else 0
    for i, v in tracks.items():
        for n, lv in enumerate(T.leaves(T.field(v['tree'], 'career_levels') or ['', {}, []])):
            if lv.isdigit(): level_at[int(lv)] = (i, n, depth(i) + n + 1)
    def career(c):
        cid, tid, lvl = c.get('career_uid'), c.get('track_uid'), c.get('user_display_level') or (c.get('track_level', 0) + 1)
        track = I.get(tid)
        if not track: return None
        root = tid
        while root in parent: root = parent[root]   # a branch is named after its career (Criminal, not Boss)
        name = text(T.value(T.field(I[root]['tree'], 'career_name')), en)
        lvls = T.leaves(T.field(track['tree'], 'career_levels') or ['', {}, []])
        idx = c.get('track_level', 0)
        title = text(val(int(lvls[idx]), 'title'), en) if idx < len(lvls) and int(lvls[idx]) in I else None
        return {"career": name, "title": title, "level": lvl}

    def career_from_level(lv):
        if lv not in level_at: return None
        tid, n, user = level_at[lv]; return career({'track_uid': tid, 'track_level': n, 'user_display_level': user})
    def tname(i):
        if i not in I: return None
        for f in TEXT_FIELDS:
            t = text(val(i, f), en)
            if t: return t
        return I[i]['name']
    traits_of = {}   # siminfo key -> trait ids (the uint64 list inside the file)
    tids = {i for i, v in I.items() if v['class'] == 'Trait'}
    def traits_in(d):
        best = []
        for off in range(8, len(d) - 8):
            n = d[off - 1]
            if 1 <= n <= 60 and off + 8 * n <= len(d):
                ids = list(struct.unpack_from('<%dQ' % n, d, off))
                if all(x in tids for x in ids) and n > len(best): best = ids
        return best

    hhs, siminfo = {}, {}
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', 'Client*.package'), recursive=True), key=lambda p: 'Delta' in p):
        for e in s4.index(p):
            if e[0] == SIMINFO: siminfo[e[2]] = (p, e)
            if e[0] != HHBIN: continue
            b = s4.read(p, e); ver, ln = struct.unpack_from('<II', b, 0)
            body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
            fa = s4.decode(body, '.EA.Sims4.Network.FamilyData', s4.save_schema(), depth=10).get('family_account', {})
            if fa and fa.get('sim'): hhs[e[2]] = (p, fa)

    # templates
    sim_tpl = {i: v for i, v in I.items() if v['class'] == 'PremadeSimTemplate'}
    hh_tpl = {i: v for i, v in I.items() if v['class'] == 'PremadeHouseholdTemplate'}
    def tpl_info(i):
        t = sim_tpl.get(i)
        if not t: return {}
        ci = T.field(t['tree'], '_sim_creation_info'); key = T.value(T.field(ci, 'resource_key')) if ci else None
        dyn = T.field(t['tree'], 'dynasty'); dyn_en = T.field(dyn, 'enabled') if dyn else None
        seed = T.value(T.field(dyn_en, 'seed')) if dyn_en else None
        cl = T.field(t['tree'], 'career_level'); cl = T.leaves(cl) if cl else []
        clubs = [[tname(int(T.value(T.field(u, 'seed')))), T.value(T.field(u, 'leader')) == 'True'] for u in (T.field(t['tree'], 'clubs') or ['', {}, []])[2] if T.value(T.field(u, 'seed'))]
        mj = [int(x) for x in T.leaves(T.field(t['tree'], '_major')) if x.isdigit() and int(x) in I] if T.field(t['tree'], '_major') else []
        oc = [x for x in T.leaves(T.field(t['tree'], 'occult')) if x.isupper()] if T.field(t['tree'], 'occult') else []
        return {"siminfo": key, "template_name": t['name'],
                "dynasty": {"name": tname(int(seed)) if seed else None, "head": T.value(T.field(dyn_en, 'is_head')) == 'True',
                            "heir": T.value(T.field(dyn_en, 'is_heir')) == 'True', "outcast": T.value(T.field(dyn_en, 'is_black_sheep')) == 'True'} if dyn_en else None,
                "career_level": int(cl[0]) if cl and cl[0].isdigit() else None, "clubs": clubs,
                "degree": [tname(x) for x in mj], "occult": oc[0] if oc else None}

    out = []
    for inst, (p, fa) in hhs.items():
        tpl = fa.get('premade_household_template_id') or 0
        sims = []
        for s in fa['sim']:
            at = s.get('attributes', {}); st = (s.get('gameplay_data') or {}).get('premade_sim_template_id')
            info = tpl_info(st)
            first = s.get('first_name') or text(s.get('first_name_key'), en) or ''
            last = s.get('last_name') or text(s.get('last_name_key'), en) or ''
            traits, bonus = [], None
            ids = list((at.get('trait_tracker') or {}).get('trait_ids') or [])
            key = info.get('siminfo')
            if not ids and key:   # some keep their traits only in their own Sim file
                hit = siminfo.get(int(key.split(':')[2], 16))
                if hit: ids = traits_in(s4.read(*hit))
            occ, wins, death = None, [], None
            fame = max([FAME_LEVEL[t] for t in ids if t in FAME_LEVEL], default=None)   # Get Famous stars, a hidden trait (19 Oct)
            for t in ids:
                ty = val(t, 'trait_type'); nm = text(val(t, 'display_name'), en)
                if ty == 'PERSONALITY' and nm and nm not in traits: traits.append(nm)
                elif ty is None and nm and nm not in traits and SPECIES.get(s.get('extended_species')): traits.append(nm)   # a pet's traits have no type (19 Oct)
                elif ty == 'HORSE_ACCOLADE' and nm and nm != 'No Competitions Won' and nm not in wins: wins.append(nm)   # a horse's competition wins
                # life state from the Sim's own traits (19 Oct: spellcasters and ghosts have no occult on their template)
                if ty == 'GHOST': occ = occ or 'GHOST'; death = death or (nm or '').replace('Death by ', '')   # a ghost's death type is its ghost trait
                elif ty == 'HIDDEN' and nm in ('Spellcaster', 'Mermaid', 'Alien', 'Vampire', 'Werewolf', 'Fairy'): occ = occ or {'Spellcaster': 'WITCH'}.get(nm, nm.upper())
            asp = s.get('primary_aspiration')
            if asp in I:
                bt = val(asp, 'primary_trait'); bonus = text(val(int(bt), 'display_name'), en) if bt and int(bt) in I else None
            cs = [career(c) for c in (at.get('sim_careers') or {}).get('careers', [])]
            if not [c for c in cs if c] and info.get('career_level'): cs = [career_from_level(info['career_level'])]
            skills = [x for x in (skill(k.get('name_hash'), k.get('value', 0)) for k in (at.get('skill_tracker') or {}).get('skills', [])) if x and x[1] > 0]
            sims.append({"sim_id": s.get('sim_id'), "template": st, "name": (first + ' ' + last).strip(), "first": first, "last": last,
                         "sex": SEX.get(s.get('gender')), "age": AGES.get(s.get('age')), "species": SPECIES.get(s.get('extended_species'), s.get('extended_species')), "breed": s.get('breed_name') or text(s.get('breed_name_key'), en) or None, **({"wins": wins} if wins else {}), "aspiration": text(val(asp, 'display_text'), en) if asp in I else None,
                         "traits": traits, "bonus": bonus, "careers": [c for c in cs if c], "skills": skills,
                         "partner": s.get('significant_other') or None, "fiance": s.get('fiance') or None,
                         "rels": [[r.get('target_id'), [text(val(b, 'display_name'), en) for b in (r.get('bits') or []) if b in I and text(val(b, 'display_name'), en)]]
                                  for r in ((at.get('relationship_tracker') or {}).get('relationships') or [])],
                         "family": [[r.get('relation_type'), r.get('sim_id')] for r in ((at.get('genealogy_tracker') or {}).get('family_relations') or [])],
                         **{k: v for k, v in info.items() if k not in ('siminfo', 'career_level')}, "occult": info.get('occult') or occ, **({"death": death} if death else {}), **({"fame": fame} if fame else {})})
        # the template's own relationships (spouse, parent) between members
        rels = []
        if tpl in hh_tpl:
            tags = {}
            for u in (T.field(hh_tpl[tpl]['tree'], '_household_members') or ['', {}, []])[2]:
                tags[T.value(T.field(u, 'household_member_tag'))] = int(T.value(T.field(u, 'sim_template')) or 0)
            for u in (T.field(hh_tpl[tpl]['tree'], '_household_relationship') or ['', {}, []])[2]:
                x, y = tags.get(T.value(T.field(u, 'x'))), tags.get(T.value(T.field(u, 'y')))
                kind = 'SPOUSE' if T.value(T.field(u, 'is_spouse')) == 'True' else T.value(T.field(u, 'family_relationship'))
                bits = [text(val(int(b), 'display_name'), en) or b for b in T.leaves(T.field(u, 'relationship_bits'))] if T.field(u, 'relationship_bits') else []
                rels.append([x, kind, y, bits])
        raw = fa.get('familyname') or ''
        short = re.sub(r'^(HH_Template_|premadeHouseholdTemplate_|PremadeHouseholdTemplate_)', '', raw, flags=re.I)
        short = re.sub(r'^(EP|GP|SP|FP)\d+_', '', short)
        out.append({"instance": '%016x' % inst, "short": short, "surnames": sorted({s['last'] for s in sims if s['last']}), "pack": os.path.relpath(p, s4.GAME).split(os.sep)[0], "name": fa.get('familyname') or '',
                    "template": tpl, "template_name": hh_tpl[tpl]['name'] if tpl in hh_tpl else None, "money": fa.get('money'),
                    "description": fa.get('description') or '', "sims": sims, "relationships": rels})

    # between households: EA's starting friendships and family fix-ups
    m = levels['world.premade_sim_relationships'][2][0]
    def loot_bits(i, seen=None):
        seen = seen if seen is not None else set()
        if i in seen or i not in I: return []
        seen.add(i); out = []
        def walk(n):
            nm = n[1].get('n')
            op = T.value(T.field(n, 'operation'))
            if T.field(n, 'bit') is not None and op in (None, 'ADD'):   # bits the loot adds (not removes)
                v = T.value(T.field(n, 'bit'))
                b = int(v) if v and v.isdigit() else None; t = text(val(b, 'display_name'), en) if b in I else None
                if t and '{' not in t and 'should not be seen' not in t.lower() and t not in out: out.append(t)
                return
            elif nm in ('actions', 'loot_list', 'loot') and T.value(n) and T.value(n).isdigit():
                for t in loot_bits(int(T.value(n)), seen):
                    if t not in out: out.append(t)
            elif nm == 'sentiment' and T.value(n) and T.value(n).isdigit():
                t = text(val(int(T.value(n)), 'sentiment_name') or val(int(T.value(n)), 'display_name'), en)
                if t and t not in out: out.append(t)
            for k in n[2]: walk(k)
        walk(I[i]['tree']); return out
    def loot_tracks(i, seen=None):   # relationship values a loot sets: {track id: value}
        seen = seen if seen is not None else set()
        if i in seen or i not in I: return {}
        seen.add(i); out = {}
        def walk(n):
            nm = n[1].get('n')
            if nm in ('relationship_set', 'relationship_set_max', 'relationship_change') and T.field(n, 'track') is not None:
                tr = T.value(T.field(n, 'track')); v = T.value(T.field(n, 'value')) or T.value(T.field(n, 'amount'))
                if nm == 'relationship_set_max': v = '100'
                if tr and v: out[int(tr)] = float(v)
            elif nm in ('actions', 'loot_list', 'loot') and T.value(n) and T.value(n).isdigit():
                out.update(loot_tracks(int(T.value(n)), seen))
            for k in n[2]: walk(k)
        walk(I[i]['tree']); return out
    loot_name = lambda i: I[i]['name'] if i in I else str(i)
    between = {"relationships": [], "family": []}
    for l in m[2]:
        for u in l[2]:
            a, b = T.value(T.field(u, 'sim_a')), T.value(T.field(u, 'sim_b'))
            if l[1].get('n') == 'RELATIONSHIP_MAP':
                lt = int(T.value(T.field(u, 'relationship_loot')))
                between['relationships'].append([int(a), loot_name(lt), int(b), loot_bits(lt), {str(k): v for k, v in loot_tracks(lt).items()}])
            else:
                between['family'].append([int(a), T.leaves(T.field(u, 'flag'))[0], int(b)])
    res = {"_note": "EA's premade households as the game starts them (tools/research/premades.py). Template ids link Sims to the 'between' lists.",
           "households": sorted(out, key=lambda h: h['name'] or h['template_name'] or ''), "between": between,
           # every Sim template's name, for ancestors who appear only in the family links (no household of their own)
           "templates": {str(i): (lambda ci: ' '.join(x for x in (text(T.value(T.field(ci, 'first_name')), en),
                                                               text(T.value(T.field(T.field(ci, 'last_name'), 'specify_last_name')), en)) if x))(T.field(t['tree'], '_sim_creation_info'))
                         for i, t in sim_tpl.items()}}
    # the game's names for traits, aspirations, skills and careers, for reading Sims from her own saves (tools/own_import.py)
    names = {"traits": {str(i): [text(val(i, 'display_name'), en), val(i, 'trait_type')] for i, v in I.items() if v['class'] == 'Trait' and text(val(i, 'display_name'), en)},
             "aspirations": {str(i): [text(val(i, 'display_text'), en), text(val(int(val(i, 'primary_trait')), 'display_name'), en) if (val(i, 'primary_trait') or '').isdigit() and int(val(i, 'primary_trait')) in I else None]
                             for i, v in I.items() if v['class'] == 'AspirationTrack'},
             "skills": {str(i): [text(val(i, 'stat_name'), en), float(val(i, 'initial_value') or 0), val(i, 'skill_level_type') or 'MAJOR'] for i, v in I.items() if v['class'] in ('Skill',) and text(val(i, 'stat_name'), en)},
             "skill_levels": LEVELS,
             "tracks": {str(i): {"career": (lambda r: text(T.value(T.field(I[r]['tree'], 'career_name')), en))(next(r for r in [i] + [None] * 0) if i not in parent else (lambda t: (lambda f: f(f, t))(lambda f, t: f(f, parent[t]) if t in parent else t))(i)),
                                 "titles": [text(val(int(l), 'title'), en) if l.isdigit() and int(l) in I else None for l in T.leaves(T.field(v['tree'], 'career_levels') or ['', {}, []])]}
                        for i, v in I.items() if v['class'] == 'TunableCareerTrack'},
             "majors": {str(i): tname(i) for i, v in I.items() if v['class'] in ('UniversityMajor',)}}
    json.dump(names, open(os.path.join(ROOT, 'research', 'data', 'game-names.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    path = os.path.join(ROOT, 'research', 'data', 'premades.json')
    json.dump(res, open(path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(len(out), 'households,', sum(len(h['sims']) for h in out), 'Sims;', len(between['relationships']), 'relationships,', len(between['family']), 'family links ->', path)


if __name__ == '__main__':
    main()
