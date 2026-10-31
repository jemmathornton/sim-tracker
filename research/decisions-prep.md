# Decisions prep: every open “Decide” on her list (31 Oct, overnight)

Research only. Nothing in `data/`, `site/`, `tools/` or `for-jemma/your-list.md` was changed. Saves were read from temporary copies.

Left out, as asked: Who lives where (homes proposal), the premade fix, the mods items, the Cadberrys.

**Sources used throughout:** her plan (`data/worlds/*.json`, `data/people.json`), her Gallery uploads (`data/gallery/uploads.json`, checked 29 Oct), the research notes named in each section, the game’s own tuning (read with `tools/research/tuning.py`; trait texts in `data/game/lot-traits.json`), EA’s untouched lots in “My Saved Game 4,376” (Slot_00001119, the untouched comparison save of 23 Oct), her other saves (copies), and the Sims Wiki (through `tools/research/wiki_fetch.py`). Packs she owns: the EP, GP and SP folders in `C:/Program Files/EA Games/The Sims 4` (no Lovestruck, Enchanted by Nature, Vampires, Journey to Batuu, My Wedding Stories or Werewolves).

## At a glance

| # | Item | Pick | Confidence |
|---|---|---|---|
| 1 | Lagoon of Love | Wedding Venue | fairly sure |
| 2 | Spooky and Simple Living on four lots | Keep all four (already in the plan: item partly stale) | fairly sure |
| 3 | Progress page: New save column | Keep | her taste |
| 4 | Hallow Slough | Neither, for now (tied to the Cadberry job) | her taste |
| 5 | Crick Cabana | Dustin Broke alone | fairly sure |
| 6 | Tiquelles: spellcasters, Mid-NoWhere their portal | Yes | fairly sure |
| 7 | Karaoke Legends | EA’s version (Akira and Darling) at 1313 21 Chic Street | fairly sure |
| 8 | Bro & Kennedy: which Kennedy | Kennedy Rouse, if any (no save ties a Kennedy to Bro) | her taste |
| 9 | LaSuli Point | Park | fairly sure |
| 10 | Key Point | Generic | her taste |
| 11 | Caldera Camp: Geothermal and Natural Well | Yes, add both | fairly sure |
| 12 | Moonwood Mill Library | Library | sure |
| 13 | Specter Row | 2-unit rental with On Hallowed Grounds | fairly sure |
| 14 | Mystic Crossroads owners | Yes, the Izadi-Gomes ghosts | fairly sure |
| 15 | Paradise Stables | A horse family of hers, riding stables | her taste |
| 16 | Love Highland | Their home again | fairly sure |
| 17 | Revive and Thrive: beds | No, keep it for day trips | her taste |
| 18 | Owners | Museum: Judith Ward. Picturehouse: the LeBlancs. Daycare: the Branches | fairly sure / her taste / her taste |
| 19 | Small business labels | Take off the list: her labels are already the game’s own names | sure |
| 20 | Gnomes on venues | Swap it (Convivial, Romantic Aura, Party Place) | sure (that it does nothing); her taste (swaps) |
| 21 | Empty rental units | Covered by “Who lives where”; For Rent idea already ruled out | sure |
| 22 | Links only an old save has | Keep only the Watson links | fairly sure |
| 23 | EA’s new ancestors | Yes, all but Pranav Kunal (2 are already on the site) | fairly sure |
| 24 | Typing Sims in | Chat only (overtaken by later calls) | sure |
| 25 | Going online | Not now | her taste |

---

## 1. Lagoon of Love (Sulani)

**Question:** What lot type should Lagoon of Love be?

**Options:** Wedding Venue (Claude’s pick on the list), Park, or Vacation Rental.

