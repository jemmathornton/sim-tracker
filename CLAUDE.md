# Jemma's Sim World

A private website about Jemma's Sims 4 save: every world in the game rebuilt lot by lot, with neighbourhoods, lots, households, her screenshots and her Sims 4 Gallery uploads. It started as a single HTML page built in claude.ai chat (Oct 2026) and is moving here to become a proper app.

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

- `build/` – the current generator: `build_site.py` turns the spreadsheet data + Gallery data into one HTML page using `template.html`. Details in HANDOVER.md.
- `live-site/` – a full snapshot of the published site on 13 Oct 2026 (page, 60 maps, 390 screenshots, 203 Gallery pictures in `_blob/`). Serve it with `python3 -m http.server 8000` from inside that folder.
- `research/` – three research notes from 13 Oct (missing lots, lot types, ideas from other trackers). Suggestions only; nothing applied.
- `old-chat-notes/` – the claude.ai chat's own handover and notes, kept for reference.
- Jemma's PC folders that matter: Mods\20thCenturyPlumbob Maps (map packages), Documents\Builds (screenshot folders per build), Downloads (World Plans spreadsheets; `World Plans (fixed).xlsx` is current, `World Plans (fixed) - backup 12 Oct.xlsx` is from before the Kopf fix), Sims 4 Screenshots, Pictures, Videos, ansel, Documents\Sims4.

## People and accounts

- Jemma's EA / Gallery username: **JemmaTheSimmer** (211 uploads in the 11 Oct data snapshot: 188 lots, 17 rooms, 6 households; a 13 Oct check counted about 221).
