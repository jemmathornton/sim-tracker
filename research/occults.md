# Occults: life states, their places and traits, her plan, and showing them (overnight 17 Oct)

> Partly out of date since 19 Oct: her icon picks are on the site (research/decisions/occults.md); the in-game points are still open on TODO.md.

Research only. Nothing on the site, in `data/`, `tools/` or `TODO.md` is changed, and nothing is committed. No save was opened.

**Sources:**
- The Sims Wiki, fetched through its API on 17 Oct: the life state pages, the pack pages, every premade occult Sim and family, the occult worlds and neighbourhoods, the secret lots, haunted houses and lot traits (full list at the end).
- The game’s own files, read only: which pack folders are installed, the lot trait (“zone modifier”) and lot type (venue) tuning, and the English game text (the occult settings, the Haunted House perks).
- Her plan in `data/worlds/*.json`, her Gallery texts in `data/gallery/uploads.json`, and the notes `ea-family-lore.md`, `townies-and-roles.md`, `lot-trait-ideas.md`, `pets-and-horses.md`, `sims-display.md`, `not-owned-worlds.md` and the world notes.

## Headlines

- **The game has 10 occult life states** (plus ordinary Sims) and 2 temporary ones. She has 7 of the 10. **Vampires, Werewolves and Enchanted by Nature (fairies) aren’t installed** (their folders hold only the base game’s placeholder files).
- **EA ships 27 premade occult Sims:** 14 in packs she owns (6 spellcasters in Glimmerbrook, 4 ghosts, 4 Sulani mermaids) and 13 in the three packs she doesn’t (3 vampires, 5 werewolves, 5 fairies). There are no premade aliens in any world.
- **Her plan keeps every occult family in its own world.** Two households move within their world: the Amicable Acolytes into Brooks Bridge (a Haunted House) and the Specters into Specter Row. Rory Oaklow, homeless in the game, gets a home.
- **Nothing in the plan breaks the game.** Things that need care:
  - Specter Row: a rental can’t also be a Haunted House.
  - The Specters lose their old home’s On Hallowed Grounds trait.
  - The Grimtooth’s bunker and the garlic at Garliclauter Place, for when she builds them.
  - Fairy Passage in Henford needs a game setting changed and a free trait slot.
- **Her own builds already tell an occult story:** a castle of “generations of spellcasters” (Von-Windenburg Castle), a portal to the Magic Realm in the woods (Mid-NoWhere), a “totally-not-haunted” house (Hallow Slough).
- **Showing occults:** a life-state pill on every Sim, plus a short “turned by” or “born” line and ghosts shown in their place (option B, §5).

---

## 1. The life states

| Life state | Pack | Has it? | How a Sim gets it | Born to it? |
|---|---|---|---|---|
| Ghost | Base game (powers from Life & Death) | Yes | Dies; or made in Create a Sim (pick a cause of death) | No. Any other occult keeps its powers as a ghost (a ghost vampire, a ghost spellcaster) |
| Spellcaster | Realm of Magic | Yes | A Sage’s quest and the Rite of Ascension | One spellcaster parent: half the time. Two: always. Born spellcasters get a bloodline trait (Weak, Strong, Ancient) |
| Alien | Get to Work | Yes | Create a Sim only | Yes, or an alien-Sim hybrid. Abducted men can come back pregnant |
| Mermaid | Island Living | Yes | Eat Mermadic Kelp, then swim | Half the time with one mermaid parent, always with two. Can’t combine with another occult |
| Servo | Discover University | Yes | Built at Robotics 8 | No. Never ages |
| Imaginary Friend | Adventure Awaits | Yes | A child’s doll friend; can be made human | No |
| Unicorn (horses) | Horse Ranch | Yes | Create a Sim | – |
| Vampire | Vampires | **No** | Bitten by a vampire with the Vampire Creation power: the vampire becomes the **Master**, the new one their **Offspring** | Half the time with one vampire parent, always with two; On a Dark Ley Line adds a small chance |
| Werewolf | Werewolves | **No** | A Cursed Bite (gives the Lycan Bond sentiment), or werebies from Greg or the tunnels | Half the time with one parent, always with two; can be born **dormant** (woken by swimming in Moonwood Mill’s lake at full moon) |
| Fairy | Enchanted by Nature | **No** | Plant a Fairy Seedling, get Mother Nature’s Charm, step into the Moondrop Springs in Everdew | Half the time with one fairy parent; with two, always, plus the **High Fae Lineage** trait |
| PlantSim (temporary, 5 days) | Base game | Yes | The Forbidden Fruit, from magic beans (Gardening 10) | No |
| Skeleton (temporary) | Jungle Adventure, Paranormal Stuff | Yes | A cursed relic (2 days), or a séance gone wrong (as Bonehilda) | No |

