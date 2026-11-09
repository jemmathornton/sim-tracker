"""tools/gallery_refresh.py, with EA's Gallery and her Library replaced by fixtures: nothing goes online, and every file
it writes goes to a temporary folder."""
import json, os, sys, types, unittest
from helpers import patched, temp_dir, world, lot, quiet
from common import save, load
import gallery_refresh as G

TODAY = '2026-11-09'


def up(title, kind='lot', desc='', fav=0, dl=0, creator='JemmaTheSimmer'):
    return {"title": title, "kind": kind, "description": desc, "lotType": "Residential", "size": "", "price": 0, "beds": 0, "baths": 0,
            "packs": [], "images": [], "favourites": fav, "downloads": dl, "creator": creator, "checked": TODAY}


class Folder(unittest.TestCase):
    """A temporary data/gallery with an empty unlinked.json; the Gallery's member lookup answers from self.members."""
    def setUp(self):
        self.t = temp_dir(); self.d = self.t.__enter__()
        save(os.path.join(self.d, 'unlinked.json'), {"_note": "", "uploads": {}})
        self.members = {}
        self.p = patched(G, GALLERY=self.d, TODAY=TODAY, report=[], say=lambda s: None,
                         api=lambda path: (200, {"data": {"typeDetails": {"members": self.members.get(path.split('/')[2].split('?')[0], [])}}}))
        self.p.__enter__()
    def tearDown(self):
        self.p.__exit__(None, None, None); self.t.__exit__(None, None, None)

    def unlinked(self): return load(os.path.join(self.d, 'unlinked.json'))['uploads']
    def to_sort(self):
        p = os.path.join(self.d, 'to-sort.json'); return load(p) if os.path.exists(p) else {}


class AutoLinkLots(Folder):
    def test_title_naming_one_lot_links(self):
        W = world(lots=[lot('Rose Cottage'), lot('Thorn House')])
        linked = G.auto_link(['a'], {'a': up('Rose Cottage')}, [W])
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['gallery'], ['a'])
        self.assertEqual(linked, [W])
        self.assertEqual(self.unlinked(), {})
        self.assertEqual(self.to_sort(), {})

    def test_her_own_name_counts(self):
        W = world(lots=[lot('Plateau Place', myName='SU Plateau Residence')])
        G.auto_link(['a'], {'a': up('SU Plateau Residence')}, [W])
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['gallery'], ['a'])

    def test_loose_match_ignores_the_and_brackets(self):
        W = world(lots=[lot('Old Mill')])
        G.auto_link(['a'], {'a': up('The Old Mill (SoupShell)')}, [W])
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['gallery'], ['a'])

    def test_no_match_goes_to_unlinked_and_to_sort(self):
        W = world(lots=[lot('Rose Cottage')])
        self.assertEqual(G.auto_link(['a'], {'a': up('Bubble World')}, [W]), [])
        self.assertIn('no lot in the plan has this name', self.unlinked()['a']['why'])
        self.assertEqual(self.to_sort()['a']['lot'], None)
        self.assertNotIn('gallery', W['neighbourhoods'][0]['lots'][0])

    def test_hashtag_alone_never_links(self):
        W = world(lots=[lot('Rose Cottage')])
        G.auto_link(['a'], {'a': up('My Pretty House', desc='#rosecottage #testville')}, [W])
        self.assertNotIn('gallery', W['neighbourhoods'][0]['lots'][0])
        self.assertIn('could be Testville / Rose Cottage', self.unlinked()['a']['why'])

    def test_two_worlds_same_name_world_tag_decides(self):
        A, B = world('Alphaville', lots=[lot('Town Hall')]), world('Betaville', lots=[lot('Town Hall')])
        G.auto_link(['a'], {'a': up('Town Hall', desc='#betaville')}, [A, B])
        self.assertNotIn('gallery', A['neighbourhoods'][0]['lots'][0])
        self.assertEqual(B['neighbourhoods'][0]['lots'][0]['gallery'], ['a'])

    def test_two_worlds_same_name_no_tag_not_linked(self):
        A, B = world('Alphaville', lots=[lot('Town Hall')]), world('Betaville', lots=[lot('Town Hall')])
        G.auto_link(['a'], {'a': up('Town Hall')}, [A, B])
        self.assertNotIn('gallery', A['neighbourhoods'][0]['lots'][0])
        self.assertIn('could be', self.unlinked()['a']['why'])

    def test_worlds_she_doesnt_own_skipped(self):
        W = world(owned=False, lots=[lot('Rose Cottage')])
        G.auto_link(['a'], {'a': up('Rose Cottage')}, [W])
        self.assertNotIn('gallery', W['neighbourhoods'][0]['lots'][0])

    def test_second_copy_linked_and_listed_to_sort(self):
        W = world(lots=[lot('Rose Cottage', gallery=['old'])])
        G.auto_link(['a'], {'a': up('Rose Cottage')}, [W])
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['gallery'], ['old', 'a'])
        self.assertIn('another copy of this build', self.to_sort()['a']['why'])

    def test_unreadable_upload_waits(self):
        W = world(lots=[lot('Rose Cottage')])
        self.assertEqual(G.auto_link(['a'], {}, [W]), [])
        self.assertEqual(self.unlinked(), {})

    def test_other_kinds_ignored(self):
        W = world(lots=[lot('Rose Cottage')])
        G.auto_link(['a'], {'a': up('Rose Cottage', kind='sim')}, [W])
        self.assertEqual(self.unlinked(), {})


