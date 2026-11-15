"""Fixes from the 15 Nov review of the tools: the refresh's log and its automatic commit, Admin's reading of the log,
safe writes, her [X] ticks, the build's failures, the spreadsheet import over two runs, and the one lot-name order.
Everything runs in temporary folders (a throwaway git repo for the commit); nothing in the project is touched."""
import json, os, subprocess, sys, types, unittest
from pathlib import Path
from helpers import ROOT, patched, temp_dir, world, lot, argv, quiet
from common import save, load, write_text, shown_name
import admin_data, build, gallery_refresh as G, import_spreadsheet as IS, new_save_checklist as NC
import test_import_spreadsheet as TIS
from test_import_spreadsheet import workbook, as_base


class RefreshLog(unittest.TestCase):
    """A run writes its log as it goes, so one that's killed partway still leaves a trace (15 Nov: a scheduled run failed
    and left nothing)."""
    def test_say_writes_straight_away_when_live(self):
        with temp_dir() as d:
            log = os.path.join(d, 'r.log')
            with patched(G, LOG=log, LIVE=True, report=[]), quiet():
                G.say('Gallery refresh, 15 Nov 2026 07:54, started'); G.say('267 uploads listed')
                self.assertEqual(open(log, encoding='utf-8').read(), 'Gallery refresh, 15 Nov 2026 07:54, started\n267 uploads listed\n')

    def test_not_live_writes_nothing(self):
        with temp_dir() as d:
            log = os.path.join(d, 'r.log')
            with patched(G, LOG=log, LIVE=False, report=[]), quiet(): G.say('x')
            self.assertFalse(os.path.exists(log))

    def test_broken_setup_is_logged(self):
        """A copy of the refresh with no common.py next to it fails at import, and says so in its log."""
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'tools'))
            src = open(os.path.join(ROOT, 'tools', 'gallery_refresh.py'), encoding='utf-8').read()
            open(os.path.join(d, 'tools', 'gallery_refresh.py'), 'w', encoding='utf-8').write(src)
            r = subprocess.run([sys.executable, '-I', '-X', 'utf8', os.path.join(d, 'tools', 'gallery_refresh.py')],
                               capture_output=True, text=True, stdin=subprocess.DEVNULL)
            self.assertNotEqual(r.returncode, 0)
            log = open(os.path.join(d, 'logs', 'gallery-refresh.log'), encoding='utf-8').read()
        self.assertIn(', started\nStopped with an error:', log)
        self.assertIn('common', log)


RUNS = """Gallery refresh, 25 Oct 2026 08:54
267 uploads listed on the Gallery, 0 new
Done: 1 favourites, 2 downloads, 3 comments across 267 uploads
Wrote site\\js\\data.js: ok
Saved in the project history

Gallery refresh, 01 Nov 2026 08:54
267 uploads listed on the Gallery, 0 new
Done: 1 favourites, 2 downloads, 3 comments across 267 uploads
Pictures missing from site/: a.jpg
Build failed

Gallery refresh, 08 Nov 2026 07:54, started
267 uploads listed on the Gallery, 1 new
  new household upload “Spectra” not linked; listed in data/gallery/unlinked.json
  linked new household upload “Goth” to Willow Creek / Goth
Done: 1 favourites, 2 downloads, 3 comments across 268 uploads
Wrote site\\js\\data.js: ok
New-save check not refreshed: no save
Saved in the project history
Finished with problems

Gallery refresh, 15 Nov 2026 07:54, started
267 uploads listed on the Gallery, 0 new

Gallery refresh, 15 Nov 2026 20:04, started
267 uploads listed on the Gallery, 0 new
Done: 1 favourites, 2 downloads, 3 comments across 267 uploads
Wrote site\\js\\data.js: ok
Saved in the project history
Finished

"""


class AdminReadsTheLog(unittest.TestCase):
    def runs(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'logs')); open(os.path.join(d, 'logs', 'gallery-refresh.log'), 'w', encoding='utf-8').write(RUNS)
            with patched(admin_data, ROOT=Path(d)): return admin_data.refresh_runs()

    def test_old_run_written_at_the_end_is_ok(self):
        self.assertTrue(self.runs()[0]['ok'])

    def test_build_failing_after_done_is_not_ok(self):
        r = self.runs()[1]
        self.assertFalse(r['ok']); self.assertIn('Pictures missing from site/: a.jpg', r['notes'])

    def test_notes_keep_the_lines_the_refresh_writes(self):
        r = self.runs()[2]
        self.assertFalse(r['ok'])
        self.assertEqual(r['when'], '08 Nov 2026 07:54')   # ", started" isn't part of the date (sections.js reads it)
        self.assertIn('new household upload “Spectra” not linked; listed in data/gallery/unlinked.json', r['notes'])
        self.assertIn('linked new household upload “Goth” to Willow Creek / Goth', r['notes'])
        self.assertIn('New-save check not refreshed: no save', r['notes'])

    def test_run_that_never_finished_is_failed(self):
        r = self.runs()[3]
        self.assertFalse(r['ok']); self.assertIn('stopped before it finished', r['notes'])

    def test_finished_run_is_ok(self):
        r = self.runs()[4]
        self.assertTrue(r['ok']); self.assertEqual(r['notes'], []); self.assertEqual(r['when'], '15 Nov 2026 20:04')


