"""tools/build.py: the rules it applies to her Gallery text and uploads, the history totals, and the page stamp.
Gallery data here are small made-up fixtures (build's own uploads/comments/fixes are swapped in for each test)."""
import base64, os, re, unittest, uuid
from helpers import SITE, patched, temp_dir, lot, built_data
import build

UP_ID = lambda n: base64.b64encode(uuid.UUID(int=n, version=4).bytes).decode()   # random-style (version 4) ids: no date inside


def upload(title, fav=0, dl=0, lot_type='Residential', desc='', beds=0, baths=0, packs=()):
    return {"title": title, "kind": "lot", "description": desc, "lotType": lot_type, "size": "30x20", "price": 12345,
            "beds": beds, "baths": baths, "packs": list(packs), "images": [], "favourites": fav, "downloads": dl,
            "creator": "JemmaTheSimmer", "checked": "2026-11-08"}


class Gallery(unittest.TestCase):
    """Runs build's Gallery helpers against fixture uploads."""
    def setUp(self):
        self.ups, self.coms, self.fix = {}, {}, {}
        self.p = patched(build, uploads=self.ups, comments=self.coms, fixes=self.fix); self.p.__enter__()
    def tearDown(self): self.p.__exit__(None, None, None)

    def add(self, n, *a, **kw):
        i = UP_ID(n); self.ups[i] = upload(*a, **kw); return i


class BritishSpelling(Gallery):
    def test_common_words(self):
        self.assertEqual(build.british('my favorite cozy neighborhood'), 'my favourite cosy neighbourhood')
        self.assertEqual(build.british('gray colors'), 'grey colours')

    def test_capitals_follow_the_word(self):
        self.assertEqual(build.british('Favorite'), 'Favourite')
        self.assertEqual(build.british('COLOR'), 'COLOUR')

    def test_plurals(self):
        self.assertEqual(build.british('neighbors and favorites'), 'neighbours and favourites')

    def test_game_names_keep_their_spelling(self):
        for name in ('Evergreen Harbor', 'Information Center', 'Rec Center', 'Theater'):
            self.assertEqual(build.british(name), name)
        self.assertEqual(build.british('the town center'), 'the town centre')

    def test_unknown_words_untouched(self):
        s = 'Colorado and Honore stay as they are'
        self.assertEqual(build.british(s), s)


class UploadEntry(Gallery):
    def test_text_stops_at_the_hashtags_and_keeps_them_as_tags(self):
        i = self.add(1, 'Rose Cottage', desc='A cozy home.  #willowcreek #playtested')
        e = build.upload_entry(i)
        self.assertEqual(e['description'], 'A cosy home.')
        self.assertEqual(e['tags'], ['willowcreek', 'playtested'])

    def test_text_fixes_applied_before_british(self):
        i = self.add(2, 'Dusty Turf', desc='an lab isthe best color')
        self.fix[i] = {"description": [["an lab", "a lab"], ["isthe", "is the"]]}
        self.assertEqual(build.upload_entry(i)['description'], 'a lab is the best colour')

    def test_doubled_apostrophes(self):
        i = self.add(3, '930 Medina', desc="It''s home")
        self.assertEqual(build.upload_entry(i)['description'], "It's home")

    def test_title_drops_challenge_brackets(self):
        i = self.add(4, 'Kin-Ship [Simsie Shell]')
        self.assertEqual(build.upload_entry(i)['title'], 'Kin-Ship')

    def test_pack_names_short_and_old_slogans_renamed(self):
        i = self.add(5, 'X', packs=['The Sims™ 4 Seasons Expansion Pack', 'Build Lush Gardens', 'The Sims™ 4 Courtyard Oasis Kit'])
        self.assertEqual(build.upload_entry(i)['packs'], ['Seasons', 'Romantic Garden Stuff', 'Courtyard Oasis'])

    def test_value_and_counts(self):
        i = self.add(6, 'X', fav=3, dl=40)
        e = build.upload_entry(i)
        self.assertEqual(e['value'], '§12,345')
        self.assertEqual((e['likes'], e['downloads']), (3, 40))

    def test_html_in_comments_unescaped(self):
        i = self.add(7, 'X'); self.coms[i] = [{"m": "love it &lt;3", "t": 1, "u": "a"}]
        self.assertEqual(build.upload_entry(i)['commentList'][0]['m'], 'love it <3')

    def test_shared_month_only_for_time_based_ids(self):
        t1 = base64.b64encode(uuid.uuid1(node=1, clock_seq=1).bytes).decode()
        self.assertRegex(build.shared_on(t1), r'^[A-Z][a-z]{2} \d{4}$')
        self.assertIsNone(build.shared_on(UP_ID(8)))


