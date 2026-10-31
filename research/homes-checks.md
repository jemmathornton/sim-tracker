# Homes proposal: checks, world by world (31 Oct 2026)

Research only. Nothing in `data/`, `site/`, `tools/` or `for-jemma/` changed. This checks every pick in `for-jemma/homes-proposal.md` (28–29 Oct) and sets out each world for the chat walk-through.

**How it was checked**
- **Homes:** the plan as it stands today (`data/worlds/*.json`).
- **Bedrooms:** her Gallery uploads (`data/gallery/uploads.json`, “beds”); her own in-game count of the shared flats (TODO.md, 14 Oct); and the bedroom counts the game stores per lot and per unit in “Building #2” and “Jemma’s Sim World”.
- **Free units:** the plan’s tenants, the rentals table in TODO.md §2 and `research/rentals-next.md`.
- **Her households:** every save and her Library, read today from temporary copies: who is in each household, where it lives, and when it was last changed in Create-a-Sim.
- **Packs:** the folders in `C:/Program Files/EA Games/The Sims 4`. She has every expansion except Lovestruck (EP16) and Enchanted by Nature (EP19). Missing game packs: Vampires (GP04), Journey to Batuu (GP09), My Wedding Stories (GP11) and Werewolves (GP12).
- **Lore:** Maxis’s Gallery texts (`research/data/overnight/maxis-items.json`), `research/maxis-gallery-households.md`, `research/ea-premades-not-on-plan.md`, `research/past-game-lore-families.md`, and Sims Wiki pages (the cached overnight pages, plus “Dormitory” and “Skip Broke” fetched today).
- **Since 28 Oct:** the git log and her list. Only mod work has happened since (30 Oct). There are no plan changes and no new household uploads (the 29 Oct Gallery refresh found none).

---

## Problems found, most serious first

1. **Luis Huerta has no home.** He is one of her Sims on the who-lives-where item in her list (Library, made by MissTiquelle). In “Rotational” and “My Saved Game 2” he lives at Rustic Residence in Windenburg. The proposal never mentions him.
2. **Windenburg has a free home that the proposal missed: Rustic Residence.** It is a tiny home with 1 bedroom that sleeps 2. It is built and shared, the plan calls it “1 Bed”, and nobody is named for it (sources: `data/worlds/windenburg.json`; her Gallery upload says 1 bedroom). The proposal says “Windenburg has no free house”, and that sent three picks elsewhere: the Pregos to San Myshuno, the Oldies to Rio Verde and Kaylynn Langerak to a San Myshuno flat.
3. **Sebastian Michaelson and Merrilyn Ralston have no home.** Her list says to download them and pick their lots, but the proposal only gives their lore.
4. **Two first choices are Sims the proposal itself says aren’t hers.**
   - These are the Battles (Sandtrap Flat) and Brody Conklin (Rockridge Springs).
   - Confirmed today: in “Building #2” neither household has a Create-a-Sim date. Her own households do, for example the Presleys (Sep 2020) and the Thorntons (Mar 2023).
   - So Sandtrap Flat and one Rockridge Springs unit have no pick that works.
5. **The Bramblewood was being kept for fairies.**
   - TODO.md (16 Oct) keeps 13 and 14 Nettle Lane and Cordelia’s Secret Cottage “for a fairy area once she has Enchanted by Nature”.
   - The proposal puts the Thorntons and the Grunts there without mentioning this.
   - Faye Evergreen, a future fairy, fits that plan well at Cordelia’s Secret Cottage.
6. **There are more free rental units than the proposal says.**
   - 24 units are free once the four Rio Verde elders are in, not about 15.
   - Fern Park Flats has 2 free, not 1. Midtown Meadows has 3, not 2. Slip 42 has 2, not 1. Old Torget House has 3, not 2. Manzanita Terrace has 3, not 2.
   - The plan doesn’t hold Tomarang’s two empty units (Taka Soi 15 unit 08, Sungai Point 11C) for For Rent tenants. `research/rentals-next.md` says “a single tenant” for 08 and “leave empty, or a young family” for 11C.
7. **1313 21 Chic Street is promised twice.**
   - Her list has it in mind for the Karaoke Legends (“check 1313 21 Chic Street before confirming”). The proposal gives it to the Ferraras.
   - The Karaoke Legends (Akira Kibo and Darling Walsh, EA’s household) get no home in the proposal. They still have to leave 701 ZenView for Bro & Kennedy (`research/new-save-status.md`).
