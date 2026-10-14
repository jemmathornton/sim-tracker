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
- [ ] [Jemma] Bubble World (82 favourites / 647 downloads) sits on The Old Salt House lot; left unlinked for now (13 Oct: "leave it for now"), until the bonus builds are decided (§5)
- [ ] [Jemma] part1/2/3.zip in the project folder are already unpacked; they can be deleted

## 1. Repeated Gallery uploads (settled 13 Oct)

Her rule: **one upload per lot, the latest**. Exceptions are versions she keeps on purpose: Community Space variants (tabs), rentals with a rental and a regular version (Rio Verde, Fern Park Flats, Inner Circle, Upland Trailer Park, Manzanita Terrace, Old Torget House, and from 14 Oct Slip 42, Spring Steppes and Rockridge Springs), Britechester B&B (café + home) and The Llama Picturehouse (Small Business + Bar, the Small Business one leads). Where copies of a build aren't identical, she chooses.

- [x] Identical copies, latest kept: Café Llama, Sandtrap Flat, De Costadas, Oak Alcove, Strike Out!, Caldera Camp, 930 Medina Studios, Brindleton Boathouse (both Boathouse uploads are this build), Asphalt Abodes (the copy with 4 favourites; she removed the other from the Gallery)
- [x] Her choices: Olde Platz Inn restaurant; Nookstone, Granada Place 3 bedrooms; Comfy Cubby, Palomino Junction 2 bedrooms; Raffia Quinta tiny home with 2 beds (2023); Rindle Rose (not The Treehouse); Sorority Apartment (not 2B Jasmine Suites); Inner Circle without its third copy
- [ ] [Jemma] Hallow Slough: none of its four uploads (Mint Family Home, Mint Starter, Hallow Slough, Hallow Slough (SoupShell)) is for it, so it has no Gallery upload now but is still marked shared. Is its build on the Gallery under another name, or should it be marked not shared?
- [ ] [Jemma] Midtown Meadows: compare its two uploads (link removed for now)

Every upload not on a lot is in `data/gallery/unlinked.json` with the reason.

## 2. Rentals

20 residential rentals (Mossy Lane is University Housing since 14 Oct). Residents are mostly a group label or "Empty"; 4 are owned by a family.

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
| Britechester | Spring Steppes | 3 | Elderberry own it, Pleasant live there too (14 Oct) |
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
- [ ] [Jemma] Confirm unit counts: Taka Soi 15 = 2 (game: units 08 and 09, Cahyaputris in 09, 08 empty); Manzanita Terrace = 3 (her Gallery text, and her save). Her Building #2 save matches the plan for the shared rentals Rio Verde 6, Fern Park Flats 5, Tail's End 4, Inner Circle 4, Upland Trailer Park 4, Old Torget House 3 (research/rentals-and-apartments.md). Unshared rentals aren't read from the save (her rule)
- [x] Settled 14 Oct: Mossy Lane is University Housing (one home); Spring Steppes has 3 units; Rockridge Springs and Slip 42 keep their units and now have rental uploads too (Rockridge Springs' new upload wasn't on the Gallery listing yet on 14 Oct; the Sunday refresh links it)
- [ ] [Claude] Once decided: show each rental's units on its page and neighbourhood card, a household or "Empty" per unit, bedrooms and bathrooms per unit where known

## 3. Apartments

- [ ] [Jemma] Bathrooms for every apartment except 920 Medina Studios (2, from screenshots). Her save has no room counts for units she has rebuilt; the only shared one with numbers was Stonestreet Apartments #3 (1 bathroom, shown since 14 Oct). The rest still need checking in game
- [ ] [Jemma] 1010 Alto Apartments: bedrooms unknown
- [ ] [Jemma] 18 Culpepper House: Gallery says two bedrooms, plan says 1 Bed (site shows 2)
- [ ] [Jemma] 920 Medina Studios: shown as 2 bedrooms (master + child room); are Child Bedroom 1 and 2 two rooms?
- [ ] [Jemma] Confirm guessed bedrooms: 17 Culpepper 1, 19 Culpepper 2 (plan notes), 1310 21 Chic Street 1 (picture), Stonestreet Apartments #4 1 ("couple or single")

## 4. Neighbourhood map spots

