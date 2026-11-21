"""The weekly backup to GitHub (19 Nov, her ask): gallery_refresh.backup_push() pushes what's committed to origin.
Runs against throwaway repos in a temporary folder only (a local bare repo stands in for GitHub); never the real one."""
import os, shutil, subprocess, sys, tempfile, time, unittest
from pathlib import Path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import gallery_refresh as G, admin_data
from unittest import mock


def rmtree(p):
    import shutil, stat
    shutil.rmtree(p, onerror=lambda f, path, _: (os.chmod(path, stat.S_IWRITE), f(path)))


class Backup(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='simworld-test-backup-')
        self.repo, self.remote = os.path.join(self.tmp, 'repo'), os.path.join(self.tmp, 'remote.git')
        g = lambda *a, cwd=None: subprocess.run(['git', *a], cwd=cwd or self.repo, capture_output=True, text=True, stdin=subprocess.DEVNULL)
        self.g = g
        os.makedirs(self.repo)
        g('init', '-q', '-b', 'main'); g('config', 'user.email', 't@example.invalid'); g('config', 'user.name', 'Test')
        Path(self.repo, 'a.txt').write_text('one'); g('add', '-A'); g('commit', '-qm', 'one')
        self.said, self.old_say = [], G.say
        G.say = self.said.append

    def tearDown(self):
        G.say = self.old_say
        rmtree(self.tmp)

    def test_no_github_copy_is_skipped(self):
        G.backup_push(root=self.repo)
        self.assertEqual(self.said, ["Backup to GitHub skipped: no GitHub copy set up"])

    def test_pushes_every_commit(self):
        self.g('init', '-q', '--bare', self.remote, cwd=self.tmp)
        self.g('remote', 'add', 'origin', self.remote)
        Path(self.repo, 'a.txt').write_text('two'); self.g('commit', '-qam', 'two')
        G.backup_push(root=self.repo)
        self.assertEqual(self.said, ["Backed up to GitHub"])
        head = self.g('rev-parse', 'HEAD').stdout.strip()
        self.assertEqual(self.g('rev-parse', 'main', cwd=self.remote).stdout.strip(), head)

    def test_a_failed_push_is_a_note_not_a_failed_run(self):
        self.g('remote', 'add', 'origin', os.path.join(self.tmp, 'missing.git'))
        G.backup_push(root=self.repo)
        self.assertEqual(len(self.said), 1)
        self.assertTrue(self.said[0].startswith("Backup to GitHub didn't work"))
        line = self.said[0]
        self.assertTrue(line.startswith(admin_data.NOTES))
        self.assertFalse(any(f in line for f in admin_data.FAILED))

    def remote_with_one_commit(self):
        self.g('init', '-q', '--bare', self.remote, cwd=self.tmp)
        self.g('remote', 'add', 'origin', self.remote)

    def test_pushes_main_only(self):   # 21 Nov review: a worktree's claude/* branch never goes to the public repo
        self.remote_with_one_commit()
        self.g('checkout', '-q', '-b', 'claude/try')
        G.backup_push(root=self.repo)
        self.assertEqual(self.said, ["Backup to GitHub skipped: the project isn't on its main branch"])
        self.assertNotEqual(self.g('rev-parse', '--verify', '-q', 'main', cwd=self.remote).returncode, 0)

    def test_passing_failure_is_tried_once_more(self):
        self.remote_with_one_commit()
        runs, real = [], subprocess.run
        def flaky(args, **kw):
            if args[:2] == ['git', 'push']:
                runs.append(args)
                if len(runs) == 1: return subprocess.CompletedProcess(args, 1, '', "error: cannot lock ref 'refs/heads/main'")
            return real(args, **kw)
        with mock.patch('subprocess.run', flaky), mock.patch.object(G, 'PUSH_RETRY_WAIT', 0):
            G.backup_push(root=self.repo)
        self.assertEqual(len(runs), 2)
        self.assertEqual(self.said, ["Backed up to GitHub"])
        self.assertTrue(all('--force' not in a and '-f' not in a for a in runs))

    def test_lasting_failure_is_not_retried(self):
        self.g('remote', 'add', 'origin', os.path.join(self.tmp, 'missing.git'))
        runs, real = [], subprocess.run
        def count(args, **kw):
            if args[:2] == ['git', 'push']: runs.append(args)
            return real(args, **kw)
        with mock.patch('subprocess.run', count), mock.patch.object(G, 'PUSH_RETRY_WAIT', 0):
            G.backup_push(root=self.repo)
        self.assertEqual(len(runs), 1)


