"""More of the tools' rules (19 Nov): the spreadsheet import run twice, the importers never overwriting a household that already
has Sims, the Library pictures and screenshots, British spelling and text fixes on tricky text, uploads that leave the
Gallery, and every report mode running cleanly without changing anything.

Everything a tool would write goes to a temporary folder; saves, the game and the network are replaced by fixtures. The one
exception is ReportModes, which runs the read-only report modes on the real project and checks no project file changed
(the ones reading her saves only when SIMWORLD_TEST_SAVES=1)."""
import concurrent.futures, json, os, struct, subprocess, sys, types, unittest
from helpers import ROOT, DATA, SITE, WORLDS, patched, temp_dir, world, lot, argv, quiet, snapshot, tools_copy
from common import save, load, slug
import build, gallery_refresh as G, import_spreadsheet as IS, premade_import as PI
import test_import_spreadsheet as TIS   # the module, not its TestCase classes (they would run twice)
from test_import_spreadsheet import workbook, as_base
from test_gallery_refresh import up, TODAY

try:
    import own_import as OI, library_pictures as LP, sims4files as s4
    GAME_ERR = None
except Exception as e:   # these read the save layout from the game's files when imported
    OI = LP = s4 = None; GAME_ERR = f'the game isn’t installed here ({e.__class__.__name__})'

FAKE_RUN = types.SimpleNamespace(run=lambda *a, **k: types.SimpleNamespace(returncode=0, stdout='built', stderr=''), DEVNULL=None)


# ---------- her spreadsheet, imported twice in a row ----------
class SpreadsheetTwice(unittest.TestCase):
    def test_second_apply_changes_nothing(self):
        with temp_dir() as d:
            x = os.path.join(d, 'plans.xlsx'); workbook(x, TIS.Merge.SHEET)
            base = os.path.join(d, 'last-import.json'); open(base, 'w', encoding='utf-8').write(json.dumps(as_base(TIS.Merge.BASE)))
            wp = os.path.join(d, 'testville.json'); save(wp, world('Testville', lots=TIS.Merge.APP))
            ran = []
            fake = types.SimpleNamespace(run=lambda *a, **k: ran.append(a) or types.SimpleNamespace(stdout='built', stderr=''), DEVNULL=None)
            with patched(IS, BASE=base, DATA=d, world_files=lambda: [wp], subprocess=fake):
                with argv(x, '--apply'), quiet() as one: IS.main()
                w1, b1 = open(wp, encoding='utf-8').read(), open(base, encoding='utf-8').read()
                with argv(x, '--apply'), quiet() as two: IS.main()
                w2, b2 = open(wp, encoding='utf-8').read(), open(base, encoding='utf-8').read()
                with argv(x), quiet() as three: IS.main()
        self.assertEqual(w2, w1)                                         # her edits went in once; nothing doubles up
        self.assertEqual(b2, b1)
        self.assertIn("Lot Type 'Residential' -> 'Bar'", one.getvalue())
        self.assertNotIn("Lot Type 'Residential' -> 'Bar'", two.getvalue())
        self.assertNotIn("new lot 'D'", two.getvalue())
        self.assertIn("Lot Size: spreadsheet '30x30', app '40x40'", two.getvalue())   # the clash is still waiting for her
        self.assertNotIn("new lot", three.getvalue())


# ---------- the importers never overwrite a household that already has Sims ----------
def ea_sim(n, name, age='Adult', sex='f'):
    return {"sim_id": n, "template": None, "name": name, "first": name.split()[0], "last": name.split()[-1], "sex": sex, "age": age,
            "species": None, "aspiration": "Big Happy Family", "traits": ["Cheerful"], "bonus": None, "careers": [], "skills": [],
            "partner": None, "fiance": None, "rels": [], "family": [], "occult": None}


