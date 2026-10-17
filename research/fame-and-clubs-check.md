# Fame and clubs: a check of her plan (overnight 17 Oct)

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own files, read with `tools/research/tuning.py` and `tools/sims4files.py`: every lot type’s club settings, the club rules (`ClubTunables`), the 24 club “seeds” (the game’s ready-made clubs and spares), the lounge events, the three fame lot traits, the paparazzi and fan limits per world, the VIP rope and the acting class rules.
- The Sims Wiki: Club (Get Together), Fame (Get Famous), Fame perk and quirks, Actor, Plumbob Pictures, Lounge, Paparazzi, Celebrity award, Del Sol Valley and its three neighbourhoods, Windenburg’s neighbourhoods, Von Haunt Estate, and the premade celebrities’ pages.
- Her plan (`data/worlds/*.json`), `research/data/plan-vs-game.json`, TODO.md and the earlier notes (lot-trait-ideas, festivals-calendar, ea-family-lore, sims-display, undecided-lots, small-business-check, worlds/del-sol-valley and worlds/windenburg).

---

## In short

- **Get Famous needs very little from her lots, and she has it.** Acting gigs all happen on the hidden Plumbob Pictures lot, which she keeps. Lounges are the only lot type with fame events.
- **The Starlight Accolades still aren’t in Del Sol Valley in her plan.** They need a Lounge with Hottest Spot in Town. Only Calico (Brindleton Bay) has one now; Studio PBP isn’t built yet. If EA’s Studio PBP is still standing in her save, it probably still has the trait (check in game).
- **Celebrities drop in at 5 of her lots** (Valley Views, Calico, Strike Out!, Orchid A Go Go, Starlight Fitness) and tour 2 celebrity homes (The Ward Den, Bailey-Moon Manor). Nothing is broken.
- **7 of the game’s celebrities are still homeless** (Holly Alto, Dustin Broke, Dirk Dreamer, Baby Ariel, Brytani Cho, Izzy Fabulous, Kayla Flemming). “My Celebs” at Chateau Peak could take some of them (already a TODO question).
- **Judith Ward suits the Plumbob Pictures Museum:** Acting 7 and Business Savvy. Acting classes need a hobby class whiteboard and a teacher with Acting 5 or more.
- **Paparazzi and fans** come for 3-star celebrities and up. They never appear in StrangerVille, Selvadorada, Granite Falls, Britechester or Henford-on-Bagley.
- **Clubs:** Windenburg has 11 premade clubs, each meeting at one Windenburg lot. Her re-typing leaves 5 fine (Avant Gardes, Knights of the Hedge, Partihaus, Renegades, The Good Timers) and 1 partly fine (Paragons). **5 no longer fit:**
  - Garden Gnomes and League of Adventurers meet at a student hall now.
  - Powerhouse meets at a library-type lot.
  - Spin Masters meet at a gym.
  - Upper Crusts meet at a home that isn’t theirs any more.
- **There’s no “Bros on the Go” club** in the game or on the wiki. The Bro household’s Sergio Romeo is in the Paragons, and Joaquin Le Chien in the Spin Masters.
- **On the Sims pages, show a club as a group, not as links between pairs.** The game has no club relationship. Two ideas: a “Clubs” block on household pages, and the club as one hub in the relationship web.

---

## 1. Get Famous (Del Sol Valley)

### 1a. Where fame uses lots

