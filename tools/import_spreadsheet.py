"""Bring Jemma's edits from the World Plans spreadsheet into the app's data.

    python tools/import_spreadsheet.py                 report only (changes nothing)
    python tools/import_spreadsheet.py --apply         apply her spreadsheet edits to data/worlds, then rebuild
    python tools/import_spreadsheet.py "<file.xlsx>"   another copy of the spreadsheet (default: Downloads\\World Plans (fixed).xlsx)

Her spreadsheet is only ever read, from a temporary copy. Three versions are compared, lot by lot and column by column:
  base   = the spreadsheet as last imported (data/spreadsheet/last-import.json)
  sheet  = the spreadsheet now
  app    = the app's data (data/worlds/*.json)
A column she changed in the spreadsheet (sheet differs from base) is copied into the app, unless the app changed the same
column to something else (a clash: listed, nothing applied). Changes made in the app are kept, and listed so they can be
copied into the spreadsheet if it stays her main copy. New lots are added; lots missing from the spreadsheet are only listed.
"""
import json, os, shutil, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import copy
from common import ROOT, DATA, load, save, world_files, write_text

DEFAULT = os.path.join(os.path.expanduser('~'), 'Downloads', 'World Plans (fixed).xlsx')
BASE = os.path.join(DATA, 'spreadsheet', 'last-import.json')
FIELDS = [("My Name", "myName"), ("Lot Type", "type"), ("Lot Size", "size"), ("Residents/Owners", "residents"),
          ("Built", "built"), ("Shared", "shared"), ("Screenshots", "screenshots"), ("Sims Made", "simsMade")]
HEAD = ["Lot Name"] + [f for f, _ in FIELDS]


def read_sheet(xlsx):
    """The workbook as [{tab, title, sections: [{name, lots: [{Lot Name, My Name, ...}]}]}] (same shape as last-import.json)."""
    import openpyxl
    tmp = os.path.join(tempfile.mkdtemp(), 'world-plans.xlsx'); shutil.copy(xlsx, tmp)   # never open her file itself
    wb = openpyxl.load_workbook(tmp, data_only=True, read_only=True)
    out = [{"tab": "Overview", "sections": [], "owned": {}}]
    # the Overview's Owned column (Yes/No per world): which packs she has (19 Oct; before, marking a world owned there never reached the app)
    head = None
    for r in wb.worksheets[0].iter_rows(values_only=True):
        if r and r[0] == "World" and "Owned" in r: head = list(r); continue
        if head and r and r[0]:
            v = r[head.index("Owned")]
            if isinstance(v, str) and v.strip().lower() in ("yes", "no"): out[0]["owned"][str(r[0]).strip()] = v.strip().lower() == "yes"
    for ws in wb.worksheets[1:]:
        rows = [[c for c in r[:9]] + [None] * (9 - len(r[:9])) for r in ws.iter_rows(values_only=True)]
        tab = {"tab": ws.title, "title": rows[0][0] if rows else ws.title, "sections": []}
        i = 0
        while i < len(rows):
            r = rows[i]
            if r[0] == "Statistics": break
            if r[0] and i + 1 < len(rows) and rows[i + 1][0] == "Lot Name":
                sec = {"name": str(r[0]).strip(), "lots": []}; i += 2
                while i < len(rows) and rows[i][0] not in (None, "") and rows[i][0] != "Statistics":
                    sec["lots"].append({h: (v.strip() if isinstance(v, str) else v) for h, v in zip(HEAD, rows[i])}); i += 1
                tab["sections"].append(sec); continue
            i += 1
        out.append(tab)
    wb.close()
    return out


def with_app_names(sheet):
    """Her spreadsheet may still use names the app has since corrected (data/spreadsheet/renamed.json): read it with the new ones."""
    p = os.path.join(DATA, 'spreadsheet', 'renamed.json')
    if not os.path.exists(p): return sheet
    r = load(p)
    for t in sheet[1:]:
        for sec in t['sections']:
            sec['name'] = r['neighbourhoods'].get(t['tab'] + '|' + sec['name'], sec['name'])
            for l in sec['lots']:
                l['Lot Name'] = r['lots'].get(t['tab'] + '|' + str(l['Lot Name']), l['Lot Name'])
                if l.get('My Name') and t['tab'] + '|' + str(l['My Name']) in r['lots']: l['My Name'] = r['lots'][t['tab'] + '|' + l['My Name']]
    return sheet


def lots_by_key(sheet):
    """(world, Lot Name) -> (neighbourhood, position, row)."""
    return {(t['tab'], l['Lot Name']): (s['name'], n, l) for t in sheet[1:] for s in t['sections'] for n, l in enumerate(s['lots'])}


