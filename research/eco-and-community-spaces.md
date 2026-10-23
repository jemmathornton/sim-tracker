# Eco Lifestyle and Community Spaces: how they play, and her plan (17 Oct)

> Partly out of date since 22 Oct: Port Promise is settled (the Henleys vote; Bess Sterling keeps her job and runs The Quarry Building); Admiral’s Wreckage and The Old Dockyard checked fine (21 Oct).

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own tuning, read with `tools/research/tuning.py` from scratch scripts: every street’s neighbourhood action plans (N.A.P.s) and starting eco footprint, the voting schedule, the eco footprint settings, the four Community Space versions (what each needs, who visits), the Evergreen Harbor development plans (what changes and on which day), the bill changes, and which lot types allow the eco lot traits. The game’s English text for names and the in-game help.
- The Sims Wiki: Neighborhood action plan, Eco footprint, Community space, Community voting board, Influence, Civil designer, Evergreen Harbor, Grims Quarry, Conifer Station, Port Promise, Lot trait, Green fiend, Knox Greenburg, Bess Sterling, Tina Tinker. SimsCommunity’s eco footprint guide.
- Her plan (`data/worlds/*.json`), her Gallery uploads, `research/evergreen-harbor.md`, `lot-trait-ideas.md`, `festivals-calendar.md`, `small-business-check.md`, `plan-vs-game.md`, `story-ideas.md`, TODO.md.
- Owned worlds only (25), unless marked.

---

## In short

- **N.A.P.s are in every owned world except Granite Falls and Selvadorada**, the same 19 everywhere, plus 2 more in each Evergreen Harbor neighbourhood (Green Initiatives and Modern Development). Up to 4 can be active per neighbourhood. Only residents of that neighbourhood can vote.
- **With NPC voting on (the default), neighbours vote by themselves**, so random N.A.P.s (We Wear Bags, Sharing is Caring, fines for using too much power…) can pass in her neighbourhoods without her doing anything. One game option turns this off.
- **The eco footprint is only a starting point.** Each neighbourhood drifts towards what its lots add up to (trees, plants and solar panels push green; fires, generators and rubbish push industrial). Outside Evergreen Harbor it changes the sky and air, not the buildings.
- **Her plan has 4 Community Spaces** (Newcrest, Sulani, Evergreen Harbor, Nordhaven), at most one per neighbourhood. 3 are built and shared with all four versions; New Harbor Park isn’t built.
- **A Community Space only changes version if a resident of that neighbourhood votes.** Two of hers have a single household able to vote: Admiral’s Wreckage (her own Caldera Camp Sims) and The Old Dockyard (the Henleys, not built yet).
- **Evergreen Harbor’s look changes only through its two development plans**, in four stages over 6 days. Her lots aren’t touched; the streets, the quarry, the railway, the refinery, the background houses and the outside of the two apartment buildings are.
- **Her Evergreen Harbor changes work**, with three knock-ons: Port Promise’s clean-up story has only the Henleys to vote for it; The Old Dockyard’s Off-the-Grid does nothing; and The Old Dockyard is now the only Community Space in the world, which the Civil Designer career uses.

---

## 1. How it works

### Neighbourhood action plans (N.A.P.s)

- **Voting:** every week from **Friday 8 am to Monday 6 pm**. The plan with the most votes starts straight away. Each vote costs 10 Influence; Sims earn Influence by making friends, giving gifts, hosting events, getting promoted, following the active plans and in the Civil Designer career.
- **Where:** at the Sim’s own mailbox, at a Community Voting Board on any venue lot, or (Evergreen Harbor only) the public boards on each street. A Community Space isn’t needed to vote.
- **Who:** only Sims who live in that neighbourhood. NPC neighbours vote too unless **Enable NPC Voting** is switched off in the game options (Eco Lifestyle tab).
- **How NPC voting works (from the tuning):** while fewer than 4 plans are active, each plan on the ballot starts the week with 0–2 random votes and gains 0–4 more each day. So with NPC voting on, a random plan will usually pass each week until the neighbourhood has 4. After that, nothing new can pass until one is repealed.
- **Repeal:** a Sim petitions at a mailbox or board and gets 5 neighbours to sign before voting closes.
- **Ballot:** outside voting hours a Sim can add a plan to next week’s ballot (“Add Neighborhood Action Plan…”).
- **Where they don’t exist:** Granite Falls and Selvadorada (holiday worlds) have no plans at all.

