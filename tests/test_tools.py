"""Tests for the scripts behind the site (23 Oct). Run them all:

    python -X utf8 -m unittest discover -s tests -v

Two kinds: small checks of the tools' own rules (the Residents column, British spelling, names), and checks that the plan
in data/ hangs together (every unit a household is put in exists, every Gallery id is a real upload, and so on). Nothing here
changes any file. The page check (tools/check_pages.js, run in the app's preview) still covers what the pages show.
"""
import json, os, re, sys, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from common import DATA, SITE, load, slug, norm, world_files
import build, lot_traits

WORLDS = [(os.path.basename(p)[:-5], load(p)) for p in world_files()]
LOTS = [(ws, W, h, l) for ws, W in WORLDS for h in W['neighbourhoods'] for l in h['lots']]
UPLOADS = load(os.path.join(DATA, 'gallery', 'uploads.json'))['uploads']
UNITS_IN_TYPE = lambda l: int(m.group(1)) if (m := re.search(r'\((\d+)\)', l.get('type') or '')) else 0


def checklist_text():
    """The new-save checklist as main() writes it, into a temporary file (her real one, with her ticks, is never touched)."""
    import contextlib, io, tempfile, new_save_checklist
    d = tempfile.mkdtemp(); out = os.path.join(d, 'checklist.md'); old = new_save_checklist.OUT
    new_save_checklist.OUT = out
    try:
        with contextlib.redirect_stdout(io.StringIO()): new_save_checklist.main()
        with open(out, encoding='utf-8') as f: return f.read()
    finally:
        new_save_checklist.OUT = old
        import shutil; shutil.rmtree(d, ignore_errors=True)


class ResidentsColumn(unittest.TestCase):
    """build.residents(): her Residents column -> (household name, unsure, note)."""
    def test_no_household(self):
        for who in (None, 'N/A', '', '  '):
            self.assertEqual(build.residents(who), (None, False, ''))

    def test_notes_not_households(self):
        self.assertEqual(build.residents('Empty'), (None, False, 'Empty'))
        self.assertEqual(build.residents('2 Bed'), (None, False, '2 Bed'))
        self.assertEqual(build.residents('Large 3 Bedroom'), (None, False, 'Large 3 Bedroom'))
        self.assertEqual(build.residents('(Current uni sims)'), (None, False, 'Current uni sims'))
        self.assertEqual(build.residents('?'), (None, True, 'To be decided'))

    def test_planning_marks_dropped(self):
        self.assertEqual(build.residents('The Scotts (*NPC)'), ('The Scotts', False, ''))
        self.assertEqual(build.residents('Specter *WithUpdates*'), ('Specter', False, ''))
        self.assertEqual(build.residents('Davidson?'), ('Davidson', True, ''))
        self.assertEqual(build.residents('Moody & McMillan'), ('Moody & McMillan', False, ''))

    def test_own(self):
        # "(own)": the family owns this rental and lives in it; "X own": owns it, lives elsewhere (both kept as " own")
        self.assertEqual(build.residents('Cahyaputri (own)'), ('Cahyaputri own', False, ''))
        self.assertEqual(build.residents('Kirkland own'), ('Kirkland own', False, ''))


class PackNames(unittest.TestCase):
    """The Gallery calls two Stuff Packs by old slogans; the site shows their real names (23 Oct)."""
    def test_slogans(self):
        self.assertEqual(build.short_pack("Build Lush Gardens"), "Romantic Garden Stuff")
        self.assertEqual(build.short_pack("Watch Movies with Friends!"), "Movie Hangout Stuff")
        self.assertEqual(build.short_pack("The Sims™ 4 Dine Out"), "Dine Out")


class GalleryNames(unittest.TestCase):
    """Her Library copies made under her old names count as hers (2 Nov: Pier Perfection, a MsTiquelle copy)."""
    def test_old_names(self):
        import gallery_refresh
        for n in ("JemmaTheSimmer", "MsTiquelle", "MissTiquelle"): self.assertIn(n.lower(), gallery_refresh.OWN_NAMES)


