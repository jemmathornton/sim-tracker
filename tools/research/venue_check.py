"""Venue lots against their lot type's required objects (6 Nov): the game's own lists, as Build mode's venue info shows them.

    python tools/research/venue_check.py ["save name"]     default: her newest "Building" save

Each lot type's required objects come from the game's venue tuning (min_number, is_optional, and the catalog tags an
object needs). Objects are matched by the tags in their catalog entries (COBJ); only the tags the venue lists use are
cached, in research/data/venue-object-tags.json (rebuilt when missing; delete it after a game update or new pack).
Can't check: restaurant dining spots (a table-and-chair pair) and pools (not objects), so those are left out.
Saves are read from a temporary copy. Report only.
"""
import collections, glob, json, os, shutil, struct, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T
from common import ROOT

P = '.EA.Sims4.Persistence.'
CACHE = os.path.join(ROOT, 'research', 'data', 'venue-object-tags.json')
UNCHECKABLE = {"Dining Spot", "Pools"}   # a table-and-chair pair; pools aren't objects


def tuning():
    """(tag number -> name, {venue name: [(object name, min, optional, tag names)]})."""
    en = s4.english(); tags, ven = {}, {}
    for p, root in T.trees():
        merged = {}
        if root[2] and root[2][0][0] == 'g' and root[2][0][1].get('s') == 'merged':
            merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]}
        stack = [root]
        while stack:
            x = stack.pop()
            if x[0] == 'M' and x[1].get('n') == 'tag':
                for c in x[2]:
                    if c[0] == 'C' and c[1].get('n') == 'Tag':
                        for L in c[2]:
                            for t in L[2]:
                                if t[1].get('ev') and t[2]: tags[int(t[1]['ev'])] = t[2][0][0]
            elif x[0] == 'I' and x[1].get('c') == 'Venue':
                t = T.resolve(x, merged); f = {c[1].get('n'): c for c in t[2] if isinstance(c, list)}
                dn = f.get('display_name'); name = en.get(int(dn[2][0][0], 16)) if dn and dn[2] else x[1].get('n')
                req = []
                for u in (f.get('required_objects') or [None, None, []])[2]:
                    g = {c[1].get('n'): c for c in u[2] if isinstance(c, list)}
                    num = g.get('min_number') or g.get('number'); num = int(num[2][0][0]) if num else 1
                    opt = 'is_optional' in g and g['is_optional'][2][0][0] == 'True'
                    on = g.get('object_display_name'); on = en.get(int(on[2][0][0], 16)) if on else '?'
                    ts = set()
                    def walk(y):
                        for c in y[2]:
                            if isinstance(c, list):
                                if c[0] == 'E' and c[2]: ts.add(c[2][0][0])
                                walk(c)
                    if 'object' in g: walk(g['object'])
                    req.append((on, num, opt, sorted(ts)))
                ven[name] = req
            else: stack.extend(k for k in x[2] if isinstance(k, (list, tuple)) and len(k) == 3 and k[2])
    return tags, ven


def catalog_tags(b, tags):
    """A catalog entry's tag list: a uint32 count, then that many tag numbers (uint16 in older entries, uint32 in newer),
    followed by the selling-point count; the longest such run."""
    best = None
    for w, ch in ((2, 'H'), (4, 'I')):
        for off in range(20, len(b) - 6):
            n, = struct.unpack_from('<I', b, off)
            if not 1 <= n <= 80 or off + 4 + w * n + 4 > len(b): continue
            vals = struct.unpack_from(f'<{n}{ch}', b, off + 4)
            if not all(v in tags for v in vals) or len(set(vals)) != n: continue
            sp, = struct.unpack_from('<I', b, off + 4 + w * n)
            if sp <= 20 and (not best or n > len(best)): best = [tags[v] for v in vals]
    return best or []


def object_tags(tags, wanted):
    if os.path.exists(CACHE): return {int(k): set(v) for k, v in json.load(open(CACHE, encoding='utf-8')).items()}
    out = {}
    for p in sorted(glob.glob(os.path.join(s4.GAME, '**', '*.package'), recursive=True)):
        try: ix = s4.index(p)
        except Exception: continue
        for e in ix:
            if e[0] != 0x319E4F1D: continue
            try: t = set(catalog_tags(s4.read(p, e), tags)) & wanted
            except Exception: continue
            if t: out[e[2]] = sorted(set(out.get(e[2], [])) | t)   # later packages (patches) add to earlier ones
    json.dump({str(k): v for k, v in out.items()}, open(CACHE, 'w', encoding='utf-8'))
    return {k: set(v) for k, v in out.items()}


def main():
    want = sys.argv[1] if len(sys.argv) > 1 else 'Building'
    tags, ven = tuning()
    otags = object_tags(tags, {t for r in ven.values() for x in r for t in x[3]})
    S = s4.save_schema(); f = None
    for p in sorted(glob.glob(os.path.join(s4.SAVES, '*.save')), key=os.path.getmtime, reverse=True):
        try: n = s4.save_name(s4.read_save(p), S)
        except Exception: continue
        if (n[1] or n[0]).startswith(want) and n[0] != 'Autosave': f = p; break
    if not f: sys.exit(f'No save called "{want}…"')
    tmp = tempfile.mkdtemp(); c = os.path.join(tmp, 's'); shutil.copy(f, c)
    try:
        ix = s4.index(c); data = s4.read(c, next(e for e in ix if e[0] == s4.SAVEGAME))
        objs = collections.defaultdict(list)
        for e in ix:
            if e[0] != 0x6: continue
            d = s4.decode(s4.read(c, e), P + 'ZoneObjectData', S, depth=3)
            ol = d.get('objects'); ol = ol if isinstance(ol, list) else [ol]
            objs[e[2]] += [ob.get('guid') for x in ol if isinstance(x, dict) for ob in (x.get('objects') or []) if isinstance(ob, dict)]
        import new_save_check as N
        _, zones, _, _ = N.read(os.path.basename(f))
    finally: shutil.rmtree(tmp, ignore_errors=True)
    print(f"{os.path.basename(f)}: venue lots against their required objects\n")
    rows = []
    for zid, z in zones.items():
        v = z.get('venue'); req = [r for r in ven.get(v) or [] if not r[2] and r[0] not in UNCHECKABLE]
        if not req or z['plex'] not in (0, 300) or not objs.get(zid): continue   # empty lots are left out
        have = [otags.get(g, set()) for g in objs[zid]]
        miss = [f"{on} ({sum(1 for t in have if t & set(ts))} of {num})" for on, num, opt, ts in req if sum(1 for t in have if t & set(ts)) < num]
        rows.append((z['world'], z['name'], v, miss))
    for w, n, v, m in sorted(rows): print(f"{w} | {n} | {v} | " + ('all there' if not m else 'missing: ' + '; '.join(m)))
    print(f"\n{sum(1 for r in rows if not r[3])} of {len(rows)} complete. Not checked: {', '.join(sorted(UNCHECKABLE))}.")


if __name__ == '__main__':
    main()
