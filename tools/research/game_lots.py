"""The game's own lot list: every lot's name, description and size, read from the game's files (read only).

    python tools/research/game_lots.py

Lot records (type 0x01942E2C): game lot id and size in tiles. Lot name records (0x729F6C4F): the name and description
text keys, pointing at a lot record. Later packs and patches override earlier ones (deltas read last).
Writes research/data/game-lots.json.
"""
import glob, json, os, re, struct, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT

LOTDESC, LOTNAME = 0x01942E2C, 0x729F6C4F
TEST = re.compile(r'test|perftest|sqe|chiron', re.I)


def packages():
    """Every package that can hold tuning, full builds first and deltas last (so fixes win)."""
    ps = glob.glob(os.path.join(s4.GAME, '**', 'Simulation*.package'), recursive=True) + glob.glob(os.path.join(s4.GAME, '**', 'Client*Build*.package'), recursive=True)
    return sorted(set(ps), key=lambda p: ('Delta' in p, 'Preload' in p, p))


def collect():
    descs, names = {}, {}
    for p in packages():
        for e in s4.index(p):
            if e[0] not in (LOTDESC, LOTNAME) or not e[5]: continue
            d = s4.read(p, e)
            if e[0] == LOTDESC and len(d) >= 24:
                descs[e[2]] = {"lot_id": struct.unpack_from('<I', d, 12)[0], "x": d[20], "z": d[21], "pack": pack_of(p)}
            elif e[0] == LOTNAME and len(d) >= 12:
                names[e[2]] = {"name_key": struct.unpack_from('<I', d, 4)[0], "desc_key": struct.unpack_from('<I', d, 8)[0],
                               "u32s": [struct.unpack_from('<I', d, k)[0] for k in (106, 70) if k + 4 <= len(d)], "pack": pack_of(p)}
    return descs, names


def pack_of(p):
    rel = os.path.relpath(p, s4.GAME).split(os.sep)
    return rel[1] if rel[0] == 'Delta' else rel[0] if rel[0] != 'Data' else 'Base'


if __name__ == '__main__':
    import pickle
    descs, names = collect()
    text = s4.english()
    lots = {}
    for nid, n in names.items():
        # the lot record id sits at byte 106 (newer records) or 70 (older); several name records can point at one lot,
        # and some of them carry no name, so a named one always wins
        link = [u for u in n['u32s'] if u in descs]
        for did in link[:1]:
            dsc = descs[did]; name = re.sub(r'<[^>]+>', '', text.get(n['name_key'], '')).strip()   # one name carries colour markup
            old_entry = lots.get(str(dsc['lot_id']))
            if old_entry and old_entry['name'] and not name: continue
            # the developers' test names ("PERFTEST_...") never beat a real one
            if old_entry and old_entry['name'] and not TEST.search(old_entry['name']) and TEST.search(name): continue
            lots[str(dsc['lot_id'])] = {"name": name, "description": text.get(n['desc_key'], '').strip(),
                                        "size": f"{dsc['x']}x{dsc['z']}", "lot_description_id": did, "name_record": nid, "pack": n['pack']}
    # lot records with no name record still give sizes
    for did, dsc in descs.items():
        lots.setdefault(str(dsc['lot_id']), {"name": "", "description": "", "size": f"{dsc['x']}x{dsc['z']}", "lot_description_id": did, "name_record": None, "pack": dsc['pack']})
    os.makedirs(os.path.join(ROOT, 'research', 'data'), exist_ok=True)
    with open(os.path.join(ROOT, 'research', 'data', 'game-lots.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump({"_note": "Every lot in the game's files (by game lot id): its name, description and size. From tools/research/game_lots.py.", "lots": lots}, f, ensure_ascii=False, indent=1)
    named = sum(1 for v in lots.values() if v['name'])
    print(len(descs), 'lot records,', len(names), 'name records,', len(lots), 'lots,', named, 'with a name')
