"""Read the game's UI files (Scaleform GFX, a form of Flash SWF): tags, exported symbols, and the ActionScript 3 (ABC)
code as class -> method -> normalised instruction text, so two copies of the same UI file can be compared (30 Oct 2026:
UI Cheats Extension and SimMattically's cart button mod against patch 1.129). Also keeps where each method's code sits,
for patch_simmattically_cart.py. Only reads."""
import struct, zlib, hashlib


def tag_spans(b):
    """(end of the SWF header, [(tag code, start of tag header, start of data, end of data)]) for an uncompressed file."""
    nbits = b[8] >> 3
    p = head = 8 + (5 + nbits * 4 + 7) // 8 + 4
    out = []
    while p < len(b):
        h = p; cl, = struct.unpack_from('<H', b, p); p += 2
        code, ln = cl >> 6, cl & 0x3F
        if ln == 0x3F:
            ln, = struct.unpack_from('<I', b, p); p += 4
        out.append((code, h, p, p + ln)); p += ln
        if code == 0: break
    return head, out


def swf_tags(b):
    sig = b[:3]
    if sig in (b'CFX', b'CWS'):
        b = b[:8] + zlib.decompress(b[8:])
    nbits = b[8] >> 3
    p = 8 + (5 + nbits * 4 + 7) // 8 + 4
    tags = []
    while p < len(b):
        cl, = struct.unpack_from('<H', b, p); p += 2
        code, ln = cl >> 6, cl & 0x3F
        if ln == 0x3F:
            ln, = struct.unpack_from('<I', b, p); p += 4
        tags.append((code, b[p:p + ln])); p += ln
        if code == 0: break
    return tags


class R:
    def __init__(s, b, p=0): s.b, s.p = b, p
    def u8(s): v = s.b[s.p]; s.p += 1; return v
    def u16(s): v, = struct.unpack_from('<H', s.b, s.p); s.p += 2; return v
    def s24(s): v = int.from_bytes(s.b[s.p:s.p + 3], 'little', signed=True); s.p += 3; return v
    def u30(s):
        v = 0; sh = 0
        for _ in range(5):
            c = s.b[s.p]; s.p += 1; v |= (c & 0x7F) << sh; sh += 7
            if not c & 0x80: break
        return v
    def d64(s): v, = struct.unpack_from('<d', s.b, s.p); s.p += 8; return v
    def bytes(s, n): v = s.b[s.p:s.p + n]; s.p += n; return v


