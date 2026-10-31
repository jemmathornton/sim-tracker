"""Read Python 3.7 .pyc files (the game's and script mods') without running them: a small marshal reader and an
instruction walker, enough to list imports, names defined, and attributes used (30 Oct 2026: checking script mods
against patch 1.129). Only reads."""
import struct


class Code:
    __slots__ = ('argcount', 'kwonly', 'nlocals', 'stack', 'flags', 'code', 'consts', 'names', 'varnames',
                 'freevars', 'cellvars', 'filename', 'name', 'firstlineno', 'lnotab')


class M:
    def __init__(s, b): s.b, s.p, s.refs = b, 0, []
    def i32(s): v, = struct.unpack_from('<i', s.b, s.p); s.p += 4; return v
    def obj(s):
        c = s.b[s.p]; s.p += 1; flag = c & 0x80; t = chr(c & 0x7F)
        idx = None
        if flag and t in '([{<>c':
            idx = len(s.refs); s.refs.append(None)
        v = s._obj(t, idx)
        if flag:
            if idx is None: s.refs.append(v)
            else: s.refs[idx] = v
        return v
    def _obj(s, t, idx):
        if t == '0': return None
        if t == 'N': return None
        if t == 'F': return False
        if t == 'T': return True
        if t in 'S.': return t
        if t == 'i': return s.i32()
        if t == 'l':
            n = s.i32(); v = 0
            for k in range(abs(n)):
                d, = struct.unpack_from('<H', s.b, s.p); s.p += 2; v |= d << (15 * k)
            return -v if n < 0 else v
        if t == 'g': v, = struct.unpack_from('<d', s.b, s.p); s.p += 8; return v
        if t == 'y': s.p += 16; return 0j
        if t in 'stuaA':
            n = s.i32(); v = s.b[s.p:s.p + n]; s.p += n
            return v if t == 's' else v.decode('utf8', 'surrogatepass')
        if t in 'zZ':
            n = s.b[s.p]; s.p += 1; v = s.b[s.p:s.p + n].decode('latin1'); s.p += n; return v
        if t == 'r': n = s.i32(); return s.refs[n]
        if t == ')':
            n = s.b[s.p]; s.p += 1; return tuple(s.obj() for _ in range(n))
        if t in '([<>':
            n = s.i32(); v = [s.obj() for _ in range(n)]
            return tuple(v) if t == '(' else v
        if t == '{':
            d = {}
            while True:
                k = s.obj()
                if k is None and s.b[s.p - 1] in (0x30,): break
                d[k] = s.obj()
            return d
        if t == 'c':
            co = Code()
            co.argcount, co.kwonly, co.nlocals, co.stack, co.flags = (s.i32() for _ in range(5))
            co.code = s.obj(); co.consts = s.obj(); co.names = s.obj(); co.varnames = s.obj()
            co.freevars = s.obj(); co.cellvars = s.obj(); co.filename = s.obj(); co.name = s.obj()
            co.firstlineno = s.i32(); co.lnotab = s.obj()
            return co
        raise ValueError('marshal type %r at %d' % (t, s.p))


def load(pyc):
    return M(pyc[16:]).obj()


def instrs(co):
    b = co.code; ext = 0
    for i in range(0, len(b), 2):
        op, arg = b[i], b[i + 1] | ext
        if op == 144: ext = arg << 8; continue
        ext = 0; yield op, arg


def walk(co):
    yield co
    for c in co.consts:
        if isinstance(c, Code): yield from walk(c)