class RefreshCommit(unittest.TestCase):
    """The automatic commit takes only what the refresh itself changed (15 Nov review: it used to sweep up hand edits)."""
    def git(self, *a): return subprocess.run(['git', *a], cwd=self.d, capture_output=True, text=True, encoding='utf-8', stdin=subprocess.DEVNULL)

    def setUp(self):
        self.t = temp_dir(); self.d = self.t.__enter__()
        for p in ('data/worlds', 'data/gallery'): os.makedirs(os.path.join(self.d, p))
        for f in ('data/worlds/a.json', 'data/gallery/uploads.json', 'notes.txt'): open(os.path.join(self.d, f), 'w').write('1\n')
        self.git('init', '-q'); self.git('config', 'user.name', 'Test'); self.git('config', 'user.email', 'test@example.invalid')
        self.git('config', 'core.autocrlf', 'false'); self.git('add', '-A'); self.git('commit', '-qm', 'start')

    def tearDown(self): self.t.__exit__(None, None, None)

    def test_hand_edits_left_out(self):
        open(os.path.join(self.d, 'data/worlds/a.json'), 'w').write('her edit\n')        # work in progress before the run
        open(os.path.join(self.d, 'notes.txt'), 'w').write('elsewhere\n')                  # outside the refresh's folders
        said = []
        with patched(G, say=said.append):
            before = G.changed_files(self.d)
            open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('2\n')     # what the run changed
            open(os.path.join(self.d, 'data/gallery/new.json'), 'w').write('new\n')
            G.commit_refresh(before, self.d)
        self.assertEqual(before, {'data/worlds/a.json'})
        files = self.git('show', '--name-only', '--format=', 'HEAD').stdout.split()
        self.assertEqual(sorted(files), ['data/gallery/new.json', 'data/gallery/uploads.json'])
        self.assertIn('Saved in the project history', said)
        self.assertTrue(any('left out of the automatic save' in s and 'a.json' in s for s in said))
        status = self.git('status', '--porcelain').stdout
        self.assertIn('data/worlds/a.json', status); self.assertIn('notes.txt', status)

    def test_nothing_new(self):
        said = []
        with patched(G, say=said.append): G.commit_refresh(frozenset(), self.d)
        self.assertEqual(said, ['Nothing new to save in the project history'])
        self.assertEqual(self.git('rev-list', '--count', 'HEAD').stdout.strip(), '1')

    def test_she_staged_something_else(self):
        """A file she staged outside the refresh's folders stays staged and out of the automatic commit."""
        open(os.path.join(self.d, 'notes.txt'), 'w').write('staged\n'); self.git('add', 'notes.txt')
        with patched(G, say=lambda s: None):
            open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('3\n')
            G.commit_refresh(frozenset(), self.d)
        self.assertEqual(self.git('show', '--name-only', '--format=', 'HEAD').stdout.split(), ['data/gallery/uploads.json'])
        self.assertIn('M  notes.txt', self.git('status', '--porcelain').stdout)


class SafeWrites(unittest.TestCase):
    def test_write_text_swaps_in_whole(self):
        with temp_dir() as d:
            p = os.path.join(d, 'a.md'); open(p, 'w').write('old')
            write_text(p, 'new\n')
            self.assertEqual(open(p, encoding='utf-8').read(), 'new\n')
            self.assertEqual(os.listdir(d), ['a.md'])

    def test_save_same_format_no_tmp(self):
        with temp_dir() as d:
            p = os.path.join(d, 'w.json'); save(p, {"colours": ["#112233", "#445566"], "x": 1})
            self.assertEqual(open(p, encoding='utf-8').read(), '{\n "colours": ["#112233", "#445566"],\n "x": 1\n}\n')
            self.assertEqual(os.listdir(d), ['w.json'])


class CapitalTicks(unittest.TestCase):
    def test_capital_x_kept(self):
        with temp_dir() as d:
            out = os.path.join(d, 'checklist.md')
            with patched(NC, OUT=out), quiet(): NC.main()
            lines = open(out, encoding='utf-8').read().splitlines()
            step = next(l for l in lines if l.startswith('- [ ] ') and not l.startswith('- [ ] **'))
            open(out, 'w', encoding='utf-8').write(f"- [X] {step[6:]}\n")
            with patched(NC, OUT=out), quiet(): NC.main()
            after = open(out, encoding='utf-8').read().splitlines()
            self.assertEqual(os.listdir(d), ['checklist.md'])
        self.assertIn('- [x] ' + step[6:], after)


