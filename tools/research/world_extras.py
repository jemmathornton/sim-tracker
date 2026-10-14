"""World extras from the game's own tuning: weather per season, festivals and events (and where they happen),
each neighbourhood's starting eco footprint, and each world's "tourist highlights" (landmarks).

    python tools/research/world_extras.py            read the game (a few minutes), write research/data/world-extras.json
    python tools/research/world_extras.py --apply    copy what the site shows into data/worlds, then rebuild

Needs research/data/plan-vs-game.json (for which plan neighbourhood each game area is).
On the site (chosen 14 Oct): a weather line and the three highlights on each world page; festivals and a starting
eco footprint other than Neutral on neighbourhood cards. --apply writes world `weather`, `highlights` and neighbourhood
`festivals`, `ecoStart`; it only replaces those fields.
"""
import json, os, re, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
import tuning
from common import ROOT, load

REGION_WORLD = {"WillowCreek": "Willow Creek", "OasisSprings": "Oasis Springs", "Newcrest": "Newcrest", "CampingForest": "Granite Falls",
                "Career_Retail": "Magnolia Promenade", "NorthEurope": "Windenburg", "CityLife": "San Myshuno", "VampireWorld": "Forgotten Hollow",
                "Jungle": "Selvadorada", "PetWorld": "Brindleton Bay", "FameWorld": "Del Sol Valley", "Strangetown": "StrangerVille",
                "IslandWorld": "Sulani", "Magic": "Glimmerbrook", "UniversityWorld": "Britechester", "EcoWorld": "Evergreen Harbor",
                "MountainWorld": "Mt. Komorebi", "CottageWorld": "Henford-on-Bagley", "WeddingWorld": "Tartosa", "WolfTown": "Moonwood Mill",
                "HighSchoolWorld": "Copperdale", "BayArea": "San Sequoia", "EP14World": "Chestnut Ridge", "MultiUnitWorld": "Tomarang",
                "EP16World": "Ciudad Enamorada", "EP17World": "Ravenwood", "EP18World": "Nordhaven", "EP19World": "Innisgreen",
                "EP20World": "Gibbi Point", "EP21World": "Ondarion", "Batuu": "Batuu"}
EVENT_CLASSES = {'FestivalDramaNode', 'FestivalContestDramaNode', 'VenueEventDramaNode', 'FishingContestDramaNode', 'CalendarEventDramaNode',
                 'MajorOrganizationEventDramaNode', 'OrganizationEventDramaNode'}


def world_of_region(name):
    for k, w in REGION_WORLD.items():
        if name and name.endswith(k): return w
    return None


def event_name(tree, T):
    """The name the game shows for an event: its festival sign, its display name or its notification title."""
    sign = tuning.field(tree, 'festival_dynamic_sign_info')
    if sign is not None and sign[1].get('t') == 'enabled':
        n = T(tuning.value(tuning.field(tuning.field(sign, 'enabled'), 'festival_name')))
        if n: return n
    for f in ('_display_data', 'ui_display_data'):
        d = tuning.field(tree, f)
        if d is None: continue
        for path in (('optional_display_mixin', 'instance_display_name', 'enabled_display_name'), ('enabled', 'name'), ('enabled', 'instance_display_name')):
            node = d
            for step in path:
                node = node and tuning.field(node, step)
            n = T(tuning.value(node)) if node is not None else ''
            if n: return n
    return ''


def pretty(name):
    """A readable name made from a tuning name, for events the game never names on screen."""
    n = re.sub(r'^.*(DramaNode|Events)_', '', name)
    n = re.sub(r'_(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Morning)$', '', n)
    if n == 'EP17_AA': return 'Afterlife Anonymous'   # the name its game text uses
    n = re.sub(r'(?<=[a-z])(?=[A-Z])|_', ' ', n)
    return re.sub(r'\bEP\d+\s*', '', n).strip()