**The 19 plans in every world:**

| Kind | Plans | What they do |
|---|---|---|
| Change how townies behave | We Wear Bags; Sharing is Caring; Roughhousing Encouraged; Free Love; Juiced Community; Back to the Old Days | Townies wear paper bags; townies steal and nobody gets caught; townies start fights; townies flirt with anyone, no jealousy; townies are dazed; a §25 fine for using TVs, computers, stoves and microwaves, or being caught woohooing |
| Bills | Power Conservation; Water Conservation | Bills halved, but power is off on Thursdays (water on Wednesdays) 9 am–9 pm, and a §100 daily fine for using too much |
| An inspector calls | Clean Energy Production; Eco-Friendly Appliances; Green Gardening; Upcycling Initiative | Influence for solar panels and turbines, repairs (with Handiness twice as fast), gardening, or recycling and fabricating. A Civic Inspector visits; bills rise if the home doesn’t comply |
| Influence for a hobby | Foodies Unite!; Fun-Loving Community; Rock Your Body (and Mind); Self-Sufficiency; Promote Creative Arts; Support the Performing Arts!; Tech Support | Influence for cooking, comedy and games, fitness and hygiene, fishing and gardening, the arts, music and acting, or tech. The last three also raise pay by almost a third for painters, writers, style influencers and freelancers; entertainers and actors; and tech careers (Civil Designer and Conservationist included) |

**Evergreen Harbor only** (one of each per neighbourhood, so 21 plans there):

| Plan | What it does |
|---|---|
| Green Initiatives in Grims Quarry / Conifer Station / Port Promise | Trees and hedges planted in stages; rubbish cleared; the neighbourhood’s footprint pulled hard towards green (three times as fast, and every lot gets a one-off green push). Residents’ power and water bills up by half |
| Modern Development in Grims Quarry / Conifer Station / Port Promise | New paving, art pieces and building fronts in stages; rubbish cleared. Pay up by about two fifths in every career (wiki), lot taxes up by a fifth |

### The eco footprint

- **Where:** every owned world except StrangerVille, Granite Falls and Selvadorada (wiki; the last two have no plans in the game files either). It can be switched off per save (**Enable Eco Footprint Gameplay**).
- **Three states:** Green, Neutral, Industrial. The game’s scale runs from fully green to fully industrial; each lot has its own footprint, and the neighbourhood’s **drifts slowly towards what its lots add up to**. When a neighbourhood changes state it gets an extra push the same way, so it doesn’t flicker back.
- **What moves it (the game’s own help text):** trees, garden plants, solar panels, wind turbines and dew collectors push green; fires (fireplaces too), generators, atmospheric water generators, trash plants and disposable nappies push industrial. **Eco Lot** makes a lot go green a tenth faster; **Landfill Lot** makes it go industrial a fifth faster. An Eco Inspector can be hired to lower a home’s footprint, and Civic Planners get the Eco-Matic Smog Vacuum.
- **Starting points (game files):** most neighbourhoods start Neutral. Green: Grims Quarry, Magnolia Blossom Park, Desert Bloom Park, Myshuno Meadows and The Bramblewood (fully); Old New Henford, Gilbert Gardens and Hopewell Hills (nearly fully). Industrial: Port Promise (fully). The wiki says Tomarang starts green; the game files don’t set that, so it starts Neutral.

