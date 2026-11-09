"""tools/lot_traits.py on made-up saves: which lots take traits, rentals' units, her confirmed save names.
Her saves are never read: building_saves() is replaced by fixtures, and world files live in a temporary folder."""
import os, types, unittest
from helpers import patched, temp_dir, world, lot, argv, quiet
from common import save, load
import lot_traits as LT

TRAITS = {"1": {"name": "Homey", "kind": "trait"}, "2": {"name": "Sunny Aspect", "kind": "trait"},
          "3": {"name": "Off-the-Grid", "kind": "challenge"}, "4": {"name": "Peace and Quiet", "kind": "trait"}}


def zone(name, lot_id, traits=(), plex=0, beds=0, baths=0):
    return {"name": name, "lot_id": lot_id, "active_plex": plex, "lot_traits": list(traits), "bedroom_count": beds, "bathroom_count": baths}


class Run(unittest.TestCase):
    def run_tool(self, worlds, saves, *flags, uploads=None):
        """worlds: [W]; saves: [(label, {world: [zones]})], newest first. Returns (printed text, the worlds as written)."""
        with temp_dir() as d:
            paths = []
            for W in worlds:
                p = os.path.join(d, W['name'] + '.json'); save(p, W); paths.append(p)
            save(os.path.join(d, 'uploads.json'), {"uploads": uploads or {}})
            fake_sub = types.SimpleNamespace(run=lambda *a, **k: types.SimpleNamespace(stdout='', stderr=''), DEVNULL=None)
            with patched(LT, world_files=lambda: paths, GALLERY=d, trait_names=lambda refresh=False: TRAITS, subprocess=fake_sub,
                         building_saves=lambda prefix='Building': [(f'{n}.save', n, z) for n, z in saves]), argv(*flags), quiet() as out:
                LT.main()
            return out.getvalue(), [load(p) for p in paths]

    def lots(self, W): return {l['lot']: l for l in W['neighbourhoods'][0]['lots']}


class SharedOnly(Run):
    def test_shared_lot_gets_traits_and_challenges(self):
        W = world(lots=[lot('Rose Cottage')])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [1, 3])]})], '--apply')
        l = self.lots(W2)['Rose Cottage']
        self.assertEqual((l['traits'], l['challenges']), (['Homey'], ['Off-the-Grid']))

    def test_report_writes_nothing(self):
        W = world(lots=[lot('Rose Cottage')])
        text, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [1])]})])
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])
        self.assertIn('Testville / Rose Cottage: Homey', text)

    def test_unshared_lot_gets_nothing(self):
        W = world(lots=[lot('Rose Cottage', shared=False)])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [1])]})], '--apply')
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])

    def test_unshared_lot_loses_its_traits(self):
        W = world(lots=[lot('Rose Cottage', shared=False, traits=['Homey'])])
        text, [W2] = self.run_tool([W], [('Building', {'Testville': []})], '--apply')
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])
        self.assertIn('not shared any more, traits removed', text)

    def test_unowned_world_left_alone(self):
        W = world(owned=False, lots=[lot('Rose Cottage')])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [1])]})], '--apply')
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])

    def test_traits_removed_in_game_are_removed(self):
        W = world(lots=[lot('Rose Cottage', traits=['Homey'])])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [])]})], '--apply')
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])

    def test_unknown_trait_ids_reported_not_written(self):
        W = world(lots=[lot('Rose Cottage')])
        text, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 10, [1, 999])]})], '--apply')
        self.assertEqual(self.lots(W2)['Rose Cottage']['traits'], ['Homey'])