- **Not life states:** Grimborn (an inherited trait of the Grim Reaper’s children), StrangerVille’s “possessed” Sims (a passing state), the Island Spirits and elementals of Sulani, Mt. Komorebi’s forest spirits.
- **Two at once:** since Life & Death, a ghost can carry one other occult (Lady Ravendancer Goth is a ghost spellcaster). The game doesn’t support other mixes, such as a vampire werewolf.
- **Clashes:** vampires and werewolves start at −50 when they first meet. Fairies can cure vampirism, soothe a werewolf’s fury and keep mermaids hydrated. Spellcasters and fairies distrust each other’s magic.
- **Two game settings** (Game Options): “Limit Werewolves to Moonwood Mill” and “Limit Fairies to Innisgreen”. They come with those packs.

### EA’s occult Sims, game home → her plan

| Life state | Household (game home → her plan) | Sims | Notes |
|---|---|---|---|
| Spellcaster | Charm (Rock Ridge Canyon → same, not built) | Minerva, Darrel, Gemma, Emilia Ernest | All but Emilia have the Strong Bloodline (she’s marrying in) |
| Spellcaster | Amicable Acolytes (Creek Side Corner → **Brooks Bridge**, a Haunted House) | Grace Anansi, Tomax Collette | Grace was turned by Morgyn Ember (trailer) |
| Spellcaster | NPCs in the Magic Realm | The Sages: Morgyn Ember, L. Faba, Simeon Silversweater | A Sage moved into a household stops being a Sage, and the game makes a new one |
| Ghost | Izadi-Gomes (Mourning Mist Manor → same) | Esther Gomes, Zuleika Izadi | Zuleika died of her own Cowplant. TODO suggests them as Mystic Crossroads’ owners |
| Ghost | Aether (The Marigold Chateau → same) | Kai Aether (husband Ekade and son Takama are human) | Died after a mix-up with a pet crow; doesn’t believe he’s dead |
| Ghost | Capp (homeless → homeless, her choice) | Consort Capp | Back to make his descendants behave |
| Mermaid | Homeless in Sulani → not in her plan | Kalamainu’u Iona, Nalani Mahi’ai, Paka’a Uha, Ukupanipo Hekekia | Three of them can’t be edited |
| Vampire | Straud (Straud Mansion → same) | Vladislaus Straud IV | Not owned |
| Vampire | Vatore (Wolfsbane Manor → same) | Lilith, Caleb | Lily Zhu’s cousins (both packs needed for the tree link) |
| Werewolf | Volkov (The Collective Cabin → same) | Kristopher, Jacob, Lily Zhu | Kristopher and Lily have chosen immortality |
| Werewolf | Oaklow (homeless → Full Moon Shack, with a friend she’ll make) | Rory | Alpha of the Wildfangs |
| Werewolf | Howell (homeless → homeless, unless he’s one of the “Werewolves in Training”) | Lou | Bitten by Greg |
| Fairy | Summerdream (Puckitt Hall → same) | Titania, Oberon, Mara | High Fae |
| Fairy | Mystical Besties (Bard Boulevard → same) | Nadya Kishka (fairy), Iris Ladipo (human) | |
| Fairy | Enchanted Lovers (Gimmley Gardensbrook → same; apothecary at Greenwood Hamlet Residence) | Elric DeMuray (fairy), Todd Attenberry (human) | |