| State | Look | Sims | Perks |
|---|---|---|---|
| Green | Sun rays by day, auroras at night (Gibbi Point’s Underlight Bay among them) | “Clean air” happy moodlet; Green Fiends happy (Knox is one) | Better garden quality; solar, wind and dew collectors make more. The wiki reports a bug: plants grow slower in green and faster in industrial |
| Neutral | Nothing | Nothing | Nothing |
| Industrial | Brown smog, hazy sky; acid rain with Seasons | Coughing and “Gross Air” (uncomfortable); Green Fiends tense; acid rain makes Sims dirty | Selling power and water pays more; better chance of rare collectibles; generators make more; fires more likely |

- **Outside Evergreen Harbor nothing is built or removed.** Only Evergreen Harbor has extra rubbish, trees and buildings that change.

### Community Spaces

- **One lot, four versions**, each its own build with its own lot traits. Only one is in the world at a time; all four can be edited in build mode from the lot’s Venue Info.

| Version | Needs (besides the voting board) | Who comes (game files) |
|---|---|---|
| Community Space | Nothing | Ordinary visitors |
| Community Garden | 4 planters, toilet, sink, bin (2 insect farms and 2 vertical gardens optional) | Ordinary visitors |
| Marketplace | 3 sales tables, toilet, sink, bin (2 market stalls and 2 picnic tables optional) | Shoppers: 2–4 from 8 am, 5–8 at the 3 pm peak, a couple late at night |
| Maker Space | Fabricator, recycler, toilet, sink, bin (woodworking table, easel, candle-making station, juice fizzer and a kids’ activity optional) | A Maker Mentor and a Recycling Guru on duty from morning to late evening; Tina Tinker, the game’s Master Crafter, drops in |

- With Businesses & Hobbies, a tattoo table on the Marketplace or Maker Space hires its own tattoo artist.
- **Choosing the version:** residents of that neighbourhood vote at the same times as the N.A.P.s (Community Space Projects). The winner takes over when voting closes on Monday, so **at most one change a week**.
- **If nobody votes, it never changes.** From the tuning, NPC votes only start once someone has voted for a version that week; then every version gains 0–4 random votes a day, so the result can still wander. The shift-click cheat on the voting board (“Instant Enact Community Space Project”) sets a version straight away.
- **Lot traits:** each version keeps its own. Off-the-Grid isn’t allowed on any of them (game files: only homes, rentals, Tiny Homes, haunted houses, small businesses and Generic).

### Evergreen Harbor’s development

- **Two separate things:** the eco footprint (how clean) and the development (how built-up). Development only changes through Green Initiatives and Modern Development; a neighbourhood can have either, both or neither. Repealing one undoes it in the same stages.
- **The stages (game files), counted in days after the vote:**

| Neighbourhood | Modern Development | Green Initiatives |
|---|---|---|
| Grims Quarry | Day 0: Stonestreet Apartments’ outside gets an eco-chic look. Day 2: art paving on the main streets. Day 4: the quarry gets a new fence and a giant saw-blade sculpture. Day 6: the background houses get eco-chic fronts | Day 0: the quarry. Day 2: the houses. Day 4: the streets. Day 6: the apartments. Pines everywhere |
| Conifer Station | Day 0: Pinecrest Apartments’ outside and pavement. Day 2: a sunflower mosaic on the streets. Day 4: the station remodelled, with a walkway up the railway bridge. Day 6: the gas towers get pine sculptures and the houses get makeovers | Day 0: the station. Day 2: the apartments. Day 4: the streets. Day 6: the houses. Trees and hedges |
| Port Promise | Day 0: astroturf paving and a propeller sculpture. Day 2: new brickwork by the docks. Day 4: the container yard. Day 6: the refinery’s art and Void Critter murals | Day 0: the docks. Day 2: the container yard. Day 4: the streets. Day 6: the refinery. Bushes and trees |

- Both clear the street rubbish from day 0. The wiki says two weeks; the game files say 6 days.
- **Lots are never changed.** The “undeveloped/modernised” difference is the open world plus the outside of the two apartment buildings (her apartment interiors stay as built).
- **It belongs to the save**, not to a lot, so the site can’t take it from her uploads; reading it from a save would go beyond her lots-only rule.

