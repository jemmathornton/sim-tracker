"""tools/admin_data.py: her list and the refresh log as Admin > Notes reads them (fixtures in a temporary folder)."""
import json, os, re, unittest
from pathlib import Path
from helpers import ROOT, patched, temp_dir
import admin_data

LIST = """# Your list (23 Oct)

Intro text that isn't an item.

## Before the new save: decide first
- **Decide:** Premade fix.
- ~~**Do:** Something done.~~

**Willow Creek**
- **Decide:** Hallow Slough.

**Moonwood Mill** (not owned)
- **Decide:** Library or Backroom?

## Any time
- **Do:** Take screenshots of the {noShots} shared lots with none.
"""

LOG = """Gallery refresh, 01 Nov 2026 08:54
220 uploads listed on the Gallery, 1 new
  linked new upload “Pier Perfection” to Sulani / Pier Perfection
  new upload “Odd” not linked to a lot; listed in data/gallery/unlinked.json
Done: 100 favourites, 2000 downloads, 30 comments across 221 uploads

Gallery refresh, 08 Nov 2026 08:54
Stopped with an error:
Traceback (most recent call last):
URLError: boom
"""


class Folder(unittest.TestCase):
    def setUp(self):
        self.t = temp_dir(); self.d = self.t.__enter__()
        for p in ('for-jemma', 'logs', 'data/gallery', 'research/data'): os.makedirs(os.path.join(self.d, p))
        open(os.path.join(self.d, 'for-jemma', 'your-list.md'), 'w', encoding='utf-8').write(LIST)
        open(os.path.join(self.d, 'logs', 'gallery-refresh.log'), 'w', encoding='utf-8').write(LOG)
        self.p = patched(admin_data, ROOT=Path(self.d), OUT=Path(self.d) / 'admin-data.js'); self.p.__enter__()
    def tearDown(self):
        self.p.__exit__(None, None, None); self.t.__exit__(None, None, None)


class HerList(Folder):
    def test_items_with_section_and_world(self):
        items = admin_data.checklist()
        self.assertEqual([(i['section'], i['world'], i['text'][:9]) for i in items], [
            ("Before the new save: decide first", "", "**Decide:"),
            ("Before the new save: decide first", "Willow Creek", "**Decide:"),
            ("Before the new save: decide first", "Moonwood Mill (not owned)", "**Decide:"),
            ("Any time", "", "**Do:** T")])

    def test_struck_items_left_out(self):
        self.assertFalse(any('Something done' in i['text'] for i in admin_data.checklist()))

    def test_live_words_kept_for_the_page(self):
        self.assertIn('{noShots}', admin_data.checklist()[-1]['text'])

    def test_world_resets_at_a_new_section(self):
        self.assertEqual(admin_data.checklist()[-1]['world'], '')


class RefreshLog(Folder):
    def test_runs(self):
        a, b = admin_data.refresh_runs()
        self.assertTrue(a['ok']); self.assertFalse(b['ok'])
        self.assertEqual((a['listed'], a['new'], a['favourites'], a['downloads'], a['comments']), (220, 1, 100, 2000, 30))
        self.assertEqual(len(a['linked']), 1)
        self.assertEqual(b['when'], '08 Nov 2026 08:54')


class Gather(Folder):
    def test_to_sort_and_no_new_save(self):
        open(os.path.join(self.d, 'data', 'gallery', 'to-sort.json'), 'w', encoding='utf-8').write(json.dumps({"abc==": {"title": "T", "lot": None, "why": "w"}}))
        out = admin_data.gather()
        self.assertEqual(out['toSort'], [{"id": "abc==", "title": "T", "lot": None, "why": "w"}])
        self.assertIsNone(out['newSave'])

    def test_write_makes_a_script(self):
        admin_data.write()
        text = open(os.path.join(self.d, 'admin-data.js'), encoding='utf-8').read()
        self.assertTrue(text.startswith('// Built by tools/admin_data.py'))
        data = json.loads(text[text.index('window.ADMIN = ') + 15:].rstrip().rstrip(';'))
        self.assertEqual(len(data['checklist']), 4)

    def test_new_save_summary(self):
        status = {"saved": "2026-11-01 20:00", "worlds": {
            "Willow Creek": [{"lot": "A", "name": "A", "status": "placed", "issues": ["missing trait: Homey"]},
                             {"lot": "B", "name": "B", "status": "to place", "issues": []}],
            "Oasis Springs": [{"lot": "C", "name": "C", "status": "game lot", "issues": []}]},
            "households": [{"world": "Willow Creek", "household": "Goth", "lot": "A", "unit": None, "state": "elsewhere"}],
            "ahead": [{"world": "Oasis Springs", "lot": "C", "household": "Landgraab", "goes": "x"}]}
        open(os.path.join(self.d, 'research', 'data', 'new-save-status.json'), 'w', encoding='utf-8').write(json.dumps(status))
        ns = admin_data.new_save()
        wc = ns['worlds'][0]
        self.assertEqual((wc['world'], wc['placed'], wc['toPlace']), ("Willow Creek", 1, ["B"]))
        self.assertEqual(wc['fixes'], [{"lot": "A", "what": ["missing trait: Homey"]}])
        self.assertEqual(wc['move'][0]['household'], 'Goth')
        self.assertEqual(ns['worlds'][1]['world'], 'Oasis Springs')   # not started, but someone lives on a lot to place
        self.assertEqual(ns['notStarted'], ['Oasis Springs'])
        self.assertEqual(set(ns['lots']), {'l-willow-creek--a', 'l-willow-creek--b'})


class RealList(unittest.TestCase):
    """Her real list reads cleanly: every item has a Do or Decide, live words are ones the page knows."""
    def test_items_are_do_or_decide(self):
        bad = [i['text'][:60] for i in admin_data.checklist() if not re.match(r'\*\*(Do|Decide):\*\*', i['text'])]
        self.assertEqual(bad, [])

    def test_live_words_known_to_the_page(self):
        sections = open(os.path.join(ROOT, 'site', 'js', 'sections.js'), encoding='utf-8').read()
        words = {w for i in admin_data.checklist() for w in re.findall(r'\{(\w+)\}', i['text'])}
        self.assertEqual({w for w in words if not re.search(r'\b' + w + r'\b', sections)}, set())


if __name__ == '__main__':
    unittest.main()
