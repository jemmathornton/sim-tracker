"""Fixes from the 19 Nov review of the tools: one rule for a lot's lead Gallery upload (card, cover and other pictures),
covers and pictures remade when the lead changes, safe writes, temporary copies cleaned up, a program's errors always
shown, and the test runner's last line. Everything runs in temporary folders; nothing goes online."""
import glob, io, os, sys, tempfile, types, unittest
from PIL import Image
from helpers import patched, temp_dir, world, lot, quiet, UPLOADS, LOTS
from common import save, load, write_bytes, write_text, lead_upload, picture_sources, run_output
import build, gallery_refresh as G, import_spreadsheet as IS, run_tests, sims4files as s4
from test_import_spreadsheet import workbook, row


def up(title, fav=0, dl=0, lot_type='Residential', images=('a1', 'a2', 'a3', 'a4'), kind='lot'):
    return {"title": title, "kind": kind, "lotType": lot_type, "favourites": fav, "downloads": dl, "images": list(images)}


class LeadUpload(unittest.TestCase):
    def test_most_popular_leads(self):
        U = {'a': up('A', 1, 1), 'b': up('B', 5, 5)}
        self.assertEqual(lead_upload(lot('X', gallery=['a', 'b']), U), 'b')

    def test_her_chosen_copy_wins(self):
        U = {'a': up('A', 1, 1), 'b': up('B', 5, 5)}
        self.assertEqual(lead_upload(lot('X', gallery=['a', 'b'], galleryLead='a'), U), 'a')

    def test_rental_and_regular_versions_the_plan_type_leads(self):
        U = {'r': up('Flat', 9, 9, 'Residential Rental'), 'c': up('Cafe', 1, 1, 'Café')}
        self.assertEqual(lead_upload(lot('X', type='Café', gallery=['r', 'c']), U), 'c')
        self.assertEqual(lead_upload(lot('X', type='Bar', gallery=['r', 'c']), U), 'r')   # no plan match: the rental

    def test_missing_translation_counts_as_the_plan_type(self):
        U = {'a': up('Old', 9, 9, 'Bar'), 'b': up('New', 1, 1, 'Missing sims translation')}
        self.assertEqual(lead_upload(lot('X', type='Backroom', galleryVariants=True, gallery=['a', 'b']), U), 'b')

    def test_community_space_leads_with_the_upload_that_isnt_a_version(self):
        U = {'m': up('Hub Market', 9, 9), 'h': up('Hub', 1, 1)}
        self.assertEqual(lead_upload(lot('X', versions=[{}], gallery=['m', 'h']), U), 'h')

    def test_build_card_matches_the_lead_for_every_lot(self):
        """The site's Gallery card shows the same upload as the shared rule, for every lot in the plan."""
        for ws, W, h, l in LOTS:
            if not l.get('gallery') or not all(i in UPLOADS for i in l['gallery']): continue
            g = build.gallery_for(l)
            self.assertTrue(g['url'].endswith(build.urllib.parse.quote(lead_upload(l, UPLOADS), safe='')), l['lot'])


def jpeg(colour):
    b = io.BytesIO(); Image.new('RGB', (20, 10), colour).save(b, 'JPEG'); return b.getvalue()


