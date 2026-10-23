# New save: how to build it (22–23 Oct)

> **Corrections from the first night in the new save (24 Oct; research/rentals-and-apartments-placing.md, research/new-save-glitches.md, tools/research/new_save_check.py):** a placed lot brings its own uploaded type, so setting the empty lot's type first doesn't help: check the type after placing (Carpophagous Corner came in as Residential). Unit traits often don't survive placing (copied from unit 1, or shifted): set them after. The "content not owned" warning was false on every lot checked. Households from the Library keep family links only with Sims in the same household.

**At a glance**
1. Set the options first (Neighbourhood Stories Move In/Out off, ageing, 28-day seasons), then heart and evict premades, then place lots, then move households in.
2. Before placing a lot, set the empty lot’s type to your plan’s type. Rentals need this most: the game won’t turn a lot into a Residential Rental for you.
3. Expect to retype rental unit names and probably unit traits; check lot traits on a test lot before doing all 169.
4. Of 359 lots in your 25 owned worlds, 169 are on the Gallery, 27 are built but not shared, 163 aren’t built yet. 141 households to place (101 EA, 23 yours, 16 still without Sims, 1 NPC).
5. 15 uploads would bring the wrong type (mostly Vacation Rentals the Gallery saves as Residential); the list is in §4.

Report only. Nothing in `data/`, the site, your saves or the game was changed. The checklist to follow in game is `for-jemma/new-save-checklist.md`.

**Sources and limits.** Your plan (`data/worlds/*.json`, `data/groups.json`, `data/calendar.json`) and Gallery data (`data/gallery/uploads.json`, refreshed 21 Oct). Earlier notes here: `game-options.md`, `rental-units.md`, `rentals-and-apartments.md`, `small-business-check.md`, `holidays-in-saves.md`, `getaways-check.md`, `data-check-up.md`. Web research on 22 Oct 2026. Reddit couldn’t be searched. Most EA forum and Answers HQ pages, the Sims Wiki and EA Help wouldn’t open, so claims from them come from search excerpts and are marked “reported”. I checked the 22 Sep 2026 patch notes directly. No EA page says exactly what a Gallery lot keeps, so §2 is partly player reports.

---

## 1. Starting the save