class PremadeImport(unittest.TestCase):
    EXISTING = [{"id": "bella-goth", "name": "Bella Goth", "sex": "f", "origin": "Premade", "age": "Adult", "notes": "her own words"}]

    def run_tool(self, only=None):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'data', 'worlds')); os.makedirs(os.path.join(d, 'research', 'data'))
            W = world('Testville', households={"Goth": {"sims": [dict(s) for s in self.EXISTING]}, "Landgraab": {}})
            save(os.path.join(d, 'data', 'worlds', 'testville.json'), W)
            save(os.path.join(d, 'research', 'data', 'premades.json'), {"_note": "", "templates": {},
                 "households": [{"short": "Goth", "sims": [ea_sim(1, 'Bella Goth'), ea_sim(2, 'Mortimer Goth', sex='m')], "relationships": []},
                                {"short": "Landgraab", "sims": [ea_sim(3, 'Nancy Landgraab'), ea_sim(4, 'Geoffrey Landgraab', 'Teen', 'm')], "relationships": []}],
                 "between": {"family": [], "relationships": []}})
            ran = []
            fake = types.SimpleNamespace(run=lambda *a, **k: ran.append(a))
            with patched(PI, ROOT=d, MATCHES={"testville": {"Goth": "Goth", "Landgraab": "Landgraab"}}, ONLY=only, subprocess=fake), quiet() as out:
                PI.main(True)
            return out.getvalue(), load(os.path.join(d, 'data', 'worlds', 'testville.json')), ran

    def test_household_with_sims_left_alone(self):
        text, W, ran = self.run_tool()
        self.assertEqual(W['households']['Goth']['sims'], self.EXISTING)   # not even Mortimer added
        self.assertIn('testville / Goth: already has Sims, left alone', text)
        self.assertEqual([s['name'] for s in W['households']['Landgraab']['sims']], ['Nancy Landgraab', 'Geoffrey Landgraab'])
        self.assertTrue(all(s['origin'] == 'Premade' for s in W['households']['Landgraab']['sims']))
        self.assertEqual(len(ran), 1)

    def test_only_the_households_named(self):
        text, W, _ = self.run_tool(only=['Goth'])
        self.assertEqual(W['households']['Landgraab'], {})
        self.assertEqual(W['households']['Goth']['sims'], self.EXISTING)

    def test_apply_needs_names(self):
        with tools_copy() as tools:   # never the real project, even though it stops before writing anything
            r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(tools, 'premade_import.py'), '--apply'],
                               capture_output=True, text=True, encoding='utf-8', stdin=subprocess.DEVNULL, timeout=60)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('--only', r.stderr)


