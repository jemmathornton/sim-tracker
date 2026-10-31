"""Her mods against the installed game (30 Oct 2026, her ask, after EA's 27 Oct patch 1.129). Report only.

For every mod in her Mods folder:
- tuning that replaces EA's own (same instance id as one of EA's): what differs from EA's current version. Things EA's
  copy has that the mod's lacks are usually what EA added after the mod was made (lost while the mod is in);
- SimData that replaces EA's: whether its columns still match EA's current ones;
- other files that replace EA's (maps, clothing, images, UI): listed;
- numbers in the mod's tuning that look like references but match nothing in the game or in any of her mods;
- script mods: every module, name and attribute they take from the game's Python that no longer exists.

    python tools/research/mods_vs_game.py            writes research/mods-vs-game.md

Reads the mods in place (they're only read) and the game's files; changes nothing else.
"""
import collections, glob, os, re, struct, sys, zipfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T, pyc37

MODS = os.path.join(os.path.expanduser('~'), 'Documents', 'Electronic Arts', 'The Sims 4', 'Mods')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'research', 'mods-vs-game.md')
SIMDATA = 0x545AC67A
TAGS = {'I', 'M', 'U', 'L', 'T', 'E', 'V', 'C', 'g'}
QUANTITIES = {'amount', 'value', '_value', 'max_duration', 'max_value_tuning', 'min_value_tuning', 'initial_value', 'cost', 'price', 'duration'}
KNOWN_TYPES = {0x00B2D882: 'image', 0x034AEECB: 'CAS part', 0x3453CF95: 'texture', 0x3C1AF1F2: 'thumbnail', 0x62ECC59A: 'UI file',
               0x220557DA: 'string table', 0x1CC04273: 'map data', 0x7FB6AD8A: 'manifest'}


# ---------- tuning trees ----------
def leaf(n): return not n[2] or (len(n[2]) == 1 and not n[2][0][1] and not n[2][0][2] and n[2][0][0] not in TAGS)
def text(n): return n[2][0][0] if n[2] else ''
def key(n, i): return n[1].get('n') or '%s#%d' % (n[0], i)


def item_key(n):
    """What identifies a list item: a mapping's key, a variant's choice, or a single leaf's own name."""
    if leaf(n): return None
    for k in n[2]:
        if k[1].get('n') == 'key' and leaf(k): return 'key=' + text(k)
    if n[0] == 'V': return 'variant=' + n[1].get('t', '')
    if len(n[2]) == 1 and n[2][0][0] == 'V': return 'variant=' + n[2][0][1].get('t', '')
    return None


def canon(n):
    if leaf(n): return '%s[%s]=%s' % (n[0], n[1].get('n', ''), text(n))
    return '%s[%s|%s](%s)' % (n[0], n[1].get('n', ''), n[1].get('t', ''), ','.join(sorted(canon(k) for k in n[2])))


def short(n, w=110):
    c = canon(n); return c if len(c) <= w else c[:w] + '…'


def diff(a, b, path, out):
    """a = the mod's node, b = EA's. out gets (kind, path, detail)."""
    if leaf(a) or leaf(b):
        if canon(a) != canon(b): out.append(('changed', path, '%s -> EA %s' % (text(a) if leaf(a) else short(a, 60), text(b) if leaf(b) else short(b, 60))))
        return
    if a[1].get('t', '') != b[1].get('t', ''):
        out.append(('changed', path, 'variant %s -> EA %s' % (a[1].get('t'), b[1].get('t')))); return
    if a[0] == 'L':
        ca = collections.Counter(canon(k) for k in a[2]); cb = collections.Counter(canon(k) for k in b[2])
        ea_only = [k for k in b[2] if canon(k) in (cb - ca)]; mod_only = [k for k in a[2] if canon(k) in (ca - cb)]
        # pair leftover items that share a key (a mapping's key, or the variant chosen) and show only what differs inside
        km = collections.defaultdict(list); left = []
        for k in mod_only: km[item_key(k)].append(k)
        for k in ea_only:
            ik = item_key(k)
            if ik and len(km.get(ik, [])) == 1 and sum(1 for x in ea_only if item_key(x) == ik) == 1:
                diff(km.pop(ik)[0], k, path + '[%s]' % ik, out)
            else: left.append(k)
        rest = [k for v in km.values() for k in v]
        if len(left) == 1 and len(rest) == 1 and left[0][0] == rest[0][0] and not leaf(left[0]):   # one changed item each side
            diff(rest.pop(), left.pop(), path + '[*]', out)
        for k in left: out.append(('EA has', path + '[]', canon(k)[:110]))
        for k in rest: out.append(('mod has', path + '[]', canon(k)[:110]))
        return
    ka = {key(k, i): k for i, k in enumerate(a[2])}; kb = {key(k, i): k for i, k in enumerate(b[2])}
    for k in kb:
        if k not in ka: out.append(('EA has', path + '/' + k, short(kb[k])))
    for k in ka:
        if k not in kb: out.append(('mod has', path + '/' + k, short(ka[k])))
        else: diff(ka[k], kb[k], path + '/' + k, out)


