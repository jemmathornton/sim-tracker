"""Data check-up: everything that disagrees between her plan, her Gallery uploads, the game's own files and her newest
Building save (shared lots only, lots only), plus things in the plan that are missing or out of step.

    python tools/research/data_check.py

Report only. Needs research/data/plan-vs-game.json (plan_vs_game.py). Writes research/data/data-check.json.
"""
import glob, json, os, re, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, SITE, load, norm, slug, world_files

US = {r'\bneighborhoods?\b': 'neighbourhood', r'\bfavorites?\b': 'favourite', r'\bcenters?\b': 'centre',
      r'\btheaters?\b': 'theatre', r'\bhonors?\b': 'honour', r'\bhumor\b': 'humour', r'\bcozy\b': 'cosy', r'\bgray\b': 'grey',
      r'\borganiz\w+': 'organis…', r'\brealiz\w+': 'realis…', r'\btraveling\b': 'travelling', r'\bjewelry\b': 'jewellery',
      r'\bmold\b': 'mould', r'\bpajamas\b': 'pyjamas', r'\bcatalog\b': 'catalogue', r'\bdefense\b': 'defence', r'\bcolor(s|ful)?\b': 'colour'}
PROPER = r'Lykke Center|Information Center|Civic Center|Center Park|Recreation Center|Rec Center|Equestrian Center|Humor and Hijinks Festival'   # the game's own names


def in_proper(text, m):
    """True when a match sits inside one of the game's own names (21 Nov: a short window around it missed longer names)."""
    return any(p.start() <= m.start() and m.end() <= p.end() for p in re.finditer(PROPER, text))
SAME_TYPE = {'small business': 'small business venue', 'rec center': 'recreation center', 'boba & thrift': 'thrift and bubble tea store',
             'thrift and boba store': 'thrift and bubble tea store',   # her British name for the game's type (CLAUDE.md)
             'uob commons': 'ubrite commons', 'apartment': 'residential', 'small business residential': 'residential'}


def dims(s):
    m = re.match(r'^\s*(\d+)\s*x\s*(\d+)\s*$', s or '')
    return tuple(sorted(map(int, m.groups()))) if m else None


def type_options(t):
    t = re.sub(r'\(\d+\??\)', '', t or '')
    out = set()
    for p in re.split(r'\s*[/()]\s*', t):
        p = p.strip().lower()
        if p: out.add(SAME_TYPE.get(p, p))
    if any(o.startswith('residential') for o in out): out.add('residential')
    return out


def gtype(t):
    t = (t or '').lower(); t = re.sub(r'^vacation rental - .*$', 'vacation rental', t)
    return SAME_TYPE.get(t, t)


