# Text check: everything the site shows

Checked overnight, 17 October 2026: every label in `site/js/app.js` and `site/index.html`, every bit of world data the site displays (blurbs, neighbourhood cards, weather, highlights, festivals, lot names and types, residents, tenants, Sim cards, screenshot captions), `data/gallery/text-fixes.json`, and her Gallery descriptions as the site shows them. Nothing was changed.

**Kind:** *obvious fix* = a slip or a broken rule, can be fixed straight away; *her call* = wording, names or choices. Items already in `research/site-audit-16-oct.md` (Rippling Flats, "let" vs "lived in", the straight apostrophe in "Jemma's Sim World") aren't repeated, except where this adds to them.

**Fine as it is:** percentages appear only on Stats. "Favourites" everywhere, never "likes". Lot names follow her rule (Gallery title, then her name, then the in-game name), apart from row 1.6. Straight apostrophes in the data all show curly, because the page converts them; ids and links stay straight. The three text-fixes all still match and apply. Lot types are the game's names or her own exceptions, apart from section 4.

## 1. Site code

| # | Where | Now | Suggested | Kind |
|---|---|---|---|---|
| 1.1 | Page not found (app.js 652) | "This link doesn't match…" (typed straight, so it never gets converted) | doesn’t | obvious fix |
| 1.2 | Browser tab titles (app.js 645–653) | Every page's title: "… · Jemma's Sim World", and lot, neighbourhood and household names are put in unconverted ("Tail's End Apartments", "Whiskerman's Wharf") | Convert titles like the rest of the page. Adds to audit item 5 | obvious fix |
| 1.3 | Curly quotes (app.js 8) | 'n' and 'Round get an opening quote mark: "Cookies ‘n’ Cream", "Thrift ‘n’ Fish", "‘Round the Fire Festival" (Wanderwood Wilds) | Cookies ’n’ Cream, Thrift ’n’ Fish, ’Round the Fire Festival | obvious fix |
| 1.4 | Double quotes (app.js 9) | Straight " stay straight: Riders' Glen card ("Ol’ Biscuit"), Ravenwood blurb ("normal"), Cantina "El Árbol del Jaguar" as the in-game name (lot page, Stats), and the Cantina's Gallery text | “ ” | obvious fix |
| 1.5 | Neighbourhood cards (app.js 358) | "Community lots only" on The Bramblewood (3 empty homes) and Lykke Center / University of Windenburg (2 empty halls) | "No households yet" when there are homes | obvious fix |
| 1.6 | Stats, worlds not owned (app.js 532) | Villa Vigna and Celebrazioni d'Amore (Tartosa) are listed as "?", with the in-game name underneath | The in-game name, as for owned worlds ("?" means not named yet) | obvious fix |
| 1.7 | Rental units | Three words for an empty unit: "Free" (card list), "Empty" (circle label), "Nobody yet" (units table) | One word, e.g. "Free" | her call |
| 1.8 | "Sims made" wording | Lot page "– Shared not yet", "– Sims made not yet"; household card "Sims not made yet"; household page "Sims made in game: Not yet"; Stats "Sims not made" | e.g. "Not shared yet", "Sims not made yet" | her call |
| 1.9 | Apartment buildings | "Apartment Building · 4 Apartments" (card), "Stonestreet Apartments · 2 Apartments" (lot page); rentals say "· 4 units" | "· 4 apartments" | her call |
| 1.10 | Stats, Residents (build.py 194) | "Elderberry (owners) + Pleasant (tenant)", "Moody & McMillan (owners) + …", "Robles own", "Lovejoy own", "Cahyaputri own" | As on cards (16 Oct): "Elderberry (landlord), Pleasant", "Robles (landlord)" | her call |
| 1.11 | Rental lot and household pages | "Who lives here" shows only the first household (Spring Steppes: Elderberry; the Pleasants are only in the Tenants line). "(renting)" appears only for added tenants (Zest), not for the Eclectic Arts in the same trailer park or the Lynxes at Tail's End | List every household; mark "(renting)" for anyone in a rental who isn't the landlord | her call |
| 1.12 | Community Space tabs (build.py 76) | "Community space" (small s) next to Market, Garden, Makers | Community Space (the lot type) | obvious fix |
| 1.13 | Not-owned world tiles | Said three times: the section is "Not owned", the picture says "Not owned", the line under it "Pack not owned" | Drop one | her call |
| 1.14 | Lot types with her notes | The notes stay in the data but are never shown: "Restaurant (Seafood)", "Restaurant (Diner)", "Bar (Pub)", "Retail (Bakery & Ice Cream)", "Small Business (Tarot & Curiosities)", "Custom Venue (Community Farm)", "Residential (Farm)" all show as the plain type | Show the note on the lot page? (TODO §6d asks the same for small businesses) | her call |
| 1.15 | Screenshot captions (made from file names, build.py 127) | "Childrens Bedroom 1/2", "Childs Bedroom", "Kids Room", "Kids Bedroom", "First/Second Kids Room" | Children’s, Child’s, Kids’ | obvious fix |
| 1.16 | Screenshot captions | "Chicken And Crop Enclosure", "Back Down The Hill", "Floorplan Roof And Riads", "Master Dressing Room And Bathroom" | small "and", "the" | obvious fix |
| 1.17 | Olde Platz Inn caption | "Selvadora Room" (next to "Selvadorada Bathroom") | Selvadorada Room | obvious fix |