**Non-playable occults:**
- Werewolves: Greg (feral, immortal, said to be as old as Vlad) and Wolfgang Wilder (the librarian, secretly a werewolf).
- Ravenwood: Lady Ravendancer Goth (a ghost spellcaster, summoned with her tarot deck), Waylon Warez (the ghost merchant), and the hidden ghosts Alice and Edith.
- Haunted houses: Guidry and Temperance.
- Windenburg’s Von Haunt Estate: the ghosts Mimsy and Bernard.
- Brindleton Bay: Captain Whitaker, the ghost dog.

**Occult ties among ordinary Sims:**
- Nyon Specter is the Grim Reaper’s son (the Grimborn trait). Grim shows on his family tree in new saves (since patch 173).
- Tziporah Gomes was a ghost for years until ambrosia brought her back.
- Layne Coffin secretly wants Olive to make him a ghost.
- Zelmira Gomes descends from Lady Ravendancer.

**Lore the game doesn’t link:**
- Trailers show Vlad turning Lilith, and Miss Hell turning Caleb. In the game none of the three knows Vlad.
- Vlad tried to turn Lily Zhu. She fled into Moonwood Mill’s tunnels and became a werewolf instead.
- The in-game family tree never shows a vampire’s Master or Offspring (`game-changes-2026.md`).

---

## 2. Occult-only places

| Place | World | Pack (has it?) | What’s there | In her plan |
|---|---|---|---|---|
| The Magic Realm | Glimmerbrook | Realm of Magic (yes) | The Sages’ HQ; Casters Alley (wands, potions, brooms), the duelling grounds and gardens are on floating islands **outside** the lot. The only place that makes new spellcaster townies. Vampires are safe from the sun here | Built, shared (50×40) |
| Sixam | Hidden (her Magnolia Promenade “Secret Lots”) | Get to Work (yes) | The aliens’ planet, reached by a Wormhole Generator or an upgraded rocket. Vampires safe | Listed, not built |
| Sylvan Glade | Willow Creek (by Crick Cabana) | Base game | A secret glade in twilight; fairies show as little lights. Vampires safe | Listed, not built |
| Forgotten Grotto | Oasis Springs | Base game | A secret cave behind Desert Bloom. Vampires safe | Listed, not built |
| Netherworld Department | Ravenwood | Life & Death (yes) | The Reaper career’s office and the portal to the afterlife | Listed (30×30, her size) |
| Mourningvale | Ravenwood | Life & Death (yes) | The ghost neighbourhood: Grim wanders; the Baleful Bog (ghosts are reborn there); the Guardian Tree (an out-of-body trip) | Its 4 lots as in §4 |
| Haunted houses | Any world | Paranormal Stuff (yes) | A lot type: specters at night, Guidry from night 2, Temperance from night 5, a 7-night challenge, cursed objects, satisfaction points. Specters keep vampires (Vlad) and the Welcome Wagon away | Brooks Bridge, Ophelia Villa, Old Ravenwood Estate, The Cozy Casket House (+ Specter Row, undecided) |
| Von Haunt Estate | Windenburg | Get Together (yes) | Garden with resident ghosts | Kept (Chalet Gardens) |
| Selvadorada’s temples | Selvadorada | Jungle Adventure (yes) | Skeletons and cursed relics | Omiscan Royal Baths listed |
| Sulani’s sea | Sulani | Island Living (yes) | No mermaid lots. Mermaids roam the ocean; Mermadic Kelp comes from the Mua Pel’am cave (next to Admiral’s Wreckage), fishing and the beaches | Open world, untouched |
| Forgotten Hollow | Not owned | Vampires (no) | Longer nights; Straud Mansion’s crypt and the graveyard (scenery); with Werewolves, the tunnels come out at Fledermaus Bend | §4 |
| Moonwood Mill’s werewolf spots | Not owned | Werewolves (no) | Not lots: the Moonwood Collective’s tree, the Wildfangs’ trailer and bonfire, the mountain top, Greg’s home, the tunnels, Lake Lunvik. **The Grimtooth’s bunker is part of the bar lot.** (There’s no “Howling Gulch” in the game) | §4 |
| Everdew | Innisgreen (not owned) | Enchanted by Nature (no) | The Mossveil Fairy Hub (fairy court, daily fairy dust), the Moondrop Springs (become a fairy), the Starseed Teleporter (to Sylvan Glade, Forgotten Grotto, the Magic Realm, Sixam and Mt. Komorebi’s peak) | Its lots as the game ships them |