@unittest.skipIf(GAME_ERR, GAME_ERR)
class OwnImport(unittest.TestCase):
    """own_import with her Library replaced: one file per household, decoded by a stand-in for the game's save reader."""
    EXISTING = [{"id": "ann-kim", "name": "Ann Kim", "sex": "f", "origin": "Mine", "age": "Elder", "from": "her pick"}]
    FILES = {b'kim': [{"first_name": "Ann", "last_name": "Kim", "sim_id": 1, "gender": 8192, "age": 32},
                      {"first_name": "Joe", "last_name": "Kim", "sim_id": 2, "gender": 4096, "age": 32}],
             b'lee': [{"first_name": "Bo", "last_name": "Lee", "sim_id": 3, "gender": 4096, "age": 8}]}

    def run_tool(self, apply=True, only=None, replace=False, existing=None, prefer=None):
        with temp_dir() as d:
            tray = os.path.join(d, 'Tray'); os.makedirs(tray)
            for k in self.FILES: open(os.path.join(tray, k.decode() + '.householdbinary'), 'wb').write(struct.pack('<II', 1, len(k)) + k)
            os.makedirs(os.path.join(d, 'data', 'worlds')); os.makedirs(os.path.join(d, 'research', 'data'))
            save(os.path.join(d, 'data', 'worlds', 'testville.json'), world('Testville', households={"Kim": {"sims": [dict(s) for s in existing or self.EXISTING]}, "Lee": {}}))
            save(os.path.join(d, 'research', 'data', 'game-names.json'), {"skills": {}, "skill_levels": {"MAJOR": [1] * 10}, "tracks": {}, "aspirations": {}, "traits": {}})
            copy = lambda f, hh, names: {"source": "library", "file": f, "household": hh, "date": "2026-10-01", "sims": [{"name": n, "sim_id": i} for i, n in enumerate(names)]}
            save(os.path.join(d, 'research', 'data', 'own-households.json'), {"found": {
                "Testville|Kim": [copy('kim.householdbinary', 'Kim', ['Ann Kim', 'Joe Kim'])], "Testville|Lee": [copy('lee.householdbinary', 'Lee', ['Bo Lee'])]}})
            fake_s4 = types.SimpleNamespace(SAVES=os.path.join(d, 'saves'), decode=lambda body, *a, **k: {"family_account": {"sim": self.FILES[bytes(body)]}},
                                            read_save=None, fields=None)
            ran = []
            fake_oh = types.ModuleType('own_households'); fake_oh.plan_households = lambda: {}
            old = sys.modules.get('own_households'); sys.modules['own_households'] = fake_oh
            try:
                with patched(OI, ROOT=d, TRAY=tray, s4=fake_s4, SPLIT={}, SKIP={}, EA=set(), PREFER={}, PREFER_LIBRARY=prefer or {}, TARGET={}, AGE_DOWN={},
                             PREMADE_COPY=set(), ONLY=only, REPLACE=replace, subprocess=types.SimpleNamespace(run=lambda *a, **k: ran.append(a))), quiet() as out:
                    OI.main(apply)
            finally:
                if old: sys.modules['own_households'] = old
                else: sys.modules.pop('own_households', None)
            review = os.path.join(d, 'research', 'own-households-review.md')
            return out.getvalue(), load(os.path.join(d, 'data', 'worlds', 'testville.json')), open(review, encoding='utf-8').read() if os.path.exists(review) else None, ran

    def test_household_with_sims_left_alone(self):
        text, W, review, ran = self.run_tool()
        self.assertEqual(W['households']['Kim']['sims'], self.EXISTING)       # Joe isn't added, Ann keeps her own age and "from"
        lee = W['households']['Lee']['sims']
        self.assertEqual([(s['name'], s['origin'], s['age'], s['sex']) for s in lee], [('Bo Lee', 'Mine', 'Teen', 'm')])
        self.assertTrue(lee[0]['from'].startswith('Library (2026-10-01)'))
        self.assertIn('**Lee** (Testville): filled from Library', review)
        self.assertEqual(len(ran), 1)

    def test_preferred_copy_never_replaces_sims_without_replace(self):   # 21 Nov review: PREFER households used to be replaced outright
        text, W, review, ran = self.run_tool(prefer={"Testville|Kim": "Kim"})
        self.assertEqual(W['households']['Kim']['sims'], self.EXISTING)
        self.assertIn('Testville / Kim: already has Sims, left alone (--replace to refill it from this copy)', text)

    HAND = [{"id": "ann-kim-testville", "name": "Ann Kim", "sex": "f", "origin": "Mine", "age": "Elder", "from": "her pick",
             "dynasty": {"name": "Kim", "role": "head"}, "clubs": [{"name": "Gardeners", "role": "leader"}], "born": "Park",
             "parents": ["old-mum"], "partners": [["someone", "Spouse"]]},
            {"id": "sue-kim", "name": "Sue Kim", "sex": "f", "origin": "Mine", "age": "Teen"}]

    def test_replace_keeps_ids_and_hand_added_fields(self):
        text, W, review, ran = self.run_tool(replace=True, existing=self.HAND)
        sims = {s['name']: s for s in W['households']['Kim']['sims']}
        self.assertEqual(list(sims), ['Ann Kim', 'Joe Kim'])
        ann = sims['Ann Kim']
        self.assertEqual(ann['id'], 'ann-kim-testville')                       # not minted again
        self.assertEqual(ann['age'], 'Adult')                                  # the copy's own details are refreshed
        self.assertEqual((ann['dynasty'], ann['clubs'], ann['born']), (self.HAND[0]['dynasty'], self.HAND[0]['clubs'], 'Park'))
        self.assertEqual((ann['parents'], ann['partners']), (['old-mum'], [["someone", "Spouse"]]))
        self.assertEqual(sims['Joe Kim']['id'], 'joe-kim')
        self.assertIn('Testville / Kim: not in this copy, so no longer in the household: Sue Kim', text)

    def test_replace_twice_gives_the_same_ids(self):
        _, W1, _, _ = self.run_tool(replace=True, existing=self.HAND)
        _, W2, _, _ = self.run_tool(replace=True, existing=W1['households']['Kim']['sims'])
        self.assertEqual([s['id'] for s in W2['households']['Kim']['sims']], [s['id'] for s in W1['households']['Kim']['sims']])

    def test_report_changes_nothing(self):
        text, W, review, ran = self.run_tool(apply=False)
        self.assertEqual(W['households']['Lee'], {})
        self.assertIsNone(review); self.assertEqual(ran, [])
        self.assertIn('**Kim** (Testville)', text)

    def test_only(self):
        _, W, _, _ = self.run_tool(only=['Kim'])
        self.assertEqual(W['households']['Lee'], {})

    def test_apply_needs_names(self):
        with tools_copy('research/data/game-names.json') as tools:   # never the real project, even though it stops before writing anything
            r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(tools, 'own_import.py'), '--apply'],
                               capture_output=True, text=True, encoding='utf-8', stdin=subprocess.DEVNULL, timeout=120)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('--only', r.stderr)

    def test_names_wanted(self):
        self.assertEqual(OI.names_wanted('Sylvia & Kenny Cadberry'), ['Sylvia Cadberry', 'Kenny Cadberry'])
        self.assertEqual(OI.names_wanted('Ella-Mint Cadberry'), ['Ella-Mint Cadberry'])
        self.assertIsNone(OI.names_wanted('Urbane Housesharers household'))