class Matching(Run):
    def test_matched_by_gallery_title(self):
        W = world(lots=[lot('Game Name', gallery=['g'])])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Her Title', 1, [1])]})], '--apply', uploads={'g': {'title': 'Her Title [Shell]'}})
        self.assertEqual(self.lots(W2)['Game Name']['traits'], ['Homey'])

    def test_her_confirmed_save_name(self):
        W = world('Copperdale', lots=[lot('Hillside Haven')])
        _, [W2] = self.run_tool([W], [('Building', {'Copperdale': [zone('Hillside Haven', 1, [2]), zone('Hallow Slough (SoupShell)', 2, [1])]})], '--apply')
        self.assertEqual(self.lots(W2)['Hillside Haven']['traits'], ['Homey'])   # the alias wins over the game's own name

    def test_unmatched_listed(self):
        W = world(lots=[lot('Rose Cottage')])
        text, _ = self.run_tool([W], [('Building', {'Testville': []})])
        self.assertIn('Shared lots not found in the saves by name: 1', text)

    def test_two_lots_same_name_ambiguous(self):
        W = world(lots=[lot('Rose Cottage', myName='Rosy')])
        text, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rose Cottage', 1, [1]), zone('Rose Cottage', 2, [2])]})], '--apply')
        self.assertIn('Several lots with the same name: 1', text)
        self.assertNotIn('traits', self.lots(W2)['Rose Cottage'])

    def test_exact_name_breaks_a_tie(self):
        W = world(lots=[lot('Game Lot', myName='Rosy')])
        _, [W2] = self.run_tool([W], [('Building', {'Testville': [zone('Rosy', 1, [1]), zone('Game Lot', 2, [2])]})], '--apply')
        self.assertEqual(self.lots(W2)['Game Lot']['traits'], ['Homey'])

    def test_older_save_only_for_lots_the_newest_lacks(self):
        W = world(lots=[lot('A'), lot('B')])
        text, [W2] = self.run_tool([W], [('Building #2', {'Testville': [zone('A', 1, [1])]}),
                                         ('Building', {'Testville': [zone('A', 1, [2]), zone('B', 2, [4])]})], '--apply')
        self.assertEqual(self.lots(W2)['A']['traits'], ['Homey'])
        self.assertEqual(self.lots(W2)['B']['traits'], ['Peace and Quiet'])
        self.assertIn('Testville / B (from Building)', text)

    def test_older_save_cant_reuse_a_claimed_lot(self):
        W = world(lots=[lot('A', myName='New A'), lot('Old A')])
        _, [W2] = self.run_tool([W], [('Building #2', {'Testville': [zone('New A', 1, [1])]}),
                                      ('Building', {'Testville': [zone('Old A', 1, [2])]})], '--apply')
        self.assertNotIn('traits', self.lots(W2)['Old A'])

    def test_special_lot_is_its_own_world(self):
        W = world(lots=[lot('The Magic Realm')])
        _, [W2] = self.run_tool([W], [('Building', {'The Magic Realm': [zone('The Magic Realm', 1, [1])]})], '--apply')
        self.assertEqual(self.lots(W2)['The Magic Realm']['traits'], ['Homey'])