- [x] [Claude] Gridded maps for the 24 worlds other than Willow Creek: pictures in `for-jemma/map-grids/` (each lists that world's neighbourhoods underneath), or the clickable `tools/map-squares.html` (click the spot or type the square for each neighbourhood, then Copy answers)
- [x] [Claude] Tried suggesting squares from the game's own map data (13–14 Oct): it can't place neighbourhoods on the map pictures, so no suggestions (research/map-squares.md)
- [ ] [Jemma] Name the square for each neighbourhood (e.g. "Newcrest: Bridgeview C4"), or paste the answers from the clickable page; Claude then adds them as `mapSpot` with `tools/set_map_spots.py` (takes either). Until then those cards show the whole map

## 5. Lot types, groups and names

- [ ] [Jemma] Key Point (Sulani, 40×30) and Mystic Crossroads (Ravenwood, 30×30): lot type still to be decided (ideas in §8)
- 13 Oct: no preference yet on the lot type changes below; left as they are
- [ ] [Jemma] 14 lot types are really place names. Suggested changes (tick the ones to make):
  - [ ] Darby's Den: "UoB Commons" → **UBrite Commons** (type on her Gallery upload)
  - [ ] Boba & Thrift (Planet Honey Pop!, Boba Ippai, Town Square Stores, 18 Celebration Way, Chee-wit Chee-waa Kanto, Thrift 'n' Fish) → **Thrift and Bubble Tea Store** (official name, as on two of her uploads)
  - [x] Myshuno Meadows: stays "Central Park" (14 Oct, her choice; the game calls the type "Center Park")
  - [ ] Belomisia Trailhead: "Campground" → **National Park**
  - [ ] The Magic Realm: keep as a special lot, or **Generic** (her upload's type)?
  - [ ] Plumbob Pictures (secret lot): the game calls it the **Acting Studio** (confirmed in the game's own text, 13 Oct)
  - [ ] Copperdale dorms (Prescott and Lakeview Boarding Houses): "Dorms #1 / #2" → **University Housing** (the research says it works in any world; her SU Plateau Residence in StrangerVille already uses it), or **Residential**, or keep "Boarding House"
  - Larry's Lagoon "Foxbury Commons" is already official. Also already official: Sixam, Police Station, Hospital, Science Lab, Ancient Ruins, Island Bluff, High School, Auditorium, Custom Venue, Netherworld Department, Community Market, Backroom
- [ ] [Jemma] Magnolia Promenade's "Secret Lots" group holds the Police Station, FutureSim Labs and Hospital (in the game they're in hidden neighbourhoods "Civic Center" and "Scientist"); keep or regroup? Some special groups have no description
- [ ] [Jemma] Household names still unsure: Newbie? (Sporting Space) and My Sims? (2-4-3 Wakabamori). Paradise Stables (Gibbi Point) residents "To be decided"
- [ ] [Jemma] Household count consistency (lots vs households in page headers): revisit later
- [ ] [Jemma] Bonus builds section: Robert Piggott School, Von-Windenburg Castle, Bubble World

## 6. From the 13 Oct lot check (research/missing-lots-check.md)

- [x] The 4 missing secret lots added 13 Oct (not built yet): Sylvan Glade (Foundry Cove), Forgotten Grotto (Desert Bloom Park, her choice), Hermit's House (Granite Falls Forest, type Hermit's Hut), Mt. Komorebi Peak (Yukimatsu, type Mount Komorebi Summit). Selvadorada's jungle areas / Omiscan Temple left out
- [x] In-game spellings fixed 13 Oct, each checked against the game's own text: Piccola Luce, The Summer Home, Avenida de la Eternidad, Plaza Mariposa, Creek Side Corner, Champion's Grove, 1313 21 Chic Street (her name column had the same typo on three; fixed too). Her spreadsheet still has the old spellings; the import reads them as the new ones (`data/spreadsheet/renamed.json`)
- [x] Club Eternity (Ravenwood): the game's own files say 30×30, as in the plan (14 Oct); nothing to change
- [ ] [Jemma] Innisgreen (Enchanted by Nature, not owned): the research lists its 14 lots (research/missing-lots-check.md); the game's own files confirm all 14, sizes included (14 Oct). Your other not-owned worlds have their lots in the plan and on Stats; add Innisgreen's too, as not owned?
- [x] Harbor Quarter Gym (her UoW Students Union): now 30×30, the game's size (14 Oct, her choice)
- [x] The Magic Realm: now 50×40, the game's size (14 Oct, her choice)
- [ ] [Jemma] Selvadorada's Omiscan Temple (50×50) and Omiscan Royal Baths (40×30) are real lots in the game files, and Mt. Komorebi's two hidden lots are Mt. Komorebi Base Camp and The Croft Icefall (20×15 each). Add any of them to the plan?
- [x] Checked in the game's own text (13 Oct): "Plateau Place" (her spelling) is right, not "Plateau Palace"
- [x] Batuu: Journey to Batuu isn't installed, so nothing to add
- Left as the research suggested: Selvadorada's jungle areas (not lots in the game either); Netherworld Department stays 30×30 (her confirmed size; the game's file has it at 20×20)

