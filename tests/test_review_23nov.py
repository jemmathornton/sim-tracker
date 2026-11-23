"""Overnight review, 23 Nov: no dead page code. Every function or constant defined at the top level of js/app.js and
js/sections.js is used somewhere (buildingCard, aAn and wDot had been left behind), and site.css has no rules for the
removed building card (.bcard). Reads the site's own files only."""
import os, re, unittest
from helpers import ROOT

SITE = os.path.join(ROOT, 'site')
read = lambda *p: open(os.path.join(SITE, *p), encoding='utf-8').read()
# used outside these files: tools/check_pages.js and the site tests ask for SECTION_KEYS
USED_ELSEWHERE = {'SECTION_KEYS'}


class NoDeadPageCode(unittest.TestCase):
    def test_every_top_level_name_is_used(self):
        src = read('js', 'app.js') + '\n' + read('js', 'sections.js') + '\n' + read('index.html')
        names = {m.group(1) or m.group(2) for m in re.finditer(r'^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=)', src, re.M)}
        unused = []
        for n in sorted(names - USED_ELSEWHERE):
            e = re.escape(n)
            # a use is the bare name or a spread (...name), not a property of something else (x.name)
            uses = len(re.findall(r'(?<![\w$.])' + e + r'(?![\w$])', src)) + len(re.findall(r'\.\.\.' + e + r'(?![\w$])', src))
            if uses < 2: unused.append(n)
        self.assertEqual(unused, [], 'defined but never used in the page code')

    def test_no_rules_for_the_removed_building_card(self):
        self.assertNotIn('.bcard', read('site.css'))


if __name__ == '__main__':
    unittest.main()
