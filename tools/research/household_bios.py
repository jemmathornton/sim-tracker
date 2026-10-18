"""EA's own household bios for the EA (premade) households on the site, read from the game (19 Oct). Report only.

    python tools/research/household_bios.py     writes research/data/household-bios.json (nothing in data/ changes)

How the game links a bio to a household: each lot EA furnished and moved a family into has a house description
(resource type 0x729F6C4F, one per lot, in the Simulation packages; a save's ZoneData.lot_description_id points at it).
Near its end it holds, side by side, the household's bio as a text key (u32) and the household's id (u64, the
familyid of the household file 0xB3C438F0, which a save keeps as HouseholdData.premade_household_id). A new save copies
that text into HouseholdData.description. Three households (BFF, Landgraab, Spencer-Kim-Lewis) also carry their bio
written straight into the household file (AccountFamilyData.description).

Site households are matched to EA's household files by their Sims' names (most Sims in common), else by household name.
"""
import glob, json, os, struct, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT

HHBIN, HOUSEDESC = 0xB3C438F0, 0x729F6C4F
OUT = os.path.join(ROOT, 'research', 'data', 'household-bios.json')


def order(p):   # full builds first, then deltas (a later fix wins)
    return ('Delta' in p or 'Preload' in p, p)


def household_files(en, schema):
    """familyid -> {'name', 'sims' (full names), 'description', 'file'}"""
    out = {}
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', 'Client*.package'), recursive=True), key=order):
        for e in s4.index(p):
            if e[0] != HHBIN: continue
            b = s4.read(p, e); ver, ln = struct.unpack_from('<II', b, 0)
            body = b[16:16 + struct.unpack_from('<I', b, 12)[0]] if ver == 2 else b[8:8 + ln]
            fa = s4.decode(body, '.EA.Sims4.Network.FamilyData', schema, depth=3).get('family_account', {})
            if not fa.get('familyid'): continue
            sims = []
            for s in fa.get('sim') or []:
                first = s.get('first_name') or en.get(s.get('first_name_key') or 0, '')
                last = s.get('last_name') or en.get(s.get('last_name_key') or 0, '')
                sims.append((first + ' ' + last).strip())
            out[fa['familyid']] = {"name": fa.get('familyname') or '', "sims": sims, "description": fa.get('description') or '',
                                   "file": '%08X:%08X:%016X' % (e[0], e[1], e[2]), "pack": os.path.relpath(p, s4.GAME).split(os.sep)[0 if 'Delta' not in p else 1]}
    return out


def house_descriptions(fams, en):
    """familyid -> [(text key, house description instance, pack)] from every house description resource."""
    found = {}
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', 'Simulation*.package'), recursive=True), key=order):
        for e in s4.index(p):
            if e[0] != HOUSEDESC: continue
            d = s4.read(p, e)
            for i in range(4, len(d) - 7):
                fid = struct.unpack_from('<Q', d, i)[0]
                if fid in fams:
                    key = struct.unpack_from('<I', d, i - 4)[0]
                    found.setdefault(fid, {})[e[2]] = (key, os.path.relpath(p, s4.GAME))   # later (delta) copies replace earlier ones
    return {fid: [(k, inst, p) for inst, (k, p) in v.items()] for fid, v in found.items()}


_ALL = {}


def sims_all(world, name):
    return _ALL.get((world, name), [])


def site_households():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))):
        W = json.load(open(f, encoding='utf-8'))
        for name, h in (W.get('households') or {}).items():
            _ALL[(W['name'], name)] = h.get('sims', [])
            sims = [s for s in h.get('sims', []) if s.get('origin') == 'Premade']
            if h.get('origin') == 'Premade' or sims:
                out.append((W['name'], name, [s['name'] for s in sims]))
    return out


