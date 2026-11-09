"""The research tools' own rules: venue_check's catalogue-tag reader, data_check's plan check-up (run on the real plan,
its report kept in memory), and premade_family_fix (on a made-up family in a temporary folder)."""
import builtins, io, json, os, shutil, struct, subprocess, sys, types, unittest
from helpers import ROOT, TOOLS, patched, temp_dir, quiet
from common import save, load
import venue_check as V
import data_check as DC
import premade_family_fix as PF

TAGS = {100: 'BuyCatEE_Bar', 101: 'Func_Bar', 102: 'Func_Stereo', 70000: 'BuyCatPA_Stove', 70001: 'Func_Oven'}


def cobj(values, width, selling_points=2, pad=24, noise=b''):
    ch = 'H' if width == 2 else 'I'
    return bytes(pad) + noise + struct.pack('<I', len(values)) + struct.pack(f'<{len(values)}{ch}', *values) + struct.pack('<I', selling_points) + bytes(8)


class CatalogTags(unittest.TestCase):
    def test_old_entries_uint16(self):
        self.assertEqual(V.catalog_tags(cobj([100, 101], 2), TAGS), ['BuyCatEE_Bar', 'Func_Bar'])

    def test_new_entries_uint32(self):
        self.assertEqual(V.catalog_tags(cobj([70000, 70001], 4), TAGS), ['BuyCatPA_Stove', 'Func_Oven'])

    def test_unknown_tags_ignored(self):
        self.assertEqual(V.catalog_tags(cobj([100, 555], 2), TAGS), [])

    def test_longest_run_wins(self):
        b = cobj([102], 2) + cobj([100, 101, 102], 2, pad=4)
        self.assertEqual(V.catalog_tags(b, TAGS), ['BuyCatEE_Bar', 'Func_Bar', 'Func_Stereo'])

    def test_repeated_values_are_not_a_list(self):
        self.assertEqual(V.catalog_tags(cobj([100, 100], 2), TAGS), [])

    def test_needs_a_selling_point_count_after(self):
        self.assertEqual(V.catalog_tags(cobj([100, 101], 2, selling_points=999), TAGS), [])

    def test_header_skipped(self):
        b = struct.pack('<I', 1) + struct.pack('<H', 100) + struct.pack('<I', 0) + bytes(30)   # looks like a list, but in the first 20 bytes
        self.assertEqual(V.catalog_tags(b, TAGS), [])

    def test_empty(self):
        self.assertEqual(V.catalog_tags(b'', TAGS), [])

    def test_uncheckable(self):
        self.assertEqual(V.UNCHECKABLE, {"Dining Spot", "Pools"})

    def test_cache_shape(self):
        if not os.path.exists(V.CACHE): self.skipTest('no cache yet')
        d = json.load(open(V.CACHE, encoding='utf-8'))
        k, v = next(iter(d.items()))
        self.assertTrue(k.isdigit()); self.assertIsInstance(v, list)


class DataCheckRules(unittest.TestCase):
    def test_dims(self):
        self.assertEqual(DC.dims('30x20'), (20, 30))
        self.assertEqual(DC.dims(' 20 x 30 '), (20, 30))
        self.assertIsNone(DC.dims('N/A'))
        self.assertIsNone(DC.dims(None))

    def test_her_type_names(self):
        self.assertEqual(DC.type_options('Thrift and Boba Store'), {'thrift and bubble tea store'})
        self.assertEqual(DC.type_options('UoB Commons'), {'ubrite commons'})

    def test_combos_and_notes(self):
        self.assertEqual(DC.type_options('Park/Cemetery'), {'park', 'cemetery'})
        self.assertIn('restaurant', DC.type_options('Restaurant (Seafood)'))
        self.assertIn('residential', DC.type_options('Residential Rental (3)'))
        self.assertIn('residential', DC.type_options('Apartment'))

    def test_gallery_type(self):
        self.assertEqual(DC.gtype('Vacation Rental - Granite Falls'), 'vacation rental')
        self.assertEqual(DC.gtype('Thrift and Boba Store'), 'thrift and bubble tea store')
        self.assertEqual(DC.gtype(None), '')


