# Students and schools: how the game runs uni and high school, and her plan (overnight 17 Oct)

> Out of date since 21 Oct: the Copperdale boarding houses are Residential Rentals with 2 units each, and Mossy Lane stays open.

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own tuning, read with `tools/research/tuning.py`: what each lot type needs, University Housing rules, roommates, organisation events, prom, graduation, campus walk-bys. Plus the game’s English text (`tools/sims4files.py`).
- The Sims Wiki: Discover University, High School Years, Britechester, University of Britechester, Foxbury Institute, Gibbs Hill, Copperdale, Rockridge Heights, Prescott Square, Plumbite Cove, Dormitory, Commons, Organization, Secret society, Roommate, High school (lot assignment), Auditorium, Prom, Graduation, Thrift and bubble tea store, and the premade Sims’ pages.
- Her plan (`data/worlds/*.json`), her Gallery uploads, the 14 Oct save check (`research/data/plan-vs-game.json`), TODO.md and the world notes.

---

## In short

- **Uni runs from Britechester.** Classes are in the campus lecture halls, which aren’t lots. Lots matter for four things: halls (University Housing), the two commons, a Library (study sessions) and a Bar (organisation bar nights).
- **University Housing can only be moved into by enrolling.** Manage Households can’t put anyone there, and Sims who aren’t enrolled get moved out.
- **So the Copperdale boarding houses won’t work as University Housing:** teens still at school can’t enrol. As Residential they would work (a household of teens only is allowed).
- **Everything else the game needs is there and typed right:** both commons, 4 campus halls plus Mossy Lane, Laurel Library, The Royal Crown (Bar), Copperdale High School, the Auditorium and a Thrift and Boba Store.
- **Plenty of dorm space:** 9 halls (Britechester 5, Windenburg 2, StrangerVille 2), up to 10 Sims each, with 3 premade students living in them.
- **High school is Copperdale High for every world** when you follow a teen there; otherwise it happens off-screen. Prom, graduation and career day only happen in the Auditorium.
- **One thing to check in game:** the prom after-party is set on Plumbite Cove’s street. With Totter Park now the Prices’ home, the only public lots left there are BridgeCreek Drive (Backroom) and LaSuli Point (undecided).

---

## 1. University (Discover University)

### How it works

- **Enrolling** (phone or computer): pick UoB or Foxbury, a degree (13 in all; UoB has 7 distinguished degrees, Foxbury 6), up to 4 classes a term, and housing.
- **Housing:** a hall of that university (University Housing), or **Off Campus**: stay at home, with no housing cost. Students who stay at home can live in any world and travel to Britechester for classes.
- **Not lots:** the lecture halls, stadiums, statues, kiosks and the Secret Society’s ritual ground are all open world.
- **Teens** can enrol only after **early graduation** from high school (grade A and two skills at level 4).
- **Professors:** 4 per university, picked from townies. The 4 homeless Britechester premades may be chosen.

### University Housing (halls)

| Rule | What the game does |
|---|---|
| Who can live there | Only Sims who enrol and pick that hall. The game says “University Housing is only available through enrollment”. Sims can’t be moved, merged or transferred in |
| Who gets moved out | Sims who graduate, drop out, are suspended or don’t enrol again; pregnant Sims (third trimester); new babies |
| Lot settings | Which university (UoB or Foxbury); a gender limit (a fraternity or sorority); roommates only from one organisation or club |
| Roommates | NPC students of that hall’s university fill the spare beds, up to 10 Sims in all including the played household. They only come while a played student lives there |
| Must have | 4 beds, a toilet, a shower |
| Not allowed | Stoves, grills, pizza ovens; water heaters and fuse boxes (For Rent). Any of these marks the lot “Incomplete” and students can’t move in. Microwaves, cafeteria stations, fridges and vending machines are fine |
| Extras | A free maid once a week and a free repairman. The lot can’t be edited while students live there (without `bb.enablefreebuild`) |
| Where | Any world except the holiday worlds |

### The two commons

