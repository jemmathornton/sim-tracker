# Showing Sims, family trees and relationships: options (overnight 16–17 Oct)

For the TODO items "Household basics", "Relationships between households beyond family" and "Family tree, Goths first". Research only: nothing on the site or in `data/` is changed. Sources: the Sims Wiki (fetched through its API), EA patch notes as quoted on the wiki, family-tree and Sims tracker sites (list at the end).

Displayed text on the site would follow the usual rules (British English, curly apostrophes, counts not percentages outside Stats, no AI art).

---

## 1. Where the site is now

- **Household pages** already have: homes and businesses, "Sims made in game", **The Sims** (cards), **Connected households**, **Their story** (empty) and **Neighbours**.
- **Sim cards** (only the 4 Goths so far, from the Sims Wiki): life stage, aspiration, traits + bonus trait, career, school, skills with pips, a relationships list (links to the other Sim when they're on the site, with "X household" if they live elsewhere), notes.
- **Links between households** are family only: `familyLinks` in 3 worlds (Greenburg + Knox Greenburg, Gomes + Izadi-Gomes, Robles + Robles-Ruano), plus same-surname households linked automatically.
- Sims are matched by full name only, so two Sims with the same name would clash. Fine for now; a proper id is needed before trees (see §8).
- Open question already on TODO: where the Sims come from (not the Building saves).

---

## 2. What the game itself tracks (what a fan site could show)

### Per Sim

| Thing | What the game has | Changes often? | Worth showing? |
|---|---|---|---|
| Life stage | Newborn, Infant, Toddler, Child, Teen, Young Adult, Adult, Elder | Slowly | Yes, everyone |
| Life state (occult) | Human, Alien, Fairy, Ghost, Mermaid, Spellcaster, Vampire, Werewolf, Unicorn (horses), Servo, Imaginary Friend; PlantSim and Skeleton are temporary | Rarely | Yes, as a small pill |
| Traits | 3 personality traits (fewer for younger Sims) + a bonus trait from the aspiration; also reward and lot-gained traits | Rarely | Yes for played Sims |
| Aspiration | One at a time (e.g. Renaissance Sim) | Sometimes | Yes for played Sims |
| Career / school | Career and level; school grade | Often | Career name only, no level |
| Skills | Up to 10 levels each | Often | Only her favourites (stale fast) |
| Likes and dislikes | Up to 50: activities, colours, music, décor, fashion, conversation topics, Sim characteristics | Sometimes | Probably not (Pleasant Sims gave up on these as too tedious) |
| Lifestyles (Snowy Escape) | Max 3 of 16: Adrenaline Seeker, Close-Knit, Coffee Fanatic, Energetic, Frequent Traveller, Health Food Nut, Hungry for Love, Indoorsy, Junk Food Fiend, People Person, Single and Lovin' It, Outdoorsy, Sedentary, Techie, Technophobe, Workaholic | Can be lost | Optional extra |
| Turn-ons/offs (Lovestruck) | Attraction preferences | Rarely | No |
| Reputation (Get Famous) | Pristine, Great, Good, (neutral), Bad, Awful, Atrocious; plus celebrity stars | Sometimes | Only for famous Sims |
| Romantic boundaries | Jealous of non-physical / physical / WooHoo; open to change | Rarely | No |

### Between two Sims

| Thing | What the game has | Notes |
|---|---|---|
| Friendship bar | -100 to 100 → Despised, Disliked, Acquaintances, Friends, Good Friends | Changes every session; store the label, not the number |
| Romance bar | Combined with friendship it gives labels: Romantic Interest, Lovebirds, Lovers, Sweethearts, Soulmates, It's Complicated, Bad Romance, Hot and Cold, Enemies with Benefits, Total Opposites… | Too fiddly to track; pick one word |
| Set labels | Partner, Engaged, Spouse, Ex-Spouse (was "Divorced"), Late Spouse (was "Deceased Spouse"), Best Friends Forever, Coworkers, Neighbours, Roommates | Since patch 162 the game says **Spouse / Engaged / Partner**, not husband/wife or boyfriend/girlfriend. The Goth cards currently say "Husband"/"Wife" |
| Family labels | Parent, child, sibling, grandparent, aunt/uncle, cousin; since patch 193 (Feb 2026) also in-laws, half- and step-siblings and parents, great-grandparents, grandniece/nephew, grand-aunt/uncle, parent's cousin, cousin's child, distant relative, ancestor, descendant; adopted can be shown or hidden | All of these can be **worked out** from "who are the parents" + "who is married to whom". No need to type them |
| Family dynamics (Growing Together) | Close, Distant, Difficult, Jokesters; parent–child also Supportive, Permissive, Strict | Fixed until changed; nice as a tag |
| Romantic dynamics (Lovestruck) | Steamy, Strained, Unpredictable, Wholesome | Same |
| Custom relationships (Lovestruck) | Her own label and icon on any pair | Matches the "her own tags" idea in §6 |
| Sentiments | Up to 4 per pair, short or long term (Close, Adoring, Crush, Enamored, Bitter, Furious, Guilty, Hurt…) | Short-term ones expire; long ones (e.g. "Festering Grudge") are good story notes, not data |
| Social compatibility (Growing Together) | Who clicks or clashes | No |

### Per household / family

- **Played or not**: Manage Worlds splits "My Households" and "Other Households".
- **Neighbourhood Stories**: set per household in Manage Worlds (on by default for Other Households, off for My Households), and each kind of life change can be turned on or off. Per save.
- **Pets**: cats and dogs (Cats & Dogs), horses (Horse Ranch), with their own traits and life stages; small pets and the crow (Life & Death) don't live as Sims.
- **Dynasties** (Royalty & Legacy): head, heir, members, outcasts, prestige (star level), unity, 2 ideals (Artistic, Bold, Caring, Connoisseur, Devious, Diplomatic, Hardworking, Jolly, Mysterious, Passionate, Scholarly, Vicious), dynasty skills, perks, scandals, **alliances and rivalries** with other dynasties. The game's dynasties: Goth, Landgraab, Capp, Monty, Darong, Thebe, Abrantes, Alto. Starting alliances/rivalries (wiki): Landgraab–Abrantes ally, Landgraab–Alto rival, Capp–Alto ally, Capp–Monty rival, Thebe–Abrantes ally. That is a ready-made first relationship web across Willow Creek, Ondarion and Tartosa.
- **Life & Death**: wills (heirlooms, money, guardians), bucket lists, ghosts and graves. Late Sims show grey on the in-game tree with how they died.
- **In-game family tree**: shows ancestors, descendants, siblings and steps around one Sim (up to 5 generations each way since Feb 2026), not the whole family at once. Plum Tree and TheSimsTree exist because of that.

---

## 3. How others show it

| Source | How it looks | Take-away for her |
|---|---|---|
| TheSimsTree | Drawn tree of portrait cards; a profile card per Sim (parents tab, friends tab, extra fields, tags); unlimited partners (scrolls past 3); filter by generation; styling for pets and occults; one tree can link to another tree | A per-family tree with cards, links between trees for married-in Sims |
| Sims Legacy Hub (replaced Plum Tree, Dec 2023) | Free-flow tree, 3+ generations, name, life stage, pronouns, occult, screenshots | Same idea; occult and life stage are the core card facts |
| Plum Tree (closed Dec 2023) | Sims-specific tree builder, heir line marked | Mark the heir line in dynasties |
| Notion legacy dashboards | Generations overview, one page per generation/heir, backstory | A "Generations" list is the simple text form of a tree |
| Rosannatxt / Pleasant Sims spreadsheets | One row per Sim: household, role, age, traits, aspiration, career, partner, generation | A roster table is the cheapest way to cover every household |
| Create4Sims, Threads of Life saves | Households "linked by friendships, rivalries, romances and family drama", described in words | Text links sell the story as well as a diagram |
| Genograms (family therapy) | Family tree plus line styles for the bond: solid = close, double = very close, dashed = distant, zigzag = conflict; always with a key | Line styles for tags on any web or tree |
| Fan "relationship charts" | Portraits with arrows: one-way/two-way, hearts, cracked, dotted (faint), wavy (unstable), short labels | Arrows + short labels; keep it small |
| Genealogy charts | Pedigree (ancestors), descendant (top-down), hourglass (both), fan (circle), family group sheet (a couple + children) | Descendant chart suits Sims best (families start with founders) |
| Network-chart research | Node-and-line webs get messy past ~15–20 nodes; matrices are exact but most people find them hard; chord diagrams stop working past ~12 | Keep webs small: one household's links, or one world |

---

## 4. How much to track (applies to everything below)

| Option | What | Effort for her |
|---|---|---|
| A. Everything for everyone | Full cards for every Sim | Huge (about 126 households, maybe 300+ Sims); goes stale |
| **B. Three levels (recommended)** | **Basics** for every household: Sims and pets by name, life stage, occult, EA or hers, played or not, Neighbourhood Stories. **Profiles** for played households: traits, aspiration, career, parents and partner. **Extras** for favourites: lifestyles, dynasty, sentiments as notes, story, screenshots | Basics is a few minutes per household |
| C. Played households only | Nothing for the rest | Leaves most household pages empty |

Never store bar numbers, skill levels or money (they change every session). Store a label and, if useful, the date she noted it.

---

## 5. Household pages

| Option | Looks like | Good | Not so good |
|---|---|---|---|
| A. Cards only (today's Goth cards) | A grid of big cards | Rich | Long page for 6–8 Sims; empty-looking with basics only |
| **B. Roster first, cards below (recommended)** | A short table at the top: name · life stage · occult · role (e.g. "Heir", "Tenant") · aspiration · career; pets as a second small list. Cards appear below only for Sims with a profile | Works for every household from day one | One more block |
| C. Family portrait + roster | Her household screenshot across the top, names under it, then the roster | Lovely when she has a picture | Needs a screenshot per household |
| D. Tabs (Sims / Relationships / Tree / Story) | One section at a time | Short page | Hides things; she reviews by looking |

Also on the household page (any option):
- A **mini tree** (just this household plus parents and grown-up children elsewhere), linking to the full family tree.
- **Connected households** grouped by tag (Family / Romance / Friends / Rivals / Work & school / Dynasty), each a household card with the tag and who (e.g. "Bella ↔ Don: Ex-Partners").
- Facts row additions: Played (Yes / Not yet), Neighbourhood Stories (On / Off / Some), Origin (From the game / Jemma's own / From the game, changed), Dynasty (with a crown icon).
- Pictures: only her screenshots; otherwise the current initial monogram.

---

## 6. Relationship tags

| Option | What | Good | Not so good |
|---|---|---|---|
| A. Game labels only | Spouse, Partner, Engaged, Ex-Spouse, Late Spouse, Best Friends Forever, Good Friends, Friends, Disliked, Despised, Coworkers, Neighbours, Roommates | Matches the game | Can't say "Rivals", "First love", "Landlord" |
| **B. A fixed set in 6 groups, game wording where it exists (recommended)** | Family (worked out) · Romance: Spouse, Engaged, Partner, Ex, Late Spouse, Crush · Friends: Best Friends, Good Friends, Friends · Conflict: Rivals, Enemies · Work & school: Coworkers, Classmates, Boss, Landlord/Tenant · Dynasty: Ally, Rival, Outcast | One colour + one Lucide icon per group (heart, users, swords, briefcase, crown…), so it's not colour alone | She agrees the list once |
| C. Free text | Any label | Most freedom | Can't group, colour or count |

Recommended mix: B, plus an optional free **label** on any link (like the game's custom relationships), e.g. tag Romance + label "Childhood sweethearts". Family and romantic dynamics (Close, Difficult, Wholesome, Steamy…) as an optional small extra word.

---

## 7. Trees and webs

### 7a. Family tree (one family line)

| Option | Looks like | Good | Not so good |
|---|---|---|---|
| **A. Top-down descendant tree (recommended)** | Founders at the top; couples side by side joined by a short line (solid = married, dashed = partners, broken = ex); children hang below; one row per generation, labelled "Generation 1, 2, 3". Small cards: monogram or screenshot, name, life stage, household chip in the world's colour. Late Sims faded with "late". Heir marked with a crown | The way Sims trees are usually drawn; works at 1280px for about 6 cards per row; wide trees scroll inside their box, not the page | Needs parents data; a big tree takes care to draw |
| B. Generations list (text) | "Generation 1: Mortimer & Bella. Generation 2: Cassandra, Alexander." with links | Quick; nothing to draw | Doesn't show who's whose child in big families |
| C. Hourglass around one Sim | That Sim in the middle, ancestors above, descendants below (like the game) | Good on a Sim card | Only one view at a time |
| D. Family group sheets | One box per couple with their children; boxes link to the next | Simple, readable | Feels like a form |

Married-in Sims show a small chip "from the Capp family" that opens that tree. That is how separate family lines join without one giant chart.

### 7b. Per world

| Option | What |
|---|---|
| **A. World "Families" section (recommended)** | On the world's households page: every family line with a tiny tree preview and a count ("Goths: 4 Sims, 2 generations"), opening the full tree |
| B. One world-wide tree | All families on one chart. Turns into a tangle fast |
| C. Only on household pages | No world view at all |

### 7c. Across worlds (families move)

The Montys are the test case: the Capps at Bellacorde Palace and the recreated Sims 2 Montys at Renaissance Road (both Ondarion), and Romeo, Juliette and Dante at Rifugio dei Pirati (Tartosa).

| Option | What | Good | Not so good |
|---|---|---|---|
| **A. A family's tree ignores worlds (recommended)** | One "Monty family" tree; each card's household chip carries its world colour and name, so Tartosa and Ondarion Sims sit side by side. Opened from any Monty household | Matches how families really work; no duplicates | Trees become save-wide pages (a new kind of page) |
| B. Per world, with "moved" stubs | Each world draws its own part; a stub card "Romeo → Tartosa" links across | Keeps everything per world | Breaks a family into pieces |
| C. One save-wide "All families" index | A list of every family line with the worlds they're in | Easy to find things | Just an index; needs A or B as well |

Recommended: A, with C as the way in (a "Families" link in the sidebar or on the home page).

### 7d. Relationship web between households

| Option | Looks like | Good | Not so good |
|---|---|---|---|
| **A. Grouped lists (recommended to start)** | The "Connected households" block, grouped by tag, on every household page | Uses what's there; readable; fine with little data | No picture of the whole world |
| **B. One household in the middle (recommended next)** | A small SVG: this household in the centre, connected households around it, lines styled by tag (solid family, heart romance, green friends, zigzag conflict, dotted work), short labels, a key | Never messy (one household's links only) | Only one household at a time |
| C. World web on the map | Households drawn at their neighbourhood's `mapSpot` on the world map, lines between them; links to other worlds as arrows to the edge ("→ Tartosa") | Uses her maps; very "her site" | Several households share a spot, so needs nudging; busy in big worlds like San Myshuno |
| D. World web as a plain diagram or a grid (matrix) | Circles and lines, or a households × households table of tag icons | Exact | Web gets messy past ~15 households; most people find a grid hard to read |

The dynasty alliances and rivalries (§2) make a good first web to try: 8 families, 5 links, three worlds.

---

## 8. EA's premade families vs hers

| Option | What |
|---|---|
| **A. Origin tag on households and Sims (recommended)** | "From the game", "Jemma's own", "From the game, changed" (households) and "Born in the save" (Sims). A filter on the households page |
| B. Separate sections | "EA families" and "My families" listed apart on each world's households page |
| **C. Game start vs now (recommended for premades)** | For EA Sims: starting details from the Sims Wiki with the source line (as the Goths have now), then her changes noted ("Now: Elder, Ex-Spouse of…") |
| D. Don't mark it | Simplest; loses the story of what she changed |

Her own story on top of EA's lore (e.g. Enzo Alto as an outcast; Romeo and Juliette as outcasts of their dynasties) fits C: "In the game" line, then "In my save".

---

## 9. Proposed data (written here only, not applied)

**Ids:** every Sim gets a save-wide id from their name (`bella-goth`); a second Sim with the same name gets `-2`. Links use ids, never display names.

**World file, `households` (extends what the Goths have; the `//` notes are explanations, not part of the file):**

```json
"households": {
  "Goth": {
    "origin": "ea",                 // ea | mine | ea-changed
    "played": true,
    "stories": "off",               // Neighbourhood Stories: on | off | some
    "dynasty": "goth",
    "story": "",                    // her text for "Their story"
    "sims": [
      {"id": "bella-goth", "name": "Bella Goth", "age": "Young Adult",
       "state": "", "origin": "ea", "role": "",
       "traits": ["Good", "Family-Oriented", "Romantic"], "bonus": "Gregarious",
       "aspiration": "Party Animal", "career": "Secret Agent",
       "lifestyles": [], "photo": "", "notes": ""},
      {"id": "cassandra-goth", "name": "Cassandra Goth", "age": "Teen",
       "parents": ["bella-goth", "mortimer-goth"], "heir": true}
    ],
    "pets": [{"name": "", "species": "Cat", "age": "Adult", "traits": []}],
    "links": [{"to": "Pancake", "tag": "friends", "label": ""}]
  }
}
```

- `parents` on the child (ids, any world); `adopted: true` optional. Every other family label (sibling, aunt, cousin, in-law, step) is worked out by the app.
- `links` at household level stay for households with no Sims typed yet.
- Basics level needs only `name`, `age` (and `state` if occult) per Sim, plus `origin`, `played`, `stories` per household.

**New save-wide file, `data/relationships.json`** (one line per pair, so a romance between Tartosa and Ondarion is stored once):

```json
[
  {"a": "bella-goth", "b": "mortimer-goth", "tag": "spouse"},
  {"a": "romeo-monty", "b": "juliette-monty", "tag": "spouse", "dynamic": "Wholesome"},
  {"a": "x", "b": "y", "tag": "rivals", "label": "Childhood rivals", "since": "2026-10"}
]
```

Tags from the agreed list (§6); `label`, `dynamic`, `since` and `note` optional.

**New save-wide file, `data/families.json`** (family lines, dynasties, and Sims who don't live anywhere):

```json
{
  "monty": {"name": "Monty", "origin": "ea",
            "dynasty": {"head": "", "heir": "", "outcasts": ["romeo-monty"],
                        "ideals": ["", ""], "prestige": 0,
                        "allies": [], "rivals": ["capp"]},
            "others": [{"id": "", "name": "", "late": true, "parents": []}]}
}
```

- `others` holds late Sims and ancestors, so trees can show them without a household.
- Which family line a Sim belongs to: by surname, unless a Sim has `family` set (married-in Sims keep their birth family for the chip).

---

## 10. Where the Sims come from (the open TODO question)

| Option | Effort | Notes |
|---|---|---|
| **A. EA premades from the Sims Wiki (recommended as the start)** | Low for her | As done for the Goths; gives the "In the game" side |
| **B. She gives the rest in chat, household by household (recommended)** | Basics take minutes | Claude writes them into `data/`. Could be a new "Sims" tab in a copy of her spreadsheet instead, only with her OK |
| C. A reader for one of her play saves | A big new script | The save holds Sims, traits, relationships and parents; it would follow the save rules (temporary copy) and she'd pick which save. Later, if typing gets tedious |
| D. Gallery household uploads | Low | Only for households she has shared, and the Gallery shows little detail |

---

## 11. Suggested order (if she likes the recommendations)

1. Agree the tag list and the three levels.
2. Basics for the Goths and the Ondarion/Tartosa dynasties (Capp, Monty, Darong, Thebe, Abrantes, Alto) from the wiki; household roster on their pages.
3. Goth family tree (option 7a-A), then the Monty/Capp tree across Ondarion and Tartosa (7c-A).
4. Grouped "Connected households" with tags (7d-A); dynasty alliances and rivalries as the first links.
5. Later: the one-household web (7d-B), the map web if she wants it (7d-C), Sims columns on Stats (life stages, played households; percentages allowed there).

---

## 12. Decisions for Jemma

1. How much to track: three levels (basics for all, profiles for played, extras for favourites)?
2. Household page: roster first with cards below (B), or a family-portrait top (C)?
3. Tags: the fixed list in 6 groups plus an optional free label? Anything to add or drop (e.g. Classmates, Landlord/Tenant)?
4. Wording: the game's "Spouse / Partner / Engaged" (the Goth cards now say "Husband"/"Wife")?
5. Family tree: top-down tree (A) or a text generations list (B) to start?
6. Families that move: one tree per family across worlds (A), or per world with "moved" stubs (B)?
7. Relationship web: lists first, then one-household webs; is the map web worth trying?
8. EA vs hers: origin tags, plus "In the game / In my save" for premades?
9. Where the Sims come from: wiki for premades + her in chat? A Sims tab in the spreadsheet? A save reader later?
10. Story questions: how is Romeo related to the recreated Sims 2 Montys? Who heads each dynasty in her save?

---

## Sources

- Sims Wiki (via API): Relationship, Family tree, Life stage, Occult, Lifestyle, Sentiment, Likes and dislikes, Attraction, Dynasty, Reputation, Roommate, Marriage, Pet, Milestone, The Sims 4: Growing Together, Lovestruck, Life & Death; patch notes 121 (Neighbourhood Stories), 162 (relationship names, romantic boundaries), 193 (family tree update). https://sims.fandom.com
- TheSimsTree updates and features: https://thesimstree.com/en/blog/dynasties/thesimstree-november-update.html , https://www.thesimstree.com/en/blog/thesimstree-team/thesimstree-december-update.html , https://thesimstree.com/en/blog/dynasties/thesimstree-march-update.html , https://www.thesimstree.com/en/blog/inspiration/occult-characters,-sims-life-stages,-adopted-children-and-much-more-on-your-sims-family-tree.html
- Sims Legacy Hub and Plum Tree: https://simscommunity.info/2023/12/04/new-sims-4-family-tree/ , https://simscommunity.info/2023/09/12/plum-tree-app-closing/
- In-game family tree update coverage: https://snootysims.com/wiki/sims-4/the-sims-4-family-tree-update/
- Neighbourhood Stories in Manage Worlds: https://simscommunity.info/2023/09/27/the-sims-4-manage-worlds-guide/
- Legacy dashboards: https://ko-fi.com/s/1d7f8c0b1e , https://rosannatxt.gumroad.com/l/aamco
- Genogram line styles: https://creately.com/guides/genogram-relationship-types/
- Fan relationship chart conventions: https://amix-design.com/tl/en/tool-dia/about.html
- Family-tree chart types: https://www.familytreemagazine.com/premium/abcs-of-charts/
- Network charts vs matrices: https://research.tudelft.nl/en/publications/matrices-or-node-link-diagrams-which-visual-representation-is-bet
- Earlier research in this folder: `research/site-ideas-from-other-trackers.md` (Rosannatxt, Pleasant Sims, Create4Sims, Threads of Life)
