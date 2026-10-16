# Townies and roles: who works where, and who gets a home (overnight 16–17 Oct)

Research only. Nothing in the plan, on the site, in `tools/` or in `TODO.md` was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own tuning (which staff each lot type sends, who may fill each job, Neighbourhood Stories, culling), read with `tools/research/tuning.py`.
- The game’s own English text (option names and help pages), read with `tools/sims4files.py`.
- The Sims Wiki: Townie, Non-playable character, Pre-made (The Sims 4), Story progression, Manage Worlds, Landlord, Bartender, DJ, Patches 57, 121 and 125, and a page per premade named below.
- Her plan (`data/worlds/*.json`), TODO.md and the world notes.

---

## In short

- **Venue jobs fill themselves.** Each job (bartender, librarian, vendor…) looks for an unplayed Sim with the right NPC job. If nobody fits, the game makes up a new Sim. **Nobody needs a home to work.**
- **Some jobs want a named premade:** the Scotts pull pints in Henford, Wolfgang Wilder runs the Moonwood Mill library, Eloise Hiddlestix runs Thrift and Boba Stores, Ekene Ananou sells at Community Markets, Panya Li owns every rental nobody else owns.
- **A named premade keeps the job only while unplayed and alive.** Play them, add them to a played household, delete them or lose them to culling, and a stranger takes the job.
- **Homeless premades can be moved into empty homes** by Neighbourhood Stories (its “Move In” rule), and **can be culled** if the save gets too full, unless they’re in My Households.
- **Empty homes with beds get filled** by Neighbourhood Stories, with homeless townies or brand-new households. Willow Creek and Oasis Springs also have an older weekly top-up.
- **One planned change breaks a role:** The Moonwood Mill Library as a Backroom would have **no librarian and no bartender at all** (a gap in the game’s tuning). **One idea won’t work:** the Crumplebottoms as tea-room owners.
- **To protect the plan:** switch off “Move In” and “Move Out” for Other Households (or Neighbourhood Stories altogether), raise the Maximum Sim Count, and heart (My Households) the households she cares about.

---

## 1. How the game fills venue jobs

Each lot type has a “zone director” that sends staff on a schedule. Each staff job has a filter: an unplayed Sim with the matching NPC job comes first, otherwise the game makes one up. Some filters also take an unimportant townie with no career. In Henford, Moonwood Mill, StrangerVille, Tomarang, Nordhaven, Chestnut Ridge, Sulani and the magic worlds, jobs prefer Sims who live in that world.

Counts are her owned worlds.

| Lot type (her lots) | Staff the game sends | Notes |
|---|---|---|
| Bar (14) | Bartender | Henford’s bartender is always the pub owners (the Scotts). Moonwood Mill’s is Celene López. Selvadorada uses a local |
| Nightclub (7) | Bartender, DJ | |
| Lounge (4) | Bartender, comedian or musician | Needs a microphone or instrument for the entertainers |
| Karaoke Bar (3) | Bartender | |
| Café (3) | Barista | |
| Library (13) | Librarian | Moonwood Mill has its own librarian job (Wolfgang). StrangerVille’s libraries also get scientists and conspiracy theorists as readers |
| Gym (4) | Trainer; massage, reflexology and yoga staff if that kit is there | |
| Spa (3) | Massage, reflexology and yoga staff; bartender if there’s a bar | |
| Onsen Bathhouse (3) | Bathhouse employee, yoga instructor | |
| Restaurant (11) | Chef, host, waiters; bartender if there’s a bar | |
| Arts Center (2) | Musicians; bartender if there’s a bar | |
| Backroom (5) | Day: librarian or gym trainer (museum lots get visitors only). Night: bartender, DJ | Not in Moonwood Mill (see §4) |
| Community Market (4) | 1–2 vendors and a cook | Ekene Ananou (Ondarion, 18 Bright Cliff) is the preferred vendor |
| Thrift and Boba Store (5) | Shop owner, bubble tea counter | Owner must be a young adult with the shop-owner trait: Eloise Hiddlestix |
| Beach (2) | Lifeguard | |
| Cemetery (3) | Cemetery keeper, day and night | Any adult |
| Vet Clinic (5) | NPC vets while no played household is running it | Vets come from Sims whose household has never been played |
| Recreation Center (4) | Musicians in the art space | No other staff |
| Museum, Park, Playground, Pool, Wedding Venue, National Park, Community Space | No staff | Wedding staff come through the wedding planner |
| Custom Venue (6) | The roles she sets | Filled with matching Sims if she names nobody |
| Small Business (14, home or venue) | The owner household and the employees it hires | Needs an owner to open |
| Residential Rental (20) | The property owner | Panya Li when no household owns it |
| Apartments (San Myshuno, Evergreen Harbor) | A landlord | A made-up townie with good Handiness |

