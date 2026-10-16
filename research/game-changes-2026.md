# Game changes, Oct 2025 – Oct 2026, and what’s coming (overnight 16–17 Oct)

Research only. Nothing on the site, in `data/`, `tools/` or `TODO.md` was changed, and nothing was committed. Sources are EA’s own news pages and patch notes (fetched 16–17 Oct 2026), the Sims Wiki (through its API), and Sims Community for developer Q&As and rumours. The full list is at the end.

Her game is on **1.128.90.1030**, the 22 Sep 2026 update (from `GameVersion.txt`, read only), so it’s up to date. EA’s news page has nothing newer than 8 Oct.

**Labels:** **Confirmed** = EA’s own page or patch notes. **Reported** = developers quoted by a fan site (Discord Q&As). **Rumour** = insiders, leaks or surveys. Pack ownership comes from `data/worlds.json` and the world files. Kit ownership isn’t known, so it isn’t guessed.

---

## Headlines

- **No new world since Ondarion (12 Feb 2026), and none announced.** EA says it will keep delivering kits, Maker Packs and free updates. No Expansion, Game or Stuff Pack has been announced since Royalty & Legacy. “No more packs” is Sims Community’s reading of EA’s words, not EA’s own phrase.
- **She owns both packs from the period:** Adventure Awaits (2 Oct 2025, Gibbi Point) and Royalty & Legacy (12 Feb 2026, Ondarion). Both worlds are already in the app.
- **New lot types:** Custom Venue (Adventure Awaits), Backroom and Community Market (Royalty & Legacy), plus Playground (free update, 18 Sep 2025). All four are already in her plan (5, 5, 4 and 4 lots).
- **New lot traits:** Clandestine (Royalty & Legacy) and Regal Residence (a free event reward, Feb–Mar 2026). There are no new lot challenges. Her tools already know both trait names.
- **The big one for the family tree idea:** the free update of 3 Feb 2026 rebuilt the in-game family tree. It added in-law, step, half and great- labels, shows 10 generations, and gave six premade families ancestors (new saves only). EA plans more family-tree and relationship work for Sept–Dec 2026.
- **Rentals:** since 4 Nov 2025, turning a dorm or penthouse into a Residential Rental no longer hangs the game. (Mossy Lane was once planned as a 4-unit rental, but she settled it as University Housing on 14 Oct, so this no longer applies to it.) There were also several fixes to rent and lot taxes.
- **Gallery:** until 22 Sep 2026, Wedding Venues placed from the Gallery could stay Residential underneath.
- **Next:** an October update about food and dining (no date yet), then family trees and relationships. A rumour says the next single-player Sims game (“Project X”) must be finished by Sep 2027.

---

## Packs from the period (both owned)

| Pack | Date | Adds that matters to her plan | What to do |
|---|---|---|---|
| **Adventure Awaits** (EP) | 2 Oct 2025 | Gibbi Point (Wanderwood Wilds, Crystal Valley, Jellyfish Junction). New lot type **Custom Venue** (roles and a 24-hour schedule). **Getaways** are events run on a lot, not a lot type. Its waterfront lots can’t be Residential Rentals, as in Sulani. Formative Moments and Imaginary Friends for children. No lot traits. | Done: Gibbi Point is in the app. 2 Dec 2025 fix: premade Custom Venues (e.g. Revive & Thrive Retreat) now run their own schedules, even in old saves, unless she edited the schedule |
| **Royalty & Legacy** (EP) | 12 Feb 2026 | Ondarion (Dambele, Verdemar, Bellacorde). New lot types **Backroom** (library, gym or museum by day, nightclub 9 pm–6 am) and **Community Market**. Lot trait **Clandestine**. Secret Passageways between lots. Gazebos for sword tournaments. **Dynasties** (head, heir, outcasts, values, crest). Secret children and forged family links. Adults can be adopted. | Done: Ondarion is in the app and discussed (TODO, 16 Oct). The game files allow Backroom and Community Market in every world (`research/data/world-lot-types.json`). If she bought the pack by 15 Mar 2026, the Grand Bundle also gave her the Tea Time Solarium and Silver Screen Style kits |

Not in the period, for completeness: Businesses & Hobbies (6 Mar 2025, owned) and Enchanted by Nature (10 Jul 2025, Innisgreen, **not owned**, with its own lot trait, Fairy Passage). Lot ideas for Innisgreen are in `research/not-owned-worlds.md`.

