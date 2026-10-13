# Jemma's Sim World — handover for the next chat

Read this first, then the notes doc (decisions and open to-dos; `project-notes.md` is an older copy). Last updated 13 Oct 2026, ~00:20. Latest backup: Downloads/Jemma's Sim World backup 2026-10-13 (4 zips + a small "whats-new" zip).

## Where things live
- **Live site** (private artifact, update in place, never create a new one): https://claude.ai/artifact/QjNDCVMJXENiWmTYZfnkg3 — declares the `assets` capability.
- **Notes doc** (the live to-do list; edit with the Docs tools): https://claude.ai/code/artifact/23c348ff-724f-47f6-9d2c-e5b3f3470f7b — holds the 12 Oct fresh review checklist (ticked = fixed), the neighbourhood card trial and the rental ideas.
- Jemma keeps an external backup; do not rely on it. Everything needed is in this project, the live site and her own folders.
- **Build files** are in this project under `claude/build/` (site code, data, and the map and screenshot scripts).
- Jemma's PC folders (via the desktop app link): Mods (20th Century Plumbob maps in `20thCenturyPlumbob Maps`), Sims 4 Screenshots, Pictures, Videos, ansel, Documents\Builds (build screenshot folders), Documents\Sims4, Downloads (World Plans spreadsheets; `World Plans (fixed) - backup 12 Oct.xlsx` is the copy from before the Kopf fix).
- Notion is no longer used for this project.
- **Overnight research (13 Oct)**: report doc https://claude.ai/code/artifact/c2e7b1d7-b6e1-4f19-9eb2-24aa4736d9f6 (missing secret lots, spelling fixes, newer lot types and where they could go, site ideas from other trackers; all suggestions with tick boxes, nothing applied). Detail in `claude/research/` (lot-types-reference.md, missing-lots-check.md, site-ideas-from-other-trackers.md). Gallery item data has no lot traits or upload dates, but 169 of 221 upload ids are time-based UUIDs whose date can be decoded.

## Working rules Jemma set
- Never edit her own files (spreadsheet, folders) without asking first, even in auto mode. Publishing the site is fine.
- No AI-generated art anywhere. Maps: 20th Century Plumbob. Icons: Lucide (lucide-static 0.344.0, inlined).
- British English. Gallery "favourites", not likes.
- She likes short, plain answers; she reviews on the live site.
- Obvious bugs (wrong numbers, things out of sync, broken behaviour) can be fixed straight away; anything that needs her judgement (names, wording, types, layout choices) goes on the to-do list instead.
- World colours come from the world's map and her own builds, never from just one side of a world (e.g. Britechester must not match either university's colours: UoB dark green, Foxbury bright red).
- The "deep" shades drive the fade at the bottom of each world's map hero; it must look the same colour as that world's neighbourhood cards.
- Don't guess where neighbourhoods are on a map: send her a gridded copy of the map (8 columns A–H × 6 rows) and let her name the squares.

## Build files are up to date with the live page (13 Oct, ~00:30)
`claude/build/template.html` is now the live page's own code (with `__ICONS__` / `__DATA__` placeholders), so every code change from 12-13 Oct is in it (neighbourhood cards, Community Space versions, Stats layout, key, Progress row, Page not found, lazy pictures, curly apostrophes, FAMILY_LINKS, TENANTS, NAME_FIX, "own" rentals, etc.).
Data edits made on the live page are in `claude/build/live_overrides.json` (worlds / hoods / lots / stats, keyed "World" / "World|Hood" / "World|Lot"); `build_site.py` applies them last. A rebuild was checked to give exactly the live DATA and all 586 pages load. When a change moves into the spreadsheet or data files, remove it from the overrides. The overrides pin Gallery numbers for 16 lots and the other lots use gallery_all.json from 11 Oct, so run the Gallery refresh after any rebuild. `gallery-picture-ids.txt` now lists all 203 stored pictures.
Rules still worth knowing from 12-13 Oct (details in the "live page" notes below): the spreadsheet writes "Cahyaputri (own)" and the build strips brackets from Residents, so keep that override (or teach `residents()` to keep "(own)").