def main():
    uploads = load(os.path.join(ROOT, 'data', 'gallery', 'uploads.json'))['uploads']
    pvg = load(os.path.join(ROOT, 'research', 'data', 'plan-vs-game.json'))['worlds']
    game = {(wn, r['lot']): r for wn, w in pvg.items() for r in w['lots']}
    out = collections.defaultdict(list)
    lots_by_upload = collections.defaultdict(list)
    for wf in world_files():
        W = load(wf); wn, ws = W['name'], slug(W['name'])
        if not W.get('owned'): continue
        names = collections.Counter()
        for h in W['neighbourhoods']:
            if not h.get('desc') and h['lots']: out['no_description'].append(f"{wn} / {h['name']}")
            for text, where in [(h.get('desc', ''), f"{wn} / {h['name']} (description)")]:
                for pat, uk in US.items():
                    for m in re.finditer(pat, text, re.I):
                        if not in_proper(text, m):
                            out['us_spelling'].append(f"{where}: “{m.group(0)}”")
            for l in h['lots']:
                label = f"{wn} / {h['name']} / {l.get('displayName') or l.get('myName') or l['lot']}"
                mine = l.get('myName') if l.get('myName') and l['myName'].strip().strip('?') else None   # a bare '?' means not named yet
                names[norm(mine or l['lot'])] += 1
                ids = [i for i in l.get('gallery') or [] if i in uploads]
                for i in ids: lots_by_upload[i].append(label)
                lead = None
                if ids:
                    lead = uploads[l['galleryLead']] if l.get('galleryLead') in uploads else max((uploads[i] for i in ids), key=lambda u: u['favourites'] + u['downloads'])
                # shared, built and Gallery uploads in step
                if l.get('shared') is True and not ids: out['shared_no_upload'].append(label)
                if ids and l.get('shared') is not True: out['upload_not_shared'].append(f"{label} (shared: {l.get('shared')})")
                if l.get('shared') is True and l.get('built') is False: out['shared_not_built'].append(label)
                # sizes: plan, her upload (her build), the game's original
                p, g = dims(l.get('size')), dims(lead.get('size')) if lead else None
                gm = game.get((wn, l['lot']), {}).get('game')
                o = dims(gm['size']) if gm else None
                if p and g and p != g:
                    out['size_plan_vs_gallery'].append({"lot": label, "plan": l['size'], "gallery": lead['size'], "game": gm and gm['size'],
                                                        "note": "the game's size too" if o == g else ("resized from the game's" if o and o != g else "")})
                elif p and not g and o and p != o and not re.search(r'apartment|penthouse', l.get('type') or '', re.I):
                    out['size_plan_vs_game_unshared'].append(f"{label}: plan {l['size']}, game {gm['size']}")
                # lot type: plan vs upload
                if lead and lead.get('lotType') and lead['lotType'] != 'Missing sims translation':
                    if gtype(lead['lotType']) not in type_options(l.get('type')) and not (gtype(lead['lotType']) == 'residential rental' and 'residential' in type_options(l.get('type'))):
                        kept = len(ids) > 1
                        out['type_plan_vs_gallery'].append(f"{label}: plan {l.get('type')}, upload {lead['lotType']}" + (" (one of its kept versions)" if kept else ""))
                # bedrooms/bathrooms: plan (apartments) vs upload
                if lead and l.get('beds') and lead.get('beds') and (l['beds'], l.get('baths') or 0) != (lead['beds'], lead['baths']):
                    out['rooms_plan_vs_gallery'].append(f"{label}: plan {l['beds']}/{l.get('baths')}, upload {lead['beds']}/{lead['baths']}")
                # her screenshots tick vs the pictures in the app
                has_shots = os.path.isdir(os.path.join(SITE, 'shots', ws, slug(l['lot'])))
                if l.get('screenshots') is True and not has_shots: out['screenshots_ticked_none_in_app'].append(label)
                if l.get('screenshots') is not True and has_shots: out['screenshots_in_app_not_ticked'].append(f"{label} (tick: {l.get('screenshots')})")
                # missing basics
                if not l.get('type'): out['no_lot_type'].append(label)
                if not l.get('size'): out['no_size'].append(label)
                # Gallery title vs the name shown (her spelling wins only where displayName is set)
                if lead and l.get('myName') and norm(re.sub(r'\s*[\[(][^\])]*[\])]\s*$', '', lead['title'])) not in {norm(l['myName']), norm(l['lot']), norm(l.get('displayName') or '')}:
                    out['name_plan_vs_gallery'].append(f"{label}: her name {l['myName']!r}, upload title {lead['title']!r}")
        for n, c in names.items():
            if c > 1: out['same_name_twice'].append(f"{wn}: {n} ({c} lots)")
    for i, ls in lots_by_upload.items():
        if len(ls) > 1: out['upload_on_two_lots'].append(f"{uploads[i]['title']}: " + "; ".join(ls))
    # descriptions the site shows: world blurbs
    for wf in world_files():
        W = load(wf)
        for pat in US:
            for m in re.finditer(pat, W.get('blurb', ''), re.I):
                if not in_proper(W['blurb'], m):
                    out['us_spelling'].append(f"{W['name']} (world blurb): “{m.group(0)}”")
    with open(os.path.join(ROOT, 'research', 'data', 'data-check.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    return out


if __name__ == '__main__':
    o = main()
    for k, v in o.items():
        print(f"\n## {k}: {len(v)}")
        for x in v[:60]: print('  ', x)