### The Civil Designer career

- Logic and Handiness first, then a branch at level 4: **Civic Planner** (Charisma; Influence and N.A.P.s) or **Green Technician** (Fabrication; eco upgrades and inventions). Work from home or go in. Workplace: Lean Green Design Co-Op.
- **Civic Planner tasks need a Community Space:** “Interview about Neighborhood Action Plans” and “Rally Voters” (for Green Initiatives and Modern Development, or for a Community Space Project) are done at a Community Space’s voting board. Municipal Concepts are drafted on the Drafting Tablet, presented to Sims and submitted by mailbox. Top reward trait: Champion of the People (extra Influence and gifts).
- **Green Technician:** Eco-Invention Concepts unlock new Fabricator recipes (the Smog Vacuum among them). Top reward trait: Eco-Engineer.
- **Tech Support** (a N.A.P.) raises Civil Designer pay by almost a third.
- **The game’s own Civil Designer is Bess Sterling** (level 3, Construction Technician). Her biography: she pushes plans that help her bottom line.

### The three Evergreen Harbor “personalities”

The game gives three premades a neighbourhood role, and their visits and letters push particular plans:

| Sim | Role | Pushes |
|---|---|---|
| Knox Greenburg | Eco Master | Green Initiatives, Eco-Friendly Appliances, Clean Energy Production |
| Bess Sterling | Entrepreneur | Modern Development, Tech Support, Promote Creative Arts |
| Tina Tinker | Master Crafter | Inspires Fabrication recipes; turns up at Maker Spaces |