| | UoB Commons (the game’s UBrite Commons) | Foxbury Commons |
|---|---|---|
| Both need | 3 tables, 10 chairs, 2 couches, 4 desks, a bin, a toilet, a sink, a cafeteria station | the same |
| Plus | A debate podium set and a microphone | 4 computers and 2 robotics workstations |
| Events | Poetry nights, debate practice, exam cram, mixers | E-sports, robot building, exam cram, mixers |

Food is free for students, and they drop in to study late. Both types are allowed in every world except the holiday ones.

### Events that need a lot type

| Event | When | Needs |
|---|---|---|
| Organisation bar nights | 7 a week, evenings, 4 hours: Mon Bot Savants, Tue Art Society, Wed and Sun Foxbury Spirit Squad, Thu Debate Guild, Fri Brainiacs, Sat Britechester Spirit Corps | A **Bar** lot. The Royal Crown is Britechester’s only one |
| Brainiacs study sessions | Mon–Thu, 3 pm | A **Library** lot (Laurel Library) |
| Debate practice; robot building | Commons evenings | The matching **commons** |
| Debate Showdown, Figure Painting, Utili-Bot Contest, Game Day Parties, School Spirit Day, Creativity Celebration | Weekends and afternoons | Nothing: they happen on the campus streets |
| Secret Society (the Order of Enchantment) | Rituals 3 nights a week from 10 pm | Nothing: the ritual ground on Gibbs Hill. To join, a Sim leaves a high-quality offering at their campus statue and a member gets in touch |

### How many students the game puts about

- **Halls:** up to 10 Sims each, roommates by bed count, and only while a played student lives there.
- **Campus streets** (UoB): about 4–8 passers-by at a time in the day and 5–7 in the evening, many of them students and professors, plus teens touring the campus.
- **University Student Hang Out** (lot trait) brings 3–6 extra students and professors to that lot, in any world. It can’t go on homes, halls, rentals, restaurants, retail, spas, vets or small businesses.
- The game uses unplayed students it already has and makes up new ones when it runs short. Organisation members are made the same way.

---

## 2. High school (High School Years)

### How it works

- **School days:** teens in any world go to school Mon–Fri, 8 am–3 pm. It’s off-screen unless you follow them; then the game takes them to **Copperdale High School**, the only working high school. No other lot can be given the High School type.
- **The day:** two classes (10 am and 2 pm), exams on Fridays. Classmates are NPC teens (ones she already has first, made up if there aren’t enough), with 2 teachers (Rita Coombes, Anjelo Morlind), the principal (Mei Prescott) and a janitor.
- **After-school teams:** cheer, chess, computer and football. Practice is off-screen; the school also brings in NPC members of each team.
- **Rules:** an expelled teen (an F grade, or three strikes) can’t go to prom. Early graduation lets a teen start uni.

### Lots and what they need

| Lot | Type | Needs | Notes |
|---|---|---|---|
| Copperdale High School, 64×64 | High School | 2 toilets, 2 sinks, 2 whiteboards, a cafeteria station, the principal’s desk, a loudspeaker, 8 desks, 8 lockers, 2 dining tables | Can only be replaced in build mode, not from Manage Worlds. It saves to the Gallery as Generic |
| Auditorium, 30×20 | Auditorium, in 4 versions | Every version: toilet, sink, bin; a podium (except Career Day) | Prom (Formal Dance) also needs a speaker, photo booth, buffet table, and High School Years’ own notice board and punch fountain. Career Day needs 3 career day tables. Only Copperdale’s lot can have it |
| Thrift and Boba Store | Thrift and Boba Store | 4 thrift racks, a shop counter, 2 dining tables, 4 chairs, a coffee table, a sofa, the bubble tea counter, a microphone, a speaker, a bin, a toilet, a sink | Any world. Eloise Hiddlestix runs it. Fashion shows Mon and Fri, comedy Wed (the game’s tuning; corrected 17 Oct), poetry Sun |

### The big nights