class OneUploadPerLot(Gallery):
    def test_no_uploads(self):
        self.assertIsNone(build.gallery_for(lot('A')))

    def test_most_popular_leads(self):
        a, b = self.add(10, 'Old', fav=1, dl=5), self.add(11, 'New', fav=9, dl=50)
        g = build.gallery_for(lot('A', gallery=[a, b]))
        self.assertEqual(g['title'], 'New')

    def test_her_lead_wins(self):
        a, b = self.add(12, 'Old', fav=1, dl=5), self.add(13, 'New', fav=9, dl=50)
        g = build.gallery_for(lot('A', gallery=[a, b], galleryLead=a))
        self.assertEqual(g['title'], 'Old')

    def test_comments_of_every_copy_add_up_newest_first(self):
        a, b = self.add(14, 'A'), self.add(15, 'A again')
        self.coms[a] = [{"m": "old", "t": 1, "u": "x"}]; self.coms[b] = [{"m": "new", "t": 5, "u": "y"}]
        g = build.gallery_for(lot('A', gallery=[a, b]))
        self.assertEqual(g['comments'], 2)
        self.assertEqual([c['m'] for c in g['commentList']], ['new', 'old'])

    def test_rental_and_regular_versions_kept(self):
        home, rent = self.add(16, 'Slip 42', dl=100), self.add(17, 'Slip 42 Rental', dl=5, lot_type='Residential Rental')
        g = build.gallery_for(lot('Slip 42', type='Residential Rental (2)', gallery=[home, rent]))
        self.assertEqual(g['title'], 'Slip 42 Rental')   # the plan's type leads
        self.assertEqual([o['title'] for o in g['others']], ['Slip 42'])

    def test_missing_translation_taken_as_the_plans_type(self):
        lib, back = self.add(18, 'Glimmer', dl=99, lot_type='Library'), self.add(19, 'Glimmer B', dl=1, lot_type='Missing sims translation')
        g = build.gallery_for(lot('Glimmer', type='Library/Backroom', gallery=[lib, back], galleryVariants=True))
        self.assertEqual(g['lotType'], 'Library')
        self.assertEqual(g['others'][0]['label'], 'Backroom')

    def test_community_space_versions(self):
        cs, gd = self.add(20, 'Newcrest Community Space'), self.add(21, 'Newcrest Garden', dl=500)
        g = build.gallery_for(lot('N', type='Community Space', gallery=[cs, gd], versions=[{"label": "Garden", "upload": gd}]))
        self.assertEqual(g['title'], 'Newcrest Community Space')
        self.assertEqual(g['label'], 'Community space')
        self.assertEqual(g['others'][0]['label'], 'Garden')

    def test_apartment_beds_from_the_plan(self):
        a = self.add(22, 'Flat 4')
        g = build.gallery_for(lot('Flat 4', type='Apartment', gallery=[a], beds=2, baths=1))
        self.assertEqual((g['beds'], g['baths']), (2, 1))

    def test_old_upload_marked(self):
        a = self.add(23, 'A')
        self.assertTrue(build.gallery_for(lot('A', gallery=[a], galleryOld=True))['old'])


class Residents(unittest.TestCase):
    def test_household(self):
        self.assertEqual(build.residents('Goth'), ('Goth', False, ''))

    def test_unsure(self):
        self.assertEqual(build.residents('Goth?'), ('Goth', True, ''))
        self.assertEqual(build.residents('?'), (None, True, 'To be decided'))

    def test_notes(self):
        self.assertEqual(build.residents('Empty'), (None, False, 'Empty'))
        self.assertEqual(build.residents('2 Bed'), (None, False, '2 Bed'))
        self.assertEqual(build.residents('(for rent)'), (None, False, 'for rent'))
        self.assertEqual(build.residents('N/A'), (None, False, ''))
        self.assertEqual(build.residents(None), (None, False, ''))

    def test_own_kept(self):
        self.assertEqual(build.residents('Cahyaputri (own)')[0], 'Cahyaputri own')

    def test_planning_marks_dropped(self):
        self.assertEqual(build.residents('Goth *WithUpdates*')[0], 'Goth')
        self.assertEqual(build.residents('Goth (move!)+')[0], 'Goth')


