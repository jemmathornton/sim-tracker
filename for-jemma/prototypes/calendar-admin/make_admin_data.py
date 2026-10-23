# Prototype, 23 Oct: gathers the admin page's extra bits (things that aren't in site/js/data.js) into admin-data.js next to this file.
# Reads only; changes nothing. Run:  python -X utf8 for-jemma/prototypes/calendar-admin/make_admin_data.py
# In the real app this would be part of tools/build.py, writing a separate site/admin/admin-data.js that is never uploaded (see research/calendar-and-admin.md).
import json, re, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent

def read(p):
    return (ROOT / p).read_text(encoding="utf-8")

# weekly Gallery refresh: one entry per run in logs/gallery-refresh.log
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

# uploads deliberately not on a lot
unl = json.loads(read("data/gallery/unlinked.json"))["uploads"]
unlinked = [{"id": k, "title": v.get("title"), "lot": v.get("lot"), "why": v.get("why")} for k, v in unl.items()]

# her in-game checklist: items not struck through
checklist, section, world = [], "", ""
for line in read("for-jemma/in-game-checklist.md").splitlines():
    if line.startswith("## "):
        section, world = re.sub(r"^## \d+\.\s*", "", line).strip(), ""
    elif re.match(r"\*\*(.+)\*\*\s*$", line.strip()):
        world = line.strip().strip("*")
    elif line.startswith("- ") and not line.startswith("- ~~"):
        checklist.append({"section": section, "world": world, "text": line[2:].strip()})

# open TODO.md items for her, under their heading
todo, head = [], ""
for line in read("TODO.md").splitlines():
    if line.startswith("#"):
        head = line.lstrip("#").strip()
    elif line.startswith("- [ ] [Jemma]"):
        t = line[len("- [ ] [Jemma]"):].strip()
        todo.append({"head": head, "text": t, "inGame": bool(re.search(r"\bin game\b|in-game|when she’s in game", t, re.I))})

# hashtag slips (research/gallery-findability.md, 22 Oct); she checks them herself when re-uploading
fy = read("research/gallery-findability.md")
slips = []
part = fy.split("Misspelt tags", 1)[1].split("\n\n", 2)[1]
for line in part.splitlines():
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) == 3 and cells[0] not in ("Upload", "---") and not cells[0].startswith("-"):
        slips.append({"upload": cells[0], "tag": cells[1], "meant": cells[2]})
nw = re.search(r"\*\*No world tag at all\*\* on \d+ linked uploads: (.+)", fy)
no_world = nw.group(1).rstrip(".") if nw else ""

# build priorities (research/build-priorities.md §4)
bp = read("research/build-priorities.md").split("## 4.", 1)[1]
build_next = [{"name": m.group(1), "world": m.group(2), "why": m.group(3).strip()} for m in re.finditer(r"^\d+\. \*\*(.+?)\*\* \((.+?)\)[^:]*: (.+)$", bp, re.M)]

out = {"made": datetime.date.today().isoformat(), "refresh": runs, "unlinked": unlinked, "checklist": checklist,
       "todo": todo, "tagSlips": slips, "noWorldTag": no_world, "buildNext": build_next}
(HERE / "admin-data.js").write_text("// Made by make_admin_data.py (prototype). Not part of the site.\nwindow.ADMIN = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n", encoding="utf-8")
print(f"{len(runs)} refresh runs, {len(unlinked)} unlinked, {len(checklist)} checklist items, {len(todo)} to-dos ({sum(t['inGame'] for t in todo)} in game), {len(slips)} tag slips, {len(build_next)} build ideas")