---

## 3. Occult lot traits

| Trait | Pack (has it?) | What it does | Where allowed | Game lots with it | Her lots |
|---|---|---|---|---|---|
| On Hallowed Grounds | Life & Death (yes) | Twice a day at random: flickering lights, TV static, cold spots, Netherworld rifts. Adds to a Haunted House’s scares | Any lot | Specter Family Manor, Old Ravenwood Estate, The Cozy Casket House | Crow’s Chronicles |
| Spooky (challenge) | City Living (yes) | A ghost turns up at night; more ghosts on a Haunted House. It was called **“Haunted”** until 2021 (patch 107) and still is in the game files | Any lot | Some San Myshuno flats have a locked version | The Narwhal Arms, Von-Windenburg Castle, Finchwick Village Hall, Sungai Point 11C |
| Island Spirits | Island Living (yes) | Island spirits visit; commune, release or banish | Any lot | Chieftain’s Villa | None yet. Chieftain’s Villa (the Hoapilis, not built) would keep it when built |
| Scare Seeker (challenge) | Reaper’s Rewards event (if unlocked) | Sims crave scares; occult Sims walk by and leave gifts | Homes, rentals, Generic | – | – |
| Vampire Nexus | Vampires (no) | More vampires visit | Any lot | Garliclauter Place | Garliclauter Place (as the game ships it) |
| Registered Vampire Lair | Vampires (no) | Gifts from the vampires’ League by post | **Residential, Tiny Home, Haunted House and Residential Rental only** (game tuning) | Widowshild Townhome | Widowshild Townhome |
| On a Dark Ley Line | Vampires (no) | Babies conceived there may be born vampires | Any lot | – | – |
| Fairy Passage | Enchanted by Nature (no) | More fairies visit | Any lot | Puckitt Hall, Crannamor Residential, Starsong Lounge, Greenwood Hamlet Residence | Kept on the Innisgreen lots; the Henford idea (§4) |

- **On Ley Line** (City Living) is about twins, not occults, despite the name. The vampire one is On a Dark Ley Line.
- **Realm of Magic and Werewolves add no lot traits.**

---

## 4. Her plan against the game

### Occult families moved or re-housed
- **Amicable Acolytes → Brooks Bridge,** now a Haunted House: two spellcasters living with specters. It works, and fits her “rumours of spirits” upload. Brooks Bridge has no traits yet.
- **The Specters → Specter Row (Moppy Manor),** with tenants. Their game home, Specter Family Manor (now Ravenwood Wedding Hall), ships with On Hallowed Grounds. Olive’s own lines describe it (“flickering lights… a TV that changes to static”). Moppy Manor has no traits.
- **Rory Oaklow** gets the Full Moon Shack, and **Lou Howell** may join the New Moon Cabins (Moonwood Mill). Being housed doesn’t change their packs.
- **Consort Capp and the four mermaids stay homeless** (her choice). Homeless Sims are the first the game deletes when a save gets full (`townies-and-roles.md`), unless she hearts them.

### Occult places she re-typed
- **Haunted houses (4):** Brooks Bridge (the Acolytes), Ophelia Villa (the Goths), Old Ravenwood Estate and The Cozy Casket House (both empty).
  - The specters come with the lot type; nothing has to be built for them. An empty one stays quiet until someone moves in.
  - For the Goths that means a family with children living through Guidry, Temperance and cursed objects, and angry specters can start fires. It also keeps vampires away.
  - The Cozy Casket House’s game text pitches it at ghosts “ready to start fresh”. Old Ravenwood Estate was once a spellcaster’s summer home.
- **Ravenwood Wedding Hall** (once Specter Family Manor) may still carry On Hallowed Grounds from the game’s lot. That means TV static and Netherworld rifts at weddings (built, not shared, so unchecked).
- **Forgotten Hollow** (not owned):
  - Garliclauter Place as a Backroom keeps its Vampire Nexus.
  - Widowshild Townhome stays a home for “new vampires of her own”, so its Lair trait still works.
  - Fledermaus Bend as a Cemetery is fine. The werewolf tunnels (with both packs) should still come out there.
