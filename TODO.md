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
- [x] Her spreadsheet updated with everything decided in the app (14 Oct, her request): 83 cells, the spelling fixes and the 4 secret lots as new rows (the percentages and the Overview take them in). Her old copy is kept as `World Plans (fixed) - backup 14 Oct.xlsx`. Only difference left: the Residents cell of 3 Cobblebottom Street and Spring Steppes still names owners and tenants together, which the app splits
- [ ] [Jemma] Have a look at the new bits: Stats page → "On the Gallery" at the bottom (keep it there? wording?), and the app icon (Lucide house, brass on purple)
- [ ] [Jemma] Bubble World (82 favourites / 647 downloads) sits on The Old Salt House lot; left unlinked for now (13 Oct: "leave it for now"), until the bonus builds are decided (§5)
- [ ] [Jemma] part1/2/3.zip in the project folder are already unpacked; they can be deleted

## 1. Repeated Gallery uploads (settled 13 Oct)

Her rule: **one upload per lot, the latest**. Exceptions are versions she keeps on purpose: Community Space variants (tabs), rentals with a rental and a regular version (Rio Verde, Fern Park Flats, Inner Circle, Upland Trailer Park, Manzanita Terrace, Old Torget House, and from 14 Oct Slip 42, Spring Steppes and Rockridge Springs), Britechester B&B (café + home) and The Llama Picturehouse (Small Business + Bar, the Small Business one leads). Where copies of a build aren't identical, she chooses.