| Fame feature | What it needs | Her plan | OK? |
|---|---|---|---|
| Acting gigs | Plumbob Pictures, the hidden Acting Studio (50×50). Actors from any world travel there; no other lot can have the type | Kept as the game ships it | Yes |
| Talent Showcase (Fri and Sat, 6–11 pm) | Any Lounge | Calico, Orchid A Go Go; Studio PBP and La Vivace once built; The Rouge Note if it stays a Lounge | Yes |
| Meet A Celebrity (Mon and Wed, 10 am–4 pm) | A Lounge with Up-and-Coming Hotspot | Orchid A Go Go | Yes |
| Starlight Accolades (Sun, 6–11 pm) | A Lounge with Hottest Spot in Town | Calico only (Brindleton Bay) | Works, but not in Del Sol Valley (§1c) |
| Celebrities dropping in | Hottest Spot in Town (more famous ones) or Up-and-Coming Hotspot (less famous ones) | Valley Views, Calico (Hottest Spot); Strike Out!, Orchid A Go Go, Starlight Fitness (Up-and-Coming) | Yes |
| Home tours | Celebrity Home on a home or rental; a tour group comes daily from about 10 am for 4 hours | The Ward Den, Bailey-Moon Manor | Yes |
| VIP area and bouncer | The VIP rope (a Get Famous build item), set to 1–5 stars. A bouncer comes with it; Sims can bribe, persuade or fight him | EA’s Orchid A Go Go has a 3-star VIP floor; whether her build kept it is to check. Studio PBP not built | Her builds |
| Walk of fame | Global Superstars place a tile on Starlight Boulevard’s street | Open world | Yes |

- **Hottest Spot in Town:** prices double, and restaurants charge §50 for a table. It can’t share a lot with Up-and-Coming Hotspot or University Student Hang Out.
- **Up-and-Coming Hotspot:** B-listers and up get a quarter off.
- **Where both traits are allowed:** any lot except homes (tiny and haunted homes included), Residential Rentals, University Housing and Vet Clinics.
- **Who drops in:** at bars, nightclubs, lounges and karaoke bars, only young-adult and older celebrities; elsewhere, any age.

### 1b. Plumbob Pictures (the studio)

- It’s the actor career’s workplace. When she follows an actor to work, the game takes her there, and the stage set changes with each production (the game has 21).
- Nothing on her lots feeds it, and it can’t host clubs or Getaways. Nothing in her plan touches it.
- **Two perks change studio days:** Established Name (3 stars) skips auditions and costume, hair and make-up. A Serious Actor (a quirk) makes jokes and mischief anger the actor.

### 1c. Studio PBP and the Starlight Accolades

| | EA’s lot | Her plan |
|---|---|---|
| Type | Lounge, celebrities only (a bouncer at the door) | Lounge (her choice, 16 Oct), not built |
| Trait | Hottest Spot in Town, so the game’s awards venue | None yet |
| Awards area | An area for the ceremony; the host announces each award at a microphone | Her build: any lounge has a microphone, so nothing else is needed |

- **The awards** go to Sims for books, paintings, songs, videos and career gigs. Collecting one in person gives more fame.
- **Until Studio PBP is built, they’re at Calico.** But her save may still have EA’s Studio PBP, with its trait. Her data has nothing on the lot because it isn’t shared, so check in game.
- **With both lounges set up,** each should get its own Sunday ceremony. The game picks events lounge by lounge each Monday.

### 1d. Plumbob Pictures Museum (Small Business: Museum, Acting Classes & Café)

| What | The game |
|---|---|
| In EA’s world | A Museum with Hottest Spot in Town |
| As her Small Business Venue | Nobody lives there. Its owner opens it. She has visited the game’s own NPC-run Koffieboon while it was open; whether a business she sets up for an unplayed owner opens the same way is to check in game. No objects are required: a ticket kiosk and business sign are optional |
| Acting classes | A hobby class whiteboard set to Acting. The teacher (owner or employee) needs Acting 5 or more, and a class can’t start until a customer has checked in |
| Judith Ward as owner | Acting 7 and the Business Savvy trait; lives at The Ward Den nearby. Her text (“get rich at all costs”) fits a paid museum |
| Lot traits | Either celebrity trait is allowed on a small business. Lounge events won’t happen here (lounges only), but celebrities still drop in |

### 1e. The game’s celebrities, and where they are in her plan

