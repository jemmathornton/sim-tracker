"""Runs last (unittest goes through the files in name order): no test wrote into the project, and no test left a temporary
folder behind (19 Nov: the git-repo tests used to leave theirs, as Windows won't delete git's read-only files)."""
import glob, os, tempfile, unittest
from helpers import AT_START, snapshot

TEMPS_AT_START = set(glob.glob(os.path.join(tempfile.gettempdir(), 'simworld-test-*')))


class Untouched(unittest.TestCase):
    def test_no_project_file_written(self):
        now = snapshot()
        changed = sorted(k for k in set(AT_START) | set(now) if AT_START.get(k) != now.get(k))
        self.assertEqual(changed, [], 'files the tests changed, added or removed in the project')

    def test_no_temporary_folders_left(self):
        left = set(glob.glob(os.path.join(tempfile.gettempdir(), 'simworld-test-*'))) - TEMPS_AT_START
        self.assertEqual(sorted(left), [])


if __name__ == '__main__':
    unittest.main()
