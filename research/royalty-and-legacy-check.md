# Royalty & Legacy check: her plan against how the pack plays (overnight 17 Oct)

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened (one file date was looked at, §2e).

**Sources:**
- The game’s own tuning, read with `tools/research/tuning.py` from a scratch script: the Backroom and Community Market lot types, the lot traits (Clandestine, Regal Residence, Heist Havoc), the Grand Ball, Noble Court and Press Conference events, the market’s staff, the eight dynasty set-ups and every premade Sim’s dynasty role, the Royal Robber and Info Broker, and the royal walks. Plus the game’s English text (help pages, skill and career texts) through `tools/sims4files.py`.
- The Sims Wiki: The Sims 4: Royalty & Legacy, Dynasty, Noble, Scandal, Power Shifts, Sword, Dueling, Throne, Backroom, Burglar, Lot traits and challenges, Reward events, Patch 201, Ondarion, Dambele, Verdemar, Bellacorde, the eight family pages and the premade Sims’ pages.
- Her plan (`data/worlds/ondarion.json`, `tartosa.json` and the other dynasty homes), TODO.md, and `research/ondarion.md`, `ea-family-lore.md`, `townies-and-roles.md`, `lot-trait-ideas.md`, `festivals-calendar.md`.

---

## In short

- **Palaces are ordinary Residential lots.** No lot type or trait is needed to be royal. A dynasty belongs to the family, not to a house, so it goes wherever they move.
- **Grand Balls need a Waltzing Dance Floor** (Medium or Grand, from Build mode) and a lot type on the game’s list: homes, Lounge, Park, Pool, Community Space, Rec Center, Cemetery, Playground and a few others. **Not** Museum, Wedding Venue, Restaurant, Bar, Backroom, Community Market, rentals or Haunted Houses.
- **Noble Court and Press Conferences happen at home, and only on a plain Residential lot.**
- **Swordsmanship tournaments only run from the gazebos in Ondarion’s three neighbourhoods** (open world). Duels work anywhere.
- **Every world is its own kingdom, with one crown each.** A noble who moves world drops one career level and loses any promised title. Nobody in her plan is affected.
- **Things to sort out:**
  - **Ophelia Villa.** As a Haunted House, the Goths can’t host a Grand Ball or Noble Court at home.
  - **The Montys’ move.** Tartosa isn’t owned yet, and her Monty story needs a few steps in game (§2c).
  - **Her save.** The Goth and Landgraab dynasties only exist in a save started after the pack. Going by its backup dates, *Building #2* is older.
- **Fine as planned:** the Capps, Darongs, Thebes and Abrantes stay as the game ships them. Enzo stays in Ondarion. Zanbira stays a Community Market, Hardcover a Backroom, Ye Olde Voyager a Bar and La Vivace a Lounge.

---

## 1. What the pack needs from lots

### 1a. Where each feature happens

