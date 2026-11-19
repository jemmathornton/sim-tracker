"""tools/research/new_save_check.py: her new save against the plan, with the save replaced by a fixture made from the
game's own untouched lots (research/data/new-save-baseline.json). Its two output files go to a temporary folder."""
import builtins, copy, os, unittest
from helpers import ROOT, patched, temp_dir, quiet, built_data, argv
from common import load
import new_save_check as N

BASE = load(N.BASELINE)['lots']


def untouched_zones():
    """The save as the game made it: every lot exactly as in the baseline."""
    zones = {}
    for n, (k, v) in enumerate(BASE.items()):
        w, lid, plex = k.split('|')
        zones[n + 1] = {"world": w, "lot_id": int(lid), "name": v['name'], "street": None, "plex": int(plex), "traits": [],
                        "objs": v['objs'], "active": None, "subs": None, "venue": None, "uni": None}
    return zones


def run(zones):
    """main() on the given zones; returns the status it would write (json) and the report text (md)."""
    got = {}
    def fake_save(p, obj, *a, **k): got['json'] = obj
    def fake_write(p, text):   # the report is written with common.write_text (a safe write, 19 Nov)
        if not str(p).endswith('new-save-status.md'): raise AssertionError(f'unexpected write: {p}')
        got['md'] = text
    with patched(N, read=lambda f: (("Jemma's Sim World", None), zones, [], {}), find_save=lambda: ('Slot_x.save', 0),
                 save=fake_save, write_text=fake_write, OPTIONS={}, HOLIDAYS=[], CLUBS=[], DYNASTIES=[], NAPS=[], OWNERS={}, HH_NAME={}, ECO={}), \
         argv(), quiet():
        N.main()
    return got


class Untouched(unittest.TestCase):
    @classmethod
    def setUpClass(cls): cls.r = run(untouched_zones())

    def test_nothing_placed(self):
        placed = [r['lot'] for rows in self.r['json']['worlds'].values() for r in rows if r.get('status') == 'placed']
        self.assertEqual(placed, [])

    def test_shared_built_lots_are_to_place(self):
        rows = [r for rows in self.r['json']['worlds'].values() for r in rows]
        self.assertTrue(any(r['status'] == 'to place' for r in rows))
        self.assertTrue(all(r['status'] in ('to place', 'game lot', 'not found') for r in rows))

    def test_report_written(self):
        self.assertTrue(self.r['md'].strip())

    def test_every_owned_world_checked(self):
        D = built_data()
        want = {w['name'] for w in D['worlds'] if w.get('owned') and w.get('ready')}
        self.assertEqual(set(self.r['json']['worlds']), want)


class Placed(unittest.TestCase):
    """One shared lot with traits placed: wrong name, a missing trait and an extra one are each reported."""
    @classmethod
    def setUpClass(cls):
        D = built_data()
        first = run(untouched_zones())['json']
        cls.pick = None
        for wn, rows in first['worlds'].items():
            for r in rows:
                if r['status'] != 'to place' or r.get('save_name') is None: continue
                l = next(l for w in D['worlds'] if w['name'] == wn for h in w['hoods'] for l in h['lots'] if l['lot'] == r['lot'])
                if len(l.get('traits') or []) >= 2 and not l.get('units') and not l.get('challenges'):
                    cls.pick = (wn, r, l); break
            if cls.pick: break
        wn, r, l = cls.pick
        zones = untouched_zones()
        z = next(z for z in zones.values() if z['world'] == wn and z['name'] == r['save_name'] and z['plex'] in (0, 300))
        z['objs'] += 7; z['traits'] = [l['traits'][0], 'Penny Pixies' if 'Penny Pixies' not in l['traits'] else 'Homey']; z['name'] = 'Something Else'
        cls.row = next(x for x in run(zones)['json']['worlds'][wn] if x['lot'] == r['lot'])

    def test_placed(self):
        self.assertEqual(self.row['status'], 'placed')

    def test_issues(self):
        wn, r, l = self.pick
        issues = ' | '.join(self.row['issues'])
        self.assertIn('missing trait', issues)
        self.assertIn(l['traits'][1], issues)
        self.assertIn('not in the plan', issues)
        self.assertIn('named “Something Else” in the save', issues)


class Helpers(unittest.TestCase):
    def test_unit_name(self):
        self.assertEqual(N.unit_name({"units": [{"name": "08"}, {"name": "09"}]}, 2), '09')
        self.assertEqual(N.unit_name({}, 4), '4')

    def test_her_names_for_the_games_types(self):
        self.assertEqual(N.SAME_TYPE['thrift and boba store'], 'thrift and bubble tea store')
        self.assertEqual(N.SAME_TYPE['uob commons'], 'ubrite commons')

    def test_save_name(self):
        self.assertEqual(N.SAVE_NAME, "Jemma's Sim World")

    def test_her_neighbourhood_story_picks_cover_every_rule(self):
        self.assertEqual(set(N.NS_PICKS), set(N.NS_RULES))
        on = {N.NS_RULES[k] for k, v in N.NS_PICKS.items() if v}
        self.assertEqual(on, {"Retire from Career", "Die in Accidents", "Friendship Changes"})   # her picks, 23 Oct

    def test_universities(self):
        self.assertEqual(N.UNIS['University of Britechester'][0], 219732)
        self.assertEqual(N.UNIS['Foxbury Institute'][0], 219731)

    def test_baseline_shape(self):
        self.assertTrue(BASE)
        for k, v in list(BASE.items())[:50]:
            w, lid, plex = k.split('|')
            self.assertTrue(w and lid.isdigit() and plex.isdigit())
            self.assertIn('name', v); self.assertIsInstance(v['objs'], int)


if __name__ == '__main__':
    unittest.main()