| Sim | Stars, reputation | Known for | In the game | Her plan |
|---|---|---|---|---|
| Judith Ward | 5, awful | Actress (Acting 7) | The Ward Den | Same; museum owner idea |
| Thorne Bailey | 4, bad | Music | Bailey-Moon Manor | Same |
| Octavia Moon | 3, good | Writes Thorne’s songs | Bailey-Moon Manor | Same |
| Venessa Jeong | 1, neutral | Actress (Acting 3) | Upland Place | 1310 21 Chic Street, San Myshuno (her move) |
| Dirk Dreamer | 4, good | Tech guru | Homeless | Homeless, unless in My Celebs |
| Baby Ariel | 4, great | Teen singer (a real person) | Homeless | Same |
| Brytani Cho | 4, bad | Comedian | Homeless | Same |
| Holly Alto | 3, good | Painter; Enzo Alto’s cousin | Homeless | Same |
| Dustin Broke | 3, bad | Business; Skip Broke’s son | Homeless | Same (or the Crick Cabana Brokes? TODO question) |
| Kayla Flemming | 2, good | Athlete | Homeless | Same |
| Izzy Fabulous | 1, good | Style influencer | Homeless | Same |

- **Homeless celebrities still appear** on Del Sol Valley’s streets and at the hangouts. But homeless Sims are the first the game deletes when the town is full (`townies-and-roles.md`), so heart the ones she cares about.
- **Johnny Zest** (Upland Trailer Park, “chasing fame”) and **Venessa** could have Celebrity Home on their home once famous. It’s allowed on rental units and flats.

### 1f. Paparazzi and fans, by world (the game’s limits)

Paparazzi start following a Sim at 3 stars. The Paparazzi Darling quirk brings more.

| Paparazzi | Worlds she owns |
|---|---|
| None | StrangerVille, Selvadorada, Granite Falls, Britechester, Henford-on-Bagley (also Moonwood Mill and the hidden lots) |
| Fewer | Sulani, Mt. Komorebi (also Forgotten Hollow) |
| Slightly fewer | Willow Creek, Oasis Springs, Newcrest, Windenburg, San Myshuno, Brindleton Bay, Evergreen Harbor |
| Full | Del Sol Valley and the rest |

**Fans** follow the same pattern, with two differences: Britechester and Henford get a few fans (but no paparazzi), and Mt. Komorebi gets the usual number of fans.

So a famous household that wants peace could live in Henford or Britechester.

### 1g. Quirks and perks that use places

| Quirk or perk | Wants | Who has it (game) | Where in her worlds |
|---|---|---|---|
| Juice Enthusiast | A bar or a drink regularly | Kayla, Octavia | Any bar, lounge or nightclub |
| Refined Palate | Excellent-quality meals | Judith, Brytani, Dustin | Valley Views, or a good home cook |
| Brushes with Fame | Time with equally famous Sims | Venessa | The hangouts in §1a; Studio PBP once built. From San Myshuno that’s a trip |
| Vain Street | Mirrors | Judith, Izzy | Home |
| A Stan | A fan who follows them home | Thorne | – |
| Star Treatment (5-star perk, pristine reputation) | Free meals, drinks and massages out | – | Restaurants, bars, spas |

---

## 2. Get Together (Windenburg): clubs

### 2a. How clubs work

| What | What the game does |
|---|---|
| Size | 6 members, 8 with two club perks. A Sim can be in 3 clubs and gather with one at a time |
| Leader | A crown over the plumbob; the club is set up and run in the leader’s name |
| Rules | Encouraged and forbidden activities. Doing encouraged ones earns club points for perks (mood vibes, skill boosts, outfits, handshakes) |
| Hangout | None (wherever the leader is), a lot type (“any Park”), or one lot in any world |
| Where a gathering can happen | Most community lots and University Housing. Homes only if a member lives there. Not Generic, Vacation Rentals, National Parks, Wedding Venues, the Acting Studio, the High School or Auditorium, or hidden lots |
| Unplayed clubs | When she plays on a lot that allows clubs, the game may start gatherings of unplayed clubs there, probably those whose hangout it is (check in game). Members may also phone a played member to join, every 14 days at most |
| Topping up | Below 10 clubs, the game makes new ones from 11 spares (§2d) |