def main():
    en = s4.english(); schema = s4.save_schema()
    fams = household_files(en, schema)
    descs = house_descriptions(fams, en)
    norm = lambda x: x.lower().replace('-', ' ').replace('&', ' ').replace('the ', '').strip()
    res, missing = {}, []
    for world, name, sims in site_households():
        # every EA household sharing a Sim with this one (several when she has merged two)
        share = collections.Counter({fid: len(set(sims) & set(f['sims'])) for fid, f in fams.items()})
        hits = [fid for fid, n in share.items() if n]
        if not hits and sims:   # renamed family (the Montys are Monticapps on the site): first names, at least two in common
            first = lambda xs: {x.split(' ')[0] for x in xs}
            share = collections.Counter({fid: len(first(sims) & first(f['sims'])) for fid, f in fams.items()})
            hits = [fid for fid, n in share.items() if n >= min(2, len(sims))]
        if not hits:
            hits = [fid for fid, f in fams.items() if norm(f['name']).endswith(norm(name)) or norm(name) in norm(f['name']).split('_')]
        # keep, per EA household name, the copy with most Sims in common (packs ship a few duplicates)
        best = {}
        for fid in sorted(hits, key=lambda x: -share[x]):
            best.setdefault(fams[fid]['name'], fid)
        hits = list(best.values())
        entries = []
        for fid in hits:
            f = fams[fid]
            for key, inst, pk in descs.get(fid, []):
                if en.get(key): entries.append({"bio": en[key].strip(), "key": '0x%08X' % key, "how": f"house description 0x{HOUSEDESC:08X}:00000000:{inst:016X} ({pk}) -> text key next to household id {fid} (household file {f['file']}, '{f['name']}')"})
            if not descs.get(fid) and f['description']:
                entries.append({"bio": f["description"].strip(), "key": None, "how": f"household file {f['file']} ('{f['name']}'), AccountFamilyData.description (field 11)"})
        uniq = []
        for x in entries:
            if x['bio'] not in [u['bio'] for u in uniq]: uniq.append(x)
        k = f'{world}|{name}'
        if not uniq: missing.append({"household": k, "ea_households": [fams[f]['name'] for f in hits], "why": "no EA household file matched" if not hits else "no bio linked in the game"}); continue
        partial = [fams[f]['name'] for f in hits if not any(f"'{fams[f]['name']}'" in u['how'] for u in uniq)]
        matched = [s for s in sims if any(s in fams[f]['sims'] for f in hits)]
        whole = len(matched) == len(sims)
        sure = len(uniq) == 1 and 2 * len(matched) >= len(sims)
        rec = {"bio": uniq[0]['bio'] if len(uniq) == 1 else [u['bio'] for u in uniq], "key": uniq[0]['key'] if len(uniq) == 1 else [u['key'] for u in uniq],
               "how": uniq[0]['how'] if len(uniq) == 1 else [u['how'] for u in uniq], "sure": sure}
        notes = []
        if len(hits) > 1: notes.append('Sims from more than one EA household: ' + ', '.join(fams[f]['name'] for f in hits))
        if partial: notes.append('no bio for ' + ', '.join(partial))
        if sims and not whole: notes.append('Sims not matched by full name: ' + ', '.join(s for s in sims if s not in matched))
        others = [s for f in hits for s in fams[f]['sims'] if s not in sims and s.split(' ')[0] not in {x.split(' ')[0] for x in sims}]
        if others and sims:
            rec['sure'] = False; notes.append("EA's household also has " + ', '.join(others) + ' (not in this one)')
        mine = [s['name'] for s in sims_all(world, name) if s.get('origin') != 'Premade']
        if mine: rec['sure'] = False; notes.append('her own Sims live here too: ' + ', '.join(mine))
        if notes: rec['note'] = '; '.join(notes)
        res[k] = rec
    # a bio shared by two site households (she split an EA family): it describes the whole family, so not sure for either
    by_key = collections.defaultdict(list)
    for k, v in res.items():
        for key in (v['key'] if isinstance(v['key'], list) else [v['key']]):
            if key: by_key[key].append(k)
    for key, ks in by_key.items():
        if len(ks) > 1:
            for k in ks:
                res[k]['sure'] = False
                res[k]['note'] = '; '.join(x for x in (res[k].get('note'), 'same bio as ' + ', '.join(o for o in ks if o != k) + " (she split EA's family)") if x)
    res['_missing'] = missing
    res['_note'] = "EA's household bios, read from the game by tools/research/household_bios.py. Key = the English text key; 'how' = where the link is."
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(res, fh, indent=1, ensure_ascii=False)
    print(len(res) - 2, 'found (', sum(1 for k, v in res.items() if not k.startswith('_') and v['sure']), 'sure ),', len(missing), 'missing ->', OUT)
    for k, v in res.items():
        if not k.startswith('_') and not v['sure']: print('  doubt:', k, '|', v.get('note', ''), '|', v['key'])
    for m in missing: print('  missing:', m)


if __name__ == '__main__':
    main()
