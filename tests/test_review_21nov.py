"""Fixes from the 21 Nov review: her lot type names for Gallery types, British spelling that leaves the game's own names
alone, paragraph breaks in bios, deaths in the game's words, neighbourhood descriptions against the game's text, and the
temporary-file rule in .gitignore. Fixtures only, plus read-only checks of the plan."""
import base64, os, re, unittest, uuid
from helpers import ROOT, WORLDS, HOUSEHOLDS, PEOPLE, DATA, built_data, patched
from common import load, her_type, lead_upload
import build
import hood_descriptions as HD


def upload(title, lot_type, fav=0):
    return {"title": title, "kind": "lot", "description": "", "lotType": lot_type, "size": "30x20", "price": 1, "beds": 0, "baths": 0,
            "packs": [], "images": [], "favourites": fav, "downloads": 0, "creator": "JemmaTheSimmer", "checked": "2026-11-21"}


class HerLotTypeNames(unittest.TestCase):
    def test_gallery_names_become_hers(self):
        self.assertEqual(her_type('Thrift and Bubble Tea Store'), 'Thrift and Boba Store')
        self.assertEqual(her_type('UBrite Commons'), 'UoB Commons')
        self.assertEqual(her_type('Residential'), 'Residential')
        self.assertEqual(her_type(''), '')

    def test_upload_card_shows_her_name(self):
        i = base64.b64encode(uuid.UUID(int=7, version=4).bytes).decode()   # a Gallery-style id
        with patched(build, uploads={i: upload('Boba Barn', 'Thrift and Bubble Tea Store')}, comments={}, fixes={}):
            self.assertEqual(build.upload_entry(i)['lotType'], 'Thrift and Boba Store')

    def test_kept_versions_match_the_plan_type_by_her_name(self):
        ups = {'a': upload('Boba Barn', 'Thrift and Bubble Tea Store'), 'b': upload('Boba Barn', 'Residential Rental', fav=50)}
        lot = {"lot": "Boba Barn", "type": "Thrift and Boba Store", "gallery": ['a', 'b'], "galleryVariants": True}
        self.assertEqual(lead_upload(lot, ups), 'a')   # the one matching the plan's type leads, not the more popular rental

    def test_no_game_name_on_the_built_site(self):
        D = built_data()
        types = set()
        def walk(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == 'lotType' and isinstance(v, str): types.add(v)
                    else: walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(D)
        self.assertFalse([t for t in types if 'Bubble Tea' in t or t.startswith('UBrite')])


class BritishKeepsGameNames(unittest.TestCase):
    def test_energizing(self):
        self.assertEqual(build.british('an energizing, energized space'), 'an energising, energised space')
        self.assertEqual(build.british('Energizing'), 'Energising')

    def test_festival_name_kept(self):
        self.assertEqual(build.british('home of the Humor and Hijinks Festival, my favorite'), 'home of the Humor and Hijinks Festival, my favourite')

    def test_lykke_center_kept(self):
        self.assertEqual(build.british('near Lykke Center, in the center'), 'near Lykke Center, in the centre')

    def test_plan_names_are_kept(self):   # in-game lot names from the plan that british() would otherwise change
        self.assertIn('The Cozy Corner House', build.proper_names())
        self.assertEqual(build.british('I rebuilt The Cozy Corner House, a cozy home'), 'I rebuilt The Cozy Corner House, a cosy home')


class PlanText(unittest.TestCase):
    def test_no_escaped_line_breaks_in_bios(self):   # 21 Nov: "\n\n" was stored as text in two bios
        bad = [hn for W, hn, hh in HOUSEHOLDS for k in ('bio', 'story') if '\\n' in (hh.get(k) or '')]
        self.assertEqual(bad, [])

    def test_deaths_in_the_games_words(self):
        game = {v.get('died') for v in load(os.path.join(DATA, 'game', 'ancestors.json')).values() if isinstance(v, dict)}
        for k, p in PEOPLE.items():
            if p.get('died'): self.assertIn(p['died'], game, k)

    def test_arts_quarter_matches_the_game(self):
        W = dict(WORLDS)['san-myshuno']
        h = next(h for h in W['neighbourhoods'] if h['name'] == 'Arts Quarter')
        self.assertIn('Humor and Hijinks Festival', h['desc'])


class HoodDescriptions(unittest.TestCase):
    GAME = ["Fresh, new, and arrestingly shiny. Lykke Centre is where new commercial enterprise in Windenburg thrives.",
            "This family-friendly neighborhood has a lovely picnic area and a striking city skyline backdrop.",
            "Mirage Canyon is Oasis Spring’s true oasis. Something else entirely, nothing like the rest."]

    def test_sorted_into_match_near_and_none(self):
        hoods = [("W", "Exact", "This family-friendly neighborhood has a lovely picnic area and a striking city skyline backdrop."),
                 ("W", "Near", "Fresh, new, and arrestingly shiny, Lykke Centre is where new commercial enterprise in Windenburg thrives."),
                 ("W", "None", "A quiet spot by the river where nobody has ever been.")]
        r = HD.check(hoods, self.GAME)
        self.assertEqual([x[1] for x in r['match']], ['Exact'])
        self.assertEqual([x[1] for x in r['near']], ['Near'])
        self.assertEqual([x[1] for x in r['none']], ['None'])

    def test_curly_quotes_still_match(self):
        r = HD.check([("W", "Q", "Mirage Canyon is Oasis Spring's true oasis. Something else entirely, nothing like the rest.")], self.GAME)
        self.assertEqual(len(r['match']), 1)

    def test_differences_named(self):
        self.assertEqual(HD.differences("shiny, Lykke", "shiny. Lykke"), ["“shiny,” → “shiny.”"])

    def test_british_spelling_only(self):
        self.assertTrue(HD.british_only("This family-friendly neighbourhood has a lovely picnic area.", "This family-friendly neighborhood has a lovely picnic area."))
        self.assertFalse(HD.british_only("A cosy place.", "A cozy place, often."))


class Hygiene(unittest.TestCase):
    def test_temporary_files_ignored(self):
        self.assertIn('*.tmp', open(os.path.join(ROOT, '.gitignore'), encoding='utf-8').read().split('\n'))


if __name__ == '__main__':
    unittest.main()