class AutoLinkHouseholds(Folder):
    def hh(self, **kw): return {"sims": [{"name": "Bella Goth", "age": "Adult"}, {"name": "Cassandra Goth", "age": "Teen"}], **kw}

    def test_household_title_links(self):
        W = world(households={"Goth": self.hh()})
        self.members['a'] = [{"firstName": "Bella", "lastName": "Goth", "age": 32}, {"firstName": "Cassandra", "lastName": "Goth", "age": 8}]
        G.auto_link(['a'], {'a': up('Goth', kind='household')}, [W])
        self.assertEqual(W['households']['Goth']['gallery'], ['a'])
        self.assertEqual(self.to_sort(), {})

    def test_numbered_household_counts_as_its_name(self):
        W = world(households={"Davidson 1": {"sims": []}})
        G.auto_link(['a'], {'a': up('Davidson', kind='household')}, [W])
        self.assertEqual(W['households']['Davidson 1']['gallery'], ['a'])

    def test_differences_listed_to_sort(self):
        W = world(households={"Goth": self.hh()})
        self.members['a'] = [{"firstName": "Bella", "lastName": "Goth", "age": 64}, {"firstName": "Alexander", "lastName": "Goth", "age": 4}]
        G.auto_link(['a'], {'a': up('Goth', kind='household')}, [W])
        why = self.to_sort()['a']['why']
        self.assertIn('only on the Gallery: Alexander Goth', why)
        self.assertIn('only on the site: Cassandra Goth', why)
        self.assertIn('Bella Goth is Elder on the Gallery, Adult on the site', why)
        self.assertEqual(W['households']['Goth']['gallery'], ['a'])   # still linked

    def test_two_households_same_name_not_linked(self):
        A, B = world('Alphaville', households={"Goth": self.hh()}), world('Betaville', households={"Goth": self.hh()})
        G.auto_link(['a'], {'a': up('Goth', kind='household')}, [A, B])
        self.assertIn('several households have this name', self.unlinked()['a']['why'])

    def test_unknown_household(self):
        G.auto_link(['a'], {'a': up('Nobody', kind='household')}, [world(households={})])
        self.assertIn('no household in the plan has this name', self.unlinked()['a']['why'])


class MemberCheck(Folder):
    def test_match_is_empty(self):
        self.members['a'] = [{"firstName": "Bella", "lastName": "Goth", "age": 32}]
        self.assertEqual(G.member_check('a', {"sims": [{"name": "Bella Goth", "age": "Adult"}]}), '')

    def test_nothing_to_compare(self):
        self.assertEqual(G.member_check('a', {"sims": [{"name": "Bella Goth", "age": "Adult"}]}), '')
        self.members['a'] = [{"firstName": "Bella", "lastName": "Goth", "age": 32}]
        self.assertEqual(G.member_check('a', {"sims": []}), '')

    def test_gallery_down_is_not_a_difference(self):
        def boom(path): raise OSError('offline')
        with patched(G, api=boom):
            self.assertEqual(G.member_check('a', {"sims": [{"name": "X", "age": "Adult"}]}), '')

    def test_ages(self):
        self.assertEqual(G.AGES[16], 'Young Adult')
        self.assertEqual(set(G.AGES.values()), {"Baby", "Toddler", "Child", "Teen", "Young Adult", "Adult", "Elder", "Infant"})