def new_base(sheet, held):
    """The spreadsheet as it was imported, except what wasn't applied: a clashing cell keeps its old base value and a new
    lot that couldn't be added is left out, so the next import still sees them as her edits instead of dropping them."""
    nb = copy.deepcopy(sheet); rows = lots_by_key(nb)
    for key, col, old in held:
        if col == 'Owned': nb[0].setdefault('owned', {})[key] = old
        elif col is None and key in rows:
            hood, _, row = rows[key]
            for t in nb[1:]:
                if t['tab'] == key[0]:
                    for sec in t['sections']:
                        if sec['name'] == hood and row in sec['lots']: sec['lots'].remove(row)
        elif key in rows: rows[key][2][col] = old
    return nb


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    apply = '--apply' in sys.argv
    xlsx = args[0] if args else DEFAULT
    sheet, base = with_app_names(read_sheet(xlsx)), with_app_names(load(BASE))
    S, B = lots_by_key(sheet), lots_by_key(base)
    paths = world_files(); worlds = {W['name']: (p, W) for p in paths for W in [load(p)]}
    A = {(wn, l['lot']): (h['name'], l) for wn, (_, W) in worlds.items() for h in W['neighbourhoods'] for l in h['lots']}
    applied, clashes, app_only, added, missing, touched = [], [], [], [], [], set()
    held = []   # (key, column, base value) of clashing cells, and new lots not added: kept out of the new base so they're asked about again next time (15 Nov)
    show = lambda v: '(empty)' if v in (None, '') else repr(v) if isinstance(v, str) else str(v).upper() if isinstance(v, bool) else str(v)

    for key, (hood, pos, row) in S.items():
        if key not in A:
            if key not in B:
                added.append((key, hood, pos, row))
            continue
        b = B.get(key, (None, None, {}))[2]; _, lot = A[key]
        for col, f in FIELDS:
            s, a, o = row.get(col), lot.get(f), b.get(col)
            if s == a: continue
            if key in B and s != o:           # she changed it in the spreadsheet
                if a == o:
                    applied.append(f"{key[0]} / {key[1]}: {col} {show(a)} -> {show(s)}")
                    if apply: lot[f] = s; touched.add(key[0])
                else:
                    clashes.append(f"{key[0]} / {key[1]}: {col}: spreadsheet {show(s)}, app {show(a)} (was {show(o)})"); held.append((key, col, o))
            else:                             # changed in the app only
                app_only.append(f"{key[0]} / {key[1]}: {col} is {show(a)} in the app, {show(s)} in the spreadsheet")
    # Owned (Overview tab): the same three-way rule as the lots; owning a world switches on all its pages
    so, bo = sheet[0].get("owned", {}), base[0].get("owned", {})
    for wn, (_, W) in worlds.items():
        if wn not in so or so[wn] == W['owned']: continue
        yn = lambda v: "Yes" if v else "No"
        if wn in bo and so[wn] != bo[wn] and W['owned'] == bo[wn]:
            applied.append(f"{wn}: Owned {yn(W['owned'])} -> {yn(so[wn])}" + (" (its full map is in not-shown-yet/maps/: move it back to site/maps/)" if so[wn] else ""))
            if apply: W['owned'] = so[wn]; touched.add(wn)
        elif wn in bo and so[wn] != bo[wn]:
            clashes.append(f"{wn}: Owned: spreadsheet {yn(so[wn])}, app {yn(W['owned'])} (was {yn(bo[wn])})"); held.append((wn, 'Owned', bo[wn]))
        else:
            app_only.append(f"{wn}: Owned is {yn(W['owned'])} in the app, {yn(so[wn])} in the spreadsheet")
    for key in A:
        if key not in S and key[0] in {t['tab'] for t in sheet[1:]}:
            missing.append(f"{key[0]} / {key[1]}" + (" (gone from the spreadsheet since last import)" if key in B else ""))
    for (wn, name), hood, pos, row in added:
        line = f"{wn} / {hood}: new lot {name!r}"
        if wn not in worlds:
            clashes.append(line + " in a world the app doesn't have yet; add the world first"); held.append(((wn, name), None, None)); continue
        if apply:
            W = worlds[wn][1]
            h = next((x for x in W['neighbourhoods'] if x['name'] == hood), None)
            if h is None: h = {"name": hood, "desc": "", "lots": []}; W['neighbourhoods'].append(h)
            h['lots'].insert(min(pos, len(h['lots'])), {"lot": name, **{f: row.get(c) for c, f in FIELDS}}); touched.add(wn)
        applied.append(line)

    print(f"Spreadsheet: {xlsx}\n")
    for title, items in [("Spreadsheet edits" + (" (applied)" if apply else " (would be applied with --apply)"), applied),
                         ("Clashes: changed in both, nothing applied", clashes),
                         ("In the app but not in the spreadsheet (lots)", missing),
                         ("Changed in the app only (copy into the spreadsheet if it stays the main copy)", app_only)]:
        print(f"{title}: {len(items)}")
        for x in items: print("  " + x)
        print()
    if apply:
        for wn in touched: save(worlds[wn][0], worlds[wn][1])
        shutil.copy(BASE, BASE.replace('.json', '-previous.json'))
        write_text(BASE, json.dumps(new_base(sheet, held), ensure_ascii=False, indent=1))
        r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
        print((r.stdout or r.stderr).strip())


if __name__ == '__main__':
    main()
