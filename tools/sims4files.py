"""Reading The Sims 4's own files: package files (DBPF), EA's RefPack compression, protobuf save data,
SimData records and English string tables. Everything here only reads; saves are read from a temporary copy.
"""
import glob, os, shutil, struct, tempfile, zipfile, zlib

GAME = os.path.join('C:' + os.sep, 'Program Files', 'EA Games', 'The Sims 4')
SAVES = os.path.join(os.path.expanduser('~'), 'Documents', 'Electronic Arts', 'The Sims 4', 'saves')
SIMDATA, STBL, SAVEGAME = 0x545AC67A, 0x220557DA, 0x0000000D


# ---------- package files ----------
def index(path):
    """[(type, group, instance, offset, filesize, memsize, compression)] for a .package, without reading the data."""
    with open(path, 'rb') as f:
        head = f.read(96); assert head[:4] == b'DBPF', path
        count, = struct.unpack_from('<I', head, 36); pos, = struct.unpack_from('<I', head, 64)
        f.seek(pos); b = f.read(4 + count * 32 + 12)
    flags, = struct.unpack_from('<I', b, 0); p = 4; const = {}
    for i, name in enumerate(('type', 'group', 'insthi')):
        if flags & (1 << i): const[name], = struct.unpack_from('<I', b, p); p += 4
    out = []
    for _ in range(count):
        e = {}
        for name in ('type', 'group', 'insthi'):
            if name in const: e[name] = const[name]
            else: e[name], = struct.unpack_from('<I', b, p); p += 4
        instlo, off, fs, mem = struct.unpack_from('<IIII', b, p); p += 16
        comp = 0
        if fs & 0x80000000: comp, = struct.unpack_from('<H', b, p); p += 4
        out.append((e['type'], e['group'], e['insthi'] << 32 | instlo, off, fs & 0x7FFFFFFF, mem, comp))
    return out


def read(path, entry):
    """The (decompressed) bytes of one index entry."""
    t, g, inst, off, size, mem, comp = entry
    with open(path, 'rb') as f:
        f.seek(off); raw = f.read(size)
    if comp == 0x5A42: return zlib.decompressobj().decompress(raw)   # lenient: some mods' streams lack the end checksum
    if comp == 0xFFFF: return refpack(raw)
    return raw


def refpack(src):
    """EA RefPack / QFS decompression (package 'internal compression' 0xFFFF)."""
    flags = src[0]
    if flags & 0x80: size = int.from_bytes(src[2:6], 'big'); p = 6
    else: size = int.from_bytes(src[2:5], 'big'); p = 5
    out = bytearray(); n = len(src)
    while p < n:
        b0 = src[p]
        if b0 <= 0x7F:
            b1 = src[p + 1]; p += 2
            plain = b0 & 3; length = ((b0 & 0x1C) >> 2) + 3; off = ((b0 & 0x60) << 3) + b1 + 1
        elif b0 <= 0xBF:
            b1, b2 = src[p + 1], src[p + 2]; p += 3
            plain = (b1 >> 6) & 3; length = (b0 & 0x3F) + 4; off = ((b1 & 0x3F) << 8) + b2 + 1
        elif b0 <= 0xDF:
            b1, b2, b3 = src[p + 1], src[p + 2], src[p + 3]; p += 4
            plain = b0 & 3; length = ((b0 & 0x0C) << 6) + b3 + 5; off = ((b0 & 0x10) << 12) + (b1 << 8) + b2 + 1
        elif b0 <= 0xFB:
            p += 1; plain = ((b0 & 0x1F) << 2) + 4; out += src[p:p + plain]; p += plain; continue
        else:
            p += 1; plain = b0 & 3; out += src[p:p + plain]; break
        out += src[p:p + plain]; p += plain
        start = len(out) - off
        if off >= length: out += out[start:start + length]
        else:
            for k in range(length): out.append(out[start + k])
    if len(out) != size: raise ValueError(f'RefPack size mismatch ({len(out)} != {size})')
    return bytes(out)


# ---------- protobuf (save data) ----------
def varint(b, p):
    r = s = 0
    while True:
        x = b[p]; p += 1; r |= (x & 0x7F) << s; s += 7
        if x < 0x80: return r, p


