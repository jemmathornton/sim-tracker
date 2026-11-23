"""tools/research/filipesims_check.py (23 Nov, her ask): filipesims' post list read and sorted into map news for Admin.
Never touches the network or the project: the page is a small sample in the shape of the real one, the state stays in memory."""
import json, os, unittest
from pathlib import Path
from helpers import temp_dir, patched
import admin_data, gallery_refresh
import filipesims_check as F

ITEM = ('<li class="mMO9uW_postItem"><p class="aE5AjG_root mMO9uW_postDate">{d}</p><a class="XHwQ_a_root" '
        'href="https://www.patreon.com/filipesims_art/posts/{slug}-{id}">{t}</a></li>')
NAV = ('<a class="x" href="https://www.patreon.com/filipesims_art/posts/map-replacement-150881207"><p class="y">Map Replacement Mod</p></a>')


def page(*items):
    return '<ul>' + NAV + ''.join(ITEM.format(d=d, slug=s, id=i, t=t) for d, s, i, t in items) + '</ul>'


BASE = page(('Jun 27', 'chestnut-ridge', 162188998, 'Chestnut Ridge - Map Replacement Mod'),
            ('May 28', 'willow-creek-map', 130042969, 'Willow Creek, Oasis Springs &amp; Newcrest - Map Replacement Mod'),
            ('May 31', 'testing', 130314348, 'Testing 🔧'))


class Posts(unittest.TestCase):
    def test_every_post_once_with_its_title_link_and_date(self):
        ps = F.posts(BASE)
        self.assertEqual([p['id'] for p in ps], ['162188998', '130042969', '130314348'])   # the menu link (with tags inside) isn't a post
        self.assertEqual(ps[1]['title'], 'Willow Creek, Oasis Springs & Newcrest - Map Replacement Mod')
        self.assertEqual(ps[0]['date'], 'Jun 27')
        self.assertTrue(ps[0]['url'].endswith('/posts/chestnut-ridge-162188998'))


class Classify(unittest.TestCase):
    names, on = F.world_names()

    def kind(self, t): return F.classify(t, self.names, self.on)

    def test_a_world_still_on_20th_century_plumbob_is_a_new_world(self):
        self.assertEqual(self.kind('Granite Falls - Map Replacement Mod'), ('world', ['Granite Falls']))
        self.assertEqual(self.kind('Gibbi Point & Ondarion - Map Replacement Mod')[0], 'world')

    def test_a_world_already_on_filipesims_is_a_map_post(self):
        self.assertEqual(self.kind('Chestnut Ridge - Map Replacement Mod'), ('map', ['Chestnut Ridge']))
        self.assertEqual(self.kind('San Myshuno (Midnight & Sunset)'), ('map', ['San Myshuno']))
        self.assertEqual(self.kind('Classic Maps - Map Replacement Mod'), ('map', []))

    def test_patches_and_other_posts(self):
        self.assertEqual(self.kind('March Patch - Mod Update')[0], 'update')
        self.assertEqual(self.kind('Testing 🔧'), (None, []))

    def test_the_nine_worlds_without_filipesims_are_the_ones_flagged(self):
        self.assertEqual(sorted(set(self.names) - self.on), sorted(['Granite Falls', 'Forgotten Hollow', 'Selvadorada', 'StrangerVille',
                         'Glimmerbrook', 'Moonwood Mill', 'Ravenwood', 'Gibbi Point', 'Ondarion']))


class Check(unittest.TestCase):
    def test_first_run_only_notes_what_is_there(self):
        s = F.check(BASE, {}, today='2026-11-23')
        self.assertEqual((s['posts'], len(s['seen']), s['news']), (3, 3, []))

    def test_new_posts_later_become_news_once(self):
        s = F.check(BASE, {}, today='2026-11-23')
        later = page(('Dec 5', 'granite-falls', 170000001, 'Granite Falls - Map Replacement Mod'),
                     ('Dec 6', 'december-patch', 170000002, 'December Patch - Mod Update'),
                     ('Dec 7', 'preview', 170000003, 'Preview 👀')) + BASE
        s = F.check(later, s, today='2026-11-30')
        self.assertEqual([(n['kind'], n['worlds'], n['found']) for n in s['news']],
                         [('world', ['Granite Falls'], '2026-11-30'), ('update', [], '2026-11-30')])
        s = F.check(later, s, today='2026-12-07')
        self.assertEqual(len(s['news']), 2)                         # seen posts never come back as news
        self.assertEqual(s['checked'], '2026-12-07')

    def test_an_empty_or_changed_page_is_an_error_not_an_all_clear(self):
        with self.assertRaises(ValueError): F.check('<html>Patreon changed its page</html>', {}, today='2026-11-23')


class Wiring(unittest.TestCase):
    def test_admin_data_passes_the_news_on(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'research', 'data'))
            news = [{'id': '1', 'title': 'Granite Falls - Map Replacement Mod', 'url': 'u', 'date': 'Dec 5', 'kind': 'world', 'worlds': ['Granite Falls'], 'found': '2026-11-30'}]
            json.dump({'checked': '2026-11-30', 'seen': {'1': 't'}, 'news': news}, open(os.path.join(d, 'research', 'data', 'filipesims-check.json'), 'w', encoding='utf-8'))
            with patched(admin_data, ROOT=Path(d)): m = admin_data.maps_news()
        self.assertEqual(m['checked'], '2026-11-30')
        self.assertEqual(m['news'][0]['worlds'], ['Granite Falls'])
        self.assertNotIn('id', m['news'][0])

    def test_the_weekly_refresh_saves_the_check_with_its_own_files(self):
        self.assertIn('research/data/filipesims-check.json', gallery_refresh.REFRESH_PATHS)
        self.assertTrue(any('filipesims not checked'.startswith(n) or n == 'filipesims not checked' for n in admin_data.NOTES))


if __name__ == '__main__':
    unittest.main()
