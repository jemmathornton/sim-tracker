"""The Admin pages' extra data (js/sections.js, 23 Oct): things that aren't in site/js/data.js, gathered into site/js/admin-data.js.

    python tools/admin_data.py      (tools/build.py runs it too)

Reads only: logs/gallery-refresh.log, data/gallery/unlinked.json, for-jemma/your-list.md, TODO.md, research/data/new-save-status.json,
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
    out = {"made": datetime.date.today().isoformat(), "refresh": [], "checklist": [], "toSort": []}
    try: out["refresh"] = refresh_runs()
    except Exception as e: print("admin data: refresh log not read:", e)
    try:
        ts = ROOT / "data" / "gallery" / "to-sort.json"
        if ts.exists(): out["toSort"] = [{"id": k, **v} for k, v in json.loads(ts.read_text(encoding="utf-8")).items()]
    except Exception as e: print("admin data: uploads to sort not read:", e)
    try: out["checklist"] = checklist()
    except Exception as e: print("admin data: her list not read:", e)
    try: out["newSave"] = new_save()
    except Exception as e: print("admin data: new-save check not read:", e)
    return out

# her new save against the plan (tools/research/new_save_check.py, 23 Oct): per world, what's left to place, fix or move
def links_to_add():
    """How many links between households the new save doesn't have yet (research/data/relationships.json, tools/research/relationships.py)."""
    p = os.path.join(ROOT, 'research', 'data', 'relationships.json')
    if not os.path.exists(p): return 0
    close = ('best friends with', 'bromantic partner of', 'confidant of', 'good friends with')
    n = 0
    for r in json.load(open(p, encoding='utf-8'))['pairs']:
        want = list(r.get('site') or []) + ([r['friends']] if r.get('friends') in close else [])   # the site's family links and close friends (save-only family and partners are hers to decide)
        have = set(r.get('in_new_save') or [])
        if any(w not in have and not ('partner of' in have and w in ('married to', 'engaged to', 'going steady with')) for w in want): n += 1
    return n


def new_save():
    p = ROOT / "research" / "data" / "new-save-status.json"
    if not p.exists(): return None
    d = json.loads(p.read_text(encoding="utf-8")); worlds = []
    for wn, rows in d["worlds"].items():
        if not any(r.get("status") == "placed" for r in rows): continue
        hh = [h for h in d["households"] if h["world"] == wn and h["state"] != "home"]
        worlds.append({"world": wn, "placed": sum(1 for r in rows if r.get("status") == "placed"),
                       "toPlace": [r["name"] for r in rows if r.get("status") == "to place"],
                       "fixes": [{"lot": r["name"], "what": r["issues"]} for r in rows if r.get("issues")],
                       "move": [{"household": h["household"], "to": h["lot"] + (f" unit {h['unit']}" if h["unit"] else ""), "now": h.get("now"), "how": h.get("how"), "occupied": h.get("occupied"), "note": h.get("note")} for h in hh],
                       "ahead": [{"lot": q["lot"], "household": q["household"], "goes": q["goes"]} for q in d.get("ahead", []) if q["world"] == wn]})
    for wn in {q["world"] for q in d.get("ahead", [])} - {w["world"] for w in worlds}:   # not started yet, but someone lives on a lot to place
        worlds.append({"world": wn, "placed": 0, "toPlace": [], "fixes": [], "move": [], "ahead": [{"lot": q["lot"], "household": q["household"], "goes": q["goes"]} for q in d["ahead"] if q["world"] == wn]})
    order = list(d["worlds"]); worlds.sort(key=lambda w: order.index(w["world"]))
    import sys; sys.path.insert(0, str(ROOT / "tools")); from common import slug
    lots = {f"l-{slug(wn)}--{slug(r['lot'])}": {"s": r.get("status"), "fix": r.get("issues") or []} for wn, rows in d["worlds"].items() for r in rows if r.get("status") in ("placed", "to place")}
    return {"saved": d["saved"], "lots": lots, "links": links_to_add(), "options": d.get("options", []), "fromSaves": d.get("fromSaves", []), "eco": d.get("eco", []), "clubs": d.get("clubs", []),
            "newTraits": [r["name"] for rows in d["worlds"].values() for r in rows if r.get("newTraits") or r.get("newUnitTraits")], "worlds": worlds, "notStarted": [wn for wn, rows in d["worlds"].items() if not any(r.get("status") == "placed" for r in rows)]}

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

# her list (for-jemma/your-list.md, 23 Oct: one list for everything waiting on her): items not struck through
def checklist():
    items, section, world = [], "", ""
    for line in read("for-jemma/your-list.md").splitlines():
        if line.startswith("## "):
            section, world = re.sub(r"^##\s*(\d+\.\s*)?", "", line).strip(), ""
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
    print(f"{len(o['refresh'])} refresh runs, {len(o['checklist'])} checklist items")