def fields(b):
    """One protobuf message as [(field number, wire type, value)]."""
    p, out, n = 0, [], len(b)
    while p < n:
        key, p = varint(b, p); f, wt = key >> 3, key & 7
        if f == 0: raise ValueError('not a protobuf message')
        if wt == 0: v, p = varint(b, p)
        elif wt == 1: v = b[p:p + 8]; p += 8
        elif wt == 2:
            ln, p = varint(b, p); v = b[p:p + ln]; p += ln
            if p > n: raise ValueError('not a protobuf message')
        elif wt == 5: v = b[p:p + 4]; p += 4
        else: raise ValueError('not a protobuf message')
        out.append((f, wt, v))
    return out


TYPES = {1: 'double', 2: 'float', 3: 'int64', 4: 'uint64', 5: 'int32', 6: 'fixed64', 7: 'fixed32', 8: 'bool', 9: 'string',
         11: 'message', 12: 'bytes', 13: 'uint32', 14: 'enum', 15: 'sfixed32', 16: 'sfixed64', 17: 'sint32', 18: 'sint64'}


def save_schema():
    """The save layout (message and enum definitions), read from the protobuf descriptors in the game's generated.zip."""
    messages, enums = {}, {}
    zf = zipfile.ZipFile(os.path.join(GAME, 'Game', 'Bin', 'Python', 'generated.zip'))
    for n in zf.namelist():
        if not n.endswith('_pb2.pyc'): continue
        b = zf.read(n); proto = os.path.basename(n)[:-8] + '.proto'
        i = b.find(b'\n' + bytes([len(proto)]) + proto.encode())
        if i < 5: continue
        typ, ln = b[i - 5:i - 4], int.from_bytes(b[i - 4:i], 'little')
        blob = b[i:i + ln]
        if typ in (b'u', b't'): blob = blob.decode('utf-8').encode('latin1')   # stored as a str, turned into bytes with latin-1
        try: _file(blob, messages, enums)
        except (ValueError, IndexError, StopIteration, UnicodeDecodeError): pass   # a few files use other layouts; the save doesn't need them
    return messages, enums


def _file(blob, messages, enums):
    fd = fields(blob); pkg = next((v.decode() for f, wt, v in fd if f == 2), '')
    def msg(b, prefix):
        m = fields(b); full = prefix + '.' + next(v.decode() for f, wt, v in m if f == 1); flds = {}
        for f, wt, v in m:
            if f == 2:
                d = {k: val for k, w, val in fields(v)}
                flds[d[3]] = {"name": d[1].decode(), "repeated": d.get(4) == 3, "type": TYPES.get(d.get(5)), "type_name": d.get(6, b'').decode()}
            elif f == 3: msg(v, full)
            elif f == 4: enum(v, full)
        messages[full] = flds
    def enum(b, prefix):
        e = fields(b); full = prefix + '.' + next(v.decode() for f, wt, v in e if f == 1)
        enums[full] = {d.get(2, 0): d[1].decode() for d in ({k: val for k, w, val in fields(v)} for f, wt, v in e if f == 2)}
    for f, wt, v in fd:
        if f == 4: msg(v, '.' + pkg)
        elif f == 5: enum(v, '.' + pkg)


def decode(b, mtype, schema, depth=6):
    """A message as a dict of named fields (repeated fields as lists). Nested messages deeper than `depth` stay as bytes."""
    M, E = schema; spec = M.get(mtype, {}); out = {}
    for f, wt, v in fields(b):
        s = spec.get(f)
        if not s: continue
        t = s['type']
        if t == 'message' and wt == 2: val = decode(v, s['type_name'], schema, depth - 1) if depth > 0 else v
        elif t == 'string' and wt == 2: val = v.decode('utf-8', 'replace')
        elif t == 'enum' and wt == 0: val = E.get(s['type_name'], {}).get(v, v)
        elif t in ('fixed64', 'sfixed64') and wt == 1: val = int.from_bytes(v, 'little', signed=t == 'sfixed64')
        elif t in ('fixed32', 'sfixed32') and wt == 5: val = int.from_bytes(v, 'little', signed=t == 'sfixed32')
        elif t == 'float' and wt == 5: val = struct.unpack('<f', v)[0]
        elif t == 'bool' and wt == 0: val = bool(v)
        elif wt == 2 and t in ('fixed64', 'sfixed64'):    # packed repeated
            val = [int.from_bytes(v[k:k + 8], 'little') for k in range(0, len(v), 8)]
            out.setdefault(s['name'], []).extend(val); continue
        elif wt == 2 and t in ('uint32', 'uint64', 'int32', 'int64', 'enum'):
            val, p = [], 0
            while p < len(v): x, p = varint(v, p); val.append(x)
            out.setdefault(s['name'], []).extend(val); continue
        else: val = v
        if s['repeated']: out.setdefault(s['name'], []).append(val)
        else: out[s['name']] = val
    return out