class HerList(unittest.TestCase):
    """Her list is one line per item: Admin > Notes doesn't show indented lines (6 Nov: three items' sub-points were hidden)."""
    def test_no_indented_lines(self):
        text = open(os.path.join(ROOT, 'for-jemma', 'your-list.md'), encoding='utf-8').read()
        self.assertEqual([l for l in text.splitlines() if re.match(r'\s+\S', l)], [])


class NewSaveChecklist(unittest.TestCase):
    """Her new-save checklist is made from the plan (23 Oct): every owned world has a section, nothing reads None."""
    def test_made_from_plan(self):
        text = checklist_text()
        self.assertIn("## 6. World by world", text)
        for p in world_files():
            W = load(p)
            if W.get('owned'): self.assertIn("### " + W['name'], text)
        self.assertNotRegex(text, r"\bNone\b|\(\)")


class NewSaveCheck(unittest.TestCase):
    """The new-save tools (23–24 Oct): unit numbers in the plan are positions; the Library check reads library-ready.md."""
    def test_unit_names(self):
        import new_save_checklist
        l = {"units": [{"name": "08"}, {"name": "09"}]}
        self.assertEqual(new_save_checklist.unit_name(l, 2), "09")
        self.assertEqual(new_save_checklist.unit_name(l, 1), "08")
        self.assertEqual(new_save_checklist.unit_name({"units": []}, 3), "3")
    def test_story_rules(self):
        # every Neighbourhood Stories rule has her pick (24 Oct), and the venue names load
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'research'))
        import new_save_check as n
        self.assertEqual(set(n.NS_RULES), set(n.NS_PICKS))
        self.assertIn("Vacation Rental", n.VENUES.values())
    def test_own_rental_is_landlords_home(self):
        # "Greenburg own" on a rental, with no other Greenburg home in the world: they live there (as the site reads it)
        text = checklist_text()
        self.assertRegex(text, r"Rockridge Springs\*\*.*Greenburg \([^)]*landlord")


class BritishSpelling(unittest.TestCase):
    """build.british(): her Gallery text in British spelling on the site; game names keep theirs (CLAUDE.md)."""
    def test_words(self):
        self.assertEqual(build.british('The neighborhood color is cozy'), 'The neighbourhood colour is cosy')
        self.assertEqual(build.british('favorites'), 'favourites')
        self.assertEqual(build.british('Mom'), 'Mum')

    def test_capitals_kept(self):
        self.assertEqual(build.british('Color'), 'Colour')

    def test_game_names_and_other_words_untouched(self):
        for t in ('Information Center in Evergreen Harbor', 'momentum', 'Rec Center'):
            self.assertEqual(build.british(t), t)


class Names(unittest.TestCase):
    def test_slug(self):
        self.assertEqual(slug("Proprietor's Square"), 'proprietor-s-square')
        self.assertEqual(slug('Chee-wít Chee-waa'), 'chee-wit-chee-waa')

    def test_norm(self):
        self.assertEqual(norm('The Inner Circle'), norm('the inner  circle'))

    def test_gallery_titles(self):
        self.assertEqual(build.clean_title('Kin-Ship [Simsie Shell]'), 'Kin-Ship')
        self.assertEqual(build.short_pack('The Sims™ 4 Seasons Expansion Pack'), 'Seasons')

    def test_unit_names(self):
        # her own unit names in game, shortened to what isn't the lot's name
        self.assertEqual(lot_traits.unit_name('3A Cobblebottom Street', ['3 Cobblebottom Street']), '3A')
        self.assertEqual(lot_traits.unit_name('09 Taka Soi 15', ['Taka Soi 15']), '09')