- **New Game always starts in Create a Sim.** No source says you can skip making a household. Usual way: make a throwaway Sim (or pick a Library household), move it onto a lot you won’t touch for a while, then use Manage Worlds. Move it out at the end. (Carl’s rotational play guide, undated: https://www.carls-sims-4-guide.com/tutorials/rotational-play.php)
- **Manage Worlds lets you place and move households without playing them** (EA forum, undated, reported: https://forums.ea.com/discussions/the-sims-4-gameplay-en/how-to-add-sims-to-world-wo-having-to-play-them/8575253).
- **Options are saved per save.** Set them in the new save before anything else (`game-options.md`). Most important early: Neighbourhood Stories Move In and Move Out off for Other Households. Otherwise the game refills the homes you empty while you’re working.
- **Order from a 2026 setup guide** (TheSimsTree, 13 May 2026: https://www.thesimstree.com/en/blog/the-sims-tips/sims-4-new-save-setup-settings,-mods-and-best-practices.html): options, then season length and holidays, then households and lots. It also says to save before each Gallery lot, and to leave protected lots alone (e.g. Tomarang’s rental housing).

## 2. Placing Gallery lots: what comes with them

**How:** Manage Worlds → pick the lot → Gallery (or My Library) → **Place Lot** (stay in Manage Worlds) or **Place Lot and Edit**. Then choose furnished or unfurnished. A lot can’t go on a smaller lot. (EA Help, “The Sims 4 Gallery”, undated, reported: https://help.ea.com/en/help/the-sims/the-sims-4/the-sims-4-gallery/)

**Gallery or Library first?** No source says the result differs. Downloading to your Library first is a good idea anyway: the copy stays if an upload is ever removed, and it’s quicker to find.

| Part of the lot | Comes with it? | Source |
|---|---|---|
| The build and furniture | Yes, if you choose furnished. Object upgrades and “Made by” tags are lost | EA forum, undated (reported) |
| Lot type (venues) | **Better since 22 Sep 2026:** “Gallery placement now saves the selected venue type and refreshes the cached lot information”; Wedding Venues no longer land as Residential. Before that, placing often kept the world’s old type | [Patch notes, 22 Sep 2026](https://simscommunity.info/2026/09/22/the-sims-4-update-sep-22-26-release/) (checked); [older EA thread](https://forums.ea.com/discussions/the-sims-4-gameplay-en/placing-community-lots-from-gallery-doesnt-retain-lot-type/8583986) |
| Vacation Rental | **No:** these uploads say Residential (11 of yours) | `data-check-up.md` |
| Residential Rental | **Not unless the lot is already one.** Set the empty lot to Residential Rental, save, then place. Otherwise units load empty and bedroom/bathroom counts reset to 0 | [EA forum](https://forums.ea.com/discussions/the-sims-4-gameplay-en/cannot-place-residential-rental-lots-without-changing-the-lot-type-manually/8741518) (reported) |
| Rental unit names | **Reported lost:** the lot name and unit names go back to the game’s; “all information about the units” goes | [Answers HQ bug report](https://answers.ea.com/t5/Bug-Reports/FR-R-Rental-lot-names-and-details-revert-to-default-when-saved/td-p/13895333), about 2024 (reported; no fix found in patch notes) |
| Unit traits and challenges | Not confirmed either way: test | – |
| Lot traits and challenges | Not confirmed by any source: test | Carl’s lot traits page (undated) |
| Small business setup | **No.** A business belongs to a Sim and is set on a lot in the business panel. Re-placed business lots often say “not the registered business on that lot”. Set it up again after placing | [EA Help](https://help.ea.com/en/articles/the-sims/the-sims-4/how-to-set-up-a-small-business/) (reported); [EA forum 2025–26](https://forums.ea.com/discussions/the-sims-4-gameplay-en/cant-move-small-business-to-a-new-sb-lot/12010174) (reported) |
| Custom Venue settings, Haunted House, Tiny Home | Not found: check each after placing | – |
| Club hangouts | Not found whether a hangout survives its lot being replaced: re-set them at the end | Sims Wiki, Club (undated) |
| Owner or landlord | No: lots upload without households | – |

**Apartments** (San Myshuno, Evergreen Harbor): only rooms can be placed, never a whole lot. Your 13 apartment uploads are Rooms, so that’s fine. Some units (e.g. 630 Medina Studios, 19 Culpepper House) refuse rooms that touch the shared wall. Leaving a one-tile gap along that wall fixes it. (EA forum, undated, reported: https://forums.ea.com/discussions/the-sims-4-gameplay-en/630-medina-studios-not-placing-correctly-cl/8589896)

**Occupied lots:** a lot placed over another “will replace whatever is on the existing lot” (Prima guide: https://primagames.com/eguides/the-sims-4-eguide/sharing/the-gallery). No source says what happens to the residents. Safest is to move or evict them first.

## 3. Households

- **Evict vs Move** (SimsCommunity Manage Worlds guide, 27 Sep 2023, updated 16 Jan 2025: https://simscommunity.info/2023/09/27/the-sims-4-manage-worlds-guide/):
  - **Evict:** the furniture stays on the lot, the household keeps its money plus the home’s value, and becomes homeless but stays in the save.
  - **Move:** pick a new home, and sell or keep the furniture (kept furniture goes to the household’s inventory).
  - Neither breaks relationships. That’s inferred: no report says otherwise.
- **Homeless households are culled first** (`game-options.md` §2). Heart them (“Move into My Households”) **before** you evict them.
- **Keep EA premades inside the new save.** Don’t save them to the Library and put them back. Households that go through the Library keep only the relationships inside the household; links to other households are lost (several forum reports; TheSimsTree, 23 Feb 2026: https://www.thesimstree.com/en/blog/the-sims-tips/how-to-move-your-legacy-to-a-new-save-in-the-sims-4-complete-guide.html).
- **Your own households come from your Library or the Gallery** (Manage Worlds → lot → Move In → My Library). They’ll lose links to Sims in other households: the Cadberrys across worlds, the Kirklands and their tenants, and friends. Sources disagree on whether skills and careers survive: TheSimsTree says they “can be lost”, forum posts say they stay. Test one household.
- **Clubs, dynasty and occult details through the Library:** not found. Assume club membership and dynasty must be set again in game; check one.
- **Patch fixes that matter:** Partner or Spouse no longer flips after Create a Sim (30 Jun and 22 Sep 2026, the second checked). Fixes to missing family tree links, and children of premade dynasties now join them automatically (12 May 2026, SimsCommunity, reported).

**Splits and merges your plan needs** (from `tools/premade_import.py` and TODO, 18–19 Oct). Do them in Manage Households before moving anyone:

| World | Game household | Your plan |
|---|---|---|
| Newcrest | BFF (Scott, Lee, Holiday) | Three households: Holiday unit 1, Lee unit 2, Scott unit 3 at Fern Park Flats |
| Del Sol Valley | Roomies | Four: Kalani 1, Huntington 2, Patel 3, Richards 4 at The Inner Circle |
| Del Sol Valley | Eclectic Arts | Three: Eggleston 1, Martin 2, Holland 3 at Upland Trailer Park. Johnny Zest (from Oasis Springs) unit 4 |
| Oasis Springs | Caliente | Don Lothario moves out to Agave Abode |
| Evergreen Harbor | Greenburg (Ecomaster) | Knox Greenburg lives apart |
| Tomarang | Sadya Linh and Linh families | Merged as “Linh-Sadya & Linh” |
| Ondarion | Alto | Enzo Alto on his own |

Renamed by you, the same EA household: Free Spirits (Bohemian), Monticapp (Monty), Feng (Hu), Bro & Kennedy (Bro; Kennedy still to come).

## 4. Uploads that would bring the wrong type

Set the type by hand after placing (or set the lot first, then place). Most are known (`data-check-up.md`); none needs a re-upload unless you want the Gallery to match.

| World | Lot | Upload | Gallery says | Plan says | What to do |
|---|---|---|---|---|---|
| Granite Falls | Campground | “Campground” `CteLgi2OSyWWdZNQihdhuQ==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Granite Falls | Green Getaway | “Green Getaway” `rMPNtHy3EeiDtMw4VFS7Iw==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Granite Falls | Lakeside Retreat | “Lakeside Retreat” `3tN9AgwwEeeHSemJWRDrbA==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Selvadorada | Hillside Hideaway | “Hillside Hideaway” `335sZpKTEeyL94KVX4KDoA==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Selvadorada | Selvadorada Villa | “Selvadorada Villa” `ofQVeJT5EemF/FunJjefig==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Selvadorada | Jungle Bungalow | “Jungle Bungalow” `3nHPkj3IEemMPXldy2Ruvw==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| StrangerVille | Carpophagous Corner | “Carpophagous Corner” `90dWb5T5EemIVFunJjefig==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Sulani | Lagoon of Love | “Lagoon of Love” `qgIHHu1NEeqKTiQfmaYcsw==` | Park | Vacation Rental | Upload says Park |
| Glimmerbrook | Glimmer & Books | “Glimmer & Books” `+aNzE+BWEeyIaxrwo9vsUA==` | Library | Backroom | Upload says Library |
| Glimmerbrook | The Magic Realm | “The Magic Realm” `PopQBuBAEeyONXVMsZWocA==` | Generic | The Magic Realm | Upload says Generic |
| Britechester | Mossy Lane | “Mossy Lane” `+1TuKO1OEeqP5iQfmaYcsw==` | Residential | University Housing | Upload says Residential: set University Housing by hand |
| Evergreen Harbor | Rockridge Springs | “Rockridge Springs” `7qor1/qySJOuKuOZ5Tq/Tg==` | Residential | Residential Rental (3) | Upload says Residential, not a rental: set Residential Rental first, then make the units |
| Mt. Komorebi | 5-1-1 Kiyomatsu | “5-1-1 Kiyomatsu” `DalrQoxKT2WT8gFfb+JCuA==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Mt. Komorebi | 5-1-2 Kiyomatsu | “5-1-2 Kiyomatsu” `N+vsiXPfSiyLfiA9VWRa3Q==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |
| Chestnut Ridge | Big Sky Reach | “Big Sky Reach” `W6J+tA4mQGS/Zrj6G+qdpw==` | Residential | Vacation Rental | Upload says Residential (the Gallery drops Vacation Rental): set the type by hand |

Also:
- **Backroom, Community Space and Recreation Center uploads** show no type name on the Gallery (a newer type the Gallery can’t name). They should keep their type, but check each.
- **Rentals with two copies** (rental and regular): place the rental one. It leads on the site, and the checklist names it.

## 5. Holidays, clubs and dynasties

- **Holidays belong to one save.** A new save has the game’s four. They can’t be copied between saves or shared on the Gallery; the only shortcut is a blank “starter” save kept with the calendar already set (EA forum feature request, reported: https://forums.ea.com/discussions/the-sims-4-feedback-en/%F0%9F%97%93%EF%B8%8F-please-let-us-globally-save-custom-calendars--holidays--ui-fixes/13569185; SimGuru Q&A, 14 Jun 2018: https://simscommunity.info/2018/06/14/the-sims-4-seasons-simguru-qa-part-5/).
- **Set Season Length to 28 days first.** The game moves holidays when the length changes.
- **Your plan’s holidays** (`calendar.json`, from Rotational, a stand-in): Flower Festival (spring wk 1 Sat, day off), Love Day (spring wk 2 Tue, replaces Love Day), Summer Celebration (summer wk 1 Sat, day off), Dia De Los Muertos (autumn wk 1 Sun), Bonfire Night (autumn wk 1 Fri), HarvestFest (autumn wk 2 Sun, day off, replaces Harvestfest), Yuletide (winter wk 2 Sun, day off, replaces Winterfest). Keep the game’s New Year’s Eve. The site’s weeks start on Monday and the game’s on Sunday (`holidays-in-saves.md`), so a “Sun” holiday is the first day of that week in game. Traditions aren’t in the plan: set them as you like.
- **Clubs:** no way to carry clubs between saves was found. The game’s premade clubs (Get Together) come with a new save. After the lots are in, set the hangouts as in your plan (`groups.json`): Avant Gardes → Pixel Café (game’s South Square Coffee); Garden Gnomes → Magnolia Blossom Park; Knights of the Hedge → Von-Haunt Estate (not built yet); League of Adventurers → Courtyard Lane Playground (game’s Pique Hearth); Paragons and Renegades → Magnolia Mall (The Roadstead); Powerhouse → Skye Fitness; The Good Timers → The Shrieking Llama; Upper Crusts → any Restaurant (Willow Creek); Spin Masters → Stargazer; Partihaus → La Discotheque (game’s Bathe de Rill). Hangouts set to a lot type are reported buggy on Generic lots.
- **Dynasties** (Royalty & Legacy): the premade ones come with the game. Check each against the site (Goth, Landgraab, Darong, Thebe, Abrantes, Alto, Capp: ideals, prestige, allies, rivals), and turn Prestige Decay off (`game-options.md` §7).

## 6. Backups and known bugs

- **Backups:** the game keeps `.ver0`–`.ver4` (the last five saves) and, since 12 May 2026, also copies from about a month, a week and a day ago. Load screen → Recover Save restores one. (EA forum backup guide, undated: https://forums.ea.com/blog/the-sims-game-info-hub-en/backing-up-saves-in-the-sims-4---keep-your-sims-safe/12913482; patch notes 12 May 2026, reported.)
- **Your habit:** Save As a new name at each stage (“Sim World 01 options”, “02 Willow Creek”…). Also copy the whole `Saves` folder and the `Tray` folder (your Library) somewhere safe now and then.
- **Save before each Gallery lot.** 30 Jun 2026 fixed endless loading when placing some Gallery lots built with heavy placement cheats (SimsCommunity, reported: https://simscommunity.info/2026/06/30/sims-4-update-june-30th-patch-notes/). An October fix is rumoured but unconfirmed.
- **Autosave** (21 Jul 2026, reported): Game Options → Save Settings, works while building. Early bugs (wrong slot, unnamed saves) were fixed on 6 Aug and 22 Sep 2026 (the second checked).
- **Rentals:** corrupted rental lots (lots vanishing, Error 800/801) were reported in Feb 2025 and fixed on 21 Jul 2026 (KeenGamer, 22 Jul 2026, reported). Avoid switching a lot between Rental and Residential back and forth: that’s the usual cause of a lot type stuck on “business lot”.
- **Small businesses on old rental lots** may not register: a known issue (EA forum, reported).

## 7. Recommended order

1. **Back up** `Documents\Electronic Arts\The Sims 4\Saves` and `Tray`.
2. **New game:** a throwaway household on a lot you’ll do last. Save As “Sim World 00”.
3. **Options** (`game-options.md` summary table), Season Length 28 days, Maximum Sim Count. Save As.
4. **Holidays** in the Calendar (live mode). Save As.
5. **Test lot and test household** (one rental, one venue with traits, one of your households from the Library). Note what was kept and tell Claude: the checklist can then drop the lines you don’t need.
6. **World by world in your order:**
   1. Heart every planned household in the world.
   2. Split or merge households (§3).
   3. Evict or move households off lots being replaced.
   4. Set each lot’s type, place it, then check type, traits, challenges and units.
   5. Move households in (tenants into their units).
   6. Set up small businesses.
   7. Save As.
7. **Clubs’ hangouts and dynasties** (§5).
8. **Last:** move out the throwaway household. Check Neighbourhood Stories again, and tell Claude, who can re-read the new save (holidays, lot traits, units, households) with the existing tools.

**Why this order:** options first stop the game refilling empty homes while you work. Hearting before evicting protects homeless premades from culling. Setting the type before placing avoids the rental and venue type problems. Households go in after their homes, so nothing gets replaced under them. Clubs go last because their hangouts point at lots.

**Lots not on the Gallery yet:**
- **27 are built but not shared.** Open your Building save, save each one to your Library, then place it from there. Or share it first, so the site links it too: your call.
- **163 aren’t built.** Leave the game’s lot for now. If an EA family lives there in your plan, they can stay in the game’s house until you build.

## 8. Per world (owned worlds)

| World | Lots | On the Gallery | Built, not shared | Not built | Households to place |
|---|---|---|---|---|---|
| Willow Creek | 22 | 13 | 1 | 8 | 12 |
| Oasis Springs | 22 | 18 | 1 | 3 | 9 |
| Newcrest | 15 | 14 | 0 | 1 | 9 |
| Granite Falls | 7 | 5 | 0 | 2 | 0 |
| Magnolia Promenade | 8 | 2 | 1 | 5 | 1 |
| Windenburg | 27 | 13 | 5 | 9 | 7 |
| San Myshuno | 30 | 14 | 2 | 14 | 12 |
| Forgotten Hollow (not owned) | 5 | – | – | – | – |
| Selvadorada | 8 | 5 | 0 | 3 | 0 |
| Brindleton Bay | 16 | 10 | 0 | 6 | 4 |
| Del Sol Valley | 12 | 8 | 0 | 4 | 11 |
| StrangerVille | 12 | 2 | 5 | 5 | 3 |
| Sulani | 14 | 10 | 1 | 3 | 5 |
| Glimmerbrook | 6 | 5 | 0 | 1 | 2 |
| Britechester | 13 | 13 | 0 | 0 | 4 |
| Evergreen Harbor | 15 | 6 | 2 | 7 | 7 |
| Mt. Komorebi | 17 | 6 | 1 | 10 | 3 |
| Henford-on-Bagley | 12 | 3 | 3 | 6 | 5 |
| Tartosa (not owned) | 9 | – | – | – | – |
| Moonwood Mill (not owned) | 5 | – | – | – | – |
| Copperdale | 12 | 2 | 2 | 8 | 8 |
| San Sequoia | 12 | 5 | 0 | 7 | 5 |
| Chestnut Ridge | 13 | 5 | 0 | 8 | 7 |
| Tomarang | 9 | 2 | 1 | 6 | 6 |
| Ciudad Enamorada (not owned) | 13 | – | – | – | – |
| Ravenwood | 14 | 1 | 1 | 12 | 4 |
| Nordhaven | 12 | 4 | 0 | 8 | 5 |
| Innisgreen (not owned) | 14 | – | – | – | – |
| Gibbi Point | 13 | 3 | 1 | 9 | 3 |
| Ondarion | 18 | 0 | 0 | 18 | 9 |
| **Owned worlds** | **359** | **169** | **27** | **163** | **141** |

Not owned (46 lots): Forgotten Hollow, Tartosa, Moonwood Mill, Ciudad Enamorada, Innisgreen.

## Appendix: every upload to place, with its Gallery id

Search in game by title (with creator JemmaTheSimmer). The id is the end of the Gallery web link. Community Space lots list every version, so pick one.

**Willow Creek**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Willow’s | “Willow’s” | `qJHM+ODxEeaFuql4la3fHw==` | Restaurant |
| Streamlet Single | “Streamlet Single” | `ZkIsQakfEeuDv/wg9JDtjA==` | Residential |
| Crick Cabana | “Crick Cabana” | `2giAjpTyEemJ3lunJjefig==` | Residential |
| Daisy Hovel | “Daisy Hovel” | `fUcTYJT3EemHwlunJjefig==` | Residential |
| Garden Essence | “Garden Essence” | `bbq1/qh3EeuCcfwg9JDtjA==` | Residential |
| Potters Splay | “Potters Splay” | `BPJCMI95EeiLGX32EHttrg==` | Residential |
| Riverside Roost | “Riverside Roost” | `QRrjnco2EeuNga3kS5H9ag==` | Residential |
| Courtyard Lane Playground | “Courtyard Lane Playground” | `vOvZf6/kT+qX4dUGnWHUqw==` | Playground |
| Rindle Rose | “Rindle Rose” | `zDXCdVD6R0qgz6j/cCBarg==` | Residential |
| Oakenstead | “Oakenstead” | `IY91nQcwEeqP3/Ao7taYVg==` | Residential |
| Municipal Muses | “Municipal Muses” | `3uTcvsTNEeeHdWHJsaQqWQ==` | Museum |
| Café Llama | “Café Llama” | `P5LkNP5KRd+K9PSzz+WEvQ==` | Café |
| Magnolia Blossom Park | “Magnolia Blossom Park” | `Py7Ecqn9EeuLTucawTB/JA==` | Park |

**Oasis Springs**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Sandtrap Flat | “Sandtrap Flat” | `k+ArWsHmEe2CoYnwBMy2Ww==` | Residential |
| Nookstone | “Nookstone” | `UZsaW3zJSzmBiMnwHmQ0Kw==` | Residential |
| Pebble Burrow | “Pebble Burrow” | `wa3+U+DCEemKKyZ9R8et5A==` | Residential |
| De Costadas | “De Costadas” | `mItnq8rfRW2dSUiQsM1RIw==` | Restaurant |
| Agave Abode | “Agave Above” | `y+FpyTStEeqB4aX7uid5MQ==` | Residential |
| Vista Quarry Villa | “Vista Quarry Villa” | `D3pjU723EeuN9fwg9JDtjA==` | Residential |
| Raffia Quinta | “Raffia Quinta” | `Vstuj6QyEe2MBonwBMy2Ww==` | Tiny Home Residential |
| Springscape | “Springscape” | `hYfhA752EeuOnL8NB92BJw==` | Residential |
| Palm Springs Public Pool | “Palm Springs Public Pool” | `T4xX5K02EeuEt01o44QF8A==` | Pool |
| Granada Place | “Granada Place” | `91JnkAJZEeuMZ399sA1LjA==` | Residential |
| Lotus Ridge Spa | “Lotus Ridge Spa” | `k9wU7gLyEe2GTnUsHjDJmA==` | Spa |
| Sultry Springside | “Sultry Springside” | `wPMUJgKdEeuGMnCrzml8yA==` | Residential |
| Rio Verde Retirement Home | “Rio Verde Retirement Home” | `MEKP5ok7QxmPVa2JI2GTNg==` | Residential Rental |
| The Futures Past | “The Futures Past” | `5cWe2q4DEeuJE01o44QF8A==` | Museum |
| Oasis Springs Library | “Oasis Springs Library” | `X3UEJms3EeeEnaGw/5dQ7w==` | Library |
| Burners & Builders | “Burners & Builders” | `IfhanfMkEeeNZDTk/zkpCA==` | Gym |
| Rattlesnake Juice Bar | “Rattlesnake Juice Bar” | `SIZIFmaSR2quQEzJQQ9HUA==` | Bar |
| Desert Bloom | “Desert Bloom” | `7rH4P51KEeuKxvwg9JDtjA==` | Park |

**Newcrest**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Fern Park Flats | “Fern Park Flats” | `RiP+5wQ8RJK3hotf53yaQw==` | Residential Rental |
| Newcrest Community Space | “Newcrest Community Market” | `ngmQLbmXEeuN378NB92BJw==` | no name (newer type) |
| Newcrest Community Space | “Newcrest Community Garden” | `jucBIbmXEeuNor8NB92BJw==` | no name (newer type) |
| Newcrest Community Space | “Newcrest Community Makers” | `kZXBNLmXEeuNq78NB92BJw==` | no name (newer type) |
| Newcrest Community Space | “Newcrest Community Space” | `jFnAgrmXEeuNkr8NB92BJw==` | no name (newer type) |
| Midtown Meadows | “Midtown Meadows” | `hUU2PF35R4KCXaGXOvgXJg==` | Residential Rental |
| Oak Alcove | “Oak Alcove” | `0p+N/YbaEeiMRh/IdAuKQQ==` | Residential |
| Comfy Cubby | “Comfy Cubby” | `fP8z05XKEeiCPH6gmyVpVw==` | Residential |
| Twin Oracle Point | “Twin Oracle Point” | `m35FmzjdEeeOtKP4YfS2mA==` | Residential |
| Avarice Acres | “Avarice Acres” | `H5W5eU6+EeeKGWZWSBao2A==` | Residential |
| The Ice Pavilion | “The Ice Pavillion” | `+DAFcj27EemJdXldy2Ruvw==` | Park |
| Asphalt Abodes | “Asphalt Abodes” | `6DxqqjzOQTCrmkXX5Ym/tQ==` | Residential |
| The Aqua Grill | “The Aqua Grill” | `9T/CGgyvEeqBoLqJHNbwJw==` | Restaurant |
| Newcrest Wedding Hall | “Newcrest Wedding Hall” | `tW8EcJW2EeyEfidMGW1b+w==` | Wedding Venue |
| Newcrest Arts Center | “Newcrest Arts Center” | `10bAnPbrEeaEQtF92RUZ9w==` | Arts Center |
| Cookies ’n’ Cream | “Cookies ’n’ Cream” | `5IgKUz28EemN+Hldy2Ruvw==` | Retail |
| Optimist’s Outlook | “Optimist’s Outlook” | `b8CLGvj5QeOG99APW33WlQ==` | Small Business Venue |

**Granite Falls**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Campground | “Campground” | `CteLgi2OSyWWdZNQihdhuQ==` | Residential |
| The Forest Tavern | “The Forest Tavern” | `TsBq/oKyEeiG+faJ0UabCw==` | Restaurant |
| Green Getaway | “Green Getaway” | `rMPNtHy3EeiDtMw4VFS7Iw==` | Residential |
| Lakeside Retreat | “Lakeside Retreat” | `3tN9AgwwEeeHSemJWRDrbA==` | Residential |
| Granite Falls Spa | “Granite Falls Spa” | `XprP6n4vEeiCsAvXwy7zKw==` | Spa |

**Magnolia Promenade**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| The Llama Picturehouse | “The Llama Picturehouse” | `35iC4eIXRFOkqzUXYq8Dig==` | Small Business Venue |
| Magnolia Bowling Alley | “Magnolia Bowling Alley” | `xNEy4XPlEeeBQSkfayV2UA==` | Bar |

**Windenburg**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Proprietor’s Square | “Proprietor’s Square” | `fCk9D0WAEeeOAaP4YfS2mA==` | Residential |
| Havisham House | “Havisham House” | `GsrjSQceEeqGNEu/SNc3OA==` | Residential |
| Factory One | “Factory One” | `zdQ3QSN9EeeFiWUH0XaZxA==` | Residential |
| Olde Platz Inn | “Olde Platz Inn” | `UrN6y7srEeuAzvwg9JDtjA==` | Restaurant |
| The Narwhal Arms | “The Narwhal Arms” | `LAC77Vm5EeeAK22AqHCI6g==` | Bar |
| Pixel Café | “Pixel Café” | `lU27jsitEeeLcr+KYzr9wA==` | Café |
| Museum of the Arts | “Museum of the Arts” | `TEsvlFq8EeeK+MnL0U6IYw==` | Museum |
| Coorinberg Cottage | “Coorinberg Cottage” | `60HYgOvpR0a9c7/SdYBveA==` | Residential |
| Cottage Am See | “Cottage Am See” | `90eaL6RtEeuE1ecawTB/JA==` | Tiny Home Residential |
| Rustic Residence | “Rustic Residence” | `XCNL0nuzEeyN+AW7hdRP0w==` | Tiny Home Residential |
| The Shrieking Llama | “The Shrieking Llama” | `hQY3dKXnEeuB2+cawTB/JA==` | Bar |
| Mid-Nowhere | “Mid-Nowhere” | `KjklhciHEeuF3a3kS5H9ag==` | Generic |
| Von-Windenburg Castle | “Von-Windenburg Castle” | `5Ogf+wA8EeuOvtW1mM26QQ==` | Residential |

**San Myshuno**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| 17 Culpepper House | “17 Culpepper House” | `Vk2VHIiVEemPc9x2YPRdRQ==` | Rooms |
| 18 Culpepper House | “18 Culpepper House” | `wcXFyz21EemNHnldy2Ruvw==` | Rooms |
| 19 Culpepper House | “19 Culpepper House” | `8+qh5iODEeeKPGUH0XaZxA==` | Rooms |
| Fraternity Apartment | “Fraternity Apartment” | `jvRimu1VEeqLZil86hsCPw==` | Rooms |
| Sorority Apartment | “Sorority Apartment” | `/1AOQu1PEeqCUCl86hsCPw==` | Rooms |
| The Old Salt House | “The Old Salt House” | `jVD2MEWBEeeBOqP4YfS2mA==` | Restaurant |
| Waterside Warble | “Waterside Warble” | `cm8k9PS2EeeKFZymIxmfvg==` | Karaoke Bar |
| 920 Medina Studios | “920 Medina Studios” | `lnguI4+KEeiPG13tOtUAYg==` | Rooms |
| 930 Medina Studios | “930 Medina Studios” | `oRFw156kEemGlHVYaA94HQ==` | Rooms |
| 122 Hakim House | “122 Hakim House” | `Uf3EQP8MEeyKGRdS1XRQaQ==` | Rooms |
| 1310 21 Chic Street | “1310 21 Chic Street” | `IJqDYJjGEeiBKjwldOHC9g==` | Rooms |
| 1010 Alto Apartments | “1010 Alto Apartments” | `wgO03R6kEeuOM2EZzJ8AzQ==` | Rooms |
| Skye Fitness | “Skye Fitness” | `TKz5fD8MEeqGF0Ftv2M37A==` | Gym |
| Stargazer | “Stargazer” | `/QOT/EWBEeeCgKP4YfS2mA==` | Nightclub |

**Selvadorada**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Hillside Hideaway | “Hillside Hideaway” | `335sZpKTEeyL94KVX4KDoA==` | Residential |
| Selvadorada Villa | “Selvadorada Villa” | `ofQVeJT5EemF/FunJjefig==` | Residential |
| Cantina “El Árbol del Jaguar” | “Cantina “El Árbol del Jaguar”” | `aqDVugmrEeuPyZLGvPH+KA==` | Bar |
| Jungle Bungalow | “Jungle Bungalow” | `3nHPkj3IEemMPXldy2Ruvw==` | Residential |
| Belomisia Field Station | “Belomisia Field Station” | `XpBSeY8IRSGZ4EaA0S8D/A==` | Custom Venue |

**Brindleton Bay**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Pupperstone Park | “Pupperstone Park” | `St7XdvkYEeqHReAP1tcFHw==` | Park |
| Domus Familiaris | “Domus Familiaris” | `zmRNX/egEeqEegj3LsIbeA==` | Residential |
| Brindleton Boathouse | “Brindleton Boathouse” | `A/9iCxIxEeqI+SSV4rtE9w==` | Residential |
| Calico | “Calico” | `TBbktz3AEemOU3ldy2Ruvw==` | Lounge |
| The Bay Café | “The Bay Café” | `Sa/c+Av6EeuBi5LGvPH+KA==` | Café |
| Brindleton Library | “Brindleton Library” | `4PImECUzEeiJE2UCaOyRNg==` | Library |
| Tail’s End Apartments | “Tail’s End Apartments” | `+A+x1l7bRQqBZ6ykyVWG+g==` | Residential Rental |
| Bedlington Barn | “Bedlington Barn” | `98RpXiA8TIaxkspATvE/5w==` | Residential |
| Creek Clinic | “Creek Clinic” | `TG3zMCVJEeiGvGUCaOyRNg==` | Vet Clinic |
| Hindquarter Hideaway | “Hindquarter Hideaway” | `ZRB3u+jIEeeCjfk5Gb/cmg==` | Residential |

**Del Sol Valley**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Strike Out! | “Strike Out!” | `+RyMyQ0wEeqC+TQshgnHrQ==` | Nightclub |
| The Inner Circle | “The Inner Circle” | `loFJviHeSPiqw5EI645QUg==` | Residential Rental |
| Upland Trailer Park | “Upland Trailer Park” | `sf2Tcm6GSAOVENYPoOEwGw==` | Residential Rental |
| The Ward Den | “The Ward Den” | `xqUlDKYSEeuFF/wg9JDtjA==` | Residential |
| Bailey-Moon Manor | “Bailey-Moon Manor” | `EvNHBPhzEeyAjQ1GIKvfGw==` | Residential |
| Orchid A Go Go | “Orchid A Go Go” | `F9KVZ6FaEeuHNfwg9JDtjA==` | Lounge |
| Starlight Fitness | “Starlight Fitness” | `lRs1caFSEeuGj/wg9JDtjA==` | Gym |
| Valley Views | “Valley Views” | `S0OY6pUkEe2C1FdEVD8H2Q==` | Restaurant |

**StrangerVille**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Carpophagous Corner | “Carpophagous Corner” | `90dWb5T5EemIVFunJjefig==` | Residential |
| Slip 42 | “Slip 42” | `nYOqR4JwQt2h6tVnaQLT5Q==` | Residential Rental |

**Sulani**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Admiral’s Wreckage | “Admiral’s Wreckage Market” | `/bCtIBlfEeuO7QW7hdRP0w==` | no name (newer type) |
| Admiral’s Wreckage | “Admiral’s Wreckage Garden” | `+1U+KRlfEeuO4gW7hdRP0w==` | no name (newer type) |
| Admiral’s Wreckage | “Admiral’s Wreckage Makers” | `AIotNBlgEeuPAwW7hdRP0w==` | no name (newer type) |
| Admiral’s Wreckage | “Admiral’s Wreckage” | `+PLCKxlfEeuO3QW7hdRP0w==` | no name (newer type) |
| Caldera Camp | “Caldera Camp” | `bTN95hlYEeuNKWEZzJ8AzQ==` | Residential |
| Kin-Ship | “Kin-Ship” | `4poh5Z5/Ee2LeKFUkPHwsA==` | Residential |
| Lagoon of Love | “Lagoon of Love” | `qgIHHu1NEeqKTiQfmaYcsw==` | Park |
| Ohan’ali Community Center | “Ohan’ali Community Center” | `twCTOO1NEeqKkCQfmaYcsw==` | Library |
| The Sand Bar | “The Sand Bar” | `r8/jiu1NEeqKZyQfmaYcsw==` | Bar |
| Ohan’ali Beach | “Ohan’ali Beach” | `nYH8Hu1NEeqKESQfmaYcsw==` | Beach |
| Journey’s End | “Journey’s End” | `hix5Gu1OEeqN7CQfmaYcsw==` | Residential |
| Sand Simoleon Beach | “Sand Simoleon Beach” | `o96LYe1NEeqKMCQfmaYcsw==` | Beach |
| Sapphire Shores | “Sapphire Shores” | `2laHTe1NEeqLICQfmaYcsw==` | Residential |

**Glimmerbrook**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Creek Side Corner | “Creek Side Corner” | `xr995/SGEeqJ1e5FdmbmdA==` | Residential |
| Glimmerbrook Watch | “Glimmerbrook Watch” | `odr5dwNmEeuHqnCrzml8yA==` | Residential |
| Brooks Bridge | “Brooks Bridge” | `H04iZgvxRb6FF++S6ssRlg==` | Haunted House Residential |
| Glimmer & Books | “Glimmer & Books” | `+aNzE+BWEeyIaxrwo9vsUA==` | Library |
| The Magic Realm | “The Magic Realm” | `PopQBuBAEeyONXVMsZWocA==` | Generic |

**Britechester**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Darby’s Den | “Darby’s Den” | `C0fsDxFmEeqHo0u/SNc3OA==` | UBrite Commons |
| The Old Clocktower | “The Old Clocktower” | `kH82AzqOSYuNO98i6uAJEw==` | Backroom |
| Drake Hall | “Drake Hall” | `xwKW8hFmEeqKVku/SNc3OA==` | University Housing |
| Wyvern Hall | “Wyvern Hall” | `yJusUxFnEeqOJ0u/SNc3OA==` | University Housing |
| Larry’s Lagoon | “Larry’s Lagoon” | `J5N3RfOPEeqCCcLb66ZsmA==` | Foxbury Commons |
| Foxbury Court | “Foxbury Court” | `eX31QAPZRGWol4Ud/k4bRA==` | Backroom |
| Tidal Tower | “Tidal Tower” | `hZKnQAU9RVSEhAqGTS7yyQ==` | University Housing |
| Briny Tower | “Briny Tower” | `dUmUl8fLSFC7Tb8ux2J66Q==` | University Housing |
| Britechester B&B | “Britechester B&B” | `RwfD0bUaEeuB0ucawTB/JA==` | Café |
| Laurel Library | “Laurel Library” | `421u6vYLEeqOjQj3LsIbeA==` | Library |
| The Royal Crown | “The Royal Crown” | `RQVL6vebEeqB6gj3LsIbeA==` | Bar |
| Mossy Lane | “Mossy Lane” | `+1TuKO1OEeqP5iQfmaYcsw==` | Residential |
| Spring Steppes | “Spring Steppes” | `KSt/tE6iQq2vZ7znirZsAw==` | Residential Rental |

**Evergreen Harbor**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Rockridge Springs | “Rockridge Springs” | `7qor1/qySJOuKuOZ5Tq/Tg==` | Residential |
| Stonestreet Apartments 3 | “Stonestreet Apartments 3” | `jfISOaR8EeuMrecawTB/JA==` | Rooms |
| Stonestreet Apartments 4 | “Stonestreet Apartments 4” | `mVpx+qSLEeuE+/wg9JDtjA==` | Rooms |
| Pinecrest Apartments #404 | “Pinecrest Apartments 404” | `rZY+UsMqEeuDL+WcoywPdA==` | Rooms |
| The Old Dockyard | “The Old Dockyard Market” | `Zz52rhx6EeuFrhriosBzww==` | no name (newer type) |
| The Old Dockyard | “The Old Dockyard Gardens” | `ZQSlwRx6EeuFnhriosBzww==` | no name (newer type) |
| The Old Dockyard | “The Old Dockyard Makers” | `aP66fRx6EeuFtxriosBzww==` | no name (newer type) |
| The Old Dockyard | “The Old Dockyard” | `YkcpxBx6EeuFjhriosBzww==` | no name (newer type) |
| The Portsmouth Promenade | “The Portsmouth Promenade” | `WzZP/f/sT6inGdN6AXBE6Q==` | Small Business Venue |

**Mt. Komorebi**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| 2-4-2 Wakabamori | “2-4-2 Wakabamori” | `VbPOiqJiEe2JB1d8Dz3Yjw==` | Residential |
| 2-4-3 Wakabamori | “2-4-3 Wakabamori” | `WNVbEc9zEeuIuUhsV3GtHg==` | Residential |
| Sento Senbamachi | “Sento Senbamachi” | `HA1X7avPEe2KmInwBMy2Ww==` | Onsen Bathhouse |
| Izakaya Hanamigawa Koen | “Izakaya Hanamigawa Koen” | `LZDQX/6/EeyBmFZvr3rQ2g==` | Restaurant |
| 5-1-1 Kiyomatsu | “5-1-1 Kiyomatsu” | `DalrQoxKT2WT8gFfb+JCuA==` | Residential |
| 5-1-2 Kiyomatsu | “5-1-2 Kiyomatsu” | `N+vsiXPfSiyLfiA9VWRa3Q==` | Residential |

**Henford-on-Bagley**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Finchwick Village Hall | “Finchwick Village Hall” | `7nHvQXlqEeyMMC9r3fSuPw==` | Library |
| 3 Olde Mill Lane | “3 Olde Mill Lane” | `ifmJ+XofEeyNagW7hdRP0w==` | Residential |
| Cordelia’s Secret Cottage | “Cordelia’s Secret Cottage” | `9qzpljoJSjOu1Y1zWOxe+Q==` | Residential |

**Copperdale**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Copperdale Library | “Copperdale Library” | `nFAht7I4Sdu8iwDUqLc6WA==` | Library |
| Town Square Stores | “Town Square Stores” | `5e8Hz59OEe2D31rYHh8uGQ==` | Thrift and Bubble Tea Store |

**San Sequoia**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Manzanita Terrace | “Manzanita Terrace” | `VQFgXtugQYOnRKBloF2q8w==` | Residential Rental |
| Anchorpoint Recreation Center | “Anchorpoint Rec Center” | `UXbB7/eiRbWJZnZEclMjpA==` | no name (newer type) |
| Anchorpoint Works | “Anchorpoint Works” | `z2mjougaSg2qJMlf9cbGpw==` | Restaurant |
| Parkside Playground | “Parkside Playground” | `HMOwRBrIQuedlPG5caBw8A==` | Playground |
| 23 Eucalyptus Lane | “23 Eucalyptus Lane” | `1WpsEz1aTLyFuTNaFCmhLA==` | Residential |

**Chestnut Ridge**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| The Oak Barrel | “The Oak Barrel” | `1Q66JxbkTmSxL/yKFObuBg==` | Restaurant |
| Appaloosa Stables | “Appaloosa Stables” | `W2doWBlGRk+vBVPnU2Y6aQ==` | Residential |
| Red Roan Farm | “Red Roan Farm” | `NmY0ps4JQs+b2oePMFcq1w==` | Residential |
| Palomino Junction | “Palomino Junction” | `RZD6nwFCTjqQAXMiXhbgMg==` | Residential |
| Big Sky Reach | “Big Sky Reach” | `W6J+tA4mQGS/Zrj6G+qdpw==` | Residential |

**Tomarang**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Chee-wít Chee-waa | “Chee-wít Chee-waa” | `JnppkuUEQPS6bRavGX505Q==` | Thrift and Bubble Tea Store |
| The Screaming Gecko | “The Screaming Gecko” | `eSlCIc1aR5KpAQHEuQo8OA==` | Karaoke Bar |

**Ravenwood**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Crow’s Chronicles | “Crow’s Chronicles” | `LSNKN6V/Sjaa8F6nEgj9Vw==` | Library |

**Nordhaven**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| The Rouge Note | “The Rouge Note” | `ed6i66jPTSu6+5lsSvpp5w==` | Bar |
| Old Torget Houses | “Old Torget Houses” | `EMetavynTOqQjkFpJaa3Yw==` | Residential Rental |
| Fisherman’s Wharf | “Fisherman’s Wharf” | `eBW0HHlhR+aMEYGS2IRYfA==` | Residential |
| Canalside Daycare | “Canalside Daycare” | `4gCiLpEpQf284z6512WwEA==` | Residential |

**Gibbi Point**

| Lot | Upload | Id | Gallery type |
|---|---|---|---|
| Revive and Thrive | “Revive and Thrive” | `bVV01Nz1Soi3smD/Qv6Z/w==` | Custom Venue |
| Gibbi Point Library | “Gibbi Point Library” | `pKnwlfeXRiGGVi/QvTc7TQ==` | Library |
| Gibbi Recreation Center | “Gibbi Rec Center” | `R7mzaO9GS5atpQCbFz9dlw==` | no name (newer type) |