class Rentals(Run):
    def rental(self, name='Slip 42', **kw): return lot(name, type='Residential Rental (2)', **kw)

    def zones(self, name='Slip 42', lid=5, unit_traits=((1,), (2,)), beds=(2, 1)):
        return [zone(name, lid, [], plex=300)] + [zone(f'{chr(65 + n)} {name}', lid, t, plex=301 + n, beds=b, baths=1) for n, (t, b) in enumerate(zip(unit_traits, beds))]

    def test_units_names_traits_and_rooms(self):
        _, [W2] = self.run_tool([world(lots=[self.rental()])], [('Building', {'Testville': self.zones()})], '--apply')
        self.assertEqual(self.lots(W2)['Slip 42']['units'], [{"name": "A", "beds": 2, "baths": 1, "traits": ["Homey"]},
                                                              {"name": "B", "beds": 1, "baths": 1, "traits": ["Sunny Aspect"]}])

    def test_building_traits_from_its_units(self):
        _, [W2] = self.run_tool([world(lots=[self.rental()])], [('Building', {'Testville': self.zones()})], '--apply')
        self.assertEqual(self.lots(W2)['Slip 42']['traits'], ['Homey', 'Sunny Aspect'])

    def test_unshared_rental_gets_units_but_no_traits(self):
        _, [W2] = self.run_tool([world(lots=[self.rental(shared=False)])], [('Building', {'Testville': self.zones()})], '--apply')
        l = self.lots(W2)['Slip 42']
        self.assertEqual([u['name'] for u in l['units']], ['A', 'B'])
        self.assertNotIn('traits', l)

    def test_stale_counts_left_out(self):
        self.assertIn('Rio Verde', LT.STALE_COUNTS)
        _, [W2] = self.run_tool([world(lots=[self.rental('Rio Verde')])], [('Building', {'Testville': self.zones('Rio Verde')})], '--apply')
        self.assertTrue(all('beds' not in u for u in self.lots(W2)['Rio Verde']['units']))

    def test_her_own_counts_kept_when_the_save_has_none(self):
        r = self.rental(units=[{"name": "A", "beds": 3, "baths": 2}])
        _, [W2] = self.run_tool([world(lots=[r])], [('Building', {'Testville': self.zones(beds=(0, 1))})], '--apply')
        self.assertEqual(self.lots(W2)['Slip 42']['units'][0], {"name": "A", "traits": ["Homey"], "beds": 3, "baths": 2})

    def test_number_names_in_number_order(self):
        zs = [zone('Taka Soi 15', 5, [], plex=300), zone('09 Taka Soi 15', 5, [1], plex=301), zone('08 Taka Soi 15', 5, [2], plex=302)]
        _, [W2] = self.run_tool([world(lots=[self.rental('Taka Soi 15')])], [('Building', {'Testville': zs})], '--apply')
        self.assertEqual([u['name'] for u in self.lots(W2)['Taka Soi 15']['units']], ['08', '09'])

    def test_one_unit_is_no_units(self):
        zs = [zone('Slip 42', 5, [1], plex=300), zone('A Slip 42', 5, [1], plex=301)]
        _, [W2] = self.run_tool([world(lots=[self.rental()])], [('Building', {'Testville': zs})], '--apply')
        self.assertNotIn('units', self.lots(W2)['Slip 42'])

    def test_hidden_for_rent_markers_ignored(self):
        zs = [zone('Slip 42', 5, [], plex=300), zone('A Slip 42', 5, [1, 347990], plex=301), zone('B Slip 42', 5, [347991], plex=302)]
        text, [W2] = self.run_tool([world(lots=[self.rental()])], [('Building', {'Testville': zs})], '--apply')
        self.assertNotIn('Trait ids with no name', text)


class UnitName(unittest.TestCase):
    def test_shared_ending_dropped(self):
        self.assertEqual(LT.unit_name('3A Cobblebottom Street', ['3 Cobblebottom Street']), '3A')
        self.assertEqual(LT.unit_name('1 Rio Verde', ['Rio Verde']), '1')

    def test_nothing_in_common_kept_whole(self):
        self.assertEqual(LT.unit_name('The Loft', ['Slip 42']), 'The Loft')

    def test_never_empty(self):
        self.assertTrue(LT.unit_name('Rio Verde', ['Rio Verde']))   # at least one word is always kept

    def test_second_name_tried(self):
        self.assertEqual(LT.unit_name('2 Brindleton Boathouse', ['Bedlington Boathouse', 'Brindleton Boathouse']), '2 Brindleton')


class Names(unittest.TestCase):
    def test_bare(self):
        self.assertEqual(LT.bare('Hallow Slough (SoupShell)'), 'hallowslough')
        self.assertEqual(LT.bare('Kin-Ship [Simsie Shell]'), 'kinship')

    def test_candidates_skip_question_marks(self):
        c = LT.candidates({"lot": "Game", "myName": "?", "displayName": "Hers", "gallery": ["g", "missing"]}, {"g": {"title": "Title"}})
        self.assertEqual(c, {"game", "hers", "title"})

    def test_save_names_point_at_real_lots(self):
        from helpers import LOTS
        have = {f"{W['name']}|{l['lot']}" for ws, W, h, l in LOTS}
        self.assertEqual([k for k in LT.SAVE_NAMES if k not in have], [])

    def test_stale_counts_are_real_lots(self):
        from helpers import LOTS
        have = {l['lot'] for ws, W, h, l in LOTS}
        self.assertEqual(LT.STALE_COUNTS - have, set())

    def test_trait_names_cached(self):
        names = LT.trait_names()
        self.assertTrue(names)
        self.assertTrue(all(v['kind'] in ('trait', 'challenge') and v['name'] for v in names.values()))


if __name__ == '__main__':
    unittest.main()
