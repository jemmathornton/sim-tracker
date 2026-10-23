"""The Admin pages' extra data (js/sections.js, 23 Oct): things that aren't in site/js/data.js, gathered into site/js/admin-data.js.

    python tools/admin_data.py      (tools/build.py runs it too)

Reads only: logs/gallery-refresh.log, data/gallery/unlinked.json, for-jemma/in-game-checklist.md, TODO.md,
research/gallery-findability.md and research/build-priorities.md. Ported from for-jemma/prototypes/calendar-admin/make_admin_data.py.

site/js/admin-data.js is for Jemma's PC only: it holds her to-dos and admin notes. It must NOT be uploaded if the site
ever goes online (leave it out of the upload, or move Admin out of site/ first; research/calendar-and-admin.md §3).
"""
import json, re, datetime, os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site" / "js" / "admin-data.js"

def read(p):
    return (ROOT / p).read_text(encoding="utf-8")

def gather():
    out = {"made": datetime.date.today().isoformat(), "refresh": [], "unlinked": [], "checklist": []}
    try: out["refresh"] = refresh_runs()
    except Exception as e: print("admin data: refresh log not read:", e)
    try:
        unl = json.loads(read("data/gallery/unlinked.json"))["uploads"]
        out["unlinked"] = [{"id": k, "title": v.get("title"), "lot": v.get("lot"), "why": v.get("why")} for k, v in unl.items()]
    except Exception as e: print("admin data: unlinked uploads not read:", e)
    try: out["checklist"] = checklist()
    except Exception as e: print("admin data: in-game checklist not read:", e)
    return out

# weekly Gallery refresh: one entry per run in logs/gallery-refresh.log
def refresh_runs():
    runs = []
    for block in re.split(r"\n(?=Gallery refresh, )", read("logs/gallery-refresh.log")):
        m = re.match(r"Gallery refresh, (.+)", block.strip())
        if not m:
            continue
        r = {"when": m.group(1).strip(), "ok": "Done:" in block and "Stopped with an error" not in block, "linked": [], "notes": []}
        if (x := re.search(r"(\d+) uploads listed on the Gallery, (\d+) new", block)):
            r["listed"], r["new"] = int(x.group(1)), int(x.group(2))
        if (x := re.search(r"Done: (\d+) favourites, (\d+) downloads, (\d+) comments", block)):
            r["favourites"], r["downloads"], r["comments"] = map(int, x.groups())
        for line in block.splitlines():
            line = line.strip()
            if line.startswith("linked new upload"):
                r["linked"].append(line)
            elif re.match(r"(left|not linked|skipped|added a Gallery picture)", line):
                r["notes"].append(line)
            elif line.endswith("Error") or "Error:" in line:
                r["notes"].append(line)
        runs.append(r)
    return runs

# her in-game checklist: items not struck through
def checklist():
    items, section, world = [], "", ""
    for line in read("for-jemma/in-game-checklist.md").splitlines():
        if line.startswith("## "):
            section, world = re.sub(r"^## \d+\.\s*", "", line).strip(), ""
        elif re.match(r"\*\*(.+)\*\*\s*$", line.strip()):
            world = line.strip().strip("*")
        elif line.startswith("- ") and not line.startswith("- ~~"):
            items.append({"section": section, "world": world, "text": line[2:].strip()})
    return items

# open TODO.md items for her, under their heading
def write():
    out = gather()
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Built by tools/admin_data.py for the Admin pages (js/sections.js, 23 Oct). Don't edit this file.\n"
                "// For Jemma's PC only: never upload this file if the site goes online (it holds her to-dos and admin notes).\n")
        f.write("window.ADMIN = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n")
    return out

if __name__ == "__main__":
    o = write()
    print(f"{len(o['refresh'])} refresh runs, {len(o['unlinked'])} unlinked, {len(o['checklist'])} checklist items")