# ---------- her Library pictures ----------
@unittest.skipIf(GAME_ERR, GAME_ERR)
class LibraryPictures(unittest.TestCase):
    """The household and Sim pictures she'd get, from a made-up Library (pictures are empty files; nothing is decoded)."""
    def tray(self, d, households):
        """households: [(stem, creator, family, [sim names], with hhi, {sim index with a picture})]"""
        files = {}
        for stem, creator, fam, sims, hhi, sgi in households:
            body = stem.encode(); files[body] = {"family_account": {"original_creator_string": creator, "familyname": fam,
                                                                    "sim": [{"first_name": n.split()[0], "last_name": n.split()[-1]} for n in sims]}}
            open(os.path.join(d, f'0x00000000!{stem}.householdbinary'), 'wb').write(struct.pack('<II', 1, len(body)) + body)
            if hhi: open(os.path.join(d, f'0x00000002!{stem}.hhi'), 'wb').write(b'')
            base = int(stem, 16) & LP.LOW
            for i in sgi:
                n = i + 1; inst = (0x05 << 56) | (base + n)
                open(os.path.join(d, f'{n << 4:#010x}!{inst:#018x}.sgi'), 'wb').write(b'')
        return types.SimpleNamespace(decode=lambda body, *a, **k: files[bytes(body)])

    def test_only_her_own_households_and_their_pictures(self):
        with temp_dir() as d:
            fake = self.tray(d, [('0x0000000000000abc', 'JemmaTheSimmer', 'Kim', ['Ann Kim', 'Joe Kim'], True, {0, 1}),
                                 ('0x0000000000000def', 'SomeoneElse', 'Lee', ['Bo Lee'], True, {0}),
                                 ('0x0000000000000123', '', 'Moss', ['Cy Moss'], False, {0})])
            with patched(LP, TRAY=d, s4=fake):
                lib = {c['family']: c for c in LP.library()}
        self.assertEqual(sorted(lib), ['Kim', 'Moss'])                              # another creator's download is never used
        self.assertEqual(lib['Kim']['sims'], ['Ann Kim', 'Joe Kim'])
        self.assertTrue(lib['Kim']['hhi'].endswith('0x0000000000000abc.hhi'))
        self.assertEqual(sorted(lib['Kim']['sgi']), [0, 1])
        self.assertTrue(lib['Kim']['sgi'][1].endswith('.sgi'))
        self.assertIsNone(lib['Moss']['hhi'])

    def plan(self, lib, households, old=None):
        """Run main(apply) with the Library and the site's households given; returns what it would write."""
        with temp_dir() as d:
            written, ran = {}, []
            img = types.SimpleNamespace(save=lambda dest, *a, **k: written.setdefault(os.path.relpath(dest, d).replace('\\', '/'), True))
            mp = os.path.join(d, 'library-pictures.json')
            if old: save(mp, old)
            with patched(LP, library=lambda: lib, site_households=lambda: iter(households), ROOT=d, MAP=mp,
                         tp=types.SimpleNamespace(read=lambda src: img), subprocess=types.SimpleNamespace(run=lambda *a, **k: ran.append(a))), quiet() as out:
                LP.main(True)
            return load(mp), sorted(written), out.getvalue()

    def lib(self, family, sims, mtime, hhi=True, pics=()):
        return {'stem': family, 'mtime': mtime, 'creator': 'JemmaTheSimmer', 'family': family, 'sims': sims,
                'hhi': f'{family}.hhi' if hhi else None, 'sgi': {i: f'{family}-{i}.sgi' for i in pics}}

    def test_best_match_newest_and_her_portrait_wins(self):
        lib = [self.lib('KimOld', ['Ann Kim', 'Joe Kim'], 1, pics=(0, 1)), self.lib('KimNew', ['Ann Kim', 'Joe Kim'], 2, pics=(0,)),
               self.lib('Stranger', ['Ann Kim', 'Zed Zee', 'Yo Yee', 'Xi Xu'], 3, pics=(0,))]
        hh = [('testville', 'Kim', {"sims": [{"id": "ann-kim", "name": "Ann Kim"}, {"id": "joe-kim", "name": "Joe Kim"}]}),
              ('testville', 'Lee', {"portrait": "shots/lee.jpg", "sims": [{"id": "bo-lee", "name": "Bo Lee", "portrait": "x.jpg"}]}),
              ('testville', 'Empty', {})]
        got, files, text = self.plan(lib, hh)
        self.assertEqual(got['households'], {'testville|Kim': 'library/testville/kim.webp'})    # the newer of two equal matches
        self.assertEqual(got['sims'], {'ann-kim': 'library/sims/ann-kim.webp', 'joe-kim': 'library/sims/joe-kim.webp'})   # Joe from the next copy holding him
        self.assertNotIn('testville|Lee', got['households']); self.assertNotIn('bo-lee', got['sims'])   # her own screenshots always win
        self.assertEqual(files, ['site/library/sims/ann-kim.webp', 'site/library/sims/joe-kim.webp', 'site/library/testville/kim.webp'])

    def test_a_poor_match_gives_no_household_picture(self):
        lib = [self.lib('Big', ['Ann Kim', 'B B', 'C C', 'D D'], 1, pics=(0,))]
        got, _, _ = self.plan(lib, [('testville', 'Kim', {"sims": [{"id": "ann-kim", "name": "Ann Kim"}, {"id": "joe-kim", "name": "Joe Kim"}]})])
        self.assertEqual(got['households'], {})                     # one Sim in five in common: not this household
        self.assertEqual(got['sims'], {'ann-kim': 'library/sims/ann-kim.webp'})   # but Ann's own picture is still hers


