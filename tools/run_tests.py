"""Run every test (23 Oct; the site's own tests added 9 Nov). Changes nothing.

    python -X utf8 tools/run_tests.py                 # Python tests, then the site tests
    python -X utf8 tools/run_tests.py --python-only   # just the Python tests (a few seconds)

1. Python tests in tests/*.py: the tools' own rules and the plan's consistency, and that the build runs.
2. Site tests in tests/site/*.spec.js (Playwright, about a minute): every page draws cleanly at laptop and phone width
   (the same check as tools/check_pages.js), getting around by clicking, her rules as the pages show them, the
   site's own workings (family words, counts) and the layout. They run in the Microsoft Edge already on the PC
   (no browser download), with the portable Node in .tools/node and the packages in node_modules (`npm install`
   with that Node puts them back if they're missing; package.json lists them). playwright.config.js serves site/
   on port 8011 while they run.

Run after changing tools/, data/ or site/. Exits non-zero if anything fails.
"""
import os, subprocess, sys, unittest, warnings
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NODE = os.path.join(ROOT, '.tools', 'node', 'node.exe')
PLAYWRIGHT = os.path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js')


def python_tests():
    warnings.simplefilter('ignore', ResourceWarning)   # the build reads some files without closing them: harmless
    suite = unittest.defaultTestLoader.discover(os.path.join(ROOT, 'tests'))
    return unittest.TextTestRunner(verbosity=1, warnings='ignore').run(suite).wasSuccessful()


def site_tests():
    missing = [p for p in (NODE, PLAYWRIGHT) if not os.path.exists(p)]
    if missing:
        print('\nSite tests SKIPPED: missing ' + ', '.join(os.path.relpath(p, ROOT) for p in missing)
              + ' (put the portable Node in .tools/node, then run its npm install in the project folder).')
        return None
    print('\nSite tests (Playwright, in Edge):', flush=True)
    return subprocess.run([NODE, PLAYWRIGHT, 'test'], cwd=ROOT).returncode == 0


def summary(ok, site, python_only=False):
    """The last line: never "All tests passed." when the site tests didn't run (19 Nov)."""
    if not ok or site is False: return '\nSome tests FAILED.'
    if site is None: return '\nPython tests passed; site tests ' + ('not run (--python-only).' if python_only else 'SKIPPED (see above).')
    return '\nAll tests passed.'


if __name__ == '__main__':
    ok = python_tests()
    site = None if '--python-only' in sys.argv else site_tests()
    if site is False: ok = False
    print(summary(ok, site, '--python-only' in sys.argv))
    sys.exit(0 if ok else 1)