| Feature | Where | Needs | Source |
|---|---|---|---|
| Palaces and estates | Plain Residential lots | Nothing special | Game files, wiki |
| Grand Ball | Planned from the phone or the dance floor. Lot types allowed: Residential, Lounge, Park, Pool, Community Space (and its Garden version), Rec Center, Cemetery, Playground, Generic, plus 4 special park lots (Chalet Gardens, Ruins, Ocean Bluff, Myshuno Meadows) | A **Waltzing Dance Floor (Medium or Grand)**. §500, up to 20 guests, 8 hours, invitation only. When the game picks a lot itself, it prefers ones with a dance floor, Ondarion first | Tuning, game help text |
| Noble Court; Press Conference | The noble’s home | **Residential only** (not rentals, Haunted Houses or tiny homes). Unlocked at noble levels 3 and 4. 4 hours, up to 20 Sims; the advisor, coronator and guests are made by the game | Tuning |
| Joining the noble career | Anywhere | A knighthood from a high-ranking noble, the book *The Duchess Diaries* from any bookshelf, or **a throne** placed from Build/Buy | Game help text |
| Kingdom Leader | One per world (“many worlds can be kingdoms”). Titles can be renamed per kingdom in Manage Worlds → Kingdom Manager | Tybalt, Jawara and Cordelia V all start one step below it; the throne is empty | Game text, wiki |
| Swordsmanship tournaments | The gazebos in Dambele, Verdemar and Bellacorde only | – | Game skill text |
| Duels | Anywhere: for fun, money, a Sim’s heart, permission to marry, dynasty headship, a noble rival’s title | Swords. The blacksmith is a rabbit hole in Verdemar, and **every Community Market** has a sword seller as well as a goods seller, 9 am–8 pm | Game text, tuning |
| Power Shifts | Open world: Simcalibur in the stone on Verdemar’s plaza, Anansi’s Well next to Zanbira Market, the enchanted mirror on a small island in Bellacorde. Noble frogs and crystal slippers anywhere | Not on any lot, so rebuilding lots doesn’t touch them (locations from the wiki) | Wiki |
| Secret passageways | An object (a grandfather clock; the Capp Library Bookcase from the Lost Legacies event) on any lot | They link to other passageways the Sim knows about in the same kingdom. Also a WooHoo spot, a hiding place for treasure and a murder weapon | Game help text |
| Backroom | Hardcover (and her 4 others) | Library, gym or museum by day; nightclub 9 pm–6 am | Already in `lot-types-reference.md` |
| Community Market | Zanbira (and her 3 others) | 2 stoves, fridge, podium, dining table with 4 chairs, 3 sales tables, toilet, sink, bin | Already in `lot-types-reference.md` |
| Royal walks | Streets of Bellacorde (preferring Tybalt and other nobles who live there) and Dambele (preferring the Darongs) | The families staying where they are | Tuning |
| The Royal Robber (Fia Acosta) | Burgles homes; leaves gifts from “the palaces to your humble home”; a regular at Ondarion’s bar | **Heist Havoc** makes burglars come more often | Tuning, game text |

### 1b. Her Ondarion lots

| Lot | Plan | Grand Ball | Court / Press | Notes |
|---|---|---|---|---|
| Dambele, Verdemar and Bellacorde Palaces | Residential | Yes, with a dance floor | Yes | The heads’ seats. Fit Regal Residence (if unlocked) and Clandestine |
| Abrantes Estate | Residential | Yes | Yes | Ships with **Heist Havoc**: the Royal Robber’s favourite kind of target |
| Renaissance Road | Residential (the Sims 2 Montys) | Yes (small, 20×15) | Yes | The Monty dynasty’s skill is Gourmet Cooking |
| Giardino Del Grandioso | Small Business Residential (Alto vineyard) | Yes: it’s still a home lot | Yes | 64×64: the grandest spot for a ball in Bellacorde |
| 12 and 13 Lakeview, 17 and 18 Bright Cliff | Apartment | Probably (apartments count as homes in San Myshuno; not checked for Ondarion’s) | Probably | 13 Lakeview ships with Heist Havoc. Enzo (a noble) lives at 12 |
| Casa Do Corsário | Residential Rental | **No** (rentals aren’t on the list) | **No** | Fine: Aloisio is a criminal, not a noble |
| La Vivace | Lounge | **Yes: the game’s ballroom** | – | Keep a Waltzing Dance Floor in the rebuild. Its lounge nights still run too |
| The Lair in the Open-Air | Park | Yes, with a dance floor | – | An open-air ball by the pier would work |
| Sankofa Residence | Museum (weddings) | **No** | – | Weddings: still to check in game (already on TODO) |
| Fisherman’s Hut | Restaurant (Seafood) | No | – | – |
| Ye Olde Voyager | Bar | No | – | Simcalibur’s stone is on the plaza in front. Keeping it a Bar keeps Fia’s hangout |
| Hardcover | Backroom | No | – | Clandestine suits it |
| Zanbira Market | Community Market | No | – | Ekene Ananou is the preferred seller |