# ---------- her screenshots ----------
class Screenshots(unittest.TestCase):
    def setUp(self):
        from PIL import Image
        import screenshots as SS
        self.SS, self.Image = SS, Image
        self.t = temp_dir(); self.d = self.t.__enter__()
        self.builds, self.site = os.path.join(self.d, 'Builds'), os.path.join(self.d, 'site')
        for f in ('Rose Cottage', 'Unlinked Build', 'Bubble World'): os.makedirs(os.path.join(self.builds, f))

    def tearDown(self): self.t.__exit__(None, None, None)

    def png(self, folder, name, size=(3000, 1500)):
        self.Image.new('RGB', size, (120, 160, 90)).save(os.path.join(self.builds, folder, name))

    def run_tool(self):
        ran = []
        fake = types.SimpleNamespace(run=lambda *a, **k: ran.append(a) or types.SimpleNamespace(stdout='built', stderr=''), DEVNULL=None)
        with patched(self.SS, BUILDS=self.builds, SITE=self.site, FOLDERS={"Rose Cottage": ("testville", "rose-cottage"), "Gone Folder": ("testville", "gone")},
                     subprocess=fake), quiet() as out:
            self.SS.main()
        return out.getvalue(), ran

    def test_pictures_made_and_named(self):
        self.png('Rose Cottage', 'Front View.png'); self.png('Rose Cottage', 'Willow_s Kitchen.png', (800, 600))
        self.png('Rose Cottage', 'Gallery Pirce.png'); open(os.path.join(self.builds, 'Rose Cottage', 'notes.txt'), 'w').write('x')
        text, ran = self.run_tool()
        out = os.path.join(self.site, 'shots', 'testville', 'rose-cottage')
        self.assertEqual(sorted(os.listdir(out)), ['front-view.jpg', 'front-view.thumb.jpg', 'willows-kitchen.jpg', 'willows-kitchen.thumb.jpg'])
        with self.Image.open(os.path.join(out, 'front-view.jpg')) as im: self.assertEqual(im.size, (2000, 1000))
        with self.Image.open(os.path.join(out, 'front-view.thumb.jpg')) as im: self.assertEqual(im.size, (720, 360))
        with self.Image.open(os.path.join(out, 'willows-kitchen.jpg')) as im: self.assertEqual(im.size, (800, 600))   # never made bigger
        self.assertIn('2 new screenshots.', text)
        self.assertIn('Builds folders not linked to a lot yet: Unlinked Build', text)   # bonus builds (Bubble World) aren't listed
        self.assertIn('Not found: Builds\\Gone Folder', text)
        self.assertEqual(len(ran), 1)

    def test_done_pictures_skipped_and_no_rebuild(self):
        self.png('Rose Cottage', 'Front View.png')
        self.run_tool()
        src = os.path.join(self.builds, 'Rose Cottage', 'Front View.png'); before = os.path.getmtime(os.path.join(self.site, 'shots', 'testville', 'rose-cottage', 'front-view.jpg'))
        text, ran = self.run_tool()
        self.assertIn('0 new screenshots.', text); self.assertEqual(ran, [])
        self.assertEqual(os.path.getmtime(os.path.join(self.site, 'shots', 'testville', 'rose-cottage', 'front-view.jpg')), before)
        self.assertTrue(os.path.exists(src))                                      # her Builds folder is never changed

    def test_every_folder_points_at_a_real_lot(self):
        lots = {(ws, slug(l['lot'])) for ws, W in WORLDS for h in W['neighbourhoods'] for l in h['lots']}
        self.assertEqual([f for f, t in self.SS.FOLDERS.items() if t not in lots], [])


