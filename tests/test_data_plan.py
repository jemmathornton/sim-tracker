"""More checks that data/ hangs together (9 Nov), next to ThePlan in test_tools.py. A failure names what's out of step."""
import csv, os, re, unittest
from datetime import date
from helpers import ROOT, DATA, GALLERY, SITE, LOTS, WORLDS, UPLOADS, HOUSEHOLDS, SIMS, PEOPLE, load, slug

HEX = re.compile(r'^#[0-9a-fA-F]{6}$')
LOT_PAGES = {f"l-{ws}--{slug(l['lot'])}" for ws, W, h, l in LOTS}
LINKED = {i for ws, W, h, l in LOTS for i in l.get('gallery', []) + [v['upload'] for v in l.get('versions', [])]}
HH_LINKED = {i for W, hn, hh in HOUSEHOLDS for i in hh.get('gallery', [])}
UNLINKED = load(os.path.join(GALLERY, 'unlinked.json'))['uploads']
# partner links one Sim has and the other doesn't, where one of the two has died, so which word each side should use is
# hers to settle (15 Nov review): remove a pair from here once both sides are set
ONE_SIDED_FOR_JEMMA = {("gunther-goth", "cornelia-goth"), ("adekoya-darong", "imani-darong"), ("colin-sullivan", "xochitl-luna")}


class Worlds(unittest.TestCase):
    def test_colours(self):
        bad = [f"{W['name']}: colour {W.get('colour')}" for ws, W in WORLDS if not HEX.match(W.get('colour') or '')]
        bad += [f"{W['name']}: deep {W.get('deep')}" for ws, W in WORLDS if W['owned'] and not (isinstance(W.get('deep'), list) and len(W['deep']) == 2 and all(HEX.match(c) for c in W['deep']))]
        self.assertEqual(bad, [])

    def test_hero_position(self):
        bad = [W['name'] for ws, W in WORLDS if W['owned'] and not (isinstance(W.get('heroY'), (int, float)) and 0 <= W['heroY'] <= 100)]
        self.assertEqual(bad, [])

    def test_world_fields(self):
        bad = [f"{ws}: {k}" for ws, W in WORLDS for k in ('name', 'pack', 'owned', 'neighbourhoods') if k not in W]
        self.assertEqual(bad, [])
        self.assertEqual([ws for ws, W in WORLDS if slug(W['name']) != ws], [])

    def test_map_spots_and_boxes(self):
        bad = []
        for ws, W in WORLDS:
            for h in W['neighbourhoods']:
                s, b = h.get('mapSpot'), h.get('mapBox')
                if s is not None and not (len(s) == 2 and all(0 <= v <= 1 for v in s)): bad.append(f"{W['name']} / {h['name']}: mapSpot {s}")
                if b is not None and not (len(b) == 4 and all(0 <= v <= 1 for v in b) and b[0] < b[2] and b[1] < b[3]): bad.append(f"{W['name']} / {h['name']}: mapBox {b}")
                for k in ('bannerShift', 'cardShift'):
                    if h.get(k) is not None and len(h[k]) != 2: bad.append(f"{W['name']} / {h['name']}: {k}")
                for k in ('mapZoom', 'bannerZoom', 'bannerOnlyZoom'):
                    if h.get(k) is not None and not 0.2 <= h[k] <= 5: bad.append(f"{W['name']} / {h['name']}: {k} {h[k]}")
        self.assertEqual(bad, [])

    def test_owned_worlds_have_maps(self):
        bad = [W['name'] for ws, W in WORLDS if W['owned'] and not os.path.exists(os.path.join(SITE, 'maps', ws + '.jpg'))]
        self.assertEqual(bad, [])

    def test_neighbourhood_names_unique(self):
        bad = [W['name'] for ws, W in WORLDS if len({h['name'] for h in W['neighbourhoods']}) != len(W['neighbourhoods'])]
        self.assertEqual(bad, [])