- **Moonwood Mill** (not owned): the New Moon Cabins as a rental for young werewolves is fine. A first transformation is always a rampage, which breaks things.
- **Henford’s Bramblewood** (13 and 14 Nettle Lane, Cordelia’s Secret Cottage) is kept for a fairy area once she has Enchanted by Nature. Fairies don’t eat or need the loo, so the cottage’s Off-the-Grid and Simple Living hardly touch them.

### What could break or needs care

1. **Specter Row: rental or Haunted House** (already on TODO).
   - A lot can’t be both.
   - As a rental with On Hallowed Grounds on each unit, the Specters keep their tenants and their haunted feel.
   - As a Haunted House, there are no tenants.
2. **The Moonwood Mill Library as a Backroom** loses Wolfgang and every librarian and bartender (already on TODO). The game also sends Sims there for werewolf lore books.
3. **The Grimtooth Bar & Bunker:** the werewolves’ “secret” bunker is part of the lot. Keep it in any rebuild.
4. **Garliclauter Place:** the game’s build is full of garlic, and garlic on the walls keeps vampires away. As the vampires’ club, leave the garlic out.
5. **Widowshild Townhome** must stay a home (Residential, Tiny Home, Haunted House or Residential Rental) to keep Registered Vampire Lair. It can’t be a Small Business.
6. **Fairy Passage in Henford:**
   - It probably only draws fairies if “Limit Fairies to Innisgreen” is off.
   - Cordelia’s Secret Cottage already has 3 traits, so one would have to go. 13 and 14 Nettle Lane aren’t built yet, so they have room.
   - A new fairy is made in Create a Sim or takes a trip to Everdew.
7. **Keep role occults unplayed:** the Sages and Wolfgang Wilder lose their jobs if moved into a household.
8. **The Magic Realm build:** the shops and duelling grounds are outside the lot, so her rebuild of the HQ doesn’t lose them. The Sages still turn up at the HQ (worth a look in game).
9. **Two Olive Specters:** if Havisham House’s “Specter *WithUpdates*” is Maxis’s Gallery family (an elder Olive with niece Ophelia), she has two (already question 3 in `ea-family-lore.md`).

### Her own occult story (from her uploads)
- **The Tiquelles’ Von-Windenburg Castle:** “generations of spellcasters, I mean sims… Some love it so much they may even visit from the afterlife”. It has the Spooky challenge. With **Mid-NoWhere** (her “portal to the Magic Realm” in the Crumbling Isle woods), Windenburg gets a second spellcaster place. Spellcasters can live in any world (their Glimmerstone takes them to the Realm).
- **Hallow Slough** (Ella-Mint Cadberry, Willow Creek): “totally-not-haunted… paranormal communications”, built with Paranormal Stuff. In game it’s an ordinary home.
- **18 Culpepper House:** “you may think you saw something in the middle of the night”. It has no Spooky trait.
- **Aliens:** if the **Sultry Springside Smiths** are Maxis’s Gallery family:
  - Pollination Tech 9 Smith is a real alien in her game. The game counts his son Johnny as human.
  - Jenny Smith is the older sister of the Curious brothers next door at Granada Place.
  - In the Gallery version, Pascal Curious is pregnant, and the baby isn’t an alien.

---

## 5. Showing occults on the site

`sims-display.md` already plans a `state` field (“Yes, as a small pill”) and `late: true` for Sims who have died. What the game tracks beyond the life state:
- **Origin:** born, turned or made in Create a Sim. For vampires the game keeps a Master and Offspring link (relationships panel only).
- **Heritage traits:** bloodlines, High Fae Lineage, Grimborn.
- **Groups:** the werewolf packs.
- **After death:** ghost, moved on (gone for good), or reborn as a new Sim who keeps a link to the old life.

Ranks (vampire, spellcaster, pack, ghost mastery) change as she plays, so leave them out, like skills. Fixed roles like Sage or pack Alpha are fine.