### Detail of the 12-13 Oct live-page changes (kept for reference)
On 12 Oct the published page was patched directly; `claude/build/build_site.py` and `template.html` in this project do NOT have these changes yet. **The live page is the source of truth** — read it before rebuilding and carry these over (or simply start the template from the live page's code):
1. **Britechester colours**: find `"name": "Britechester"` in `DATA` and copy `color`, `deep`, `glow` into build_site.py (`W` entry, and `"Britechester": <glow>` in `GLOW`). As of 13:00: color #8F7756, deep #6A5C4A / #817059, glow #EBDAC2.
2. **Neighbourhood cards (chosen 12 Oct, "D1", on every world)**: map close-up of the neighbourhood (no pin — Jemma removed it), plus a row of circles, one per lot (ALL lots), each linking to its lot (`data-lot-link` + capture click handler); gentle hover (hovered ×1.2, neighbours ×1.06, name label above; she found bigger movement "way too much"); no lot count on the card. Code: `NB_PT` (keyed by world id → neighbourhood → [x,y] map fractions, placed by Jemma on a gridded map; only Willow Creek so far), `nbView()`, `nbTile()`, `hoodArt()` just above `hoodCard` (which calls `${hoodArt(x)}`); CSS block `/* neighbourhood cards: map close-up + lot circles */` above `/* phones */`. Worlds without spots show the whole map, no pin — next step is a gridded map per world for her to name squares.
2b. **Community Space versions (12 Oct)**: `CS_VERSIONS` (keyed "World|Lot", four versions each with label, title, url, stats, value, packs, description, tags and Gallery photos as /_blob ids), `applyVersion()`, `versionTabs()` and a `[data-ver]` click handler just above the menu-icon line; `lot()` renders `${l.versions ? versionTabs(l) : ""}` after the hero; CSS block `/* Community Space versions */`. Tab order Market, Garden, Makers, Community space (base last; Jemma found the base version boring). Photos lead with the inside shot (index 2 or 3), which is where the versions differ. The 44 pictures are in the asset store.
   **Gallery picture transfer that works**: in the built-in browser on an athena.thesims.com image page, fetch + crop + resize the pictures into `window` vars, pack them into JSON strings of ~250k+ characters each, and return each string from javascript_tool: results that big are saved to a tool-results file automatically, which Python can decode. Never copy base64 by hand (far too slow). EA item data (drop-api) has to be fetched from an ea.com tab (CORS).
3. **Bug fixes (12 Oct evening)**, all in the template's script/CSS:
   - Stats: Favourites/Downloads/Photos sort as numbers, blanks last (`NUMS` in `lotRows`); bed-size Residents notes show "Empty"; `#stats` resets world/hood/status/search (`statsPage(null)`).
   - Carousel: only the current slide is tabbable (`tabindex`), `carGo` resets `.car-view` scrollLeft and slide tabIndex; `focusin` handler syncs; arrow keys only move the carousel that has focus (or the page's carousel when nothing is focused).
   - Lightbox: remembers the opener, traps Tab inside, returns focus on close.
   - `textOn(hex)` picks dark or white text for `.gal-link`; `.tags span` colour is `color-mix(var(--h) 45%, var(--ink))`.
   - Empty Gallery description → no empty `<p class="lede">`.
   - Neighbourhood and household-list tab titles end with " · Jemma's Sim World".
   - **Gallery mismatches (12 Oct, late)**: shell challenge uploads are credited to lilsimsie on the Gallery, with Jemma as `creator.modifierName`, so filtering the list by creatorName misses them. Added Gallery data and pictures for Coorinberg Cottage, Rockridge Springs, Brooks Bridge Borough, Kin-Ship, Hillview Hideaway, Skye Fitness (older upload), Tidal Tower and Briny Tower (pictures in the asset store; bracketed suffixes like "[Simsie Shell]" dropped from titles). Removed links for Affluista Mansion (template for a different build), Abandoned Views (ignore) and Midtown Meadows (on hold; Jemma will compare its two uploads). `gallery.old` shows a note "older version of the build" (Potters Splay, Oakenstead; CSS `.g-old`). Names: Bedlington Boathouse, Copperdale Library (Water Tower Way). Lot sizes: specials filled (Police Station 40x30, FutureSim Labs 50x50, Hospital 50x50, Sixam 20x20, Plumbob Pictures 50x50, Torendi 40x30, Netherworld Department 30x30); Ondarion Bright Cliff and Lakeview units are now Apartments.
   - **Laptop fixes (12 Oct, late)**: Stats tables fit a 1280px laptop (lots table: World + Neighbourhood merged into "Where", sorted by plan order; text columns wrap; "Sims made" header shortened to "Sims"). Neighbourhood pages show a key for the built / shared / Sims icons (`.dot-key`); lot pages have a "Progress" row (`progressRow()`). Unknown links show a "Page not found" page instead of the home page. Card pictures (home world tiles, lot listings) load as they scroll into view (`data-lazy` + `lazyPics()` after each render). Phone layout is parked until Jemma asks.
   - **Quick decisions (12 Oct, ~23:30)**: `esc()` now runs text through `curly()` so every displayed apostrophe/single quote is curly (ids, links and data keys are untouched). EA blurbs and neighbourhood descriptions changed to British spellings in DATA (proper names like "Information Center", "Evergreen Harbor" kept). Copperdale dorms renamed (mine): Prescott Boarding House (ThrifTea), Lakeview Boarding House (Lakeview Library). NAME_FIX adds Agave Abode; "Finchwich" fixed to Finchwick. Roman-numbered apartments (VIII / IX Landgraab Apartments) group into one building. A family business with no family home in its world becomes its own household marked "Owned by" (Greenburg, The Scotts). Footer says lot names are Jemma's own. Tiquelle = four related households (Tiquelle 1 to 4, auto-linked). Goth "Sims made: Not yet" is correct. A weekly scheduled task ("Weekly Gallery stats refresh", Sundays 8:54 London, on Jemma's computer) refreshes Gallery numbers.
   - **Rentals and owners (12 Oct, ~23:50)**: "X own" in Residents means the X family owns that rental (same household, not a related one); `base()` strips " own" and such lots join X's household with `owned` set, shown as "Owned by" on the rental and "Landlord of" on the household. Watch out: the build strips bracketed text from Residents, and the spreadsheet writes "Cahyaputri (own)" with brackets, so "(own)" must be kept when rebuilding (Taka Soi 15 is patched to "Cahyaputri own" on the live page). Other bracketed Residents notes: Rippling Flats "(Current uni sims)", The Gnome's Arms "The Scotts (*NPC)", Hillside Haven "Donovan (move!)". `FAMILY_LINKS` adds confirmed related households (Robles + Robles-Ruano, Greenburg + Knox Greenburg, Gomes + Izadi-Gomes). Moppy Manor / Specter Row: the Specters' home plus tenants.
   - **Household names (13 Oct, ~00:15)**: "?" removed from Eco Roomies, Loden, Koopman, Sarpong; Newbie? and My Sims? stay unsure; Paradise Stables (Gibbi Point) residents "To be decided" (was "Horses!"); 3 Cobblebottom Street residents = Moody & McMillan (owners, live there) plus `TENANTS` map adding Cecilia Kang ("A New Start") as a tenant household on the same lot (lot page shows Household (owners) + Tenant; owners' page shows "Landlord of"; tenant's home shows "(renting)"). Britechester blurb = EA's Discover University text (British "colours"). Typos fixed in Gallery descriptions on the site: "social hotspot", "A stone's throw" (also Mossy Lane). Tartosa "Capp/Monty" now "To be decided" on Stats.

## Rebuilding the site
Layout the build script expects (run from the folder that contains `site/`):
```
new.json                      ← claude/build/new.json (the World Plans spreadsheet as data)
gal_assets/ids.txt            ← claude/build/gallery-picture-ids.txt
site/template.html, build_site.py, descriptions.json, gallery_all.json, gallery_raw.json, comments.json, icons.json, audit.js
site/maps/<world>.jpg + .thumb.jpg          ← see "Maps and screenshots" below
site/shots/<world>/<lot>/<name>.jpg + .thumb.jpg
```
Then `python3 site/build_site.py` → `site/jemmas-sim-world.html`; check with `NODE_PATH=$(npm root -g) node site/audit.js` (run inside `site/`, expect `"errors": []`); publish with the Artifact tool to the URL above.

## Maps and screenshots
Easiest: copy them back from the live site. `Artifact` action `list`, scope `files`, url above lists every published path (maps/…, shots/…); `Artifact` action `read` with `paths` (up to 256 per call) downloads them, keeping their paths. Gallery pictures in the asset store are read one at a time with `path` = the asset id. For local previews, serve a folder over http with the page, maps/, shots/ and `_blob/<id>` files.
Or regenerate from Jemma's folders:
- **Maps**: `claude/build/extract_map.py <package> <out.jpg>` (needs `dbpf.py` beside it) on each `20thCPlumbob-MapReplacement-<World>.package` in her Mods folder; full map max 1800px, thumb 640px wide (`site/maps/<world-slug>.jpg` and `.thumb.jpg`). Textures are ATI2/BC5, luma + chroma (YCoCg) paired by instance.
- **Screenshots**: `claude/build/resize_screenshots.py` turns her Documents\Builds PNG folders into `site/shots/<world>/<lot>/` (full ≤2000px q82, thumb 720px q76, file names become captions). Folder → lot mapping is in the script (e.g. Finchwick Village Hall → henford-on-bagley/5-cobblebottom-street, Olde Platz Inn → windenburg/waterlock-redoubt, Newcrest Wedding Hall → newcrest/cookout-lookout); Willow's → willow-creek/bargain-bend. Skip "Gallery Pirce.png" and "Front Gallery.png".

## Publishing limits (important)
- An artifact version holds at most **511 files**; it has ~451 (page + 60 maps + ~390 screenshots/thumbs). New pictures go in the **asset store** (Artifact publish with `url`, `asset: true`, `file_paths` ≤25 per call); reference them as `/_blob/<id>` and add `name id` lines to `gallery-picture-ids.txt` (the build reads `world-slug__lot-slug id`).
- Max 255 files per publish; use `root` + `files` for supporting files; files left out are kept.

## Gallery data
- Her EA username is JemmaTheSimmer (211 uploads: lots, rooms, households). Read via the built-in browser (she must be signed in to EA there for comments).
- Item data: `https://drop-api.ea.com/ugx/the-sims-4/item/<id>?locale=en`; comments: `…/item/<id>/comments?locale=en` (204 = none); list: `…/list-items?search=JemmaTheSimmer&limit=24&offset=N`.
- Pictures (athena.thesims.com) are blocked from the workspace and her PC shell; fetch them in the browser from an athena page, base64 them, pull out in ~240k-character chunks.
- Apartments were uploaded as **Rooms**; they match by exact title. Lot uploads have a 67px EA frame each side (crop 67–677 of 744); room pictures don't.

## How the data is shaped (build_site.py)
- Names: Gallery title > her own name ("My Name", ignored if just "?") > in-game name.
- Households from the Residents column; a surname is only numbered (Davidson 1/2) across two homes; family businesses (Sims Made = N/A) join the family's household as "Owned by".
- Duplicate uploads: rentals shown first, other version linked; Community Space variants all linked; other duplicates still parked (see notes).
- Apartments grouped into buildings automatically (same name minus unit number, same neighbourhood, 2+ units). Apartments have no lot size; residential rentals keep theirs (decided 12 Oct). Bedrooms for apartments come from `ROOM_INFO` in build_site.py.
- Comment counts include Jemma's own hidden replies (her 11 Oct choice; question open in notes).
- Colours per world are in the `W` list at the top of build_site.py (accent, two deep shades); `GLOW` holds paler dot colours (Mt. Komorebi, and Britechester once carried over).