def read_save(path):
    """The SaveGameData bytes of a save, read from a temporary copy (the original is never opened for writing)."""
    tmp = os.path.join(tempfile.mkdtemp(), os.path.basename(path)); shutil.copy(path, tmp)
    try:
        e = next(e for e in index(tmp) if e[0] == SAVEGAME)
        return read(tmp, e)
    finally:
        os.remove(tmp)


def save_name(data, schema):
    """(save name, the save's own name) - an autosave is called 'Autosave' and keeps its save's name in the second."""
    top = {f: v for f, wt, v in fields(data) if f == 2}
    slot = decode(top[2], '.EA.Sims4.Persistence.SaveSlotData', schema, depth=0)
    return slot.get('slot_name', ''), slot.get('preferred_manual_slot_name', '')


# ---------- SimData and English text ----------
def simdata(b):
    """A SimData ('DATA') record as [(table name, schema name, [row dicts])]. Only simple column types are read."""
    def rel(pos):
        v, = struct.unpack_from('<i', b, pos)
        return None if v == -0x80000000 else pos + v
    def cstr(pos):
        if pos is None: return None
        return b[pos:b.index(b'\0', pos)].decode('utf-8', 'replace')
    if b[:4] != b'DATA': return []
    tho, (tc,) = rel(8), struct.unpack_from('<i', b, 12)
    out = []
    for t in range(tc):
        p = tho + t * 28
        name, sch = cstr(rel(p)), rel(p + 8)
        rowsize, = struct.unpack_from('<I', b, p + 16); rows_at = rel(p + 20); rowcount, = struct.unpack_from('<I', b, p + 24)
        if sch is None or rows_at is None: continue
        sname, col_at = cstr(rel(sch)), rel(sch + 16); ncol, = struct.unpack_from('<I', b, sch + 20)
        cols = []
        for c in range(ncol):
            q = col_at + c * 20; ctype, flags, off = struct.unpack_from('<HHI', b, q + 8)
            cols.append((cstr(rel(q)), ctype, off))
        rows = []
        for r in range(rowcount):
            base, row = rows_at + r * rowsize, {}
            for cname, ctype, off in cols:
                at = base + off
                if ctype == 20: row[cname] = ('text', struct.unpack_from('<I', b, at)[0])
                elif ctype == 0: row[cname] = bool(b[at])
                elif ctype == 6: row[cname] = struct.unpack_from('<i', b, at)[0]
                elif ctype == 7: row[cname] = struct.unpack_from('<I', b, at)[0]
                elif ctype in (8, 9, 18): row[cname] = struct.unpack_from('<Q', b, at)[0]   # 18: a reference to another tuning
            rows.append(row)
        out.append((name, sname, rows))
    return out


def english():
    """Every English string in the game and its packs: key -> text."""
    st = {}
    for p in glob.glob(os.path.join(GAME, '**', 'Strings_ENG_US.package'), recursive=True):
        for e in index(p):
            if e[0] != STBL: continue
            d = read(p, e)
            if d[:4] != b'STBL': continue
            n, = struct.unpack_from('<Q', d, 7); q = 21
            for _ in range(n):
                key, flags, ln = struct.unpack_from('<IBH', d, q); q += 7
                st[key] = d[q:q + ln].decode('utf-8', 'replace'); q += ln
    return st


def simdata_records(*schema_names):
    """Every SimData record of the given kinds across the game and its packs: {kind: {instance id: {'tuning': name, 'row': first row}}}.
    Full builds are read before deltas, so a pack's later fix wins."""
    pk = sorted(glob.glob(os.path.join(GAME, '**', 'Simulation*Build*.package'), recursive=True), key=lambda p: 'Delta' in p)
    out = {n: {} for n in schema_names}
    for p in pk:
        for e in index(p):
            if e[0] != SIMDATA: continue
            for tname, sname, rows in simdata(read(p, e)):
                if sname in out and rows:
                    old = out[sname].get(e[2], {}).get('row', {})
                    out[sname][e[2]] = {"tuning": tname, "row": {**old, **{k: v for k, v in rows[0].items() if v not in (None, ('text', 0))}}}
    return out
