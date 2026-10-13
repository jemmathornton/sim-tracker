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
- [ ] [Jemma] If the spreadsheet stays your main copy: 58 decisions from the chat (names, lot types, sizes, built/shared ticks) are in the app but not in the spreadsheet yet. Claude can list them, or make a filled-in copy of the spreadsheet for you to check (your file is never changed without asking)
- [ ] [Jemma] Have a look at the new bits: Stats page → "On the Gallery" at the bottom (keep it there? wording?), and the app icon (Lucide house, brass on purple)
- [ ] [Jemma] Bubble World (new upload, 82 favourites / 647 downloads) is on The Old Salt House lot but left unlinked as a bonus build (§5). Link it to the lot instead?
- [ ] [Jemma] part1/2/3.zip in the project folder are already unpacked; they can be deleted

## 1. Repeated Gallery uploads (parked)

17 lots have more than one upload with no rule yet; the site shows the most popular copy and merges comments. Figures are favourites / downloads (11 Oct). Since 13 Oct, Hallow Slough (SoupShell) is linked too.

| Lot | Uploads | Kind |
| --- | --- | --- |
| Rindle Rose | Rindle Rose, residential 13 / 95; The Treehouse, generic 0 / 17 | Different type |
| Hallow Slough | Mint Family Home 6 / 25; Mint Starter, 1 bed 3 / 22; Hallow Slough 0 / 6; Hallow Slough (SoupShell), haunted 3 / 11 | Different names |
| Olde Platz Inn | restaurant 11 / 125; residential 3 / 30 | Different type |
| Britechester B&B | residential 8 / 29; café 7 / 33 | Different type |
| Raffia Quinta | 2 tiny home (2 / 9, 2 / 9); 2 residential (0 / 9, 1 / 13) | Different type |
| Nookstone | 3 beds 3 / 15; 1 bed 2 / 8 | Fewer beds |
| Palomino Junction | 2 beds 38 / 268; 1 bed 4 / 18 | Fewer beds |
| Granada Place | 3 beds 6 / 42; 0 beds 2 / 47 | Fewer beds |
| Comfy Cubby | 2 beds 2 / 2; 0 beds 0 / 16 | Fewer beds |
| Asphalt Abodes | 4 / 20; 1 / 26 | Same build twice |
| De Costadas | 2 / 52; 0 / 10 | Same build twice |
| Café Llama | 2 / 12; 0 / 22 | Same build twice |
| Sandtrap Flat | 5 / 13; 2 / 13 | Same build twice |
| Caldera Camp | 2 / 22; 6 / 35 | Same build twice |
| Strike Out! | 2 / 42; 11 / 71 | Same build twice |
| Oak Alcove | 0 / 9; 0 / 10 | Same build twice |
| Bedlington Boathouse | Bedlington Boathouse 20×20, 1 bed 1 / 26; Brindleton Boathouse 30×20, 2 / 15 | Different size |

Also uploaded twice but not in the plan: 930 Medina Studios and Jameson. The Inner Circle has a third copy ("Inner Circle", 0 beds, 4 / 28), linked under its rental.

- [ ] [Jemma] Decide these. Proposed default: lead with the copy that matches the plan, link the others, and add up favourites, downloads and comments across copies. Her open question on the notes doc: does the default apply to all of them, or should some lead with a different copy?
- [ ] [Jemma] Midtown Meadows: compare its two uploads (link removed for now)

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
- [ ] [Jemma] In-game spellings to fix (her own names untouched): Piccola Luca → Piccola Luce (Tartosa); The Summer House → The Summer Home (Windenburg); Avenida de la Eternida → Avenida de la Eternidad and neighbourhood Plaza Maripoza → Plaza Mariposa (Ciudad Enamorada); Creekside Corner → Creek Side Corner (Glimmerbrook); Champions' Grove → Champion's Grove (Chestnut Ridge); 1313 21 Chic street → Street (done on the site, not in the spreadsheet)
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
- [ ] Sento Senbamachi works as a Spa or an Onsen, if she wants a second Onsen
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

Site ideas, bigger:
- [ ] What's new page (dated changelog)
- [x] Gallery numbers over time (keep each weekly refresh), top builds and biggest gains (13 Oct: Stats → On the Gallery)
- [ ] Automatic Checks panel (spreadsheet vs Gallery mismatches, missing sizes or types, duplicate names)
- [ ] Empty homes and units page, built with the rentals per-unit view
- [ ] Before and after pictures on rebuilt EA lots (needs her screenshots of the originals)
- [ ] Household basics for all households (Sims and pets, life stages, family type, played, Neighbourhood Stories)
- [ ] Relationships between households beyond family
- [ ] Family tree, Goths first
- [ ] Challenge builds grouping (her Simsie shell builds)
- [ ] Lot traits per lot (not in Gallery data, so a spreadsheet column)
- [ ] Neighbourhood eco footprint and festivals/events per world

Things to avoid (from the research): tracking every Sim in detail, values that change every session, EA pack logos as icons, anything AI-generated, percentages outside Stats.
