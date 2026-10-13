# Jemma's Sim World

A private website about Jemma's Sims 4 save: every world in the game rebuilt lot by lot, with neighbourhoods, lots, households, her screenshots and her Sims 4 Gallery uploads. It started as a single HTML page built in claude.ai chat (Oct 2026); since 13 Oct it's an app on her PC (a static site she opens from a shortcut), built so it can go online later.

Read `HANDOVER.md` once for the full story, then `TODO.md` for everything still open. This file holds the rules that apply every session.

## Working rules (set by Jemma, keep them)

- **Never edit Jemma's own files without asking first** (the World Plans spreadsheet, her Mods, Builds, Pictures, Documents and Downloads folders), even in auto mode. Copy into the project and work on the copy. Changing this project's own code and data is fine.
- **No AI-generated art anywhere.** Maps come from the 20th Century Plumbob map replacement mod; icons are Lucide (ISC licence); pictures are Jemma's screenshots or her own Gallery pictures. No AI-upscaled or "Sims-style" stock images either.
- **British English** in everything shown (colours, neighbourhood, favourites). Gallery "likes" are called **favourites**. Proper names from the game keep their spelling (Evergreen Harbor, Information Center).
- **Curly apostrophes** in displayed text; ids, links and data keys stay straight.
- **Short, plain answers.** She reviews by looking at the site, not by reading long reports.
- **Obvious bugs** (wrong numbers, things out of sync, broken behaviour) can be fixed straight away. **Anything needing her judgement** (names, wording, lot types, layout choices) goes on `TODO.md` for her to decide.
- **Lot names:** her Gallery title wins, then her own name ("My Name", ignored if just "?"), then the in-game name. The in-game name shows only on the lot page and the Stats sheet.
- **Percentages only on the Stats page.** Elsewhere use counts or words.
- **World colours** come from the world's map and her builds, never from one side of a world (e.g. Britechester must match neither UoB green nor Foxbury red). The "deep" shades drive the fade at the bottom of each map hero and must look the same as that world's neighbourhood cards.
- **Never guess where a neighbourhood is on a map.** Give her a gridded copy (8 columns A–H × 6 rows 1–6) and let her name the squares.
- **Phone layout is parked** until she asks; laptop (1280px) first.
- Notion is no longer used for this project.

## Where things are

- `site/` – **the app**: everything needed to show it, and the only folder to upload if it ever goes online. `index.html`, `site.css` (must stay next to index.html: picture paths in it are read relative to its own folder), `js/app.js` (page code), `js/icons.js` (Lucide), `js/data.js` (**generated**, never edit), `maps/`, `shots/` (her screenshots), `gallery/` (Gallery pictures: `<world>/<lot>.jpg`; Community Space versions `<world>/<lot>/<version>-<n>.jpg`), `icon.*`.
- `data/` – **the source of truth** for what the site shows:
  - `worlds.json` (world order) and `worlds/<world>.json`: colours, blurb, neighbourhoods (`desc`, `mapSpot`), lots. Lot fields `lot` (in-game name), `myName`, `type`, `size`, `residents`, `built`, `shared`, `screenshots`, `simsMade` are as in her spreadsheet. App-only lot fields: `displayName` (her spelling beats the Gallery title), `gallery` (Gallery ids of every upload of the lot), `galleryOld`, `versions` (Community Space tabs), `beds`/`baths` (apartments uploaded as Rooms), `tenants`, `statsResidents` (Stats text when a household name isn't enough). World-level `households` (Sim details) and `familyLinks`.
  - `gallery/`: `uploads.json` + `comments.json` (refreshed weekly, don't hand-edit), `history.csv` (a row per upload per refresh), `unlinked.json` (uploads deliberately not on a lot, and why), `text-fixes.json` (typo fixes shown on the site).
  - `spreadsheet/last-import.json`: her spreadsheet as last imported (the base for the three-way import).
- `tools/` – the scripts (see below). `tools/one-off/` – the 13 Oct move from the chat, kept for the record (they refuse to run again).
- `for-jemma/` – things for her to look at (e.g. `map-grids/`).
- `live-site/` – snapshot of the old claude.ai page on 13 Oct (reference). `old-chat-build/` – the chat's generator and data (retired; `live_overrides.json` is folded into `data/`).
- `research/`, `old-chat-notes/` – reference only.
- Jemma's PC folders that matter (read only): Mods\20thCenturyPlumbob Maps (map packages), Documents\Builds (screenshot folders per build), Downloads (`World Plans (fixed).xlsx` is current; `... - backup 12 Oct.xlsx` is from before the Kopf fix), Sims 4 Screenshots, Pictures, Videos, ansel, Documents\Sims4.

## How to work here

- Python 3.13: `C:/Users/Jemma/AppData/Local/Programs/Python/Python313/python.exe` (not on the shell's PATH). Run scripts with `-X utf8`. Pillow and openpyxl are installed in Python's own folder (not `--user`: the weekly task can't see the user folder). numpy isn't installed (only `extract_map.py` needs it; ask her before installing anything).
- To change what the site shows: edit `data/worlds/<world>.json` (or the code in `site/`), then run `tools/build.py` (it stops if a picture is missing).
- To check: start the `app` preview (`.claude/launch.json`, port 8001), run the contents of `tools/check_pages.js` in the page (expect no problems), and look at the changed pages at 1280px. Add a new `?v=` to the address if the browser shows an old copy.
- Gallery: `tools/gallery_refresh.py` (about 7 minutes; rebuilds the site). Runs by itself every Sunday 08:54 as the Windows task "Jemma's Sim World - weekly Gallery refresh"; log in `logs/gallery-refresh.log`. A new upload is linked to a lot only when its title names exactly one lot; anything else goes in `data/gallery/unlinked.json` for her.
- Her spreadsheet: `tools/import_spreadsheet.py` reports (reads a temporary copy, changes nothing); `--apply` copies her spreadsheet edits into `data/` and rebuilds. App-side changes are never overwritten; clashes are listed.
- Screenshots: `tools/screenshots.py` (a new Builds folder needs a line in its FOLDERS list). Maps: `tools/extract_map.py`. Neighbourhood map spots: she answers on `tools/map-squares.html` (clickable, opens straight from the folder) or from the pictures `tools/map_grids.py` makes in `for-jemma/map-grids/`; `tools/set_map_spots.py` puts her answers into `data/` as `mapSpot`. App icon: `tools/make_icons.py`; shortcuts: `tools/make_shortcuts.ps1`.
- The project is a git repo: commit after each piece of work (`data.js` included, so the folder always works as it is).

## People and accounts

- Jemma's EA / Gallery username: **JemmaTheSimmer** (221 uploads on 13 Oct, 8 of them shell-challenge uploads credited to lilsimsie; a Gallery search for her name lists them all).