# ---------- British spelling and text fixes on tricky text ----------
class TrickyText(unittest.TestCase):
    def setUp(self):
        self.ups, self.coms, self.fix = {}, {}, {}
        self.p = patched(build, uploads=self.ups, comments=self.coms, fixes=self.fix); self.p.__enter__()
    def tearDown(self): self.p.__exit__(None, None, None)

    def desc(self, d, fixes=None, i='x'):
        self.ups[i] = up('Rose Cottage', desc=d); self.ups[i].update(price=1, packs=[])
        if fixes: self.fix[i] = {"description": fixes}
        with patched(build, shared_on=lambda i: None): return build.upload_entry(i)['description']

    def test_punctuation_possessives_and_hyphens(self):
        self.assertEqual(build.british("my neighbor's color-coded, cozy (favorite!) center."), "my neighbour's colour-coded, cosy (favourite!) centre.")
        self.assertEqual(build.british('neighbor’s “colors”'), 'neighbour’s “colours”')
        self.assertEqual(build.british('COLORS and Neighbors'), 'COLOURS and Neighbours')

    def test_words_inside_other_words_untouched(self):
        for s in ('Colorado', 'colorist', 'momentum', 'graylisted', 'catalogs?', 'Moldova', 'honorary', 'centered'):
            self.assertEqual(build.british(s), s if s != 'catalogs?' else 'catalogues?', s)

    def test_game_names_at_the_start_of_a_sentence_keep_their_capital(self):
        self.assertEqual(build.british('Harbor views. the harbor is lovely'), 'Harbor views. the harbour is lovely')

    def test_accents_and_numbers(self):
        self.assertEqual(build.british('Café colors, 2 colors, 3rd neighborhood'), 'Café colours, 2 colours, 3rd neighbourhood')

    def test_fix_is_plain_text_not_a_pattern_and_applies_everywhere(self):
        self.assertEqual(self.desc('a.b a.b axb (sic) $5', [['a.b', 'A-B'], ['(sic)', ''], ['$5', '§5']]), 'A-B A-B axb  §5')

    def test_fixes_see_the_text_with_spaces_tidied(self):
        self.assertEqual(self.desc('two  spaces\nand a line', [['two spaces and', 'two spaces, and']]), 'two spaces, and a line')

    def test_fix_then_british(self):
        self.assertEqual(self.desc('teh color', [['teh', 'the']]), 'the colour')

    def test_hashtags_at_the_end_become_tags(self):
        self.ups['y'] = up('X', desc='Cozy. #willowcreek #nocc'); self.ups['y'].update(price=1, packs=[])
        with patched(build, shared_on=lambda i: None): e = build.upload_entry('y')
        self.assertEqual((e['description'], e['tags']), ('Cosy.', ['willowcreek', 'nocc']))

    def test_a_hashtag_inside_a_sentence_keeps_the_rest(self):   # fixed 19 Nov (Bubble World)
        self.assertEqual(self.desc('Too many circles for the #SimsieCircleShell challenge! Have fun. #bubbles #nocc'),
                         'Too many circles for the #SimsieCircleShell challenge! Have fun.')

    def test_trailing_block_with_loose_words_and_symbols_is_cut(self):   # Campground ("#nocc playtested #playertested"), Picturehouse (#jf&fclothiers)
        self.assertEqual(self.desc('Eat and sleep! #campground #nocc playtested #playertested'), 'Eat and sleep!')
        self.assertEqual(self.desc('Place it.]]   #jf&fclothiers #cinema '), 'Place it.]]')

    def test_no_hashtags_leaves_text_whole(self):
        self.assertEqual(self.desc('A cosy home. Have fun!'), 'A cosy home. Have fun!')