class LibraryIds(unittest.TestCase):
    """Her Library's shared items: a copy counts when it was made under any of her names (2 Nov, Pier Perfection)."""
    def test_her_names_only(self):
        import base64, sims4files as s4
        rid = lambda n: bytes([n] * 16)
        items = {'a.trayitem': {"remote_id": rid(1), "creator_name": "JemmaTheSimmer"},
                 'b.trayitem': {"remote_id": rid(2), "creator_name": "MsTiquelle"},
                 'c.trayitem': {"remote_id": rid(3), "creator_name": "SomeoneElse"},
                 'd.trayitem': {"remote_id": bytes(16), "creator_name": "JemmaTheSimmer"},   # never shared
                 'e.trayitem': {"remote_id": rid(1), "creator_name": "jemmathesimmer"}}     # same id twice
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'Tray')); os.makedirs(os.path.join(d, 'Saves'))
            for f in items: open(os.path.join(d, 'Tray', f), 'wb').write(b'12345678' + f.encode())
            decode = lambda b, *a, **k: items[b.decode()]
            with patched(s4, SAVES=os.path.join(d, 'Saves'), save_schema=lambda: None, decode=decode):
                got = G.library_ids()
        self.assertEqual(got, [base64.b64encode(rid(1)).decode(), base64.b64encode(rid(2)).decode()])

    def test_unreadable_library_gives_nothing(self):
        import sims4files as s4
        def boom(): raise OSError('no')
        with patched(G, say=lambda s: None), patched(s4, save_schema=boom):
            self.assertEqual(G.library_ids(), [])


class FullRefresh(unittest.TestCase):
    """main() end to end on a fixture Gallery: numbers updated, history rows, new uploads, strangers skipped, gone marked."""
    def test_main(self):
        with temp_dir() as d:
            gal = os.path.join(d, 'gallery'); os.makedirs(gal)
            save(os.path.join(gal, 'uploads.json'), {"_note": "", "uploads": {"old": up('Rose Cottage', fav=1, dl=5), "gone": up('Gone House')}})
            save(os.path.join(gal, 'comments.json'), {"_note": "", "comments": {}})
            save(os.path.join(gal, 'unlinked.json'), {"_note": "", "uploads": {}})
            open(os.path.join(gal, 'history.csv'), 'w', encoding='utf-8').write(f'date,id,favourites,downloads,comments\n2026-11-01,old,1,5,0\n{TODAY},old,9,9,9\n')
            wpath = os.path.join(d, 'w.json'); save(wpath, world(lots=[lot('Rose Cottage', gallery=['old']), lot('Thorn House')]))
            fresh = {"old": up('Rose Cottage', fav=2, dl=8), "new": up('Thorn House', dl=1), "stranger": up('Their House', creator='Someone')}
            fake_more = types.ModuleType('gallery_more'); fake_more.main = lambda *a, **k: None
            with patched(G, GALLERY=gal, TODAY=TODAY, report=[], say=lambda s: None, world_files=lambda: [wpath],
                         list_uploads=lambda: ['old', 'new', 'stranger'], fetch_item=lambda i: fresh.get(i),
                         fetch_comments=lambda i: [{"m": "Lovely", "t": 1, "u": "x"}] if i == 'new' else [],
                         member_check=lambda i, h: '', add_covers=lambda w, u: None, time=types.SimpleNamespace(sleep=lambda s: None)), \
                 patched(sys.modules, ) if False else quiet():
                sys.modules['gallery_more'], old_more = fake_more, sys.modules.get('gallery_more')
                try: ok = G.main()
                finally:
                    if old_more: sys.modules['gallery_more'] = old_more
                    else: sys.modules.pop('gallery_more', None)
            U = load(os.path.join(gal, 'uploads.json'))['uploads']
            hist = open(os.path.join(gal, 'history.csv'), encoding='utf-8').read().splitlines()
            W = load(wpath)
            comments = load(os.path.join(gal, 'comments.json'))['comments']
        self.assertTrue(ok)
        self.assertEqual((U['old']['favourites'], U['old']['downloads']), (2, 8))
        self.assertIn('new', U); self.assertNotIn('stranger', U)
        self.assertTrue(U['gone']['gone'])
        self.assertEqual(hist[0], 'date,id,favourites,downloads,comments')
        self.assertIn('2026-11-01,old,1,5,0', hist)
        self.assertNotIn(f'{TODAY},old,9,9,9', hist)   # a second run the same day replaces that day's rows
        self.assertIn(f'{TODAY},old,2,8,0', hist)
        self.assertIn(f'{TODAY},new,0,1,1', hist)
        self.assertEqual(W['neighbourhoods'][0]['lots'][1]['gallery'], ['new'])
        self.assertEqual(comments['new'][0]['m'], 'Lovely')

    def test_failed_fetch_keeps_last_numbers(self):
        with temp_dir() as d:
            gal = os.path.join(d, 'gallery'); os.makedirs(gal)
            save(os.path.join(gal, 'uploads.json'), {"_note": "", "uploads": {"old": up('Rose Cottage', fav=1, dl=5)}})
            save(os.path.join(gal, 'comments.json'), {"_note": "", "comments": {}})
            save(os.path.join(gal, 'unlinked.json'), {"_note": "", "uploads": {}})
            open(os.path.join(gal, 'history.csv'), 'w', encoding='utf-8').write('date,id,favourites,downloads,comments\n')
            wpath = os.path.join(d, 'w.json'); save(wpath, world(lots=[lot('Rose Cottage', gallery=['old'])]))
            def boom(i): raise OSError('EA is down')
            fake_more = types.ModuleType('gallery_more'); fake_more.main = lambda *a, **k: None
            old_more = sys.modules.get('gallery_more'); sys.modules['gallery_more'] = fake_more
            try:
                with patched(G, GALLERY=gal, TODAY=TODAY, report=[], say=lambda s: None, world_files=lambda: [wpath], list_uploads=lambda: ['old'],
                             fetch_item=boom, add_covers=lambda w, u: None, time=types.SimpleNamespace(sleep=lambda s: None)), quiet():
                    ok = G.main()
            finally:
                if old_more: sys.modules['gallery_more'] = old_more
                else: sys.modules.pop('gallery_more', None)
            U = load(os.path.join(gal, 'uploads.json'))['uploads']
        self.assertFalse(ok)
        self.assertEqual(U['old']['downloads'], 5)


