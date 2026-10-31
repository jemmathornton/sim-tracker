"""Mods that carry old copies of EA tuning, brought up to date by adding back only what EA has added since (31 Oct 2026,
overnight, her ask to check every mod after patch 1.129). Writes JemmaPatch copies to for-jemma/mods/; installs nothing.

Each mod keeps its own changes. For each file it replaces, EA's current version is compared with the mod's and only
the additions listed in RULES are copied in (new list items, new fields): EA's later special-NPC exclusions, its
Innisgreen fairy filter, its newer date situations and so on. Everything the mod changed or removed on purpose stays as
the mod has it. See research/mods-vs-game.md for what each mod lacks.

    python tools/research/patch_additive.py            (all mods in RULES; prints what was added)

Rerun after a game update. Reads the mods from temporary copies.
"""
import collections, copy, glob, os, re, shutil, sys, tempfile
import xml.etree.ElementTree as ET
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4, tuning as T
from patch_cbx_ravenwood import write_dbpf, TAGS
from mods_vs_game import MODS, xml_of, leaf, canon, item_key, key
from xml.sax.saxutils import escape, quoteattr

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'for-jemma', 'mods')

# mod file (glob under Mods) -> {EA instance id: path pattern of the additions to take}
RULES = {
    'Other/Zerbu - High School Spawn Fix.package': {                       # EA's later special-NPC exclusions only
        280516: r'trait_blacklist/traits\[\]$', 303766: r'trait_blacklist/traits\[\]$'},
    # Left out (31 Oct): the ThrifTea browsers lack EA's Innisgreen no-fairies filter, and SimDa's holiday date goal lacks EA's
    # newer date situations, but both come from packs she doesn't own (Enchanted by Nature, Lovestruck). If she gets them:
    # 'Other/Enkidu_noThrifTeaOutfits_v0.6_JemmaPatch-1.129.package': {i: r'^/zone_modifier_based_filter_terms\[\]$' for i in
    #     (280656, 280658, 280661, 280667, 280676, 280677)},
    # 'LittleMsSam/LittleMsSam_SimDaDatingApp_HolidayTraditionGoal_GoOnDate.package': {181869: r'situation_whitelist/enabled\[\]$'},
    'Other/MizoreYukii_MermaidsCanUseDockLadders.package': {               # EA's rule for Sims carrying infants / with wings
        i: r'^/carry_back_compatibility_override$' for i in (210848, 212469, 212470, 212471)},
    'LittleMsSam/LittleMsSam_RBF_PetToPetGreetingFix.package': {
        164324: r'^/(_affordance_key_override_for_autonomy|interaction_category_tags\[\])$',
        165492: r'^/loot_actions\[\]$:relationship_bits_lock'},
    'LittleMsSam/LittleMsSam_ChooseYourHelmet.package': {209143: r'^/compatible_walkstyles\[\]$'},
    'LittleMsSam/LittleMsSam_RBF_WeatherNPCDeathFix100%.package': {         # EA's newer exclusion (ballroom dancing)
        188432: r'^/test_globals\[\]$:buff', 189073: r'^/test_globals\[\]$:buff'},
    'Other/adeepindigo_smallmods_HSYTweaks_MoreDiscipline.package': {     # EA's newer drop-out chances and exclusions
        284106: r'(chance/multipliers\[\]|/blacklist\[\])$'},
}


def accepts(rule, path, node):
    pat, _, variant = rule.partition(':')
    if not re.search(pat, path): return False
    return not variant or (node[0] == 'V' and node[1].get('t') == variant)


