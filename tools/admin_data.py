"""The Admin pages' extra data (sidebar trial, 23 Oct): things that aren't in site/js/data.js, gathered into site/js/admin-data.js.

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
    out = {"made": datetime.date.today().isoformat(), "refresh": [], "unlinked": [], "checklist": [], "todo": [], "tagSlips": [], "noWorldTag": "", "buildNext": []}
    try: out["refresh"] = refresh_runs()
    except Exception as e: print("admin data: refresh log not read:", e)
    try:
        unl = json.loads(read("data/gallery/unlinked.json"))["uploads"]
        out["unlinked"] = [{"id": k, "title": v.get("title"), "lot": v.get("lot"), "why": v.get("why")} for k, v in unl.items()]
    except Exception as e: print("admin data: unlinked uploads not read:", e)
    try: out["checklist"] = checklist()
    except Exception as e: print("admin data: in-game checklist not read:", e)
    try: out["todo"] = todo()
    except Exception as e: print("admin data: TODO.md not read:", e)
    try: out["tagSlips"], out["noWorldTag"] = tag_slips()
    except Exception as e: print("admin data: hashtag slips not read:", e)
    try: out["buildNext"] = build_next()
    except Exception as e: print("admin data: build priorities not read:", e)
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
def todo():
    items, head = [], ""
    for line in read("TODO.md").splitlines():
        if line.startswith("#"):
            head = line.lstrip("#").strip()
        elif line.startswith("- [ ] [Jemma]"):
            t = line[len("- [ ] [Jemma]"):].strip()
            items.append({"head": head, "text": t, "inGame": bool(re.search(r"\bin game\b|in-game|when she’s in game", t, re.I))})
    return items

# hashtag slips (research/gallery-findability.md, 22 Oct); she checks them herself when re-uploading
def tag_slips():
    fy = read("research/gallery-findability.md")
    slips = []
    part = fy.split("Misspelt tags", 1)[1].split("\n\n", 2)[1]
    for line in part.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) == 3 and cells[0] not in ("Upload", "---") and not cells[0].startswith("-"):
            slips.append({"upload": cells[0], "tag": cells[1], "meant": cells[2]})
    nw = re.search(r"\*\*No world tag at all\*\* on \d+ linked uploads: (.+)", fy)
    return slips, (nw.group(1).rstrip(".") if nw else "")

# build priorities (research/build-priorities.md §4)
def build_next():
    bp = read("research/build-priorities.md").split("## 4.", 1)[1]
    return [{"name": m.group(1), "world": m.group(2), "why": m.group(3).strip()} for m in re.finditer(r"^\d+\. \*\*(.+?)\*\* \((.+?)\)[^:]*: (.+)$", bp, re.M)]

def write():
    out = gather()
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Built by tools/admin_data.py for the Admin pages (sidebar trial, 23 Oct). Don't edit this file.\n"
                "// For Jemma's PC only: never upload this file if the site goes online (it holds her to-dos and admin notes).\n")
        f.write("window.ADMIN = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n")
    return out

if __name__ == "__main__":
    o = write()
    print(f"{len(o['refresh'])} refresh runs, {len(o['unlinked'])} unlinked, {len(o['checklist'])} checklist items, {len(o['todo'])} to-dos "
          f"({sum(t['inGame'] for t in o['todo'])} in game), {len(o['tagSlips'])} tag slips, {len(o['buildNext'])} build ideas")