def mod_files():
    pk = sorted(glob.glob(os.path.join(MODS, '**', '*.package'), recursive=True))
    sc = sorted(glob.glob(os.path.join(MODS, '**', '*.ts4script'), recursive=True))
    return pk, sc


def xml_of(d):
    d = d.lstrip(b'\xef\xbb\xbf').lstrip()
    if d[:5] == b'<?xml' or d[:3] in (b'<I ', b'<M '):
        try: return T.text_tree(d)
        except Exception: return None
    return None


def main():
    pk, sc = mod_files(); rel = lambda p: os.path.relpath(p, MODS)
    # 1. what the mods hold
    res = {}; tun = []; mod_insts = set()
    for p in pk:
        ix = s4.index(p); res[p] = ix
        for e in ix:
            mod_insts.add(e[2])
            try: d = s4.read(p, e)
            except Exception as ex: print('unreadable', p, hex(e[0]), hex(e[2]), e[6], ex, file=sys.stderr); continue
            t = xml_of(d)
            if t and t[0] in ('I', 'M'): tun.append((p, e, t))
    ids = {int(t[1]['s']) for p, e, t in tun if t[0] == 'I' and t[1].get('s', '').isdigit()}
    modules = {t[1].get('n') for p, e, t in tun if t[0] == 'M'}
    print('mod tuning files', len(tun), file=sys.stderr)
    # 2. EA's combined tuning
    ea, ea_mod, ea_ids, ea_vals = {}, {}, {}, set()
    for p, root in T.trees():
        merged = {}
        if root[2] and root[2][0][0] == 'g' and root[2][0][1].get('s') == 'merged':
            merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]}
        stack = [root]
        while stack:
            n = stack.pop()
            if n[0] == 'I' and n[1].get('s', '').isdigit():
                i = int(n[1]['s']); ea_ids[i] = (n[1].get('c'), n[1].get('n'))
                if i in ids: ea[i] = T.resolve(n, merged)
            elif n[0] == 'M' and n[1].get('n') in modules: ea_mod[n[1]['n']] = T.resolve(n, merged)
            elif leaf(n) and n[2] and n[2][0][0].isdigit() and len(n[2][0][0]) >= 4: ea_vals.add(int(n[2][0][0]))
            stack.extend(k for k in n[2] if k[2] or k[1])
    print('EA tuning instances', len(ea_ids), file=sys.stderr)
    # 3. game resources with the same keys
    want = {(e[0], e[1], e[2]) for ix in res.values() for e in ix}
    game = {}
    order = sorted(glob.glob(os.path.join(s4.GAME, '**', '*.package'), recursive=True), key=lambda q: ('Delta' in q, 'Preload' in q, q))
    for gp in order:
        try: gix = s4.index(gp)
        except Exception: continue
        for e in gix:
            k = (e[0], e[1], e[2])
            if k in want: game[k] = (gp, e)          # later (delta) wins
    game_res = set()                                   # every resource id the game has of the kinds tuning points at
    for gp in order:
        try: gix = s4.index(gp)
        except Exception: continue
        game_res.update(e[2] for e in gix if e[0] in (0x034AEECB, 0xC0DB5AE7, 0x319E4F1D, 0x545AC67A))
    L = ['# Her mods against the installed game (%s)' % open(os.path.join(os.path.expanduser('~'), 'Documents', 'Electronic Arts', 'The Sims 4', 'GameVersion.txt'), 'rb').read().decode('latin1').strip('\x00\r\n ').split()[-1],
         '', 'Made by tools/research/mods_vs_game.py. “EA has” = in EA\'s current copy but not the mod\'s (usually added by EA since the mod was made; lost while the mod is in). “mod has” / “changed” = the mod\'s own changes (or things EA has since removed).', '']
    unknown_all = []
    for p in pk:
        rows = []
        mine = [(e, t) for q, e, t in tun if q == p]
        for e, t in mine:
            if t[0] == 'I' and t[1].get('s', '').isdigit() and int(t[1]['s']) in ea:
                i = int(t[1]['s']); out = []; diff(t, ea[i], '', out)
                c = collections.Counter(k for k, _, _ in out)
                rows.append('- Replaces EA\'s **%s** (%s %d): %s' % (ea_ids[i][1], ea_ids[i][0], i, ', '.join('%d %s' % (v, k) for k, v in c.items()) or 'identical to EA\'s current one'))
                for kind in ('EA has', 'changed', 'mod has'):
                    for k, pth, det in [x for x in out if x[0] == kind][:12]: rows.append('  - %s `%s`: %s' % (k, pth or '/', det.replace('`', "'")))
            elif t[0] == 'M' and t[1].get('n') in ea_mod:
                out = []; diff(t, ea_mod[t[1]['n']], '', out)
                rows.append('- Replaces EA\'s module tuning **%s**: %d differences' % (t[1]['n'], len(out)))
                for k, pth, det in out[:12]: rows.append('  - %s `%s`: %s' % (k, pth, det.replace('`', "'")))
            # references nobody has
            unk = set()
            stack = [t]
            while stack:
                n = stack.pop()
                if n[0] == 'T' and leaf(n) and text(n).isdigit() and len(text(n)) >= 5 and n[1].get('n', '') not in QUANTITIES:
                    v = int(text(n))
                    if v < 2 ** 32 and v not in ea_ids and v not in mod_insts and v not in ea_vals and v not in ids and v not in game_res:
                        unk.add((n[1].get('n', '?'), v))
                stack.extend(n[2])
            if unk:
                rows.append('- %s %s (%s): numbers that match nothing in the game or her mods: %s' % (t[1].get('c', t[0]), t[1].get('n'), t[1].get('s', ''), ', '.join('%s=%d' % x for x in sorted(unk)[:10])))
                unknown_all.append((rel(p), t[1].get('n'), sorted(unk)))
        for e in res[p]:
            k = (e[0], e[1], e[2])
            if k not in game: continue
            gp, ge = game[k]; md, gd = s4.read(p, e), s4.read(gp, ge)
            if e[0] == SIMDATA:
                def cols(b):
                    return sorted((str(n), str(s)) for n, s, r in s4.simdata(b))
                same = md == gd
                note = 'identical to EA\'s current one' if same else ('same tables as EA\'s current one, values differ' if cols(md) == cols(gd) else 'tables differ from EA\'s current one: mod %s, EA %s' % (cols(md), cols(gd)))
                if not same:
                    # column level
                    def colnames(b):
                        out = {}
                        for name, sch, rows_ in s4.simdata(b):
                            out[name or sch] = set(rows_[0]) if rows_ else set()
                        return out
                    a, g = colnames(md), colnames(gd)
                    extra = {t: sorted(g[t] - a.get(t, set())) for t in g if g[t] - a.get(t, set())}
                    if extra: note += '; EA\'s has columns the mod\'s lacks: %s' % extra
                rows.append('- SimData %s (%s): %s' % (hex(e[2]), ea_ids.get(e[2], ('', '?'))[1], note))
            else:
                kind = KNOWN_TYPES.get(e[0], hex(e[0]))
                extra = ''
                if e[0] == 0x034AEECB:
                    extra = ' (CAS part version mod %d, EA %d)' % (struct.unpack_from('<I', md, 0)[0], struct.unpack_from('<I', gd, 0)[0])
                rows.append('- Replaces EA\'s %s %s from %s%s%s' % (kind, hex(e[2]), os.path.relpath(gp, s4.GAME), extra, '' if md != gd else ' (identical)'))
        if rows: L += ['## ' + rel(p), ''] + rows + ['']
    # 4. scripts
    L += ['# Script mods', '']
    sys.argv = sys.argv[:1]
    import script_names as SN
    names = set()
    for q, e, t in tun:
        stack = [t]
        while stack:
            n = stack.pop(); names.add(n[1].get('n', '')); stack.extend(k for k in n[2] if k[1] or k[2])
    probs = SN.check_all(sc, names)
    for p in sc:
        ps = probs.get(p, [])
        L += ['## ' + rel(p), ''] + (['- ' + x for x in ps] if ps else ['- Every module, name and attribute it takes from the game still exists.']) + ['']
    open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    print('wrote', OUT, file=sys.stderr)


if __name__ == '__main__':
    main()
