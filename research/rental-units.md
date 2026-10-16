# Rental units: what her save says, and who could go where (16–17 Oct)

For TODO §2 (“Decide each rental’s households unit by unit”). Research only; nothing in the app is changed.

**Sources:** her newest “Building” save (Building #2), read from a temporary copy the way `tools/lot_traits.py` does; household sizes from the Sims Wiki; the Gallery’s bedroom and bathroom totals.

**Her save rules, as applied here:**
- **Unit names and unit traits:** shown for every rental (her 16 Oct exception).
- **Bedroom, bathroom and bed counts:** shown for **shared** rentals only.
- **Unshared rentals:** where useful, the game’s own unit sizes from the Sims Wiki are given instead, marked “game”.
- Only lots were read, never Sims. The hidden For Rent markers (347990, 347991, 347992, 347995) are left out.

## What the save gives

- **Unit names:** all match the plan. Shared rentals are numbered 1, 2, 3…; her own names are on unshared ones (3A/3B, 08/09, 11A–C).
- **Bedroom and bathroom counts are mostly missing:**
  - **Every unit has them:** only Manzanita Terrace (3 bedrooms, 3 bathrooms each) and Old Torget House (3/3 each).
  - **Only unit 1 has them:** Rio Verde, Inner Circle, Upland Trailer Park, Slip 42, Spring Steppes and Rockridge Springs. Two of those look wrong:
    - Rio Verde 1 says 5/4, but her Gallery text says six one-bed flats.
    - Spring Steppes 1 has 3 bathrooms, which is the whole building’s count on the Gallery.
    - So unit 1 probably still holds the numbers from before the lot was split.
  - **No counts at all:** Fern Park Flats, Midtown Meadows and Tail’s End.
- **Beds** (`bed_info_data`) are only on unit 1 and look like whole-building or stale numbers: 12 beds in Midtown Meadows 1, 13 in Old Torget House 1, 1 in Fern Park 1. They aren’t safe to use per unit.
- **Unit traits:**
  - **Every unit has its own:** Tail’s End, Rockridge Springs, Manzanita Terrace, 3 Cobblebottom Street, Taka Soi 15 and Sungai Point.
  - **Only unit 1 has traits** (probably the lot’s traits from before the split): Rio Verde, Fern Park Flats, Midtown Meadows, Inner Circle, Upland Trailer Park, Slip 42 and Spring Steppes.
  - **No traits anywhere:** Old Torget House.
- **Changed since 14 Oct** (research/rentals-and-apartments.md): Spring Steppes, Rockridge Springs and Slip 42 are now split into units in the save.
- **Not split yet, so no units to read:** Rippling Flats, Specter Row (still “Moppy Manor”) and Casa do Corsário.
- **Not in the save at all:** Abandoned Views and Sequoia Cottage (neither is built).

Sizes of EA households below are from the Sims Wiki. “Fits” is a suggestion only.

## Oasis Springs – Rio Verde Retirement Home (shared, 6 units, “Elders”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Sunny Aspect, Homey; Quake Zone | 5 / 4 (looks wrong) | one elder or an elder couple |
| 2–6 | none | – | the same |

- Her Gallery text says six one-bed flats. So it’s one elder, or a couple sharing a double bed, per flat.
- “Elders” is a label; no named households yet.

## Newcrest – Fern Park Flats (shared, 5 units, “BFF”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Fast Internet, Sunny Aspect | – | |
| 2–5 | none | – | |

- **The flats:** the Gallery has 6 bedrooms across 5 flats, and her text runs “from the cheaper one-bedrooms to the luxurious penthouse”. That’s probably four one-bed flats and a two-bed penthouse.
- **BFF** (Willow Creek’s game household): Travis Scott, Liberty Lee and Summer Holiday, 3 young adults.
- **Suggestion:** split them into three one-person households in three one-bed flats. If they stay one household, the penthouse is the only flat that could hold them, with two sharing a room.

## Newcrest – Midtown Meadows (shared, 5 terraced houses, “Single Mum Friends”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Child’s Play, Good Schools, Gnomes | – | a mum and her children |
| 2–5 | none | – | the same |

- The Gallery has 9 bedrooms across 5 houses, so mostly two-bed houses.
- **Suggestion:** one mum and her children per house, so five small households. Not an EA household.

## Newcrest – Rippling Flats (not shared, plan 2 units, “Current uni Sims”)

Still one home in the save, not split. Nothing per unit yet.

## Brindleton Bay – Tail’s End Apartments (shared, 4 units, Lynx renting one)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Cat Hangout, Fast Internet | – | Catarina Lynx (second choice) |
| 2 | Good Schools, Fast Internet | – | a family with children, later |
| 3 | Cat Hangout, Homey | – | **Catarina Lynx** |
| 4 | Fast Internet, Natural Light | – | a single or a couple |

- The Gallery has 5 bedrooms across 4 flats: probably three one-bed flats and one two-bed.
- **Catarina** is a young adult who lives alone with four cats. Unit 3 has Cat Hangout and Homey.

## Del Sol Valley – Inner Circle (shared, 4 units, “Roomies”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Party Place; Quake Zone, Filthy | 1 / 1 | one Roomie |
| 2–4 | none | – | one Roomie each |

- The Gallery has 4 bedrooms and 4 bathrooms, so four one-bed flats.
- **The Roomies** (Oasis Springs’ game household) are 4 young adults: Zoe Patel, J Huntington III, Gavin Richards and Mitchell Kalani.
- **Suggestion:** a flat each, split into four one-person households (neighbours instead of flatmates). As one household, they’d need one flat with four beds.

## Del Sol Valley – Upland Trailer Park (shared, 4 trailers, no landlord)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 Upland Place | Sunny Aspect; Filthy, Quake Zone | 1 / 1 | Eclectic Arts: Mark Eggleston |
| 2 Upland Place | none | – | Eclectic Arts: Leslie Holland |
| 3 Upland Place | none | – | Eclectic Arts: Alice Martin |
| 4 Upland Place | none | – | **Johnny Zest** (her choice, 16 Oct) |

- The Gallery has 4 bedrooms and 4 bathrooms, so one-bed trailers.
- **Exactly full:** StrangerVille’s 3 artist friends, a trailer each, plus Johnny. Which artist goes in which trailer is a free choice.

## StrangerVille – Slip 42 (shared, 2 trailers, “Empty”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Creepy Crawlies, Quake Zone, Filthy (challenges) | 1 / 1 | a single |
| 2 | none | – | a single |

- The Gallery has 2 bedrooms and 2 bathrooms, and her text says “bring a friend along”.
- Empty in the plan, and nobody in StrangerVille needs a home.

## Britechester – Spring Steppes (shared, 3 units, Elderberrys own)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Homey, Cat Hangout | 2 / 3 (bathrooms look wrong) | **the Elderberrys** |
| 2 | none | – | **the Pleasants** |
| 3 | none | – | a student household |

- The Gallery has 8 bedrooms and 3 bathrooms in all.
- **The Elderberrys:** Ekram and Eleanore (elders) and their teen grandson Rohan. They need 2 bedrooms, and Spring Steppes is their home in the game.
- **The Pleasants** (Discover University): twins Angela and Lilith, young adults. They need 2 bedrooms, or 1 if they share.
- **Unit 3:** her upload’s story is students moving into the lane.

## Evergreen Harbor – Rockridge Springs (shared, 3 units, “Empty”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Good Schools, Sunny Aspect | 2 / 1 | a couple, or a parent and child |
| 2 | Good Schools, Sunny Aspect | – | |
| 3 | Good Schools, Sunny Aspect | – | |

- The Gallery has 7 bedrooms in all. Her text says the houses suit “whether you’re by yourself or surrounded by all your family”, so the sizes vary.
- **Idea:** Mary and Blossom Greenburg. Their game home, The Portsmouth Promenade, is a Small Business venue in the plan, so they have nowhere to live (see small-business-check.md).

## Evergreen Harbor – Abandoned Views (not shared, “Henley”)

- Not in the save yet (not built), so there are no units to read.
- **Henley isn’t an EA household.** The only Henley on the Wiki is Micah Henley, a Maxis Gallery Sim from Dine Out’s promotion. So it’s probably one of hers.

## Henford-on-Bagley – 3 Cobblebottom Street (not shared, 2 units)

| Unit | Traits | Size | Fits |
|---|---|---|---|
| 3A | Gnomes, Homey, Cat Hangout | not read (not shared) | **Cecilia Kang** (tenant, “A New Start”) |
| 3B | Gnomes, Homey, Chef’s Kitchen | not read | **Moody & McMillan** (own it, live there) |

- **Moody & McMillan** are Derek and Ian, a married elder couple. Ian is a Foodie, which suits 3B’s Chef’s Kitchen.
- **Cecilia** is a young adult on her own and an Animal Enthusiast, which suits 3A’s Cat Hangout.

## San Sequoia – Manzanita Terrace (shared, 3 units, Robles own)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | Natural Light, Bracing Breezes, Child’s Play | 3 / 3 | a family |
| 2 | the same | 3 / 3 | a family |
| 3 | the same | 3 / 3 | a family |

- **The Robles live at Robles Point,** so they’re landlords who don’t live here. No tenants are named.
- Her text says “three growing families”. Every San Sequoia household already has a home, so these would be new families, or Empty for now.

## San Sequoia – Sequoia Cottage (not shared, 2 units, Lovejoys own)

Not in the save (not built). The Lovejoys live at 23 Eucalyptus Lane, so both units are for tenants.

## Tomarang – Taka Soi 15 (not shared, 2 units, Cahyaputris own)

| Unit | Traits | Size (game) | Fits |
|---|---|---|---|
| 09 | Sunny Aspect, Natural Light | 2 / 1 | **the Cahyaputris** (as in the game) |
| 08 | Great Soil, Bracing Breezes | 1 / 1 | a single tenant |

- **The Cahyaputris:** Vanesha (young adult) and her teen sister Zhafira.
- **Unit 08:** Zhafira’s game text mentions the “interesting people” in the unit downstairs.

## Tomarang – Isda Riverfront (not shared, 2 units, Rochana/Caberry own)

| Unit | Traits | Fits |
|---|---|---|
| 1 | none | |
| 2 | none | |

Rochana and Caberry aren’t EA households. If they’re two households, it’s one per unit; if they’re one, that’s one unit and a tenant in the other. Her call.

## Tomarang – Sungai Point (not shared, 3 units, “Linh-Sadya & Linh”)

| Unit | Traits | Size (game) | Fits |
|---|---|---|---|
| 11A | Homey | 3 / 2 | **the Linh-Sadyas** (as in the game) |
| 11B | Great Acoustics, Gnomes | 3 / 2 | **Thi Linh** (as in the game) |
| 11C | Spooky, Mold (challenges) | 2 / 1 | empty (“for any family just getting started”) |

- **The Linh-Sadyas:** Chánh and Arturo Linh, Liên and Alon Sadya, and their daughter Cam (5 Sims).
- **Thi Linh** lives alone.
- **Landlord:** in the game the owner is Panya Li, a townie landlord. The plan names none.

## Ravenwood – Specter Row (not shared)

- Still “Moppy Manor”, one home, in the save.
- **The Specters** (Life & Death): Olive Specter, her fiancé Layne Coffin and her teen son Nyon. They need 2 bedrooms.
- Type and units are in undecided-lots.md.

## Nordhaven – Old Torget House (shared, 3 units, “Empty”)

| Unit | Traits | Bed / bath | Fits |
|---|---|---|---|
| 1 | none | 3 / 3 | a family of up to about 6 |
| 2 | none | 3 / 3 | the same |
| 3 | none | 3 / 3 | the same |

- No unit has a lot trait; she may want to give them some in game.
- **Idea:** Nordhaven’s game families without a home: the Hoffmans (candy stall), Corey Nyhus and Zain Amri. That’s only if she wants them housed; elsewhere she’s kept such townies homeless by design.

## Ondarion – Casa Do Corsário (not shared, “2 or 3 units”, Aloisio Romualdo owns)

- Still one home in the save (not split).
- **Size:** the game lot is 20×15 with 1 bedroom and 1 bathroom.
- **2 units suit the size:** Aloisio (a young adult on his own) plus one tenant. A third unit would be very tight. The tenant is open; Ondarion’s four homeless Sims stay homeless (her choice).

## Decisions for her

1. **Split or keep together:**
   - BFF: three one-bed flats, or one household in the penthouse?
   - The Roomies: four flats, or one?
   - The Eclectic Arts: three households or one? (Each has a trailer either way.)
2. **Confirm the fits:**
   - Catarina Lynx: Tail’s End 3 (or 1).
   - Johnny Zest: Upland 4.
   - Spring Steppes: Elderberrys 1, Pleasants 2.
   - 3 Cobblebottom Street: Cecilia 3A, Moody & McMillan 3B.
   - Tomarang: the Cahyaputris and Linh-Sadyas as in the game.
3. **Empty units:** fill them, or leave them Empty?
   - Rockridge Springs: the Greenburg parents?
   - Old Torget House: Nordhaven’s homeless?
   - Manzanita Terrace and Slip 42.
4. **In game, if she wants per-unit facts on the site:**
   - Give units 2+ their own lot traits.
   - Recheck bedroom and bathroom counts (only Manzanita Terrace and Old Torget House have them for every unit).
5. **Casa Do Corsário:** 2 units suggested.
