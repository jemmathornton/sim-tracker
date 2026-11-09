"""tools/import_spreadsheet.py: the three-way merge of her World Plans spreadsheet, on a small made-up workbook.
Everything (workbook, last import, world files) lives in a temporary folder; the rebuild is skipped."""
import json, os, types, unittest
from helpers import patched, temp_dir, world, lot, argv, quiet
from common import save, load
import import_spreadsheet as IS

COLS = ["Lot Name", "My Name", "Lot Type", "Lot Size", "Residents/Owners", "Built", "Shared", "Screenshots", "Sims Made",
        "Lot Traits", "Lot Challenges", "Bedrooms", "Bathrooms"]


def row(name, my=None, typ='Residential', size='30x20', res='Empty', built=True, shared=False, shots=False, sims=False, extra=()):
    return [name, my, typ, size, res, built, shared, shots, sims, *extra]


def workbook(path, lots, owned=None, hood='Old Town'):
    import openpyxl
    wb = openpyxl.Workbook(); ov = wb.active; ov.title = 'Overview'
    ov.append(['Jemma’s worlds']); ov.append(['World', 'Pack', 'Owned'])
    for w, o in (owned or {}).items(): ov.append([w, 'Base Game', o])
    ws = wb.create_sheet('Testville')
    ws.append(['Testville']); ws.append([hood]); ws.append(COLS)
    for r in lots: ws.append(r)
    ws.append([]); ws.append(['Statistics']); ws.append(['Not a lot', 'x'])
    wb.save(path)


def as_base(lots, owned=None, hood='Old Town'):
    return [{"tab": "Overview", "sections": [], "owned": owned or {}},
            {"tab": "Testville", "title": "Testville", "sections": [{"name": hood, "lots": [dict(zip(IS.HEAD, r[:9])) for r in lots]}]}]


class Merge(unittest.TestCase):
    BASE = [row('A'), row('B'), row('C', size='20x20'), row('E')]
    SHEET = [row('A', typ='Bar'),                    # she changed the type
             row('B'),                               # unchanged in the sheet; the app named it
             row('C', size='30x30'),                 # both changed the size: a clash
             row('D', my='New One'),                 # new in the sheet
             row('F', extra=('Homey', '', 3, 2))]    # new, with the app-filled columns J–M filled in
    APP = [lot('A', shared=False, residents='Empty', screenshots=False, simsMade=False, myName=None, traits=['Homey']),
           lot('B', myName='Mine', shared=False, residents='Empty', screenshots=False, simsMade=False),
           lot('C', size='40x40', shared=False, residents='Empty', screenshots=False, simsMade=False),
           lot('E', shared=False, residents='Empty', screenshots=False, simsMade=False)]

    def run_tool(self, *flags, owned_sheet=None, owned_base=None, owned_app=True):
        with temp_dir() as d:
            x = os.path.join(d, 'plans.xlsx'); workbook(x, self.SHEET, owned_sheet)
            base = os.path.join(d, 'last-import.json'); open(base, 'w', encoding='utf-8').write(json.dumps(as_base(self.BASE, owned_base)))
            W = world('Testville', owned=owned_app, lots=self.APP); wp = os.path.join(d, 'testville.json'); save(wp, W)
            ran = []
            fake_sub = types.SimpleNamespace(run=lambda *a, **k: ran.append(a) or types.SimpleNamespace(stdout='built', stderr=''), DEVNULL=None)
            with patched(IS, BASE=base, DATA=d, world_files=lambda: [wp], subprocess=fake_sub), argv(x, *flags), quiet() as out:
                IS.main()
            return out.getvalue(), load(wp), json.load(open(base, encoding='utf-8')), os.path.exists(base.replace('.json', '-previous.json')), ran

    def test_report_changes_nothing(self):
        text, W, base, prev, ran = self.run_tool()
        self.assertEqual(W['neighbourhoods'][0]['lots'][0]['type'], 'Residential')
        self.assertEqual(base, as_base(self.BASE))
        self.assertFalse(prev); self.assertEqual(ran, [])

    def test_report_lists_each_kind(self):
        text = self.run_tool()[0]
        self.assertIn("Testville / A: Lot Type 'Residential' -> 'Bar'", text)
        self.assertIn("Testville / C: Lot Size: spreadsheet '30x30', app '40x40' (was '20x20')", text)
        self.assertIn("Testville / B: My Name is 'Mine' in the app, (empty) in the spreadsheet", text)
        self.assertIn("new lot 'D'", text)
        self.assertIn("In the app but not in the spreadsheet (lots): 1\n  Testville / E (gone from the spreadsheet since last import)", text)

    def test_apply(self):
        text, W, base, prev, ran = self.run_tool('--apply')
        lots = {l['lot']: l for l in W['neighbourhoods'][0]['lots']}
        self.assertEqual(lots['A']['type'], 'Bar')                 # her edit applied
        self.assertEqual(lots['B']['myName'], 'Mine')              # the app's change kept
        self.assertEqual(lots['C']['size'], '40x40')               # a clash: nothing applied
        self.assertEqual(lots['D']['myName'], 'New One')           # new lot added
        self.assertIn('E', lots)                                   # never deleted
        self.assertEqual(lots['A']['traits'], ['Homey'])           # app-only fields untouched
        self.assertNotIn('traits', lots['F'])                      # columns J–M are never read back
        self.assertEqual([l['lot'] for l in W['neighbourhoods'][0]['lots']], ['A', 'B', 'C', 'D', 'F', 'E'])   # new lots go where they are in the sheet
        self.assertEqual(base[1]['sections'][0]['lots'][0]['Lot Type'], 'Bar')   # the sheet is the new base
        self.assertTrue(prev); self.assertEqual(len(ran), 1)

    def test_owned_she_ticked(self):
        text, W, *_ = self.run_tool('--apply', owned_sheet={'Testville': 'Yes'}, owned_base={'Testville': False}, owned_app=False)
        self.assertTrue(W['owned'])
        self.assertIn('Testville: Owned No -> Yes', text)

    def test_owned_both_agree(self):
        text, W, *_ = self.run_tool('--apply', owned_sheet={'Testville': 'No'}, owned_base={'Testville': True}, owned_app=False)
        self.assertFalse(W['owned'])
        self.assertNotIn('Owned', text)

    def test_owned_changed_in_the_app(self):
        text, W, *_ = self.run_tool('--apply', owned_sheet={'Testville': 'No'}, owned_base={'Testville': False}, owned_app=True)
        self.assertTrue(W['owned'])
        self.assertIn('Testville: Owned is Yes in the app, No in the spreadsheet', text)


