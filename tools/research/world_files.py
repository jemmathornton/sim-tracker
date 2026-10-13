"""Lots in the game's world files: which area each lot is in, its size and its position (read only).

    python tools/research/world_files.py

Each .world file is one area of a world (a street). Its lot list (type 0x810A102D) holds, per lot: the game lot id
("ID  "), size in tiles ("SIZX", "SIZZ"), position ("POS ", x/height/z in metres) and rotation ("ROT ").
Writes research/data/world-lots.json.
"""
import glob, json, os, struct, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT

LOTLIST = 0x810A102D


def chunks(b, pos, end):
    """Tagged chunks: 4-letter tag, u32 length, data."""
    while pos + 8 <= end:
        tag = b[pos:pos + 4].decode('latin1'); ln = struct.unpack_from('<I', b, pos + 4)[0]
        yield tag, pos + 8, ln
        pos += 8 + ln


def lots_in(b):
    out = []
    if b[:4] != b'OMGS': return out
    for tag, p, ln in chunks(b, 8, len(b)):
        if tag != 'OMGR': continue
        rec = {}
        for t2, p2, l2 in chunks(b, p, p + ln):
            if t2 == 'ID  ': rec['id'] = struct.unpack_from('<Q', b, p2)[0]
            elif t2 == 'LOT ':
                for t3, p3, l3 in chunks(b, p2, p2 + l2):
                    if t3 == 'SIZX': rec['x'] = struct.unpack_from('<I', b, p3)[0]
                    elif t3 == 'SIZZ': rec['z'] = struct.unpack_from('<I', b, p3)[0]
                    elif t3 == 'POS ': rec['pos'] = [round(v, 2) for v in struct.unpack_from('<3f', b, p3)]
                    elif t3 == 'ROT ': rec['rot'] = round(struct.unpack_from('<f', b, p3)[0], 4)
        if 'x' in rec: out.append(rec)
    return out


if __name__ == '__main__':
    files = sorted(set(glob.glob(os.path.join(s4.GAME, '**', '*.world'), recursive=True)), key=lambda p: ('Delta' in p, p))
    result = {}
    for p in files:
        area = os.path.splitext(os.path.basename(p))[0]
        try: idx = s4.index(p)
        except Exception: continue
        for e in idx:
            if e[0] != LOTLIST: continue
            for r in lots_in(s4.read(p, e)):
                result[str(r['id'])] = {"area": area, "folder": os.path.relpath(p, s4.GAME).split(os.sep)[0 if 'Delta' not in p else 1],
                                        "size": f"{r['x']}x{r['z']}", "pos": r.get('pos'), "rot": r.get('rot')}
    with open(os.path.join(ROOT, 'research', 'data', 'world-lots.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump({"_note": "Lots in the game's world files, by game lot id: area (street) file, size, position (x, height, z in metres), rotation. From tools/research/world_files.py.", "lots": result}, f, indent=1)
    print(len(files), 'world files,', len(result), 'lots')
