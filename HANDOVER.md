# Handover: Jemma's Sim World, from claude.ai chat to Claude Code

Written 13 Oct 2026. §1–§6 below are the state of the project at the moment it left the chat; §0 is what happened next.

## 0. The move to an app (13 Oct 2026, evening)

**What Jemma chose:** an app on her PC for now, kept easy to put online later; where she edits is undecided (keep it flexible); weekly Gallery stats with history; the look kept exactly as it was.

**What it is now:** `site/` is a plain static site (no server needed). Shortcuts called "Jemma's Sim World" (Desktop, Start menu, project folder) open `site/index.html` in its own Chrome window. `tools/build.py` turns `data/` into `site/js/data.js`. Layout and commands are in CLAUDE.md.

**Checked:** before the Gallery refresh, all 614 pages drew exactly the same content as the live claude.ai page (one double space in Briny Tower's description aside), and the pictures are byte-identical. `tools/check_pages.js` passes on all 637 pages after the refresh.

**Where the chat's pieces went** (rules unchanged, only their home):
- `new.json` + `live_overrides.json` → `data/worlds/<world>.json` (every override folded in as a plan value; bracketed planning notes kept, e.g. Moppy Manor "Specter (rent out)", Prospector's Paradise "? (Horses!)"). `RESIDENT_FIX` (Kopf) is now just the data. "(own)" in Residents is now kept by the parser itself.
- `NAME_FIX` → lot `displayName`; `ROOM_INFO` → lot `beds`/`baths`; `TENANTS` → lot `tenants`; `FAMILY_LINKS` → world `familyLinks`; `NB_PT` → neighbourhood `mapSpot`; `CS_VERSIONS` → lot `versions` (numbers now refresh weekly); Goth Sims → world `households`.
- Gallery matching (`GAL_ALIAS`, hashtags…) ran once; its result is stored as each lot's `gallery` id list, so a renamed upload can't silently move. Removed links (Affluista Mansion, Abandoned Views, Midtown Meadows) are in `data/gallery/unlinked.json` with the reason. Description typo fixes → `data/gallery/text-fixes.json`. Titles drop a trailing `[…]` (e.g. "[Simsie Shell]").
- Stats "Residents" for a lot with tenants is generated ("Moody & McMillan (owners) + Cecilia Kang (tenant)").
- Gallery pictures: `/_blob/<id>` → `site/gallery/<world>/<lot>.jpg`. The page code moved to `site/js/app.js` unchanged except that its data constants now come from `DATA`.

**First Gallery refresh (13 Oct):** run from her PC with no sign-in or browser (EA's API answers directly; comments too). 221 uploads; 2 new since 11 Oct: "Hallow Slough (SoupShell)" (linked to Hallow Slough, the 4th copy in TODO §1) and "Bubble World" (left unlinked: a bonus build placed on The Old Salt House lot). Three hashtags now show her own capitals (#SimsieSharkShell).

**New on the site:** Stats page, at the bottom: "On the Gallery" (totals at each weekly check, and the builds that gained most since the check before). App icon: Lucide "home" in brass on the sidebar purple. Added the same evening by a second session (merged): a search box at the top of the sidebar (lots by any of their names, households, Sims, neighbourhoods, worlds); a "Packs used" block on world pages (removed 14 Oct, her choice); "Shared" month on Gallery cards (decoded from upload ids, 2016 to early 2023 only); build and Gallery-check dates in the home footer; and `tools/map-squares.html` + `tools/set_map_spots.py` for the map spots.

**Later on 13 Oct, with Jemma:** lot traits and lot challenges on lot pages, read from her "Building" saves with the game's own names (tools/lot_traits.py; shared lots only, lots only). Repeated Gallery uploads settled: one upload per lot, the latest, except versions she keeps on purpose (Community Spaces, rental + regular, Britechester B&B). Bedlington Boathouse untangled (both uploads are Brindleton Boathouse on Sporting Space; the Cavalier Cove lot is her Bedlington Barn). Six in-game spellings fixed, four secret lots added, game version in the footer.

**Overnight 13–14 Oct (research only, nothing on the site changed):** her plan checked against the game's own files and her newest Building save (research/plan-vs-game.md), world extras read from the game's tuning: weather, festivals by neighbourhood, starting eco footprint, highlights (research/world-extras.md), rentals and apartments from her save (research/rentals-and-apartments.md), and an attempt at map squares from the game's map data, which can't place neighbourhoods (research/map-squares.md). Scripts in `tools/research/`, their output in `research/data/`. Findings that need her are in TODO.md. Two to-do notes had used save details from unshared rentals and apartments; those were taken out (her rule).

**14 Oct with Jemma:** lot types, sizes, rentals and apartment rooms settled; spreadsheet brought in line with the app (backups in Downloads); world extras on the site; Packs used removed; map boxes drawn by her for every world (cards zoom to fit, slide part-way from neighbours; `mapCentred`/`mapZoom` per card). **Overnight 14–15 Oct (write-up only):** data check-up (research/data-check-up.md), Gallery deep dive (research/gallery-deep-dive.md), rental layout mock-ups (for-jemma/rental-layouts.html); one display bug fixed (escaped hearts in comments).

§2 below describes the chat's generator, now in `old-chat-build/` (retired). §4: the refresh no longer needs a browser tab.

## 1. What exists today

**The live site** is a private claude.ai artifact (one hosted page):
https://claude.ai/artifact/QjNDCVMJXENiWmTYZfnkg3
Only Jemma can open it. It covers all 25 owned worlds plus 5 not-owned ones: 352 lots, 126 households, 163 Gallery matches, Gallery favourites/downloads/comments, 390 of her screenshots and 203 Gallery pictures. `live-site/` in this folder is a complete offline copy of it.

**The to-do list** lived in a claude.ai doc ("Jemma's Sim World — project notes", https://claude.ai/code/artifact/23c348ff-724f-47f6-9d2c-e5b3f3470f7b) and a research report doc (https://claude.ai/code/artifact/c2e7b1d7-b6e1-4f19-9eb2-24aa4736d9f6). Every open item from both is now in `TODO.md`, so the docs are reference only from here on. Claude Code can't open them.

**The source of truth for data** is Jemma's spreadsheet, `Downloads\World Plans (fixed).xlsx`: one tab per world, sections per neighbourhood, columns Lot Name, My Name, Lot Type, Lot Size, Residents/Owners, Built, Shared, Screenshots, Sims Made. `build/new.json` is that spreadsheet converted to JSON (as of 11-12 Oct). Changes Jemma approved in chat but that aren't in the spreadsheet yet live in `build/live_overrides.json`.

## 2. How the current build works

```
new.json (spreadsheet) ─┐
gallery_all.json ───────┤
comments.json ──────────┤
descriptions.json ──────┼─► build_site.py ─► one HTML page (template.html with __ICONS__ and __DATA__ filled in)
icons.json (Lucide) ────┤
live_overrides.json ────┤   applied last
maps/, shots/ ──────────┘   referenced by relative path; Gallery pictures by /_blob/<id>
```

Folder layout `build_site.py` expects (run from the folder that contains `site/`):

```
new.json
gal_assets/ids.txt            ← build/gallery-picture-ids.txt ("world-slug__lot-slug <asset id>" per line)
site/template.html, build_site.py, descriptions.json, gallery_all.json, gallery_raw.json,
     comments.json, icons.json, audit.js, live_overrides.json
site/maps/<world-slug>.jpg + .thumb.jpg
site/shots/<world-slug>/<lot-slug>/<name>.jpg + .thumb.jpg
```

Then `python3 site/build_site.py` writes `site/jemmas-sim-world.html`. `audit.js` is a headless check (`NODE_PATH=$(npm root -g) node site/audit.js` inside `site/`, expect `"errors": []`; it needs a headless browser library installed globally).

**Checked on 13 Oct:** a rebuild from the files in `build/` plus the maps and shots from `live-site/` produces a page whose data and code are identical to the live page.

### Data rules baked into the code (keep these when rewriting)

- **Names:** Gallery title > Jemma's "My Name" (ignored if just "?") > in-game name. `NAME_FIX` in the template overrides the Gallery title where Jemma chose a spelling (Agave Abode, The Ice Pavilion, Pinecrest Apartments #404).
- **Residents column → households.** A surname is numbered (Davidson 1 / 2) only when it's on two homes. Bracketed bits are planning notes and are stripped, **except** "(own)": "X own" means the X family owns that rental. It joins X's household, shows "Owned by" on the rental and "Landlord of" on the household. The spreadsheet writes "Cahyaputri (own)" with brackets, so the stripping must keep "(own)" (currently patched via the overrides). Bed-size notes ("2 Bed", "Large 3 Bedroom") mean the home is empty and display as "Empty". Other bracketed notes: Rippling Flats "(Current uni sims)", The Gnome's Arms "The Scotts (*NPC)", Hillside Haven "Donovan (move!)".
- **Family businesses** (Sims Made = N/A) join the family's household as "Owned by". A business with no family home in its world becomes its own household (Greenburg, The Scotts).
- **`FAMILY_LINKS`** adds confirmed related households (Robles + Robles-Ruano, Greenburg + Knox Greenburg, Gomes + Izadi-Gomes). Same-surname households link automatically. Tiquelle = four related households (Tiquelle 1–4).
- **`TENANTS`**: 3 Cobblebottom Street is owned and lived in by Moody & McMillan, with Cecilia Kang ("A New Start") renting a unit. The lot shows Household (owners) + Tenant; the tenant's page says "(renting)".
- **Apartments** are grouped into buildings automatically (same name minus unit number, same neighbourhood, 2+ units; Roman numerals too, e.g. VIII / IX Landgraab). Apartments have no lot size; residential rentals keep theirs. Apartment bedrooms come from `ROOM_INFO` in `build_site.py` because apartments were uploaded to the Gallery as Rooms (no bed/bath counts).
- **Gallery matching:** by exact title, then title without a leading "The", then `GAL_ALIAS`, then lot-name hashtags. Rooms match by exact title only. Shell-challenge uploads are credited to lilsimsie with Jemma as `creator.modifierName`, so a creator filter misses them.
- **Duplicate uploads:** residential rental copies lead and the regular version is linked; Community Space lots show all four versions as equal tabs (`CS_VERSIONS`, order Market, Garden, Makers, Community space; photos lead with the inside shot). Other duplicates are parked (see TODO). `gallery.old` marks an older upload (Potters Splay, Oakenstead).
- **Comment counts** include Jemma's own replies, which are hidden from display (her choice).
- **Colours per world** are in the `W` list at the top of `build_site.py` (accent + two deep shades); `GLOW` holds paler dot colours where the accent is too light for text (Mt. Komorebi; Britechester's live values are in the overrides: color #8F7756, deep #6A5C4A / #817059, glow #EBDAC2).
- **Neighbourhood cards** ("D1", chosen 12 Oct): a close-up of the world map at the neighbourhood's spot (no pin) with a row of circles, one per lot, each linking to its lot; gentle hover (×1.2 hovered, ×1.06 neighbours; she found bigger movement too much); no lot count. Spots are in `NB_PT` as map fractions; **only Willow Creek has them**. Other worlds show the whole map until she names squares on a gridded map.
- **Lot pages** have a Progress row (built / shared / Sims made); neighbourhood pages show a key for the three status icons; unknown links show "Page not found"; card pictures lazy-load.

## 3. Pictures and maps

- **Maps:** `build/extract_map.py <package> <out.jpg>` (needs `dbpf.py` beside it) on each `20thCPlumbob-MapReplacement-<World>.package` in her Mods folder. Textures are ATI2/BC5, luma + chroma (YCoCg) paired by instance. Full map max 1800px wide, thumb 640px.
- **Screenshots:** `build/resize_screenshots.py` turns her `Documents\Builds` PNG folders into `shots/<world>/<lot>/` (full ≤2000px q82, thumb 720px q76; file names become captions). Folder → lot mapping is inside the script (e.g. Finchwick Village Hall → henford-on-bagley/5-cobblebottom-street, Olde Platz Inn → windenburg/waterlock-redoubt, Newcrest Wedding Hall → newcrest/cookout-lookout, Willow's → willow-creek/bargain-bend). Skip "Gallery Pirce.png" and "Front Gallery.png". Captions put exterior shots first and floor plans last.
- **Gallery pictures:** lot uploads have a 67px EA frame on each side (crop x 67–677 of 744); room pictures don't.
- The claude.ai artifact had a 511-file limit, which is why Gallery pictures went into a separate asset store (`/_blob/<id>`). A real app has no such limit, so these can become normal files (`live-site/_blob/` has them all, and `gallery-picture-ids.txt` says which lot each belongs to).

## 4. Gallery data (EA)

- Item data: `https://drop-api.ea.com/ugx/the-sims-4/item/<id>?locale=en`
- Comments: `…/item/<id>/comments?locale=en` (HTTP 204 = none)
- Her uploads: `…/list-items?search=JemmaTheSimmer&limit=24&offset=N`
- Pictures come from athena.thesims.com. In chat these were blocked from the server and had to be fetched inside a browser tab; drop-api had to be called from an ea.com tab (CORS). Comments need her signed in to EA. On her own PC this may be simpler; test first.
- Item data has no lot traits and no upload date, but 169 of 221 upload ids are time-based UUIDs whose date can be decoded (useful for "shared on" dates).
- A **weekly scheduled task** in claude.ai ("Weekly Gallery stats refresh", Sundays 8:54 London, on her computer) refreshes favourites/downloads on the live artifact. It only updates the claude.ai artifact, so once the app replaces it, the refresh needs rebuilding here and that task should be turned off (Jemma can do that in claude.ai).

## 5. Moving to an app: things to settle with Jemma first

She said "an actual app"; nobody has asked what that means yet. Ask before building:

1. **What kind of app:** a website she runs locally, a site hosted online (private or public), or a desktop app? It's private today; whether others should see it matters for hosting and for the Gallery comments shown.
2. **Where data is edited:** keep the spreadsheet as the source (re-import it), or move editing into the app. Either way, `live_overrides.json` should be folded into the source and retired.
3. **Keep the look.** She chose the current design piece by piece (map heroes, world colours, D1 neighbourhood cards, serif display type, listing-style cards). Rebuild the same design rather than restyling unless she asks.

Suggested shape, if she has no preference: data as JSON files (worlds, lots, households, gallery, overrides folded in), a small static-site build (or a simple app framework) that renders the same pages, pictures as normal files, a script for the Gallery refresh, and the spreadsheet import as a script. Laptop first.

## 6. Decisions already made (don't reopen)

All in the notes doc; the important ones:
- Lot naming order and in-game name placement (above). Percentages only on Stats. No AI art.
- Moved families stay in their new world; special and secret lots get their own neighbourhood. "Mine" households (Sulani, Chestnut Ridge) are her own Sims, not created yet.
- Apartments have no lot size; residential rentals keep theirs.
- Von-Windenburg Estate keeps its link to the "Von-Windenburg Castle" upload.
- Comment counts include her hidden replies. Household pages keep "No story yet" / "No Sims added yet". Unsure households keep their "Double-check" note. "0 Sims" on worlds stays. Goth "Sims made: Not yet" is correct.
- Mt. Komorebi's pale map header stays as is.
- Lot types decided 12 Oct (on the site, not yet in the spreadsheet): Quad Manor, Cozy Corner House, Inked Inlet = Library; 2-4-1 Wakabamori, Tam Nang Sands = Cemetery; Starlight Fitness, Movers & Shakers = Gym; Hazakura Lounge = Recreation Center; ZoSul Taman Botani = Wedding Venue; Konst Modern = Museum; Canter Cottage renamed Canter Clinic, Vet Clinic; Abandoned Views and Lighthouse Lookout plain Residential Rental.
- Names fixed on the site 12-13 Oct: The Ice Pavilion, UoW Sports Center, Cordelia Church, 1313 21 Chic Street, Pinecrest Apartments #402/#404, Prescott Boarding House (ThrifTea) and Lakeview Boarding House (Lakeview Library), Bedlington Boathouse (undone 13 Oct: that Cavalier Cove lot is her Bedlington Barn, not shared; both Boathouse uploads belong to Sporting Space / Brindleton Boathouse), Copperdale Library, Finchwick, Agave Abode. Eco Roomies, Loden, Koopman, Sarpong confirmed (no "?"). Paradise Stables residents "To be decided". Tartosa "Capp/Monty" reads "To be decided".
- Gallery links removed: Affluista Mansion (different build), Abandoned Views (ignore), Midtown Meadows (on hold).
- Sizes filled: Police Station 40×30, FutureSim Labs 50×50, Hospital 50×50, Sixam 20×20, Plumbob Pictures 50×50, Torendi 40×30, Netherworld Department 30×30 (Jemma's confirmed size, even though one source says 20×20); Harbor Quarter Gym stays 30×20. Ondarion's Bright Cliff and Lakeview units are Apartments.
- "Kopf?" fixed to "Kopf" in the spreadsheet (12 Oct; backup kept).

## 7. Checklist: adding a world or pack (written 16 Oct)

For when she buys a pack. The five worlds she doesn't own yet (Forgotten Hollow, Tartosa, Moonwood Mill, Ciudad Enamorada, Innisgreen) already have files in `data/worlds/` with `"owned": false`, and rough lot ideas in `research/not-owned-worlds.md`.

1. **Game research first** (read only; the game files change with the pack): rerun `tools/research/game_lots.py`, `world_files.py`, `game_venues.py`, `world_lot_types.py`, then `plan_vs_game.py`. A brand-new world also needs its region in `REGION_WORLD` (`world_extras.py`) and its pack folder in `FOLDER_WORLD` (`plan_vs_game.py`). After a game update, `tools/lot_traits.py --game` re-reads the lot trait names.
2. **World file:** set `"owned": true` in `data/worlds/<world>.json` (a world not there yet needs a new file and a line in `data/worlds.json`). Neighbourhood names and `desc` come from the game (the descriptions are resource 0xA680EA4B, see `world_extras.py`).
3. **Spreadsheet:** she adds or fills the world's tab. `tools/import_spreadsheet.py` reports, then `--apply` brings the lots in (the import refuses lots in a world the app doesn't have yet). Columns J–M are filled from the app. Back up and ask before writing to her spreadsheet.
4. **World extras:** `tools/research/world_extras.py --apply` adds weather, highlights, festivals and eco start.
5. **Map:** `tools/extract_map.py "<…\Mods\20thCenturyPlumbob Maps\…<World>.package>" <world-id>` makes `site/maps/<world>.jpg`. It needs numpy, which isn't installed: ask her first. No other map source (no AI art, no screenshots of other maps).
6. **Colours:** `colour` and `deep` in the world file come from the map and her builds, never one side of the world. `deep` drives the fade at the bottom of the map hero and must match the neighbourhood cards.
7. **Neighbourhood spots:** never guess. Run `tools/map_grids.py` (gridded map in `for-jemma/map-grids/`) or let her use `tools/map-squares.html`. Then `tools/set_map_spots.py` writes `mapSpot`/`mapBox`.
8. **Pictures:** a new Builds folder needs a line in `FOLDERS` in `tools/screenshots.py`. Gallery uploads link to lots by title at the Sunday refresh; anything unclear goes to `data/gallery/unlinked.json` for her.
9. **Lot traits:** `tools/lot_traits.py --apply` (shared lots only, from her newest "Building" save).
10. **Build and check:** `tools/build.py`, then `tools/check_pages.js` in the app preview at 1280px. Look at the new world's pages, commit, and add a line to §0 here.