OPS = {  # opcode: (name, operand kinds) ; m=multiname, s=string, u=u30, b=u8, j=s24 branch, f=method, c=class, i=int, d=double
    0x01: ('bkpt', ''), 0x02: ('nop', ''), 0x03: ('throw', ''), 0x04: ('getsuper', 'm'), 0x05: ('setsuper', 'm'), 0x06: ('dxns', 's'),
    0x07: ('dxnslate', ''), 0x08: ('kill', 'u'), 0x09: ('label', ''), 0x0C: ('ifnlt', 'j'), 0x0D: ('ifnle', 'j'), 0x0E: ('ifngt', 'j'),
    0x0F: ('ifnge', 'j'), 0x10: ('jump', 'j'), 0x11: ('iftrue', 'j'), 0x12: ('iffalse', 'j'), 0x13: ('ifeq', 'j'), 0x14: ('ifne', 'j'),
    0x15: ('iflt', 'j'), 0x16: ('ifle', 'j'), 0x17: ('ifgt', 'j'), 0x18: ('ifge', 'j'), 0x19: ('ifstricteq', 'j'), 0x1A: ('ifstrictne', 'j'),
    0x1B: ('lookupswitch', 'L'), 0x1C: ('pushwith', ''), 0x1D: ('popscope', ''), 0x1E: ('nextname', ''), 0x1F: ('hasnext', ''),
    0x20: ('pushnull', ''), 0x21: ('pushundefined', ''), 0x23: ('nextvalue', ''), 0x24: ('pushbyte', 'b'), 0x25: ('pushshort', 'u'),
    0x26: ('pushtrue', ''), 0x27: ('pushfalse', ''), 0x28: ('pushnan', ''), 0x29: ('pop', ''), 0x2A: ('dup', ''), 0x2B: ('swap', ''),
    0x2C: ('pushstring', 's'), 0x2D: ('pushint', 'i'), 0x2E: ('pushuint', 'U'), 0x2F: ('pushdouble', 'd'), 0x30: ('pushscope', ''),
    0x31: ('pushnamespace', 'u'), 0x32: ('hasnext2', 'uu'), 0x35: ('li8', ''), 0x36: ('li16', ''), 0x37: ('li32', ''), 0x38: ('lf32', ''),
    0x39: ('lf64', ''), 0x3A: ('si8', ''), 0x3B: ('si16', ''), 0x3C: ('si32', ''), 0x3D: ('sf32', ''), 0x3E: ('sf64', ''),
    0x40: ('newfunction', 'f'), 0x41: ('call', 'u'), 0x42: ('construct', 'u'), 0x43: ('callmethod', 'uu'), 0x44: ('callstatic', 'fu'),
    0x45: ('callsuper', 'mu'), 0x46: ('callproperty', 'mu'), 0x47: ('returnvoid', ''), 0x48: ('returnvalue', ''), 0x49: ('constructsuper', 'u'),
    0x4A: ('constructprop', 'mu'), 0x4C: ('callproplex', 'mu'), 0x4E: ('callsupervoid', 'mu'), 0x4F: ('callpropvoid', 'mu'),
    0x50: ('sxi1', ''), 0x51: ('sxi8', ''), 0x52: ('sxi16', ''), 0x53: ('applytype', 'u'), 0x55: ('newobject', 'u'), 0x56: ('newarray', 'u'),
    0x57: ('newactivation', ''), 0x58: ('newclass', 'c'), 0x59: ('getdescendants', 'm'), 0x5A: ('newcatch', 'u'), 0x5D: ('findpropstrict', 'm'),
    0x5E: ('findproperty', 'm'), 0x5F: ('finddef', 'm'), 0x60: ('getlex', 'm'), 0x61: ('setproperty', 'm'), 0x62: ('getlocal', 'u'),
    0x63: ('setlocal', 'u'), 0x64: ('getglobalscope', ''), 0x65: ('getscopeobject', 'b'), 0x66: ('getproperty', 'm'), 0x68: ('initproperty', 'm'),
    0x6A: ('deleteproperty', 'm'), 0x6C: ('getslot', 'u'), 0x6D: ('setslot', 'u'), 0x6E: ('getglobalslot', 'u'), 0x6F: ('setglobalslot', 'u'),
    0x70: ('convert_s', ''), 0x71: ('esc_xelem', ''), 0x72: ('esc_xattr', ''), 0x73: ('convert_i', ''), 0x74: ('convert_u', ''),
    0x75: ('convert_d', ''), 0x76: ('convert_b', ''), 0x77: ('convert_o', ''), 0x78: ('checkfilter', ''), 0x80: ('coerce', 'm'),
    0x81: ('coerce_b', ''), 0x82: ('coerce_a', ''), 0x83: ('coerce_i', ''), 0x84: ('coerce_d', ''), 0x85: ('coerce_s', ''), 0x86: ('astype', 'm'),
    0x87: ('astypelate', ''), 0x88: ('coerce_u', ''), 0x89: ('coerce_o', ''), 0x90: ('negate', ''), 0x91: ('increment', ''), 0x92: ('inclocal', 'u'),
    0x93: ('decrement', ''), 0x94: ('declocal', 'u'), 0x95: ('typeof', ''), 0x96: ('not', ''), 0x97: ('bitnot', ''), 0xA0: ('add', ''),
    0xA1: ('subtract', ''), 0xA2: ('multiply', ''), 0xA3: ('divide', ''), 0xA4: ('modulo', ''), 0xA5: ('lshift', ''), 0xA6: ('rshift', ''),
    0xA7: ('urshift', ''), 0xA8: ('bitand', ''), 0xA9: ('bitor', ''), 0xAA: ('bitxor', ''), 0xAB: ('equals', ''), 0xAC: ('strictequals', ''),
    0xAD: ('lessthan', ''), 0xAE: ('lessequals', ''), 0xAF: ('greaterthan', ''), 0xB0: ('greaterequals', ''), 0xB1: ('instanceof', ''),
    0xB2: ('istype', 'm'), 0xB3: ('istypelate', ''), 0xB4: ('in', ''), 0xC0: ('increment_i', ''), 0xC1: ('decrement_i', ''),
    0xC2: ('inclocal_i', 'u'), 0xC3: ('declocal_i', 'u'), 0xC4: ('negate_i', ''), 0xC5: ('add_i', ''), 0xC6: ('subtract_i', ''),
    0xC7: ('multiply_i', ''), 0xD0: ('getlocal_0', ''), 0xD1: ('getlocal_1', ''), 0xD2: ('getlocal_2', ''), 0xD3: ('getlocal_3', ''),
    0xD4: ('setlocal_0', ''), 0xD5: ('setlocal_1', ''), 0xD6: ('setlocal_2', ''), 0xD7: ('setlocal_3', ''), 0xEF: ('debug', 'bubu'),
    0xF0: ('debugline', 'u'), 0xF1: ('debugfile', 's'),
}