### 1c. Dynasty homes elsewhere

| Lot | World | Plan | Grand Ball | Court / Press |
|---|---|---|---|---|
| Ophelia Villa (Goths) | Willow Creek | **Haunted House Residential** | **No** | **No** |
| Affluista Mansion (Landgraabs) | Oasis Springs | Residential | Yes | Yes |
| Upland Trailer Park, a unit (Johnny Zest) | Del Sol Valley | Residential Rental | No | No (he isn’t a noble) |
| Rifugio dei Pirati (Romeo, Juliette, Dante) | Tartosa (not owned) | Residential | Yes | Yes |

The Haunted House rule comes straight from the game’s settings (its own lot type is left off both lists). Worth one test in game before deciding anything.

### 1d. Lot traits from the pack

| Trait | What it does | Where allowed | Her plan |
|---|---|---|---|
| Clandestine (pack) | Secrets made on the lot don’t get out | Any lot | Not on any lot yet; ideas in `lot-trait-ideas.md` |
| Regal Residence (Lost Legacies event, Feb–Mar 2026) | Needs fall more slowly and good moods last longer as the lot’s value rises; friendlier chats; a “Brag About My Luxe Life” interaction | Homes, rentals, tiny homes, Haunted Houses (not community lots) | Only if she unlocked it in the event |
| Heist Havoc (base game challenge) | More burglars, including the Royal Robber; dodgy alarms | Homes | Ships on Abrantes Estate and 13 Lakeview |

### 1e. Staff and servants

- **There’s no new servant in the pack.** Court advisors, coronators and guests are made by the game for each event.
- **Butlers** (Vintage Glamour, owned) and **maids** are the household staff. Hiring them earns prestige for the four **Connoisseur** dynasties (Capp, Landgraab, Abrantes, Alto).
- **Tutor:** a dynasty perk (the Goths, Capps, Darongs and Abrantes start with it) that lets you hire a tutor by phone.
- **Heirlooms** come from Life & Death’s wills (owned). The Lost Legacies event also gave the Darong heirloom easel, the Capp Library Bookcase door and the family keys, but only if she unlocked them.

---

## 2. Dynasties in her save

### 2a. The eight dynasties and where they live

| Dynasty | Head, heir, others (as the game ships) | Prestige; ideals; allies and rivals | Home in her plan | OK? |
|---|---|---|---|---|
| Goth | Mortimer; Cassandra heir; Bella, Alexander | 3; Passionate, Mysterious; none | Ophelia Villa, Willow Creek (Haunted House) | **New save only** (§2e). No ball or court at home (§1c) |
| Landgraab | Nancy; Malcolm heir; Geoffrey; **Johnny Zest outcast** | 5; Devious, Connoisseur; ally Abrantes, rival Alto | Affluista Mansion; Johnny at Upland Trailer Park (Del Sol Valley) | **New save only.** Living in another world is fine |
| Capp | Tybalt (noble, level 9); Beatrice heir; Celeste; Consort (ghost, homeless); **Virgilio outcast** | 7, unity in crisis; Diplomatic, Connoisseur, Artistic; ally Alto, rival Monty | Bellacorde Palace; Consort homeless | Yes. Consort is a member, not an outcast |
| Monty | **Juliette head**; Dante heir; Romeo | 1; Passionate, Hardworking; rival Capp | Romeo, Juliette, Dante → Rifugio dei Pirati, Tartosa. Sims 2 Montys (to create) → Renaissance Road | **Needs steps** (§2c). Tartosa isn’t owned |
| Darong | Adekoya; Jawara heir (noble, level 9); Amarachi, Obi | 7; Scholarly, Caring, Artistic | Dambele Palace. Afua (his secret daughter) at 18 Bright Cliff, not a member | Yes |
| Thebe | Cordelia V (noble, level 9); Thiago heir (noble, level 8) | 8; Bold, Jolly, Nature-Loving; ally Abrantes | Verdemar Palace | Yes |
| Abrantes | Ermelinda (noble, level 6); Sofia heir | 5; Devious, Connoisseur; allies Thebe, Landgraab | Abrantes Estate | Yes |
| Alto | Enzo (noble, level 7), the only member | 3; Devious, Connoisseur, Passionate; ally Capp, rival Landgraab | Enzo at 12 Lakeview; his family (to create) at Giardino | Yes. Her idea needs steps (§2d) |