class History(unittest.TestCase):
    def test_totals_and_gains(self):
        a, b = UP_ID(30), UP_ID(31)
        rows = ['date,id,favourites,downloads,comments', f'2026-11-01,{a},1,10,0', f'2026-11-01,{b},0,5,0',
                f'2026-11-08,{a},2,15,1', f'2026-11-08,{b},0,5,0', '2026-10-12,zzz,0,0,0']
        with temp_dir() as d:
            open(os.path.join(d, 'history.csv'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
            ups = {a: upload('Alpha'), b: upload('Beta')}
            with patched(build, GALLERY=d, uploads=ups):
                h = build.gallery_history({a: {"id": "l-x--alpha", "world": "X"}})
        self.assertEqual([x['date'] for x in h['dates']], ['8 Nov 2026', '1 Nov 2026'])   # the 12 Oct hand rows are too few to count
        self.assertEqual(h['dates'][0]['gain'], {"favourites": 1, "downloads": 5, "comments": 1})
        self.assertEqual(h['since'], '1 Nov 2026')
        self.assertEqual([g['title'] for g in h['gains']], ['Alpha'])   # Beta gained nothing
        self.assertEqual(h['gains'][0]['lot'], {"id": "l-x--alpha", "world": "X"})


class Photos(unittest.TestCase):
    def test_exterior_first_floor_plans_last(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'shots', 'w', 'l'))
            for f in ('floor-plan.jpg', 'kitchen.jpg', 'front.jpg', 'front.thumb.jpg', 'back-garden.jpg'):
                open(os.path.join(d, 'shots', 'w', 'l', f), 'w').close()
            with patched(build, SITE=d):
                got = [p['src'].split('/')[-1] for p in build.photos_for('w', 'l', False)]
        self.assertEqual(got, ['front.jpg', 'back-garden.jpg', 'kitchen.jpg', 'floor-plan.jpg'])

    def test_gallery_picture_only_with_an_upload(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'gallery', 'w')); open(os.path.join(d, 'gallery', 'w', 'l.jpg'), 'w').close()
            with patched(build, SITE=d):
                self.assertEqual(build.photos_for('w', 'l', False), [])
                self.assertEqual(build.photos_for('w', 'l', True)[0]['src'], 'gallery/w/l.jpg')

    def test_captions(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'shots', 'w', 'l')); open(os.path.join(d, 'shots', 'w', 'l', 'i-love-it.jpg'), 'w').close()
            with patched(build, SITE=d):
                self.assertEqual(build.photos_for('w', 'l', False)[0]['caption'], 'I Love It')

    def test_missing_pictures_found(self):
        with temp_dir() as d:
            open(os.path.join(d, 'here.jpg'), 'w').close()
            with patched(build, SITE=d):
                got = build.missing_pictures({"a": [{"src": "here.jpg", "thumb": "gone.jpg"}], "map": "maps/x.jpg?v=12345678"})
        self.assertEqual(got, ['gone.jpg', 'maps/x.jpg'])


class PageStamp(unittest.TestCase):
    def test_code_files_get_fingerprints(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'js'))
            open(os.path.join(d, 'js', 'app.js'), 'w').write('one')
            open(os.path.join(d, 'site.css'), 'w').write('css')
            open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write('<link href="site.css?v=old"><script src="js/app.js"></script><script src="js/none.js"></script>')
            with patched(build, SITE=d):
                build.stamp_page(); first = open(os.path.join(d, 'index.html'), encoding='utf-8').read()
                open(os.path.join(d, 'js', 'app.js'), 'w').write('two')
                build.stamp_page(); second = open(os.path.join(d, 'index.html'), encoding='utf-8').read()
        self.assertRegex(first, r'href="site\.css\?v=[0-9a-f]{8}"')
        self.assertRegex(first, r'src="js/app\.js\?v=[0-9a-f]{8}"')
        self.assertIn('src="js/none.js"', first)   # a missing file is left alone
        self.assertNotEqual(re.search(r'app\.js\?v=\w+', first).group(0), re.search(r'app\.js\?v=\w+', second).group(0))

    def test_real_page_is_stamped(self):
        page = open(os.path.join(SITE, 'index.html'), encoding='utf-8').read()
        for f in re.findall(r'(?:href|src)="((?:js/[\w.-]+\.js)|site\.css)[?"]', page):
            self.assertRegex(page, re.escape(f) + r'\?v=[0-9a-f]{8}"', f)


class BuiltData(unittest.TestCase):
    """site/js/data.js as last built: what the build promises the page."""
    @classmethod
    def setUpClass(cls): cls.D = built_data()

    def test_only_owned_worlds_have_lots(self):
        for w in self.D['worlds']:
            if not w['owned']: self.assertEqual(w['hoods'], [], w['name'])

    def test_every_plan_lot_in_stats(self):
        from helpers import LOTS
        self.assertEqual(len(self.D['stats']), len(LOTS))

    def test_gallery_cards_british_and_curly_enough(self):
        bad = []
        for w in self.D['worlds']:
            for h in w['hoods']:
                for l in h['lots']:
                    g = l.get('gallery')
                    if g and re.search(r'\b(favorite|neighborhood|colorful|cozy)\b', g['description'], re.I): bad.append(l['lot'])
        self.assertEqual(bad, [])

    def test_name_fix_only_for_display_names(self):
        from helpers import LOTS
        want = {f"{W['name']}|{l['lot']}": l['displayName'] for ws, W, h, l in LOTS if l.get('displayName')}
        self.assertEqual(self.D['nameFix'], want)

    def test_meta(self):
        self.assertRegex(self.D['meta']['built'], r'^\d{4}-\d\d-\d\d$')


if __name__ == '__main__':
    unittest.main()
