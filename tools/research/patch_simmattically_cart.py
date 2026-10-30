"""SimMattically's “Remove the Cart Button” (18 Mar 2026) rebuilt on EA's current top-right Live/Buy/Build bar
(30 Oct 2026, her ask).

The mod replaces the whole of EA's game tray UI file (0xBEB822E79797F7EF) with a copy from March; its only change is
that two of the bar's methods, SetUpDLCPromoButton and UpdateStoreButtonState, hide the shop (cart) button instead of
setting it up. This takes the installed game's file and puts those same two methods in, so the rest of the bar stays
EA's current code. It checks that every other class and method is untouched and that the two new methods match the
mod's.

    python tools/research/patch_simmattically_cart.py <the mod's .package> <new .package to write>

Rerun after a game update. Reads the mod from a temporary copy; writes only the new file.
"""
import os, shutil, struct, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, swfabc
from patch_cbx_ravenwood import write_dbpf

GFX, TRAY = 0x62ECC59A, 0xBEB822E79797F7EF
PANEL = 'widgets.GameTray.controls.ControlPanel'
UI = os.path.join(s4.GAME, 'Data', 'Client', 'UI.package')


def u30(v):
    out = bytearray()
    while True:
        b = v & 0x7F; v >>= 7
        out.append(b | (0x80 if v else 0))
        if not v: return bytes(out)


def s24(v): return (v & 0xFFFFFF).to_bytes(3, 'little')


def mn_index(abc, name):
    """The multiname index EA's own ControlPanel code uses for a property name."""
    for ins in abc.inst:
        if abc.mname(ins['name']) != PANEL: continue
        for kind, nm, x in ins['traits']:
            if kind not in ('method', 'get', 'set'): continue
            for op, args in abc.raw_ops(x):
                if op in ('getproperty', 'setproperty', 'initproperty') and abc.mname(args[0]) == name: return args[0]
    raise KeyError(name)


def hide_code(abc, with_flag):
    """The mod's method body: [mbStoreEnabled = false;] if (mBtnStore) {visible = enabled = false}; if (container) visible = false."""
    m = {n: u30(mn_index(abc, n)) for n in ('mbStoreEnabled', 'mBtnStore', 'mcStoreButtonContainer', 'visible', 'enabled')}
    get = lambda n: b'\xD0\x66' + m[n]                       # getlocal_0; getproperty n
    off = lambda n, p: get(n) + b'\x27\x61' + m[p]           # ...; pushfalse; setproperty p
    btn = off('mBtnStore', 'visible') + off('mBtnStore', 'enabled')
    box = off('mcStoreButtonContainer', 'visible')
    code = b'\xD0\x30'                                        # getlocal_0; pushscope
    if with_flag: code += b'\xD0\x27\x61' + m['mbStoreEnabled']
    code += get('mBtnStore') + b'\x12' + s24(len(btn)) + btn  # iffalse past the button lines
    code += get('mcStoreButtonContainer') + b'\x12' + s24(len(box)) + box
    return code + b'\x47'                                     # returnvoid


def patch_abc(data):
    abc = swfabc.ABC(data); edits = []
    for member, flag in (('SetUpDLCPromoButton', True), ('UpdateStoreButtonState', False)):
        mi = abc.method_of(PANEL, member)
        start, cstart, cend, exc = abc.body_at[mi]; assert exc == 0, member
        r = swfabc.R(data, start); stack, local, init, maxs = r.u30(), r.u30(), r.u30(), r.u30()
        code = hide_code(abc, flag)
        edits.append((start, cend, u30(max(stack, 2)) + u30(local) + u30(init) + u30(maxs) + u30(len(code)) + code))
    for start, end, new in sorted(edits, reverse=True): data = data[:start] + new + data[end:]
    return data


def patch_gfx(b):
    assert b[:3] == b'GFX', b[:3]
    head, spans = swfabc.tag_spans(b); out = bytearray(b[:head]); done = 0
    for code, h, d, e in spans:
        if code == 82:
            z = b.index(b'\0', d + 4) + 1
            data = b[d:z] + patch_abc(b[z:e]); done += 1
            out += struct.pack('<HI', (82 << 6) | 0x3F, len(data)) + data
        else: out += b[h:e]
    assert done == 1
    struct.pack_into('<I', out, 4, len(out))
    return bytes(out)


def classes(b):
    cl = {}
    for a in swfabc.read_gfx(b)[1]: cl.update(a.classes())
    return cl


def main(src, dest):
    tmp = os.path.join(tempfile.mkdtemp(), 'mod.package'); shutil.copy(src, tmp)
    mod = [e for e in s4.index(tmp)]
    assert [(e[0], e[2]) for e in mod] == [(GFX, TRAY)], 'the mod has changed: look at it again'
    game_e = [e for e in s4.index(UI) if e[0] == GFX and e[2] == TRAY][0]
    game = s4.read(UI, game_e); new = patch_gfx(game)
    g, n, m = classes(game), classes(new), classes(s4.read(tmp, mod[0]))
    assert set(g) == set(n)
    changed = [(c, x) for c in g for x in g[c]['members'] if g[c]['members'][x] != n[c]['members'].get(x)]
    want = [(PANEL, 'method SetUpDLCPromoButton'), (PANEL, 'method UpdateStoreButtonState')]
    assert sorted(changed) == sorted(want), changed
    for c, x in want: assert n[c]['members'][x][2] == m[c]['members'][x][2], x   # same instructions as the mod's
    write_dbpf(dest, [((GFX, game_e[1], TRAY), new)])
    print('wrote', dest, len(new), 'bytes; EA file', len(game), 'bytes; changed only', [x for _, x in changed])


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