---

## Kits, Creator Kits and Maker Packs

None of these adds a lot type, lot trait, world or venue. They’re all clothes and Build/Buy items. Ownership: **not known** (`data/worlds.json` only covers packs with worlds).

| Kit | Date | What |
|---|---|---|
| Autumn Apparel | 9 Oct 2025 | Clothes |
| Modern Retreat (TudTuds), Garden to Table (BrazenLotus) | 13 Nov 2025 | Creator Kits, Build/Buy |
| SpongeBob’s House, SpongeBob Kid’s Room | 4 Dec 2025 | Build/Buy (bundle until 3 Mar 2026) |
| Prairie Dreams (Miiko) | 11 Dec 2025 | Creator Kit |
| Tea Time Solarium, Silver Screen Style | 12 Feb 2026 | Free with Royalty & Legacy until 15 Mar 2026 |
| Wonderland Playroom, Yard Charm (Ravasheen) | 26 Feb 2026 | Playroom; garden (the last Creator Kit so far) |
| Lady Bridgerton’s Masquerade Ballroom, Masquerade Ball Fashion | 14 May 2026 | Ballroom Build/Buy; clothes |
| Music Den | 23 Jul 2026 | Music room, with playable instruments |
| Mean Girls Capsule, Clueless Capsule | 27 Aug 2026 | Mostly clothes |

- **Since 17 Mar 2026 new kits are bought through the Marketplace** (in game, on the web or in the EA app), with Moola. Kits she already had stay.
- **Maker Packs** are 3–50 Create a Sim and Build/Buy items made by approved creators (EA’s FAQ). They can’t add lots, worlds or gameplay.
- **Free, time-limited:** the Coach RePurposed Capsule can be downloaded from the Marketplace until **28 Oct 2026**.
- **Other free collections:** the Coach Collection (13 Jan 2026), West African items (4 Nov 2025), size-inclusive clothes (25 Aug 2026) and children’s items (22 Sep 2026).

---

## Free updates: lots, venues and rentals

| Date (patch) | Change | What she might do |
|---|---|---|
| 18 Sep 2025 (188) | **Playground** venue added. A venue-type filter when planning events. | Nothing: 4 Playgrounds already (her choice, 15 Oct) |
| 4 Nov 2025 (190) | Turning a **penthouse or dorm into a Residential Rental** no longer means endless loading (old saves repaired). Rent shows and can be paid. A rental can go back to Residential even when the active Sim isn’t in the main unit. Evergreen Harbor’s market stalls get vendors again after a Community Space changes type. | Mossy Lane (University Housing in her save, plan says rental of 4) can be converted safely. A penthouse could be a rental too, if ever wanted (allowed since 23 Jul 2024, patch 162) |
| 2 Dec 2025 (191) | Premade Custom Venues run their own schedules. | See Adventure Awaits above |
| 13 Jan 2026 (192) | Custom Venue schedules with a romantic-orientation role no longer corrupt the save. | Nothing |
| 3 Feb 2026 (193) | Family tree update (next section). Flared staircases. New activities for small businesses, Custom Venues and clubs (e.g. Hold Lecture, Take Photos). These weren’t in the patch notes; a modder found them. | Activities could suit her small businesses and Custom Venues; her call in game |
| 3 Feb – 16 Mar 2026 | **Lost Legacies** event: lot trait **Regal Residence** (slower need decay and longer happy moods as the lot’s value rises). | Only if she claimed it during the event. It suits palaces and estates |
| 17 Mar 2026 (196) | Marketplace arrives. **Ondarion’s Verdemar lot no longer reversed.** Landlords can inspect tenants’ units. Love seats and benches count as benches for venue needs. | A Verdemar screenshot that looks mirrored predates this |
| 12 May 2026 (201) | Moving out after switching a lot to Rental and back no longer leaves items behind. | Nothing |
| 30 Jun 2026 (203) | Rent and property tax shown properly for tenants. Multi-unit rentals no longer crash when switching households. Tomarang’s rental houses now cost more for more days, not less. Gallery lots built with heavy placement cheats no longer hang when placed. | Nothing |
| 21 Jul 2026 (204) | Memory Boost on for everyone. With it, EA can no longer reproduce its top save problem: corrupted lots in saves with **lots of Residential Rentals**. | Her plan has about 20 rentals; keep Memory Boost on |
| 6 Aug 2026 (205) | Lot taxes back on rental bills. Map thumbnails rebuilt for premade houses never entered. | Nothing |
| 22 Sep 2026 (207) | **Wedding Venues placed from the Gallery stay Wedding Venues** (before, the lot could stay Residential underneath until visited or set again). Children use playground equipment properly. | Check in Manage Worlds that her Gallery-placed Wedding Venues show as Wedding Venue |