# ---------- uploads that leave the Gallery ----------
class GoneUploads(unittest.TestCase):
    def refresh(self, d, fresh, uploads, listed):
        gal = os.path.join(d, 'gallery'); os.makedirs(gal, exist_ok=True)
        save(os.path.join(gal, 'uploads.json'), {"_note": "", "uploads": uploads})
        save(os.path.join(gal, 'comments.json'), {"_note": "", "comments": {}})
        save(os.path.join(gal, 'unlinked.json'), {"_note": "", "uploads": {}})
        open(os.path.join(gal, 'history.csv'), 'w', encoding='utf-8').write('date,id,favourites,downloads,comments\n')
        wp = os.path.join(d, 'w.json'); save(wp, world(lots=[lot('Rose Cottage', gallery=['a']), lot('Thorn House', gallery=['b'])]))
        said = []
        fake_more = types.ModuleType('gallery_more'); fake_more.main = lambda *a, **k: None
        old = sys.modules.get('gallery_more'); sys.modules['gallery_more'] = fake_more
        try:
            with patched(G, GALLERY=gal, TODAY=TODAY, report=[], say=said.append, world_files=lambda: [wp], list_uploads=lambda: listed,
                         fetch_item=lambda i: fresh.get(i), fetch_comments=lambda i: [], member_check=lambda i, h: '', add_covers=lambda w, u: None,
                         time=types.SimpleNamespace(sleep=lambda s: None)):
                ok = G.main()
        finally:
            if old: sys.modules['gallery_more'] = old
            else: sys.modules.pop('gallery_more', None)
        return ok, load(os.path.join(gal, 'uploads.json'))['uploads'], open(os.path.join(gal, 'history.csv'), encoding='utf-8').read(), said, load(wp)

    def test_gone_upload_kept_with_its_last_numbers(self):
        old_a = dict(up('Rose Cottage', fav=7, dl=40), checked='2026-11-01')
        with temp_dir() as d:
            ok, U, hist, said, W = self.refresh(d, {"b": up('Thorn House', fav=1)}, {"a": old_a, "b": up('Thorn House')}, ['b'])
        self.assertTrue(ok)
        self.assertTrue(U['a']['gone'])
        self.assertEqual((U['a']['favourites'], U['a']['downloads'], U['a']['checked']), (7, 40, '2026-11-01'))
        self.assertIn('1 uploads no longer on the Gallery: Rose Cottage', said)
        self.assertNotIn(f'{TODAY},a,', hist)                          # no made-up numbers for this week
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['gallery'], ['a'])   # still linked: it's her call

    def test_upload_back_on_the_gallery_is_not_gone(self):
        with temp_dir() as d:
            ok, U, hist, said, _ = self.refresh(d, {"a": up('Rose Cottage', fav=8), "b": up('Thorn House')},
                                                {"a": dict(up('Rose Cottage', fav=7), gone=True), "b": up('Thorn House')}, ['a', 'b'])
        self.assertIs(U['a']['gone'], False)
        self.assertEqual(U['a']['favourites'], 8)
        self.assertFalse(any('no longer on the Gallery' in s for s in said))
        self.assertIn(f'{TODAY},a,8,0,0', hist)

    def test_many_missing_at_once_marks_none_as_gone(self):   # 21 Nov review: a bad day at EA isn't her uploads leaving
        uploads = {f"u{k}": up(f'House {k}', fav=k) for k in range(20)}
        fresh = {i: u for i, u in uploads.items() if int(i[1:]) >= 7}          # seven known uploads come back "not found"
        with temp_dir() as d:
            ok, U, hist, said, _ = self.refresh(d, fresh, uploads, list(fresh))
        self.assertFalse(any(u.get('gone') for u in U.values()))
        self.assertIn('Gallery looked down: 7 uploads came back as not found, so none were marked as gone this time', said)
        self.assertFalse(any('no longer on the Gallery' in s for s in said))
        self.assertEqual(U['u0']['favourites'], 0); self.assertEqual(U['u3']['favourites'], 3)   # last numbers kept

    def test_looked_down_rule(self):
        self.assertFalse(G.gallery_looked_down(1, 3))      # one upload taken down: believed
        self.assertFalse(G.gallery_looked_down(5, 221))
        self.assertTrue(G.gallery_looked_down(6, 221))     # more than a handful
        self.assertTrue(G.gallery_looked_down(3, 20))      # more than a tenth
        self.assertFalse(G.gallery_looked_down(0, 0))


