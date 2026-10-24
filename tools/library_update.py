"""Bring her uploaded households' Sims up to date from her Library (24 Oct, her ask: the Sims she re-saved for the Gallery
showed old jobs and schools from the save they were first read from).

    python tools/library_update.py           report what would change (changes nothing)
    python tools/library_update.py --apply   write the changes into data/worlds/<world>.json, then rebuild

For every household with a Gallery upload (`gallery` on the household), the newest Library copy with the same family name
gives each Sim's game facts: life stage, aspiration, bonus trait, traits, career, school and skills. Sims are matched by
full name; ids, parents, partners, origin and anything added by hand stay as they are. Library files are read from
temporary copies.
"""
import glob, json, os, re, shutil, struct, subprocess, sys, tempfile, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
from common import ROOT, load, save

S = s4.save_schema(); N = '.EA.Sims4.Network.'
TRAY = os.path.join(os.path.dirname(s4.SAVES), 'Tray')
AGES = {1: "Baby", 2: "Toddler", 4: "Child", 8: "Teen", 16: "Young Adult", 32: "Adult", 64: "Elder", 128: "Infant"}
FIELDS = ("age", "aspiration", "bonus", "traits", "career", "careerNote", "school", "skills")
G = load(os.path.join(ROOT, 'research', 'data', 'game-names.json'))
norm = lambda x: re.sub(r'[^a-z]', '', (x or '').lower())


def gendered(text, sex):
    """The game's text keeps both words for some names ("Master {F0.Actress}{M0.Actor}"): keep the Sim's."""
    return re.sub(r'\{F0\.([^}]*)\}\{M0\.([^}]*)\}', lambda m: m.group(1) if sex == 'f' else m.group(2), text or '')


def skill(h, v):
    k = G['skills'].get(str(h))
    if not k: return None
    name, start, kind = k
    if v <= start and kind != 'CHILD': return None
    lv = 0; tot = 0.0
    for st in G['skill_levels'].get(kind, G['skill_levels']['MAJOR']):
        tot += st
        if v >= tot: lv += 1
    return [name, lv, len(G['skill_levels'].get(kind, G['skill_levels']['MAJOR']))]


def career(c):
    t = G['tracks'].get(str(c.get('track_uid')))
    if not t: return None
    i = c.get('track_level', 0); title = t['titles'][i] if i < len(t['titles']) else None
    return t['career'], title, c.get('user_display_level') or i + 1


def facts(s, sex):
    """A Library Sim's game facts, in the site's words (as tools/own_import.py writes them)."""
    at = s.get('attributes') or {}
    d = {"age": AGES.get(s.get('age'))}
    young = d["age"] in ("Baby", "Infant", "Toddler") or s.get('extended_species') not in (None, 0, 1)
    a = G['aspirations'].get(str(s.get('primary_aspiration')))
    d["aspiration"] = gendered(a[0], sex) if a and not young else None
    d["bonus"] = a[1] if a and a[1] and not young else None
    tr = [G['traits'][str(t)][0] for t in ((at.get('trait_tracker') or {}).get('trait_ids') or []) if str(t) in G['traits'] and G['traits'][str(t)][1] == 'PERSONALITY']
    d["traits"] = list(dict.fromkeys(tr)) or None
    raw = [c for c in (at.get('sim_careers') or {}).get('careers', []) if career(c)]
    cs = [career(c) for c in raw]
    # a Sim aged into school in CAS hasn't had a school day yet: the copy says grade F until the game sets their real
    # starting grade, so no grade is shown for them (24 Oct: David, Daniel and Melanie)
    fresh = {career(c) for c in raw if not c.get('track_level') and not c.get('has_attended_first_day')}
    sch = next((x for x in cs if 'Student' in (x[1] or '') or 'School' in (x[0] or '')), None)
    job = next((x for x in cs if x is not sch), None)
    m = re.match(r'(High|Grade) School (\w) Student', (sch or ('', ''))[1] or '')
    d["career"] = f"{job[0]} · {job[1]} (level {job[2]})" if job and job[1] else (job[0] if job else "")
    sc = at.get('sim_careers') or {}   # a job she wrote in herself (24 Oct: Josie De Costa, Restauranteur)
    if not d["career"] and sc.get('custom_career_name'): d["career"] = sc['custom_career_name']
    d["careerNote"] = sc.get('custom_career_description') if sc.get('custom_career_name') and not job else None
    d["school"] = (f"{m.group(1)} school" if sch in fresh else f"{m.group(1)} school · grade {m.group(2)}") if m else (f"{sch[0]}" if sch else None)
    sk = [x for x in (skill(k.get('name_hash'), k.get('value', 0)) for k in (at.get('skill_tracker') or {}).get('skills', [])) if x and x[1] > 0]
    d["skills"] = sk or None
    return d


def library():
    """{family name (loosely): (date, [Sims])}, the newest copy of each."""
    out, tmp = {}, tempfile.mkdtemp()
    try:
        for f in glob.glob(os.path.join(TRAY, '*.householdbinary')):
            c = os.path.join(tmp, 'h'); shutil.copy(f, c)
            b = open(c, 'rb').read(); ver, ln = struct.unpack_from('<II', b, 0)
            body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
            try: fa = s4.decode(body, N + 'FamilyData', S, depth=10).get('family_account', {})
            except Exception: continue
            k, t = norm(fa.get('familyname')), os.path.getmtime(f)
            if k and (k not in out or t > out[k][0]): out[k] = (t, fa.get('sim', []))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return out


def main(apply):
    lib = library(); changed = 0
    for p in sorted(glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))):
        raw = open(p, 'rb').read().decode('utf-8'); W = json.loads(raw); touched = False
        for hn, h in (W.get('households') or {}).items():
            if not h.get('gallery'): continue
            copy = lib.get(norm(re.sub(r'\s+\d+$', '', hn)))
            if not copy: print(f"{W['name']} / {hn}: no Library copy"); continue
            by = {f"{s.get('first_name', '')} {s.get('last_name', '')}".strip(): s for s in copy[1]}
            for sm in h.get('sims', []):
                s = by.get(sm['name'])
                if not s: print(f"{W['name']} / {hn}: {sm['name']} isn't in the Library copy"); continue
                new = facts(s, sm.get('sex'))
                for f in FIELDS:
                    if sm.get('state') and f in ('aspiration', 'bonus', 'career', 'careerNote', 'school'): continue   # animals
                    old = sm.get(f)
                    if (new[f] or None) == (old or None): continue
                    print(f"{W['name']} / {hn} / {sm['name']}: {f}: {old!r} -> {new[f]!r}"); changed += 1
                    if new[f] in (None, ''): sm.pop(f, None) if f != 'career' else sm.__setitem__('career', '')
                    else: sm[f] = new[f]
                    touched = True
            for n in by:
                if n not in {sm['name'] for sm in h.get('sims', [])}: print(f"{W['name']} / {hn}: {n} is in the Library copy but not on the site")
        if apply and touched: save(p, W)
    print(f"{changed} changes" + ("" if apply else " (report only; --apply to write them)"))
    if apply and changed: subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
