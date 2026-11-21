"""tools/gallery_refresh.py run as the weekly task (its `if __name__ == '__main__':` part), with EA's Gallery, the build and
the new-save check replaced: the log is written as the run goes, a failed build or an error shows as failed on Admin, a run
killed partway shows as failed, and the automatic commit takes only what the run changed (in a throwaway git repo).
Nothing in the project is touched: the log, the repo and every file live in a temporary folder."""
import os, re, shutil, subprocess, textwrap, types, unittest
from pathlib import Path
from unittest import mock
from helpers import patched, temp_dir, argv, quiet
import admin_data, gallery_refresh as G

SRC = open(G.__file__, encoding='utf-8').read()
_HEAD = "\nif __name__ == '__main__':\n"   # the one at the start of a line (the import guard near the top has an indented one)
MAIN = compile(textwrap.dedent(SRC[SRC.index(_HEAD) + len(_HEAD):]), G.__file__ + ' (main part)', 'exec')
REAL_RUN = subprocess.run


def done_line(): G.say("267 uploads listed on the Gallery, 0 new"); G.say("Done: 1 favourites, 2 downloads, 3 comments across 267 uploads")


class MainPart(unittest.TestCase):
    """Runs the main part in gallery_refresh's own namespace, with LOG, ROOT, main() and subprocess.run swapped for the test."""
    def setUp(self):
        self.t = temp_dir(); self.d = self.t.__enter__()
        self.log = os.path.join(self.d, 'logs', 'gallery-refresh.log')
        self.calls = []

    def tearDown(self): self.t.__exit__(None, None, None)

    def git(self, *a): return REAL_RUN(['git', *a], cwd=self.d, capture_output=True, text=True, encoding='utf-8', stdin=subprocess.DEVNULL)

    @classmethod
    def setUpClass(cls):
        """A throwaway repo shaped like the project (one world file, the Gallery numbers, a note outside the refresh's folders),
        made once and copied for each test (git is slow to start on Windows)."""
        cls.tt = temp_dir(); cls.template = cls.tt.__enter__()
        g = lambda *a: REAL_RUN(['git', *a], cwd=cls.template, capture_output=True, stdin=subprocess.DEVNULL)
        for p in ('data/worlds', 'data/gallery'): os.makedirs(os.path.join(cls.template, p))
        for f in ('data/worlds/a.json', 'data/gallery/uploads.json', 'notes.txt'): open(os.path.join(cls.template, f), 'w').write('1\n')
        g('init', '-q'); g('config', 'user.name', 'Test'); g('config', 'user.email', 'test@example.invalid')
        g('config', 'core.autocrlf', 'false'); g('add', '-A'); g('commit', '-qm', 'start')

    @classmethod
    def tearDownClass(cls): cls.tt.__exit__(None, None, None)

    def repo(self): shutil.copytree(self.template, self.d, dirs_exist_ok=True)

    def run_main(self, main, build=0, check=(0, ''), flags=()):
        """build: the build's exit code (or a list, one per build); check: the new-save check's (exit code, message)."""
        builds = list(build) if isinstance(build, (list, tuple)) else [build] * 3
        def fake_run(args, **kw):
            if args and args[0] == 'git': return REAL_RUN(args, **kw)   # git runs for real, in the temporary repo
            name = os.path.basename(args[-1]); self.calls.append(name)
            if name == 'build.py':
                rc = builds.pop(0); return types.SimpleNamespace(returncode=rc, stdout='Wrote site\\js\\data.js: ok' if rc == 0 else '', stderr='' if rc == 0 else 'Pictures missing from site/: a.jpg')
            if name == 'new_save_check.py': return types.SimpleNamespace(returncode=check[0], stdout='', stderr=check[1])
            raise AssertionError(f'unexpected program: {args}')
        keys = set(G.__dict__)
        code = None
        try:
            with patched(G, LOG=self.log, LIVE=False, ROOT=self.d, report=[], main=main, NOTES_SRC=os.path.join(self.d, 'no-memory-here')), mock.patch('subprocess.run', fake_run), argv(*flags), quiet():
                try: exec(MAIN, G.__dict__)
                except SystemExit as e: code = e.code
        finally:
            for k in set(G.__dict__) - keys: del G.__dict__[k]   # the main part's own variables (ok, before, r, n)
        self.assertIs(G.LIVE, False)
        return code, open(self.log, encoding='utf-8').read()

    def runs(self, text=None):
        if text is not None: open(self.log, 'w', encoding='utf-8').write(text)
        with patched(admin_data, ROOT=Path(self.d)): return admin_data.refresh_runs()


