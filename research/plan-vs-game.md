# Jemma’s plan vs the game’s own files

Checked overnight on 13–14 October 2026, against the game installed on her PC (its own lot lists, lot sizes, neighbourhood areas and lot type names) and, for lot types, her newest “Building” save (shared lots only, read from a copy). Nothing on the site was changed.

Data: `research/data/plan-vs-game.json`, made by `tools/research/plan_vs_game.py` (with `game_lots.py` and `world_files.py`).

## Headlines

- **380 of the 388 lots in the plan are in the game under the same name.** The other 8 are small name differences (below); none is missing.
- **Every neighbourhood in the plan is one of the game’s own areas**, with the same lots in it, so her grouping is the game’s. The only mixes are on purpose: secret lots placed with a neighbourhood (Sylvan Glade, Hermit’s House, Mt. Komorebi Peak) and the “Secret Lots” / “Special Lots” groups.
- **Sizes: 352 lots compared, 2 differ.** Harbor Quarter Gym is 30×30 in the game (plan 30×20) and The Magic Realm is 50×40 (plan 40×40). The game files hold EA’s original sizes, so a lot she resized would show up here too.
- **Club Eternity is 30×30 in the game**, as in the plan. The two websites that said 30×20 were wrong, so nothing to change.
- **The four secret lots added on 13 Oct** (Sylvan Glade 15×10, Forgotten Grotto 15×10, Hermit’s House 30×20, Mt. Komorebi Peak 20×20) match the game exactly, as do the sizes the websites disagreed on (The Gnome’s Arms 30×20, Via Romanza 30×30, Forest Hideaway 40×30).
- **“Center Park” is the game’s own lot type for Myshuno Meadows** (it’s a separate type from Park). So the to-do suggestion “Central Park → Park” is better as **Central Park → Center Park** (the game’s spelling, as a proper name).
- **47 of the 163 shared lots have a different lot type in her save from the plan.** For 17 of them the Gallery upload disagrees with the plan too (table below); the rest look like lots set to something else while she works on them.

## Names that differ a little

| World | Plan (in-game name column) | The game’s name | Note |
|---|---|---|---|
| Willow Creek | Magnolia Blossom Park | Magnolia Blossom | Same lot, 50×50 |
| Oasis Springs | Desert Bloom Park | Desert Bloom | Same lot, 50×50 |
| Henford-on-Bagley | Isle of Volpe | Isle of Volpe Park | Same lot, 50×40 |
| Moonwood Mill | The Grimtooth Bar & Bunker | Grimtooth Bar & Bunker | No “The” in the game; 50×40 |
| Del Sol Valley | Plumbob Pictures | Studio | The acting studio lot (already on the to-do list), 50×50 |
| Ravenwood | Netherworld Department | HeadlessQuarters | The game’s file name for it; it’s **20×20** in the game files, the plan has 30×30 (her confirmed size, left as is) |
| San Myshuno | VIII and IX Landgraab Apartments | IX Landgraab | One building in the game, 30×20; both units are unshared |

The park and lot names in the plan read better than the game’s file names, so these are for the record only.

## Lot types: plan, her save and the Gallery

“Her save” is the lot type set on the lot in her newest Building save; “Gallery” is the type on the upload the site shows. A lot set to Residential while it’s being worked on is normal, so rows where the plan and the Gallery agree are probably fine.

**Where the Gallery disagrees with the plan (worth a look):**