No update in the period added a lot type to the base game after Playground. None of the patch notes mention changes to lot sizes or to which worlds allow which lot types. EA mentioned “new lot sizes” with Royalty & Legacy (29 Jan 2026) but didn’t list them. Ondarion’s lot sizes are already in her data from the game files.

## Free updates: saves and the Gallery (for the tools)

- **Autosave** arrived on 21 Jul 2026, with fixes on 6 Aug and 22 Sep. Until 22 Sep, “Save and Exit” could make a new save file instead of a new version, and restoring an autosave could make an unnamed save.
  - `lot_traits.py` already treats an autosave as the save it came from.
  - If a stray or unnamed copy of a Building save appeared between July and September, check which one is current.
- **Backup saves** now kept by day, week and month (12 May).
- Saves are still in `Documents\Electronic Arts\The Sims 4\saves`. Only the game’s temporary “scratch” files moved to AppData (Jan–Mar 2026).
- **Duplicate world records:** a save could hold two neighbourhood records for one world, so the world showed twice on World Select (fixed 30 Jun). Worth knowing if a tool ever reads neighbourhood records from older saves.
- **Gallery:**
  - The default sort is “Newest” again (12 May).
  - The in-game “My Favorites” list now loads all favourites, not just 25 (12 May).
  - Fewer upload timeouts (13 Jan, 21 May).
  - SimSearch (26 May, in-game beta): search across languages, and search by picture for lots and rooms.
  - The Gallery shows which Maker Packs an upload uses (16 Apr).
  - None of this should affect the weekly refresh, which reads her own uploads.

---

## Family trees and relationships (for the planned family tree)

**What changed on 3 Feb 2026** (Confirmed, EA patch notes; details Reported from the developers’ Q&A the same day):

- **New labels:** Mother-, Father-, Sister-, Brother-, Daughter- and Son-in-Law; Step- and Half- relatives; Great-grandparents and great-grandchildren; Grand-aunt, Grand-uncle, Grandniece, Grandnephew; Parent’s Cousin, Cousin’s Child; Distant Relative (and -In-Law); Relative-In-law; Ancestor; Descendant. Divorced is now **Ex-Spouse** and Deceased Spouse is now **Late Spouse**.
- **Wider tree:** up to **10 generations** (5 above and 5 below the chosen Sim). Aunts, uncles, cousins and in-laws are shown. It works in old saves too, as long as the Sims weren’t culled.
- **Culled Sims** keep their portrait and name in the tree but lose their real id, so they can’t come back as ghosts. Ghosts do show.
- **Who appears:** partners only once married, never friends, no pets. Vampire makers and their “spawn” aren’t linked.
- **Adopted** label: an option in the game settings, off by default. Adoption needs the child to have fewer than 2 parents.
- **Romance:** Sims won’t flirt on their own with in-laws or step-relatives. Ancestors in a straight line can’t be romanced (existing couples are left alone).
- **Premade ancestors** for the **Goths, Landgraabs, Thebes, Capps, Montys and Darongs**, and lore links between families from different packs (when she owns both packs). **New saves only.** The ancestors are portraits only.
- **Gallery:** a downloaded household keeps only its own members; the rest of the tree is dropped.
- **With Royalty & Legacy (owned):**
  - Dynasty icons, noble ranks and special lines in the tree.
  - **Forged links** shown dotted; **secret children** (the mother can name a different father).
  - Adults can be adopted. Dynasty members must be family by blood or marriage.

**Later fixes:**
- 12, 19 Feb, 17 Mar and 12 May: wrong or overlapping lines, missing adopted Sims.
- 12 May: spouses wrongly becoming related through a sibling made in Create a Sim (partly fixed).
- 12 May: EA notes that a save can legitimately hold a woman in the father slot or a man in the mother slot; the game no longer assumes otherwise.
- 12 May and 22 Sep: children of premade dynasties join automatically; a save now records how each Sim joined a dynasty.
- 17 Mar: unrelated children who grew up together were “Super Siblings”; they’re now **Childhood Besties** or **Childhood Frenemy**.
- 22 Sep: married couples no longer turn back into partners in Create a Sim. Lovestruck’s romantic satisfaction and Growing Together’s family dynamics were rebalanced.