def merge(m, e, path, rule, log):
    """Copy into the mod's node m the parts of EA's node e that the rule accepts and m lacks. Changes m in place."""
    if leaf(m) or leaf(e) or m[1].get('t', '') != e[1].get('t', ''): return
    if m[0] == 'L':
        ca = collections.Counter(canon(k) for k in m[2]); cb = collections.Counter(canon(k) for k in e[2])
        ea_only = [k for k in e[2] if canon(k) in (cb - ca)]; mod_only = [k for k in m[2] if canon(k) in (ca - cb)]
        pairs, left = [], []
        km = collections.defaultdict(list)
        for k in mod_only: km[item_key(k)].append(k)
        for k in ea_only:
            ik = item_key(k)
            if ik and len(km.get(ik, [])) == 1 and sum(1 for x in ea_only if item_key(x) == ik) == 1: pairs.append((km.pop(ik)[0], k, ik))
            else: left.append(k)
        rest = [k for v in km.values() for k in v]
        if len(left) == 1 and len(rest) == 1 and left[0][0] == rest[0][0] and not leaf(left[0]):   # one changed item each side
            pairs.append((rest[0], left.pop(), '*'))
        for a, b, ik in pairs: merge(a, b, path + '[%s]' % ik, rule, log)
        for k in left:
            if accepts(rule, path + '[]', k):
                m[2].append(copy.deepcopy(k)); log.append(path + '[] + ' + canon(k)[:120])
        return
    km = {key(k, i): k for i, k in enumerate(m[2])}; ke = {key(k, i): k for i, k in enumerate(e[2])}
    for k, v in ke.items():
        if k not in km:
            if accepts(rule, path + '/' + k, v):
                m[2].append(copy.deepcopy(v)); log.append(path + '/' + k + ' + ' + canon(v)[:120])
        else: merge(km[k], v, path + '/' + k, rule, log)


def ser(n, ind=0):
    tag, at, kids = n
    a = ''.join(f' {k}={quoteattr(v)}' for k, v in at.items()); pad = '  ' * ind
    if not kids: return f'{pad}<{tag}{a} />'
    if len(kids) == 1 and not kids[0][1] and not kids[0][2] and kids[0][0] not in TAGS: return f'{pad}<{tag}{a}>{escape(kids[0][0])}</{tag}>'
    return f'{pad}<{tag}{a}>\n' + '\n'.join(ser(k, ind + 1) for k in kids) + f'\n{pad}</{tag}>'


def main():
    ids = {i for r in RULES.values() for i in r}
    ea = T.Tuning(set()); ea.inst = {}
    for p, root in T.trees():                      # EA's current version of each file we touch
        merged = {}
        if root[2] and root[2][0][0] == 'g' and root[2][0][1].get('s') == 'merged':
            merged = {k[1]['x']: k for k in root[2][0][2] if 'x' in k[1]}
        stack = [root]
        while stack:
            n = stack.pop()
            if n[0] == 'I' and n[1].get('s', '').isdigit() and int(n[1]['s']) in ids: ea.inst[int(n[1]['s'])] = T.resolve(n, merged)
            else: stack.extend(k for k in n[2] if k[2])
    for rel, rules in RULES.items():
        src = os.path.join(MODS, rel)
        if not os.path.exists(src): src = src[:-8] + '_JemmaPatch-1.129.package'    # installed 31 Oct: rerun on the patched copy
        if not os.path.exists(src): print('not installed:', rel); continue
        tmp = os.path.join(tempfile.mkdtemp(), 'mod.package'); shutil.copy(src, tmp)
        entries, changed = [], 0
        for e in s4.index(tmp):
            d = s4.read(tmp, e); t = xml_of(d)
            if t and t[0] == 'I' and t[1].get('s', '').isdigit() and int(t[1]['s']) in rules and int(t[1]['s']) in ea.inst:
                log = []; merge(t, ea.inst[int(t[1]['s'])], '', rules[int(t[1]['s'])], log)
                if log:
                    x = '<?xml version="1.0" encoding="utf-8"?>\n' + ser(t) + '\n<!-- JemmaPatch-1.129: EA\'s later additions copied in (tools/research/patch_additive.py) -->\n'
                    ET.fromstring(x.split('\n', 1)[1].rsplit('<!--', 1)[0]); d = x.encode('utf-8'); changed += 1
                    print(rel, t[1].get('n')); [print('   ', l) for l in log]
            entries.append(((e[0], e[1], e[2]), d))
        if changed:
            name = os.path.basename(rel)
            if 'JemmaPatch' not in name: name = name[:-8] + '_JemmaPatch-1.129.package'
            write_dbpf(os.path.join(OUT, name), entries)
            print('  wrote', name, '(%d of %d resources changed)' % (changed, len(entries)))
        else: print('nothing to add:', rel)


if __name__ == '__main__':
    main()