---

## 2. Named premades with a job or a place, in her worlds

Most homeless premades have no job at all and are simply townies. These are the ones the game ties to something.

| World | Who | Job or place | In her plan | OK? |
|---|---|---|---|---|
| Henford | Sara and Simon Scott | Own The Gnome’s Arms; Henford’s only bartenders. Their game home is 3 Cobblebottom Street | Moved out (it’s Moody & McMillan’s rental); listed on the pub as NPCs | Yes, while unplayed. Evict, don’t delete |
| Henford | Lavina Chopra | Mayor; judges the Finchwick Fair | Homeless (her choice) | Yes |
| Henford | Rahul Chopra | Grocery deliverer | Homeless | Yes |
| Henford | Kim Goldbloom | Grocery stall | – | Yes |
| Henford | Michael Bell | Creature keeper (his cottage in the woods isn’t a lot) | – | Yes |
| Henford | Agnes and Agatha Crumplebottom | Garden stall; a hidden household | Tea-room owner idea | **No** (§4) |
| Copperdale | Mei Prescott | Principal | The Prescotts at Golden Peak | Yes; a stranger stands in while she’s played |
| Copperdale | Rita Coombes, Anjelo Morlind | Teachers | – | Yes |
| Copperdale | Eloise Hiddlestix | Thrift shop owner | The game’s ThrifTea lot is now Prescott Boarding House | Yes: the job follows the lot type, so she runs Town Square Stores |
| Britechester | Serena Bhamra, Jing Fen, Thomas Jabari, Lana McKinnon | May be picked as professors | Homeless | Yes |
| The Magic Realm | Morgyn Ember, L. Faba, Simeon Silversweater | The three sages | – | Yes |
| StrangerVille | Erwin Pries (hidden) | Curio shop | – | Yes |
| Chestnut Ridge | Roberto Crinkletop (hidden) | Mysterious Rancher | – | Yes |
| Tomarang | Panya Li (hidden; never ages or dies) | Owner of every rental nobody owns; Sungai Point in the game | Sungai Point has no landlord named | Yes |
| Tomarang | The Cahyaputris | Own Taka Soi 15 | As in the game | Yes |
| Nordhaven | Felix and Bruno Hoffman | Candy stall | Homeless (Old Torget House was an idea) | Yes either way, while unplayed |
| Nordhaven | Lodens, Koopmans, Sarpongs | Run their home businesses | As in the game | Yes |
| Nordhaven | Corey Nyhus, Zain Amri | Ordinary careers (mixology, entertainer), not venue jobs | Homeless | Yes |
| Ondarion | Fia Acosta (hidden) | The Royal Robber; a regular at Ondarion’s bars | Homeless; Ye Olde Voyager stays a Bar | Yes |
| Ondarion | Connie Fidential (hidden) | Info broker: buys and sells the dynasties’ secrets | Homeless | Yes |
| Ondarion | Akachi Onoja | A count (noble career) | Homeless | Yes |
| Ondarion | Consort Capp | Ghost who haunts his descendants | Homeless | Yes |
| Ondarion | Ekene Ananou | Market vendor | 18 Bright Cliff | Yes; stops while played |
| Windenburg | Mimsy and Bernard (hidden) | Ghosts at Von-Haunt Estate | Kept as Chalet Gardens | Yes |
| Granite Falls | The hermit (made at the start) | Hermit’s House | Kept as Hermit’s Hut | Yes |
| Gibbi Point | Toshie Akamine, Pruella Preener, Buddy Scoop (hidden); Laxmi and Raheel Kunal (homeless) | Toshie is the storyteller; the others are local NPCs (roles not checked) | – | Yes |
| Ravenwood | Waylon Warez, Alice, Edith (hidden ghosts) | Merchant and quests | – | Yes |
| Not owned | Wolfgang Wilder, Celene López (Moonwood Mill) | Librarian; bartender at the Grimtooth Bar | Homeless | Wolfgang **no** if the library becomes a Backroom (§4) |
| Not owned | Faiz Jaleel (Tartosa); Glen Nhoam, Todd Attenberry (Innisgreen) | Flower cart; Gnum Gnum’s stall; apothecary stall | Faiz homeless; Glen and Todd housed | Yes (Todd: §4) |