**What it means for her family tree:**
- It fits `research/sims-sources.md`. Only saves played since Feb 2026 have the new family-tree record (it found one only in *Season Events*, 15 Mar 2026), and that record keeps culled ancestors.
- **Labels:** working them out from parents and marriages (as `research/sims-display.md` suggests) still works. The game’s own label names are now the reference.
- **Mother and father:** the site shouldn’t assume a mother is female or a father male.
- **Goth ancestors:** the game’s own Goth ancestors exist only in a save started since 3 Feb 2026. That matters for “Family tree, Goths first”.
- **Royalty & Legacy households:** she decides whether the site shows the “official” parent or the true one when a child is secret or a link is forged.
- **Older saves:** spouse–sibling links in them may be wrong (EA’s bug).

**Coming (Confirmed as a plan, no date):** EA’s Quality of Life roadmap (24 Feb 2026) has “Family trees & relationships: strengthening genealogy systems and relationship tracking” for **September to December 2026**, after food and dining. EA says timing may change. The save layout may change again, so any save reader for Sims should be rechecked after that update.

---

## Coming next, and rumours

| What | Status | Notes |
|---|---|---|
| **October 2026 update: food, dining and drink.** Calorie and price pass across all packs. Option to switch off weight and muscle changes. Dine Out fixes (not a rework). Maybe fridges, leftovers, dirty dishes and the Island Living swimming fix | **Confirmed** theme (EA Laundry List, 15 Sep); details **Reported** (Q&A, “not guaranteed”) | EA’s community manager on Discord, 9 Oct (via Sims Community): “a big one dropping this month”, Laundry List in about 2 weeks. No new lot types expected. Afterwards, rerun §7 step 1 research and `lot_traits.py --game` as usual |
| **Family trees and relationships** work | **Confirmed** plan, Sept–Dec 2026 | See above |
| **No new Expansion, Game or Stuff Packs** | **Reported**: EA’s Marketplace showcase (Mar 2026), as quoted by Sims Community, said kits and free content would keep coming. EA’s own pages say only that The Sims 4 continues with “a mix of free base game updates and optional DLC”. “No more packs” is Sims Community’s reading | No new pack announced since Royalty & Legacy, so no new worlds are expected for The Sims 4 |
| Maker-made gameplay (traits, **lot traits**, careers, NPCs…) | **Rumour**: only a question in a closed EA survey (Sep 2026) | Would be the only way new lot traits could come; nothing announced |
| **“Project X”**: next single-player Sims, to be finished by 1 Sep 2027, add-ons only through a marketplace | **Rumour** (insider via Sims Community, 18 Sep 2026) | EA itself (9 Jan 2026) only says “the next evolution” is in work, with more than half the team on The Sims 4 and that |
| Project Rene | **Confirmed** (EA, Jan 2026): social, mobile-first, not the successor to The Sims 4. **Rumour:** ready but on hold | Not relevant to her save |
| World packs for The Sims 4 | Nothing: the insider didn’t know | — |

---

## Corrections to earlier notes (not edited, for whoever next touches them)

- `research/lot-types-reference.md` (Residential Rental row): “Not allowed on … San Myshuno penthouses” is out of date. Penthouses have been allowed since 23 Jul 2024 (patch 162), and penthouse/dorm conversion stopped hanging on 4 Nov 2025. Gibbi Point’s waterfront lots are excluded, like Sulani’s.
- Same file: the Verdemar reversed-lot fix and the bench tags came on **17 Mar 2026** (PC). 16 Apr was the console release of the same notes.
- Same file: “Backroom placeable outside Ondarion: not confirmed” is now settled. The game’s region tuning allows it in all worlds (`research/data/world-lot-types.json`).

---

## What she might need to do (short)

1. **Nothing to add to the app:** no new world, lot type or lot trait beyond what it already has.
2. ~~Mossy Lane~~: settled as University Housing on 14 Oct, so no conversion needed (corrected 17 Oct). The fix still matters for any penthouse she makes a rental.
3. **Wedding Venues placed from the Gallery:** check in game that they show as Wedding Venue.
4. **Family tree:** decide whether to wait for EA’s late-2026 family-tree work before reading Sims from a save, and whether a fresh save (with EA’s Goth ancestors) is wanted. Her judgement; not on `TODO.md`.
5. **After the October update:** the usual rerun of the game research (§7 step 1) and `tools/lot_traits.py --game`.
6. **Coach RePurposed Capsule** is free until 28 Oct, if she wants it.