| | A. Pill only | **B. Pill + origin, ghosts in place (recommended)** | C. B plus an Occults page |
|---|---|---|---|
| Roster and cards | One pill per Sim (“Vampire”), two for a ghost occult (“Ghost · Spellcaster”) | The same pill, plus one line on the card: “Turned by Vladislaus Straud”, “Born · Strong Bloodline”, “Ghost · died of old age” | As B |
| Family tree | Pill on each tree card; ghosts and late Sims drawn alike (faded) | **Ghosts** sit in their generation with a ghost outline, as household members. **Late** Sims (in an urn or grave) are faded with “late”. **Moved on** in grey. Grim can appear as a parent (Nyon). Master and Offspring lines are **off the tree** (as in the game) behind a “Show who turned whom” switch, drawn dotted | As B |
| Groups | – | A pack chip like the dynasty chip (“Moonwood Collective · Alpha”) | A save-wide **Occults** page: chains of who turned whom, the two packs and their members, spellcaster bloodlines, ghosts by world, the haunted houses |
| Good | Least typing; works at Basics | Tells the turned-or-born story without crowding trees; still Basics-friendly (only `state` is needed) | Shows vampire lines and packs best |
| Not so good | Loses who turned whom and the ghost story | One more optional field per Sim | Mostly for packs she doesn’t own yet; lots to type |

**Recommendation: B, filled at Basics** (just `state`), with the origin added only where the game or her story gives it.
- Trailer lore (Vlad → Lilith, Miss Hell → Caleb, Morgyn → Grace) gets an “In the game: not linked” note unless she makes it so in her save.
- C can wait until she owns Vampires or Werewolves.
- On the Stats page: counts by life state (percentages are fine there).

**Proposed data** (written here only; not applied; `state` becomes a list so a ghost can carry a second occult):

```json
{"id": "lilith-vatore", "name": "Lilith Vatore", "age": "Young Adult",
 "state": ["Vampire"], "origin": "turned", "turnedBy": "vladislaus-straud", "originNote": "trailer"},
{"id": "minerva-charm", "state": ["Spellcaster"], "origin": "born", "heritage": "Strong Bloodline"},
{"id": "kai-aether", "state": ["Ghost"], "died": "Crows"},
{"id": "nyon-specter", "parents": ["olive-specter", "grim-reaper"], "heritage": "Grimborn"},
{"id": "kristopher-volkov", "state": ["Werewolf"], "pack": "Moonwood Collective", "role": "Alpha"}
```

- `origin`: born, turned, made (Create a Sim) or cursed. `heritage`: the game’s inherited trait. `died`: the cause (the game records it).
- `late`, `movedOn` and `rebornAs` (an id) for the afterlife.
- Grim is one save-wide Sim id (`grim-reaper`) with no household.

**Icons** (Lucide, ISC; checked against lucide-static 0.460.0; there’s no bat):

| Ghost | Spellcaster | Vampire | Werewolf | Fairy | Mermaid | Alien | Servo | PlantSim | Skeleton |
|---|---|---|---|---|---|---|---|---|---|
| ghost | wand-sparkles | droplet | moon | sparkles | shell | orbit | bot | sprout | skull |

Unicorn would use the pet icons in `pets-and-horses.md`. A pill always shows its word too, so it isn’t colour or icon alone.

---

## 6. Decisions for Jemma

1. **Specter Row:** a rental with On Hallowed Grounds on each unit (keeps the tenants and the Specters’ haunted home), or a full Haunted House (no tenants)?
2. **Ravenwood Wedding Hall:** keep or remove the old manor’s On Hallowed Grounds, if it’s still there in game?
3. **For when she buys Vampires or Werewolves:**
   - Keep the Grimtooth’s bunker.
   - Leave the garlic out of Garliclauter Place.
   - Keep Widowshild a home.
   - Add On a Dark Ley Line anywhere (vampire babies)?
4. **Henford’s fairy area:** turn “Limit Fairies to Innisgreen” off? And on Cordelia’s Secret Cottage, which trait would make way for Fairy Passage?
5. **Her own occults:**
   - Are the Tiquelles spellcasters, with Mid-NoWhere as their portal?
   - Should Hallow Slough become a Haunted House, or get On Hallowed Grounds?
   - Should 18 Culpepper House get Spooky to match its text?