| World | Lot | Plan | Her save | Gallery |
|---|---|---|---|---|
| Magnolia Promenade | Llama Picturehouse | Small Business | Retail | Bar |
| Windenburg | Mid-NoWhere | Park | Generic | Generic |
| Selvadorada | Belomisia Field Station | Vacation Rental | Custom Venue | Custom Venue |
| Brindleton Bay | The Bay Café | Small Business Cat Cafe | Generic | Café |
| StrangerVille | Carpophagous Corner | Vacation Rental | Residential | Residential |
| Sulani | Lagoon of Love | Wedding Venue | Vacation Rental | Park |
| Sulani | Admiral’s Wreckage | Community Space | Residential | (EA shows “Missing sims translation”) |
| Evergreen Harbor | The Old Dockyard | Community Space | Maker Space | (EA shows “Missing sims translation”) |
| Glimmerbrook | Brooks Bridge Borough | Residential | Haunted House Residential | Haunted House Residential |
| Britechester | Mossy Lane | Residential Rental (4) | University Housing | Residential |
| Britechester | Spring Steppes | Residential Rental (4) | Residential | University Housing |
| Evergreen Harbor | Rockridge Springs | Residential Rental (3) | Residential | Residential |
| StrangerVille | Slip 42 | Residential Rental (2) | Residential | Residential |
| Willow Creek | Crick Cabana | Tiny Home Residential | Residential | Residential |
| Oasis Springs | Raffia Quinta | Residential | Tiny Home Residential | Tiny Home Residential |
| Windenburg | Cottage Am See, Rustic Residence | Residential | Tiny Home Residential | Tiny Home Residential |

(“Missing sims translation” is EA’s own text bug for those two uploads’ lot type, not something on her side.)

**Where only the save differs (plan and Gallery agree, so probably just how the lot is set while building):** Willow’s (Residential in the save), Courtyard Lane Playground (Residential), The Llama Café (Nightclub), Oasis Springs Library (Lounge), The Ice Pavilion, The Aqua Grill, Newcrest Arts Center and Cookes ’n’ Cream (all Residential), Forest Hideaway and Granite Falls Spa (Vacation Rental), Magnolia Bowling Alley (Residential), The Narwhal Arms (Nightclub), Museum of the Arts (Bar), The Old Salt House (Thrift and Bubble Tea Store), Stargazer Lounge (Lounge), Brindleton Library and Creek Clinic (Residential), Upland Trailer Park (Vacation Rental), Starlight Fitness (Generic), Ohan’ali Community Center, The Sand Bar and Sand Simoleon Beach (Residential), Laurel Library (Generic), Anchorpoint Works (Vacation Rental), Oak Alcove (Tiny Home Residential).

Left out as the same thing under another name: Apartment = Residential, Small Business = Small Business Venue, Rec Center = Recreation Center, Boba & Thrift = Thrift and Bubble Tea Store, UoB Commons = UBrite Commons, “Vacation Rental – Granite Falls/Selvadorada” = Vacation Rental, farms and ranches = Residential, and lots with two types where the save has one of them. Rentals with units (Rio Verde, Fern Park Flats, Tail’s End, Inner Circle, Old Torget House) show as Residential in the save even though they’re split into units, so the save’s type isn’t telling us anything there.

## Lots in the game that aren’t in the plan

| World | Lot | Size | Note |
|---|---|---|---|
| Selvadorada | Omiscan Temple | 50×50 | A real lot in the game files (the research had no size) |
| Selvadorada | Omiscan Royal Baths | 40×30 | Also a real lot. The jungle areas are not lots |
| Mt. Komorebi | Mt. Komorebi Base Camp | 20×15 | The two “unnamed hidden lots” the Sims Wiki counts. Both are stages on the way to the Peak |
| Mt. Komorebi | The Croft Icefall | 20×15 | |
| Innisgreen | 14 lots | | Exactly as in `research/missing-lots-check.md`, sizes included (Fern & Frond Wading Pond really is 64×64). The game’s areas match: Coast of Adhmor 4 lots, Sprucederry Grove 5, Everdew 5 |
| Batuu | First Order District 30×20, Resistance Encampment 50×40, Black Spire Outpost 30×30 | | Neither pack is installed; their world data comes with the base game, so nothing to add |

## Apartment sizes

The plan has “N/A” as the size for apartments. The game gives each building’s size, if she ever wants it shown: Culpepper House 30×30, Jasmine Suites 20×20, Medina Studios 30×30, Hakim House 30×20, FountainView Penthouse 30×20, ZenView 20×20, 21 Chic Street 20×20, Alto Apartments 40×30, Spire Apartments 20×15, IX Landgraab 30×20 (San Myshuno); Stonestreet Apartments 30×20, Pinecrest Apartments 30×20 (Evergreen Harbor); Bright Cliff 30×20, Lakeview Apartments 40×30 (Ondarion).
