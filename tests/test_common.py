"""tools/common.py: slugs (must match slug() in site/js/app.js), loose names, JSON in and out, dates."""
import json, os, unittest
from helpers import temp_dir
import common


class Slug(unittest.TestCase):
    def test_lower_and_dashes(self):
        self.assertEqual(common.slug('Willow Creek'), 'willow-creek')
        self.assertEqual(common.slug('  Magnolia Promenade  '), 'magnolia-promenade')

    def test_accents_dropped(self):
        self.assertEqual(common.slug('Chee-wít'), 'chee-wit')
        self.assertEqual(common.slug('Cantina “El Árbol del Jaguar”'), 'cantina-el-arbol-del-jaguar')

    def test_ampersand_is_and(self):
        self.assertEqual(common.slug('Burners & Builders'), 'burners-and-builders')

    def test_apostrophes_both_kinds(self):
        self.assertEqual(common.slug("Admiral’s Wreckage"), 'admiral-s-wreckage')
        self.assertEqual(common.slug("Admiral's Wreckage"), 'admiral-s-wreckage')

    def test_no_leading_or_trailing_dashes(self):
        self.assertEqual(common.slug('--The ██████ Lab!'), 'the-lab')

    def test_numbers_kept(self):
        self.assertEqual(common.slug('5-6-1 Shinrinyoku'), '5-6-1-shinrinyoku')

    def test_non_strings(self):
        self.assertEqual(common.slug(42), '42')


class Norm(unittest.TestCase):
    def test_letters_and_digits_only(self):
        self.assertEqual(common.norm("Crow's Chronicles"), 'crowschronicles')

    def test_same_key_for_spellings(self):
        self.assertEqual(common.norm('Chee-wít'), common.norm('Chee-wit'))
        self.assertEqual(common.norm('Burners & Builders'), common.norm('Burners and Builders'))
        self.assertEqual(common.norm('Admiral’s Wreckage'), common.norm("Admiral's Wreckage"))

    def test_empty(self):
        self.assertEqual(common.norm(None), '')
        self.assertEqual(common.norm(''), '')


class JsonFiles(unittest.TestCase):
    def test_save_and_load_round_trip(self):
        obj = {"name": "Testville", "colour": "#abcdef", "neighbourhoods": [{"name": "Old Town", "lots": [
            {"lot": "Café Lune", "built": True, "traits": ["Homey"]}, {"lot": "2 Rue", "built": False}]}]}
        with temp_dir() as d:
            p = os.path.join(d, 'sub', 'w.json')
            common.save(p, obj)
            self.assertEqual(common.load(p), obj)

    def test_one_lot_per_line(self):
        obj = {"lots": [{"lot": "A", "x": [1, 2]}, {"lot": "B"}]}
        with temp_dir() as d:
            p = os.path.join(d, 'w.json'); common.save(p, obj)
            text = open(p, encoding='utf-8').read()
        self.assertIn('{"lot": "A", "x": [1, 2]}', text)
        self.assertIn('{"lot": "B"}', text)

    def test_short_lists_inline(self):
        with temp_dir() as d:
            p = os.path.join(d, 'w.json'); common.save(p, {"mapSpot": [0.25, 0.5], "colours": ["#111", "#222"]})
            text = open(p, encoding='utf-8').read()
        self.assertIn('[0.25, 0.5]', text)
        self.assertIn('["#111", "#222"]', text)

    def test_unicode_kept_and_unix_newlines(self):
        with temp_dir() as d:
            p = os.path.join(d, 'w.json'); common.save(p, {"name": "Admiral’s Wreckage"})
            raw = open(p, 'rb').read()
        self.assertIn('Admiral’s'.encode('utf-8'), raw)
        self.assertNotIn(b'\r\n', raw)
        self.assertTrue(raw.endswith(b'\n'))


class Dates(unittest.TestCase):
    def test_nice_date(self):
        self.assertEqual(common.nice_date('2026-10-11'), '11 Oct 2026')
        self.assertEqual(common.nice_date('2026-11-01'), '1 Nov 2026')


class WorldFiles(unittest.TestCase):
    def test_world_files_follow_the_order_and_exist(self):
        order = common.load(os.path.join(common.DATA, 'worlds.json'))['order']
        files = common.world_files()
        self.assertEqual([os.path.basename(f)[:-5] for f in files], order)
        self.assertTrue(all(os.path.exists(f) for f in files))
        self.assertEqual(len(order), len(set(order)))

    def test_every_world_file_is_in_the_order(self):
        on_disk = {f[:-5] for f in os.listdir(os.path.join(common.DATA, 'worlds')) if f.endswith('.json')}
        self.assertEqual(on_disk - set(common.load(os.path.join(common.DATA, 'worlds.json'))['order']), set())


if __name__ == '__main__':
    unittest.main()