| Event | When | Where |
|---|---|---|
| Prom | Saturdays, 7–11 pm | The Auditorium (its prom version) |
| Prom after-party | Saturday from 11 pm, about 3 hours | Plumbite Cove’s street (the Pier), by invitation |
| Graduation | Sunday 6 pm, after a teen ages up | The Auditorium |
| Career Day | A school-day calendar event | The Auditorium (its Career Day version) |
| Sports days, science fairs | After school | The school field and grounds (open world) |

Prom can’t be moved anywhere else: players can’t give the Auditorium type to another lot. The Pier is only the after-party.

---

## 3. Her plan

### 3a. Lots the game needs

| Needed for | Her lot | Type in the plan | OK? |
|---|---|---|---|
| UoB commons | Darby’s Den | UoB Commons | Yes. In game it must stay UBrite Commons (it is in her save) |
| Foxbury commons | Larry’s Lagoon | Foxbury Commons | Yes |
| UoB halls | Drake Hall, Wyvern Hall | University Housing | Yes. The game has 3; Darkwing House is now The Old Clocktower |
| Foxbury halls | Tidal Tower, Briny Tower | University Housing | Yes. The game has 3; Maritime Manor is now Foxbury Court |
| Gibbs Hill hall | Mossy Lane | University Housing | Yes; it needs a university picked (3d) |
| Study sessions | Laurel Library | Library | Yes. Her Building save had it as Generic on 14 Oct; it needs to be a Library in play |
| Bar nights | The Royal Crown | Bar | Yes; keep it a Bar |
| High school | Copperdale High School | High School | Yes (the game’s build) |
| Prom, graduation, career day | Auditorium | Auditorium | Yes (the game’s build) |
| Eloise’s shop | Town Square Stores | Thrift and Boba Store | Yes |
| Teens’ boarding houses | Prescott and Lakeview Boarding Houses | University Housing | **No** (3d) |

### 3b. Student households

| Household | Home | Who | Uni or school |
|---|---|---|---|
| Best of Friends | Wyvern Hall | Julia Wright, Becca Clarke | Enrolled at UoB |
| Fletcher | Briny Tower | Cameron Fletcher | Foxbury (Computer Science) |
| Pleasant | Spring Steppes, unit 2 (tenants) | Angela and Lilith, twins | One at each university; off campus |
| Elderberry | Spring Steppes, unit 1 (landlords) | Rohan, a teen, with his grandparents | High school now, uni soon |
| “Current uni Sims” | Rippling Flats, Newcrest (not built) | Her own | Off campus |
| Chess/Comp Teens, Cheer/Football Teens | Prescott and Lakeview Boarding Houses | Her own | Copperdale High |
| Prescott, Price, Harjo | Golden Peak, Totter Park, Little Falls Nook | Molly (chess), Sidney (cheer), Savannah (computer), Kevin, Noah (football), Ash. Amy and Jayden are children about to turn teen | Copperdale High |
| Goth (Willow Creek) | Ophelia Villa | Cassandra, a teen | High school |

Empty and ready for students: Spring Steppes unit 3, and the Fraternity and Sorority Apartments in San Myshuno (3 bedrooms each).

### 3c. Dorm space

| World | Halls | Lived in | Bedrooms on her uploads | Places (10 a hall at most) |
|---|---|---|---|---|
| Britechester | Drake Hall, Wyvern Hall, Tidal Tower, Briny Tower, Mossy Lane | 2 (3 students) | 8, 8, 8, 9, 9 | 50 |
| Windenburg | UoW Hare Halls, UoW Hedgehog Halls | none (not shared) | – | 20 |
| StrangerVille | SU Plateau Residence, SU Overlook Residence | none (not shared) | – | 20 |

- **More than enough:** 9 halls with room for 90, and 3 premade students in them. Off campus, 3 more places are ready (Spring Steppes unit 3 and the 2 apartments), with Rippling Flats planned.
- **Empty halls stay empty:** roommates only come with a played student, nobody can be moved in by hand, and Neighbourhood Stories only moves households into Residential lots.

### 3d. What her changes could break

