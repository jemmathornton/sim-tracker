"""CBXSims' “Life & Death & Seasons” (V2, Dec 2024) rebuilt on EA's current Ravenwood region file (30 Oct 2026, her ask).

The mod swaps in its own copy of Ravenwood's whole region file, from before Businesses & Hobbies, Adventure Awaits and
Royalty & Legacy, so with it Ravenwood loses five lot types (Small Business, Playground, Custom Venue, Backroom,
Dambele Market), fishing and decree buffs. This takes EA's region file from the installed game and applies only the
mod's season changes: seasonal_parameters (leaves change colour and fall, flowers), snow that settles in winter, and
the mod's winter forecast (plus its two own snippets). The mod's copies of other EA files (Willow Creek forecasts,
snow tests, the region's SimData) are left out, so EA's current ones are used.

    python tools/research/patch_cbx_ravenwood.py <the mod's .package> <new .package to write>

Rerun after a game update that changes Ravenwood. Reads the mod from a temporary copy; writes only the new file.
"""
import os, re, shutil, struct, sys, tempfile
import xml.etree.ElementTree as ET
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T

REGION, CBX_FORECASTS, CBX_SEASONAL = 0x5AF47, 0xF8694D19DCA43702, 0xDC43B6D016BF8558
TAGS = {'I', 'U', 'L', 'T', 'E', 'V', 'M', 'C', 'g'}


def ea_region_xml():
    """EA's Ravenwood region tuning from the game's combined tuning, written out as tuning XML."""
    from xml.sax.saxutils import escape, quoteattr
    def ser(n, ind=0):
        tag, at, kids = n
        a = ''.join(f' {k}={quoteattr(v)}' for k, v in at.items()); pad = '  ' * ind
        if not kids: return f'{pad}<{tag}{a} />'
        if len(kids) == 1 and not kids[0][1] and not kids[0][2] and kids[0][0] not in TAGS: return f'{pad}<{tag}{a}>{escape(kids[0][0])}</{tag}>'
        return f'{pad}<{tag}{a}>\n' + '\n'.join(ser(k, ind + 1) for k in kids) + f'\n{pad}</{tag}>'
    return '<?xml version="1.0" encoding="utf-8"?>\n' + ser(T.Tuning({'Region'}).inst[REGION]['tree'])


def block(xml, name):
    m = re.search(r'\n  <L n="%s">.*?\n  </L>' % re.escape(name), xml, re.S); assert m, name
    return m.group(0)


def write_dbpf(path, entries):
    body = bytearray(); idx = bytearray(struct.pack('<I', 0)); off = 96
    for (t, g, i), data in entries:
        idx += struct.pack('<IIIIIIIHH', t, g, i >> 32, i & 0xFFFFFFFF, off + len(body), len(data) | 0x80000000, len(data), 0, 1)
        body += data
    head = bytearray(96); head[0:4] = b'DBPF'
    struct.pack_into('<II', head, 4, 2, 1); struct.pack_into('<I', head, 36, len(entries)); struct.pack_into('<I', head, 44, len(idx))
    struct.pack_into('<I', head, 60, 3); struct.pack_into('<I', head, 64, 96 + len(body))
    open(path, 'wb').write(bytes(head + body + idx))


def main(src, dest):
    tmp = os.path.join(tempfile.mkdtemp(), 'mod.package'); shutil.copy(src, tmp)
    got = {(e[0], e[2]): (e, s4.read(tmp, e)) for e in s4.index(tmp)}
    mod = got[(0x51E7A18D, REGION)][1].decode('utf-8'); ea = ea_region_xml()
    out = ea.replace(block(ea, 'seasonal_parameters'), block(mod, 'seasonal_parameters'))
    snow = block(ea, 'snow_behavior'); out = out.replace(snow, snow.replace('NO_SNOW', 'ACCUMULATE'))
    winter = re.search(r'<E n="key">WINTER</E>\s*<T n="value">(\d+)', block(mod, 'weather')).group(1)
    w = block(ea, 'weather'); ea_winter = re.search(r'<E n="key">WINTER</E>\s*<T n="value">(\d+)', w).group(1)
    out = out.replace(w, w.replace(f'<T n="value">{ea_winter}</T>', f'<T n="value">{winter}</T>'))
    ET.fromstring(out.encode('utf-8'))
    entries = [((0x51E7A18D, got[(0x51E7A18D, REGION)][0][1], REGION), out.encode('utf-8'))]
    for inst in (CBX_FORECASTS, CBX_SEASONAL):
        e, d = got[(0x7DF2169C, inst)]; entries.append(((0x7DF2169C, e[1], inst), d))
    write_dbpf(dest, entries)
    for e in s4.index(dest): ET.fromstring(s4.read(dest, e))
    venues = len(next(c for c in ET.fromstring(out.encode()) if c.get('n') == 'compatible_venues'))
    print(f'wrote {dest}: {len(entries)} resources; Ravenwood allows {venues} lot types; snow settles in winter')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