class DataCheckOnThePlan(unittest.TestCase):
    """data_check on the real plan: the things that can only be mistakes are empty (judgement calls, e.g. names and
    sizes that differ from her uploads, are left to her list). Its report file is not written."""
    @classmethod
    def setUpClass(cls):
        real = builtins.open
        if not os.path.exists(os.path.join(ROOT, 'research', 'data', 'plan-vs-game.json')): raise unittest.SkipTest('no plan-vs-game.json')
        with patched(DC, open=lambda p, *a, **k: io.StringIO() if str(p).endswith('data-check.json') else real(p, *a, **k)):
            cls.out = DC.main()
        from helpers import LOTS
        cls.rebuilding = {l.get('displayName') or l.get('myName') or l['lot'] for ws, W, h, l in LOTS if l.get('rebuild')}

    def empty(self, key, skip_rebuilds=False):
        got = [x for x in self.out.get(key, []) if not (skip_rebuilds and any(f"/ {n} " in str(x) + ' ' for n in self.rebuilding))]
        self.assertEqual(got, [], key)

    def test_shared_lots_have_uploads(self): self.empty('shared_no_upload')
    def test_uploads_are_on_shared_lots(self): self.empty('upload_not_shared', skip_rebuilds=True)
    def test_shared_lots_are_built(self): self.empty('shared_not_built')
    def test_one_lot_per_upload(self): self.empty('upload_on_two_lots')
    def test_british_spelling_in_descriptions(self): self.empty('us_spelling')
    def test_every_lot_has_a_type(self): self.empty('no_lot_type')
    def test_every_lot_has_a_size(self): self.empty('no_size')
    def test_no_two_lots_with_one_name(self): self.empty('same_name_twice')
    def test_apartment_rooms_match_uploads(self): self.empty('rooms_plan_vs_gallery')
    def test_screenshot_ticks_match_pictures(self):
        self.empty('screenshots_ticked_none_in_app'); self.empty('screenshots_in_app_not_ticked')


class PremadeFamilyFix(unittest.TestCase):
    def folder(self, d, sims, people=None):
        os.makedirs(os.path.join(d, 'research', 'data')); os.makedirs(os.path.join(d, 'data', 'worlds'))
        save(os.path.join(d, 'research', 'data', 'premades.json'), {"households": [], "between": {"family": []}})
        save(os.path.join(d, 'data', 'worlds', 'testville.json'), {"name": "Testville", "households": {"H": {"sims": sims}}, "neighbourhoods": []})
        save(os.path.join(d, 'data', 'people.json'), people or {"_note": ""})

    def run_fix(self, sims, people=None):
        with temp_dir() as d:
            self.folder(d, sims, people)
            fake_sub = types.SimpleNamespace(run=lambda *a, **k: None)
            with patched(PF, ROOT=d, subprocess=fake_sub), quiet() as out:
                PF.main(True)
            return out.getvalue(), load(os.path.join(d, 'data', 'worlds', 'testville.json'))['households']['H']['sims'], load(os.path.join(d, 'data', 'people.json'))

    def test_ea_couples_married(self):
        _, sims, _ = self.run_fix([{"id": "a", "name": "A", "origin": "Premade", "partners": [["b", "Partner"]]},
                                   {"id": "b", "name": "B", "origin": "Premade", "partners": [["a", "Partner"]]}])
        self.assertEqual([s['partners'][0][1] for s in sims], ['Spouse', 'Spouse'])

    def test_partner_of_one_of_hers_stays(self):
        _, sims, _ = self.run_fix([{"id": "miko", "name": "Miko Ojo", "origin": "Premade", "partners": [["alicia", "Partner"]]},
                                   {"id": "alicia", "name": "Alicia Santiago", "origin": "Mine", "partners": [["miko", "Partner"]]}])
        self.assertEqual([s['partners'][0][1] for s in sims], ['Partner', 'Partner'])

    def test_no_aspiration_for_pets_and_toddlers(self):
        _, sims, _ = self.run_fix([{"id": "t", "name": "T", "origin": "Premade", "age": "Toddler", "aspiration": "X", "bonus": "Y"},
                                   {"id": "d", "name": "D", "origin": "Premade", "state": "Dog", "aspiration": "X"},
                                   {"id": "a", "name": "A", "origin": "Premade", "age": "Adult", "aspiration": "X"}])
        self.assertEqual([s.get('aspiration') for s in sims], [None, None, 'X'])

    def test_her_own_sims_untouched(self):
        mine = {"id": "m", "name": "M", "origin": "Mine", "age": "Toddler", "aspiration": "X"}
        _, sims, _ = self.run_fix([dict(mine)])
        self.assertEqual(sims[0], mine)

    def test_apply_needs_force(self):
        """Run as she would, but from a copy of the tool in a temporary folder: if the guard ever broke, it could only
        touch that folder (which has no data), never data/people.json."""
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'tools'))
            for f in ('premade_family_fix.py', 'common.py'): shutil.copy(os.path.join(TOOLS, f), os.path.join(d, 'tools', f))
            r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(d, 'tools', 'premade_family_fix.py'), '--apply'],
                               capture_output=True, text=True, encoding='utf-8', stdin=subprocess.DEVNULL)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('--force', r.stderr)
        self.assertNotIn('Traceback', r.stderr)


if __name__ == '__main__':
    unittest.main()