| Change | Effect | Suggestion |
|---|---|---|
| Copperdale boarding houses as University Housing | **Breaks.** Only enrolled uni students can live there. Teens still at school can’t enrol, and Manage Households won’t move anyone in. Any roommates would be uni students, and stoves aren’t allowed | Residential: a teen-only household is allowed, and a house parent is optional. Or a Residential Rental with a unit per team |
| Mossy Lane as University Housing | Fine | Pick UoB or Foxbury in its lot settings. Before re-uploading it as University Housing (TODO §6), check it has no stove, grill, water heater or fuse box: her upload is Residential and may have a kitchen |
| Spring Steppes as a rental for students | Fine | Students enrol “Off Campus” and keep their unit. If Rohan picks a hall, he leaves the Elderberrys’ household |
| Darkwing House and Maritime Manor as nightclubs | Fine | Each university keeps 2 campus halls. The Old Clocktower is Retail in her save, and Retail only opens with a played owner (TODO §6b) |
| Darby’s Den as “UoB Commons” | Fine | It’s her name only; the in-game type stays UBrite Commons |
| The Royal Crown | Fine as a Bar | Keep it a Bar. As a Karaoke Bar or Backroom, the bar nights would probably lose their venue (untested) |
| Laurel Library | Fine | A Library in play, not Generic |
| Totter Park as the Prices’ home | Probably fine | It was the game’s only park and the public way into the Pier. LaSuli Point as a Park would replace both (TODO §5) |
| UoW halls, SU residences | Fine | They’re halls of UoB or Foxbury, so students there travel to Britechester for every class. Check once in game that they appear at enrolment |
| ThrifTea as Prescott Boarding House | Fine | Eloise runs Town Square Stores instead (research/townies-and-roles.md) |
| Copperdale High School, Auditorium | Unchanged | Leave their types alone. A new build goes on in build mode and needs the objects in §2 |
| Del Sol Valley | No school or uni lots | The Plumbob Pictures Museum’s acting classes are a small business, so they only run while its owner is played |

---

## 4. Suggestions

Her call each time; how much each changes the game is in brackets.

1. **Copperdale boarding houses → Residential** (small; makes them work). A teen-only household is fine. A house parent of her own would add a story.
2. **Universities for the halls** (none; a lot setting). Mossy Lane sits between both campuses, so either works. StrangerVille’s science side suits Foxbury.
3. **Rivalry through lot settings** (small; the game supports it). Drake Hall’s roommates only from the Debate Guild and Wyvern Hall’s only from the Britechester Spirit Corps. Or the UoW halls as a fraternity and a sorority, using the gender limit.
4. **University Student Hang Out at La Discotheque and the UoW Students Union** (small; already in research/lot-trait-ideas.md). It brings Britechester students and professors to Windenburg, so the “University of Windenburg” feels lived in.
5. **After uni** (none). Wyvern Hall’s and Briny Tower’s students are moved out when they graduate. Spring Steppes unit 3, the Fraternity and Sorority Apartments and Rippling Flats are ready as next homes.
6. **LaSuli Point as a Park** (small; already suggested in research/undecided-lots.md). It gives the Pier a public lot again, for the fairground and the prom after-party.
7. **Rohan at Copperdale High** (none). He can be followed to school from Britechester: a small link between the two worlds.
8. **Robert Piggott School** (her upload, 3 Aug 2022) is 64×64 and saved as Generic, which is how a high school saves, with the four teams in its text. It could be Copperdale High’s build.

---

## 5. Decisions for her

1. **Copperdale boarding houses:** Residential (or a rental with a unit per team) instead of University Housing?
2. **Mossy Lane:** a UoB or a Foxbury hall? Any gender or organisation limit?
3. **Windenburg halls and StrangerVille residences:** which university each?
4. **Robert Piggott School:** Copperdale High’s build, or a bonus build?
5. **Rohan Elderberry:** stay at home at Spring Steppes, or move into a hall when he enrols?
6. **LaSuli Point:** a Park, which would also give the Pier a public way in? (Already open on TODO §5.)