- [x] Identical copies, latest kept: Café Llama, Sandtrap Flat, De Costadas, Oak Alcove, Strike Out!, Caldera Camp, 930 Medina Studios, Brindleton Boathouse (both Boathouse uploads are this build), Asphalt Abodes (the copy with 4 favourites; she removed the other from the Gallery)
- [x] Her choices: Olde Platz Inn restaurant; Nookstone, Granada Place 3 bedrooms; Comfy Cubby, Palomino Junction 2 bedrooms; Raffia Quinta tiny home with 2 beds (2023); Rindle Rose (not The Treehouse); Sorority Apartment (not 2B Jasmine Suites); Inner Circle without its third copy
- [x] Hallow Slough: not shared yet (14 Oct); none of its four uploads is for it
- [x] Midtown Meadows: uses her new rental upload (14 Oct), now built and shared; the two older uploads stay off the site

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
| Evergreen Harbor | Abandoned Views | ? (not finished, 14 Oct) | Henley |
| Henford-on-Bagley | 3 Cobblebottom Street | 2 | Moody & McMillan (own, live there) + tenant Cecilia Kang "A New Start" |
| San Sequoia | Manzanita Terrace | ? (3 per her Gallery text) | Robles own |
| San Sequoia | Sequoia Cottage | 2 (14 Oct) | Lovejoy own |
| Tomarang | Taka Soi 15 | 2 (14 Oct) | Cahyaputri (own) |
| Tomarang | Isda Riverfront | 2 | Rochana/Caberry own |
| Tomarang | Sungai Point | 3 | Linh-Sadya & Linh |
| Ravenwood | Specter Row (Moppy Manor) | ? (not finished, 14 Oct) | Specters' home + tenants |
| Nordhaven | Old Torget House | 3 | Empty |
| Del Sol Valley | Upland Trailer Park | 4 | Eclectic Arts (StrangerVille's 3 friends, a trailer each; she may split them into 3 households) + Johnny Zest in the 4th (16 Oct) |
| Ondarion | Casa Do Corsário | 2 or 3 (to decide, 16 Oct) | Aloisio Romualdo own |
| Nordhaven | ~~Lighthouse Lookout~~ | no longer a rental: the Library since 15 Oct | – |

- [ ] [Jemma] Pick a rental layout. **Mock-ups of all four with her real rentals: `for-jemma/rental-layouts.html`** (opens from the folder; 15 Oct). Options from 12 Oct: (1) like apartments, one card listing every unit; (2) a normal lot card with a "Rental · 6 units" badge and a short "Who lives here" box (landlord, tenants, units let/free); (3) landlord links both ways (already done for the "own" rentals); (4) flats as photo tabs where there are per-flat screenshots. Suggestion was 2 + 3 now, switch each rental to 1 once its units are decided, and 4 on Rio Verde.
- [ ] [Jemma] Rio Verde flat tabs (option 4): she said "later, with the rentals"
- [ ] [Jemma] Decide each rental's households unit by unit, and landlords for the 17 rentals without one
- [ ] [Jemma] A "Rental units" tab in World Plans (World · Rental · Unit · Beds · Baths · Household · Landlord)? She was "not sure yet, discuss more"
- [ ] [Jemma] How to show unit counts like "(4)"
- [x] Unit counts confirmed 14 Oct: Taka Soi 15 = 2, Sequoia Cottage = 2, Manzanita Terrace = 3; the save matches the plan for Rio Verde 6, Fern Park Flats 5, Tail's End 4, Inner Circle 4, Upland Trailer Park 4, Old Torget House 3
- [ ] [Jemma] Abandoned Views and Specter Row: unit counts once they're finished
- [x] Settled 14 Oct: Mossy Lane is University Housing (one home); Spring Steppes has 3 units; Rockridge Springs and Slip 42 keep their units and now have rental uploads too (Rockridge Springs' new upload wasn't on the Gallery listing yet on 14 Oct; the Sunday refresh links it)
- [ ] [Claude] Once decided: show each rental's units on its page and neighbourhood card, a household or "Empty" per unit, bedrooms and bathrooms per unit where known

## 3. Apartments

- [x] Bedrooms and bathrooms of every shared apartment, checked in game 14 Oct (she counts only rooms used as bedrooms, not gyms, music or art rooms): 17 Culpepper 1/1, 18 Culpepper 2/1, 19 Culpepper 1/1, Fraternity and Sorority Apartments 3/1, 920 Medina 2/2, 930 Medina 4/2, 122 Hakim 2/2, 1310 21 Chic Street 1/1, 1010 Alto 3/3, Stonestreet #3 2/1, #4 1/1, Pinecrest #404 2/1

## 4. Neighbourhood map spots

- [x] [Claude] Gridded maps for the 24 worlds other than Willow Creek: pictures in `for-jemma/map-grids/` (each lists that world's neighbourhoods underneath), or the clickable `tools/map-squares.html` (click the spot or type the square for each neighbourhood, then Copy answers)
- [x] [Claude] Tried suggesting squares from the game's own map data (13–14 Oct): it can't place neighbourhoods on the map pictures, so no suggestions (research/map-squares.md)
- [x] Done 14 Oct: she drew a box around every neighbourhood on the clickable page (Willow Creek redone too), saved as `mapSpot` + `mapBox`; each card zooms to fit its box. Checked against the plots on each map; the overlaps are only bare ground (e.g. Chestnut Ridge's L-shaped neighbourhoods). The Secret/Special Lots groups and The Magic Realm have no box, on purpose
- If a map picture is ever replaced (e.g. by her own in-game map screenshot): line the old and new pictures up and move the boxes to match, then let her check the cards
- [ ] [Jemma] San Myshuno's boxes: recheck later (the night map shows no lots, so the apartment buildings are hard to place)
- [ ] [Jemma] Whispering Glen (Ravenwood): recheck its card later (14 Oct: box redrawn, card kept centred and zoomed in a quarter closer)
- Cards slide their view part of the way (60% of the spare room, keeping the margin round the box) towards the side that shows less of the neighbouring boxes (14 Oct: Windslar showed a Crumbling Isle lot; sliding all the way made Crow's Crossing lopsided and clipped Whispering Glen)

## 5. Lot types, groups and names

- [ ] [Jemma] Key Point (Sulani, 40×30): lot type still to be decided (Mystic Crossroads settled 16 Oct) (15 Oct: still deciding; ideas in §8). Mystic Crossroads ideas (Ravenwood has no café, pub, park, gym or shops): an occult curiosities shop, a gothic tea room/café, or a pub. See research/community-lots-mix.md for what each world is missing. Key Point (15 Oct): a lot on its own tiny island; she wants minimal structure there, so not a Community Market. Some sources say it has the Off-the-Grid trait; the game only lets that trait work on homes, rentals, small businesses and Generic lots, so a park, beach or custom venue there would be on the grid. 16 Oct, her choice: Mystic Crossroads becomes a Small Business, a tarot and curiosities shop (owner to pick); Key Point still open
- [x] [Jemma] **Ondarion: discussed 16 Oct** (was "nothing decided yet", 15 Oct). All its lots are open; start from what it's missing (research/community-lots-mix.md). Deep dive ready (16 Oct): research/ondarion.md, with the free lots and four questions. 16 Oct: the four homeless Sims (Fia Acosta, Connie Fidential, Akachi Onoja, Consort Capp) stay homeless, as the game intends (her choice); the five free lots stay open; Giardino Del Grandioso becomes the Alto family vineyard (Small Business Residential, her choice): Enzo's mother, sister and brother-in-law (to create) own it together; Enzo stays at 12 Lakeview. Idea (decide in game): the vineyard family as the Alto dynasty with Enzo an outcast (in the game Enzo founded the Alto dynasty and is its only member). Fisherman's Hut (Verdemar) becomes a seafood Restaurant (her choice; Verdemar had only the pirate bar). Ye Olde Voyager stays a Bar (Fia Acosta frequents it). Sankofa Residence (Dambele) becomes a Museum with a wedding arch and reception room, so the dynasties can marry there (her choice; a museum gets daily visitors, a Wedding Venue doesn't). Check in game that the wedding planner offers a museum lot as a venue. The Lair in the Open-Air (Verdemar) becomes a Park, with the pier out the back (her choice). Casa Do Corsário (Verdemar) becomes a Residential Rental with 2 or 3 units (her choice, 16 Oct): Aloisio Romualdo stays, owning it and renting out the other units; unit count to decide. 17 Bright Cliff and 13 Lakeview stay empty homes. Ondarion: done for now. Nectar-making needs Horse Ranch (make and drink Ranch Nectar are small-business activities)
- [x] [Jemma] (15 Oct, her request; ideas written 16 Oct in research/not-owned-worlds.md, to look over): a rough plan for the worlds she doesn't own yet, so there are lot ideas ready if she buys them: Forgotten Hollow (Vampires, 5 lots), Tartosa (My Wedding Stories, 9), Moonwood Mill (Werewolves, 5), Ciudad Enamorada (Lovestruck, 13), Innisgreen (Enchanted by Nature, 14). Same approach as today: what each world ships with, its character, and which lot types it lacks Done 16 Oct: all five planned with her (see the world items below)
- [x] [Jemma] Ciudad Enamorada (not owned, 16 Oct): Calle del Ensueño becomes a Community Market on the plaza; Torres Amanecer (downtown penthouse) becomes a rooftop Restaurant (raised lots take venues, e.g. Torendi Tunes on a San Myshuno penthouse) (her choices). Caminito del Deseo becomes a garden Wedding Venue by the plaza, and Casita del Amor a Recreation Center for the suburb (her choices). Laguna del Abrazo becomes a Karaoke Bar (the game's text promises singing; add a karaoke machine). Mansión de la Pasión stays an empty home for now (she may change it; a small library was the idea). Ciudad Enamorada: done for now
- [x] [Jemma] Innisgreen (not owned, 16 Oct): plan filled with the game's defaults (families, museum, park, pub, lounge); 1 Mari Shores Road becomes a Café (seafront tea room), Fern & Frond Wading Pond a Community Market (foraged goods), The Watering Hole a Custom Venue (a fairy healing retreat for the world's apothecary "Healing Haven"), Starsong Lounge a Nightclub (a fairy dance hall, a nod to the Irish céilí; it has Great Acoustics) (her choices). Greenwood Hamlet Residence becomes a Small Business: an apothecary selling remedies, next to Clover's Seeds and Supplies; owned by Todd Attenberry for now (he runs an apothecary business in the game; she may pick someone else) (her choice). No vet or cemetery (don't fit); library left to Devlin's Books. Crannamor stays an empty home. Innisgreen: done for now
- [x] [Jemma] Forgotten Hollow (not owned, 16 Oct, her choices): Vlad and the Vatores as the game ships them; Garliclauter Place becomes a Backroom (a history library by day, a hidden club at night; vampires keep themselves secret, unlike Ravenwood); Fledermaus Bend a Cemetery ("a perfect plot to call your final resting place"); Widowshild Townhome for new vampires of her own, maybe. Backrooms now 5
- [ ] [Jemma] Moonwood Mill (not owned, 16 Oct): rows straightened; The Moonwood Mill Library tagged Library/Backroom, to decide when she owns it (as a Backroom, Wolfgang Wilder, the werewolf townie librarian, probably stops working there: his job belongs to the Library lot type). New Moon Cabins becomes a Residential Rental (cabins as units for young werewolves; unit count to decide); Rory's friend at the Full Moon Shack is a new Sim she'll make (her choices)
- [x] Evergreen Harbor community lots (15 Oct, her choices; research/evergreen-harbor.md): Sprucewood Square becomes a Community Market; The Old Mill a Backroom (climbing gym by day: make the 3 daytime objects ordinary gym kit, climbing walls on top, as it's not confirmed the wall counts); The Quarry Building becomes Small Business Residential for the Sterling Ricos (they leave Stonestreet Apartments #4, now empty; untick built, as it was planned as a community space). The Old Dockyard stays the community space; Canal Corner (Tinkers) and The Portsmouth Promenade (Greenburgs) stay small businesses
- [x] [Jemma] Windenburg: Quad Manor (not built) as a Backroom instead of a library? (15 Oct, her idea; UoW Students Union is a library by type but really a student union). It would be the 5th Backroom now that Movers & Shakers is a Recreation Center (was "6th" before that). 16 Oct, her choice: stays a Library
- Community mix look (15 Oct): kept as planned: Chestnut Ridge (The Rusty Horseshoe is the game's own dance hall, a nightclub; Sweet Nectar Glade stays a bar beside the vineyard), Henford (The Gnome's Arms serves food in the game), Sulani (island vibes; no restaurant needed), San Myshuno (a city, and karaoke's own pack)
- Underused lot types, one at a time (15 Oct; research/community-lots-mix.md, evergreen-harbor.md, tomarang.md, nordhaven.md). Community Market: 4 (Zanbira, Sprucewood Square, Ro Kaya Rockside in Tomarang, and 18 Celebration Way in San Sequoia, a farmers' market by Gilbert Gardens park, was a Thrift and Bubble Tea Store). Not Quad Manor (Windenburg). Tomarang: look at the whole world first (Tam Nang Sands was the idea). Not Key Point (keep it minimal), not Mystic Crossroads (she wants something more commercial there), not 2 Olde Mill Lane (too far out of town; Henford keeps its vet), and Brindleton Bay keeps both vets Café: no change (15 Oct). Bubble tea stores, the bakery and coffee-selling small businesses do the same job, so 11 café-type places is within range; only the proper Café lot type is rare (4). "Drink Coffee" added to the Plumbob Pictures Museum's activities (16 Oct) Gym (counted apart from Recreation Centers, her view): New Harbor Park (Nordhaven) was briefly a Gym, then a Community Space (see below). Britechester, Newcrest and Brindleton Bay have no space. Gyms now 5, plus two Backrooms that are gyms by day (The Old Mill, and BridgeCreek Drive in Copperdale: give it gym kit): done (her view: Tomarang, Ondarion and Brindleton Bay don't need one; Britechester has no space). Newcrest: no gym (her view: it's a suburb of San Myshuno, so its Sims use the city's gym). Nordhaven's doubled tattoo and pottery businesses (Fisherman's Wharf and their own lots) are on purpose. Nordhaven still has no restaurant (Lighthouse Lookout went to the library instead) Recreation Center: Hazakura Lounge (Mt. Komorebi) stays a Rec Center (her choice: it's in Wakaba, the suburb, not by the ski area; Kiyomatsu Point's custom venue will have a bar and restaurant area, and Boba Ippai and the izakaya cover the rest), even though the game means it as a lounge. Finchwick Village Hall stays a Library (her view: a small, posh English village with a wedding area, not a rec center). Rec Centers: 4 (Anchorpoint, Gibbi, Hazakura, and Movers & Shakers in Willow Creek, was a Backroom: her choice, Willow Creek is the quiet family town and its Sims go to San Myshuno for nights out). Rec Centers include a gym space. Playground: Nordhaven swap (her choice): Inked Inlet (20×20, in front of the Iverstad markets) becomes a Playground and Lighthouse Lookout (50×40, was an empty rental) becomes the Library, a waterfront library like Scandinavian harbour libraries. Not LaSuli Point (a teen area) and not 2-4-1 Wakabamori (a cemetery suits Japan). Myshuno Meadows (Center Park) stays as is. Playgrounds done at 4 (her view: open-world playsets, Rec Centers, pools, and play areas in other lots such as rentals already give kids plenty; the count of Playground lots undersells it). Spa: fine at 3. Pool: fine at 2 (UoW Sports Center and StrangerVille's gym have pools too). Beach: leave (only Sulani allows it). Onsen: Crystal Cottage (Gibbi Point, Crystal Valley) becomes an Onsen Bathhouse (her choice: its fancy garden feels commercial; Gibbi Point's blurb has underground hot springs, and the outback mining town of Lightning Ridge has real hot baths); the Addam Commune move to Miner's Manse (was empty). Onsens now 3. Karaoke Bar: done at 3 (The Royal Crown in Britechester stays a classic pub, her choice). Arts Center: fine at 2 (Konst Modern's workshops, the UoB Commons, maker spaces, Rec Centers and small businesses also cover making art). Custom Venue: fine at 5 (ideas not taken: a B&B at 13 Nettle Lane, Henford; a beach hangout at Key Point; a Senior Living Community at Celebration Center, San Sequoia. A custom venue needs only a sink, toilet and bin). Community Space: New Harbor Park (Nordhaven, 50×40, an abandoned industrial shell in Iverstad) becomes a Community Space instead of the gym (her choice: suits the hobby city; maker space or garden). Community Spaces now 4; gyms 5. National Park: fine at 3 (her view: they're special lots for specific places; Key Point left alone). Retail: The Old Clocktower and Foxbury Court (Britechester) are Nightclubs, not Nightclub/Retail (her correction; their uploads mention a student shop inside). Thrift and Boba Stores count as cafés, not shops. Shops (retail, selling small businesses, markets) are about 10, below 15–25, but Sims shop by phone and retail only opens when the owners are played. Retail: fine as is (her view: retail isn't used much in game). Mystic Crossroads stays to be decided (something commercial).
- [x] [Jemma] Restaurants (missed in the 15 Oct pass; research/community-lots-mix.md): 14, below the realistic 18–25. None in Selvadorada, StrangerVille, Sulani, Glimmerbrook, Britechester, Evergreen Harbor, Henford-on-Bagley, Copperdale, Tomarang, Nordhaven and Ondarion. Already judged fine without one: Sulani (island vibes), Henford (The Gnome's Arms serves food), Tomarang (Night Market, Community Market, the Gecko). Still to look at: the rest. Write-up (16 Oct): research/restaurants.md: seven of the eight are fine given what feeds them; Ondarion is the one real chance; suggests lowering the range to about 12–18, like parks. 16 Oct, her choice: range lowered to 12–18, so 14 is fine; Ondarion may still add one in its discussion
- [x] Tomarang (15 Oct; research/tomarang.md, her choices): The Screaming Gecko is now a Karaoke Bar (add a karaoke machine in game); Ro Kaya Rockside becomes a Community Market next to the Night Market (was a restaurant; the open-world Night Market barely works, and the market's kitchen, the Gecko and the thrift store's bubble tea cover food); Tam Nang Sands becomes a beachfront Spa (was a cemetery; a spa suits Southeast Asia better than an onsen). The game's Community Market is a day market: vendors 9 am to about 7:30 pm, shoppers until about 11 pm
- 13 Oct: no preference yet on the lot type changes below; left as they are
- [x] [Jemma] Lot types that are really place names or shorthand (15 Oct, her rule: official names, except her British/own replacements):
  - [x] Darby's Den: stays **UoB Commons** (her choice: Britechester is meant to be British; "UBrite" is an odd American abbreviation)
  - [x] Boba & Thrift (6 lots, incl. Magnolia Mall) → **Thrift and Boba Store** (the official shape, but "boba", not "bubble tea", her choice)
  - [x] Myshuno Meadows: **Center Park** (15 Oct: she checked in game, it's the real type name)
  - [x] Belomisia Trailhead: "Campground" → **National Park**
  - [x] The Magic Realm: stays (it is the game's own lot type name)
  - [x] Plumbob Pictures (secret lot) → **Acting Studio**
  - [x] Copperdale dorms (Prescott and Lakeview Boarding Houses): "Dorms #1 / #2" → **University Housing**
  - [x] The ██████ Lab: "Special" → **Secret Lab**; FutureSim Labs: "Science Lab" → **FutureSim Labs** (the game's names)
  - Larry's Lagoon "Foxbury Commons" is already official. Also already official: Sixam, Police Station, Hospital, Ancient Ruins, Island Bluff, High School, Auditorium, Custom Venue, Netherworld Department, Community Market, Backroom
- [ ] [Jemma] Later: check the small business lot types (15 Oct). It must stay obvious a business is run from the lot, not just a home. "Small Business Residential" (6 lots: The Quarry Building, Koffieboon, Fisherman's Wharf, Canalside Daycare, Terra-Potta, Spilled Neon) is her own label (the game has Residential with a business registered); "Small Business" (3), "Small Business/Bar" and "Small Business (Museum & Acting Classes)" are "Small Business Venue" in the game
- [ ] [Jemma] Later: Magnolia Promenade's "Secret Lots" group (Police Station, FutureSim Labs, Willow Creek Hospital and Sixam): keep for now (15 Oct); maybe regroup later. Some special groups have no description
- [x] Brindleton Boathouse (Sporting Space) and 2-4-3 Wakabamori: empty for now (14 Oct)
- [ ] [Jemma] Paradise Stables (Gibbi Point): residents "To be decided" (15 Oct: still deciding)
- [ ] [Jemma] LaSuli Point (Copperdale, Plumbite Cove, 20×15): park or cemetery? Tagged "Park/Cemetery" for now (15 Oct; no longer the restaurant, so Copperdale has no restaurant)
- [ ] [Jemma] Household count consistency (lots vs households in page headers): revisit later
- [ ] [Jemma] Bonus builds section: Robert Piggott School, Bubble World (15 Oct: not now; Von-Windenburg Castle is the Estate lot's build)

## 6. From the 13 Oct lot check (research/missing-lots-check.md)

- [x] The 4 missing secret lots added 13 Oct (not built yet): Sylvan Glade (Foundry Cove), Forgotten Grotto (Desert Bloom Park, her choice), Hermit's House (Granite Falls Forest, type Hermit's Hut), Mt. Komorebi Peak (Yukimatsu, type Mount Komorebi Summit). Selvadorada's jungle areas / Omiscan Temple left out
- [x] In-game spellings fixed 13 Oct, each checked against the game's own text: Piccola Luce, The Summer Home, Avenida de la Eternidad, Plaza Mariposa, Creek Side Corner, Champion's Grove, 1313 21 Chic Street (her name column had the same typo on three; fixed too). Her spreadsheet still has the old spellings; the import reads them as the new ones (`data/spreadsheet/renamed.json`)
- [x] Club Eternity (Ravenwood): the game's own files say 30×30, as in the plan (14 Oct); nothing to change
- [x] Innisgreen's 14 lots added as not owned (15 Oct): Coast of Adhmor, Sprucederry Grove, Everdew; on Stats with the other not-owned worlds, and in her spreadsheet (new Innisgreen tab and Overview row, backup kept)
- [x] Harbor Quarter Gym (her UoW Students Union): now 30×30, the game's size (14 Oct, her choice)
- [x] The Magic Realm: now 50×40, the game's size (14 Oct, her choice)
- [x] Hidden lots added as secret lots, not built (15 Oct): Mt. Komorebi Base Camp and The Croft Icefall (Yukimatsu, before the Peak), Omiscan Royal Baths (Belomisia Jungle). Omiscan Temple left out (five game-controlled layouts)
- [ ] [Jemma] Base Camp and The Croft Icefall: lot type to check in game (one Gallery copy suggests Mount Komorebi Summit, like the Peak) (research/hidden-lots-check.md)
- [x] Checked in the game's own text (13 Oct): "Plateau Place" (her spelling) is right, not "Plateau Palace"
- [x] Batuu: Journey to Batuu isn't installed, so nothing to add
- Left as the research suggested: Selvadorada's jungle areas (not lots in the game either); Netherworld Department stays 30×30 (her confirmed size; the game's file has it at 20×20)

From the overnight check of the plan against the game's own files and her save, 14 Oct (research/plan-vs-game.md; 380 of 388 lots match by name, sizes match except the two above, neighbourhoods are the game's own):
- [x] Lot types where the Gallery and the plan differed, settled 14 Oct: Raffia Quinta, Cottage Am See, Rustic Residence → Tiny Home Residential; Crick Cabana → Residential; Mid-NoWhere → Generic; Belomisia Field Station → Custom Venue; The Bay Café → Café; Llama Picturehouse → Small Business/Bar; Lagoon of Love → Vacation Rental; Carpophagous Corner stays Vacation Rental (none of her 224 uploads is a Vacation Rental, so the Gallery seems not to keep that type)
- [x] Also 14 Oct: Brooks Bridge Borough → Haunted House Residential; Admiral's Wreckage and The Old Dockyard stay Community Space
- [x] Apartment sizes: leave as they are (15 Oct, her choice)
- Name differences with the game (Magnolia Blossom Park, Desert Bloom Park, Isle of Volpe, The Grimtooth Bar & Bunker): the plan's names read better; noted only

From the data check-up, 15 Oct (research/data-check-up.md; sizes, uploads and shared ticks all agree):
- [x] Ticked "Screenshots" for the 7 lots with pictures (15 Oct, app and spreadsheet)
- [x] Von-Windenburg Estate shows the 38 pictures from the "Von-Windenburg Castle" Builds folder (15 Oct, her choice: the castle is the Estate's build)
- [ ] [Jemma] Bailey-Moon Manor and Izakaya Hanamigawa Koen are ticked for screenshots but have no Builds folder
- [x] Game descriptions added for Acquisition Butte, Ridgeline Drive, Ohan'ali Town, Lani St. Taz and Magnolia Promenade (15 Oct). Still none (no game text): Desert Bloom Park, Campground, Glimmerbrook, the Secret/Special Lots groups
- [x] Her "My Name" now matches her Gallery titles on 11 lots (15 Oct, plan and spreadsheet): Café Llama, Foxbury Court, The Royal Crown, Von-Windenburg Castle, Parkside Playground, Stargazer, Vista Quarry Villa, Revive and Thrive, Brooks Bridge, Desert Bloom, Cookies 'n' Cream
- [ ] [Jemma] Mossy Lane's upload says Residential; re-upload as University Housing if wanted (her own Gallery)
- [ ] [Jemma] From Gallery comments (research/gallery-deep-dive.md): Strike Out! asks for a waste basket in game; someone found Newcrest Community Space's court bugged
- [x] Fixed 15 Oct: three Gallery comments showed "&lt;3" instead of "<3"

## 6b. Build notes (things to do or keep in game; collected 15 Oct)

- The Screaming Gecko (Tomarang): add a karaoke machine (now a Karaoke Bar)
- The Old Mill (Evergreen Harbor, Backroom): make its 3 daytime objects ordinary gym kit, climbing walls on top (not confirmed the wall counts); a Backroom also needs a bar, stereo, 4 barstools, sink, toilet and bin
- BridgeCreek Drive (Copperdale, Backroom): gym kit for the daytime side
- Community Markets (Sprucewood Square, 18 Celebration Way, Ro Kaya Rockside): 2 stoves, fridge, dining table with 4 chairs, podium, 3 sales tables, toilet, washbasin, bin; keep the stoves out of the rain
- The Old Clocktower (Britechester): her Building save has it as Retail; the Gallery says Nightclub
- Base Camp and The Croft Icefall (Mt. Komorebi): edit with `bb.enablefreebuild`; keep the tent, trail marker, bonfire and wood pile; saving mid-build may end the climb (research/hidden-lots-check.md)
- Omiscan Royal Baths (Selvadorada): keep the gateway to the Omiscan Gardens and the dig sites (research/hidden-lots-check.md)
- A Custom Venue needs only a sink, toilet and bin; a Beach lot needs nothing; a National Park needs a grill, outdoor bin and picnic table (game files, 15 Oct)

## 6c. From the 16 Oct overnight research (world notes; her call unless marked [Claude])

Each world now has a note: research/worlds/<world>.md (plus research/evergreen-harbor.md, tomarang.md, nordhaven.md, ondarion.md). Findings worth deciding:

- [x] [Jemma] Moonwood Mill (not owned): the placeholder rows look shifted by one. Prowler's Patch has "Moonwood Mill Library" (Library), The Grimtooth Bar & Bunker has "New Moon Cabins" (Residential), The Moonwood Mill Library has "Grimtooth Bar" (Bar). Probably meant: Prowler's Patch = New Moon Cabins; bar and library as the game ships them. Check in her spreadsheet. Fixed 16 Oct (her OK): Prowler's Patch = New Moon Cabins (Werewolves in Training), the bar and library as the game ships them; sizes were already right. Spreadsheet still to update
- [x] [Jemma] Tartosa (not owned), 16 Oct, her choice: Romeo, Juliette and Dante Monty (Royalty & Legacy's runaway couple) move from Ondarion to Rifugio dei Pirati (a cheap starter with Lover's Tree views); the homeless Sotos get Via Romanza; Celebrazioni d'Amore back to Lounge and La Coppia Serena to Wedding Venue (the game's types; the "? (Capp/Monty)" was from before Ondarion). Renaissance Road (Ondarion) is for the Sims 2 Montys, which she'll recreate (confirmed 16 Oct; their dynasty skill is Gourmet Cooking, and Antonio worked at the family restaurant). Her story: Romeo and Juliette are outcasts of the Monty and Capp dynasties who marry each other in Tartosa: Patrizio and Isabella, Mercutio, Antonio with twins Beatrice and Benedick, Bianca (note: Tybalt Capp's daughter is also a Beatrice). Villa Vigna becomes a Restaurant, the family trattoria where Hilary Laurent cooks (her parents' restaurant in the Laurents' bio) (her choice, 16 Oct). Baia dell'Amore becomes a Beach (was Wedding Venue; Tartosa's only beach lot, and one of two worlds that allow Beach); sunset weddings can still happen there, check the wedding planner offers it. Faiz Jaleel stays homeless (a townie by design who sells flowers in the square). Tartosa: done for now
- [x] [Jemma] San Sequoia: Celebration Center has two types (Wedding Venue/Cemetery); a lot takes one. The game's own Celebration Center is a Recreation Center. San Sequoia also has no café now (18 Celebration Way became the market). 16 Oct, her choice: Wedding Venue
- [x] [Jemma] Brindleton Bay: the Lynx household has no home (Catscratch Cottage is the seafood restaurant); Deadgrass Discoveries is a maritime museum in the game but a Cemetery in the plan (not built). 16 Oct, her choice: Catarina Lynx and her cats rent a unit at Tail's End Apartments, staying on the wharf ; Deadgrass Discoveries back to a Museum, the shipwreck museum by the Brindleton Light (the island already has an open-world pet cemetery)
- [x] [Jemma] Gibbi Point: no bar, lounge or nightclub now (the game's Fearful Fish Lounge is her Thrift 'n' Fish) and no holiday rental (the game's Jellyfish Jubilee rental is her restaurant). In the game, Love Highland is the Addams' home and getaway business (she moved the Addam Commune to Miner's Manse on 15 Oct). 16 Oct, her view: no bar needed (not a drinking world; the restaurant will have a bar, and there's the boba place); she likes the lots as they are. Love Highland is the Addam Commune's Getaway business; they live at Miner's Manse (her choice). Jellyfish Jubilee becomes a Bar instead of a Restaurant (a seaside pub with bar food; her choice)
- [x] [Jemma] Sulani: the Ngatas and Kahananuis aren't in the plan; their game homes are among Lani St. Taz's empty homes. 16 Oct: back in their game homes for now, marked *may change* (Ngatas at Reef Finery, Kahananuis at Journey's End)
- [ ] [Jemma] Henford: no café or tea room; 1 Cobblebottom Street is the only spare home in Finchwick (built, nobody planned). The Chopras (Lavina is the village mayor) have no home. The game sells 13 Nettle Lane as a holiday let; Henford has no holiday rental. 16 Oct: the Chopras stay homeless by design; The Bramblewood's empty lots (13 and 14 Nettle Lane, Cordelia's Secret Cottage) are kept for a fairy area once she has Enchanted by Nature. Still deciding: 1 Cobblebottom Street (her small build) as a Vacation Rental (Henford has none; no rebuild), a Café/tea room (adapt the inside of her build), a Small Business Residential (someone lives there and runs a little café, like Koffieboon; owner to think of), or stays a home
- [x] [Jemma] Glimmerbrook: only a library (the game's one community lot was the pub Elixirs and Brews, now her Glimmer & Books); no café, pub, restaurant, cemetery or vet, and no spare lot. 16 Oct, her choice: Glimmer & Books becomes a Backroom (library by day, a drink at night, like the game's Elixirs and Brews); marked not built until she adds the bar and re-uploads. Backrooms now 6
- [x] [Jemma] Mt. Komorebi: nowhere typed Bar or Lounge until Kiyomatsu Point is built (the izakaya serves drinks); no library. 16 Oct: leave both (drinks settled 15 Oct; no library needed at a ski resort)
- [x] [Jemma] Chestnut Ridge: no park lot (Duke's Hall is now Appaloosa Stables), no café, no cemetery; every lot is taken. 16 Oct, her choice: The Cozy Corner House becomes a community farm (Custom Venue: Care for Animals for the mini goats and sheep, Tend Garden, lectures; check Care for Animals covers livestock), instead of the library. Otherwise left as is (the open landscape does a park's job)
- [ ] [Jemma] Magnolia Promenade: the shopping world has one shop, Magnolia Mall (not built), typed Retail/Thrift and Boba Store; a lot takes one type (Retail only opens when she plays the owners (corrected 16 Oct: you can visit an NPC-run small business or shop as a customer, e.g. Nordhaven's Koffieboon; she has done it); a Thrift and Boba Store runs itself). For the Secret Lots regroup: the wiki disagrees on which world the hidden Get to Work lots belong to. 16 Oct, her choice: Magnolia Mall becomes a Small Business owned by a rich family (to pick)
- [x] [Jemma] San Myshuno and Newcrest: neither has a library or museum (Casbah Gallery, an Arts Center, isn't built); one restaurant for the city. 16 Oct: leave it (Willow Creek is also a suburb of San Myshuno, and it has a library and museum; Casbah Gallery stays an Arts Center)
- [x] [Jemma] Del Sol Valley: no café, library or park; the Plumbob Pictures Museum (Small Business) has no named owner. Venessa Jeong is probably the "Jeong" household at 1310 21 Chic Street (San Myshuno); not recorded. 16 Oct, confirmed: the Jeong at 1310 21 Chic Street is Venessa (she's rising, so somewhere nicer than the trailer park); noted on the lot. 16 Oct, her choices: Studio PBP stays a Lounge (Get Famous lounges have special features); the Plumbob Pictures Museum gets a café ("Drink Coffee" as one of its activities). Owner still unnamed; library and park left (too few lots)
- [x] [Jemma] Oasis Springs: no café; Johnny Zest isn't in the plan; the "Roomies" renting Inner Circle (Del Sol Valley) may be the game's Oasis Springs Roomies. 16 Oct, her choice: Johnny Zest rents a unit at Upland Trailer Park (Del Sol Valley), chasing fame; his game home Slipshod Mesquite is her De Costadas. Also: the game's Oasis Springs Roomies lived at Cacti Casa (now her Palm Springs Public Pool); the Del Sol 'Roomies' at Inner Circle are them (confirmed 16 Oct)
- [x] [Jemma] Willow Creek: the plan spells "Villareel"; the game's family is Villareal. The wiki places Magnolia Promenade beside downtown Willow Creek (its bowling alley, cinema and Paddy's Place are close nights out). Corrected to Villareal (16 Oct, her OK)
- [x] [Jemma] Selvadorada: her Belomisia Field Station upload describes a stay with dorms, but only Vacation Rentals can be booked; as a Custom Venue it can be visited, not stayed at (check in game). 16 Oct: fine as a Custom Venue; Adventure Awaits Getaways let Sims stay there (she confirmed it works)
- [x] [Jemma] Ravenwood: in the game The Final Draught's upstairs hosts wakes; check funerals still work now it's planned as a Restaurant. For Specter Row: the On Hallowed Grounds lot trait might keep a rental spooky (unchecked). 16 Oct: checked, funerals can't be held on a Restaurant (they can on Bar, Café, Cemetery, Lounge, Nightclub, Park, Museum, Wedding Venue, homes and more); The Final Draught back to a Bar, as the game ships it (her choice). Specter Row carries on under §8 (Haunted House Residential)
- [x] [Jemma] Britechester: no restaurant; the only lots that could change without moving anyone are the three empty University Housing lots (Drake Hall, Tidal Tower, Mossy Lane). 16 Oct, her view: Britechester is done
- [ ] [Jemma] Copperdale: who are the Donovans at Hillside Haven ("move!")? Totter Park was the game's only park (now the Prices' home), so LaSuli Point (by the Pier fairground) is the only way to a park or a cemetery. 16 Oct: not an EA household in any Sims 4 world; probably her own Sims (left as is; she may check)
- [x] [Jemma] Windenburg: no cemetery and no park lot (Hare Square became student halls); the Ancient Ruins, The Bluffs and Chalet Gardens do some of a park's job. 16 Oct: left as is
- [x] [Jemma] Granite Falls: the game allows no homes there (only rentals and venues); Granite Falls Forest (National Park) still unbuilt (16 Oct: just a note, nothing to decide)
- [Claude] Saves vs plan noticed in passing (for when she's in game, not fixes): her Building save has Anchorpoint Works as a Vacation Rental and The Old Clocktower as Retail


## 7. Parked until she asks

- [ ] Phone layout: Stats lot names pushed off-screen by the World/Neighbourhood columns
- [ ] Phone layout: lot pages show the same photo twice before the facts

## 8. Ideas from the research (suggestions only; tick to do; most site ideas are from research/site-ideas-from-other-trackers.md)

[Claude] Reminder: rerun `tools/research/gallery_deep_dive.py` around mid-November, once there's a month of Sunday refreshes; growth couldn't be judged on 14 Oct (research/gallery-deep-dive.md)

Not carried over until the 15 Oct audit (her call):
- [ ] [Jemma] Lot pages: highlight a comment when it says the build fits the world (research/gallery-deep-dive.md, the third of its three site ideas; the other two are done)
- [ ] [Jemma] Evergreen Harbor's development state (Undeveloped / Modernised) on its neighbourhood cards; would have to be read from her game (site-ideas Data 5; only the eco footprint part was done)
- [ ] [Jemma] From the other trackers' tables (site-ideas §1): a "Sims updated" tick apart from "Sims made"; "last played" per household; single Sims by life stage (for matchmaking); story text per lot; "EA original vs mine" for households; a count of empty lots and some trivia in world headers. Most need Sims data (see the household Sims question below)

Newer lot types and where they could go (research/lot-types-reference.md):
- [ ] [Jemma] Backrooms (library/museum/gym by day, nightclub 9pm–6am; allowed in every world; by day it brings readers, art lovers or gym-goers for whichever of bookcases, art and gym equipment are on the lot, mixed if mixed; needs 3 of them in any combination, plus bar, stereo, 4 barstools, sink, toilet, bin). 15 Oct: Movers & Shakers (Willow Creek), StrangerVille Information Center and BridgeCreek Drive (Copperdale; the Price family moved to Totter Park, which is now Residential instead of a cemetery) tagged as Backrooms, not built. Other idea: Finchwick Village Hall. Keep them fairly rare (16 Oct: range raised to 5–8, "where it makes sense" rather than one per world); not Ravenwood (openly creepy already, nothing to hide). 15 Oct later: Movers & Shakers became a Recreation Center instead; The Old Mill (Evergreen Harbor) became one. Backrooms now 4: StrangerVille Information Center, BridgeCreek Drive, The Old Mill, Hardcover
- [ ] [Jemma] Another day: The Old Clocktower and/or Foxbury Court (Britechester nightclubs) as Backrooms? Study space (library) or gallery by day, club by night. Their student shops would become decoration (a Backroom's day side is library, museum or gym). Both would make 6 Backrooms, 2 in one world; Claude suggested just The Old Clocktower
- [x] Community Market: a standalone market at Key Point (beach market), or a lot in Henford or Chestnut Ridge (allowed in every world; 15 Oct: Key Point still deciding) Settled 15–16 Oct: markets went to Sprucewood Square, 18 Celebration Way, Ro Kaya Rockside, Calle del Ensueño and Fern & Frond; Key Point stays minimal
- [x] Custom Venue: Key Point as a watersports or beach camp Not taken (16 Oct: custom venues fine; Key Point stays minimal)
- [ ] [Jemma] Haunted House Residential: Specter Row unsure, a rental or a haunted house (a lot can't be both); typed "Residential Rental/Haunted House Residential" until she decides (16 Oct: still undecided; the options are a rental with the On Hallowed Ground or Haunted lot trait, which the game allows on any lot type, checked, or a full Haunted House). Brooks Bridge Borough is one since 14 Oct; Old Ravenwood Estate since 15 Oct (her choice: the game's description has flickering lights and inexplicable happenings); Ophelia Villa (the Goths, Willow Creek) since 15 Oct (her choice); The Cozy Casket House (Ravenwood, empty; the game says Catie Casket's ghost haunted it) since 15 Oct, for now (her choice). Haunted houses now 4
- Keep in mind for empty lots: Cemetery, Playground, Recreation Center, Karaoke Bar, Onsen, Pool, Spa, Arts Center, Beach. Newer lot traits: Clandestine, Regal Residence, Fairy Passage, On Hallowed Grounds

Site ideas, quick wins (no input needed):
- [x] Packs needed per world (13 Oct: a "Packs used" block on each world page; removed 14 Oct, her choice: lot pages still show each build's packs)
- [ ] (15 Oct: not now) One-word world status on home tiles: Not started / Started / Almost / Complete (she agrees the cut-offs)
- [x] "Shared on the Gallery: <month year>" from the date hidden in 169 upload ids (13 Oct: "Shared" on each lot's Gallery card, e.g. Jan 2017; 124 of the 168 lots with uploads. Ids from 2023 on are random, so newer uploads show no date)
- [x] "Data as of" footer line: spreadsheet date, last Gallery refresh, game patch (13 Oct: home page footer shows the build date and the Gallery check date)
- [x] Game version added to the home footer (13 Oct), read from the installed game at each build
- [x] Site-wide search (lots, households, Gallery titles, in-game names) (13 Oct: box at the top of the sidebar; also finds Sims, neighbourhoods and worlds)
- [x] Jump links at the top of long world pages, one per neighbourhood (already there: each world's header lists its neighbourhoods as links, and world pages now show neighbourhood cards rather than one long list)

- [ ] [Jemma] Look over the 13 Oct additions and change any wording or placement: "Shared" on Gallery cards, the footer dates (home), the search box (sidebar)

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
- [ ] Beds by age group / capacity for homes and rental units (e.g. "3 beds: 1 double, 2 single; fits 4"), to see where a family fits (research/rentals-and-apartments.md)
- [ ] Lot value as a Stats column (it's already on each lot's Gallery card)
- [ ] Original vs new lot size for lots she resized ("40×30, was 30×20"). Note (15 Oct audit): probably nothing to show yet: her plan sizes match her uploads (research/data-check-up.md) and the game's own sizes (research/plan-vs-game.md, apart from two plan typos since fixed)
- [ ] Filters on world and Stats pages: pack, lot type, lot trait (now that traits are in), built/shared, empty/occupied
- [x] "New since you looked" markers (15 Oct): a "New" pill on lot cards and a note on the lot page when a build has new favourites or comments, or is a new upload, since its page was last opened in this browser
- [ ] Timeline of builds by the month they were shared, on the home page (13 Oct: no preference yet)
- [x] Newest Gallery comments on the Stats page (15 Oct)
- [x] "Most loved" next to "Most downloaded" on Stats; "Base game" marker on lot cards and lot pages (15 Oct)
- [x] World extras beyond festivals: weather line and the game's three highlights on each world page (14 Oct)
- [x] [Claude] A checklist for adding a new world or pack (16 Oct: HANDOVER.md §7)
- [x] Spreadsheet columns (15 Oct, her OK): Lot Traits, Lot Challenges, Bedrooms, Bathrooms (J–M) on every world sheet, and "Eco footprint starts …" beside each neighbourhood that has one; backup kept as `World Plans (fixed) - backup 15 Oct.xlsx`. Filled from the app; the import still reads only columns A–I, so edits in J–M don't come back yet
- [x] **Chosen 13 Oct:** Lot traits per lot. Done for 159 of the 168 shared lots, read from her "Building #2" save (lot pages show "Lot traits" and "Lot challenges"; names are the game's own)
- [x] 9 shared lots had a different name in the save: settled 13 Oct (shell builds keep their challenge names in the game; The Old Salt House's traits come from the older "Building" save)
- [x] Anchorpoint Works keeps its name on the site (15 Oct, her choice; "On Point" in her game)
- [x] Bedlington Barn: shared 14 Oct, upload linked. (Desert Bloom Park has no lot traits set in the game)
- [ ] [Jemma] Household basics, relationships and family tree need Sims, which aren't to come from the Building saves: which save (if any) should they come from, or will you give them?
- [x] **Chosen 13 Oct:** Neighbourhood eco footprint and festivals/events: on the neighbourhood cards (first three) and pages (all), 14 Oct
- [ ] [Jemma] Look over the 14 Oct world extras (research/world-extras.md): the weather lines are made from the game's forecasts by simple rules (e.g. "Often cloudy, snowy winters"), so reword any; some Sulani, Ravenwood and Nordhaven event names had no on-screen name in the game and were made from its settings (Beach Bonfire, Funeral BBQ, Hobby meetups…); highlight texts are the game's own (US spelling)

Things to avoid (from the research): tracking every Sim in detail, values that change every session, EA pack logos as icons, anything AI-generated, percentages outside Stats.