**Facts:**
- Plan: Lagoon Look, Ohan’ali Town, 30×20, Vacation Rental, built and shared; traits Sunny Aspect, Bracing Breezes, Eco Lot (`data/worlds/sulani.json`).
- Her upload is typed **Park**, 0 beds, 0 baths. Text: “the perfect wedding spot in Sulani … everything you need for a nice family wedding, even a swingset”. Tags include #weddingvenue #beachwedding #romanticaura #sunnyaspect #partyplace (`uploads.json`).
- New: the game uploads a Vacation Rental to the Gallery as Residential (`gallery_upload_venue_type` in the Vacation Rental tuning). So her Park upload was a Park when she shared it, not a rental.
- Game requirements (venue tuning): Wedding Venue needs nothing (arch, bar, chairs, toilet and so on are all optional). Park needs a toilet, sink, 2 benches, chess table, patio table, 4 outdoor chairs and 1 playground item. Vacation Rental needs nothing, but with no beds nobody can stay.
- Wedding Venue is base game; My Wedding Stories isn’t owned and isn’t needed (`research/lagoon-of-love.md`).
- Sulani has no wedding venue and no park; Lagoon of Love is its only Vacation Rental (`sulani.json`). Her owned worlds have 4 Wedding Venues (Newcrest, Ravenwood, San Sequoia, Tomarang) plus Finchwick Village Hall’s wedding area. On her map Sulani is islands “not near much else” (memory: world geography).
- Getaways: a Park can host one; a Wedding Venue or Vacation Rental can’t (`research/getaways-check.md`).
- EA ships the lot as a one-bedroom beach-house home (untouched save; game text).
- Not placed in the new save yet; it will come in as Park, so the type is set after placing (`research/new-save-status.md`, `for-jemma/new-save-checklist.md`).
- Her tags name Romantic Aura and Party Place, but the plan’s traits (from “Building #2”) are Sunny Aspect, Bracing Breezes and Eco Lot. What the upload itself carries shows only after placing.

**Change to the game:** all three change EA’s home. Wedding Venue: small, and matches her own text. Park: none to her build (it’s what she uploaded). Vacation Rental: needs a beach house built in.

**Pick:** Wedding Venue: her own text and tags call it a beach wedding spot, Sulani has none, and it needs no pack.

---

## 2. Spooky and Simple Living on four Windenburg lots

**Question:** Keep the Spooky challenge on The Narwhal Arms and Von-Windenburg Castle, and Simple Living on Coorinberg Cottage and Rustic Residence, or take them off?

**Options:** keep (Claude adds them to the plan), or take off.

**Facts:**
- **Partly stale:** the plan has had all four since 13 Oct (read from “Building #2”), and lot pages already show them (`data/worlds/windenburg.json`, git history). The new save has them too, placed from her Gallery uploads, and the new-save check finds no difference (`research/data/new-save-status.json`). So nothing needs adding; only “keep or take off in game” is left.
- EA ships all four lots with no traits at all (untouched save). She added these herself.
- Game texts: Spooky: “this lot attracts wandering Ghosts!” (a ghost turns up from about 11 pm, at a random time within 3 hours). Simple Living: “requires ingredients to cook all recipes. Cooking with ingredients just makes food taste better!” (`data/game/lot-traits.json`; schedule from the game tuning). Neither has a lot-type limit.
- Von-Windenburg Castle upload: “generations of spellcasters … may even visit from the afterlife!”, tagged #haunted. It’s the Tiquelles’ home (`uploads.json`, plan).
- Rustic Residence upload: “grow your own food, have some chickens”, tagged #simpleliving.
- Coorinberg Cottage (a lilsimsie shark-shell build): tagged #cottageliving. The Munches live there; Mila Munch is a Foodie and a Caterer (`windenburg.json`).
- The Narwhal Arms upload (“the lovely local pub … #britishpub #spoons”) doesn’t mention a ghost.

**Change to the game:** keep: none (her uploads already carry them). Take off: an edit on four lots in game and in the plan.

**Pick:** Keep all four: she chose them for her own builds, three match her Gallery text, and they only add a late-night ghost or the need for real ingredients.

---

## 3. Progress page: the New save column (trial switch)

**Question:** Keep the New save column on Admin > Progress’s every-lot table, or drop it?

**Options:** keep the New save column (✓ placed, ! something to fix, – to place), or drop it.

**Facts:**
- The switch shows only on Admin > Progress; “With new save” adds a 12th column after Where, Lot, Type, Size, Residents, Built, Shared, Sims, Photos, Favourites, Downloads. Hovering “!” says what to fix (`site/js/sections.js`, trial block of 24 Oct).
- It reads the same new-save check as Admin > Notes’ “New save” block, which lists the same things world by world. The weekly refresh reruns the check (CLAUDE.md).
- She’ll restart the new save once her mods work on patch 1.129; the column then shows the fresh save once the check is pointed at it (memory: new save).

**Change to the game:** none.

**Pick:** Keep: it shows per lot what Notes shows per world, and it’ll be most useful while she places lots in the restarted save.

---

## 4. Hallow Slough (Willow Creek)

**Question:** Should Ella-Mint’s home at Hallow Slough be a Haunted House, get On Hallowed Grounds, or neither?

**Options:** Haunted House, On Hallowed Ground, or neither.

**Facts:**
- Plan: Pendula View, 30×20, Residential, Ella-Mint Cadberry, built, not shared, no Gallery upload linked (`data/worlds/willow-creek.json`).
- None of her four Hallow Slough uploads is this lot’s build (her call, 13 Oct). One of them, “Hallow Slough (SoupShell)” (a lilsimsie shell), is typed **Haunted House Residential**: “This totally-not-haunted house … paranormal communications”. A fifth upload, “100 Babies Final House” (24 Oct, 8 beds), is “Ella-Mint Cadberry’s home, if she keeps it (undecided)” (`data/gallery/unlinked.json`).
- That choice of build sits inside the Cadberry job on her list (“the 100 Babies Final House upload (Ella-Mint’s home, or not?)”), which is parked.
- EA ships Hallow Slough as an empty lot with no traits (untouched save).
- Haunted House Residential (Paranormal Stuff, owned): specters every night, Guidry, Temperance on night 5, cursed objects, a reward each night survived (Sims Wiki, Haunted house residential). On Hallowed Grounds (Life & Death): spooky events twice a day, any lot type (game text and tuning).
- Pendula View already has the Goths’ Ophelia Villa as a Haunted House (`willow-creek.json`). Her owned worlds have 5 haunted houses planned.
- Her Gallery household for Ella-Mint is called “Spectra” (`research/gallery-households.md`).

**Change to the game:** Haunted House: medium (a new lot type for her own home, nightly ghosts for whoever lives there). On Hallowed Grounds: small (one trait). Neither: none.

**Pick:** Neither, for now: which build goes on the lot is still open in the Cadberry job, and Pendula View already has a haunted house next door.

---

## 5. Crick Cabana (Willow Creek)

**Question:** Does Dustin Broke live at Crick Cabana alone, or with the Sigworths as in “Season Events”?

**Options:** Dustin Broke alone, or with the Sigworths (as in Season Events).

**Facts:**
- Plan: Foundry Cove, 20×15, Residential, “Broke”, built and shared; upload: 2 bedrooms, 1 bathroom, “perfect for a small family” (`willow-creek.json`, `uploads.json`). The Broke household is Dustin alone (YA, Business, Senior Manager).
- The Sigworths are planned at Riverside Grove, StrangerVille (built, not shared): Jess, Dylan and child Christie. EA’s bio is StrangerVille’s mystery: Jess transferred to the base and is changing (`data/worlds/strangerville.json`).
- In “Season Events” (copy read 31 Oct) the Broke household lives at **Domus Familiaris, Brindleton Bay** (the Delgatos’ home in the plan): Dustin, Jess Sigworth and three teens born in that save (Marshall, Arya, Rylie), plus a pet. Dylan has died (“Jess is widow of Dylan”); Christie, now a young adult, has no home. Dustin is married to Jess and step-parent to all four children. The household was unplayed there, so Neighbourhood Stories made this, not her.
- In the Sims 4 Dustin is EA’s homeless 3-star celebrity in Del Sol Valley; his father Skip Broke is in the plan with the Addam Commune (Sims Wiki, Dustin Broke; `gibbi-point.json`).
- Another idea, not on the list: the homes proposal suggests Maxis’s Sims 2 Brandi and Beau Broke (Dustin’s mother and brother) could join him (`for-jemma/homes-proposal.md`).

**Change to the game:** alone: none beyond the plan. With the Sigworths: large (empties Riverside Grove and StrangerVille’s mystery family, kills Dylan, adds three children, and 4–6 Sims won’t fit 2 bedrooms).

**Pick:** Dustin alone: the Season Events version came from Neighbourhood Stories, breaks StrangerVille’s own story and doesn’t fit the house.

---

## 6. The Tiquelles (Windenburg)

**Question:** Are the Tiquelles spellcasters, with Mid-NoWhere as their portal to the Magic Realm?

**Options:** yes, or no.

**Facts:**
- Plan: four Tiquelle households on The Crumbling Isle: Von-Windenburg Castle (built, shared), The Lighthouse, Pier Palace, Dock Den (not built). No Sims on the site yet (`windenburg.json`).
- Castle upload: “generations of spellcasters, I mean sims, having lived and thrived in this beautiful castle”, tags #realmofmagic #spellcaster #legacy #haunted.
- Mid-Nowhere upload (Generic, 20×20): “Nothing to see here, absolutely nothing to see here at all”, tags #spellcaster #portal #portaltomagicrealm. Its only pack is Get Together, so the portal is decoration (`uploads.json`).
- In the game the Magic Realm is reached through Glimmerbrook’s portal, or by any spellcaster with their Glimmerstone; spellcasters can be made straight in Create a Sim (Sims Wiki: The Magic Realm, Spellcaster). Realm of Magic is installed.
- Her Tiquelles so far: Louisa (legacy founder) and Jemma (her Self Sim), both young adults in her Library (`research/own-households-review.md`). Uploading “the four Tiquelle households” is a Do on her list.
- On her map they’re in different groups: Windenburg with Brindleton Bay and Nordhaven, Glimmerbrook (the Magic Realm’s portal) with Granite Falls and Innisgreen (memory: world geography).

**Change to the game:** small: her own family gets a life state; nothing EA ships changes, and the Glimmerstone does the real travelling.

**Pick:** Yes: her own uploads already tell this story, and it needs nothing she doesn’t own.

---

## 7. Karaoke Legends (San Myshuno)

**Question:** Once Miko leaves to live with Alicia, do Akira and Darling come as EA made them or as in her “Rotational” save, and do they live at 1313 21 Chic Street?

**Options:** EA’s version, or her “Rotational” one. Home: 1313 21 Chic Street (Fashion District, free), to check first.

**Facts:**
- EA’s Karaoke Legends: Miko Ojo (YA), Akira Kibo (YA) and Darling Walsh (teen) at 701 ZenView; the bio is Miko’s crush on Kibo (game files, `research/data/premades.json`, `household-bios.json`).
- The plan already has Miko with Alicia Santiago at FountainView Penthouse (from “Rotational”; on the Gallery as “Santiago Ojo”), and gives 701 ZenView to Bro & Kennedy (`san-myshuno.json`).
- “Rotational” (copy read 31 Oct): Akira is married to Juliana Kibo with baby Giancarlo at 701 ZenView; Darling (YA) is married to Fabio Stracciatello at 702 ZenView (the Behrs’ home in the plan). Both households were unplayed there; Juliana and Fabio aren’t EA premades (not in the game’s premade files). Rotational is the save the site’s Miko came from.
- Her rule: EA’s premade families come from the game’s files unless she says otherwise (CLAUDE.md).
- 1313 21 Chic Street: Empty in the plan, built, not shared, so its bedroom count isn’t known from the Gallery. EA’s version has 2 bedrooms, 1 bathroom, Needs TLC (untouched save). It’s in the Fashion District, like 701 ZenView and the planned karaoke bar Torendi Tunes.
- Clash: the homes proposal puts the Ferraras (hers, at 1313 in “Rotational”) there (`for-jemma/homes-proposal.md`).

**Change to the game:** EA’s version: small (two EA housemates move flat). Rotational: medium (two townie spouses and a baby join, and they need two homes).

**Pick:** EA’s version at 1313 21 Chic Street: it follows her premade rule and two Sims fit two bedrooms (then the Ferraras need another flat).

---

## 8. Bro & Kennedy (701 ZenView, San Myshuno)

**Question:** Which Kennedy lives with Bro (Joaquin Le Chien and Sergio Romeo)?

**Options:** Tristan Kennedy, or Kennedy Thomason, Duggan or Rouse.

**Facts:**
- The name comes only from her spreadsheet (“Bro & Kennedy”). No save, old or new, has a household of that name; the site’s household is just EA’s Bro (`old-chat-build/new.json`; household lists from all 24 save files, 31 Oct).
- **Tristan Kennedy: not found** in any save left (checked every save file’s households). “Season Events” has a Tristan Coleman. He may have been in one of the 12 saves she deleted 25–28 Oct.
- Kennedy Thomason and Kennedy Duggan (“Building #2”) and Kennedy Rouse (“Season Events”, with a cat, Paco) are all young women with no home, made by MCCC’s population tool (household creator “mc_population”).
- No save has any relationship between a Kennedy and Joaquin or Sergio. In EA’s own data Sergio is going steady with Siobhan Fyres (`research/inter-household-relationships.md`). In “Rotational” Joaquin married Leslie Holland.
- 701 ZenView in EA’s version has 2 bedrooms (untouched save).

**Change to the game:** small whichever (a townie moves in), but none of them has a story with Bro.

**Pick:** Kennedy Rouse, if she wants a Kennedy at all (the newest save, and a pet); if none rings a bell, the facts support just EA’s Bro.

---

## 9. LaSuli Point (Copperdale)

**Question:** Should LaSuli Point be a Park or a Cemetery?

**Options:** Park (needs one piece of playground kit), or Cemetery.

**Facts:**
- Plan: Plumbite Cove, 20×15, “Park/Cemetery”, not built (`copperdale.json`). EA: a 2-bedroom starter home “a stone’s throw away from the Pier” (game text).
- Copperdale has no park and no cemetery now; Totter Park, EA’s only park there, is the Prices’ home.
- Game requirements: Park: toilet, sink, 2 benches, chess table, patio table, 4 outdoor chairs, 1 playground item. Cemetery: 1 grave or urn, toilet, 2 benches, bin (gravesites, crypt and casket optional) (venue tuning).
- The prom after-party is on Plumbite Cove’s pier, and with Totter Park a home the only public lots there are BridgeCreek Drive (Backroom) and LaSuli Point (`research/students-and-schools.md`).
- Plumbite Cove already has a haunted house (Hillside Haven, the Donovan-Haynes) (`copperdale.json`).
- Funerals can be held on a Park too (TODO.md, 16 Oct). Her map puts Copperdale between the city group (with Willow Creek, which has Cordelia Church’s cemetery) and Britechester (memory: world geography).
- Her view (15 Oct): a teen area, so not a playground.

**Change to the game:** both re-type EA’s starter home; Park is the smaller step (Copperdale had one).

**Pick:** Park: Copperdale’s only park, a public spot by the pier for the teens, and one playground item is all it costs.

---

## 10. Key Point (Sulani)

**Question:** Is Key Point a castaway hut as a Vacation Rental, or Generic?

**Options:** a castaway hut as a Vacation Rental, or Generic (can be Off-the-Grid).

**Facts:**
- Plan: Mua Pel’am, 40×30, “To be decided”, not built (`sulani.json`). Game text: “This classic deserted islet … the perfect untouched beach.”
- EA ships it with **Oceanic Paradise and Off-the-Grid** (untouched save).
- Off-the-Grid is allowed only on Residential, Generic, Tiny Home, Haunted House, Residential Rental and Small Business Venue (game tuning). On a Vacation Rental it would have to go.
- Generic: no visitors come by themselves (`research/lot-types-reference.md`); it can host a Getaway. A Vacation Rental can’t host a Getaway, but others can book it (`research/getaways-check.md`).
- Her wish (15–16 Oct): minimal structure; not a market, park or custom venue (TODO.md).
- If Lagoon of Love becomes a Wedding Venue (item 1), Sulani has no Vacation Rental left; a hut here would be its only one.

**Change to the game:** Generic: small, keeps EA’s two traits. Vacation Rental: small, drops EA’s Off-the-Grid.

**Pick:** Generic: it keeps the game’s Off-the-Grid and her “minimal”, and can still host a castaway Getaway (choose the hut if Sulani should keep a holiday let after item 1).

---

## 11. Caldera Camp (Sulani)

**Question:** Should Caldera Camp get Geothermal and Natural Well in its two free trait slots?

**Options:** add Geothermal and Natural Well, or not.

**Facts:**
- Plan: Mua Pel’am, 30×20, Residential, “Mine” (her Sims to come), built and shared; trait Eco Lot; challenges Volcanic Activity and Off-the-Grid (`sulani.json`). The new save has the same (`new-save-status.json`). Challenges don’t take trait slots (Coorinberg Cottage has 3 traits plus a challenge in the save), so 2 slots are free.
- EA ships it with Volcanic Activity only (untouched save).
- Her upload: a “ramshackle shelter … at the base of an active volcano … the solar panels and dew collector do provide a small amount”, tagged #offthegrid #ecolot #volcanicactivity.
- Game: Geothermal and Natural Well each add to the household’s power and water (`commodity_Utilities_Power` and `commodity_Utilities_Water`; the tuning’s rate works out at about 29 units a day); those are the stores an Off-the-Grid lot runs on. Geothermal also keeps pools warm; Natural Well gives a fresh-water moodlet (tuning; trait texts). That they keep the lights on in practice is untested.
- 21 Oct: “not yet”, her call (TODO.md).

**Change to the game:** small (two traits on her own lot).

**Pick:** Yes, add both: they fit the volcano story and should top up the camp’s own solar and dew power.

---

## 12. Moonwood Mill Library (not owned)

**Question:** Is the Moonwood Mill Library a Library or a Backroom?

**Options:** Library, or Backroom (a Backroom has no librarian; Wolfgang loses his job).

**Facts:**
- Plan: 40×30, “Library/Backroom”, not built; Werewolves isn’t installed (`moonwood-mill.json`; GP12 folder absent).
- EA’s text: an old logging factory turned into a library, and “out back, the Wildfangs have dragged old workout equipment … a handy make-shift gym” (game text).
- Wolfgang Wilder, EA’s werewolf townie, works as its librarian (Sims Wiki).
- Checked in the game’s files: in Moonwood Mill, the Library runs its own librarian (`situation_LibraryVenue_Librarian_WolfTown`). The Backroom only has the ordinary librarian, which is switched off in Moonwood Mill, and all three of its bartenders are switched off there too. So a Moonwood Backroom gets no librarian by day and no bartender by night.
- Backrooms: 7 in owned worlds plus Garliclauter Place = 8, the top of her 5–8 range; this would make 9 (TODO.md §8).

**Change to the game:** Library: none. Backroom: medium (Wolfgang’s job and the night bar staff go).

**Pick:** Library: it keeps EA’s Wolfgang and a working venue; decide for good when she buys Werewolves.

---

## 13. Specter Row (Ravenwood)

**Question:** Is Specter Row a 2-unit rental with On Hallowed Grounds, or a Haunted House?

**Options:** a 2-unit rental with On Hallowed Ground, or a Haunted House.

**Facts:**
- Plan: Moppy Manor, Crow’s Crossing, 30×20, “Residential Rental/Haunted House Residential”, residents “Specter (rent out)”, Stats “Specter + tenants”, not built (`ravenwood.json`).
- **Contradiction to note:** the site’s Specter household (Olive, Layne, Nyon) lives at **Havisham House, Windenburg** (her upload: 2 bedrooms) (`windenburg.json`), while the TODO rentals table says “Specters’ home + tenants” (TODO.md §2).
- EA’s Moppy Manor: 1 bedroom, 1 bathroom, no traits; game text has the Moppy statue’s glowing eyes and flickering lights next door (untouched save; game text). EA’s Specter Family Manor (now her Wedding Hall) has On Hallowed Grounds.
- A lot takes one type. A Haunted House is one household’s home, so it can’t be let out. On Hallowed Grounds has no lot-type limit, so it works on rental units (tuning).
- Ravenwood already plans two haunted houses (Old Ravenwood Estate, The Cozy Casket House).
- The homes proposal puts Ophelia Specter (Olive’s niece, Maxis upload) in a Specter Row unit.

**Change to the game:** rental: small to medium (EA’s one-bedroom home rebuilt as two units; it isn’t built yet either way). Haunted House: small (one type), but no tenants, and Ravenwood’s third.

**Pick:** 2-unit rental with On Hallowed Grounds: it’s the only option that matches “rent out”, whether the Specters live there or in Windenburg.

---

## 14. Mystic Crossroads (Ravenwood)

**Question:** Do the Izadi-Gomes ghosts own the Mystic Crossroads tarot and curiosities shop?

**Options:** yes, or no.

**Facts:**
- Plan: Mourningvale, 30×30, “Small Business Venue (Tarot & Curiosities)”, owner to pick, not built (`ravenwood.json`). Game text: “Recently deceased? Living but Macabre? … a charming afterlife aesthetic.”
- The Izadi-Gomes household (Esther Gomes and Zuleika Izadi, both ghosts, both Macabre, both working for Grim) live at Mourning Mist Manor, also in Mourningvale. Esther’s aspiration is Ghost Historian; Zuleika’s Freelance Botanist (`ravenwood.json`).
- Esther is aunt to teen Zelmira Gomes, who in EA’s bio took up the afterlife “after finding a tarot card”. Household members and Sims a business owner knows can be hired as staff (Sims Wiki, Small business).
- A household runs a Small Business Venue on a lot it owns, one open business at a time (Sims Wiki, Small business; `research/owners-and-pleasants.md`). The Izadi-Gomes run no business in the plan.
- Ravenwood’s seasons mod was swapped for a patched copy on 30 Oct that keeps the Small Business lot type there (her list).

**Change to the game:** small (an EA household owns a shop next door).

**Pick:** Yes: the game’s own text pitches the lot at ghosts, and they live in the same neighbourhood.

---

## 15. Paradise Stables (Gibbi Point)

**Question:** Who lives at Paradise Stables: a horse family of hers running Riding Stables?

**Options:** a horse family of hers running Riding Stables (or someone else).

**Facts:**
- Plan: Prospector’s Paradise, Crystal Valley, 40×30, Residential, “? (Horses!)”, built, not shared (`gibbi-point.json`). EA: an empty lot by Scoop’s Gold (crystal panning) (game text).
- It’s Gibbi Point’s only free home and its only horse place (`research/pets-and-horses.md`). Overlaps “Who lives where”: the homes proposal says “keep for a horse family”.
- Neither the homes proposal nor the own-households notes name a horse family of hers still without a home, so one would be made (`homes-proposal.md`, `research/own-households-recommendations.md`).
- Also needing a Gibbi Point home: Merrilyn Ralston, Nigel Chavez-Ralston’s mother (Maxis Gallery; a Do on her list). TODO 23 Oct names Paradise Stables as the only open home. Item 16 could free Miner’s Manse for her.
- Story idea on file: the Kunals (Laxmi and Raheel, EA’s homeless outdoorsy pair) (`research/story-ideas.md`); the homes proposal leaves them as NPCs.
- A business run from home keeps the lot Residential (so Getaways still work) and shows as “Small Business Residential” (game text; `research/love-highland-business.md`).

**Change to the game:** small (an empty EA lot gets a household of hers).

**Pick:** A horse family of hers running riding stables: it suits the build and its name, and Merrilyn can go to Miner’s Manse if item 16 goes that way.

---

## 16. Love Highland (Gibbi Point)

**Question:** Is Love Highland a Custom Venue the Addams run as story only, or their home again?

**Options:** a Custom Venue run by the Addams as story only, or their home again.

**Facts:**
- Plan: Love Highland is a Custom Venue, “Addam Commune (their Getaway business; they live at Miner’s Manse)”; Miner’s Manse is Residential, Addam Commune; both not built (`gibbi-point.json`). Her 16 Oct choice.
- EA: Love Highland is the Addams’ home, 8 bedrooms, 3 bathrooms (“Love is in the air at this coveted Getaway lot”); Miner’s Manse is empty, 3 bedrooms (untouched save; game text). The Addam Commune is 4 Sims.
- A Custom Venue can’t be owned or run as a business; only a Getaway at a household’s own home earns money and tips (`research/love-highland-business.md`, `getaways-check.md`).
- New: the game has the text “Small Businesses cannot be opened during a Getaway!”, so at home it’s Getaways or the business at any one time (game text).
- If the Addams go back, Miner’s Manse is free: a Gibbi Point home for Merrilyn Ralston (item 15).

**Change to the game:** home again: none (EA’s own set-up). Custom Venue: medium, and the money side doesn’t work in game.

**Pick:** Their home again: it’s how EA ships it, the Getaways earn as the story says, and Miner’s Manse frees up.

---

## 17. Revive and Thrive (Gibbi Point)

**Correction (31 Oct, evening):** it does have beds: six double beds in glamping tents (“Building #2”). The upload's 0 bedrooms only means none are in walled bedrooms. The facts below are wrong on this point.

**Question:** Should Revive and Thrive get beds for overnight stays?

**Options:** add beds for overnight stays, or keep day Getaways only.

**Facts:**
- Plan: Hothead Rock Hideaway, Wanderwood Wilds, 64×64, Custom Venue, built and shared (`gibbi-point.json`). Upload: 0 beds; “Revive and Thrive have expanded to a new location … fitness … yoga to a natural hot spring … spin class and have a massage after”, tagged #getaway.
- EA’s original Revive and Thrive Retreat (8 beds) is her Gibbi Rec Center now (untouched save; plan).
- The Fitness Retreat preset sleeps at midnight; the game warns when an overnight Getaway hasn’t enough beds. Day Getaways work as it is (`getaways-check.md`).
- Overnight stays in Gibbi Point would still be possible at Camp Gibbi Gibbi (EA’s: 4 bedrooms) and Love Highland (EA’s: 8 bedrooms), both not built yet (untouched save).
- Her preference: built lots aren’t rebuilt if it can be helped (`research/undecided-lots.md`).

**Change to the game:** none either way to EA; adding beds is a rebuild and re-upload of a shared 64×64 build.

**Pick:** No, keep it for day trips: her text and build are a day spa, and Gibbi Point keeps two overnight places.

---

## 18. Owners: three venues

**Question:** Who owns the Plumbob Pictures Museum, The Llama Picturehouse and Canalside Daycare?

**Options:** Plumbob Pictures Museum: Judith Ward? Llama Picturehouse: the LeBlancs, or a Bar (no owner). Canalside Daycare: open.

**Facts:**
- **Plumbob Pictures Museum** (Del Sol Valley, 40×30, “Small Business Venue (Museum, Acting Classes & Café)”, not built). Judith Ward: EA’s actress (level 8), Mansion Baron, lives alone at The Ward Den; bio: “a legend in the acting community … to get rich at all costs” (`del-sol-valley.json`). Other ideas: Johnny Zest, Holly Alto (`research/owners-and-pleasants.md`).
- **The Llama Picturehouse** (Magnolia Promenade, 20×20, “Small Business Venue/Bar”, built and shared). Two uploads, Bar and Small Business; the Small Business one leads. Her text: “the finest cinema for miles around … for that romantic date” (`uploads.json`). The LeBlancs (hers, Newcrest) run no business; Max (teen) is a Master Actor; their neighbourhood is Llama Lagoon. As a plain Bar it runs itself with no owner.
- **Canalside Daycare** (Nordhaven, 20×20, Small Business Residential, “?”, built and shared). Upload: 2 bedrooms upstairs, “the other two townhouses are empty” (`nordhaven.json`, `uploads.json`). Ideas on file: the Branches (Maxis’s Businesses & Hobbies trailer family: engaged Amalia and Otto with Amalia’s son Leif; 2 bedrooms; the homes proposal’s pick), the Koopmans’ daughter (a new Sim), the Munches (would move world), Bruno Hoffman (`homes-proposal.md`, `owners-and-pleasants.md`).
- One open business per household (Sims Wiki, via `owners-and-pleasants.md`); none of these candidates runs one in the plan.

**Change to the game:** museum and picturehouse: none (an owner named). Daycare: small (a Maxis Gallery family moves in).

**Pick:** Judith Ward for the museum (EA’s own acting legend); the LeBlancs for the Picturehouse (the llama link, next door in Newcrest); the Branches for the daycare (they fit its 2 bedrooms and come from the pack’s own trailer).

---

## 19. Small business lot labels (stale)

**Question:** Do small business lots keep her label “Small Business Residential”, or use the game’s names?

**Options:** keep her labels (Small Business Residential), or the game’s names.

**Facts:**
- Not decided before (checked 31 Oct): TODO.md moved the 15 Oct note onto her list on 23 Oct. That note called “Small Business Residential” her own label, which was wrong:
- “Small Business Residential” is the game’s own text (game strings), so there’s no clash.
- The plan follows it: 8 Small Business Residential, 8 Small Business Venue (4 of them with her note or a second type, e.g. “(Tarot & Curiosities)”, “/Bar”) (`data/worlds/*.json`).

**Change to the game:** none.

**Pick:** Take it off the list: her labels already are the game’s own two names, so there is nothing to choose.

---

## 20. Gnomes on venues

**Question:** Swap the Gnomes trait on Burners & Builders, Pixel Café and The Llama Picturehouse when adding them to the new save?

**Options:** swap it, or keep it.

**Facts:**
- Game text: “Broken things just seem to get mended overnight.” In the tuning it fires around 3 am only if at least one Sim on the lot is asleep and nobody is awake (`buff_Sim_IsSleeping`), so on a venue it never happens.
- Current traits (plan and new save): Burners & Builders (gym) Bracing Breezes, Sunny Aspect, Gnomes; Pixel Café Fast Internet, Party Place, Gnomes; Llama Picturehouse Party Place, Convivial, Gnomes.
- Ideas on file: Pixel Café Convivial; Picturehouse Romantic Aura (her text says “romantic date”); gym Party Place (Homey was also suggested, but it helps cooking, mixology, handiness and gardening, not exercise) (`research/lot-trait-ideas.md`; trait texts). None of these has a lot-type limit.
- 23 Oct: she’ll decide when adding them to the new save; they’re placed in the current one, which will be restarted (TODO.md history; memory: new save).

**Change to the game:** small (one trait on three of her lots).

**Pick:** Swap it: Pixel Café Convivial, the Picturehouse Romantic Aura, the gym Party Place.

---

## 21. Empty rental units (covered by “Who lives where”)

**Question:** Who fills the empty units at Rockridge Springs, Old Torget House, Manzanita Terrace and Slip 42 (For Rent pets?)

**Options:** none given (the list asks “who?”).

**Facts:**
- “Who lives where” covers these units (the homes proposal has a pick for each), so this item is folded into that one.
- The “For Rent pets?” part is already answered: her 28 Oct call keeps For Rent’s tenant applicants out (her list, Who lives where). Kitty Lu and Dara Kham only come as applicants (`research/pets-and-horses.md`).
- **The proposal undercounts three of them:** Old Torget House has 3 empty units (proposal says 2), Manzanita Terrace 3 (the Robles live at Robles Point; proposal says 2), Slip 42 2 (proposal says 1). Rockridge Springs has 2 (Greenburgs in unit 1), as the proposal says (`nordhaven.json`, `san-sequoia.json`, `strangerville.json`, `evergreen-harbor.json`; TODO.md §2).

**Change to the game:** see “Who lives where”.

**Pick:** Decide them with “Who lives where” and take this line off; the proposal needs one more pick each for Old Torget House, Manzanita Terrace and Slip 42.

---

## 22. Links only an old save has

**Question:** Keep any of the family and partner links that only an old save has?

**Options:** keep any (which), or none.

**Facts:**
- 24 family links and 13 partner links come only from old saves; 7 and 2 of them are already in the new save, from EA’s own data (`research/inter-household-relationships.md`).
- Almost all come from households she wasn’t playing in that save, so Neighbourhood Stories made them (household lists, 31 Oct). Several clash with the plan or each other: Dylan Sigworth and Mila Munch dead; Marcel Price living with Sienna Grove as “Marcel Grove”, the Price children her step-children (“Horses!”); “Season Events” has Dina Caliente married to Raj Rasoya and also Diego Lobo listed as Dina’s widower; Joaquin married to Leslie Holland (“Rotational”).
- The exception: the **Watsons** in “Return to the HOB”, where both Watson households were played. There Natalie Watson-Holmes is Thomas Watson’s sister, so her daughter Daisy is cousin to the Watson children (8 links). The site’s Watson-Holmes household (hers, on the Gallery) comes from that save, and her name already says Watson.
- Already settled: Savannah Kopf is a townie, not a Fyres (her call, 24 Oct).
- Two links ride on other items: Dustin and Jess (item 5), Joaquin and Leslie (item 8).

**Change to the game:** each kept link is an MCCC edit in the new save; none of EA’s links change.

**Pick:** Keep only the Watson links: they’re the only ones from households she played that fit the plan.

---

## 23. EA’s new family-tree ancestors

**Question:** Add the 25 ancestors EA’s Feb 2026 update put in new saves to the site’s family trees?

**Options:** add them, or not.

**Facts:**
- 38 dead ancestors come with every save made after the 3 Feb 2026 update; 13 are on the site already and match (`research/new-save-ancestors.md`). So the restarted new save should have them too (whether a premade-fix mod changes them: not checked).
- **Two of the 25 are on the site already, under other surnames:** “Cahya Cahyaputri” and “Wulan Cahyaputri” (late, marked not in game) are the game’s Cahya Bapak and Wulan Ibu, the Cahyaputri sisters’ parents (`data/people.json`). (Bapak and Ibu are Indonesian for Mr/father and Mrs/mother.)
- Where the rest go: 11 on the Thebe line (Queen Thebe and Eethion; Andromache and Hector, Consort Capp’s parents; Cordelia Thebe II–IV down to Cordelia V; JWBB; Rodrigo De Pablo, Rodrigo Thebe and an Unknown Thebe); 10 on the Darong tree (Adekoya’s parents Ade and Eniola, Jawara’s mother Imani, an Unknown Darong, Lina and Sef Darong, and through them the Dreamers: Delilah, Davis, Darren and Darleen); 1 Unknown Alto (Nick and Bert Alto’s parent).
- Pranav Kunal’s children Laxmi and Raheel aren’t on the site, so he’d join no tree (`people.json`, world files).
- “Unknown …” and “JWBB” look like EA placeholders; the site already shows unnamed parents as empty boxes (`people.json` note).
- Her rule: EA’s premades come from the game’s own files (CLAUDE.md).

**Change to the game:** none (site only; the game already has them).

**Pick:** Yes, add all but Pranav Kunal (rename Cahya and Wulan): it’s EA’s own tree in every new save and follows her premade rule.

---

## 24. Typing Sims in (overtaken)

**Question:** Does she type Sims in chat only, or in a Sims tab in World Plans?

**Options:** chat only, or a Sims tab in World Plans (prototype in for-jemma/prototypes).

**Facts:**
- The prototype (`for-jemma/prototypes/world-plans-sims-tab.xlsx`, 17 Oct) predates three later calls: she edits in chat and the spreadsheet is a copy (22 Oct); she said no to an extra Rental units tab (22 Oct); her own households come from her Gallery uploads, one each, read by the tools (19 and 24 Oct) (CLAUDE.md; memory: Sims source).
- If a tab were used, the importer would need a change so it doesn’t treat the new tabs as worlds (TODO.md).

**Change to the game:** none.

**Pick:** Chat only: the Sims now come from her Gallery uploads, and later calls already chose chat over new spreadsheet tabs.

---

## 25. Going online

**Question:** Put the site online so she can open it on other devices?

**Options:** only if she ever wants it on other devices (free and private with Cloudflare).

**Facts:**
- Cloudflare Pages with Cloudflare Access: free and private, people she lists get an email code (`research/going-online.md`, 17 Oct).
- Since then: fonts are local and the phone layout is done (22 Oct), and the Lucide licence file is in (19 Oct) (HANDOVER.md, CLAUDE.md).
- New: `site/` is now 1,380 files and 139 MB (was 743 files, 102 MB). That’s over the 1,000 files Cloudflare takes by drag and drop, so uploading would need its command-line tool, which needs Node.js (not installed) (`going-online.md`; count taken 31 Oct).
- The weekly refresh only rebuilds on her PC, so the online copy would need an upload step each week. Admin is “PC only for now” (her call, 23 Oct).
- Anything public would first need other players’ comments taken out and the map mod’s terms checked.

**Change to the game:** none.

**Pick:** Not now: she uses it on her PC, and going online now takes extra set-up each week.

---

## Couldn’t settle

- **Tristan Kennedy (item 8):** not in any save left; possibly in a save she deleted.
- **Hallow Slough’s build (item 4):** which build goes on the lot is part of the parked Cadberry job; not read from saves (her rule: nothing from saves for unshared lots).
- **1313 21 Chic Street’s bedrooms (item 7):** her build isn’t on the Gallery; only EA’s version (2 bedrooms) is known.
- **Geothermal and Natural Well on an off-grid lot (item 11):** the tuning says they add to the same power and water stores; untested in game.
- **Where the Specters live (item 13):** the site says Havisham House; TODO.md says Specter Row.