class Lots(unittest.TestCase):
    def test_tick_columns(self):
        ok = (True, False, 'N/A')
        bad = [f"{W['name']} / {l['lot']}: {k} {l.get(k)!r}" for ws, W, h, l in LOTS for k in ('built', 'shared', 'screenshots', 'simsMade') if l.get(k) not in ok]
        self.assertEqual(bad, [])

    def test_shared_means_built(self):
        bad = [f"{W['name']} / {l['lot']}" for ws, W, h, l in LOTS if l['shared'] is True and l['built'] is not True]
        self.assertEqual(bad, [])

    def test_sizes(self):
        bad = [f"{W['name']} / {l['lot']}: {l.get('size')}" for ws, W, h, l in LOTS if not re.match(r'^(\d+x\d+|N/A)$', str(l.get('size')))]
        self.assertEqual(bad, [])

    def test_her_type_names(self):
        """Thrift and Boba Store and UoB Commons, never the game's American names (CLAUDE.md)."""
        bad = [f"{W['name']} / {l['lot']}: {l['type']}" for ws, W, h, l in LOTS if re.search(r'Bubble Tea|UBrite', l.get('type') or '', re.I)]
        self.assertEqual(bad, [])

    def test_rental_units_in_type(self):
        """A rental with units says how many in its type, "(N)"."""
        bad = [f"{W['name']} / {l['lot']}" for ws, W, h, l in LOTS if l.get('units') and not re.search(r'\(\d+\)', l.get('type') or '')]
        self.assertEqual(bad, [])

    def test_versions_are_her_community_spaces(self):
        bad = [f"{W['name']} / {l['lot']}: {v.get('label')}" for ws, W, h, l in LOTS for v in l.get('versions', [])
               if v.get('label') not in ('Community space', 'Garden', 'Market', 'Makers') or v.get('upload') not in UPLOADS]
        self.assertEqual(bad, [])

    def test_traits_are_game_names(self):
        names = {v['name'] for v in load(os.path.join(DATA, 'game', 'lot-traits.json'))['traits'].values()}
        bad = [f"{W['name']} / {l['lot']}: {t}" for ws, W, h, l in LOTS for k in ('traits', 'challenges') for t in l.get(k, []) if t not in names]
        bad += [f"{W['name']} / {l['lot']} unit {u['name']}: {t}" for ws, W, h, l in LOTS for u in l.get('units', []) for k in ('traits', 'challenges') for t in u.get(k, []) if t not in names]
        self.assertEqual(bad, [])

    def test_no_percentages_in_shown_text(self):
        """Percentages only on the Stats page (her rule)."""
        bad = [f"{W['name']}: {t[:40]}" for ws, W in WORLDS for t in [W.get('blurb', '')] + [h.get('desc', '') for h in W['neighbourhoods']] if '%' in t]
        self.assertEqual(bad, [])


class GalleryFiles(unittest.TestCase):
    def test_household_uploads_exist(self):
        self.assertEqual([i for i in HH_LINKED if i not in UPLOADS], [])

    def test_every_lot_upload_is_placed_or_set_aside(self):
        """A lot or room upload is on a lot, or in unlinked.json with a reason (the refresh's rule)."""
        bad = [u['title'] for i, u in UPLOADS.items() if u['kind'] in ('lot', 'room') and not u.get('gone') and i not in LINKED and i not in UNLINKED]
        self.assertEqual(bad, [])

    def test_unlinked_really_unlinked(self):
        self.assertEqual([UNLINKED[i]['title'] for i in UNLINKED if i in LINKED or i in HH_LINKED], [])
        self.assertEqual([i for i in UNLINKED if i not in UPLOADS], [])
        self.assertEqual([i for i, v in UNLINKED.items() if not v.get('why')], [])

    def test_one_lot_per_upload(self):
        seen, bad = {}, []
        for ws, W, h, l in LOTS:
            for i in set(l.get('gallery', [])):
                if i in seen: bad.append(f"{UPLOADS.get(i, {}).get('title')}: {seen[i]} and {l['lot']}")
                seen[i] = l['lot']
        self.assertEqual(bad, [])

    def test_text_fixes_still_apply(self):
        """Each typo fix's text is still in its upload (a fix that no longer matches anything is stale)."""
        fixes = load(os.path.join(GALLERY, 'text-fixes.json'))['fixes']
        bad = [i for i in fixes if i not in UPLOADS]
        for i, f in fixes.items():
            if i not in UPLOADS: continue
            raw = re.sub(r'\s+', ' ', UPLOADS[i]['description'])
            bad += [f"{f.get('lot')}: {a!r}" for a, b in f.get('description', []) if a not in raw and a not in raw.replace("''", "'")]
        self.assertEqual(bad, [])

    def test_text_fixes_are_british_and_change_something(self):
        fixes = load(os.path.join(GALLERY, 'text-fixes.json'))['fixes']
        bad = [f"{f.get('lot')}: {a!r}" for f in fixes.values() for a, b in f.get('description', []) if a == b or re.search(r'\b(color|favorite|neighborhood)\b', b)]
        self.assertEqual(bad, [])

    def test_to_sort_shape(self):
        p = os.path.join(GALLERY, 'to-sort.json')
        if not os.path.exists(p): self.skipTest('nothing to sort')
        bad = [i for i, v in load(p).items() if set(v) - {'title', 'lot', 'why'} or not v.get('title') or not v.get('why')]
        self.assertEqual(bad, [])

    def test_uploads_shape(self):
        need = {'title', 'kind', 'description', 'lotType', 'favourites', 'downloads', 'packs', 'checked'}
        bad = [f"{u.get('title')}: {sorted(need - set(u))}" for u in UPLOADS.values() if need - set(u)]
        self.assertEqual(bad, [])
        self.assertEqual([u['title'] for u in UPLOADS.values() if u['kind'] not in ('lot', 'room', 'household')], [])

    def test_comments_for_known_uploads(self):
        comments = load(os.path.join(GALLERY, 'comments.json'))['comments']
        self.assertEqual([i for i in comments if i not in UPLOADS], [])