class ReadSheet(unittest.TestCase):
    def test_shape_and_her_file_untouched(self):
        with temp_dir() as d:
            x = os.path.join(d, 'plans.xlsx'); workbook(x, [row(' A '), row('B')], {'Testville': 'yes', 'Other': 'maybe'})
            before = os.path.getmtime(x)
            out = IS.read_sheet(x)
            self.assertEqual(os.path.getmtime(x), before)
        self.assertEqual(out[0]['owned'], {'Testville': True})
        self.assertEqual(out[1]['tab'], 'Testville')
        self.assertEqual([l['Lot Name'] for l in out[1]['sections'][0]['lots']], ['A', 'B'])   # trimmed; Statistics not read
        self.assertEqual(list(out[1]['sections'][0]['lots'][0]), IS.HEAD)

    def test_renamed_lots(self):
        with temp_dir() as d:
            os.makedirs(os.path.join(d, 'spreadsheet'))
            save(os.path.join(d, 'spreadsheet', 'renamed.json'), {"neighbourhoods": {"Testville|Old Twn": "Old Town"}, "lots": {"Testville|Oldname": "Newname"}})
            sheet = [{"tab": "Overview", "sections": []}, {"tab": "Testville", "sections": [{"name": "Old Twn", "lots": [{"Lot Name": "Oldname", "My Name": "Oldname"}]}]}]
            with patched(IS, DATA=d):
                out = IS.with_app_names(sheet)
        self.assertEqual(out[1]['sections'][0]['name'], 'Old Town')
        self.assertEqual(out[1]['sections'][0]['lots'][0], {"Lot Name": "Newname", "My Name": "Newname"})


class RealBase(unittest.TestCase):
    """The last import is a list of tabs in the shape main() expects, one per world it knows."""
    def test_shape(self):
        b = load(IS.BASE)
        self.assertEqual(b[0]['tab'], 'Overview')
        for t in b[1:]:
            for s in t['sections']:
                for l in s['lots']: self.assertTrue(set(IS.HEAD) <= set(l), (t['tab'], l.get('Lot Name')))


if __name__ == '__main__':
    unittest.main()