def main():
    text = s4.english()
    T = lambda key: re.sub(r'<[^>]+>', '', text.get(int(key, 16) if isinstance(key, str) and key.startswith('0x') else int(key or 0), '')).strip() if key else ''
    inst, pairs, highlights = {}, {}, {}
    wanted = {'Region', 'Street', 'WeatherSeasonalForecasts', 'WeatherForcastList', 'WeatherForecast'} | EVENT_CLASSES
    for p, root in tuning.trees():
        merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]} if root[2] and root[2][0][1].get('s') == 'merged' else {}
        def walk(n, parent=None):
            if n[0] == 'I' and n[1].get('c') in wanted:
                inst[int(n[1]['s'])] = {"class": n[1]['c'], "name": n[1].get('n'), "tree": tuning.resolve(n, merged)}
            if n[1].get('n') == 'WORLD_DESCRIPTION_TUNING_MAP':
                for u in tuning.resolve(n, merged)[2]:
                    wd, st = tuning.value(tuning.field(u, 'WorldDescription')), tuning.value(tuning.field(u, 'Street'))
                    if wd and st: pairs[int(wd)] = int(st)
            if n[1].get('n') == 'tourist_highlights' and parent is not None:
                rp = tuning.resolve(parent, merged)
                region = tuning.value(tuning.field(rp, 'region_resource')) or tuning.value(tuning.field(rp, 'region_name'))
                items = [(T(tuning.value(tuning.field(u, 'heading'))), T(tuning.value(tuning.field(u, 'description_text')))) for u in tuning.resolve(n, merged)[2]]
                highlights[(tuning.value(tuning.field(rp, 'region_name')) or '', region)] = items
            for k in n[2]: walk(k, n)
        walk(root)
    # area name of each world description, and so each street's area
    area_of_wd = {}
    for p in [os.path.join(s4.GAME, 'Data', 'Client', 'ClientDeltaBuild0.package')] + sorted(set(__import__('glob').glob(os.path.join(s4.GAME, '**', 'Client*Build*.package'), recursive=True))):
        for e in s4.index(p):
            if e[0] == 0xA680EA4B and e[2] in pairs and e[2] not in area_of_wd:
                d = s4.read(p, e); ln = int.from_bytes(d[24:28], 'little'); area_of_wd[e[2]] = d[28:28 + ln].decode('latin1')
    area_of_street = {st: area_of_wd.get(wd) for wd, st in pairs.items()}
    # which plan neighbourhood each game area is (most of its lots)
    pvg = load(os.path.join(ROOT, 'research', 'data', 'plan-vs-game.json'))['worlds']
    hood_of_area = {}
    for wn, w in pvg.items():
        c = collections.defaultdict(collections.Counter)
        for r in w['lots']:
            if r['game']: c[r['game']['area']][r['neighbourhood']] += 1
        for g in w['gameLotsNotInPlan']: c[g['area']]
        for a, cnt in c.items(): hood_of_area[a] = (wn, cnt.most_common(1)[0][0] if cnt else None)
    # streets: starting eco footprint
    streets = {}
    for i, v in inst.items():
        if v['class'] != 'Street': continue
        area = area_of_street.get(i)
        o = tuning.field(v['tree'], 'initial_street_eco_footprint_override')
        val = tuning.value(tuning.field(o, 'enabled')) if o is not None and o[1].get('t') == 'enabled' else None
        wn, hood = hood_of_area.get(area, (None, None))
        streets[i] = {"tuning": v['name'], "area": area, "world": wn, "neighbourhood": hood, "ecoStart": float(val) if val is not None else None}
    # events with a street
    events = []
    for i, v in inst.items():
        if v['class'] not in EVENT_CLASSES: continue
        st = tuning.value(tuning.field(v['tree'], 'street'))
        s = streets.get(int(st)) if st else None
        name, named_by_game = event_name(v['tree'], T), True
        if not name: name, named_by_game = pretty(v['name']), False
        events.append({"tuning": v['name'], "class": v['class'], "name": name, "nameFromGame": named_by_game,
                       "place": T(tuning.value(tuning.field(v['tree'], 'location_name'))) or None,
                       "street": s and s['tuning'], "world": s and s['world'], "neighbourhood": s and s['neighbourhood']})
    # weather per world and season
    def forecasts_of(list_id):
        fl = inst.get(int(list_id)); out = []
        if not fl: return out
        for u in fl['tree'][2][0][2] if fl['tree'][2] else []:
            fid = tuning.value(tuning.field(u, 'forecast')) or tuning.value(tuning.field(u, 'key'))
            w = tuning.value(tuning.field(u, 'weight')) or tuning.value(tuning.field(u, 'value'))
            f = inst.get(int(fid)) if fid and fid.isdigit() else None
            if f: out.append((T(tuning.value(tuning.field(f['tree'], 'forecast_name'))) or f['name'], float(w) if w else 1.0))
        return out
    weather = {}
    for i, v in inst.items():
        if v['class'] != 'Region': continue
        wn = world_of_region(v['name'])
        if not wn: continue
        seasons = {}
        for u in (tuning.field(v['tree'], 'weather') or ['', {}, []])[2]:
            season = tuning.value(tuning.field(u, 'key')); sid = tuning.value(tuning.field(u, 'value'))
            sf = inst.get(int(sid)) if sid else None
            if not sf: continue
            totals = collections.Counter()
            for part in sf['tree'][2][0][2] if sf['tree'][2] else []:
                for name, w in forecasts_of(tuning.value(tuning.field(part, 'value')) or 0):
                    totals[name] += w
            seasons[season] = totals
        weather[wn] = {s: [n for n, _ in c.most_common()] for s, c in seasons.items()}
    region_names = {i: v['name'] for i, v in inst.items() if v['class'] == 'Region'}
    hl = []
    for (n, r), items in highlights.items():
        rid = int(r) if r and str(r).isdigit() else None
        hl.append({"world": world_of_region(region_names.get(rid)) or (T(n) if T(n) in REGION_WORLD.values() else None), "regionName": T(n), "items": [{"heading": a, "text": b} for a, b in items]})
    out = {"weather": weather, "streets": streets, "events": events, "highlights": hl}
    with open(os.path.join(ROOT, 'research', 'data', 'world-extras.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=1, default=str)
    return out


# parks the plan names differently from the game's lot, so their street isn't matched through the lots
AREA_HOOD = {"GD_GardenPark_01": ("Willow Creek", "Magnolia Blossom Park"), "SO_DesertPark_01": ("Oasis Springs", "Desert Bloom Park")}


def weather_line(seasons):
    """A short line about a world's weather, from the likeliest kinds per season."""
    if not seasons: return None
    top = {k: v[:3] for k, v in seasons.items()}; every = {x for v in seasons.values() for x in v}
    if len(every) == 1: return next(iter(every)).capitalize() + " all year"
    parts = []
    first = [v[0] for v in seasons.values() if v]
    sunny = first.count('Sunny')
    if sunny >= 3: parts.append("sunny most of the year")
    elif sunny <= 1 and sum(1 for x in first if x in ('Cloudy', 'Partly Cloudy')) >= 2: parts.append("often cloudy")
    w = seasons.get('WINTER', [])
    if 'Snow' in top.get('WINTER', []): parts.append("snowy winters")
    elif 'Chance of Snow' in top.get('WINTER', []): parts.append("a chance of snow in winter")
    elif not any('Snow' in x for x in every): parts.append("no snow")
    elif not any('Snow' in x for x in w): parts.append("no snow in winter")
    summer = top.get('SUMMER', [])
    hot, storms = 'Heat Wave!' in summer, 'Thunderstorms' in summer
    if hot and storms: parts.append("heat waves and thunderstorms in summer")
    elif hot: parts.append("heat waves in summer")
    elif storms: parts.append("thunderstorms in summer")
    monsoon = [n for n, k in (("summer", 'SUMMER'), ("autumn", 'FALL')) if 'Monsoons' in seasons.get(k, [])]
    if monsoon: parts.append("monsoons in " + " and ".join(monsoon))
    if sum(1 for v in seasons.values() if v and v[0] in ('Rain', 'Chance of Rain')) >= 2: parts.append("plenty of rain")
    if 'Mysterious Weather' in top.get('FALL', []): parts.append("mysterious weather in autumn")
    if 'Thundersnowstorm' in every: parts.append("the odd thundersnowstorm")
    if not parts: return None
    line = ", ".join(parts)
    return line[0].upper() + line[1:]


def festivals(names):
    """Event names for a card: one entry for a group of hobby meetups, no "X - variant" duplicates, game casing."""
    out = []
    for n in names:
        if n.startswith('Hobby Meetup'): n = 'Hobby meetups'
        n = re.sub(r'\bAnd\b', 'and', n)
        if n in out or any(n.startswith(o + ' - ') for o in names): continue
        out.append(n)
    return sorted(out)


def apply():
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    from common import save, world_files
    o = load(os.path.join(ROOT, 'research', 'data', 'world-extras.json'))
    fest = collections.defaultdict(list); eco = {}
    for e in o['events']:
        if e['world'] and e['neighbourhood']: fest[(e['world'], e['neighbourhood'])].append(e['name'])
    for st in o['streets'].values():
        wn, hood = AREA_HOOD.get(st['area'], (st['world'], st['neighbourhood']))
        if wn and hood and st['ecoStart']: eco[(wn, hood)] = "Green" if st['ecoStart'] < 0 else "Industrial"
    hl = {h['world']: h['items'] for h in o['highlights'] if h['world']}
    n = collections.Counter()
    for f in world_files():
        W = load(f); wn = W['name']
        line = weather_line(o['weather'].get(wn))
        if line: W['weather'] = line; n['weather'] += 1
        else: W.pop('weather', None)
        if hl.get(wn): W['highlights'] = [{"name": i['heading'], "text": i['text']} for i in hl[wn]]; n['highlights'] += 1
        for h in W['neighbourhoods']:
            h.pop('festivals', None); h.pop('ecoStart', None)
            if fest.get((wn, h['name'])): h['festivals'] = festivals(fest[(wn, h['name'])]); n['festivals'] += 1
            if eco.get((wn, h['name'])): h['ecoStart'] = eco[(wn, h['name'])]; n['eco'] += 1
        save(f, W)
    print(dict(n))
    import subprocess
    r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
    print((r.stdout or r.stderr).strip())


if __name__ == '__main__' and '--apply' in sys.argv:
    apply()
elif __name__ == '__main__':
    o = main()
    print(len(o['weather']), 'worlds with weather,', len(o['streets']), 'streets,', len(o['events']), 'events,', len(o['highlights']), 'highlight sets')