class History(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(os.path.join(GALLERY, 'history.csv'), encoding='utf-8', newline='') as f:
            cls.rows = list(csv.reader(f))

    def test_header(self):
        self.assertEqual(self.rows[0], ['date', 'id', 'favourites', 'downloads', 'comments'])

    def test_rows(self):
        bad = []
        for n, r in enumerate(self.rows[1:], 2):
            if len(r) != 5: bad.append(f"line {n}: {r}"); continue
            try: date.fromisoformat(r[0])
            except ValueError: bad.append(f"line {n}: date {r[0]}")
            if not all(x.isdigit() for x in r[2:]): bad.append(f"line {n}: numbers {r[2:]}")
        self.assertEqual(bad, [])

    def test_one_row_per_upload_per_day(self):
        keys = [(r[0], r[1]) for r in self.rows[1:]]
        self.assertEqual(len(keys), len(set(keys)))

    def test_numbers_never_go_backwards_much(self):
        """Downloads can only grow (EA sometimes trims favourites by one or two, so those aren't checked)."""
        last, bad = {}, []
        for r in sorted(self.rows[1:], key=lambda r: r[0]):
            d = int(r[3])
            if r[1] in last and d < last[r[1]] - 2: bad.append(f"{r[0]} {UPLOADS.get(r[1], {}).get('title', r[1])}: {last[r[1]]} -> {d}")
            last[r[1]] = d
        self.assertEqual(bad, [])

    def test_latest_matches_uploads(self):
        latest = max(r[0] for r in self.rows[1:])
        bad = [r[1] for r in self.rows[1:] if r[0] == latest and r[1] in UPLOADS and UPLOADS[r[1]]['checked'] == latest and int(r[3]) != UPLOADS[r[1]]['downloads']]
        self.assertEqual(bad, [])


class Groups(unittest.TestCase):
    G = load(os.path.join(DATA, 'groups.json'))

    def test_club_places_are_lots(self):
        bad = [f"{c}: {v['place']}" for c, v in self.G['clubs'].items() if v.get('place') and v['place'] not in LOT_PAGES]
        self.assertEqual(bad, [])

    def test_any_type_clubs_say_where(self):
        bad = [c for c, v in self.G['clubs'].items() if v.get('anyType') and not v.get('world')]
        self.assertEqual(bad, [])

    def test_others_point_at_households(self):
        hhs = {hn for W, hn, hh in HOUSEHOLDS}
        bad = [f"{c}: {o}" for c, v in self.G['clubs'].items() for o in v.get('others', []) if len(o) != 3]
        self.assertEqual(bad, [])

    def test_universities(self):
        bad = [o for o, v in self.G['organisations'].items() if v.get('uni') not in ('uob', 'foxbury', 'secret')]
        self.assertEqual(bad, [])

    def test_members_name_real_groups(self):
        bad = []
        for s in SIMS + list(PEOPLE.values()):
            for c in s.get('clubs', []):
                if c['name'] not in self.G['clubs']: bad.append(f"{s['name']}: club {c['name']}")
            for o in s.get('orgs', []):
                if o['name'] not in self.G['organisations']: bad.append(f"{s['name']}: organisation {o['name']}")
            # a dynasty whose family isn't on the site yet has no entry; its outcasts can still be (Romeo Monticapp, a Monty outcast)
            if s.get('dynasty') and s['dynasty']['name'] not in self.G['dynasties'] and s['dynasty'].get('role') != 'outcast': bad.append(f"{s['name']}: dynasty {s['dynasty']['name']}")
        self.assertEqual(bad, [])

    def test_roles(self):
        bad = [f"{s['name']}: {s['dynasty']['role']}" for s in SIMS + list(PEOPLE.values()) if s.get('dynasty') and s['dynasty'].get('role') not in ('head', 'heir', 'member', 'outcast')]
        bad += [f"{s['name']}: {c['role']}" for s in SIMS + list(PEOPLE.values()) for c in s.get('clubs', []) if c.get('role') not in ('leader', 'member')]
        self.assertEqual(bad, [])

    def test_one_leader_per_club(self):
        from collections import Counter
        leaders = Counter(c['name'] for s in SIMS + list(PEOPLE.values()) for c in s.get('clubs', []) if c.get('role') == 'leader')
        self.assertEqual([c for c, n in leaders.items() if n > 1], [])


class Sims(unittest.TestCase):
    def test_partner_kinds(self):
        ok = {"Spouse", "Partner", "Engaged", "Ex-Spouse", "Late Spouse"}
        bad = [f"{s['name']}: {p}" for s in SIMS + list(PEOPLE.values()) for p in s.get('partners', []) if p[1] not in ok]
        self.assertEqual(bad, [])

    def test_partners_both_ways(self):
        """If A lists B as a partner, B lists A the same way; a widowed Sim's "Late Spouse" is "Spouse" on the late one's side."""
        by = {s['id']: s for s in SIMS if s.get('id')}; by.update({k: dict(v, id=k) for k, v in PEOPLE.items()})
        bad = []
        for s in by.values():
            for pid, kind in s.get('partners', []):
                o = by.get(pid)
                back = {'Late Spouse': {'Spouse', 'Late Spouse'}, 'Spouse': {'Spouse', 'Late Spouse'}}.get(kind, {kind})
                if (s['id'], pid) in ONE_SIDED_FOR_JEMMA or (o and o.get('placeholder')): continue
                if o and not any(q[0] == s['id'] and q[1] in back for q in o.get('partners', [])):   # 15 Nov: a Sim with no partners at all is checked too
                    bad.append(f"{s['name']} → {o['name']} ({kind})")
        self.assertEqual(bad, [])

    def test_no_one_is_their_own_parent_or_has_three(self):
        bad = [s['name'] for s in SIMS if s.get('id') in s.get('parents', []) or len(s.get('parents', [])) > 2]
        bad += [v['name'] for k, v in PEOPLE.items() if k in v.get('parents', []) or len(v.get('parents', [])) > 2]
        self.assertEqual(bad, [])

    def test_origins_and_sexes(self):
        bad = [f"{s['name']}: origin {s.get('origin')}" for s in SIMS if s.get('origin') not in (None, 'Premade', 'Mine')]
        bad += [f"{s['name']}: sex {s.get('sex')}" for s in SIMS if s.get('sex') not in (None, 'm', 'f', 'x')]
        self.assertEqual(bad, [])

    def test_no_ancestry_loops(self):
        by = {s['id']: s for s in SIMS if s.get('id')}; by.update(PEOPLE)
        bad = []
        for k in by:
            seen, stack = set(), list(by[k].get('parents', []))
            while stack:
                p = stack.pop()
                if p == k: bad.append(by[k]['name']); break
                if p in seen or p not in by: continue
                seen.add(p); stack += by[p].get('parents', [])
        self.assertEqual(bad, [])

    def test_household_portraits_exist(self):
        bad = [f"{W['name']} / {hn}: {hh['portrait']}" for W, hn, hh in HOUSEHOLDS if hh.get('portrait') and not os.path.exists(os.path.join(SITE, hh['portrait']))]
        self.assertEqual(bad, [])


class Calendar(unittest.TestCase):
    C = load(os.path.join(DATA, 'calendar.json'))

    def test_seasons(self):
        self.assertEqual(self.C['seasonWeeks'], 4)
        self.assertEqual(len(self.C['seasons']), 4)

    def test_holiday_names_unique(self):
        names = [h['name'] for h in self.C['holidays']]
        self.assertEqual(len(names), len(set(names)))

    def test_events_in_owned_or_known_worlds(self):
        known = {W['name'] for ws, W in WORLDS}
        bad = [e.get('name') for e in self.C.get('events', []) if e.get('world') and e['world'] not in known]
        self.assertEqual(bad, [])


if __name__ == '__main__':
    unittest.main()