class LogAsItGoes(MainPart):
    def test_each_line_is_in_the_log_while_the_run_is_still_going(self):
        seen = []
        def main():
            seen.append(open(self.log, encoding='utf-8').read()); done_line(); seen.append(open(self.log, encoding='utf-8').read()); return True
        self.repo()
        code, log = self.run_main(main)
        self.assertEqual(code, 0)
        self.assertRegex(seen[0], r'^Gallery refresh, \d\d \w{3} \d{4} \d\d:\d\d, started\n$')
        self.assertIn('267 uploads listed on the Gallery, 0 new\n', seen[1])
        self.assertTrue(log.startswith(seen[1]))
        self.assertTrue(log.endswith('Finished\n\n'))
        self.assertEqual(self.calls, ['build.py', 'new_save_check.py', 'build.py'])
        r = self.runs()[-1]
        self.assertTrue(r['ok'], r); self.assertEqual(r['listed'], 267)

    def test_two_runs_append(self):
        self.repo()
        def main(): done_line(); return True
        self.run_main(main); code, log = self.run_main(main)
        self.assertEqual(log.count(', started\n'), 2)
        self.assertEqual([r['ok'] for r in self.runs()], [True, True])


class Failures(MainPart):
    def test_failed_build_is_a_failed_run_and_nothing_is_committed(self):
        self.repo()
        def main(): open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('2\n'); done_line(); return True
        code, log = self.run_main(main, build=1)
        self.assertEqual(code, 1)
        self.assertIn('Pictures missing from site/: a.jpg\nBuild failed\n', log)
        self.assertTrue(log.endswith('Finished with problems\n\n'))
        self.assertEqual(self.calls, ['build.py'])                               # no new-save check after a failed build
        self.assertEqual(self.git('rev-list', '--count', 'HEAD').stdout.strip(), '1')
        r = self.runs()[-1]
        self.assertFalse(r['ok']); self.assertIn('Pictures missing from site/: a.jpg', r['notes'])

    def test_error_in_the_refresh_is_logged_with_its_traceback(self):
        self.repo()
        def main(): G.say("267 uploads listed on the Gallery, 0 new"); raise RuntimeError('EA changed its answer')
        code, log = self.run_main(main)
        self.assertEqual(code, 1)
        self.assertIn('Stopped with an error:\nTraceback', log)
        self.assertIn('RuntimeError: EA changed its answer', log)
        self.assertTrue(log.endswith('Finished with problems\n\n'))
        self.assertEqual(self.calls, [])
        self.assertFalse(self.runs()[-1]['ok'])

    def test_some_uploads_not_fetched_still_builds_and_saves_but_is_not_ok(self):
        self.repo()
        def main(): open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('2\n'); done_line(); return False
        code, log = self.run_main(main)
        self.assertEqual(code, 1)
        self.assertIn('Saved in the project history', log)
        self.assertTrue(log.endswith('Finished with problems\n\n'))
        self.assertFalse(self.runs()[-1]['ok'])

    def test_run_killed_partway_shows_as_failed(self):
        """A run stopped mid-way (PC asleep, task killed) leaves its first lines and no "Finished"; Admin calls it failed."""
        self.repo()
        killed = []
        def main(): done_line(); killed.append(open(self.log, encoding='utf-8').read()); return True
        _, full = self.run_main(main)
        good = self.runs()
        self.assertTrue(good[-1]['ok'])
        runs = self.runs(full + killed[0])            # a later run that got as far as "Done:" and then stopped
        self.assertEqual(len(runs), 2)
        self.assertTrue(runs[0]['ok'])
        self.assertFalse(runs[1]['ok']); self.assertIn('stopped before it finished', runs[1]['notes'])

    def test_new_save_check_failing_never_stops_the_refresh(self):
        self.repo()
        def main(): done_line(); return True
        code, log = self.run_main(main, check=(1, 'no save called "Jemma\'s Sim World"'))
        self.assertEqual(code, 0)
        self.assertIn('New-save check not refreshed: no save called "Jemma\'s Sim World"', log)
        self.assertEqual(self.calls, ['build.py', 'new_save_check.py'])          # no second build when the check failed
        self.assertTrue(log.endswith('Finished\n\n'))
        r = self.runs()[-1]
        self.assertTrue(any('New-save check not refreshed' in n for n in r['notes']))   # Admin shows why the check wasn't rerun

    def test_new_save_check_failing_leaves_the_run_ok_on_admin(self):   # fixed 19 Nov: a finished run with a note, not an error
        self.repo()
        def main(): done_line(); return True
        self.run_main(main, check=(1, 'no save'))
        r = self.runs()[-1]
        self.assertTrue(r['ok'])
        self.assertIn('New-save check not refreshed: no save', r['notes'])

    def test_failed_build_after_the_new_save_check_is_a_failed_run_and_nothing_is_committed(self):   # 19 Nov
        self.repo()
        def main(): open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('2\n'); done_line(); return True
        code, log = self.run_main(main, build=[0, 1])
        self.assertEqual(code, 1)
        self.assertEqual(self.calls, ['build.py', 'new_save_check.py', 'build.py'])
        self.assertIn('Pictures missing from site/: a.jpg\nBuild failed (after the new-save check)\n', log)
        self.assertNotIn('New-save check refreshed', log)
        self.assertTrue(log.endswith('Finished with problems\n\n'))
        self.assertEqual(self.git('rev-list', '--count', 'HEAD').stdout.strip(), '1')
        r = self.runs()[-1]
        self.assertFalse(r['ok']); self.assertIn('Build failed (after the new-save check)', r['notes'])

    def test_no_build_flag(self):
        self.repo()
        def main(): open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('2\n'); done_line(); return True
        code, log = self.run_main(main, flags=('--no-build',))
        self.assertEqual(code, 0)
        self.assertEqual(self.calls, [])
        self.assertNotIn('Saved in the project history', log)
        self.assertEqual(self.git('rev-list', '--count', 'HEAD').stdout.strip(), '1')