### 2b. The 11 premade clubs against her plan

Members as the game ships them (wiki); the leader first. Hangouts are from the game’s files.

| Club | Members | Hangout (game) | That lot in her plan | Activities | Still works? |
|---|---|---|---|---|---|
| Avant Gardes (invite only) | Maaike Haas, Gunther Munch, Hugo Villareal, Yuki Behr | South Square Coffee (Café) | Pixel Café (Café, with an arcade) | Coffee, read, homework, write, video games | **Yes**, even better with the arcade |
| Garden Gnomes | Moira Fyres, Bjorn Bjergsen, Lucas Munch | Hare Square (Park) | UoW Hare Halls (University Housing) | Garden, fish, look for frogs | **No**: an empty hall, no garden or pond, probably private like a home |
| Knights of the Hedge | Jacques Villareal, Wolfgang Munch, Yuki Behr | Von Haunt Estate (Chalet Gardens) | Unchanged | Maze, chess | **Yes** |
| League of Adventurers (children) | Elsa Bjergsen, Lucas Munch, Max Villareal | Hare Square (Park) | UoW Hare Halls | Playground, play in closet | **No**, as above |
| Paragons (invite only) | Siobhan Fyres, Sofia Bjergsen, Luna Villareal, Sergio Romeo | Bathe de Rill (Pool) | La Discotheque (Nightclub) | Be mean to Renegades, coffee, try on outfits | **Partly**: they can meet, but a nightclub may have no espresso machine or wardrobe |
| Partihaus (invite only) | Jade Rosa, Marcus Flex, Paolo Rocca, Eva Capricciosa | The Narwhal Arms (Nightclub) | The Narwhal Arms (Bar; still a Nightclub in her Building save) | Drink, dance, flirt | **Yes**: a pub has a stereo to dance to, and her Spooky ghost adds to the party |
| Powerhouse | Marcus Flex, Clara Bjergsen, Paolo Rocca | Harbor Quarter Gym (Gym) | UoW Students Union (Library type) | Work out, swim | **No**: no gym kit or pool |
| Renegades (invite only) | Max Villareal, Morgan Fyres, Wolfgang Munch, Ulrike Faust | Bathe de Rill (Pool) | La Discotheque | Mischief, be mean to Paragons, sabotage | **Yes**: they still share a hangout with their rivals |
| Spin Masters (invite only; DJ and Dancing 2+) | Dominic Fyres, Candy Behr, Joaquin Le Chien | Discotheque Pan Europa (Nightclub) | UoW Sports Center (Gym/Pool) | DJ, dance | **No**: no DJ booth or dance floor |
| The Good Timers (teens and up) | Bjorn Bjergsen, Dominic Fyres, Mila Munch, Jacques Villareal | The Shrieking Llama (Bar) | Unchanged | Drink, pub games | **Yes** |
| Upper Crusts | Clara Bjergsen, Mila Munch, Hugo Villareal | The Lighthouse (the Bjergsens’ home) | The Tiquelles’ home (not built) | Eat, cook, mix and drink | **No**: a home only works if a member lives there, and the Bjergsens live in Willow Creek now |

- **Nothing is formally broken.** A hangout is stored as the lot itself, so it follows the lot whatever its type. All her new types allow clubs, apart from the home rule for Upper Crusts. What’s lost is the objects the activities need.
- **This only matters when she’s there.** Unplayed clubs gather where she is playing, so a club with an unsuitable hangout just rarely shows up.
- **A nice side effect of her moves:** 10 of the 11 clubs (all but Partihaus) have members who now live in Willow Creek or San Myshuno (the Bjergsens, the Villareals, the Behrs, Sergio and Joaquin). They still belong, so club nights bring them back to Windenburg.

### 2c. Better hangouts in her plan, if she wants them