Akachi Onoja is a noble (level 5) with no dynasty and no home. Fia, Connie and Aloisio have no dynasty.

### 2b. What happens when families move

- **The dynasty moves with the family.** It’s a group of related Sims, not a lot. Members can live in different worlds: as the game ships it, Johnny Zest is a Landgraab outcast with his own home. Alliances and rivalries also go across worlds.
- **Who can join:** Sims related to the head, or the child, grandchild or step-child of a member, “through birth, adoption or marriage”. A Sim who loses that link is removed by the game. Sims can only belong to one dynasty.
- **The head stays head** until they die, lose a duel or challenge, or step down. **To step down, the head must name an heir first.** Only the head can name the heir, add members or declare outcasts.
- **The noble career is per kingdom (world):** moving world drops a noble one level and cancels any promised title. Romeo (a line cook), Juliette (no job; she lost her rank) and Dante (a teen) aren’t nobles, so **their move costs nothing**. Enzo stays in Ondarion.
- **Babies of premade dynasties join by themselves** (12 May 2026 patch).

### 2c. Her Monty and Capp story, in game terms

Her story: Romeo and Juliette are outcasts of both dynasties and marry in Tartosa, and her recreated Sims 2 Montys hold the Monty name at Renaissance Road. As shipped, though, **Juliette is the Monty head and Dante her heir.**

- **Capp side: already true.** Juliette was “kicked out” and isn’t in the Capp dynasty at all (Virgilio is the Capps’ formal outcast). Nothing to do.
- **Monty side: three steps in game, once the Sims 2 Montys exist.**
  1. **Link them to Romeo in Create a Sim.** Edit Romeo’s household and add Patrizio and Isabella as his grandparents and Mercutio as his brother. Then, in Patrizio’s household, add Antonio and Bianca as their children and Beatrice and Benedick as Antonio’s. Two passes, because a household holds 8 at most. Then move them to Renaissance Road. (A Gallery household arrives without links. The pack’s “Forge Family Tree” tapestry also works, but it creates a forgery scandal.)
  2. **Juliette names Romeo heir and steps down.** Romeo, now head, invites Patrizio (his grandfather), and the rest can then join as Patrizio’s descendants.
  3. **Romeo names Patrizio heir and steps down.** Patrizio declares Romeo and Juliette outcasts.
- **The simpler way:** Patrizio founds a new dynasty. Juliette’s premade Monty dynasty (crest, Gourmet Cooking, the Capp rivalry) then stays with her in Tartosa.
- **Why the steps are worth it:** the Capp rivalry would sit next door to Bellacorde Palace, where the rival visits and party crashing happen.
- **Dante** loses his heir place in step 2. He can stay a member, be the new head’s heir, or be cast out with his parents.

### 2d. The Alto vineyard idea, in game terms

- Make Enzo’s mother and sister in Create a Sim in **Enzo’s household**, with the brother-in-law as the sister’s spouse, then move them to Giardino.
- Enzo invites them (all related to the head). If the family is to hold the dynasty, Enzo names his mother or sister heir and steps down, and the new head can declare him an outcast.
- His noble career isn’t affected. The Capp alliance and Landgraab rivalry go with the dynasty.

### 2e. The “new save” limitation

