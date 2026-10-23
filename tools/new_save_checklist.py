"""Her new-save checklist (for-jemma/new-save-checklist.md), made from the site's current data (23 Oct, the day she
started the new save "Jemma's Sim World"), so it never drifts from the plan.
    python tools/new_save_checklist.py     write for-jemma/new-save-checklist.md (run after tools/build.py)

Reads site/js/data.js (the built plan), and research/data/new-save-trait-ideas.json (trait ideas for free slots, from
research/lot-trait-ideas.md). The fixed steps (backup, options, holidays, test, end) are below; edit them here.
Her ticks: an existing checklist's ticked lines ("- [x]") stay ticked when it is made again.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, slug

OUT = os.path.join(ROOT, 'for-jemma', 'new-save-checklist.md')
IDEAS = os.path.join(ROOT, 'research', 'data', 'new-save-trait-ideas.json')

HEAD = """# New save checklist

Made from the site’s data by tools/new_save_checklist.py (Claude reruns it after changes; your ticks are kept). Tick as you go. Why each step is there: `research/new-save-plan.md`. Build notes for single lots are on `your-list.md`.

**Key:** EA = the game’s premade household (already in the save: move it, don’t bring it from the Library). Maxis Gallery = EA’s Gallery copy in your Library (not in the save). Yours = from your Library. Sims to come = no Sims picked yet.

## 1. Before you start
- [ ] Copy the `Saves` and `Tray` folders (Documents\\Electronic Arts\\The Sims 4) somewhere safe.
- [ ] New Game: make one throwaway Sim and move it onto a lot you’ll do last.
- [ ] Save As “Sim World 00”.

## 2. Options (once; your calls, 23 Oct)
- [ ] Neighbourhood Stories on. Other Households: Move In, Move Out, Have a Baby, Adopt a Child, Adopt Cats & Dogs, Rescue Horses, Join a Career, Leave a Career and Romance Changes unticked; Retire from Career, Die in Accidents and Friendship Changes ticked. My Households: all off.
- [ ] Allow Automatic Breakups off.
- [ ] Maximum Sim Count: Unlimited, or the highest your PC copes with.
- [ ] Auto Age (Unplayed Households) off.
- [ ] Eco Lifestyle: Enable NPC Voting off.
- [ ] Seasons: Season Length 28 days.
- [ ] Royalty & Legacy: Dynasty Prestige Decay off.
- [ ] Autosave and Save Reminder on (Save Settings).
- [ ] Save As “Sim World 01 options”.

{HOLIDAYS}
## 4. Test first
- [ ] Place one rental (Fern Park Flats) and one venue with traits (Willow’s). Note what came with them: type, traits, challenges, unit names, unit traits.
- [ ] Move in one of your households from the Library. Check skills, careers and relationships.
- [ ] Tell Claude what was lost, so this list can be trimmed. Load the save before the test if you want to undo it.

## 5. In every world
- [ ] Heart every planned household (“Move into My Households”).
- [ ] Split or merge households first (Newcrest BFF, Del Sol Roomies and Eclectic Arts, Calientes/Don Lothario, Greenburgs/Knox, Linhs, Enzo Alto, the Curious brothers).
- [ ] Move or evict households off lots you’re replacing.
- [ ] For each lot: set the lot type first, save, place the upload (furnished), then check its type, traits, challenge and units.
- [ ] Rentals: set Residential Rental before placing, then retype unit names and traits if they’re gone.
- [ ] Move households in (tenants into their units), then small businesses.
- [ ] Save As “Sim World 02 Willow Creek” (and so on).

