"""What OneMoreKayaker's Premade Sim and Relationship Overhaul would change about EA's premade households (31 Oct 2026,
overnight, for her premade-fix decision). Report only.

Compares each premade household file (type 0xB3C438F0, the same format as a Library household) in the mod's packages
with the installed game's current one: per Sim, age, aspiration, traits, career and skills (in the site's words, through
library_update.facts), plus household money and Sims added or left out; and says which households are on her plan.

    python tools/research/premade_overhaul_diff.py <folder with the mod's unzipped .package files>

Writes research/premade-overhaul-changes.md.
"""
import glob, json, os, re, struct, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
import library_update as LU

HOUSEHOLD = 0xB3C438F0
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
OUT = os.path.join(ROOT, 'research', 'premade-overhaul-changes.md')


def family(b):
    ver, = struct.unpack_from('<I', b, 0)
    body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + struct.unpack_from('<I', b, 4)[0]]
    return s4.decode(body, LU.N + 'FamilyData', LU.S, depth=10).get('family_account', {})


EN = None


def sims(fa):
    """{full name: facts}. EA's own premade files leave the names blank and keep string-table keys instead."""
    global EN
    out = {}
    for s in fa.get('sim', []):
        sex = 'f' if s.get('gender') in (2, 8192) else 'm'
        first, last = s.get('first_name', ''), s.get('last_name', '')
        if not first and s.get('first_name_key'):
            EN = EN or s4.english()
            first, last = EN.get(s['first_name_key'], ''), EN.get(s.get('last_name_key'), '')
        out[('%s %s' % (first, last)).strip()] = LU.facts(s, sex)
    return out


def plan_households():
    names = set()
    for f in glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json')):
        w = json.load(open(f, encoding='utf-8'))
        for hname, h in (w.get('households') or {}).items():          # {household name: {sims: [{name, ...}]}}
            names.add(LU.norm(hname))
            for s in h.get('sims', []) or []: names.add(LU.norm(s.get('name')))
    return names


def main(folder):
    order = sorted(glob.glob(os.path.join(s4.GAME, '**', '*.package'), recursive=True), key=lambda q: ('Delta' in q, 'Preload' in q, q))
    mod = {}
    for p in sorted(glob.glob(os.path.join(folder, '*.package'))):
        if 'GP04' in p: continue                        # Vampires: she doesn't own it
        for e in s4.index(p):
            if e[0] == HOUSEHOLD: mod[(e[0], e[1], e[2])] = (p, e)
    game = {}
    for gp in order:
        try: ix = s4.index(gp)
        except Exception: continue
        for e in ix:
            k = (e[0], e[1], e[2])
            if k in mod: game[k] = (gp, e)
    plan = plan_households()
    L = ['# What Premade Sim and Relationship Overhaul v2.10 (EA Remake) changes', '',
         'Made by tools/research/premade_overhaul_diff.py: each premade household in the mod against the installed game\'s (1.129). Looks and relationships aren\'t compared here (see research/mods-1129.md). EA\'s own household files leave jobs and school to the game when a save starts, so “career – → …” or “school – → …” isn\'t necessarily a change; money, skills, new Sims and new households are.', '']
    rows = []
    for k, (p, e) in mod.items():
        m = family(s4.read(p, e))
        g = family(s4.read(*game[k])) if k in game else {}
        fam = m.get('familyname') or re.sub(r'^HH_Template_', '', g.get('familyname') or '') or hex(k[2])
        sm, sg = sims(m), sims(g)
        on = LU.norm(fam) in plan or any(LU.norm(n) in plan for n in sm)
        lines = []
        if m.get('money') != g.get('money'): lines.append('- Money: %s → %s' % (g.get('money'), m.get('money')))
        for n in sorted(set(sm) | set(sg)):
            if n not in sg: lines.append('- **%s**: new Sim (%s)' % (n, ', '.join('%s %s' % (a, b) for a, b in sm[n].items() if b and a in ('age', 'traits'))))
            elif n not in sm: lines.append('- **%s**: left out' % n)
            else:
                ch = []
                for f in ('age', 'aspiration', 'traits', 'career', 'school', 'skills'):
                    a, b = sg[n].get(f), sm[n].get(f)
                    if a != b: ch.append('%s %s → %s' % (f, a or '–', b or '–'))
                if ch: lines.append('- **%s**: %s' % (n, '; '.join(ch)))
        if lines or not g: rows.append((not on, fam, ('(on her plan) ' if on else '') + ('' if g else '(not in the game: new household) '), lines))
    for _, fam, note, lines in sorted(rows):
        L += ['## %s %s' % (fam, note.strip()), ''] + (lines or ['- No change to these fields.']) + ['']
    open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    print('wrote', OUT, len(rows), 'households')


if __name__ == '__main__':
    main(sys.argv[1])
