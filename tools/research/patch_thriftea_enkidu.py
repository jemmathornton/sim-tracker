"""alasEnkidu's “Wear normal outfits at ThrifTea” (v0.6, Mar 2025) with its two general Sim filters rebuilt on EA's
current versions (30 Oct 2026, her ask).

The mod replaces EA's filter_ages_tyae_InCompatibleRegion and filter_ages_YoungAdult_Elder_NotBusy (used across the game,
not only at ThrifTea) with copies from before EA added servos, the Master Herbalist, reborn ghosts and the newer packs'
special NPCs to their never-pick lists. This keeps every other file of the mod as it is and rebuilds those two from the
installed game's filters plus the mod's own additions (six more special NPCs; the Grim Reaper rule).

    python tools/research/patch_thriftea_enkidu.py <the mod's .package> <new .package to write>

Rerun after a game update. Reads the mod from a temporary copy; writes only the new file.
"""
import os, re, shutil, sys, tempfile
import xml.etree.ElementTree as ET
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T
from patch_cbx_ravenwood import write_dbpf, TAGS
from xml.sax.saxutils import escape, quoteattr

FILTER = 0x6E0DDA9F


def ser(n, ind=0):
    tag, at, kids = n
    a = ''.join(f' {k}={quoteattr(v)}' for k, v in at.items()); pad = '  ' * ind
    if not kids: return f'{pad}<{tag}{a} />'
    if len(kids) == 1 and not kids[0][1] and not kids[0][2] and kids[0][0] not in TAGS: return f'{pad}<{tag}{a}>{escape(kids[0][0])}</{tag}>'
    return f'{pad}<{tag}{a}>\n' + '\n'.join(ser(k, ind + 1) for k in kids) + f'\n{pad}</{tag}>'


def ids(x): return re.findall(r'<T>(\d+)', re.search(r'<L n="traits">(.*?)</L>', x, re.S).group(1))


def main(src, dest):
    tmp = os.path.join(tempfile.mkdtemp(), 'mod.package'); shutil.copy(src, tmp)
    tu = T.Tuning({'TunableSimFilter'}); entries = []
    for e in s4.index(tmp):
        d = s4.read(tmp, e)
        if e[0] == FILTER:
            mod = d.decode('utf-8'); ea = ser(tu.inst[e[2]]['tree'])
            extra = [i for i in ids(mod) if i not in ids(ea)]
            out = ea.replace('\n        </L>\n      </U>\n    </V>\n    <V t="sim_info_lod" />',
                             ''.join(f'\n          <T>{i}</T>' for i in extra) + '\n        </L>\n      </U>\n    </V>\n    <V t="sim_info_lod" />', 1)
            assert set(ids(mod)) | set(ids(ea)) <= set(ids(out)), 'trait list not merged'
            if 'n="trait">16851' in mod and 'n="trait">16851' not in out:   # the mod's Grim Reaper rule
                out = out.replace('\n  </L>\n  <V t="enabled" n="_household_templates_override">',
                                  '\n    <V t="trait">\n      <U n="trait">\n        <T n="invert_score">True</T>\n        <T n="trait">16851</T>\n      </U>\n    </V>\n  </L>\n  <V t="enabled" n="_household_templates_override">', 1)
                assert 'n="trait">16851' in out
            ET.fromstring(out)
            print(f'{tu.inst[e[2]]["name"]}: EA never-pick list {len(ids(ea))} + the mod\'s {len(extra)} -> {len(ids(out))}')
            d = (out + '\n<!-- Mod name: noThrifTeaOutfits by Enkidu, Version: v0.6; filters rebuilt on EA\'s current ones -->').encode('utf-8')
        entries.append(((e[0], e[1], e[2]), d))
    write_dbpf(dest, entries)
    for e in s4.index(dest):
        if e[0] in (FILTER,): ET.fromstring(s4.read(dest, e))
    print(f'wrote {dest}: {len(entries)} resources')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
