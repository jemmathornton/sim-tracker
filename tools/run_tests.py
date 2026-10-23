"""Run the tests in tests/ (23 Oct): the tools' own rules and the plan's consistency. Changes nothing.

    python -X utf8 tools/run_tests.py

Run after changing tools/ or data/, next to the page check (tools/check_pages.js in the app's preview).
"""
import os, sys, unittest, warnings
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if __name__ == '__main__':
    warnings.simplefilter('ignore', ResourceWarning)   # the build reads some files without closing them: harmless
    suite = unittest.defaultTestLoader.discover(os.path.join(ROOT, 'tests'))
    ok = unittest.TextTestRunner(verbosity=1, warnings='ignore').run(suite).wasSuccessful()
    sys.exit(0 if ok else 1)