## 6. World by world
"""

TAIL = """
## 7. At the end
{CLUBS}
- [ ] Clubs: add Sergio Romeo to Powerhouse (he stays in the Paragons too).
- [ ] Dynasties: check Goth, Landgraab, Darong, Thebe, Abrantes, Alto and Capp against the site.
- [ ] Check every neighbourhood’s voting board and repeal plans you don’t want.
- [ ] With all your lots in, check each neighbourhood’s eco footprint (Map view, hover the neighbourhood) and tell Claude any that differ from the site’s “Eco footprint starts …” (your builds can change it).
- [ ] Move out the throwaway household.
- [ ] Check the Neighbourhood Stories rules are still set.
- [ ] Save As “Sim World” and tell Claude, who will read holidays, traits, units and households from it.
"""

q = lambda s: f"“{s}”"
join = lambda xs: ", ".join(xs[:-1]) + " and " + xs[-1] if len(xs) > 1 else (xs[0] if xs else "")


def unit_name(l, pos):
    """The plan's unit numbers are positions (1st, 2nd…); show the unit's own name (Taka Soi 15's 2nd unit is 09)."""
    names = [u['name'] for u in (l.get('units') or [])]
    return names[int(pos) - 1] if str(pos).isdigit() and 0 < int(pos) <= len(names) else str(pos)


def load_data():
    t = open(os.path.join(ROOT, 'site', 'js', 'data.js'), encoding='utf-8').read()
    return json.loads(t[t.index('{'):t.rindex('}') + 1])


def ideas_from_old():
    """First run only: keep the trait ideas the earlier (hand-made) checklist had, keyed "World|lot name"."""
    if os.path.exists(IDEAS): return json.load(open(IDEAS, encoding='utf-8'))
    out, world = {}, None
    if os.path.exists(OUT):
        for line in open(OUT, encoding='utf-8'):
            m = re.match(r'### (.+?)( \(not owned yet\))?$', line.strip())
            if m: world = m.group(1); continue
            m = re.match(r'- \[[ x]\] \*\*(.+?)\*\*.*Trait ideas \(free slots\): (.+?)\.?$', line.strip())
            if m and world: out[f"{world}|{m.group(1)}"] = m.group(2).rstrip('.')
    json.dump(out, open(IDEAS, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    return out


def who_label(hh):
    """EA / Maxis Gallery / yours / Sims to come, from the household's Sims on the site."""
    sims = (hh or {}).get('sims') or []
    if not sims: return "Sims to come"
    kinds = set()
    for s in sims:
        if (s.get('origin') or '').lower() == 'mine': kinds.add('yours')
        elif 'Library' in (s.get('from') or ''): kinds.add('Maxis Gallery')
        else: kinds.add('EA')
    if len(kinds) == 1: return kinds.pop()
    return "; ".join(f"{k}: {join([s['name'].split()[0] for s in sims if ('yours' if (s.get('origin') or '').lower() == 'mine' else 'Maxis Gallery' if 'Library' in (s.get('from') or '') else 'EA') == k])}" for k in sorted(kinds))


def main():
    D = load_data(); ideas = ideas_from_old()
    ticked = set()
    if os.path.exists(OUT):
        ticked = {l.strip()[6:] for l in open(OUT, encoding='utf-8') if l.startswith('- [x] ')}
    days = dict(Mon="Monday", Tue="Tuesday", Wed="Wednesday", Thu="Thursday", Fri="Friday", Sat="Saturday", Sun="Sunday")
    hol = ["## 3. Holidays (Calendar, live mode; from the site's Calendar, data/calendar.json)"]
    for x in json.load(open(os.path.join(ROOT, 'data', 'calendar.json'), encoding='utf-8'))['holidays']:
        when = f"{x['season'].lower()}, week {x['week']}, {days.get(x['day'], x['day'])}" + (", day off" if x.get('off') else "")
        if x.get('replaces') and x['replaces'] != x['name']: hol.append(f"- [ ] {x['replaces']} → {x['name']}: {when}.")
        elif x.get('replaces'): hol.append(f"- [ ] {x['name']}: move to {when}.")
        else: hol.append(f"- [ ] {x['name']}: {when}.")
    hol.append("- [ ] Keep New Year’s Eve. Save As.")
    out = [HEAD.replace("{HOLIDAYS}", "\n".join(hol) + "\n")]
    for w in D['worlds']:
        if not w.get('ready'): continue
        wn = w['name']; lots = [l for h in w['hoods'] for l in h['lots']]
        if not w['owned']:
            out.append(f"### {wn} (not owned yet)\n\n- [ ] Skip for now: {len(lots)} lots in the plan. Do it when you buy {w['pack']}.\n")
            continue
        hhs = D['households'].get(wn, {})
        on = sum(1 for l in lots if l.get('gallery')); bns = sum(1 for l in lots if l['built'] is True and not l.get('gallery')); nb = sum(1 for l in lots if l['built'] is not True)
        out.append(f"### {wn}\n\n{len(lots)} lots: {on} on the Gallery, {bns} built but not shared, {nb} not built.\n")
        base = lambda n: re.sub(r'\s+own\??$', '', re.sub(r'\?$', '', n).strip(), flags=re.I).strip()
        own_ = lambda l: re.search(r'\sown\??$', l.get('who') or '', re.I)
        # "Greenburg own" on a rental is the landlord's home when the family has no other home in the world (as the site reads it)
        homes_ = {re.sub(r'\?$', '', x['who']).strip() for x in lots if x.get('who') and x['sims'] != 'N/A' and not own_(x)}
        is_home = lambda l: l['sims'] != 'N/A' and (not own_(l) or ('Rental' in (l.get('type') or '') and re.sub(r'\s+own\??$', '', l['who'], flags=re.I).strip() not in homes_))
        total, seen = {}, {}
        for l in lots:
            if l.get('who') and is_home(l): total[base(l['who'])] = total.get(base(l['who']), 0) + 1
        for h in w['hoods']:
            out.append(f"**{h['name']}**\n")
            for l in h['lots']:
                key = f"{wn}|{l['lot']}"
                name = D['nameFix'].get(key) or (l.get('gallery') or {}).get('title') or (l['mine'] if l.get('mine') and l['mine'].strip('? ') else None) or l['lot']
                g = l.get('gallery')
                head = f"**{name}**" + (f" (game’s {l['lot']})" if l['lot'] != name else "") + (f", {l['size']}" if l.get('size') and l['size'] != 'N/A' else "") + ": "
                bits = []
                if l.get('rebuild'): bits.append(f"Rebuild first ({l['rebuild']}), then place the new upload.")
                elif key in D['csVersions']:
                    vs = D['csVersions'][key]
                    bits.append(f"place your {vs[0]['label']} version {q(vs[0]['title'])}.")
                elif g and g.get('title'):
                    bits.append(f"place {q(g['title'])}.")
                    if g.get('others'): bits.append("Not the other cop" + ("ies" if len(g['others']) > 1 else "y") + ": " + ", ".join(f"{q(o['title'])} ({o['label']})" for o in g['others']) + ".")
                elif l['built'] is True: bits.append("built but not on the Gallery: bring it over through your Library.")
                else: bits.append("not built yet: leave the game’s lot for now.")
                if l.get('type'): bits.append(f"Type: {l['type']}.")
                if 'University Housing' in (l.get('type') or ''):   # the game asks which university the housing is for
                    uni = {'University of Britechester': 'University of Britechester', 'Foxbury Institute': 'Foxbury Institute'}.get(h['name'])
                    bits.append(f"University: {uni}." if uni else "University: pick in game.")
                who = l.get('who')
                if who and who not in ('N/A',):
                    b = base(who)
                    if not is_home(l):   # a business or rental owned by a household living elsewhere
                        own = re.sub(r'\s+own\??$', '', b, flags=re.I)
                        if 'Small Business' in (l.get('type') or ''): bits.append("Register the business and set its lot after placing.")
                        role = "Landlord" if (key in D['tenants'] or l.get('units')) else "Owner"
                        bits.append(f"{role} (lives elsewhere): {own} ({who_label(hhs.get(own))}).")
                    elif re.fullmatch(r'empty', b, re.I): bits.append("Empty.")
                    else:
                        seen[b] = seen.get(b, 0) + 1
                        hn = f"{b} {seen[b]}" if total.get(b, 0) > 1 else b
                        lab = who_label(hhs.get(hn))
                        if key in D['tenants'] or l.get('units'):
                            unit = unit_name(l, D['residentsUnit'].get(key) or 1)
                            bits.append(f"{b} ({lab}, {'tenant' if key in D['noLandlord'] else 'landlord'}, unit {unit}).")
                        else: bits.append(f"Household: {b} ({lab}).")
                elif l['sims'] != 'N/A' and 'Residential' in (l.get('type') or '') and not (l.get('who') or l.get('whoNote')): bits.append("Empty.")
                if key in D['tenants']:
                    bits.append("Tenants: " + ", ".join(t['name'] + (f" unit {unit_name(l, t['unit'])}" if t.get('unit') else '') for t in D['tenants'][key]) + ".")
                if l.get('traits'): bits.append(f"Traits: {', '.join(l['traits'])}.")
                if l.get('challenges'): bits.append(f"Challenge{'s' if len(l['challenges']) > 1 else ''}: {', '.join(l['challenges'])}.")
                if l.get('units'):
                    bits.append("Units: " + "; ".join(u['name'] + (f" ({', '.join(u['traits'])})" if u.get('traits') else "") for u in l['units']) + ".")
                idea = ideas.get(f"{wn}|{name}")
                if idea: bits.append(f"Trait ideas (free slots): {idea}.")
                line = (head + " ".join(bits)).replace("'", "’")   # curly apostrophes, as on the site
                out.append(f"- [{'x' if line in ticked else ' '}] {line}")
            out.append("")
    names = {}
    for w in D['worlds']:
        for h in w['hoods']:
            for l in h['lots']:
                nm = D['nameFix'].get(f"{w['name']}|{l['lot']}") or (l.get('gallery') or {}).get('title') or (l['mine'] if l.get('mine') and l['mine'].strip('? ') else None) or l['lot']
                names[f"l-{slug(w['name'])}--{slug(l['lot'])}"] = nm + ("" if l['built'] is True else " (when built)")
    clubs = json.load(open(os.path.join(ROOT, 'data', 'groups.json'), encoding='utf-8')).get('clubs', {})
    hang = [f"{c} → {names.get(v['place'], v['place'])}" if v.get('place') else f"{c} → any {v['anyType']}" for c, v in clubs.items() if v.get('place') or v.get('anyType')]
    out.append(TAIL.replace("{CLUBS}", "- [ ] Club hangouts (set in the Club panel; from the site's clubs): " + "; ".join(hang) + "."))
    open(OUT, 'w', encoding='utf-8', newline='\n').write("\n".join(out))
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {sum(1 for x in out if x.startswith('- ['))} lines to tick")


if __name__ == '__main__':
    main()
