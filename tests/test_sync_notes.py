"""tools/sync_notes.py (19 Nov): Claude's notes mirrored into claude-notes/ for the GitHub backup. Temporary folders only."""
import os, shutil, sys, tempfile, unittest
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tools'))
import sync_notes


class SyncNotes(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='simworld-test-notes-')
        self.src, self.out = os.path.join(self.tmp, 'memory'), os.path.join(self.tmp, 'claude-notes')
        os.makedirs(self.src); os.makedirs(self.out)
    def tearDown(self): shutil.rmtree(self.tmp)
    def put(self, d, name, text):
        with open(os.path.join(d, name), 'w', encoding='utf-8') as f: f.write(text)
    def read(self, name): return open(os.path.join(self.out, name), encoding='utf-8').read()

    def test_copies_new_and_changed_removes_deleted_keeps_readme(self):
        self.put(self.src, 'MEMORY.md', '- index'); self.put(self.src, 'a.md', 'one')
        self.put(self.out, 'README.md', 'mine'); self.put(self.out, 'old.md', 'gone'); self.put(self.out, 'a.md', 'stale')
        c, r = sync_notes.sync(self.src, self.out)
        self.assertEqual((c, r), (['MEMORY.md', 'a.md'], ['old.md']))
        self.assertEqual(self.read('a.md'), 'one'); self.assertEqual(self.read('README.md'), 'mine')
        self.assertEqual(sync_notes.sync(self.src, self.out), ([], []))   # nothing changed: nothing written

    def test_no_memory_folder_does_nothing(self):
        self.assertEqual(sync_notes.sync(os.path.join(self.tmp, 'nope'), self.out), ([], []))


if __name__ == '__main__':
    unittest.main()