From the overnight check of the plan against the game's own files and her save, 14 Oct (research/plan-vs-game.md; 380 of 388 lots match by name, sizes match except the two above, neighbourhoods are the game's own):
- [x] Lot types where the Gallery and the plan differed, settled 14 Oct: Raffia Quinta, Cottage Am See, Rustic Residence → Tiny Home Residential; Crick Cabana → Residential; Mid-NoWhere → Generic; Belomisia Field Station → Custom Venue; The Bay Café → Café; Llama Picturehouse → Small Business/Bar; Lagoon of Love → Vacation Rental; Carpophagous Corner stays Vacation Rental (none of her 224 uploads is a Vacation Rental, so the Gallery seems not to keep that type)
- [ ] [Jemma] Still to choose: Brooks Bridge Borough (plan Residential, Gallery Haunted House Residential), Admiral's Wreckage and The Old Dockyard (plan Community Space; EA shows their upload type as "Missing sims translation"; the save has Residential and Maker Space)
- [ ] [Jemma] Apartment sizes: the plan has "N/A"; the game gives each building's size (list in research/plan-vs-game.md). Show them?
- Name differences with the game (Magnolia Blossom Park, Desert Bloom Park, Isle of Volpe, The Grimtooth Bar & Bunker): the plan's names read better; noted only

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
- [x] Game version added to the home footer (13 Oct), read from the installed game at each build
- [x] Site-wide search (lots, households, Gallery titles, in-game names) (13 Oct: box at the top of the sidebar; also finds Sims, neighbourhoods and worlds)
- [x] Jump links at the top of long world pages, one per neighbourhood (already there: each world's header lists its neighbourhoods as links, and world pages now show neighbourhood cards rather than one long list)

- [ ] [Jemma] Look over the 13 Oct additions and change any wording or placement: the Packs used block (world pages), "Shared" on Gallery cards, the footer dates (home), the search box (sidebar)

Site ideas, bigger (13 Oct: she chose the five marked; no preference on the others yet):
- [ ] What's new page (dated changelog) (13 Oct: no preference yet)
- [x] Gallery numbers over time (keep each weekly refresh), top builds and biggest gains (13 Oct: Stats → On the Gallery)
- [ ] Automatic Checks panel (spreadsheet vs Gallery mismatches, missing sizes or types, duplicate names) (13 Oct: no preference yet)
- [ ] Empty homes and units page, built with the rentals per-unit view
- [ ] Before and after pictures on rebuilt EA lots (needs her screenshots of the originals)
- [ ] **Chosen 13 Oct:** Household basics for all households (Sims and pets, life stages, family type, played, Neighbourhood Stories)
- [ ] **Chosen 13 Oct:** Relationships between households beyond family
- [ ] **Chosen 13 Oct:** Family tree, Goths first
- [ ] Challenge builds grouping (her Simsie shell builds)
From the research but not on the list until 13 Oct (suggestions only):
- [ ] Beds by age group / capacity for homes and rental units (e.g. "3 beds: 1 double, 2 single; fits 4"), to see where a family fits
- [ ] Lot value as a Stats column (it's already on each lot's Gallery card)
- [ ] Original vs new lot size for lots she resized ("40×30, was 30×20")
- [ ] Filters on world and Stats pages: pack, lot type, lot trait (now that traits are in), built/shared, empty/occupied
- [ ] "New since you looked" markers on lots with new comments or favourites (13 Oct: no preference yet)
- [ ] Timeline of builds by the month they were shared, on the home page (13 Oct: no preference yet)
- [ ] Newest Gallery comments on the Stats page
- [ ] World extras beyond festivals: climate/weather and landmarks per world (data ready, research/world-extras.md)
- [ ] [Claude] A checklist for adding a new world or pack (map, colours, gridded map, lots, households); no input needed
- [ ] Spreadsheet columns for the new fields (lot traits, beds, eco state), if the spreadsheet stays her main copy (needs her OK to change her file)
- [x] **Chosen 13 Oct:** Lot traits per lot. Done for 159 of the 168 shared lots, read from her "Building #2" save (lot pages show "Lot traits" and "Lot challenges"; names are the game's own)
- [x] 9 shared lots had a different name in the save: settled 13 Oct (shell builds keep their challenge names in the game; The Old Salt House's traits come from the older "Building" save)
- [ ] [Jemma] Anchorpoint Works is now called "On Point" in the game. Should the site say On Point? (Its Gallery upload is still called Anchorpoint Works, which wins unless you say otherwise)
- [ ] [Jemma] Bedlington Barn (Cavalier Cove; "Barn Conversion" in the game): built and shared yet? The spreadsheet says built, not shared, and that's what the site shows. Desert Bloom Park has no traits set in the game
- [ ] [Jemma] Household basics, relationships and family tree need Sims, which aren't to come from the Building saves: which save (if any) should they come from, or will you give them?
- [ ] **Chosen 13 Oct:** Neighbourhood eco footprint and festivals/events per world. Data now read from the game (research/world-extras.md): festivals in 9 worlds by neighbourhood, 12 neighbourhoods that don't start Neutral. [Jemma] where and how to show them (ideas at the end of that note)

Things to avoid (from the research): tracking every Sim in detail, values that change every session, EA pack logos as icons, anything AI-generated, percentages outside Stats.