Knox and Bess dislike each other in the game; in her plan both live in Grims Quarry (Stonestreet #3 and The Quarry Building).

### Community Spaces outside Evergreen Harbor

- **They work the same way:** four versions, a weekly vote by that neighbourhood’s residents, the same visitors.
- **They bring a public voting board** to worlds that have none on the street (mailboxes still work without one).
- **No development plans** outside Evergreen Harbor, and the eco footprint only changes the sky and air.
- **Civic Planners** can do their Community Space tasks at any of them.
- **Holiday worlds** (Granite Falls, Selvadorada) allow the lot type but have no voting, so a Community Space there would stay as it is.

---

## 2. Her plan

### 2a. Her Community Spaces

| Lot (world, neighbourhood) | Size | Built / shared | Versions shared | Can vote on it | Eco start |
|---|---|---|---|---|---|
| Newcrest Community Space (Newcrest, Bridgeview) | 30×20 | Yes / yes | All 4 | 3 households: BFF, Single Mum Friends, Versaree (Comfy Cubby empty) | Neutral |
| Admiral’s Wreckage (Sulani, Mua Pel’am) | 50×50 | Yes / yes | All 4 | 1: her own Sims at Caldera Camp (Key Point undecided) | Neutral |
| The Old Dockyard (Evergreen Harbor, Port Promise) | 30×20 | Yes / yes | All 4 | 1: the Henleys (Abandoned Views, not built) | Industrial |
| New Harbor Park (Nordhaven, Iverstad) | 50×40 | No | None | 3: Koopman, Urbane Housesharers, Sarpong | Neutral |

- **Uploads:** 12 versions. Newcrest’s do best (112–188 downloads each); Admiral’s Wreckage 14–39; The Old Dockyard 19–38. Most downloaded: Newcrest’s plain Community Space (188), Admiral’s Wreckage Garden (39), The Old Dockyard Makers (38).
- **In her Building save (14 Oct):** The Old Dockyard was set to Maker Space; Admiral’s Wreckage was Residential, so it needs setting back to Community Space before it works in play.
- **Lot traits on the site** come from one version only (probably the one active in her save). Each version can have its own.
- **Community Markets** (one build, always on, no vote): Sprucewood Square, 18 Celebration Way, Ro Kaya Rockside and Zanbira Market, none built. Ciudad Enamorada and Innisgreen have one each (not owned).

### 2b. Neighbourhoods with more than one, or none

- **More than one:** none. Each world has at most one.
- **None:** 21 of the 25 owned worlds, and two of Evergreen Harbor’s three neighbourhoods (The Quarry Building and Sprucewood Square went to other types on 15 Oct). That’s fine for voting (mailboxes and Evergreen Harbor’s street boards). The game itself only ships the three in Evergreen Harbor.
- **Notes now out of date:** `community-lots-mix.md` counts 6 Community Spaces (it’s 4), and `evergreen-harbor.md` says Evergreen Harbor keeps 3 (it’s 1).

### 2c. Eco start against her lots

Only the neighbourhoods that don’t start Neutral, plus the one place her lots point the other way:

| Neighbourhood | Starts | Her lots | Fit |
|---|---|---|---|
| Port Promise | Industrial (fully) | A Community Space with a garden version, The Portsmouth Promenade (classes and a port clean-up), a climbing gym and a bar | **Green intentions in an industrial start.** That’s the game’s own story (the port is meant to be cleaned up), but it only happens if someone who lives there votes for Green Initiatives or greens their own lot |
| Grims Quarry | Green (fully) | Knox and both Stonestreet flats with Eco Lot; the Harrises; the Sterling Ricos’ business | Fits. Bess (Entrepreneur) and Knox (Eco Master) pushing opposite plans here is the game’s own rivalry |
| Magnolia Blossom Park, Desert Bloom Park, Myshuno Meadows | Green (fully) | One park each, no residents | Fits; nothing there to pull it away |
| The Bramblewood | Green (fully) | No residents (13 and 14 Nettle Lane and Cordelia’s Secret Cottage empty), a national park | Fits; stays green |
| Old New Henford | Green | The Watson-Holmes home and vet, Olde Mill Hill | Fits |
| Gilbert Gardens | Green | A playground, a Community Market (18 Celebration Way), a wedding venue, one family | Fits. The market’s 2 stoves won’t matter much unless they catch fire |
| Hopewell Hills | Green | 4 family homes | Fits |

- No lot in her plan has Landfill Lot, so nothing pushes a neighbourhood industrial on purpose.
- Off-the-Grid lots: Caldera Camp (Sulani) and Cordelia’s Secret Cottage are fine; their footprint depends on what powers them (solar and wind green, generators industrial). The Old Dockyard’s does nothing (2d).

### 2d. What her changes break

| Change | Effect | Suggestion |
|---|---|---|
| The Old Dockyard keeps Off-the-Grid (from when it was The Shipping Views, a home) | Does nothing: Community Spaces can’t use it (game files). The site shows it as a lot challenge it doesn’t have in play | Take it off in game (already on TODO); Eco Lot in its place suits the clean-up |
| Sprucewood Square becomes a Community Market | Works: always a market, no vote. Conifer Station still votes at its street board and mailboxes. It no longer counts for Civil Designer tasks | None needed. Tina Tinker (Canal Corner) and Mary Greenburg (a gardener) could sell there; Sims can sell their own goods at a Community Market |
| The Quarry Building becomes the Sterling Ricos’ home and business | Works. Grims Quarry loses its Community Space; votes still work at its street board | None needed |
| The Waterfront becomes the Abandoned Views rental | Works. The game’s Waterfront has Landfill Lot, which a rental can’t use, so it can’t push Port Promise further industrial | Leave Landfill Lot off |
| Only one Community Space left in Evergreen Harbor | Civic Planner tasks (Interview, Rally Voters) all happen at The Old Dockyard, in Port Promise | Fine; if Bess stays a Civil Designer she has to go to the docks for her rallies (a nice touch) |
| The Greenburgs’ home is a venue (open on TODO §6) | The clean-up family don’t live in Port Promise, so they can’t vote for its clean-up. Knox can’t either (Grims Quarry) | See question 3 |
| Port Promise has one household (the Henleys) | They alone decide its N.A.P.s and The Old Dockyard’s version, with random NPC votes on top | See questions 2 and 3 |
| Admiral’s Wreckage: only her own Sims can vote | It changes only when she votes or uses the cheat | Pick the version that suits the story (question 4) |
| Admiral’s Wreckage was Residential in her save | No versions or voting until it’s Community Space again | Set it back in game |

Nothing else in her plan depends on Eco Lifestyle: festivals, school events and the other venues don’t need a Community Space (`festivals-calendar.md`).

---

## 3. Suggestions

Her call each time; how much each changes the game is in brackets.

1. **Decide on NPC voting** (none; a game option). Off: nothing changes unless her Sims vote, so no surprise bags or thefts. On: neighbourhoods fill with random plans, which can be fun story but may clash with her worlds (Back to the Old Days in a tech town, We Wear Bags in Del Sol Valley).
2. **Set each Community Space’s version on purpose** (none; the voting-board cheat or her own votes):
   - The Old Dockyard: Maker Space (as in her save; Tina visits, and it suits “a new (but old) maker space”).
   - Admiral’s Wreckage: Community Garden (it already has Great Soil; island produce; also its most downloaded version).
   - Newcrest Community Space: whichever she likes; the Maker Space adds staff and has the kids’ activity tables for Midtown Meadows’ children.
   - New Harbor Park, when built: Maker Space for the hobby city, or Marketplace for Nordhaven’s small businesses to sell at.
3. **Give Port Promise some green voters** (small; a household move). Mary and Blossom living at The Portsmouth Promenade (as a home with a business, like The Quarry Building) would put the clean-up family in the neighbourhood they’re cleaning up. It also settles the open question of where they live (TODO §6).
4. **Knox v Bess, in game terms** (none). Both in Grims Quarry: Knox votes Green Initiatives, Bess votes Modern Development. Both plans can be active at once, so the quarry can end up with pines and saw-blade art.
5. **Eco Lot on The Old Dockyard** instead of Off-the-Grid (none; a trait). Already suggested in `lot-trait-ideas.md`.
6. **Leave the eco starts as they are** (none). None of her lots fights a starting footprint except Port Promise, where that’s the point.
7. **Evergreen Harbor’s development on the site** (TODO): as it lives in the save, the simplest is for her to say which plans her save has (or wants) and show it as text on the neighbourhood cards.

---

## 4. Decisions for her

1. **NPC voting:** on or off in her play save?
2. **Community Space versions:** which version should each one be (The Old Dockyard, Admiral’s Wreckage, Newcrest, New Harbor Park)?
3. **Mary and Blossom Greenburg:** live at The Portsmouth Promenade (in Port Promise, voting for the clean-up), or rent at Rockridge Springs next to Knox? (Already open on TODO §6.)
4. **Evergreen Harbor development:** which plans does she want active: Green Initiatives, Modern Development, both or neither, per neighbourhood?
5. **The Old Dockyard:** take off Off-the-Grid, and add Eco Lot? (Already open on TODO.)
6. **Bess Sterling:** keep her Civil Designer job alongside the Quarry Building business?

---

## Notes on method

- N.A.P. lists come from each street’s settings (103 streets read): every residential street lists the same 19; the three Evergreen Harbor streets add their own two; the holiday worlds’ streets list none.
- NPC voting: each street plan has a starting random vote range (0–2) and a daily one (0–4), applied while fewer than 4 are active. Community Space versions start at 0 and only get daily random votes once one of them has a vote.
- Development days come from each stage’s delay (0, 2, 4 or 6 days). Bill changes come from the game’s bills settings (Green Initiatives ×1.5 on power and water; Modern Development ×1.2 on taxes; the conservation plans ×0.5).
- Visitors per version come from each version’s schedule; ordinary visitors (the same for every venue) aren’t counted.
- Small gap spotted: Innisgreen (not owned) has two streets that start green in the game files, but its neighbourhoods have no eco start in the plan, because the game files for an uninstalled world don’t say which street is which neighbourhood. Worth filling when she buys it.
- Scratch scripts, the tuning extracts and the downloaded wiki pages are in the session scratchpad (`eco-work/`), not in the project.