Homeless with no job: Del Sol Valley’s seven celebrities, Sulani’s four mermaids (three can’t be edited at all), Kyle Kyleson and Lou Howell. Mayor Whiskers and Captain Whitaker are strays.

Correction to research/worlds/gibbi-point.md: it says nobody there is without a home; the Wiki’s premade list has Laxmi and Raheel Kunal as homeless townies.

---

## 3. Homes: homeless Sims, empty homes and culling

**Homeless premades** are listed under Manage Households → Other Households (hidden ones aren’t listed and can’t be moved in without cheats). They work their jobs from no home at all.

**Neighbourhood Stories** (since November 2021, configurable since March 2022):
- Switched on or off in Game Options → Gameplay → “Enable Neighborhood Stories”.
- Set per tab (My Households, Other Households) or per household in Manage Households.
- Its rules: Move In, Move Out, Have a Baby, Adopt a Child, Adopt Cats & Dogs, Rescue Horses, Join a Career, Leave a Career, Retire from Career, Die in Accidents, Friendship Changes, Romance Changes.
- **By default it’s on for Other Households (every rule) and off for My Households.**
- **Move In:** “Households may move into unoccupied lots of any Residential world.” The game’s help adds that the lot must be Residential with enough beds. It can use a homeless household or make up a new one (the tuning has ready-made household types for the EA homes in most worlds).
- **Move Out:** “Households in Residential worlds may vacate lots.”

**The older weekly top-up** (game tuning, not an option):
- Every Wednesday 2–4 am the game moves households into **Willow Creek** until about 80% of its homes are lived in, and **Oasis Springs** to about 60%.
- A new save starts them at 60% and 50%, and adds 5 homeless households.
- Her plan: Willow Creek has no empty homes; Oasis Springs has 4 (Sandtrap Flat, Pebble Burrow, Vista Quarry Villa, Springscape), so 9 of 13 lived in, already above 60%.
- I couldn’t confirm whether switching off Neighbourhood Stories also stops this.

**Holiday lots:** the game fills Granite Falls’ cabins and Selvadorada’s vacation rentals with holidaymakers for about 3 days at a time.

**Culling (the game deleting Sims):**
- **Maximum Sim Count** (Game Options → Gameplay, since November 2017) sets how many Sims may be in **My Households**, which are never culled. Choices: 80, 150, 200 or Unlimited (the game warns Unlimited slows it down and may crash).
- **Other Households can be culled** when the save goes over its limit (170 Sims at the usual level, plus 15%). The game keeps the Sims best connected to played Sims and seen most recently; fame helps. Its population rule looks at Sims who don’t live on a lot, so homeless premades are the most at risk.
- If a named role Sim is culled, the job goes on with a made-up stranger.

**Her empty homes:** 49 homes, flats, dorms and rentals stand empty in her owned worlds, most of them built (so they have beds). The most: San Myshuno 10 flats, Henford 5 (1 Cobblebottom Street, The Olde Mill, Cordelia’s Secret Cottage, 13 and 14 Nettle Lane), Oasis Springs 4, Brindleton Bay 4, Windenburg 4. Empty rental units are filled by their owner; I didn’t check whether Neighbourhood Stories also fills Panya Li’s.

---

## 4. Changes in her plan that touch a role

**1. The Moonwood Mill Library as a Backroom: breaks it (when she owns Werewolves).**
- A Library in Moonwood Mill sends Moonwood’s own librarian (Wolfgang); the ordinary librarian is switched off there.
- A Backroom only knows the ordinary librarian, which is still switched off in Moonwood Mill, and has no Moonwood version. The night bartender has the same gap.
- So a Backroom there gets **no librarian by day and no bartender by night**. Wolfgang loses his job and nobody replaces him.
- **Suggestion:** keep it a Library. The Grimtooth Bar already covers nights out.

**2. 1 Cobblebottom Street as a tea room run by the Crumplebottoms: won’t work cleanly.**
- Their household is hidden, so it can’t be moved into a lot without cheats.
- Agnes loses her NPC behaviour (the angry handbag lady) once she’s in a household, and the garden stall would get a stranger.
- **Suggestion:** a new Sim of hers, or a Henford household with no village job. Not Kim, Lavina, Rahul, Michael or the Scotts: they all have one.