class Covers(unittest.TestCase):
    """add_covers with EA's picture server replaced: each url answers with a picture of its own colour."""
    COLOURS = {'a1': 'red', 'b1': 'blue'}

    def run_covers(self, d, lots, uploads, shots=()):
        site, gal = os.path.join(d, 'site'), os.path.join(d, 'gallery')
        os.makedirs(gal, exist_ok=True)
        for s in shots: os.makedirs(os.path.join(site, 'shots', 'testville', s))
        fetched, said = [], []
        def get(url): fetched.append(url); return 200, jpeg(self.COLOURS[url])
        with patched(G, SITE=site, GALLERY=gal, get=get, say=said.append):
            G.add_covers([world(lots=lots)], uploads)
        return fetched, said, picture_sources(gal)

    def colour(self, d, ls): return Image.open(os.path.join(d, 'site', 'gallery', 'testville', ls + '.jpg')).convert('RGB').getpixel((5, 5))

    def test_new_cover_is_from_the_lead_and_recorded(self):
        U = {'a': up('A', 1, 1, images=['a1']), 'b': up('B', 9, 9, images=['b1'])}
        with temp_dir() as d:
            fetched, said, src = self.run_covers(d, [lot('Rose Cottage', gallery=['a', 'b'])], U)
            self.assertEqual(fetched, ['b1'])                                   # before 19 Nov: the first linked upload, 'a'
            self.assertEqual(src, {'testville/rose-cottage': {'cover': 'b'}})
            self.assertIn('added a Gallery picture for Testville / Rose Cottage', said[0])

    def test_cover_from_another_upload_is_remade(self):
        U = {'a': up('A', 1, 1, images=['a1']), 'b': up('B', 9, 9, images=['b1'])}
        with temp_dir() as d:
            dest = os.path.join(d, 'site', 'gallery', 'testville', 'rose-cottage.jpg'); os.makedirs(os.path.dirname(dest))
            open(dest, 'wb').write(jpeg('red'))                                 # an old cover, from the first upload ('a')
            fetched, said, src = self.run_covers(d, [lot('Rose Cottage', gallery=['a', 'b'])], U)
            self.assertEqual(fetched, ['b1'])
            self.assertGreater(self.colour(d, 'rose-cottage')[2], 150)          # blue now
            self.assertIn('remade a Gallery picture for Testville / Rose Cottage', said[0])
            self.assertEqual(src['testville/rose-cottage'], {'cover': 'b'})
            fetched, said, _ = self.run_covers(d, [lot('Rose Cottage', gallery=['a', 'b'])], U)   # next week: nothing to do
            self.assertEqual((fetched, said), ([], []))

    def test_cover_already_from_the_lead_is_kept_and_recorded(self):
        U = {'a': up('A', 9, 9, images=['a1']), 'b': up('B', 1, 1, images=['b1'])}
        with temp_dir() as d:
            dest = os.path.join(d, 'site', 'gallery', 'testville', 'rose-cottage.jpg'); os.makedirs(os.path.dirname(dest))
            open(dest, 'wb').write(jpeg('red'))
            fetched, said, src = self.run_covers(d, [lot('Rose Cottage', gallery=['a', 'b'])], U)
            self.assertEqual((fetched, said), ([], []))
            self.assertEqual(src, {'testville/rose-cottage': {'cover': 'a'}})

    def test_her_screenshots_are_never_replaced(self):
        U = {'a': up('A', 1, 1, images=['a1']), 'b': up('B', 9, 9, images=['b1'])}
        with temp_dir() as d:
            fetched, said, src = self.run_covers(d, [lot('Rose Cottage', gallery=['a', 'b'])], U, shots=['rose-cottage'])
            self.assertEqual((fetched, src), ([], {}))
            self.assertFalse(os.path.exists(os.path.join(d, 'site', 'gallery', 'testville', 'rose-cottage.jpg')))


class MorePictures(unittest.TestCase):
    """gallery_more.main with a temporary site and plan; fetch() answers from a dict."""
    def run_more(self, d, l, U, apply=True):
        import gallery_more as GM
        wp = os.path.join(d, 'testville.json'); save(wp, world(lots=[l]))
        site, gal = os.path.join(d, 'site'), os.path.join(d, 'gallery'); os.makedirs(gal, exist_ok=True)
        got = []
        def fetch(url): got.append(url); return b'\xff\xd8' + url.encode()
        with patched(GM, SITE=site, GALLERY_DIR=gal, uploads=U, world_files=lambda: [wp], fetch=fetch,
                     time=types.SimpleNamespace(sleep=lambda s: None)), quiet() as out:
            GM.main(apply, rebuild=False)
        return got, out.getvalue(), picture_sources(gal), site

    def test_pictures_from_an_old_lead_are_fetched_again(self):
        U = {'r': up('Flat', 9, 9, 'Residential Rental', images=['r1', 'r2', 'r3']), 'c': up('Cafe', 1, 1, 'Café', images=['c1', 'c2'])}
        l = lot('Rose Cottage', type='Café', gallery=['r', 'c'])
        with temp_dir() as d:
            more = os.path.join(d, 'site', 'gallery-more', 'testville'); os.makedirs(more)
            for n in (2, 3): open(os.path.join(more, f'rose-cottage-{n}.jpg'), 'wb').write(b'\xff\xd8old')   # from 'r', the most popular
            got, out, src, site = self.run_more(d, l, U, apply=False)
            self.assertEqual(got, [])
            self.assertIn("1 lots' pictures are from an upload that no longer leads: Testville / Rose Cottage", out)
            got, out, src, site = self.run_more(d, l, U)
            self.assertEqual(got, ['c2'])                                       # the lead has one other picture
            self.assertEqual(sorted(os.listdir(more)), ['rose-cottage-2.jpg'])  # the old upload's third picture is gone
            self.assertEqual(open(os.path.join(more, 'rose-cottage-2.jpg'), 'rb').read(), b'\xff\xd8c2')
            self.assertEqual(src, {'testville/rose-cottage': {'more': 'c'}})
            self.assertEqual(self.run_more(d, l, U)[0], [])                     # next time: nothing to do
            self.assertFalse(glob.glob(os.path.join(more, '*.tmp')))