| Club | Suggested hangout | Why |
|---|---|---|
| Powerhouse | UoW Sports Center (Gym/Pool, built) | Work out and swim, exactly the club’s two activities. It’s the gym that moved |
| Spin Masters | La Discotheque (Nightclub, built) | The nightclub that moved; check her build has a DJ booth |
| League of Adventurers | Courtyard Lane Playground (Willow Creek, built, shared) | In Elsa Bjergsen’s new neighbourhood; Max Villareal lives in Willow Creek too |
| Garden Gnomes | Coorinberg Cottage (the Munches, Great Soil), or Magnolia Blossom Park (Willow Creek) | Lucas Munch lives there, so the home rule is met. Fishing needs a pond on the lot |
| Upper Crusts | Brook Bungalow (the Bjergsens’ new home, not built) | Clara leads it from home, as in the game |
| Paragons | Leave at La Discotheque | Rivals sharing a club suits the story. Pixel Café would give them coffee, but the Avant Gardes meet there |

**Changing a hangout** means editing the club in the Club panel. She may need one of her played Sims in the club to do it (check in game).

### 2d. The spare clubs

If clubs disband and fewer than 10 are left, the game makes new ones:

| Hangout | Clubs |
|---|---|
| Any Park | Check Mates, Club Cosplay, Just for the Halibut |
| Any Museum | Complementary Colors |
| Any Library | Page Turners (could suit the UoW Students Union, which is a Library) |
| Any Lounge | Punch Lines |
| Any Beach | Dive Club |
| A member’s home | Covalent Bonds, Guild of Gamers, Major Chords, Mixing Crew, Private Club |

**Windenburg has no Park lot now.** That only matters for these spare clubs, and every world has parks or open ground.

---

## 3. Clubs (and fame) on the Sims pages

**What the game stores.** The game has no club relationship between two Sims: members simply share a club. So a club of 6 would mean 15 pair lines in a relationship web, which is too many. It reads better as a group.

| Option | Looks like | Good | Not so good |
|---|---|---|---|
| A. A line on the Sim card | “Clubs: Knights of the Hedge (Leader)” | Cheap | Scattered |
| **B. A “Clubs” block on household pages (suggested)** | Each club any member belongs to, with its other members as chips linking to their households, in any world | Shows the cross-world ties (Bjergsens, Munches and Villareals) | One more block |
| **C. One hub in the web (suggested)** | In the one-household web (sims-display.md §7d-B), a club is one small node with lines to its members, not lines between every pair | Stays tidy | – |
| D. A save-wide Clubs page | One card per club: leader, members, hangout (linked), activities, open or invite only, from the game or hers | Everything in one place | A new page; worth it only if she makes her own clubs |
| E. On the hangout lot’s page | “Club hangout: Partihaus” | Links lots and Sims | – |

- **Tag group:** a 7th group, “Clubs”, beside the six in sims-display.md §6. The Lucide `flag` icon would fit, with the leader shown in words, since the crown is taken by Dynasty.
  - Paragons against Renegades is a club-to-club “Rivals” link.
- **Pictures:** the game’s club emblems are EA art, so use Lucide icons instead (her no-AI and pictures rules).
- **Fame on Sim cards:** for famous Sims only, add three things:
  - a star pill (“B-Lister, 3 stars”);
  - their reputation in one word;
  - quirks as small tags.
  - A Stan and a celebrity feud (the FeudBringer perk) fit the Conflict group as labels.
- **Data sketch** (written here only): one save-wide file, as clubs cross worlds.

```json
// data/clubs.json (sketch; the // notes are explanations, not part of the file)
{
  "partihaus": {"name": "Partihaus", "origin": "game", "leader": "jade-rosa",
                "members": ["jade-rosa", "marcus-flex", "paolo-rocca", "eva-capricciosa"],
                "hangout": {"lot": "The Narwhal Arms"},   // or {"type": "Park"}, or {"homes": true}
                "inviteOnly": true, "activities": ["Drink", "Dance", "Be romantic"], "note": ""}
}
```

---

## 4. Corrections to other notes (for whoever next edits them)

