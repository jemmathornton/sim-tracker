"""tools/new_save_checklist.py: her ticks survive a rewrite, lines read cleanly, and the small helpers.
The checklist is written to a temporary file (OUT is swapped), so her real one is never touched."""
import os, re, unittest
from helpers import ROOT, patched, temp_dir, quiet, built_data
import new_save_checklist as NC

REAL = os.path.join(ROOT, 'for-jemma', 'new-save-checklist.md')


class Fresh(unittest.TestCase):
    """One run into a temporary file, shared by the tests below."""
    @classmethod
    def setUpClass(cls):
        cls.t = temp_dir(); d = cls.t.__enter__()
        cls.out = os.path.join(d, 'checklist.md')
        with patched(NC, OUT=cls.out), quiet(): NC.main()
        cls.text = open(cls.out, encoding='utf-8').read()
        cls.lines = cls.text.splitlines()
    @classmethod
    def tearDownClass(cls): cls.t.__exit__(None, None, None)


class Content(Fresh):
    def test_nothing_ticked_from_scratch(self):
        self.assertFalse(any(l.startswith('- [x]') for l in self.lines))

    def test_no_junk(self):
        self.assertIsNone(re.search(r'\b(None|undefined|NaN)\b|\{[A-Z]+\}', self.text))

    def test_curly_apostrophes_on_lot_lines(self):
        bad = [l[:60] for l in self.lines if l.startswith('- [ ] **') and "'" in l]
        self.assertEqual(bad, [])

    def test_every_owned_world_has_a_section(self):
        D = built_data()
        for w in D['worlds']:
            if w.get('ready'): self.assertIn(f"### {w['name']}", self.text)

    def test_lot_lines_unique_by_name_within_a_world(self):
        bad, world, seen = [], None, set()
        for l in self.lines:
            if l.startswith('### '): world, seen = l, set(); continue
            m = re.match(r'- \[ \] \*\*(.+?)\*\*', l)
            if m:
                if m.group(1) in seen: bad.append(f"{world}: {m.group(1)}")
                seen.add(m.group(1))
        self.assertEqual(bad, [])

    def test_fixed_steps_present(self):
        self.assertIn('## 1. Before you start', self.text)
        self.assertIn('“EA untouched”', self.text)

    def test_club_hangouts_line(self):
        self.assertTrue(any(l.startswith('- [ ] Club hangouts') for l in self.lines))


class Ticks(unittest.TestCase):
    """Her ticks are kept by the lot's bold name, so rewording a line never loses one (23 Oct)."""
    def test_ticks_kept_across_rewording(self):
        with temp_dir() as d:
            out = os.path.join(d, 'checklist.md')
            with patched(NC, OUT=out), quiet(): NC.main()
            lines = open(out, encoding='utf-8').read().splitlines()
            lot_line = next(l for l in lines if l.startswith('- [ ] **'))
            name = re.match(r'- \[ \] \*\*(.+?)\*\*', lot_line).group(1)
            step = next(l for l in lines if l.startswith('- [ ] ') and not l.startswith('- [ ] **'))
            open(out, 'w', encoding='utf-8').write(f"- [x] **{name}**: some old wording\n- [x] {step[6:]}\n- [x] A step that no longer exists\n")
            with patched(NC, OUT=out), quiet(): NC.main()
            after = open(out, encoding='utf-8').read().splitlines()
        self.assertIn('- [x] ' + lot_line[6:], after)
        self.assertIn('- [x] ' + step[6:], after)
        self.assertEqual(sum(1 for l in after if l.startswith('- [x]')), 2)


class Helpers(unittest.TestCase):
    def test_unit_name_by_position(self):
        l = {"units": [{"name": "08"}, {"name": "09"}]}
        self.assertEqual(NC.unit_name(l, 2), '09')
        self.assertEqual(NC.unit_name(l, '1'), '08')
        self.assertEqual(NC.unit_name(l, 3), '3')
        self.assertEqual(NC.unit_name({}, 1), '1')

    def test_join(self):
        self.assertEqual(NC.join(['a', 'b', 'c']), 'a, b and c')
        self.assertEqual(NC.join(['a']), 'a')
        self.assertEqual(NC.join([]), '')

    def test_who_label(self):
        self.assertEqual(NC.who_label(None), 'Sims to come')
        self.assertEqual(NC.who_label({"sims": [{"name": "Bella Goth", "origin": "Premade"}]}), 'EA')
        self.assertEqual(NC.who_label({"sims": [{"name": "Kaori X", "origin": "Mine"}]}), 'yours')
        self.assertEqual(NC.who_label({"sims": [{"name": "Gil Grunt", "origin": "Premade", "from": "Maxis Gallery (Library)"}]}), 'Maxis Gallery')
        self.assertEqual(NC.who_label({"sims": [{"name": "Bella Goth", "origin": "Premade"}, {"name": "Kaori X", "origin": "Mine"}]}), 'EA: Bella; yours: Kaori')

    def test_her_type_names_mapped(self):
        self.assertEqual(NC.SAME_T['thrift and bubble tea store'], 'thrift and boba store')
        self.assertEqual(NC.SAME_T['ubrite commons'], 'uob commons')


class RealChecklist(unittest.TestCase):
    """Her own checklist file: well formed (it's rewritten by every build, with her ticks kept)."""
    def test_tick_lines_well_formed(self):
        if not os.path.exists(REAL): self.skipTest('no checklist yet')
        bad = [l[:50] for l in open(REAL, encoding='utf-8').read().splitlines() if l.startswith('- [') and not re.match(r'- \[[ x]\] \S', l)]
        self.assertEqual(bad, [])


if __name__ == '__main__':
    unittest.main()
