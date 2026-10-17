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
- [x] App icon settled 16 Oct: a plumbob outline (redrawn from the Sims Wiki's description: a hexagonal bipyramid, equal halves, front side twice the width of the side ones. Thinner lines; she's happy with it), yellow on a brighter purple, each size drawn separately so it stays sharp (16 Oct, her idea; the house looked near black and blurry). (Stats page "On the Gallery" at the bottom: kept as it is, 16 Oct)
- [ ] [Jemma] Taskbar icon looks blurry (16 Oct). Every size is now drawn properly (shortcut .ico and the page), so it is probably Chrome: its plain app windows give Windows only a small icon. Next time she restarts anyway, check if it is still blurry; if so, the fix is making the app a proper installed Chrome app (the shortcut would also start a tiny local web server on her PC). Her call
- [ ] [Jemma] Bubble World (82 favourites / 647 downloads) sits on The Old Salt House lot; left unlinked for now (13 Oct: "leave it for now"), until the bonus builds are decided (§5)
- [x] part1/2/3.zip (already unpacked) moved to the Recycle Bin, her OK (16 Oct)

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

- [x] Rental layout picked (16 Oct): **4**, the front photo with a circle per unit, “Residential Rental · N units” badge, and under the card each household with a house icon and its unit (landlord marked), then “N let, N free” (the landlord’s own unit isn’t counted as let). Lot pages have a units table. Only the landlord is marked, “(landlord)”, on the card list, the circles and the table; tenants aren’t marked. Apartment buildings are one card with their front photo and a circle per apartment (an inside shot until there are outside screenshots). The other trial layouts and the switch are gone.
- [x] Household names on cards open the household (houses, rentals, apartments); apartment buildings show the same household list as rentals, with each flat’s number, and the card itself doesn’t open (her choice): the circles and household names do (16 Oct)
- [x] Not-owned worlds: opened as plan pages for her review on 16 Oct, closed again (greyed, not clickable) once she’d finished, same day
- [x] Rental unit names and each unit’s own lot traits now come from her newest Building save (`tools/lot_traits.py`, shared rentals only; the Gallery has neither). The shared rentals’ units are all just numbered in game (1, 2, 3…); the ones she named (3A/3B Cobblebottom Street, 11A–C Sungai Point, 08/09 Taka Soi 15) are on unshared lots, read anyway as her exception (16 Oct)
- [x] World banners settled 16 Oct (she’s happy, “as good as possible”): each world has its own height on its map (`heroY` in its data file, 0 top to 100 bottom; first guesses 16 Oct, e.g. StrangerVille, Nordhaven, San Myshuno 10–12 to keep their tops, Chestnut Ridge and Ondarion 68, then halved back to 52 at her request; StrangerVille 24, halved back; San Myshuno 28; Mt. Komorebi 41, lower to show its lots; Nordhaven 32, her choice of lots over mountains; Mt. Komorebi settled; Ravenwood 28, her request. Tried nudging seven others to stop their tops clipping; she found them worse (more lost at the bottom for little gained at the top), so they went back; San Sequoia 47 after all, so Hopewell Hills isn't cut off). Name any that still look off
- [ ] [Jemma] Neighbourhood page banners now zoom to the neighbourhood’s part of the world map (16 Oct, her idea; maps re-extracted at full size so it stays sharp). Some may look worse than the whole map: name any to put back (17 Oct review in §6d)
- [x] Rio Verde with six households: she looked with the “Pretend Rio Verde is full” tick box; box removed (16 Oct)
- [ ] [Jemma] Photo tabs per unit (layout 4): for every rental once it has screenshots of each unit (16 Oct, her view; Rio Verde is the only one so far)
- [ ] [Jemma] Decide each rental's households unit by unit, and landlords for the 17 rentals without one
- [ ] [Jemma] A "Rental units" tab in World Plans (World · Rental · Unit · Beds · Baths · Household · Landlord)? She was "not sure yet, discuss more"
- [x] Unit counts show as "Residential Rental · 4 units" on cards and lot pages (her choice, 16 Oct; the Stats sheet keeps her "(4)")
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
- [ ] [Jemma] Bailey-Moon Manor and Izakaya Hanamigawa Koen are ticked for screenshots but have no Builds folder (16 Oct: the ticks may be wrong; she’ll check later. 17 Oct: the ticks look right, her Screenshots folder has sets for both, see §6d)
- [x] Game descriptions added for Acquisition Butte, Ridgeline Drive, Ohan'ali Town, Lani St. Taz and Magnolia Promenade (15 Oct). Still none (no game text): Desert Bloom Park, Campground, Glimmerbrook, the Secret/Special Lots groups
- [x] Her "My Name" now matches her Gallery titles on 11 lots (15 Oct, plan and spreadsheet): Café Llama, Foxbury Court, The Royal Crown, Von-Windenburg Castle, Parkside Playground, Stargazer, Vista Quarry Villa, Revive and Thrive, Brooks Bridge, Desert Bloom, Cookies 'n' Cream
- [ ] [Jemma] Re-upload Mossy Lane to the Gallery as University Housing (its only upload says Residential; Spring Steppes is the one with both a University Housing and a rental upload). 16 Oct: she'll do it later
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


## 6d. From the 16–17 Oct overnight research (her call unless marked [Claude])

**Start here:** for-jemma/overnight-17-oct.md (what to look at first, the biggest decisions, every note)

### Showing Sims (research/sims-display.md)
- [ ] [Jemma] **In the app now (17 Oct), to try:** Sim pages, the new household page, and dynasty pages, ported from the prototype as it is (17 Oct, after a first simpler version missed things): household picture top left (placeholder until she adds a screenshot) with the facts beside it (incl. Origin, Played, Neighbourhood Stories, Dynasty), the prototype’s Sims table, its drawn family tree, for four households: the Goths (Willow Creek; tree with Cornelia’s Crumplebottom side), the Landgraabs (Oasis Springs) and Johnny Zest (Del Sol Valley, renting at Upland Trailer Park; each shows on the other’s tree), and the Roomies (Del Sol Valley; no family anywhere, so no tree). Every other household keeps the old page until she’s happy
- [x] Decided 17 Oct: family trees are built from family links (parents, partners), never from who lives together (no extra line for housemates; see the household-tree decision below for when a tree shows)
- [x] Decided 17 Oct: each Sim gets its own page (in the end every Sim; trying it out on the Goths first in the prototype). The household page keeps the family overview (roster linking to each Sim, mini tree, connected households, story)
- [ ] [Jemma] **Look at the prototype first:** for-jemma/prototypes/sims/index.html (opens from the folder): a Goth household page, a drawn family tree next to a generations list, links between households (lists, a small web, lines on the map), and the relationship tags, with switches for each choice below
- [ ] [Jemma] How much to track: three levels (basics for every household, profiles for played ones, extras for favourites)?
- [x] Decided 17 Oct: household page starts with a family portrait (her screenshot), the roster underneath; the roster leads when there’s no portrait yet. No picture of the house on the household page, just a link to their home (and other lots)
- [ ] [Jemma] Relationship tags: six groups (Family, Romance, Friends, Conflict, Work & school, Dynasty) plus an optional free label? Add or drop any?
- [x] Decided 17 Oct: use the game’s own words, “Spouse / Partner / Engaged” (since patch 162), not “Husband / Wife”
- [x] Decided 17 Oct: family trees are drawn top-down trees (not a generations list); married-in Sims get a chip that opens their own family’s tree
- [x] Decided 17 Oct: a family tree on each household page, centred on the Sims who live there and showing their relatives wherever they live (Capps: all Capps + Juliette, Romeo, Dante; Montys: all Montys + R&J; R&J’s household: both families). Worlds don’t matter: anyone outside the household is a lighter box with a world chip, linking to their household. How far: all blood relatives of the household’s Sims, plus their partners (“plus ones”); revisit only if a tree gets too big. Housemates get a tree if they have family anywhere in the game; no tree only for a household where nobody has any family at all (this replaces the earlier “no tree for unrelated housemates”)
- [x] Decided 17 Oct: group pages for dynasties, clubs (Get Together) and university organisations (Discover University): one page per group listing its members across households and worlds, with the group’s own details (dynasty: prestige, ideals, heirloom, alliances/rivalries; club: meeting place, activities, rules; organisation: university, events). Sim pages list each Sim’s memberships and role (each Sim is in at most one dynasty). Households keep their homes/businesses and landlord/tenant links. The household page shows only a dynasty line (dynasties usually cover a whole household); clubs and university organisations show only on Sim pages
- [x] Decided 17 Oct: relationships are between Sims, so they go on Sim pages (grouped by type, each linking to the other Sim). The household page shows nothing about links (family is covered by its tree). Still open: a small relationship web on Sim pages, and lines on the world map?
- [x] Decided 17 Oct: no comparison with EA’s version anywhere (“I don’t care about EA’s version”): no “In the game / In my save” lines or tables, no EA bios side by side. The site shows her save only. Origin tag, kept for now: “Premade” (EA’s Sims and households, even when she has changed them) or “Mine” (Sims she made, and children born in her game)
- [ ] [Jemma] Story questions: how is Romeo related to the recreated Sims 2 Montys, and who heads each dynasty in her save?

### EA’s family lore (research/ea-family-lore.md: every premade household per world, and the links between them)
- [ ] [Jemma] Romeo has no relatives in the Sims 4. Should her recreated Montys follow the Sims 2 tree (Patrizio and Isabella as grandparents, Mercutio his brother, Antonio and Bianca uncle and aunt, Beatrice and Benedick cousins)?
- [ ] [Jemma] Dynasties: keep the game’s heads (Juliette heads the Montys in the game), or do the Renaissance Road Montys hold the Monty dynasty, with Romeo and Juliette outcasts of both? Was her save started after Royalty & Legacy (the Goth and Landgraab dynasties need a newer save)?
- [ ] [Jemma] Who’s who in her plan: are the Specters (Havisham House), Curious (Granada Place) and Smiths (Sultry Springside) Maxis’s Sims 2 families from the Gallery (then she has two Olive Specters)? What does “*WithUpdates*” mean? The Broke household at Crick Cabana: hers, or Dustin Broke? Is Santiago Ojo related to Miko Ojo? Who is the Kennedy in “Bro & Kennedy”? Does “My Celebs” include any of the game’s celebrities? Is BFF the Willow Creek trio? Is “Rochana/Caberry” meant to be Cadberry?
- [ ] [Jemma] Relatives that only exist on the Gallery (Iggy Pancakes, Daniel and Mary-Sue Pleasant and others): show them on family trees?
- Cross-world links worth showing (from the game): Agnes Crumplebottom is Mortimer Goth’s aunt; Lily Zhu is the Vatores’ cousin; Skip Broke is Dustin Broke’s father; Enzo Alto is Holly Alto’s cousin; Arnessa Thebe is Consort Capp’s cousin; the Gomes family shares an ancestor with the Goths. Her moves add more (Juliette Monty, now in Tartosa, is Tybalt Capp’s sister)

### Pets and horses (research/pets-and-horses.md)
- [ ] [Jemma] On household pages: pets in the same roster as the Sims (suggested), a one-line strip, or full cards plus a Horses page? An Animals tab on family trees where there are young ones? Small animals (goats, hens, llamas…) as a counts line, or left off?
- [ ] [Jemma] Vets: one for the city area or the desert worlds, or is a trip to Brindleton Bay fine? 3 vets have no owner: should the Delgatos own Brindleton Pawspital (Supriya dreams of being a vet)?
- [ ] [Jemma] New Appaloosa has no public horse stop now Duke’s Hall is Appaloosa Stables (which is full: 2 Sims and 6 horses, so no foals): give The Cozy Corner House hay feeders and troughs, or let the Stables be the stop?
- [ ] [Jemma] Use For Rent’s pet households (Kitty Lu and her cats, Dara Kham and her dog) for empty rental units? In game: turn off “Adopt Cats & Dogs” and “Rescue Horses” in Neighbourhood Stories?
- Lore find: Roberto Crinkletop (Chestnut Ridge’s hidden “Mysterious Rancher”) is Agnes Crumplebottom’s ex-husband

### Household stories (research/household-stories.md; prototype: for-jemma/prototypes/stories/index.html, the Montys and the Goths)
- [ ] [Jemma] Bio: hers first with EA’s underneath (suggested), or EA’s until she writes her own? EA’s as our summary with a link, or EA’s exact text read from her game?
- [ ] [Jemma] A dated timeline per household? By the month she played it, by story time (“Year 1, Spring”), or both? A whole-save timeline too (10 “moved world” events already follow from her plan)?
- [x] (Settled 17 Oct: no EA comparison at all, see Showing Sims) Chapters for any household? Empty parts hidden, or one quiet “Yours to write” line? Writing in chat (as now), or a text file per household?
- [ ] [Jemma] Questions: are the Cadberrys a Not So Berry legacy (her “Spectra” Gallery household is tagged #notsoberry #mint #founder)? In the game Romeo and Juliette are already married with a teenage son: is the Tartosa wedding their first?

### Occults (research/occults.md)
- [ ] [Jemma] Nothing in her plan breaks the game. Care points: Specter Row can’t be both a rental and a Haunted House (already open above); Henford’s fairy area probably needs “Limit Fairies to Innisgreen” off, and Cordelia’s Secret Cottage has no free trait slot for Fairy Passage; the Ravenwood Wedding Hall may still have the old manor’s On Hallowed Grounds (keep or remove?)
- [ ] [Jemma] Her hints, to confirm: are the Tiquelles spellcasters, with Mid-NoWhere as their portal to the Magic Realm? Hallow Slough a Haunted House, or On Hallowed Grounds? 18 Culpepper House Spooky? If the Sultry Springside Smiths are Maxis’s Gallery family, Pollination Tech 9 is her save’s only alien
- [ ] [Jemma] Heart Consort Capp and the four Sulani mermaids so the game never deletes them? Later, if she buys Vampires or Werewolves: keep the Grimtooth bunker, leave the garlic out of Garliclauter, keep Widowshild a home
- [ ] [Jemma] Showing occults: a life-state pill plus a born or turned line, ghosts shown in their household and generation, faded for late Sims (suggested); or a pill only; or a save-wide Occults page later? Trailer lore (Vlad turned Lilith…) shown with an “In the game: not linked” note, or only what her save says? Icons OK (droplet for vampires, moon, wand, sparkles, shell, orbit, ghost)?

### Festivals and events (research/festivals-calendar.md; prototype: for-jemma/prototypes/calendar/index.html)
- [ ] [Jemma] A “What’s on” page? A week calendar for the whole save (A), a list by world (B), a small box on each world page (C), or none? Festivals and holidays only, or lot nights and uni/school events too? Week starting Monday or Sunday (the game’s)?
- [ ] [Jemma] Found: no festival needs a lot (all are on open streets), so nothing broke. But the Starlight Accolades only go to a lounge with Hottest Spot in Town (only Calico has it, in Brindleton Bay), and Gibbi Point and Tomarang lost their lounge nights (Fearful Fish Lounge and The Screaming Gecko were re-typed). Ondarion has no scheduled festivals
- [ ] [Jemma] Small ones: Sulani’s unnamed events shown with made-up names (as now) or left out? Nordhaven: one “Hobby meetups” line, or the game’s seven names?

### Story ideas (research/story-ideas.md: ideas only, for her to pick from)
- [ ] [Jemma] Browse when in the mood: 76 lore-friendly hooks across her 25 worlds (most change nothing the game ships) and 15 loose ends EA never finished (e.g. Roberto Crinkletop and Agnes; Princess Cordelia tying Henford, Tartosa and Ondarion together, which suits the Montys’ move). Some would also settle open items: the Kunals for Paradise Stables, Moody & McMillan running the 1 Cobblebottom Street tea room from next door, Supriya buying the Pawspital, the Koopmans’ daughter for Canalside Daycare, one of Fia’s outlaws as Aloisio’s tenant

### Where Sims could come from (research/sims-sources.md)
- [ ] [Jemma] Which save is the Sims source: an exception to the Building rule for households in “Building #2” (like the rental-units one), or a separate save kept for Sims (what would it be called)? Her other 30 saves hold everything but are old (newest “Season Events”, 15 Mar 2026) and don’t have her rebuilt lots
- [ ] [Jemma] EA’s families: fill them in automatically from the game’s own files (197 premade households, their family links, and 348 starting friendships between households), or only the ones she has played?
- [ ] [Jemma] Show EA’s starting friendships, or only relationships from her own save?
- [ ] [Jemma] Her Library (122 households, 56 her own uploads): use it as a top-up (only her own, or Maxis and others too), or not at all?
- [ ] [Jemma] Typing Sims in: chat only, or a Sims tab in World Plans? **Prototype to try:** for-jemma/prototypes/world-plans-sims-tab.xlsx (a copy of her workbook with a Sims tab and a Relationships tab, drop-downs, mistake highlighting and 24 example premade Sims; her own file untouched), explained in world-plans-sims-tab.md with 10 choices. If used, the importer needs a one-line change so it doesn’t treat the new tabs as worlds
- [ ] [Jemma] Sim pictures: decode the Library portraits for Sim cards, or stick to her screenshots and monograms?
- [ ] [Claude] When Sims go in: key each Sim by the game’s sim id, not its name (two Sims can share a name)

### Empty homes page and filters (prototypes: for-jemma/prototypes/lots/index.html, opens from the folder)
- [ ] [Jemma] Empty homes page (27 empty homes, 14 empty apartments, 41 free rental units, 7 University Housing lots): compact table (A) or cards (B)? Its own page in the sidebar or a part of Stats? Count University Housing and lots not built yet?
- [ ] [Jemma] Filters (pack, lot type, lot trait, built/shared, empty/lived in): every group always showing (A) or one bar that opens (B)? Above the neighbourhood cards or on an “All lots” page per world? Chips on Stats instead of, or as well as, the “Show” dropdown?
- [ ] [Claude] Bugs it found: Sequoia Cottage’s card puts the Lovejoys in unit 1 as landlord although they live at 23 Eucalyptus Lane (so 1 free, should be 2); Upland Trailer Park shows Johnny Zest in unit 2 but the plan has him in the 4th trailer

### Townies and NPC roles (research/townies-and-roles.md)
- [ ] [Jemma] Moonwood Mill Library: settle it as a Library, not a Backroom? As a Backroom it would get no librarian by day and no bartender by night (the game has no Moonwood version of either), and Wolfgang Wilder loses his job
- [ ] [Jemma] 1 Cobblebottom Street tea room: the Crumplebottoms can’t run it cleanly (their household is hidden, and Agnes loses her village role once in a household). Her own Sim or a Henford household with no village job instead?
- [ ] [Jemma] In-game settings: Neighbourhood Stories off, or on with “Move In” and “Move Out” unticked for Other Households (so the game doesn’t fill her empty homes)? Raise Maximum Sim Count and heart her planned households (homeless premades are culled first)? Turn off ageing for unplayed Sims (so young role Sims like Eloise Hiddlestix don’t age out)?
- [ ] [Jemma] Owners who live away from their rental (the Robles at Manzanita Terrace, the Lovejoys at Sequoia Cottage, Rochana/Caberry at Isda Riverfront) lose it if merged into another household elsewhere: merge the other household into theirs instead
- [x] Corrected research/worlds/gibbi-point.md: Laxmi and Raheel Kunal are homeless premade townies (17 Oct)

### Eco Lifestyle and community spaces (research/eco-and-community-spaces.md)
- [ ] [Jemma] In her play save: turn off “Enable NPC Voting”? With it on, neighbours vote by themselves each week and random action plans pass (e.g. fines for using too much power)
- [ ] [Jemma] In game: Admiral’s Wreckage was Residential in her save on 14 Oct; set it back to Community Space. Which version should each Community Space be (it only changes when a resident of that neighbourhood votes)? Admiral’s Wreckage and The Old Dockyard each have just one household that can vote
- [ ] [Jemma] Port Promise starts fully industrial (the game’s clean-up story) but neither Knox nor the Greenburgs live there to vote for it: another reason to give Mary and Blossom The Portsmouth Promenade as a home (open above)? Which Evergreen Harbor development plans in each neighbourhood? The Old Dockyard: Eco Lot in place of Off-the-Grid? Bess Sterling keeps her Civil Designer job alongside the business? (Its tasks need a Community Space: only The Old Dockyard is left in Evergreen Harbor)

### Fame and clubs (research/fame-and-clubs-check.md)
- [ ] [Jemma] Nothing in her plan breaks fame. Starlight Accolades: if EA’s Studio PBP still stands in her save it probably has Hottest Spot in Town (check in game); otherwise only Calico has it. Judith Ward for the Plumbob Pictures Museum (Acting 7, Business Savvy)?
- [ ] [Jemma] 7 game celebrities are homeless (Holly Alto, Dustin Broke, Dirk Dreamer, Baby Ariel, Brytani Cho, Izzy Fabulous, Kayla Flemming) and would be deleted first if the town fills: heart them, or put some in “My Celebs” at Chateau Peak?
- [ ] [Jemma] 5 of Windenburg’s 11 premade clubs now meet somewhere that no longer fits (Garden Gnomes and League of Adventurers at an empty student hall, Powerhouse at the Students Union, Spin Masters at the Sports Center, Upper Crusts at The Lighthouse, now the Tiquelles’ home). Move them (suggested: Powerhouse to UoW Sports Center, Spin Masters to La Discotheque, League of Adventurers to Courtyard Lane Playground, Garden Gnomes to Coorinberg Cottage, Upper Crusts to Brook Bungalow), or leave them as story?
- [ ] [Jemma] Clubs on the Sims pages: a “Clubs” block on household pages and one hub per club in the relationship web (a 7th tag group)? Fame stars and quirks on Sim cards?

### Getaways (research/getaways-check.md)
- [ ] [Jemma] Love Highland: as a Custom Venue it can’t be the Addams’ business in the game (a Custom Venue can’t be owned, and only a played household earns, at its own home). Keep it a Custom Venue run by them as story only, or make it their home again (as in the game, 8 beds)?
- [ ] [Jemma] Revive and Thrive has no beds (per the Gallery), so only day Getaways work there: add beds for overnight stays?
- Also found: her 14 Vacation Rentals can’t host Getaways (fine as holiday lets); Key Point as Generic could host one, as a Vacation Rental it couldn’t; Excavate, massages and hiking can’t go on a Custom Venue’s schedule (Belomisia Field Station, Revive and Thrive, The Watering Hole, Kiyomatsu Point); Care for Animals covers the mini goats and sheep (answers the Cozy Corner House check)

### Royalty & Legacy (research/royalty-and-legacy-check.md)
- [ ] [Jemma] Ophelia Villa as a Haunted House means the Goths can’t host a Grand Ball or hold court there (both need a plain Residential home; worth one test in game). Keep it haunted (balls elsewhere), or make it Residential?
- [ ] [Jemma] The Monty story: the Capp side (Romeo and Juliette cast out) is already true in the game; the Monty side needs steps in game, as Juliette heads the Monty dynasty (link the Sims 2 Montys to Romeo in Create a Sim, Juliette steps down to Romeo, he brings in Patrizio and steps down, Patrizio casts them out). Patrizio’s family take over the game’s Monty dynasty, or start a new one? Dante: heir, plain member, or cast out with his parents?
- [ ] [Jemma] Tartosa isn’t owned yet: wait before making the Sims 2 Montys, or house Romeo’s family at 13 Lakeview or 17 Bright Cliff for now? Which save holds the dynasties (Building #2 predates the pack, so no Goth or Landgraab dynasties)?
- [ ] [Jemma] Add a Waltzing Dance Floor when rebuilding La Vivace, the palaces and Giardino (balls can’t be held at Sankofa, Fisherman’s Hut, Ye Olde Voyager, Hardcover, Zanbira or Casa Do Corsário)? Did she unlock Regal Residence in the Feb–Mar event?

### Universities and high school (research/students-and-schools.md)
- [ ] [Jemma] The Copperdale boarding houses won’t work as University Housing: only enrolled uni students can live there, so high-school teens would be moved out. Make them Residential (a teens-only household is allowed), or a rental with a unit per team?
- [ ] [Jemma] Mossy Lane: a UoB or a Foxbury hall, with a gender or organisation limit? (It needs a university picked; a stove or grill blocks it.) And which university does each Windenburg and StrangerVille hall belong to?
- [ ] [Jemma] Is Robert Piggott School (64×64, saved as Generic, which is how a high school saves to the Gallery) the build for Copperdale High, or still a bonus build? When Rohan Elderberry enrols, does he stay at Spring Steppes or move into a hall?
- [ ] [Jemma] In game: Laurel Library was Generic in her Building save on 14 Oct; it must be a Library for the study sessions. The prom after-party is on Plumbite Cove’s street, which makes LaSuli Point as a Park more useful
- Fine as it is: every other lot the game needs is there and typed right; 9 halls hold up to 90 students (only 3 premade students live in them); The Royal Crown must stay a Bar for the student organisations

### Her World Plans spreadsheet (research/world-plans-review.md; read from a copy, her file untouched)
- [ ] [Jemma] Two Overview bugs from when the Innisgreen row was added on 15 Oct (ours): Nordhaven’s Overall shows 10% instead of 20% (its formula takes in Innisgreen’s row), and the table stops before Ondarion. Fix them, with a backup first? Also: Spring Steppes says 9 bedrooms in the sheet and 8 in the app (two Gallery versions); count ranges on world tabs stop at the last lot row (a new lot at the bottom would be missed)
- [ ] [Jemma] What should “Overall” mean? Now it’s a plain average of Built, Shared, Screenshots and Sims Made, so even Britechester (all built and shared) shows 50%; worlds with no homes average three columns; Shared is out of all lots, not built lots
- [ ] [Jemma] Four notes of hers beside the Statistics blocks: Willow Creek “Ella-Mint Cadberry”, Chestnut Ridge “One of Duo’s Parents”, and “Lynx” on Tomarang and Ciudad Enamorada. What do they mean? (The app doesn’t show them)
- [ ] [Claude] The import doesn’t read the Overview’s Owned column, so marking a world owned there won’t reach the app; keep Owned in one place

### Rentals unit by unit (research/rental-units.md)
- [ ] [Jemma] Suggested fits: Upland units 1–3 the Eclectic Arts, 4 Johnny Zest; Tail’s End 3 (Cat Hangout) Catarina Lynx; Spring Steppes 1 Elderberry, 2 the Pleasant twins; 3 Cobblebottom 3A Cecilia Kang (Cat Hangout), 3B Moody & McMillan (Chef’s Kitchen). OK?
- [ ] [Jemma] BFF, the Roomies and the Eclectic Arts don’t fit one flat each (the flats are one-bed): split them into separate households, or keep each together?
- [ ] [Jemma] Empty units at Rockridge Springs, Old Torget House, Manzanita Terrace and Slip 42: fill or leave?
- [ ] [Jemma] In game (optional): most rentals keep traits, and bedroom/bathroom counts, only on unit 1; give units 2+ their own. Rippling Flats, Specter Row and Casa do Corsário are still one home in the save

### Undecided lots (research/undecided-lots.md; options and pros/cons for each)
- [ ] [Jemma] Key Point: a castaway hut as a Vacation Rental (suggested), or Generic? (Residential Rental isn’t allowed there)
- [ ] [Jemma] LaSuli Point: Park (suggested; needs one piece of playground kit), or Cemetery?
- [ ] [Jemma] Specter Row: a 2-unit Residential Rental with On Hallowed Ground on both (suggested), or a Haunted House?
- [ ] [Jemma] 1 Cobblebottom Street: a Small Business Residential tea room (owner idea: the Crumplebottom cousins, to check in game), or a Vacation Rental?
- [ ] [Jemma] Paradise Stables: a new horse family of hers running Riding Stables (Small Business Residential)?
- [ ] [Jemma] Owners: the Izadi-Gomes ghosts for Mystic Crossroads, the Landgraabs for Magnolia Mall, Judith Ward for Plumbob Pictures Museum?
- [ ] [Jemma] Casa do Corsário: 2 units? Britechester: only The Old Clocktower as a Backroom (7 in all)? Hay Hill Landing: “Residential (Farm)” (“Vineyard/Farm” isn’t a game type)?

### Small business lots (research/small-business-check.md)
- [ ] [Jemma] “Small Business Residential” is the game’s own name after all. Rename plain “Small Business” to the game’s “Small Business Venue”? Add a bracket note of what each sells?
- [ ] [Jemma] The Portsmouth Promenade is a venue lot, so Mary and Blossom Greenburg have no home: rent at Rockridge Springs (empty), or make it their home again?
- [ ] [Jemma] No owner named yet: Optimist’s Outlook, The Llama Picturehouse (or make it a Bar), Plumbob Pictures Museum, Canalside Daycare. Greenwood Hamlet Residence has a venue type but residents listed
- [ ] [Jemma] Venue lots: show “Run by” instead of “Residents” on the site?

### What to build next (research/build-priorities.md)
- [ ] [Jemma] Have a look when planning builds: Britechester is complete; Newcrest needs only Rippling Flats; Granite Falls and Glimmerbrook have 2 lots left each; 28 lots are built but not shared (e.g. Boba Ippai); a suggested order for the next 15 builds, with reasons (based on what does well on her Gallery: 30×20 community lots, newer worlds, builds needing 3 packs or fewer)

### Going online one day (research/going-online.md)
- [ ] [Jemma] Only if she ever wants it on other devices or for friends: Cloudflare Pages with Cloudflare Access is free and private (people she lists get an email code). A public version would first need other players’ Gallery comments and usernames left out, the map mod’s terms checked with 20th Century Plumbob, and a “not affiliated with EA” line. No need to go online for herself
- [ ] [Claude] Small tidy-up whenever: 6 files in site/ are never shown (3.6 MB: the full maps of the 5 worlds she doesn’t own, and gallery/windenburg/von-windenburg-estate.jpg); add Lucide’s licence notice to site/

### Game changes, Oct 2025 – Oct 2026 (research/game-changes-2026.md)
- [ ] [Jemma] Nothing new to add: no new world since Ondarion and none announced; the new lot types (Custom Venue, Backroom, Community Market, Playground) and traits are already in her plan and tools. Her game is up to date (22 Sep 2026 patch)
- [ ] [Jemma] In game: Wedding Venues placed from the Gallery could stay Residential underneath until the 22 Sep patch; worth checking hers (Celebration Center, La Coppia Serena, Caminito del Deseo and the others)
- [ ] [Jemma] For the family tree: the 3 Feb 2026 update gave six premade families ancestors (Goths, Landgraabs, Thebes, Capps, Montys, Darongs), but only in new saves; EA plans more family and relationship work for late 2026
- [x] Corrected research/lot-types-reference.md: penthouses can be rentals since Jul 2024; Gibbi Point’s waterfront lots are excluded like Sulani’s; Backroom is allowed in every world (17 Oct)

### Lot traits (research/lot-trait-ideas.md: what each trait does, a check of hers, ideas)
- [ ] [Jemma] In game: The Old Dockyard has Off-the-Grid, which a Community Space can’t use (left over from when it was a home): take it off?
- [ ] [Jemma] Gnomes does nothing on venues (Burners & Builders, Pixel Café, Llama Picturehouse): swap for something that works?
- [ ] [Jemma] Starlight Accolades: Hottest Spot in Town on Studio PBP (the game’s venue) once built; keep Calico’s too?
- [ ] [Jemma] Caldera Camp: add Geothermal and Natural Well? Key Point: Off-the-Grid only works if it’s a home, Tiny Home or Generic (not a Vacation Rental)
- [ ] [Jemma] 88 shared lots have fewer than 3 traits: the note has ideas for each free slot, for when she’s in game
- [x] Corrected research/undecided-lots.md (Off-the-Grid isn’t allowed on a Vacation Rental) and research/lot-types-reference.md (Maintenance Troubles isn’t allowed on rentals) (17 Oct)

### Screenshots (research/screenshot-coverage.md)
- [ ] [Jemma] Her Sims 4 Screenshots folder probably has pictures for 15 more lots, found by matching picture times to Gallery upload times (she takes them minutes before uploading). Strong: Bailey-Moon Manor and Izakaya Hanamigawa Koen (so their ticks are right), 122 Hakim House, Valley Views, Town Square Stores, Oak Alcove, Sultry Springside. Likely: Granada Place, Stonestreet Apartments 3 and 4, Museum of the Arts, Newcrest Community Space, Hindquarter Hideaway, The Forest Tavern, Twin Oracle Point. With her OK: copy each set into a new Builds folder (her folder, so she does it or says yes), name the pictures, add them to the site
- [ ] [Jemma] 137 shared lots have no pictures anywhere; they’d need screenshots taken in game (biggest gaps: Oasis Springs 14, Britechester 13, Willow Creek 12, San Myshuno 12). Midtown Meadows’ and Rio Verde’s photos are older than their current uploads: retake?
- [ ] [Jemma] Show each lot’s Gallery upload date on its page? (169 of 226 uploads have it in their Gallery id)

### Weekly Gallery refresh (research/gallery-refresh-health.md)
- [ ] [Claude] Bug, fix first thing when she’s back: if a new upload is listed but can’t be read, the linking step crashes (KeyError in auto_link), so no lots get linked and the site isn’t rebuilt that Sunday (the numbers are already saved). One-line fix. Sunday 18 Oct should still run fine unless that happens
- [ ] [Claude] Also: the Gallery search isn’t filtered by creator (someone else’s upload naming her could be counted); files aren’t written safely (a power cut mid-write could break history.csv); deleted uploads are never marked gone; results aren’t committed to git after a run
- [ ] [Jemma] Optional extras: a notice in the app when the last refresh failed; commit after each refresh. The task only runs while she’s signed in and won’t wake the laptop, but catches up after a missed Sunday

### Text check (research/text-check.md)
- [ ] [Claude] Obvious text fixes when she’s back: straight quotes not converted (tab titles, the not-found page, double quotes, ‘n’ and ’Round); “Open the The Scotts household” and “household household”; “Community lots only” on The Bramblewood and Lykke Center (both have empty homes); two Tartosa lots as “?” on Stats; American spellings in our own text (traveller, endeavour, practise, industrialisation); Lykke Centre vs Center, Humour vs Humor on cards; game names spelt differently from the game’s files (Casa do Corsário, Von Haunt Estate and others); caption slips (Childrens, Kids Room, Selvadora Room)
- [ ] [Jemma] Her call: one word for an empty unit (“Free” on cards, “Nobody yet” in the units list, “Empty” elsewhere)? Stats still says “(owners)” where cards say “(landlord)”; two households called “Mine”; “Zest” or “Johnny Zest”; Enzo Alto linked to the Alto family?; show her bracket notes on lot types (e.g. “Restaurant (Seafood)”) somewhere?
- [ ] [Jemma] 47 Gallery descriptions have clear typos that could become text-fixes (e.g. afficionados, luxirious, uipstairs, Windernbug, Glimmerbook, “it’s own devices”): look over the list in the note first; her own spellings (center, cozy, neighborhood) stay

### Getting found on the Gallery (research/gallery-findability.md)
- [ ] [Jemma] Tips for future uploads (her call; her voice untouched): name search reads only the title, so her own titles work well; hashtags only match exactly, so use specific ones (neighbourhood, the game’s lot name) and put the core tags first (descriptions stop at 500 characters, and 40 of hers are at 495+); drop rare twins (#playertested next to #playtested, #moveobjectson, #under20000); #vacationrental for holiday rentals; set lot type and bedrooms/bathrooms before saving
- [ ] [Jemma] Old uploads can’t be edited, so fix tags only when re-uploading anyway: 17 have misspelt tags (e.g. #winderburg, #britchester), 14 have no world tag (incl. Izakaya Hanamigawa Koen), 2 are tagged #basegame but need a pack (Glimmerbrook Watch, the Cantina). The note lists which
- [ ] [Jemma] Ideas: a small hashtag checker to run before uploading (a new script)? Report EA’s “Missing sims translation” label on Community Spaces and Recreation Centers to EA?

### Speed and accessibility (research/speed-and-accessibility.md)
- [ ] [Claude] Obvious fixes when she’s back: white initials on pale world colours (use the existing textOn()); keep focus on the sidebar link after choosing a page; smooth scrolls should respect reduced motion; remove leftover CSS
- [ ] [Jemma] **Banner writing: look at the prototype** for-jemma/prototypes/banners/index.html: 8 tricky banners as now and with options A (soft shadow), B (darker fade), C (dark wash on the left behind the text), D (lighter brass and white with a shadow), E (C and D together). Measured: only E makes every banner readable (A and B barely help); the fade stays each world’s own deep shade. E, or C or D alone if E darkens the map too much?
- [ ] [Jemma] Her call: a soft shadow or darker fade behind banner text (the pack line and brass title half are too faint over most maps: the biggest gain); a darker world colour for small text on the light page (16 of 25 are faint, Sulani worst); a darker brass for text and focus outlines; keyboard access to the lot circles and apartment buildings; Stats waiting until she stops typing (its table redraws on every key, up to 1s); copy the two fonts into site/ so a slow connection can’t leave the window blank (needs a download)
- Fine as it is: every page draws in under 20ms (Stats about 0.3s); picture sizes suit her 200% screen, though the Gallery’s own pictures (610×410) look soft as lot banners

### Neighbourhood banners (research/hood-banners-review.md; pictures in for-jemma/hood-banners/)
- [ ] [Claude] Bug: the banner zoom is worked out for a banner about 352px tall, but the real ones are 380–686px (the title and text make them taller), so each neighbourhood only fills the middle and its lowest part sits under the fade. Work out the zoom from the banner’s real height and keep the box above the fade (fixes most of the so-so ones: Lykke Center / University of Windenburg, Hopewell Hills, Deadgrass Isle, The Crumbling Isle, Plumbite Cove). Fix when she’s back
- [ ] [Jemma] None looks worse than the whole map (48 good, 29 so-so). Her taste: put Belomisia Jungle, Campground, Glimmerbrook (loses its sunset) and Conifer Station back to the whole map? They barely zoom (1.01–1.15×)
- [ ] [Jemma] Zoom out a bit: Acquisition Butte, Desert Bloom Park, Galloping Gulch (mostly bare rock at 3×), Myshuno Meadows (soft), Yukimatsu (mostly snow)? Needs a small per-neighbourhood banner setting

### Blurry taskbar icon (research/taskbar-icon.md)
- [ ] [Jemma] Cause found: a plain Chrome app window takes its taskbar icon from the page’s 16px icon and Windows stretches it (her PC runs at 200% scaling, so the taskbar wants 48px). A restart won’t fix it. Fix: make it an installed Chrome app served from http://127.0.0.1 (a small local server started at sign-in, a web manifest; she clicks Install once). Cheaper, untested: pin a shortcut with Chrome’s own taskbar id. Her call

### Tidy-up check (research/site-audit-16-oct.md, 35 items)
- [ ] [Claude] Fix the “obvious bug” items when she’s back (no coding overnight), e.g. Manzanita Terrace’s type has no “(3)” so it shows no units; Rippling Flats’ card and page disagree; “Jemma’s Sim World” has a straight apostrophe in the title, sidebar and top bar; Calle del Ensueño’s Sims made is false not N/A; leftover rental-trial code; out-of-date counts and notes in TODO.md, HANDOVER.md and CLAUDE.md; research notes that predate the 16 Oct choices
- [ ] [Jemma] The “needs her decision” items in that file, e.g. Glimmer & Books is ticked shared but marked not built; Taka Soi 15’s units come out 09 before 08 (the game’s order)

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

- [x] 13 Oct additions kept as they are: "Shared" on Gallery cards, the footer dates (home), the search box (sidebar; its text shortened to "Search…") (16 Oct)

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
