"""The game's tuning (its settings for worlds, streets, festivals, weather...), read from its combined tuning files.

Combined tuning (type 0x62E94D38) comes as plain XML in full builds and as packed XML ("DATA") in deltas and the
preload. Both become [tag, attributes, children] trees. Instances are <I c="Class" n="name" s="id">; values that
repeat are stored once under <g s="merged"> and referred to with x="<index>".
"""
import glob, os, re, struct, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4

COMBINED = 0x62E94D38
sys.setrecursionlimit(20000)


def packed_tree(b):
    def rel(pos):
        v, = struct.unpack_from('<i', b, pos); return None if v == -0x80000000 else pos + v
    def u32(pos): return struct.unpack_from('<I', b, pos)[0]
    def cstr(pos): return None if pos is None else b[pos:b.index(b'\0', pos)].decode('utf-8', 'replace')
    tho = rel(8); doc = rel(tho + 20)
    top = rel(doc + 4); st_off = rel(doc + 12); st_n = u32(doc + 16)
    S = [cstr(rel(st_off + 4 * i)) for i in range(st_n)]
    def lst(p):
        out = []
        while p is not None:
            q = rel(p)
            if q is None: break
            out.append(q); p += 4
        return out
    def build(P):
        return [S[u32(P)], {S[u32(a)]: S[u32(a + 4)] for a in lst(rel(P + 4))}, [build(c) for c in lst(rel(P + 8))]]
    return build(top)


def text_tree(b):
    import xml.etree.ElementTree as ET
    def conv(e):
        kids = [conv(k) for k in e]
        if e.text and e.text.strip() and not kids: kids = [[e.text.strip(), {}, []]]
        return [e.tag, dict(e.attrib), kids]
    return conv(ET.fromstring(b))


def trees():
    """(package, tree) for every combined tuning resource; full builds first, deltas and preload last."""
    ps = sorted(set(glob.glob(os.path.join(s4.GAME, '**', 'Simulation*.package'), recursive=True)), key=lambda p: ('Delta' in p, 'Preload' in p, p))
    for p in ps:
        for e in s4.index(p):
            if e[0] != COMBINED: continue
            d = s4.read(p, e)
            try: yield p, (packed_tree(d) if d[:4] == b'DATA' else text_tree(d))
            except Exception as ex: print('skipped', p, ex, file=sys.stderr)


class Tuning:
    """Instances of the wanted classes, with merged values resolved. Later packages override earlier ones by id."""
    def __init__(self, classes):
        self.inst = {}
        for p, root in trees():
            merged = {}
            if root[2] and root[2][0][0] == 'g' and root[2][0][1].get('s') == 'merged':
                merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]}
            def walk(n):
                if n[0] == 'I' and n[1].get('c') in classes:
                    self.inst[int(n[1]['s'])] = {"class": n[1]['c'], "name": n[1].get('n'), "tree": resolve(n, merged), "pack": p}
                for k in n[2]: walk(k)
            walk(root)

    def of(self, cls): return {i: v for i, v in self.inst.items() if v['class'] == cls}


def resolve(n, merged, depth=0):
    tag, at, kids = n
    if 'x' in at and not kids and at['x'] in merged and depth < 50:
        m = merged[at['x']]
        return resolve([m[0], {**{k: v for k, v in m[1].items() if k != 'x'}, **{k: v for k, v in at.items() if k != 'x'}}, m[2]], merged, depth + 1)
    return [tag, at, [resolve(k, merged, depth + 1) for k in kids]]


def field(tree, name):
    """The child with n=name."""
    return next((k for k in tree[2] if k[1].get('n') == name), None)


def value(node):
    """A leaf's text, or None."""
    if node is None: return None
    if len(node[2]) == 1 and not node[2][0][1] and not node[2][0][2]: return node[2][0][0]
    return None


def leaves(node):
    """Every leaf text under a node."""
    out = []
    def walk(n):
        v = value(n)
        if v is not None: out.append(v)
        else:
            for k in n[2]: walk(k)
    walk(node)
    return out