class SafeWrites(unittest.TestCase):
    def test_no_tmp_left(self):
        with temp_dir() as d:
            p = os.path.join(d, 'x.json'); G.save_safe(p, {"a": 1}); G.write_safe(os.path.join(d, 'y.txt'), 'hi')
            self.assertEqual(sorted(os.listdir(d)), ['x.json', 'y.txt'])
            self.assertEqual(load(p), {"a": 1})


class ItemShape(unittest.TestCase):
    """fetch_item turns EA's answer into the uploads.json shape (EA's answer is a fixture)."""
    def test_fetch_item(self):
        ea = {"data": {"name": "Rose Cottage", "type": "lot", "description": "Cosy #testville", "typeDetails": {
            "lotType": {"name": "Residential"}, "sizeX": 30, "sizeZ": 20, "priceValue": 50000, "bedroomsCount": 2, "bathsCount": 1},
            "requiredPacks": [{"displayName": "The Sims™ 4 Seasons Expansion Pack"}], "images": ["u"], "favouritesCount": 3,
            "downloadsCount": 7, "creator": {"username": "JemmaTheSimmer"}}}
        with patched(G, api=lambda p: (200, ea), TODAY=TODAY):
            r = G.fetch_item('abc')
        self.assertEqual((r['title'], r['kind'], r['lotType'], r['size'], r['beds'], r['baths']), ('Rose Cottage', 'lot', 'Residential', '30x20', 2, 1))
        self.assertEqual((r['favourites'], r['downloads'], r['creator'], r['checked']), (3, 7, 'JemmaTheSimmer', TODAY))
        with patched(G, api=lambda p: (404, None)):
            self.assertIsNone(G.fetch_item('abc'))

    def test_comments_paged_and_stop_on_repeat(self):
        pages = [{"messages": [{"id": 1, "message": "a", "createdTimestamp": 1, "author": {"username": "x"}}], "nextCursor": "c2"},
                 {"messages": [{"id": 2, "message": "b", "createdTimestamp": 2}, {"id": 1, "message": "a"}], "nextCursor": "c3"}]
        it = iter(pages)
        with patched(G, api=lambda p: (200, next(it)), time=types.SimpleNamespace(sleep=lambda s: None)):
            got = G.fetch_comments('abc')
        self.assertEqual([c['m'] for c in got], ['a', 'b'])
        with patched(G, api=lambda p: (204, None)):
            self.assertEqual(G.fetch_comments('abc'), [])


if __name__ == '__main__':
    unittest.main()