---

## Sources

EA (news and patch notes, all under https://www.ea.com/games/the-sims/the-sims-4/news/):
- Patch notes: `update-9-18-2025`, `update-11-4-2025`, `update-12-2-2025`, `update-1-13-2026`, `update-2-3-2026`, `update-2-12-2026`, `update-2-19-2026`, `update-3-17-2026`, `update-3-18-2026`, `update-3-23-2026`, `update-4-16-2026`, `update-4-28-2026`, `update-5-12-2026`, `update-5-21-2026`, `simsearch`, `update-6-30-2026`, `update-7-21-2026`, `update-8-6-2026`, `update-8-25-2026`, `update-9-22-2026`
- Laundry Lists: `laundry-list-october-27th-2025`, `laundry-list-november-25th-2025`, `laundry-list-january-27-2026`, `laundry-list-march-10-2026`, `laundry-list-may-5-2026`, `laundry-list-june-23-2026`, `laundry-list-july-14-2026`, `laundry-list-sept-15-2026`
- Roadmaps and plans: `quality-of-life-roadmap` (15 Sep 2025), `quality-of-life-roadmap-update` (24 Nov 2025), `the-sims-4-quality-of-life-roadmap-2026` (24 Feb 2026), `future-of-the-sims` (9 Jan 2026), `quality-of-life-update-recap` (9 Jun 2026)
- Packs and kits: `getaways-dev-diary`, `royalty-and-legacy-expansion-pack`, `royalty-and-legacy-meet-the-sims`, `royalty-and-legacy-dev-diary`, `royalty-and-legacy-you-make-the-sims`, `autumn-apparel-kit`, `spongebob-squarepants-bundle`, `the-coach-collection`, `lady-bridgerton-kits-and-event`, `sims-4-coach-capsule-collection-music-den-kit`, `sims-4-mean-girls-and-clueless-kits`, `the-sims-4-brings-new-fits-and-spaces-to-kids-and-toddlers`, `deck-the-palms-login-event`
- Marketplace: `the-sims-maker-program-and-marketplace` (updated 5 Oct 2026, with FAQ), `meet-the-maker-packs-debuting-in-the-sims-4`, `free-maker-drops`
- News index: https://www.ea.com/games/the-sims/the-sims-4/news (pages 1–7)

Sims Wiki (https://sims.fandom.com/wiki/…, read through the API):
- Kits_for_The_Sims_4, Creator_Kits_for_The_Sims_4, The_Sims_4_Marketplace
- Reward_events, Lot_trait, Residential_rental, Family_tree, Backroom, Community_market, Custom_venue, Playground
- The_Sims_4:_Royalty_&_Legacy, The_Sims_4:_Adventure_Awaits, Ondarion, Gibbi_Point
- The_Sims_4/Patch_162 and Patch_186 to Patch_207 (dates and version numbers)

Sims Community (https://simscommunity.info/…):
- Family Tree Q&A with the developers: `2026/02/03/sims-4-family-tree-q-and-a/`
- Undocumented venue activities: `2026/02/04/new-activities-sims-4-pack-cross-pack-features/`
- “No more Expansion, Game and Stuff Packs” (quotes EA’s statement): `2026/03/04/sims-4-releases-no-more-expansion-game-stuff-packs/`
- Closed EA survey on Maker gameplay: `2026/09/04/closed-sims-4-survey-maker-packs/`
- September 2026 developer Q&A (October preview): `2026/09/15/the-sims-4-qa-with-the-developers-september-2026-update-features/`
- Project X rumour: `2026/09/18/the-sims-project-x-release-by-sep-2027/`
- Project Rene history: `2026/09/19/leak-sims-5-project-rene-lotus/`
- October update teaser: `2026/10/09/sims-4-update-october-2026-teaser/`
- Maker Pack leak (CAS and Build only): `2026/10/14/leak-of-upcoming-the-sims-4-maker-packs-oct/`

Project files: `data/worlds.json` and `data/worlds/*.json` (ownership), `research/data/world-lot-types.json`, `research/plan-vs-game.md` (Mossy Lane), `research/sims-sources.md`, `research/sims-display.md`, `data/game/lot-traits.json`, `tools/lot_traits.py`.