6. **Aliens:** are the Sultry Springside Smiths Maxis’s Gallery family? If so, Pollination Tech 9 is her save’s only alien.
7. **Homeless occults** (Consort Capp, the four mermaids): heart them so the game never deletes them, or let them be?
8. **Showing them:** B (pill, origin line, ghosts in place, who-turned-whom on a switch), A, or C?
9. **Trailer lore** (who turned whom): show it with an “In the game: not linked” note, or only what her save says?
10. **Icons:** droplet for vampires (Lucide has no bat), moon for werewolves, and the rest as in the table: OK?

---

## Sources

- Sims Wiki (API, 17 Oct): Occult and Life state; Vampire; Spellcaster; Werewolf; Werewolf pack; Mermaid; Alien; Alien abduction; Fairy; Fairy house; Mother Nature; Spruce Almighty; Ghost; Specter; Medium; Soul’s journey; Grim Reaper; Hybrid; PlantSim; Servo; Skeleton; Bonehilda; Imaginary friend; Unicorn; Zombie; Haunted house residential; Lot traits and challenges; Sixam; The Magic Realm; Sage; Sylvan Glade; Forgotten Grotto; Netherworld; Netherworld Department; Von Haunt Estate; Plasma fruit.
- Sims Wiki world and neighbourhood pages: Forgotten Hollow; Moonwood Mill; Innisgreen; Everdew; Sprucederry Grove; Coast of Adhmor; Glimmerbrook; Sulani; Mua Pel’am; Ohan’ali Town; Ravenwood; Crow’s Crossing; Mourningvale; Whispering Glen.
- Sims Wiki pack pages (The Sims 4:): Vampires; Werewolves; Realm of Magic; Island Living; Get to Work; Life & Death; Enchanted by Nature; Paranormal Stuff; StrangerVille; Discover University.
- Sims Wiki premade pages:
  - Vampires: Vladislaus Straud; Vatore family; Lilith and Caleb Vatore.
  - Werewolves: Volkov household; Kristopher and Jacob Volkov; Lily Zhu; Rory Oaklow; Lou Howell; Greg; Wolfgang Wilder; Celene López.
  - Spellcasters: Charm family; Minerva, Darrel and Gemma Charm; Emilia Ernest; Grace Anansi; Tomax Collette; Morgyn Ember; L. Faba; Simeon Silversweater.
  - Fairies: Summerdream family; Titania, Oberon and Mara Summerdream; Nadya Kishka; Elric DeMuray; Iris Ladipo; Todd Attenberry.
  - Mermaids: Kalamainu’u Iona; Nalani Mahi’ai; Paka’a Uha; Ukupanipo Hekekia.
  - Ghosts and Ravenwood: Specter family; Olive Specter; Nervous Subject (Nyon); Ophelia Specter; Layne Coffin; Esther Gomes; Zuleika Izadi; Kai Aether; Lady Ravendancer Goth; Waylon Warez; Claude René Duplantier Guidry; Temperance; Consort Capp; Captain Whitaker.
  - Aliens (Strangetown, Gallery): Smith family; Curious family; Pollination Tech 9 Smith; Johnny and Jenny Smith; Pascal, Vidcund and Lazlo Curious.
  - https://sims.fandom.com
- The game’s own files (read only):
  - The pack folders under `C:\Program Files\EA Games\The Sims 4`: GP04, GP12 and EP19 are empty, with only placeholder files under `Delta`.
  - The zone modifier tuning for On Hallowed Grounds, Spooky/“Haunted”, Island Spirits, Vampire Nexus, Registered Vampire Lair (its allowed lot types), On a Dark Ley Line and Fairy Passage.
  - The venue tuning for Haunted House Residential and The Magic Realm; the region tuning.
  - The English text: the Haunted House perks; “Limit Werewolves to Moonwood Mill”; “Limit Fairies to Innisgreen”.
  - Read through `tools/sims4files.py` and `tools/research/tuning.py` from scratch scripts.
- Lucide icon list: lucide-static 0.460.0 `tags.json` (unpkg).
- Her plan: `data/worlds/*.json`, `data/gallery/uploads.json` (lot texts), `data/game/lot-traits.json`, `research/data/world-lot-types.json`, and the research notes named at the top.