# ---------- every report mode runs without changing anything ----------
def _report(args, timeout=240):
    r = subprocess.run([sys.executable, '-X', 'utf8', *args], cwd=ROOT, capture_output=True, text=True, encoding='utf-8',
                       stdin=subprocess.DEVNULL, timeout=timeout)
    return args, r


SAVES_OK = os.environ.get('SIMWORLD_TEST_SAVES') == '1'   # opt in to the report modes that read her saves and Library


class ReportModes(unittest.TestCase):
    """Report modes (no --apply) of the tools meant to change nothing, run as she would run them, and checked to change nothing.
    None goes online. By default only the ones that read the plan and her spreadsheet run: the tests never touch her saves
    (CLAUDE.md). Set SIMWORLD_TEST_SAVES=1 to add those that read her saves and Library (read from temporary copies).
    research/data_check.py and world_extras.py rewrite their caches in research/data/ even in report mode, so they're left out."""
    def run_all(self, runs):
        todo = [a for a, ok in runs if ok]
        if not todo: self.skipTest('none of these can run on this PC')
        before = snapshot()
        with concurrent.futures.ThreadPoolExecutor(len(todo)) as ex:
            results = list(ex.map(_report, todo))
        bad = [f"{a[0]}: exit {r.returncode}: {(r.stderr or r.stdout)[-300:]}" for a, r in results if r.returncode != 0 or 'Traceback' in r.stderr or not r.stdout.strip()]
        self.assertEqual(bad, [])
        self.assertEqual(_changed(before), [], 'report modes changed project files')

    def test_plan_and_spreadsheet_reports(self):
        sheet = os.path.join(os.path.expanduser('~'), 'Downloads', 'World Plans (fixed).xlsx')
        self.run_all([(['tools/premade_family_fix.py'], True), (['tools/premade_import.py'], os.path.exists(os.path.join(ROOT, 'research', 'data', 'premades.json'))),
                      (['tools/import_spreadsheet.py'], os.path.exists(sheet))])

    @unittest.skipUnless(SAVES_OK, 'reads her saves and Library: set SIMWORLD_TEST_SAVES=1 to run')
    def test_save_and_library_reports(self):
        if GAME_ERR or not os.path.isdir(s4.GAME): self.skipTest('the game isn’t installed here')
        have_saves = os.path.isdir(s4.SAVES) and any(f.endswith('.save') for f in os.listdir(s4.SAVES))
        have_tray = os.path.isdir(os.path.join(os.path.dirname(s4.SAVES), 'Tray'))
        self.run_all([(['tools/library_pictures.py'], have_tray), (['tools/library_update.py'], have_tray), (['tools/own_import.py'], have_saves and have_tray),
                      (['tools/lot_traits.py'], have_saves), (['tools/age_days.py'], have_saves)])


def _changed(before):
    after = snapshot()
    return sorted(k for k in set(before) | set(after) if before.get(k) != after.get(k))


if __name__ == '__main__':
    unittest.main()
