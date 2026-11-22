"""The site tests' server (tests/site/serve.py, 22 Nov): /family/... comes from Jemma's Journals' site/family, and nothing outside it."""
import importlib.util, os, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('serve', os.path.join(ROOT, 'tests', 'site', 'serve.py'))
serve = importlib.util.module_from_spec(spec); spec.loader.exec_module(serve)


class FamilyFiles(unittest.TestCase):
    def test_the_family_folder_is_the_parents(self):
        self.assertEqual(os.path.normpath(serve.FAMILY), os.path.normpath(os.path.join(ROOT, '..', 'site', 'family')))

    @unittest.skipUnless(os.path.isdir(serve.FAMILY), "not inside Jemma's Journals")
    def test_family_files_found(self):
        for f in ('mode.js', 'family.css', 'family.js'):
            self.assertEqual(serve.family_file('/family/' + f + '?v=1'), os.path.realpath(os.path.join(serve.FAMILY, f)))

    def test_nothing_outside_the_family_folder(self):
        for p in ('/family/', '/family/../index.html', '/family/..%2findex.html', '/family/%2e%2e/%2e%2e/sim-world/site/index.html',
                  '/family/..\\..\\x', '/family/C:/Windows/win.ini', '/family/nope.js', '/index.html', '/familyx/mode.js'):
            self.assertIsNone(serve.family_file(p), p)


if __name__ == '__main__':
    unittest.main()