class ABC:
    def __init__(s, data):
        r = R(data); r.u16(); r.u16()
        n = r.u30(); s.ints = [0] + [r.u30() for _ in range(max(n - 1, 0))]
        n = r.u30(); s.uints = [0] + [r.u30() for _ in range(max(n - 1, 0))]
        n = r.u30(); s.doubles = [0.0] + [r.d64() for _ in range(max(n - 1, 0))]
        n = r.u30(); s.strings = ['*']
        for _ in range(max(n - 1, 0)):
            ln = r.u30(); s.strings.append(r.bytes(ln).decode('utf8', 'replace'))
        n = r.u30(); s.ns = [(0, 0)] + [(r.u8(), r.u30()) for _ in range(max(n - 1, 0))]
        n = r.u30(); s.nssets = [[]]
        for _ in range(max(n - 1, 0)):
            c = r.u30(); s.nssets.append([r.u30() for _ in range(c)])
        n = r.u30(); s.mn = [None]
        for _ in range(max(n - 1, 0)):
            k = r.u8()
            if k in (0x07, 0x0D): s.mn.append(('q', r.u30(), r.u30()))
            elif k in (0x0F, 0x10): s.mn.append(('rt', 0, r.u30()))
            elif k in (0x11, 0x12): s.mn.append(('rtl', 0, 0))
            elif k in (0x09, 0x0E): nm = r.u30(); s.mn.append(('m', r.u30(), nm))
            elif k in (0x1B, 0x1C): s.mn.append(('ml', r.u30(), 0))
            elif k == 0x1D:
                q = r.u30(); c = r.u30(); s.mn.append(('t', q, [r.u30() for _ in range(c)]))
            else: raise ValueError('multiname kind %x' % k)
        n = r.u30(); s.methods = []
        for _ in range(n):
            pc = r.u30(); ret = r.u30(); pt = [r.u30() for _ in range(pc)]; nm = r.u30(); fl = r.u8()
            if fl & 0x08:
                oc = r.u30()
                for _ in range(oc): r.u30(); r.u8()
            if fl & 0x80:
                for _ in range(pc): r.u30()
            s.methods.append({'params': pt, 'ret': ret, 'name': nm})
        n = r.u30()
        for _ in range(n):
            r.u30(); c = r.u30()
            for _ in range(c): r.u30(); r.u30()
        n = r.u30(); s.inst = []
        for _ in range(n):
            nm = r.u30(); sup = r.u30(); fl = r.u8()
            if fl & 0x08: r.u30()
            ic = r.u30(); intf = [r.u30() for _ in range(ic)]; iinit = r.u30()
            s.inst.append({'name': nm, 'super': sup, 'iinit': iinit, 'traits': s.traits(r)})
        s.cls = []
        for _ in range(n):
            cinit = r.u30(); s.cls.append({'cinit': cinit, 'traits': s.traits(r)})
        n = r.u30(); s.scripts = []
        for _ in range(n):
            init = r.u30(); s.scripts.append({'init': init, 'traits': s.traits(r)})
        n = r.u30(); s.bodies = {}; s.body_at = {}
        for _ in range(n):
            m = r.u30(); start = r.p; r.u30(); r.u30(); r.u30(); r.u30(); cl = r.u30(); cstart = r.p; code = r.bytes(cl)
            ec = r.u30()
            for _ in range(ec): r.u30(); r.u30(); r.u30(); r.u30(); r.u30()
            s.traits(r); s.bodies[m] = code; s.body_at[m] = (start, cstart, cstart + cl, ec)

    def traits(s, r):
        out = []
        for _ in range(r.u30()):
            nm = r.u30(); k = r.u8(); kind = k & 0x0F
            if kind in (0, 6):
                r.u30(); tn = r.u30(); vi = r.u30()
                if vi: r.u8()
                out.append(('slot' if kind == 0 else 'const', nm, tn))
            elif kind in (1, 2, 3):
                r.u30(); m = r.u30(); out.append((('method', 'get', 'set')[kind - 1], nm, m))
            elif kind == 4:
                r.u30(); c = r.u30(); out.append(('class', nm, c))
            elif kind == 5:
                r.u30(); f = r.u30(); out.append(('function', nm, f))
            if (k >> 4) & 0x04:
                for _ in range(r.u30()): r.u30()
        return out

    def nsname(s, i):
        if not i or i >= len(s.ns): return '*'
        return s.strings[s.ns[i][1]]

    def mname(s, i):
        if not i: return '*'
        m = s.mn[i]
        if m[0] == 'q':
            ns = s.nsname(m[1]); nm = s.strings[m[2]]
            return (ns + '.' + nm) if ns and ns != '*' and s.ns[m[1]][0] in (0x16, 0x08) else nm
        if m[0] in ('m', 'rt'): return s.strings[m[2]]
        if m[0] == 't': return s.mname(m[1]) + '.<' + ','.join(s.mname(x) for x in m[2]) + '>'
        return '[late]'

    def raw_ops(s, mi):
        """(opcode name, [raw operand numbers]) for each instruction of a method, e.g. to find a multiname's index."""
        code = s.bodies.get(mi, b''); r = R(code)
        while r.p < len(code):
            op = r.u8(); name, kinds = OPS.get(op, ('op%02x' % op, '')); args = []
            for k in kinds:
                if k in 'msuidUfc': args.append(r.u30())
                elif k == 'b': args.append(r.u8())
                elif k == 'j': args.append(r.s24())
                elif k == 'L':
                    r.s24(); c = r.u30(); [r.s24() for _ in range(c + 1)]
            yield name, args

    def method_of(s, cls, member):
        """Method index of an instance method (or getter/setter) of a class, by the class's full name."""
        for ins in s.inst:
            if s.mname(ins['name']) == cls:
                for kind, nm, x in ins['traits']:
                    if kind in ('method', 'get', 'set') and s.mname(nm) == member: return x
        raise KeyError(cls + '.' + member)

    def disasm(s, mi, depth=0):
        """Normalised instruction lines (branch targets as labels, inner functions inlined)."""
        code = s.bodies.get(mi, b''); r = R(code); out = []
        while r.p < len(code):
            at = r.p; op = r.u8(); name, kinds = OPS.get(op, ('op%02x' % op, ''))
            args = []
            for k in kinds:
                if k == 'm': args.append(s.mname(r.u30()))
                elif k == 's': args.append(repr(s.strings[r.u30()]))
                elif k == 'u': args.append(str(r.u30()))
                elif k == 'b': args.append(str(r.u8()))
                elif k == 'j': args.append('->%+d' % r.s24())
                elif k == 'i': args.append(str(s.ints[r.u30()]))
                elif k == 'U': args.append(str(s.uints[r.u30()]))
                elif k == 'd': args.append(repr(s.doubles[r.u30()]))
                elif k == 'f':
                    f = r.u30(); args.append('fn{' + (' ; '.join(s.disasm(f, depth + 1)) if depth < 3 else '') + '}')
                elif k == 'c': args.append('class' + str(r.u30()))
                elif k == 'L':
                    r.s24(); c = r.u30(); [r.s24() for _ in range(c + 1)]; args.append('cases%d' % (c + 1))
            if name in ('debugline', 'debugfile', 'debug'): continue
            out.append(name + (' ' + ' '.join(args) if args else ''))
        return out

    def classes(s):
        """{class full name: {member: (kind, normalised code hash or type, code lines)}}"""
        res = {}
        for i, ins in enumerate(s.inst):
            cn = s.mname(ins['name']); mem = {}
            def add(key, kind, m):
                lines = s.disasm(m) if kind in ('method', 'get', 'set', 'init', 'cinit', 'function') else []
                sig = ','.join(s.mname(x) for x in s.methods[m]['params']) + '->' + s.mname(s.methods[m]['ret']) if lines or kind in ('method', 'get', 'set', 'init') else ''
                mem[key] = (kind, sig, lines)
            add('<constructor>', 'init', ins['iinit']); add('<static init>', 'cinit', s.cls[i]['cinit'])
            for kind, nm, x in ins['traits']:
                if kind in ('method', 'get', 'set'): add(kind + ' ' + s.mname(nm), kind, x)
                else: mem[kind + ' ' + s.mname(nm)] = (kind, s.mname(x) if kind != 'class' else '', [])
            for kind, nm, x in s.cls[i]['traits']:
                if kind in ('method', 'get', 'set'): add('static ' + kind + ' ' + s.mname(nm), kind, x)
                else: mem['static ' + kind + ' ' + s.mname(nm)] = (kind, s.mname(x) if kind != 'class' else '', [])
            res[cn] = {'super': s.mname(ins['super']), 'members': mem}
        return res


def read_gfx(b):
    tags = swf_tags(b); abcs = []; symbols = []; counts = {}
    for code, d in tags:
        counts[code] = counts.get(code, 0) + 1
        if code == 82:
            r = R(d); r.p = 4
            while d[r.p]: r.p += 1
            abcs.append(ABC(d[r.p + 1:]))
        elif code == 72: abcs.append(ABC(d))
        elif code in (76, 56):
            r = R(d); n = r.u16()
            for _ in range(n):
                r.u16(); e = d.index(b'\0', r.p); symbols.append(d[r.p:e].decode('utf8', 'replace')); r.p = e + 1
    return tags, abcs, symbols, counts