class BuildFailures(unittest.TestCase):
    def test_community_space_versions_all_named(self):
        """Every upload's title ends in a version word and none ends "Space": the first leads instead of crashing."""
        ups = {'AAAAAAAAAAAAAAAAAAAAAQ==': {"title": "Harbour Garden", "kind": "lot", "description": "", "lotType": "Community Space", "size": "30x20",
                      "price": 1, "beds": 0, "baths": 0, "packs": [], "images": [], "favourites": 3, "downloads": 9, "checked": "2026-11-15"},
               'AAAAAAAAAAAAAAAAAAAAAg==': {"title": "Harbour Makers", "kind": "lot", "description": "", "lotType": "Community Space", "size": "30x20",
                      "price": 1, "beds": 0, "baths": 0, "packs": [], "images": [], "favourites": 1, "downloads": 2, "checked": "2026-11-15"}}
        l = {"lot": "Harbour", "type": "Community Space", "gallery": ['AAAAAAAAAAAAAAAAAAAAAQ==', 'AAAAAAAAAAAAAAAAAAAAAg=='],
             "versions": [{"name": "Garden", "upload": "AAAAAAAAAAAAAAAAAAAAAQ=="}, {"name": "Makers", "upload": "AAAAAAAAAAAAAAAAAAAAAg=="}]}
        with patched(build, uploads=ups, comments={}):
            g = build.gallery_for(l)
        self.assertIsNotNone(g)

    def test_build_exits_non_zero_when_admin_data_fails(self):
        src = open(os.path.join(ROOT, 'tools', 'build.py'), encoding='utf-8').read()
        self.assertIn("problems.append(f'Admin data not written: {e}')", src)
        self.assertIn("if problems: sys.exit('\\n'.join(problems))", src)


class SpreadsheetTwice(unittest.TestCase):
    """A clash isn't applied, and it's still a clash at the next import instead of quietly becoming "changed in the app"."""
    SHEET, BASE, APP = TIS.Merge.SHEET, TIS.Merge.BASE, TIS.Merge.APP
    def test_clash_still_a_clash_next_time(self):
        with temp_dir() as d:
            x = os.path.join(d, 'plans.xlsx'); workbook(x, self.SHEET)
            base = os.path.join(d, 'last-import.json'); open(base, 'w', encoding='utf-8').write(json.dumps(as_base(self.BASE)))
            W = world('Testville', lots=self.APP); wp = os.path.join(d, 'testville.json'); save(wp, W)
            fake = types.SimpleNamespace(run=lambda *a, **k: types.SimpleNamespace(stdout='built', stderr=''), DEVNULL=None)
            with patched(IS, BASE=base, DATA=d, world_files=lambda: [wp], subprocess=fake):
                with argv(x, '--apply'), quiet(): IS.main()
                nb = json.load(open(base, encoding='utf-8'))
                with argv(x), quiet() as out: IS.main()
        c = {l['Lot Name']: l for l in nb[1]['sections'][0]['lots']}['C']
        self.assertEqual(c['Lot Size'], '20x20')                    # the clashing cell keeps its old base value
        self.assertIn("Testville / C: Lot Size: spreadsheet '30x30', app '40x40' (was '20x20')", out.getvalue())
        self.assertNotIn("C: Lot Size is", out.getvalue())

    def test_owned_clash_held(self):
        held = [("Testville", 'Owned', False)]
        nb = IS.new_base([{"tab": "Overview", "sections": [], "owned": {"Testville": True}}], held)
        self.assertEqual(nb[0]['owned'], {"Testville": False})

    def test_new_lot_in_unknown_world_stays_new(self):
        sheet = [{"tab": "Overview", "sections": []}, {"tab": "Elsewhere", "sections": [{"name": "Hood", "lots": [{"Lot Name": "Z"}, {"Lot Name": "Y"}]}]}]
        nb = IS.new_base(sheet, [(("Elsewhere", "Z"), None, None)])
        self.assertEqual([l['Lot Name'] for l in nb[1]['sections'][0]['lots']], ['Y'])
        self.assertEqual(len(sheet[1]['sections'][0]['lots']), 2)   # the sheet itself isn't changed


class ShownName(unittest.TestCase):
    def test_order(self):
        fix = {"W|A": "Her Spelling"}
        self.assertEqual(shown_name(fix, "W", {"lot": "A", "mine": "Mine", "gallery": {"title": "T"}}), "Her Spelling")
        self.assertEqual(shown_name({}, "W", {"lot": "A", "mine": "Mine", "gallery": {"title": "T"}}), "T")
        self.assertEqual(shown_name({}, "W", {"lot": "A", "mine": " Mine ", "gallery": None}), "Mine")
        self.assertEqual(shown_name({}, "W", {"lot": "A", "mine": "?"}), "A")
        self.assertEqual(shown_name({}, "W", {"lot": "A", "mine": " ?? "}), "A")
        self.assertEqual(shown_name({}, "W", {"lot": "A"}), "A")


if __name__ == '__main__':
    unittest.main()
