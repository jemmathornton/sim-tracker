# To-do list

Every open item carried over from the claude.ai project on 13 Oct 2026: the notes doc, the overnight research report, and the chat handover. Ticked items were left out (they're done; see HANDOVER.md §6 for the decisions).

**[Jemma]** = needs her decision or input. **[Claude]** = can be done without her once the app is set up. Tick items here as they're done.

## 0. Moving to the app

- [x] [Jemma] What "an app" means (13 Oct): on her PC for now, easy to put online later
- [ ] [Jemma] Where she edits: undecided, kept flexible. Today Claude edits the app's data; her spreadsheet can still be imported at any time (edits on both sides are kept). Decide later
- [x] [Claude] Rebuild the site in the new setup, matching the live page page for page (all 614 pages checked, 13 Oct)
- [x] [Claude] Gallery pictures are normal files named by lot
- [x] [Claude] Weekly Gallery refresh rebuilt (Windows task, Sundays 08:54) and run once (13 Oct)
- [ ] [Jemma] Turn off the "Weekly Gallery stats refresh" scheduled task in claude.ai (the app has its own now, and the old one only updates the claude.ai page)
- [x] [Claude] `live_overrides.json` folded into the app's data and retired
- [ ] [Jemma] If the spreadsheet stays your main copy: 55 decisions (names, lot types, sizes, built/shared ticks) plus the 13 Oct spelling fixes are in the app but not in the spreadsheet yet. Claude can list them, or make a filled-in copy of the spreadsheet for you to check (your file is never changed without asking)
- [ ] [Jemma] Have a look at the new bits: Stats page → "On the Gallery" at the bottom (keep it there? wording?), and the app icon (Lucide house, brass on purple)
- [ ] [Jemma] Bubble World (new upload, 82 favourites / 647 downloads) is on The Old Salt House lot but left unlinked as a bonus build (§5). Link it to the lot instead?
- [ ] [Jemma] part1/2/3.zip in the project folder are already unpacked; they can be deleted

## 1. Repeated Gallery uploads (settled 13 Oct)

Her rule: **one upload per lot, the latest**. Exceptions are versions she keeps on purpose: Community Space variants (tabs), rentals with a rental and a regular version (Rio Verde, Fern Park Flats, Inner Circle, Upland Trailer Park, Manzanita Terrace, Old Torget House) and Britechester B&B (café + home). Where copies of a build aren't identical, she chooses.

- [x] Identical copies, latest kept: Café Llama, Sandtrap Flat, De Costadas, Oak Alcove, Strike Out!, Caldera Camp, 930 Medina Studios, Brindleton Boathouse (both Boathouse uploads are this build), Asphalt Abodes (the copy with 4 favourites; she removed the other from the Gallery)
- [x] Her choices: Olde Platz Inn restaurant; Nookstone, Granada Place 3 bedrooms; Comfy Cubby, Palomino Junction 2 bedrooms; Raffia Quinta tiny home with 2 beds (2023); Rindle Rose (not The Treehouse); Sorority Apartment (not 2B Jasmine Suites); Inner Circle without its third copy
- [ ] [Jemma] Hallow Slough: none of its four uploads (Mint Family Home, Mint Starter, Hallow Slough, Hallow Slough (SoupShell)) is for it, so it has no Gallery upload now but is still marked shared. Is its build on the Gallery under another name, or should it be marked not shared?
- [ ] [Jemma] Midtown Meadows: compare its two uploads (link removed for now)

Every upload not on a lot is in `data/gallery/unlinked.json` with the reason.

## 2. Rentals

21 residential rentals. Residents are mostly a group label or "Empty"; 4 are owned by a family.

| World | Rental | Units | Residents in the plan |
| --- | --- | --- | --- |
| Oasis Springs | Rio Verde Retirement Home | 6 | Elders |
| Newcrest | Fern Park Flats | 5 | BFF |
| Newcrest | Midtown Meadows | 5 | Single Mum Friends |
| Newcrest | Rippling Flats | 2 | Current uni sims |
| Brindleton Bay | Tail's End Apartments | 4 | Empty |
| Del Sol Valley | Inner Circle | 4 | Roomies |
| Del Sol Valley | Upland Trailer Park | 4 | Eclectic Arts |
| StrangerVille | Slip 42 | 2 | Empty |
| Britechester | Mossy Lane | 4 | Empty |
| Britechester | Spring Steppes | 4 | Elderberry & Pleasant |
| Evergreen Harbor | Rockridge Springs | 3 | Empty |
| Evergreen Harbor | Abandoned Views | ? | Henley |
| Henford-on-Bagley | 3 Cobblebottom Street | 2 | Moody & McMillan (own, live there) + tenant Cecilia Kang "A New Start" |
| San Sequoia | Manzanita Terrace | ? (3 per her Gallery text) | Robles own |
| San Sequoia | Sequoia Cottage | ? | Lovejoy own |
| Tomarang | Taka Soi 15 | ? (2 in game) | Cahyaputri (own) |
| Tomarang | Isda Riverfront | 2 | Rochana/Caberry own |
| Tomarang | Sungai Point | 3 | Linh-Sadya & Linh |
| Ravenwood | Specter Row (Moppy Manor) | ? | Specters' home + tenants |
| Nordhaven | Old Torget House | 3 | Empty |
| Nordhaven | Lighthouse Lookout | ? | Empty |

- [ ] [Jemma] Pick a rental layout. Options from 12 Oct: (1) like apartments, one card listing every unit; (2) a normal lot card with a "Rental · 6 units" badge and a short "Who lives here" box (landlord, tenants, units let/free); (3) landlord links both ways (already done for the "own" rentals); (4) flats as photo tabs where there are per-flat screenshots. Suggestion was 2 + 3 now, switch each rental to 1 once its units are decided, and 4 on Rio Verde.
- [ ] [Jemma] Rio Verde flat tabs (option 4): she said "later, with the rentals"
- [ ] [Jemma] Decide each rental's households unit by unit, and landlords for the 17 rentals without one
- [ ] [Jemma] A "Rental units" tab in World Plans (World · Rental · Unit · Beds · Baths · Household · Landlord)? She was "not sure yet, discuss more"
- [ ] [Jemma] How to show unit counts like "(4)"
- [ ] [Jemma] Confirm unit counts: Taka Soi 15 = 2 (game: units 08 and 09, Cahyaputris in 09, 08 empty); Manzanita Terrace = 3 (her Gallery text). Still unknown: Abandoned Views, Sequoia Cottage, Specter Row, Lighthouse Lookout
- [ ] [Claude] Once decided: show each rental's units on its page and neighbourhood card, a household or "Empty" per unit, bedrooms and bathrooms per unit where known

## 3. Apartments

- [ ] [Jemma] Bathrooms for every apartment except 920 Medina Studios (2, from screenshots). No reliable list exists online; needs checking in game or screenshots
- [ ] [Jemma] 1010 Alto Apartments: bedrooms unknown
- [ ] [Jemma] 18 Culpepper House: Gallery says two bedrooms, plan says 1 Bed (site shows 2)
- [ ] [Jemma] 920 Medina Studios: shown as 2 bedrooms (master + child room); are Child Bedroom 1 and 2 two rooms?
- [ ] [Jemma] Confirm guessed bedrooms: 17 Culpepper 1, 19 Culpepper 2 (plan notes), 1310 21 Chic Street 1 (picture), Stonestreet Apartments #4 1 ("couple or single")

## 4. Neighbourhood map spots

- [x] [Claude] Gridded maps for the 24 worlds other than Willow Creek: pictures in `for-jemma/map-grids/` (each lists that world's neighbourhoods underneath), or the clickable `tools/map-squares.html` (click the spot or type the square for each neighbourhood, then Copy answers)
- [ ] [Jemma] Name the square for each neighbourhood (e.g. "Newcrest: Bridgeview C4"), or paste the answers from the clickable page; Claude then adds them as `mapSpot` with `tools/set_map_spots.py` (takes either). Until then those cards show the whole map

## 5. Lot types, groups and names

- [ ] [Jemma] Key Point (Sulani, 40×30) and Mystic Crossroads (Ravenwood, 30×30): lot type still to be decided (ideas in §8)
- 13 Oct: no preference yet on the lot type changes below; left as they are
- [ ] [Jemma] 14 lot types are really place names. Suggested changes (tick the ones to make):
  - [ ] Darby's Den: "UoB Commons" → **UBrite Commons** (type on her Gallery upload)
  - [ ] Boba & Thrift (Planet Honey Pop!, Boba Ippai, Town Square Stores, 18 Celebration Way, Chee-wit Chee-waa Kanto, Thrift 'n' Fish) → **Thrift and Bubble Tea Store** (official name, as on two of her uploads)
  - [ ] Myshuno Meadows: "Central Park" → **Park**
  - [ ] Belomisia Trailhead: "Campground" → **National Park**
  - [ ] The Magic Realm: keep as a special lot, or **Generic** (her upload's type)?
  - [ ] Plumbob Pictures (secret lot): the game calls it the **Acting Studio**
  - [ ] Copperdale dorms: "Dorms #1 / #2" → **Residential** (University Housing only works in Britechester), or keep "Boarding House"
  - Larry's Lagoon "Foxbury Commons" is already official. Also already official: Sixam, Police Station, Hospital, Science Lab, Ancient Ruins, Island Bluff, High School, Auditorium, Custom Venue, Netherworld Department, Community Market, Backroom
- [ ] [Jemma] Magnolia Promenade's "Secret Lots" group holds the Police Station, FutureSim Labs and Hospital (in the game they're in hidden neighbourhoods "Civic Center" and "Scientist"); keep or regroup? Some special groups have no description
- [ ] [Jemma] Household names still unsure: Newbie? (Sporting Space) and My Sims? (2-4-3 Wakabamori). Paradise Stables (Gibbi Point) residents "To be decided"
- [ ] [Jemma] Household count consistency (lots vs households in page headers): revisit later
- [ ] [Jemma] Bonus builds section: Robert Piggott School, Von-Windenburg Castle, Bubble World

## 6. From the 13 Oct lot check (research/missing-lots-check.md)

- [ ] [Jemma] Add the 4 missing secret lots? Sylvan Glade (Willow Creek, 15×10), Forgotten Grotto (Oasis Springs, 15×10), Hermit's House (Granite Falls, 30×20), Mt. Komorebi Peak (20×20, type "Mount Komorebi Summit"). Selvadorada's jungle areas / Omiscan Temple suggested to leave out
- [x] In-game spellings fixed 13 Oct, each checked against the game's own text: Piccola Luce, The Summer Home, Avenida de la Eternidad, Plaza Mariposa, Creek Side Corner, Champion's Grove, 1313 21 Chic Street (her name column had the same typo on three; fixed too). Her spreadsheet still has the old spellings; the import reads them as the new ones (`data/spreadsheet/renamed.json`)
- [ ] [Jemma] Club Eternity (Ravenwood): plan says 30×30; two sources say 30×20. Check in game
- Innisgreen is on the site as not owned; nothing to do unless she buys Enchanted by Nature. Batuu only if she owns Journey to Batuu.

## 7. Parked until she asks

- [ ] Phone layout: Stats lot names pushed off-screen by the World/Neighbourhood columns
- [ ] Phone layout: lot pages show the same photo twice before the facts

## 8. Ideas from the research (suggestions only; tick to do)

Newer lot types and where they could go (research/lot-types-reference.md):
- [ ] Backroom (library/museum/gym by day, nightclub 9pm–6am): Finchwick Village Hall (nearly one already), Mystic Crossroads (with the Clandestine lot trait), The Rouge Note
- [ ] Community Market: a standalone market at Key Point (beach market), or a lot in Henford or Chestnut Ridge
- [ ] Custom Venue: Key Point as a watersports or beach camp
- [ ] Haunted House Residential: Brooks Bridge Borough (its upload already is), Specter Row (with On Hallowed Grounds)
- Keep in mind for empty lots: Cemetery, Playground, Recreation Center, Karaoke Bar, Onsen, Pool, Spa, Arts Center, Beach. Newer lot traits: Clandestine, Regal Residence, Fairy Passage, On Hallowed Grounds

Site ideas, quick wins (no input needed):
- [x] Packs needed per world (13 Oct: a "Packs used" block on each world page, below the neighbourhoods, with how many builds use each pack)
- [ ] One-word world status on home tiles: Not started / Started / Almost / Complete (she agrees the cut-offs)
- [x] "Shared on the Gallery: <month year>" from the date hidden in 169 upload ids (13 Oct: "Shared" on each lot's Gallery card, e.g. Jan 2017; 124 of the 168 lots with uploads. Ids from 2023 on are random, so newer uploads show no date)
- [x] "Data as of" footer line: spreadsheet date, last Gallery refresh, game patch (13 Oct: home page footer shows the build date and the Gallery check date)
- [ ] [Jemma] Add the game patch to that line? Which one are the maps and lots checked against?
- [x] Site-wide search (lots, households, Gallery titles, in-game names) (13 Oct: box at the top of the sidebar; also finds Sims, neighbourhoods and worlds)
- [x] Jump links at the top of long world pages, one per neighbourhood (already there: each world's header lists its neighbourhoods as links, and world pages now show neighbourhood cards rather than one long list)

- [ ] [Jemma] Look over the 13 Oct additions and change any wording or placement: the Packs used block (world pages), "Shared" on Gallery cards, the footer dates (home), the search box (sidebar)

Site ideas, bigger (13 Oct: she chose the five marked; no preference on the others yet):
- [ ] What's new page (dated changelog)
- [x] Gallery numbers over time (keep each weekly refresh), top builds and biggest gains (13 Oct: Stats → On the Gallery)
- [ ] Automatic Checks panel (spreadsheet vs Gallery mismatches, missing sizes or types, duplicate names)
- [ ] Empty homes and units page, built with the rentals per-unit view
- [ ] Before and after pictures on rebuilt EA lots (needs her screenshots of the originals)
- [ ] **Chosen 13 Oct:** Household basics for all households (Sims and pets, life stages, family type, played, Neighbourhood Stories)
- [ ] **Chosen 13 Oct:** Relationships between households beyond family
- [ ] **Chosen 13 Oct:** Family tree, Goths first
- [ ] Challenge builds grouping (her Simsie shell builds)
- [x] **Chosen 13 Oct:** Lot traits per lot. Done for 159 of the 168 shared lots, read from her "Building #2" save (lot pages show "Lot traits" and "Lot challenges"; names are the game's own)
- [x] 9 shared lots had a different name in the save: settled 13 Oct (shell builds keep their challenge names in the game; The Old Salt House's traits come from the older "Building" save)
- [ ] [Jemma] Anchorpoint Works is now called "On Point" in the game. Should the site say On Point? (Its Gallery upload is still called Anchorpoint Works, which wins unless you say otherwise)
- [ ] [Jemma] Bedlington Barn (Cavalier Cove; "Barn Conversion" in the game): built and shared yet? The spreadsheet says built, not shared, and that's what the site shows. Desert Bloom Park has no traits set in the game
- [ ] [Jemma] Household basics, relationships and family tree need Sims, which aren't to come from the Building saves: which save (if any) should they come from, or will you give them?
- [ ] **Chosen 13 Oct:** Neighbourhood eco footprint and festivals/events per world

Things to avoid (from the research): tracking every Sim in detail, values that change every session, EA pack logos as icons, anything AI-generated, percentages outside Stats.