- **The Goth and Landgraab dynasties are only set up when a save is started** (since 12 Feb 2026). In an older save the families exist with no dynasty. Mortimer and Nancy can found their own, but they start at the bottom: perks have to be bought again, and nobody is heir, outcast, ally or rival until the heads choose.
- **Ondarion’s six dynasties work in older saves.** The wiki flags only the Goths and Landgraabs; Ondarion’s families get theirs when the world’s households are first made.
- **Her save:** *Building #2* (slot 13) has backup copies dated 21 Dec 2023, so it was started before the pack. This is from the file dates only; the save wasn’t opened.
- **Ancestors:** EA’s portrait ancestors (patch 193) are “new saves only”. Whether Ondarion’s ancestors (Caliban, Cordelia and Contessa Capp, the earlier Cordelia Thebes) show in an older save isn’t clear: check a Capp’s family tree in game.

---

## 3. What her plan could break

| Plan item | What happens | Suggestion |
|---|---|---|
| Ophelia Villa as a Haunted House | No Grand Ball or Noble Court at the Goths’ home | Host Goth balls at a Willow Creek park or community lot, or make it Residential. A haunted home suits the Mysterious ideal, so keeping it is fine |
| Montys to Rifugio dei Pirati | Tartosa isn’t owned. Until then, making the Sims 2 Montys for Renaissance Road leaves Romeo’s family homeless (and at risk of culling) | Wait for Tartosa, or park them in 13 Lakeview or 17 Bright Cliff (both empty) |
| Romeo and Juliette as Monty outcasts | Not possible while Juliette is head | §2c |
| Sims 2 Montys from the Gallery | They arrive with no family links, so they can’t join the Monty dynasty | Link them in Create a Sim (§2c) |
| Goth and Landgraab dynasties in an older save | Missing | Decide which save holds the dynasties (question 1) |
| Rebuilds of La Vivace, the palaces, Giardino | No Grand Ball without a Waltzing Dance Floor | Include one (a Silver-level ball also rewards a Grand one) |
| Sankofa Residence as a Museum | No balls or court (fine); weddings unconfirmed | Wedding check already on TODO |
| Casa Do Corsário as a rental | No balls | Fine |
| Homeless Consort Capp, Fia, Connie, Akachi | Can be culled. If Fia or Connie is culled or played, the game makes a stranger the Royal Robber or Info Broker | Hearting Consort is already on TODO. Leave Fia and Connie unplayed |
| Heist Havoc on Abrantes Estate, 13 Lakeview | Burglars, the Royal Robber among them | Keep it for Fia’s story, or drop it |
| Moving any noble to another world | Loses a level | Nothing planned does this |

---

## 4. Questions for her

1. **Which save will the dynasties live in?** *Building #2* is older than the pack, so the Goths and Landgraabs wouldn’t be dynasties there. Found them yourself, or start a new save for Sims?
2. **The Montys before Tartosa:** wait to make the Sims 2 Montys until you own Tartosa, or move Romeo’s family into 13 Lakeview or 17 Bright Cliff for now?
3. **The Monty dynasty:** should Patrizio’s family take over the game’s Monty dynasty (§2c), or found a new one and leave Juliette’s with her in Tartosa?
4. **Dante:** heir to the new head, a plain member, or an outcast with his parents?
5. **Ophelia Villa:** keep it a Haunted House (balls elsewhere) or make it Residential?
6. **Dance floors:** put a Waltzing Dance Floor in La Vivace, the palaces and Giardino when you rebuild them?
7. **Heist Havoc:** keep it on Abrantes Estate and 13 Lakeview for the Royal Robber?
8. **Regal Residence:** did you unlock it in the Lost Legacies event (Feb–Mar)? It decides whether the palace trait ideas can use it.

**Bonus story (changes nothing):** Juliette “daydreams about claiming back all that was taken”. Every world has its own crown, so in Tartosa she could rejoin the noble career (a throne is enough) and race for Tartosa’s crown, a kingdom with no Capps in it.