**3. The Scotts leave 3 Cobblebottom Street: fine.**
- They still own the pub and are Henford’s only bartenders.
- Keep them unplayed and evict rather than delete them. If she ever plays them, the game makes up a new pub-owner couple.

**4. Copperdale’s ThrifTea lot became Prescott Boarding House: fine.**
- Eloise’s job follows the lot type, so she runs Town Square Stores.
- She’s also the preferred owner of the other four Thrift and Boba Stores; while she’s busy, they get another young adult.
- The job needs a young adult, so with ageing on for unplayed Sims she’s replaced in about 28 days.

**5. Rentals and landlords.**
- **Panya Li owns every rental nobody owns:** Rio Verde, Fern Park Flats, Midtown Meadows, Rippling Flats, Tail’s End, Inner Circle, Upland Trailer Park, Slip 42, Rockridge Springs, Old Torget House and Sungai Point (and Abandoned Views, unless the Henleys own it). The site’s “no landlord” at Upland Trailer Park is fine; in game it’s Panya.
- **Owners who live elsewhere** (the Robles at Manzanita Terrace, the Lovejoys at Sequoia Cottage, Rochana/Caberry at Isda Riverfront) lose their rentals if they’re moved in with another household off their lot. Move the other household in with the owners instead.
- **Ondarion:** Casa Do Corsário as Aloisio’s rental is fine (he has no job).

**6. Smaller notes.**
- **Ye Olde Voyager stays a Bar:** that keeps Fia Acosta’s hangout.
- **Ekene Ananou** sells at Community Markets in other worlds too, where locals aren’t preferred. If she plays the Ananous, another Sim takes over.
- **Todd Attenberry** (Innisgreen, not owned) probably tends his stall only when unplayed, like Glen Nhoam. Running the Greenwood Hamlet apothecary means playing him, so the stall would be empty while she does.
- **StrangerVille Information Center as a Backroom:** fine. The town’s scientist and conspiracy-theorist readers only visit Library lots, and the StrangerVille Library stays one.
- **Glimmer & Books, The Old Mill, BridgeCreek Drive, Garliclauter Place, Hardcover:** ordinary Backrooms; their librarians, trainers and bartenders work normally.

---

## 5. Settings and habits that protect the plan

| What | Where | Suggestion |
|---|---|---|
| Neighbourhood Stories, all of it | Game Options → Gameplay → Enable Neighborhood Stories | Off stops every life change for everyone. The gentler option is the next line |
| Move In and Move Out | Manage Households → Other Households → the Neighbourhood Stories button (top right) | Untick both: homeless townies stay homeless, empty homes stay empty, nobody leaves her lots. Babies, careers and deaths are her call |
| My Households | Same button, My Households tab | Off by default; leave it |
| Maximum Sim Count | Game Options → Gameplay | Raise it (200, or Unlimited if the PC copes) so her planned households all fit in My Households |
| Hearts | Manage Households | Heart the households she cares about: never culled, and Neighbourhood Stories is off for them by default. Leave role Sims (Scotts, Chopras, Wolfgang…) unhearted until one is tested: some job filters skip Sims whose household has been played, and it’s untested whether a heart counts |
| Ageing for unplayed Sims | Game Options → Gameplay → Auto Age (Unplayed Households) | Off keeps young role Sims in their jobs (the ordinary librarian and the thrift owner must be young adults). Her call |
| Moving EA families out | Manage Worlds | Evict, don’t delete: they stay in the save as homeless townies |
| Empty homes she wants kept empty | – | With Move In off they stay empty. A home with no beds is never moved into |
| Occult townies | Game Options | “Limit Werewolves to Moonwood Mill” and “Limit Fairies to Innisgreen” keep them in their own worlds |
| Checking | Any mailbox → Check Recent Neighborhood Stories | Look after the first in-game week |

---

## 6. Decisions for her

1. **The Moonwood Mill Library:** settle it as a Library, not a Backroom?
2. **1 Cobblebottom Street:** if it becomes a tea room, who runs it instead of the Crumplebottoms?
3. **Neighbourhood Stories:** off altogether, or on with Move In and Move Out unticked for Other Households?
4. **Maximum Sim Count and hearts:** raise the count and heart her planned households?
5. **Ageing for unplayed Sims:** off, so role Sims keep their jobs?