class ThePlan(unittest.TestCase):
    """data/ hangs together. A failure names the world and lot."""
    def test_lot_fields(self):
        need = ('lot', 'type', 'built', 'shared')
        bad = [f"{W['name']} / {l.get('lot')}: no {k}" for ws, W, h, l in LOTS for k in need if k not in l]
        self.assertEqual(bad, [])

    def test_lot_names_unique_in_a_world(self):
        bad = []
        for ws, W in WORLDS:
            seen = {}
            for h in W['neighbourhoods']:
                for l in h['lots']:
                    k = slug(l['lot'])
                    if k in seen: bad.append(f"{W['name']}: {l['lot']} twice ({seen[k]}, {h['name']})")
                    seen[k] = h['name']
        self.assertEqual(bad, [])

    def test_gallery_ids_are_uploads(self):
        bad = [f"{W['name']} / {l['lot']}: {i}" for ws, W, h, l in LOTS for i in l.get('gallery', []) if i not in UPLOADS]
        bad += [f"{W['name']} / {l['lot']}: galleryLead {l['galleryLead']} not in its gallery" for ws, W, h, l in LOTS
                if l.get('galleryLead') and l['galleryLead'] not in l.get('gallery', [])]
        self.assertEqual(bad, [])

    def test_units_where_households_live(self):
        """residentsUnit and each tenant's unit are units the rental has; units match the "(N)" in its type."""
        bad = []
        for ws, W, h, l in LOTS:
            n = UNITS_IN_TYPE(l)
            if l.get('units') and n and len(l['units']) != n: bad.append(f"{W['name']} / {l['lot']}: {len(l['units'])} units, type says {n}")
            for k, u in [('residentsUnit', l.get('residentsUnit'))] + [('tenant ' + t['name'], t.get('unit')) for t in l.get('tenants', [])]:
                if u and n and not 1 <= u <= n: bad.append(f"{W['name']} / {l['lot']}: {k} in unit {u} of {n}")
            units = [t.get('unit') for t in l.get('tenants', []) if t.get('unit')] + ([l['residentsUnit']] if l.get('residentsUnit') else [])
            if len(units) != len(set(units)): bad.append(f"{W['name']} / {l['lot']}: two households in one unit {units}")
        self.assertEqual(bad, [])

    def test_unit_counts(self):
        bad = [f"{W['name']} / {l['lot']} unit {u.get('name')}: {u.get('beds')} beds, {u.get('baths')} baths" for ws, W, h, l in LOTS
               for u in l.get('units', []) if (u.get('beds') is not None and u['beds'] < 1) or (u.get('baths') is not None and u['baths'] < 1)]
        self.assertEqual(bad, [])

    def test_unshared_lots_have_nothing_from_a_save(self):
        """Her rule: only shared lots take traits from a save (rentals' units are her exception)."""
        bad = [f"{W['name']} / {l['lot']}" for ws, W, h, l in LOTS if not l.get('shared') and (l.get('traits') or l.get('challenges'))]
        self.assertEqual(bad, [])

    def test_people_links(self):
        """Parents and partners point at Sims that exist (in a household or people.json)."""
        ids = set(load(os.path.join(DATA, 'people.json'))) - {'_note'}
        sims = []
        for ws, W in WORLDS:
            for hh in W.get('households', {}).values():
                for s in hh.get('sims', []):
                    if s.get('id'): ids.add(s['id']); sims.append(s)
        people = {k: v for k, v in load(os.path.join(DATA, 'people.json')).items() if k != '_note'}
        sims += list(people.values())
        bad = [f"{s.get('name')}: parent {p}" for s in sims for p in s.get('parents', []) if p not in ids]
        bad += [f"{s.get('name')}: partner {p[0]}" for s in sims for p in s.get('partners', []) if p[0] not in ids]
        self.assertEqual(bad, [])

    def test_sim_ids_unique(self):
        seen, bad = {}, []
        for ws, W in WORLDS:
            for hn, hh in W.get('households', {}).items():
                for s in hh.get('sims', []):
                    if s.get('id') in seen: bad.append(f"{s['id']}: {seen[s['id']]} and {W['name']} / {hn}")
                    if s.get('id'): seen[s['id']] = f"{W['name']} / {hn}"
        self.assertEqual(bad, [])

    def test_calendar_holidays(self):
        cal = load(os.path.join(DATA, 'calendar.json'))
        days = {'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'}
        bad = [h['name'] for h in cal.get('holidays', []) + cal.get('gameHolidays', [])
               if h.get('season') not in cal['seasons'] or not 1 <= h.get('week', 0) <= cal['seasonWeeks'] or h.get('day') not in days]
        self.assertEqual(bad, [])


class TheBuild(unittest.TestCase):
    """The build runs and every picture it lists exists (it writes nothing here)."""
    def test_build(self):
        data = build.build()
        self.assertEqual(build.missing_pictures(data), [])
        self.assertTrue(data['worlds'])


if __name__ == '__main__':
    unittest.main()