8. **The Thorntons are a first choice twice:** at 13 Nettle Lane and in a Manzanita Terrace unit.
9. **2-4-3 Wakabamori has 2 bedrooms, not one double bed.**
   - Her build has 2 bedrooms (her Gallery upload says 2, and so does “Building #2”).
   - Her build isn’t in the new save yet (status “to place”), so the new save still has EA’s own house there. That is where the one double bed came from.
   - So Kenji and Kumiko can each have a room.
10. **The Grunts and the Beakers are placed outside the desert.**
    - The proposal’s own research (`past-game-lore-families.md`, top picks 1 and 2) says StrangerVille or Oasis Springs. Her map groups the desert worlds together too.
    - The proposal instead puts the Grunts in Henford (14 Nettle Lane) and the Beakers in Ravenwood.
    - Oasis Springs has three free homes. Sandtrap Flat sleeps 4 and Vista Quarry Villa sleeps 5.
11. **Some homes are offered to more households than they can hold:**
    - Rio Verde’s 2 spare units: Helen Sparrow, Matteo Hamilton and the Oldies.
    - Ondarion’s 2 flats and 1 unit: Akachi, Irina and Fia, plus Hermia and Kent Capp.
    - The Sorority and Fraternity flats: Patina and Felicia, Game-time!, and the Burbs.
12. **The suggested Hermia Capp upload (by Spandaria) is a teen, and a teen can’t live alone.** There is a young-adult version (by simgremlinyt), or she could join Tybalt’s Capps.
13. **Canalside Daycare is a weak fit for the Branches.**
    - Maxis’s text says their trade is tattoos and pottery, not childcare. Nordhaven already has two tattoo and two pottery businesses, on purpose (TODO.md).
    - The daycare’s owner is still a “Decide” on her list.
    - An earlier owner idea is on file: the Koopmans’ daughter (`research/business-ideas.md`).
14. **Specter Row is still undecided** on her list (a 2-unit rental or a Haunted House) and isn’t built. Ophelia Specter’s unit may never exist.
15. **Some bed counts from the new save describe EA’s houses, not hers.** These lots aren’t placed in the new save yet, so it still holds EA’s originals: 2-4-3 Wakabamori, Cordelia’s Secret Cottage, 1 Cobblebottom Street, The Olde Mill and Pier Perfection.
16. **Small facts to correct in the proposal:**
    - The Princess Cordelia upload is the legendary Queen Cordelia Thebe I, a dead ancestor in new saves. It isn’t a younger copy of her Cordelia V. Skipping it is still right, because it needs Vampires.
    - Werewolves is a game pack, not an expansion.
    - Felicia Barnes is a toddler in “Building #2”, not a baby.
    - Maxis’s own Branche text calls Otto Amalia’s husband and Leif “their kid”. The wiki says they’re engaged and Leif is Amalia’s child. The sources disagree.
    - The “100 Babies house” suggested for 13 Nettle Lane is tagged #hallowslough #willowcreek on her Gallery. It belongs to the parked Cadberry job.
17. **The proposal’s mods section is out of date.**
    - This was done on 30 Oct: MCCC 2026.6.0 and Dress Code are in; Party Anywhere, the SulSul Weather App script and the Dress Code Seasons add-on are out; and the Ravenwood seasons mod was patched rather than taken out.
    - So the MCCC needed to move Fia Acosta is now in place.
18. **Also found, on no list:**
    - **Elissa Barragan:** in “Season Events” she is played, has no home, and was last changed in Create-a-Sim on 3 Oct 2025. She may be hers.
    - **Raheem Downey:** in her Library, made by JemmaTheSimmer, and living at Crick Cabana in “Sims Sessions”.
    - **Lilah Hare:** lives at Glimmerbrook Watch in “Building #2”, but she is game-made (no Create-a-Sim date), so there is no clash with Ash.

## Homes still open

| | Count |
|---|---|
| Whole homes in her owned worlds with nobody named (not counting Sulani’s split, homes already decided, or dorms) | 37 |
| … with a first choice that passes the checks | 29 |
| … whose first choice waits on her yes or no (Vista Quarry Villa, 1313 21 Chic Street, 13 and 14 Nettle Lane) | 4 |
| … **with no first choice that works (Rustic Residence, Sandtrap Flat, Red Roan Farm, Paradise Stables)** | **4** |
| Free rental units (after the four Rio Verde elders) | 24 |
| … with a first choice that passes | 10 |
| … waiting on her (the Thorntons at Manzanita Terrace) | 1 |
| … **with no first choice that works** | **13** |

**Open after the proposal: 17** (4 homes and 13 units). That rises to 22 depending on her answers. Not counted: Specter Row (not built, number of units unknown), 6 empty dorms (left for students), Sulani (her split) and the Cadberry homes (parked).

**Households still without a home after the proposal:**
- **Hers:** Luis Huerta, and maybe Elissa Barragan.
- **From her list:** Sebastian Michaelson and Merrilyn Ralston.
- **EA’s:** the Karaoke Legends.
- **Lore picks with no free home:** the Oldies, the Burbs, Kaylynn Langerak, Brandi and Beau Broke, Lola and Chloe Curious, Hermia Capp and Kent Capp.

**Every source the proposal uses is still allowed under her save decisions** (`research/saves-review.md`). None comes from a save marked for deleting.

---

## Willow Creek

**Homes in play:**
- Garden Essence: “Empty”, 4 bedrooms (Gallery), sleeps 7.
- Crick Cabana: Dustin Broke’s home, 2 bedrooms, offered as a home for Brandi and Beau Broke.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Garden Essence | The Waters (Bree, Spencer, Dominic, Mia, Bradley) | **OK.** 5 Sims fit 4 bedrooms. Hers: Library (by JemmaTheSimmer, Mia a child there) and “Sulani Save” (Mia a teen; they live at Brook Bungalow, which the plan gives the Bjergsens). | The Grunts (5), the Presleys (4) |
| Crick Cabana, with Dustin | Brandi and Beau Broke (from the older-games table) | **Fits** 2 bedrooms. It waits on her open question: Dustin alone, or with the Sigworths? There is a community upload: “Broke Family Sims 2” by Jessie2100 (needs nothing she lacks; delete its Dustin). | – |

**Lore:**
- On EA’s family tree, Skip Broke is Dustin’s father. In the plan he lives at Gibbi Point with the Addam Commune, so Brandi would be Skip’s ex (in the Sims 2 she is his widow).
- In the Sims 2, Brandi is the Newbies’ daughter. The Maxis Newbies are young adults, so that link can’t be used.
- “Rosebud Challenge” has a different Waters household (Jessica, Lily-Grace, Owen, Sophie). Don’t mix them up.

**Questions for her:**
- The Waters at Garden Essence? If so, from her Library copy or from “Sulani Save”?
- Brandi and Beau with Dustin, or Dustin alone or with the Sigworths?
- Raheem Downey (her Library, at Crick Cabana in “Sims Sessions”): wanted, or leave him out?

## Oasis Springs

**Homes in play:**
- Sandtrap Flat: 2 bedrooms, sleeps 4.
- Pebble Burrow: 2 bedrooms, sleeps 3.
- Vista Quarry Villa: 2 bedrooms, sleeps 5.
- Rio Verde Retirement Home: 2 spare units once the four Everyday Sims 4 elders have one unit each (6 bedrooms for 6 units).

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Sandtrap Flat | The Battles (Layne, Yahir, Haylee) | **Fails.** Not hers: there is no Create-a-Sim date in “Building #2”, and the proposal says so itself. | Henri Penkridge; Lola and Chloe Curious (from the older-games table) |
| Pebble Burrow | The Hassanis (Jamila, Omar, toddler Ahmed) | **OK.** Hers: Library (by JemmaTheSimmer), last changed in Create-a-Sim in May 2021. 3 Sims fit 2 bedrooms. They lived at Springscape in “Building #2”. | Henri Penkridge (his home in “Sulani Save”) |
| Vista Quarry Villa | The Whitlocks (Sawyer, Paris, Gladys, cats Nibbler and Nacho) | **Waits on her.** Changed in Create-a-Sim on 4 Oct 2025, so either hers or a townie she edited. They are in no Library copy, only “Building #2” and “Horses!”. They fit 2 bedrooms. | The Newbies |
| Rio Verde, 2 spare units | No firm pick: Helen Sparrow and Matteo Hamilton, or the Oldies | **Three households for two units.** The Oldies are a couple, so they would take one unit. | – |

**Corrected suggestion for Sandtrap Flat:** the Strangetown Singles.
- These are Lola and Chloe Curious, plus Erin Beaker and Kristen Loste if she keeps the whole upload. Four Sims fill its four sleeping places.
- The upload is “Singles From Strangetown” by brunamfp, and it needs nothing she lacks.
- Lola and Chloe are half-sisters of the Curious brothers and of Jenny Smith (Sims Wiki), who both live here.
- Or: the Beakers (2 adults and twin children), next to their old rivals the Curious brothers, as the older-games research suggests.

**Also:** if the Whitlocks aren’t wanted, the five Grunts would fit Vista Quarry Villa’s five sleeping places. That puts them in the desert, near the Smiths and the Curious brothers they feud with.

**Questions for her:**
- Are the Whitlocks hers?
- Should the Strangetown families (Grunts, Beakers, Singles) live here rather than in Henford and Ravenwood?
- Rio Verde’s spare units: Helen Sparrow and Matteo Hamilton, or the Oldies and one of them?

## Newcrest

**Homes in play:**
- Comfy Cubby: 2 bedrooms, sleeps 3.
- Fern Park Flats: **2** free units (4 and 5).
- Midtown Meadows: **3** free units (1, 3 and 4). The Kirklands own both buildings but live at Twin Oracle Point.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Comfy Cubby | The Newbies (Bob, Betty, dog Buddy) | **OK.** Maxis’s upload; she owns all its packs. | Vivian Little, Henri Penkridge |
| Fern Park Flats, one unit | The Barnes (Maria, Jeff, Felicia) | **OK.** Hers: Library (by MissTiquelle, the couple only), an old Gallery upload, and “Building #2” (with toddler Felicia). They lived here in “All Universities”. Not checked: which unit has 2 bedrooms (the Gallery counts 6 bedrooms for 5 units). | – |
| Midtown Meadows, one unit | The Fantasias (Frankie, Fliss, toddler Finlay) | **OK.** From “Wonder Child Challenge”, the only save with Finlay (keep it until they’re uploaded). Unit sizes not recorded (9 bedrooms for 5 units). | The Thorntons |

**Problem:** the proposal counts 1 free unit at Fern Park Flats and 2 at Midtown Meadows. There are 2 and 3.

**Questions for her:** who takes the other unit at Fern Park Flats and the other two at Midtown Meadows? Any Sim still without a home could, for example Vivian Little, Henri Penkridge or the Thorntons.

## Granite Falls
No homes, only vacation rentals.

## Magnolia Promenade
No homes.

## Windenburg

**Homes in play:**
- Rustic Residence (**missed by the proposal**): a tiny home with 1 bedroom that sleeps 2; built, shared, “1 Bed”, nobody named.
- UoW Hare Halls and Hedgehog Halls: empty dorms. Kamilla Jackson and Chris Whitmore live at Hare Halls in “All Universities” until they finish their degrees.

**The proposal’s statement:** “no free house”, so the Oldies, the Burbs and Kaylynn Langerak are all sent elsewhere.

**Corrected suggestion:** Luis Huerta at Rustic Residence.
- He is hers and on her list.
- It was his home in “Rotational” and “My Saved Game 2”.
- A single young adult fits 1 bedroom.

**Other Sims who would fit Rustic Residence:**
- Herb and Coral Oldie: Mary-Sue Pleasant’s adoptive parents, near her at Proprietor’s Square.
- Giovanni and Edith Prego: the Windenburg trailer couple.
- Kaylynn Langerak.
- Matteo Hamilton: the Get Together trailer elder.
- Polliana DeMure: Siobhan Fyres’ friend.

**Questions for her:**
- Rustic Residence: Luis Huerta, or a Pleasant-lore Sim (the Oldies or Kaylynn)? If Luis moves elsewhere, where?
- The Burbs (a couple and a baby) have no home in any case. Leave them out?

## San Myshuno

**Homes in play:** ten flats (two not built). Bedrooms are from her own 14 Oct count. Every flat has a first choice.

| Flat | First choice | Check | Alternatives |
|---|---|---|---|
| 1313 21 Chic Street (2 bedrooms; built, not shared) | Dayna and Alicia Ferrara | **Waits on her.** The Ferraras are hers (“Rotational”, where they live here). Her list has the same flat in mind for the Karaoke Legends. | – |
| 17 Culpepper House (1) | Clem Caldwell | **OK.** Maxis’s text: Dina Caliente’s hot-tub partner. Needs Adventure Awaits, which she owns. | Talia Mattera |
| 18 Culpepper House (2) | Arielle Hubbard | **OK.** Maxis’s text: Nina Caliente’s hot-tub flirt. | – |
| 19 Culpepper House (1) | Talia Mattera | **OK.** | – |
| 122 Hakim House (2) | Giovanni and Edith Prego | **Fits**, but the reason given is wrong: Windenburg does have a free home (Rustic Residence). | Patina Wainscot |
| Fraternity Apartment (3) | Game-time! (Danny Shino-Miller, Chad LeBouf) “plus one” | **OK.** The “plus one” isn’t named. | – |
| Sorority Apartment (3) | Patina Wainscot and Felicia Byers | **OK.** Needs Dream Home Decorator, which she owns. | – |
| 1010 Alto Apartments (3) | Get Famous Co-Stars | **OK.** | – |
| VIII Landgraab Apartments (not built) | Get Famous Trailer Cast | **Fits** once built. Six unrelated Sims, two of them teens. The Maxis dossier only rates it “maybe”. | Mimi and Dudley Landgraab (wait until her Malcolm is grown; the upload needs Vampires) |
| 888 Spire Apartments (not built) | Jordan Mayer and Jared Q | **OK.** | Moschino X Sims |

**Problems:**
- The 1313 clash (problem 7). The Karaoke Legends have no home. EA’s version is a young adult and a teen. Her “Rotational” version is the Kibo family (Akira, Juliana, baby Giancarlo) at 701 ZenView, with Darling Walsh living with Fabio Stracciatello at 702 ZenView.
- The Burbs’ suggested flats (the Sorority or Fraternity Apartment) are already first choices.
- Her plan labels 18 Culpepper House “1 Bed” and 19 Culpepper House “2 Bed”, but her own 14 Oct count is 2 and 1. Both picks are single Sims, so nothing breaks.

**Questions for her:**
- 1313 21 Chic Street: the Ferraras or the Karaoke Legends? Whoever doesn’t get it needs another flat. The only empty ones are VIII Landgraab and 888 Spire, both already picked and not built.
- Karaoke Legends: EA’s version or her “Rotational” one?

## Forgotten Hollow
Not owned (needs Vampires). Widowshild Townhome is parked. Vladislaus Straud, the Climates’ cousin, lives here in the plan.

## Selvadorada
No homes, only vacation rentals.

## Brindleton Bay

**Homes in play:**
- Bedlington Barn: 1 bedroom.
- Brindleton Boathouse: the game counts 0 bedrooms; it sleeps 2.
- Hound’s Head: a farm, not built.
- Chateau Frise: not built.
- Tail’s End Apartments: 3 free units (the Lynxes have one).

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Bedlington Barn | Gianni Faulk and his dog Yogi | **OK.** Hers: Library, last changed in Create-a-Sim in Sep 2020. They live in Brindleton Bay (Domus Familiaris) in three saves. | Miriam & Laika |
| Brindleton Boathouse | Life is Golden (Jay Bhatia, Kyra Anello, dog Lulu) | **OK.** A newly-wed couple and a dog. | The Climates |
| Hound’s Head | The Rosebud household (Rachel and Robin O’Brian, Yin Spirit, Bridgette Adams) | **OK.** Their home in “Rosebud Challenge” (keep it until they’re saved to her Library; Yin and Bridgette are only there). Four adults; the lot is 64×64 and not built. | – |
| Chateau Frise | The Climates (Arthur, Janine, teen Summer, toddler Nicolas) | **OK.** Needs Seasons, which she owns. Lore: an EA Seasons blog post says Arthur is Vlad Straud’s cousin (Sims Wiki). Vlad’s world isn’t owned yet. | The Simmons |
| Tail’s End, 3 units | Miriam & Laika; Sebastian Santos; one unit left spare | **OK** for single Sims. Unit sizes not recorded (5 bedrooms for 4 units). | – |

**Also:** Joaquin, the Heckings’ cat from the reveal trailer, could join the Heckings. He needs no home.

**Questions for her:** the spare Tail’s End unit: leave it, or give it to someone?

## Del Sol Valley
No free homes (Chateau Peak is for My Celebs). The Get Famous households go to San Myshuno instead.

## StrangerVille

**Homes in play:**
- Slip 42: **both** trailers are empty, 1 bedroom each. The Gallery counts 2 bedrooms in all, and unit 1 has 1.
- SU Plateau and SU Overlook: dorms, left for students.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Slip 42, unit 1 | Lena Garcia | **OK.** Hers. In “StrangerVille Playthrough” she has finished the mystery (keep that save until she’s saved to the Library). | – |
| Slip 42, unit 2 | – | **Open.** The proposal missed it. | – |

**Note:** the Strangetown families still have no house here. The second trailer fits only one or two Sims.

**Questions for her:** who takes the second trailer, if anyone?

## Sulani
This is her own split job, so it wasn’t checked further. The proposal is right that Keoni Kalawai’a and Alana Hekekia live at Caldera Camp in “Sulani Save”.

## Glimmerbrook

**Homes in play:**
- Glimmerbrook Watch: 1 bedroom.
- Creek Side Corner: 3 bedrooms.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Glimmerbrook Watch | Ash Carrington | **OK.** Hers. He lives here in “It’s Magic!” as a Spellcaster (Realm of Magic, which she owns). Keep that save until he’s saved to the Library. | – |
| Creek Side Corner | Realm of Magic Sages (Tess Dyer, Keisha Hughes, Ethren Reyes) | **OK.** Three Sims for three bedrooms. Maxis’s text calls them the retired sages. | The Deckers |

**Note:** in “Building #2” Glimmerbrook Watch is lived in by Lilah Hare, a game-made townie. There is no clash.

**Questions for her:** Ash at Glimmerbrook Watch, or moving in with someone (her 28 Oct note)?

## Britechester

**Homes in play:**
- Spring Steppes: unit 2 is free.
- Drake Hall: an empty dorm.
- Tidal Tower and Mossy Lane: dorms, left for students.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Spring Steppes, unit 2 | The Deckers (Gabrielle, Zoey, Aiden) | **OK.** Hers: Library (by MsTiquelle), “Rotational” and “Sulani Save”. They lived at Honeydew Fields, now the Britechester B&B. Not checked: unit 2’s bedrooms (8 bedrooms in all; 3 Elderberrys in unit 1, the 2 Pleasant twins in unit 3). | – |
| Drake Hall | Discover University Squad (5 young adults) | **Fits** the 8 bedrooms. Not checked: whether the game lets Sims who aren’t enrolled move into a dorm. The wiki only says Sims must be teens or older. Enrolling them at the University of Britechester first is the safe route. | – |

## Evergreen Harbor

**Homes in play:**
- Stonestreet Apartments #4: 1 bedroom.
- Pinecrest Apartments #402: 2 bedrooms in “Building #2”; built, not shared.
- Rockridge Springs: units 2 and 3. The Gallery counts 7 bedrooms in all, and unit 1 has 2.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Stonestreet #4 | Henri Penkridge | **OK.** Hers: Library (by MissTiquelle and MsTiquelle). | Vivian Little |
| Pinecrest #402 | Vivian Little | **OK.** Hers: Library, last changed in Create-a-Sim in Mar 2023. | – |
| Rockridge Springs, units 2 and 3 | Brody Conklin, “if yours” | **Fails.** Not hers (no Create-a-Sim date). He lived at Rustic Residence, Windenburg, in her saves. | Fair-weather Friends (4 young adults) |

**Corrected suggestion:** Fair-weather Friends in one unit, if it has room. The unit sizes aren’t recorded. The other unit stays open.

**Questions for her:** Fair-weather Friends, or someone else, for Rockridge Springs?

## Mt. Komorebi

**Home in play:** 2-4-3 Wakabamori (already decided: Kenji Mikami and Kumiko Aoki).

**Correction:** her build has **2 bedrooms** (her Gallery upload and “Building #2”), so they don’t have to share. The proposal’s one double bed is EA’s original house, which is still in the new save. Their source is “Snowy Escape” (keep it until done).

**Note:** Maxis’s Snowy Escape Trailer Sims (a strong lore pick) have no free home here.

## Henford-on-Bagley

**First, a question that decides three homes:** on 16 Oct she kept The Bramblewood’s empty lots (13 and 14 Nettle Lane, and Cordelia’s Secret Cottage) for a fairy area once she has Enchanted by Nature (TODO.md). Is that still the plan?

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Cordelia’s Secret Cottage (2 bedrooms) | Faye Evergreen’s household (Faye, Izabella Crawley, baby River, cat Squee) | **OK.** Their home in “Season Events”, where Faye is in her Library (June 2025). It suits the fairy plan. Becoming a fairy needs Enchanted by Nature. | – |
| The Olde Mill (“1/2 Bed Big”; built, not shared) | Ralph Osbourne | **OK** for one adult. Bedrooms not checked: the new save has EA’s house there. | – |
| 1 Cobblebottom Street (small business, 1 bedroom in “Building #2”) | Lavina and Rahul Chopra | **Tight.** A mother and her teenage son need a second bed. Unknown whether Henford gets a new mayor and grocery deliverer once they’re played. She chose on 16 Oct to leave them homeless; that was reopened on 28 Oct. | – |
| 13 Nettle Lane (not built) | The Thorntons | **Waits on her:** the fairy area, and they are also the first choice at Manzanita Terrace. | The Hawleys |
| 14 Nettle Lane (not built) | The Grunts | **Waits on her:** the fairy area. The lore research puts them in the desert. | The Wainscots |

**Note:** the “100 Babies house” for 13 Nettle Lane is tagged for Hallow Slough in Willow Creek. That is part of the Cadberry job, which is left for later.

## Tartosa
Not owned (needs My Wedding Stories).

## Moonwood Mill
Not owned (needs Werewolves).

## Copperdale
No free homes.
- **Liam Beckett** joining Sporty Boys: fits, and his link to Sidney Price checks out. He is a teen, so a teens-only household needs MCCC (as Sporty Boys already does).
- **“Chill Out with Friends”** for the Nerdy teens: six teens and only one young adult, so the same MCCC point applies.

## San Sequoia

**Homes in play:** Manzanita Terrace, **3** free units, 3 bedrooms each.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Manzanita, a unit | The Thorntons (Trevon with Summer, Michael and Davon) | **Waits on her:** also the first choice at 13 Nettle Lane. They are hers (Library; four Sims in “Building #2”) and fit 3 bedrooms. | The Keyes |
| Manzanita, a unit | Kyle Kyleson | **OK.** EA’s Growing Together townie. | – |
| Manzanita, a unit | – | **Open.** The proposal counted only 2 units. | – |

**Corrected suggestion for the third unit:** Sebastian Michaelson.
- He is on her list, an elder, and Celeste’s father (Maxis’s text).
- Or he could move in with the Michaelsons at 7 Eucalyptus Lane (50×40, not built).

**Questions for her:** where do the Thorntons go? Does Sebastian Michaelson get his own unit, or live with Celeste?

## Chestnut Ridge

**Homes in play:**
- Red Roan Farm: “Mine”, 4 bedrooms. Only her test Sim Louisa lives there in any save. **Open.** The proposal says Chestnut Ridge has “no free homes”, but it also says this farm is “still open”.
- Appaloosa Stables: “Horse Elder Couple”, 2 bedrooms.

| Home | First choice | Check |
|---|---|---|
| Appaloosa Stables | Yanaha and Sani Acothley | **OK.** In her Library (Feb 2026) and living here in “Building #2”. Both are adults, so she’d age them to elders. |
| Red Roan Farm | – | **Open.** The older-games research has some Appaloosa Plains horse families, but most have no good Gallery copy. |

**Questions for her:** who are “Mine” at Red Roan Farm?

## Tomarang

**Homes in play:**
- Taka Soi 15, unit 08: 1 bedroom, Great Soil and Bracing Breezes.
- Sungai Point, unit 11C: 2 bedrooms, Spooky and Mold.

Neither unit is set aside for For Rent tenants anywhere in her plan.

**Suggestion:** Merrilyn Ralston for unit 08 (Gibbi Point is next to Tomarang on her map), if she isn’t moving in with the Chavez-Ralstons.

Isda Riverfront (the Cadberrys and the Rochanas) is left for later.

**Questions for her:** fill 08 and 11C, or leave them empty?

## Ciudad Enamorada
Not owned (needs Lovestruck).

## Ravenwood

**Homes in play:**
- Old Ravenwood Estate: haunted, 50×50, not built.
- Hay Hill Landing: a farm, 64×64, not built.
- The Cozy Casket House: haunted, not built.
- Specter Row: not built, still undecided.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Old Ravenwood Estate | The Beakers, without Nervous Subject | **Fits.** Nervous Subject really is her Nyon Specter (Sims Wiki). Lore: the research and her map point to the desert instead. | The Dragostes |
| Hay Hill Landing | The Dragostes (7) | **OK.** They need 5 bedrooms. | – |
| The Cozy Casket House | The Grimterns (Cortez is a ghost) | **OK.** | Edward Talon-Crow and Fulov Pepp |
| Specter Row, a unit | Ophelia Specter | **Waits on her.** It only works if Specter Row becomes a rental. Maxis’s text says Ophelia fell out with her Aunt Olive. | Edward Talon-Crow and Fulov Pepp |

**Questions for her:** the Beakers here, or in the desert? Specter Row: a rental or a Haunted House?

## Nordhaven

**Homes in play:**
- Canalside Daycare: a small business, 2 bedrooms.
- Old Torget House: **3** free units, 3 bedrooms each.

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| Canalside Daycare | The Branches | **Weak fit.** Their trade is tattoos and pottery, not childcare. The owner is still a “Decide” on her list; the earlier idea is the Koopmans’ daughter. | – |
| Old Torget, a unit | The Hoffmans | **OK.** Their feud with the Lodens works well: Koffieboon is also in Gammelvik. | – |
| Old Torget, a unit | The Presleys (4) | **OK.** Hers (Library). They fit 3 bedrooms. | Ink & Clay; the Ellsworths (not hers) |
| Old Torget, a unit | – | **Open.** The proposal counted only 2 units. | – |

**Suggestion for the third unit:**
- Ink & Clay: three Sims for three bedrooms.
- Or Corey Nyhus and Zain Amri, who the EA research says would suit a spare unit as a pair.

**Questions for her:** who owns Canalside Daycare? Who takes the third Old Torget unit?

## Innisgreen
Not owned (needs Enchanted by Nature).

## Gibbi Point

**Home in play:** Paradise Stables, “? (Horses!)”, kept for a horse family. Nobody lives there in any save.

**Problem:** Merrilyn Ralston, Nigel’s mother, has no home. Her upload is the young flashback version, so she would be aged up first.

**Options:**
- Move her in with the Chavez-Ralstons at Wanderwood Wonder (30×20, not built; 4 people becomes 5).
- Paradise Stables.
- Tomarang unit 08.

**Questions for her:** where does Merrilyn live? Is Paradise Stables still kept for a horse family?

## Ondarion

**Homes in play:**
- 17 Bright Cliff: not built.
- 13 Lakeview Apartments: not built.
- Casa Do Corsário: the spare unit (not built).

| Home | First choice | Check | Alternatives |
|---|---|---|---|
| 17 Bright Cliff | Akachi Onoja | **OK.** EA’s premade, dating Jawara Darong. | Connie Fidential (her aspiration in the game files is the Vampires pack’s Master Vampire; not checked what the game does without that pack) |
| Casa Do Corsário, spare unit | Fia Acosta | **OK.** She is hidden, so moving her needs MCCC, which is now updated (30 Oct). | 17 Bright Cliff |
| 13 Lakeview | Irina Rattus | **OK.** She is a Maxis Gallery Sim, not an EA premade. | Akachi Onoja |

**Problem:** Hermia Capp and Kent Capp are also pointed at these two flats. The suggested Hermia upload is a teen.

**Questions for her:** Hermia and Kent Capp: bring them in, and if so, does Hermia join Tybalt’s household? Is Connie Fidential wanted at all?

---

**Sources:**
- Her plan: `data/worlds/*.json`, `data/people.json`.
- Her Gallery: `data/gallery/uploads.json`.
- `TODO.md`: the rentals table (§2), the 14 Oct flat count, the 16 Oct Bramblewood note, and the Haunted House notes.
- `research/saves-review.md`, `research/rentals-next.md`, `research/new-save-status.md`, `research/data/new-save-status.json`, `research/business-ideas.md`.
- The three overnight research files: `research/maxis-gallery-households.md`, `research/ea-premades-not-on-plan.md`, `research/past-game-lore-families.md`.
- `research/data/premades.json`, `research/data/overnight/maxis-items.json`.
- Her saves and Library, read today from temporary copies: households, home lots, Create-a-Sim dates and lot bedroom counts.
- The Sims Wiki: cached pages, plus “Dormitory” and “Skip Broke”.