- **research/lot-trait-ideas.md:** Hottest Spot in Town and Up-and-Coming Hotspot are barred only from homes, Residential Rentals, University Housing and Vet Clinics. So Generic lots and Vacation Rentals can take them too. At bars, nightclubs, lounges and karaoke bars only young-adult and older celebrities drop in.
- **research/lot-trait-ideas.md and research/festivals-calendar.md** (“only Calico has Hottest Spot”): true of her plan. But EA’s unbuilt Studio PBP may still have it in her save; check in game.
- **research/worlds/del-sol-valley.md:**
  - In the game, Orchid A Go Go has a 3-star VIP floor, and the Plumbob Pictures Museum has Hottest Spot in Town, like Studio PBP.
  - Ward Park and Pectoral Fitness have no traits.
- **research/undecided-lots.md §8** (Judith Ward): acting classes need a hobby class whiteboard set to Acting and a teacher with Acting 5+. Judith has Acting 7 and is Business Savvy.
- **The wiki’s club numbers:** “up to 8 members” is with two capacity perks (the game’s default is 6). The game tops clubs up below 10, not 11.

---

## 5. Suggestions

Her call each time; how much each changes the game is in brackets.

1. **Studio PBP:** Hottest Spot in Town and a VIP rope (3 or 4 stars) when built, so the awards come back to Del Sol Valley (none; it’s the game’s own setup). Calico can keep its trait or swap to Up-and-Coming Hotspot (already on TODO).
2. **Plumbob Pictures Museum:** Judith Ward as owner, with a hobby class whiteboard for acting classes (small; already suggested).
   - Trait: Up-and-Coming Hotspot (rising stars, discounts) if Studio PBP takes Hottest Spot, or the game’s Hottest Spot (none).
3. **My Celebs:** take in a few of the 7 homeless celebrities, or heart them so the game keeps them (small; already a TODO question). Holly Alto and Dustin Broke bring family ties (Enzo Alto, Skip Broke).
4. **Club hangouts:** move the five in §2c, or leave them as story (small; in game only).
5. **Sims pages:** a “Clubs” block on household pages and clubs as one hub in the web, plus star and reputation pills for famous Sims (none; site only).
6. **Venessa:** Celebrity Home on her San Myshuno flat once she reaches 2–3 stars, so tours start (none).

---

## 6. Decisions for her

1. **Studio PBP:** Hottest Spot in Town (awards in Del Sol Valley) when built? Keep Calico’s too?
2. **Plumbob Pictures Museum:** Judith Ward as owner? Up-and-Coming Hotspot or Hottest Spot?
3. **The five premade clubs whose hangouts don’t fit:** move them (Powerhouse to UoW Sports Center, Spin Masters to La Discotheque, League of Adventurers to Courtyard Lane Playground, Garden Gnomes to Coorinberg Cottage, Upper Crusts to Brook Bungalow), or leave them?
4. **Clubs on the site:** a “Clubs” block on household pages and one hub per club in the web? A Clubs page only if she makes her own?
5. **Fame on Sim cards:** stars and reputation for famous Sims, quirks as tags?

---

## Notes on method

- **Club settings** come from each lot type’s `allowed_for_clubs` and its schedule for unplayed clubs, plus the game’s own messages. “Club Gatherings can only be held at venues and residences owned by [the club’s] members” is the home rule.
- **Club hangouts** are stored as lot ids in the game’s club seeds and were matched to lot names through `research/data/game-lots.json`.
- **Premade members** aren’t in the club seeds; they come from the wiki.
- **A 12th starting seed** in the files, “Check Mates” (chess, any park), isn’t in the wiki’s premade list (it lists it among the spares). It probably has no members in a new save.
- **Paparazzi and fan limits** are the game’s “famous Sim entourage” tests, by world: none, discouraged, slightly discouraged, or normal.
- **Scratch files:** scripts and the downloaded wiki pages are in the session scratchpad (`fame-clubs-scripts/`, `fame-clubs-out/`, `fame-clubs-wiki/`), not in the project.