## 2. World and neighbourhood text (ours)

| # | Where | Now | Suggested | Kind |
|---|---|---|---|---|
| 2.1 | Oasis Springs blurb | any traveler | any traveller | obvious fix |
| 2.2 | Chestnut Ridge blurb | another endeavor | another endeavour | obvious fix |
| 2.3 | Nordhaven blurb | want to practice your hobbies | practise | obvious fix |
| 2.4 | Port Promise card | learn about industrialization | industrialisation | obvious fix |
| 2.5 | Lykke Center / University of Windenburg card | "Lykke Centre is where…" (the card's own title says Center) | Lykke Center (the game's name) | obvious fix |
| 2.6 | Arts Quarter card | "Home to the Humour and Hijinks Festival", while the festival line just under it says "Humor and Hijinks Festival" | Humor (the game's name) | obvious fix |
| 2.7 | Weather lines (9 owned worlds, 2 not owned) | heat waves | heatwaves | obvious fix |
| 2.8 | Starlight Boulevard card | night life, can not be beat, night club | nightlife, cannot be beaten, nightclub | obvious fix |
| 2.9 | Mirage Canyon card | pitstop | pit stop | obvious fix |
| 2.10 | Galloping Gulch card | chockfull | chock-full | obvious fix |
| 2.11 | Mirage Park card | an up and coming star | up-and-coming (as on Wakaba's card) | obvious fix |
| 2.12 | Magnolia Promenade blurb and card | top of the line | top-of-the-line | obvious fix |
| 2.13 | Sulani blurb | the community centred Ohan'ali Town | community-centred | obvious fix |
| 2.14 | Prescott Square card | afterschool hangouts | after-school | obvious fix |
| 2.15 | Glimmerbrook blurb; Uptown and Bellacorde cards | "eye...", "powerful... and", "beautiful...and" | "…" and a space after, as on Deadgrass Isle's card | obvious fix |
| 2.16 | Wanderwood Wilds card | a blast - literally! | a blast – literally! | obvious fix |
| 2.17 | Granite Falls and Mt. Komorebi blurbs; Anchorpoint Wharf card | "a vacation"; "a movie theatre" | a holiday; a cinema (Yukimatsu's "vacation rentals" is the lot type, keep) | her call |
| 2.18 | Acquisition Butte, Grims Quarry cards; Copperdale blurb | "paying premium"; "The quaint suburbs … is"; "lay nestled", "With academics and adventures abound" | a premium; are; lies nestled; adventures aplenty | her call |
| 2.19 | Repeated text | Magnolia Promenade's card is the world blurb word for word; 7 cards repeat a highlight shown lower on the same page (University of Britechester, Foxbury Institute, StrangerVille Plaza, Shady Acres, Granite Falls Forest, Grims Quarry, Port Promise) | Leave, or shorten | her call |

## 3. Game text, names and households

| # | Where | Now | Suggested | Kind |
|---|---|---|---|---|
| 3.1 | StrangerVille highlights | Strangerville Plaza, Strangerville Information Center, Strangerville has to offer | StrangerVille (EA's slip; the world's own spelling) | obvious fix |
| 3.2 | Oasis Springs highlight | Oasis Spring's namesake | Oasis Springs’ namesake | obvious fix |
| 3.3 | Tomarang highlight | legendary tails | legendary tales | obvious fix |
| 3.4 | Highlights in US spelling (shown "from the game"; TODO §8 already asks) | vacation (Newcrest, Glimmerbrook), Artifacts, Snorkeling, industrialization, A Cozy Village, neighbors, neighborhoods, Practice Your Hobby, endeavors, a movie | British, or keep as the game wrote them. Also "Plenty Room to Jog", "tight knit" | her call |
| 3.5 | Ondarion lot | Casa Do Corsário | Casa do Corsário (the game's files) | obvious fix |
| 3.6 | Windenburg, Special Lots | Von-Haunt Estate | Von Haunt Estate (the game, and the highlight on the same page) | obvious fix |
| 3.7 | Tomarang, in-game name | Chee-wit Chee-waa Kanto | Chee-wít Chee-waa Kanto (the game; her Gallery title already has the í) | obvious fix |
| 3.8 | Windenburg, in-game name | Mid-NoWhere | Mid-Nowhere (then the lot page stops showing an "in-game name" that differs by one capital) | obvious fix |
| 3.9 | San Myshuno | FountainView Penthouse | Fountainview Penthouse (the game) | obvious fix |
| 3.10 | Magnolia Promenade's pack | Get To Work | Get to Work (EA; its lot pages already say so under Packs used) | obvious fix |
| 3.11 | Households called "The …" | The Scotts (The Gnome's Arms), The Watsons (Olde Mill Hill), The Grove Family (Biscuit's Bastion), The Nectar Making Duo (Grapevine Terrace): the site says "Open the The Scotts household", "No Sims added for the The Watsons household yet" | Scott, Watson, Grove, Nectar Making Duo (are the Watsons related to the Watson-Holmes next door? her call) | obvious fix |
| 3.12 | Nordhaven, The Old Foundry | Urbane Housesharers household (shows as "…household household") | Urbane Housesharers | obvious fix |
| 3.13 | Caldera Camp, Red Roan Farm | Residents "Mine" become a household called Mine ("Open the Mine household") | A household name, or treat it as a note | her call |
| 3.14 | Upland Trailer Park tenant | "Zest" (note "Johnny Zest, from Oasis Springs"); other one-Sim households use full names (Cecilia Kang, Knox Greenburg, Enzo Alto) | Johnny Zest (note "from Oasis Springs") | her call |
| 3.15 | Ondarion | Enzo Alto and the Alto vineyard family (his mother and sister) aren't linked | Add them to familyLinks, like Greenburg / Knox Greenburg | her call |
| 3.16 | Evergreen Harbor lot names | Stonestreet Apartments 3 and 4 (Gallery titles) next to Pinecrest Apartments #402 and #404 (#404 has her own spelling) | Stonestreet Apartments #3 and #4 | her call |
| 3.17 | Selvadorada | "Hillside Hideaway" (Gallery title); its Gallery text starts "Hillview Hideaway is…" (the in-game name) | Leave, or her spelling "Hillview Hideaway" | her call |
| 3.18 | Her own lot names | Newcrest Arts Center, UoW Sports Center, Ohan'ali Community Center, Anchorpoint and Gibbi Rec Center (named after the game's lot types, so probably keep); UoW Students Union; StrangerVille Gym&Pool | Students’ Union; Gym & Pool | her call |
| 3.19 | Goth Sim cards | High school · grade C; Grade school | High School, Grade School (the game's names) | her call |

The ids don't change for 3.5–3.9 (the links are made from the name in lower case without accents).

## 4. Lot types not in the game's list

| # | Where | Now | Suggested | Kind |
|---|---|---|---|---|
| 4.1 | Magnolia Promenade, Secret Lots | Hospital; Sixam | The game's files call these lot types "Medical Clinic" and "Alien Party Lot" (`research/data/game-venues.json`); the 13 Oct list called them official. Check in game | her call |
| 4.2 | Already on TODO §6d | Small Business (×4 owned); Vineyard/Farm (Hay Hill Landing) | Small Business Venue; Residential (Farm) | her call |

## 5. Her Gallery descriptions: possible new text-fixes

Clear typos only, in the copy the site shows. Her wording and spellings (center, cozy, neighborhood, "everysim") are left alone. The three fixes so far were hers to approve, so show her these first. Add each one under its upload's id in `text-fixes.json` (find the id by title in `uploads.json`). "Twin" = an identical second upload with the same slip.

| Lot | Now | Fix |
|---|---|---|
| The Oak Barrel | afficionados | aficionados |
| Rindle Rose | As the pancakes … just what they need in for | As the Pancakes … what they need for |
| Appaloosa Stables | live and breath horses | breathe |
| Chee-wít Chee-waa | boba and thrift stores is; some some | store is; some |
| Tail's End Apartments | harbor cham | harbor charm |
| Manzanita Terrace (twin) | It is perfectly poised location | It is a perfectly poised location |
| Campground | depths of granite falls | Granite Falls |
| De Costadas (twin) | want family meal out | want a family meal out |
| The Inner Circle (twin) | the city.There | the city. There |
| Cordelia's Secret Cottage | for you too be able | to |
| Palomino Junction | around galloping gulch | Galloping Gulch |
| Sandtrap Flat | home in Oasis Spring is | Oasis Springs |
| Raffia Quinta | materialistc | materialistic |
| Town Square Stores | uipstairs | upstairs |
| Lotus Ridge Spa | luxirious | luxurious |
| Bailey-Moon Manor | office-studio and for Octavia | office-studio for Octavia |
| The Magic Realm | ever struct between | struck |
| 3 Olde Mill Lane | oversixed; ktchen-diner | oversized; kitchen-diner |
| 2-4-3 Wakabamori | a group or friends | a group of friends |
| Riverside Roost | space for a comfort and entertaining.This | space for comfort and entertaining. This |
| Springscape | Oasis Springs.,patiently; start a fresh | Oasis Springs, patiently; start afresh |
| Vista Quarry Villa | the perfect properly | property |
| Britechester B&B (twin) | Witth | With |
| The Shrieking Llama | in th nearby | the |
| Stonestreet Apartments 4; Garden Essence | simoleans; every simolean | simoleons; simoleon |
| Cottage Am See | Windernbug , | Windenburg, |
| Desert Bloom | slip and side; all ages,from | slip and slide; all ages, from |
| 1010 Alto Apartments | epensive; anyone possible want | expensive; possibly |
| The Old Dockyard (all 4 versions) | left to it's own devices | its |
| Cantina “El Árbol del Jaguar” | "El Áebol Del Jaguar"; every sim in Selvadora | “El Árbol del Jaguar”; Selvadorada |
| Foxbury Court | merchendise; juice afer | merchandise; after |
| Larry's Lagoon | Foxbury Institure | Institute |
| Mossy Lane; Jungle Bungalow; Green Getaway | hussle and bussle; hussle and bustle | hustle and bustle |
| Sapphire Shores | topical water; teaming with life | tropical; teeming |
| Strike Out! (twin) | the new place to place to be seen | the new place to be seen |
| Carpophagous Corner | Strangerville Plaza; down the rode | StrangerVille Plaza; road |
| Calico | sneak peak | sneak peek |
| The Ice Pavilion | The Ice Pavillion is where… | Pavilion (as her own spelling of the name) |
| 1310 21 Chic Street | this apartment is, ready; creativitiy | is ready; creativity |
| 920 Medina Studios | anyone who wants to a stylish place | wants a stylish place |
| The Forest Tavern | Wonder away from your cabin | Wander |
| Granite Falls Spa | enjoy it's wonderful spa; wonderous | its; wondrous |
| Burners & Builders | could possible want | possibly |
| Municipal Muses | who know what | who knows what |
| Museum of the Arts | explore the the museum | the museum |
| Brooks Bridge | Glimmerbook | Glimmerbrook |
| Spring Steppes | optio | option |

Smaller ones, same kind: "a hard days work" (The Old Clocktower, Foxbury Court), "hot summers day" (Palm Springs Public Pool), "hearts content" (Pixel Café), "artists secret club" (Museum of the Arts), "workers housing" (Mossy Lane, Spring Steppes) need an apostrophe (day’s, summer’s, hearts’, artists’, workers’). "mediterranean" (Sultry Springside), "winterfest" (Pebble Burrow) and "festival of youth" (2-4-2 Wakabamori) need capitals. "to hangout" (Orchid A Go Go, Wyvern Hall, Drake Hall) should be "hang out".

Her call, not typos: Stonestreet Apartments 3 and 4 say "Evergreen Harbour" (the game's name is Harbor). Anchorpoint Rec Center's text still calls it "this family-friendly library", and Glimmer & Books' calls it "this local library" (a Backroom since 16 Oct). Only a re-upload changes those; nothing to fix on the site.
