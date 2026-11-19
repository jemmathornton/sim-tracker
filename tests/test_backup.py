"""The weekly backup to GitHub (19 Nov, her ask): gallery_refresh.backup_push() pushes what's committed to origin.
Runs against throwaway repos in a temporary folder only (a local bare repo stands in for GitHub); never the real one."""
import os, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import gallery_refresh as G, admin_data


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


if __name__ == '__main__':
    unittest.main()