HOOK = os.path.join(ROOT, 'tools', 'git-hooks', 'post-commit')


class PostCommitHook(unittest.TestCase):
    """The post-commit hook (tools/git-hooks/post-commit, copied to .git/hooks): pushes main in the background, never a
    claude/* branch, never when the weekly refresh says it will push itself; a failure goes to logs/push.log."""
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='simworld-test-hook-')
        self.repo, self.remote = os.path.join(self.tmp, 'repo'), os.path.join(self.tmp, 'remote.git')
        env = {k: v for k, v in os.environ.items() if k != G.NO_HOOK_PUSH}
        self.g = lambda *a, cwd=None, env=env: subprocess.run(['git', *a], cwd=cwd or self.repo, capture_output=True, text=True, stdin=subprocess.DEVNULL, env=env)
        os.makedirs(self.repo)
        self.g('init', '-q', '-b', 'main'); self.g('config', 'user.email', 't@example.invalid'); self.g('config', 'user.name', 'Test')
        self.g('init', '-q', '--bare', self.remote, cwd=self.tmp); self.g('remote', 'add', 'origin', self.remote)
        shutil.copy(HOOK, os.path.join(self.repo, '.git', 'hooks', 'post-commit'))

    def tearDown(self):
        end = time.time() + 20   # a background push may still hold its files for a moment
        while True:
            try: rmtree(self.tmp); break
            except OSError:
                if time.time() > end: raise
                time.sleep(0.5)

    def commit(self, text, **kw):
        Path(self.repo, 'a.txt').write_text(text); self.g('add', '-A'); self.g('commit', '-qm', text, **kw)
        return self.g('rev-parse', 'HEAD').stdout.strip()

    def remote_main(self, want=None, wait=15):
        end = time.time() + wait
        while True:
            got = self.g('rev-parse', '--verify', '-q', 'main', cwd=self.remote).stdout.strip()
            if got == want or time.time() > end: return got
            time.sleep(0.25)

    def test_commit_on_main_is_pushed(self):
        head = self.commit('one')
        self.assertEqual(self.remote_main(head), head)

    def test_skipped_when_the_refresh_pushes_itself(self):
        self.commit('one', env=dict(os.environ, **{G.NO_HOOK_PUSH: '1'}))
        self.assertEqual(self.remote_main(wait=3), '')

    def test_claude_branch_never_pushed(self):
        self.g('checkout', '-q', '-b', 'claude/try')
        self.commit('one')
        self.assertEqual(self.remote_main(wait=3), '')
        self.assertEqual(self.g('branch', '--list', '-r').stdout.strip(), '')

    def test_failure_written_to_push_log(self):
        self.g('remote', 'set-url', 'origin', os.path.join(self.tmp, 'missing.git'))
        self.commit('one')
        log = os.path.join(self.repo, 'logs', 'push.log'); end = time.time() + 15
        while not (os.path.exists(log) and os.path.getsize(log)) and time.time() < end: time.sleep(0.25)
        self.assertIn('push of', open(log, encoding='utf-8').read())

    def test_hook_never_forces(self):
        text = Path(HOOK).read_text(encoding='utf-8')
        self.assertNotIn('--force', text); self.assertNotRegex(text, r'push.* -f\b')

    def test_live_hook_is_this_one(self):
        live = os.path.join(ROOT, '.git', 'hooks', 'post-commit')
        if not os.path.exists(live): self.skipTest('no live hook (a fresh clone)')
        self.assertEqual(Path(live).read_text(encoding='utf-8'), Path(HOOK).read_text(encoding='utf-8'))

    def test_logs_kept_out_of_git(self):
        self.assertIn('logs/', Path(ROOT, '.gitignore').read_text(encoding='utf-8').split())


if __name__ == '__main__':
    unittest.main()