class SafeWritesAndTemporaryCopies(unittest.TestCase):
    def test_write_bytes_swaps_in_whole(self):
        with temp_dir() as d:
            p = os.path.join(d, 'x.jpg'); open(p, 'wb').write(b'old')
            def broken(*a, **k): raise OSError('disk full')
            with patched(os, replace=broken):
                with self.assertRaises(OSError): write_bytes(p, b'new')
            self.assertEqual(open(p, 'rb').read(), b'old')
            write_bytes(p, b'new'); self.assertEqual(open(p, 'rb').read(), b'new')

    def test_generated_files_written_safely(self):
        """build.py (data.js, index.html), admin_data.py, gallery_more.py, the new-save check and checklist, own_import.py and
        ancestors.py write through common.write_text/write_bytes, never straight into the file."""
        import re
        here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        for f in ('tools/build.py', 'tools/admin_data.py', 'tools/gallery_more.py', 'tools/new_save_checklist.py', 'tools/own_import.py',
                  'tools/research/new_save_check.py', 'tools/research/ancestors.py'):
            src = open(os.path.join(here, f), encoding='utf-8').read()
            self.assertNotRegex(src, r"open\([^)]*,\s*['\"]wb?['\"]", f)

    def test_save_copy_and_its_folder_removed(self):
        with temp_dir() as d:
            p = os.path.join(d, 'Slot_1.save'); open(p, 'wb').write(b'x')
            made = []
            real = tempfile.mkdtemp
            def mk(*a, **k): made.append(real(*a, **k)); return made[-1]
            with patched(s4, index=lambda path: [(s4.SAVEGAME, 0, 0)], read=lambda path, e: b'data'), patched(s4.tempfile, mkdtemp=mk):
                self.assertEqual(s4.read_save(p), b'data')
            self.assertFalse(os.path.exists(made[0]))

    def test_spreadsheet_copy_deleted_after_reading(self):
        with temp_dir() as d:
            x = os.path.join(d, 'plans.xlsx'); workbook(x, [row('A')], {'Testville': 'yes'})
            made = []
            real = tempfile.mkdtemp
            def mk(*a, **k): made.append(real(*a, **k)); return made[-1]
            with patched(IS.tempfile, mkdtemp=mk):
                IS.read_sheet(x)
            self.assertEqual(len(made), 1); self.assertFalse(os.path.exists(made[0]))
            self.assertTrue(os.path.exists(x))                                  # hers is untouched


class Messages(unittest.TestCase):
    def test_run_output_shows_errors_after_output(self):
        r = types.SimpleNamespace(stdout='Wrote data.js\n', stderr='Admin data not written: x\n')
        self.assertEqual(run_output(r), 'Wrote data.js\nAdmin data not written: x')
        self.assertEqual(run_output(types.SimpleNamespace(stdout='', stderr='boom')), 'boom')
        self.assertEqual(run_output(types.SimpleNamespace(stdout=None, stderr=None)), '')

    def test_no_tool_prints_only_one_of_the_two(self):
        here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        for f in glob.glob(os.path.join(here, 'tools', '*.py')) + glob.glob(os.path.join(here, 'tools', 'research', '*.py')):
            self.assertNotIn('(r.stdout or r.stderr)', open(f, encoding='utf-8').read(), f)

    def test_run_tests_never_says_all_passed_when_site_tests_skipped(self):
        self.assertEqual(run_tests.summary(True, True), '\nAll tests passed.')
        self.assertIn('site tests SKIPPED', run_tests.summary(True, None))
        self.assertIn('not run (--python-only)', run_tests.summary(True, None, True))
        self.assertEqual(run_tests.summary(True, False), '\nSome tests FAILED.')
        self.assertEqual(run_tests.summary(False, None), '\nSome tests FAILED.')


if __name__ == '__main__':
    unittest.main()