class AutomaticCommit(MainPart):
    def test_only_files_the_run_changed(self):
        self.repo()
        open(os.path.join(self.d, 'data/worlds/a.json'), 'w').write('her edit in progress\n')   # before the run
        open(os.path.join(self.d, 'notes.txt'), 'w').write('elsewhere\n')
        def main():
            open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('new numbers\n')
            os.makedirs(os.path.join(self.d, 'data/gallery/more')); open(os.path.join(self.d, 'data/gallery/more/x.json'), 'w').write('{}\n')
            done_line(); return True
        code, log = self.run_main(main)
        self.assertEqual(code, 0)
        files = sorted(self.git('show', '--name-only', '--format=', 'HEAD').stdout.split())
        self.assertEqual(files, ['data/gallery/more/x.json', 'data/gallery/uploads.json'])
        self.assertRegex(self.git('log', '-1', '--format=%s').stdout.strip(), r'^Weekly Gallery refresh, \d\d \w{3} \d{4} \(automatic\)$')
        self.assertIn('left out of the automatic save (already being changed before the refresh): data/worlds/a.json', log)
        status = self.git('status', '--porcelain').stdout
        self.assertIn(' M data/worlds/a.json', status); self.assertIn(' M notes.txt', status)

    def test_files_left_changed_by_a_failed_run_are_saved_next_time(self):   # 19 Nov: before, every later run skipped them
        self.repo()
        open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('from a failed run\n')   # dirty before this run
        def main(): open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('new numbers\n'); done_line(); return True
        code, log = self.run_main(main)
        self.assertEqual(code, 0)
        self.assertEqual(self.git('show', '--name-only', '--format=', 'HEAD').stdout.split(), ['data/gallery/uploads.json'])
        self.assertNotIn('left out of the automatic save', log)
        self.assertNotIn('data/gallery', self.git('status', '--porcelain').stdout)

    def test_refresh_only_file_dirty_but_unchanged_this_run_is_still_saved(self):
        self.repo()
        open(os.path.join(self.d, 'data/gallery/uploads.json'), 'w').write('left by last week\n')
        def main(): done_line(); return True
        self.run_main(main)
        self.assertEqual(self.git('show', '--name-only', '--format=', 'HEAD').stdout.split(), ['data/gallery/uploads.json'])

    def test_nothing_changed_nothing_committed(self):
        self.repo()
        def main(): done_line(); return True
        code, log = self.run_main(main)
        self.assertEqual(code, 0)
        self.assertIn('Nothing new to save in the project history', log)
        self.assertEqual(self.git('rev-list', '--count', 'HEAD').stdout.strip(), '1')

    def test_commit_never_pushes(self):   # 21 Nov: pushing is backup_push()'s job alone, main only, never forced
        commit = SRC[SRC.index('def commit_refresh'):SRC.index('def backup_push')]
        self.assertNotIn("'push'", commit)
        self.assertIn('NO_HOOK_PUSH', commit)                                  # the hook's own push is switched off for this commit
        self.assertEqual(len(re.findall(r"'push'", SRC)), 1)
        self.assertIn("['git', 'push', 'origin', 'main']", SRC)
        self.assertNotIn('--force', SRC)

    def test_hand_edits_and_what_is_built_from_them_left_out(self):
        self.repo()
        os.makedirs(os.path.join(self.d, 'site/js'))
        for f in ('site/index.html', 'site/js/data.js'): open(os.path.join(self.d, f), 'w').write('1\n')
        self.git('add', '-A'); self.git('commit', '-qm', 'site')
        open(os.path.join(self.d, 'site/index.html'), 'w').write('her edit\n')
        open(os.path.join(self.d, 'data/worlds/a.json'), 'w').write('her edit\n')
        def main():
            for f in ('site/index.html', 'site/js/data.js', 'data/gallery/uploads.json'): open(os.path.join(self.d, f), 'w').write('new\n')
            done_line(); return True
        code, log = self.run_main(main)
        self.assertEqual(code, 0)
        self.assertEqual(self.git('show', '--name-only', '--format=', 'HEAD').stdout.split(), ['data/gallery/uploads.json'])
        self.assertIn('left out of the automatic save: site/js/data.js (built from changes not saved yet: data/worlds/a.json)', log)
        self.assertIn('already being changed before the refresh): data/worlds/a.json, site/index.html', log)


if __name__ == '__main__':
    unittest.main()
