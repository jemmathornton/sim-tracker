"""The relationships Premade Sim and Relationship Overhaul sets up between premade Sims (31 Oct 2026, overnight, for her
premade-fix decision). Report only.

The mod's PremadeSimRelationshipsInjections snippet lists pairs of Sim templates, each with a setup loot; this reads every
pair (a Sim paired with itself is a one-Sim fix-up and is left out) and names the relationship bits and track changes
its loot applies, using the mod's own names and the game's.

    python tools/research/premade_overhaul_links.py <folder with the mod's unzipped .package files>

Writes research/premade-overhaul-links.md.
"""
import glob, os, re, sys
import xml.etree.ElementTree as ET
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
OUT = os.path.join(ROOT, 'research', 'premade-overhaul-links.md')


def pretty(n):
    n = re.sub(r'^(Kayaker: )?(premadeSimTemplate_|simTemplate_|loot_PremadesSetup_)', '', (n or '').strip())
    n = re.sub(r'^(BG|EP\d+|GP\d+)_(WillowCreek_|OasisSprings_|Windenburg_|NewcrestWorld_)?', '', n)
    return n


def main(folder):
    xml, names = {}, {}
    for p in glob.glob(os.path.join(folder, '*.package')):
        if 'GP04' in p: continue
        for e in s4.index(p):
            d = s4.read(p, e)
            if d.lstrip()[:5] != b'<?xml': continue
            x = d.decode('utf-8'); m = re.search(r'<I [^>]*n="([^"]*)" s="(\d+)"', x)
            if m: xml[int(m.group(2))] = x; names[int(m.group(2))] = m.group(1)
    ea = {}
    for p, root in T.trees():
        stack = [root]
        while stack:
            n = stack.pop()
            if n[0] == 'I' and n[1].get('s', '').isdigit(): ea[int(n[1]['s'])] = n[1].get('n')
            else: stack.extend(k for k in n[2] if k[2])
    name = lambda i: names.get(i) or ea.get(i) or str(i)
    snippet = next(x for x in xml.values() if 'c="PremadeSimRelationshipsInjections"' in x)
    pairs = re.findall(r'<T n="relationship_loot">(\d+)[^<]*(?:<!--[^>]*-->)?</T>\s*<T n="sim_a">(\d+)[^<]*(?:<!--[^>]*-->)?</T>\s*<T n="sim_b">(\d+)', snippet)
    rows = []
    for loot, a, b in pairs:
        if a == b: continue
        x = xml.get(int(loot), '')
        bits = [pretty(name(int(i))) for i in re.findall(r'<T n="(?:bit|relationship_bit)">(\d+)', x)]
        bits += [pretty(name(int(i))) for i in re.findall(r'<T>(\d+)<!--[^>]*(?:Bit|bit|romantic|family|friendship|Sentiment)[^>]*-->', x)]
        tracks = re.findall(r'<T n="(?:stat|track)">(\d+)[^<]*(?:<!--([^>]*)-->)?</T>\s*(?:<T n="(?:amount|value)">(-?[\d.]+)</T>)?', x)
        tr = ['%s %s' % (re.sub(r'^LTR_|_Main$', '', (c or name(int(t))).strip()), v) for t, c, v in tracks if v]
        rows.append((pretty(name(int(a))), pretty(name(int(b))), sorted(set(bits)), tr))
    L = ['# Relationships the Premade Sim and Relationship Overhaul sets up (v2.10, EA Remake)', '',
         'Made by tools/research/premade_overhaul_links.py from the mod\'s relationship list: %d pairs of premade Sims, each with what its setup applies (relationship bits; friendship and romance changes where given). Names are the mod\'s and the game\'s internal ones.' % len(rows), '']
    for a, b, bits, tr in sorted(rows):
        L.append('- **%s** and **%s**: %s' % (a, b, '; '.join(x for x in [', '.join(bits), ', '.join(tr)] if x) or 'see its loot'))
    open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    print('wrote', OUT, len(rows), 'pairs')


if __name__ == '__main__':
    main(sys.argv[1])
