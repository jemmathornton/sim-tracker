# Festivals and events calendar (overnight 17 Oct)

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own tuning, read with `tools/research/tuning.py` from a scratch script: every festival, venue event, organisation event, school event, holiday and competition, with its day, start time, length, how often it repeats (its scheduling group and cooldown) and the street it’s on. The game’s English text for names and the times it shows on festival signs and notice boards.
- `research/data/world-extras.json` (which neighbourhood each festival’s street belongs to) and her plan (`data/worlds/*.json`).
- The Sims Wiki: Festival, Holiday, Calendar, Prom, Graduation, Organization, Celebrity award, Lunar cycle, Neighborhood action plan, and the world and neighbourhood pages. Earlier notes: `research/students-and-schools.md`, `research/pets-and-horses.md`, `research/lot-trait-ideas.md`, `research/world-extras.md`.
- Owned worlds only (25). Forgotten Hollow, Tartosa, Moonwood Mill, Ciudad Enamorada and Innisgreen are left out.

Times are the game’s own where it shows them (festival signs, notice boards); otherwise worked out from the tuning (start plus length) and marked “about”. Names marked * are never shown by the game; the name is made from its settings, as on the site.

---

## In short

- **Festivals never need a lot.** Every festival in her worlds happens on the open streets of a neighbourhood, so none was lost when she re-typed lots.
- **Lot-based events do depend on her lot types:**
  - **Lounges** get Talent Showcase (open mic), Meet A Celebrity and the Starlight Accolades. Gibbi Point and Tomarang have lost theirs (Fearful Fish Lounge is now Thrift ’n’ Fish; The Screaming Gecko is a Karaoke Bar).
  - **The Starlight Accolades** go to a lounge with Hottest Spot in Town. Only Calico has it, so the awards are in Brindleton Bay, not Del Sol Valley (already a question in `lot-trait-ideas.md`).
  - **Thrift and Boba Stores** get fashion shows, comedy and poetry nights. Copperdale’s moved from the game’s ThrifTea (now Prescott Boarding House) to Town Square Stores; it still works.
  - **Prom, graduation and Career Day** need Copperdale’s Auditorium, which she keeps as the game built it.
- **Busiest worlds:** Sulani has something on every day; so do Ravenwood and Nordhaven. San Myshuno, Mt. Komorebi and Gibbi Point fill weekends.
- **Save-wide:** the four Seasons holidays (none in summer), surprise holidays, and N.A.P. voting every weekend.
- **Many festivals are every other week** (San Myshuno, Mt. Komorebi, Sulani’s Island Celebration). Which week depends on her save, so a calendar can only say “every other week”, not which.

---

## 1. Save-wide

### Seasons holidays (every world)

With the game’s default one-week seasons (the week starts on Sunday). Holidays run from 6 am to 2 am the next day.

| Season | Day | Holiday | Day off |
|---|---|---|---|
| Spring | Friday | Love Day | No |
| Summer | – | none | – |
| Autumn | Thursday | Harvestfest | Yes |
| Winter | Wednesday | Winterfest | Yes |
| Winter | Saturday | New Year’s Eve | Yes |

- With two- or four-week seasons the game moves them to other days. Her own custom holidays (if any) are in her save, which wasn’t read.
- **Surprise holidays** appear at random, a few days ahead, at most once every four weeks each, never a day off: Rebate Day (Monday), The Lottery (Wednesday), TV Season Premiere (Thursday), Night on the Town (Friday), Talk Like a Pirate Day and Neighborhood Brawl (Saturday), Prank Day and New Skill Day (Sunday).
- The Sims 4 has no Spooky Day holiday (that was The Sims 3); spooky traditions can go on a holiday she makes.

### Neighbourhood action plans (Eco Lifestyle, every world)

- **Voting every week, Friday 8 am to Monday 6 pm**, in every neighbourhood with residents.
- Votes go in at a Community Space’s voting board or a home’s mailbox. Built Community Spaces: Newcrest Community Space, Admiral’s Wreckage (Sulani), The Old Dockyard (Evergreen Harbor); New Harbor Park (Nordhaven) isn’t built. Mailboxes work everywhere, so nothing is missing.

### The moon

- The default lunar cycle is **8 days**, so a new moon and a full moon each come round every 8 days and drift through the week. Two festivals follow it: Glow and Flow (Gibbi Point, new moon) and Full Moon Revelry (Ravenwood).

---

## 2. World by world

### San Myshuno (City Living)

Each festival is **every other week**: the game pairs Humor and Hijinks with GeekCon and the Spice Festival with the Romance Festival, one of each pair a week, and holds the Flea Market every second Sunday. No festivals on Wednesday or Thursday. With Seasons, the weather turns sunny in a neighbourhood while a festival is on.

| Day | Time | Festival | Where |
|---|---|---|---|
| Monday | 5–11 pm | Humor and Hijinks Festival | Arts Quarter |
| Tuesday | 10 am–4 pm | GeekCon | Fashion District |
| Friday | 5 pm–1 am | Spice Festival | Spice Market |
| Saturday | 5 pm–1 am | Romance Festival | Fashion District |
| Sunday | 10 am–6 pm | Flea Market | Spice Market |

### Mt. Komorebi (Snowy Escape)

Weekends only, **every other week** each.

| Day | Time | Festival | Where |
|---|---|---|---|
| Friday | 6 pm–1 am | Festival of Light | Senbamachi |
| Saturday | 3 pm–midnight | Festival of Snow | Yukimatsu |
| Sunday | 10 am–6 pm | Festival of Youth | Wakaba |

### Henford-on-Bagley (Cottage Living)

- **Finchwick Fair, every Saturday, 3.30–9.30 pm, in Finchwick.** It rotates through five fairs: Chicken, Cow, Garden, Llama and Oversized Crop. Each has two contests (the animal and its produce, or a crop and a pie), plus market stalls.
- The judge is the mayor, Lavina Chopra. The Chopras are homeless by her choice; Lavina is still in the save, so the fair should still have its judge (worth a look in game).

### Sulani (Island Living)

Ohan’ali Town has something every day; the game never names these on screen (*).

| Day | Time | Event | Where | How often |
|---|---|---|---|---|
| Monday | about 4–10 pm | Town BBQ* | Ohan’ali Town | Every week |
| Monday | about 8 am–2 pm | Turtle Hatching* | Mua Pel’am | Every third week |
| Tuesday | about 1–7 pm | Flowers and Music* | Ohan’ali Town | Every week |
| Wednesday | about 6 pm–midnight | Town Potluck* | Ohan’ali Town | Every week |
| Thursday | 9 am–midnight | Island Celebration* | Ohan’ali Town | Every other week |
| Friday | about 6 pm–midnight | Beach Bonfire* | Ohan’ali Town | Every week |
| Saturday | noon–6 pm | Fishing Competition* | Ohan’ali Town | Every week |
| Sunday | about 9 am–4 pm | Family Fun Day* | Ohan’ali Town | Every week |

### Britechester (Discover University)

Organisation events, for university students who belong (or are invited). The quads, the canal and the Ritual Grounds are open world; the rest need a lot.

| Day | Time | Event | Where |
|---|---|---|---|
| Sunday | 10 am–2 pm | Figure Painting (Art Society) | by the canal near the UoB Commons |
| Monday, Thursday | 3–7 pm | Figure Painting | as above |
| Sunday | noon–6 pm | Utili-Bot Contest (Bot Savants) | Foxbury quad |
| Sunday | 3–9 pm | Creativity Celebration (Spirit Corps) | UoB quad |
| Tuesday, Wednesday | 4–8 pm | Debate Practice (Debate Guild) | Darby’s Den (UoB Commons) |
| Tuesday, Thursday | 7–11 pm | Robot Building Meetup (Bot Savants) | Larry’s Lagoon (Foxbury Commons) |
| Monday to Thursday | 3–7 pm | Study Session (Brainiacs) | a Library: Laurel Library |
| Every night | 8 pm–midnight (Sunday 6–10 pm, Saturday 10 pm–2 am) | Bar nights, one organisation a night | a Bar: The Royal Crown |
| Friday | 3–7 pm | Foxbury Game Day Party | Foxbury quad |
| Friday, Saturday | 3–7 pm | Britechester Game Day Party | UoB quad |
| Saturday | 8 am–2 pm | Debate Showdown | UoB quad |
| Saturday | 11 am–5 pm | School Spirit Day | Foxbury quad |
| Wednesday, Friday, Sunday | 10 pm–2 am | Sprite Celebration Ritual (secret society) | Ritual Grounds, Gibbs Hill |

- **Commons nights** (both commons, most weeks): Exam Cram Monday 10 pm–6 am, Mixer Saturday 8 pm–1 am; Poetry Thursday 8 pm–midnight at Darby’s Den, E-Sports Wednesday 2–6 pm at Larry’s Lagoon.
- **Graduation:** the morning after a student passes their last classes, at the university stadium (open world).

### Copperdale (High School Years)

| Day | Time | Event | Where |
|---|---|---|---|
| Thursday | 5–10 pm | Football Team Sports Day | the football field behind the high school |
| Friday | 5–10 pm | Cheerleading Team Sports Day | the football field |
| Friday | 10 am–3 pm | High School Exams | Copperdale High School |
| Saturday | 7–11 pm | Prom (every week, if a teen is played) | the Auditorium; after-party on Plumbite Cove’s pier |
| Sunday | from 6 pm | High School Graduation (after a teen ages up) | the Auditorium |
| a school day | – | Career Day (the game picks the day) | the Auditorium |
| when a team calls one | 5–10 pm | Chess Team and Computer Team Science Fairs | the school grounds |

### Ravenwood (Life & Death)

| Day | Time | Event | Where |
|---|---|---|---|
| Monday, Wednesday, Friday | 6–11 pm | Afterlife Anonymous (ghosts) | Mourningvale |
| Tuesday, Thursday | 10 am–3 pm | Afterlife Anonymous | Mourningvale |
| Monday, Wednesday, Friday | 11 am–5 pm | Casket Sale* | Crow’s Crossing |
| Tuesday, Thursday, Sunday | 11 am–5 pm | Funeral BBQ* | Crow’s Crossing |
| Wednesday | 10 am–6 pm | Thinned Festiveil | Mourningvale |
| Saturday | noon–8 pm | Ravenwood Family Day | Crow’s Crossing |
| Every night but the new moon | 7 pm–1 am | Moon Revelry | Whispering Glen |
| Every full moon | night | Full Moon Revelry | Whispering Glen |

The wiki calls Crow’s Crossing’s daily events the “Celebration of Life”.

### Nordhaven (Businesses & Hobbies)

Seven hobby meetups, each twice a week (once in each neighbourhood), five hours each. Sims can sign up for reminders at the hobby meetup notice board in each neighbourhood’s centre.

| Meetup | Gammelvik | Iverstad |
|---|---|---|
| Writers & Readers | Saturday 2–7 pm | Monday noon–5 pm |
| Galactic Gambits | Monday 8 pm–1 am | Wednesday 8 pm–1 am |
| Sweat & Socialize | Tuesday 6–11 am | Thursday 6–11 am |
| Pottery & Pals | Thursday 5–10 pm | Tuesday 5–10 pm |
| Munch & Mingle | Wednesday 11 am–4 pm | Friday 11 am–4 pm |
| Spotlight Stars | Friday 6–11 pm | Sunday 6–11 pm |
| Creative Cowork | Sunday 8 am–1 pm | Saturday 8 am–1 pm |

(The site shows these as one line, “Hobby meetups”; the game’s own names are above.)

### Gibbi Point (Adventure Awaits)

| Day | Time | Festival | Where |
|---|---|---|---|
| Monday to Wednesday | 9 am–6 pm | Fitness Fest (Wednesday is Wacky Wednesday) | Jellyfish Junction’s town square |
| Every new moon | 7 pm–2 am | Glow and Flow Festival | Underlight Bay, Jellyfish Junction |
| Saturday, Sunday | 1–6 pm | Sunrise, Sunset Festival | Crystal Valley |
| Saturday, Sunday | 7 pm–2 am | ’Round the Fire Festival | Wanderwood Wilds |

Underlight Bay is also where the auroras show, if the neighbourhood’s eco footprint is green.

### Tomarang (For Rent)

- **The Night Market, every day, 6 pm–2 am, in Morensong.** Food and shopping stalls on the street; not a lot.
- Rentals have their own events (maintenance days, pet days and the like), on any rental lot.

### Chestnut Ridge (Horse Ranch)

- **Horse competitions, any day**, at the Hay Now! Equestrian Center (a rabbit hole in New Appaloosa, 7 am–7 pm): Barrel Racing, Endurance Racing, Show Jumping and Western Pleasure, Beginner to Master.
- **The Ultimate Horse Championship is on Saturdays only** (entry §2,000), for horses that have placed in every Master event.
- No public rest stop in New Appaloosa since Duke’s Hall became Appaloosa Stables (already on TODO.md).

### Ondarion (Royalty & Legacy)

- **No scheduled festivals** in the game files.
- **Swordsmanship tournaments, any day:** Gunther Goth’s Cup (Swordsmanship 2), Regional Ondarion Invitational (6) and SimNation Grand Masters (9).
- **Grand Balls** are events she plans herself; the palaces host them. All three palaces and Abrantes Estate are still Residential.

### Lounges and thrift stores (any world)

| Lot type | Events | Her lots |
|---|---|---|
| Lounge (Get Famous) | Talent Showcase Friday and Saturday 6–11 pm; Meet A Celebrity Monday and Wednesday 10 am–4 pm (only with Up-and-Coming Hotspot); Starlight Accolades Sunday 6–11 pm (only with Hottest Spot in Town). Every Monday the game picks the week’s events for each lounge from these | Calico (Brindleton Bay, Hottest Spot); Orchid A Go Go (Del Sol Valley, Up-and-Coming); Studio PBP (Del Sol Valley, not built); The Rouge Note (Nordhaven, if it stays a Lounge); La Vivace (Ondarion, not built) |
| Thrift and Boba Store (High School Years) | Fashion shows Monday and Friday, comedy open mic Wednesday, poetry open mic Sunday, all 3–8 pm, every week | Town Square Stores (Copperdale), Chee-wit Chee-waa Kanto (Tomarang), Boba Ippai (Mt. Komorebi); Planet Honey Pop! (San Myshuno) and Thrift ’n’ Fish (Gibbi Point) not built |

(`students-and-schools.md` says comedy is on Friday; the tuning puts it on Wednesday.)

### Worlds with nothing scheduled

Willow Creek, Oasis Springs, Newcrest, Granite Falls, Magnolia Promenade, Windenburg, Selvadorada, Brindleton Bay (apart from Calico’s lounge nights), Del Sol Valley (apart from the lounges), StrangerVille, Glimmerbrook, Evergreen Harbor (apart from N.A.P. voting) and San Sequoia.

- Willow Creek’s Music Festival was a time-limited EA event in 2021 and is switched off in the game files.
- Club meetings (Get Together), Getaways (Adventure Awaits), weddings, funerals, stay-overs and parties go on the calendar only when she plans them.

---

## 3. Does her plan still have what each event needs?

| Event | Needs | Her plan | OK? |
|---|---|---|---|
| All festivals (San Myshuno, Mt. Komorebi, Henford, Sulani, Ravenwood, Nordhaven, Gibbi Point, Britechester quads, Copperdale field, Tomarang’s Night Market) | Open streets only | – | **Yes**, nothing depends on a lot |
| Starlight Accolades | A Lounge with Hottest Spot in Town | Calico only; the game’s own Studio PBP isn’t built and has no trait | **Works, in Brindleton Bay.** Her call (question 3 in `lot-trait-ideas.md`) |
| Meet A Celebrity | A Lounge with Up-and-Coming Hotspot | Orchid A Go Go | Yes |
| Talent Showcase | Any Lounge | Calico, Orchid A Go Go | Yes; **gone in Gibbi Point and Tomarang**, whose game lounges she re-typed |
| Thrift store nights | A Thrift and Boba Store | 3 built, 2 planned | Yes; Copperdale’s moved to Town Square Stores |
| Prom, graduation, Career Day | Copperdale’s Auditorium | The game’s build | Yes |
| Prom after-party | Plumbite Cove’s pier | Totter Park is a home now; LaSuli Point undecided | Check in game (`students-and-schools.md`) |
| Study sessions, bar nights | A Library and a Bar | Laurel Library, The Royal Crown | Yes (Laurel Library was Generic in her Building save on 14 Oct; it needs to be a Library in play) |
| Commons nights | UoB and Foxbury Commons | Darby’s Den, Larry’s Lagoon | Yes |
| Finchwick Fair judge | Lavina Chopra | Homeless by choice | Should work; worth a look in game |
| N.A.P. voting | A voting board or mailboxes | 3 built Community Spaces | Yes |
| Horse competitions | Hay Now! (rabbit hole) | – | Yes |
| Grand Balls | The palaces | Still Residential | Yes |

---

## 4. Questions for her

1. **Would a “What’s on” page help?** The prototype (`for-jemma/prototypes/calendar/`) shows three ways: A a week calendar for the whole save, B a list by world, C a small box on each world page.
2. **Which events count?** Only festivals and holidays, or also lot nights (lounges, thrift stores, uni bar nights) and school events?
3. **Week starts Monday or Sunday?** The prototype starts on Monday; the game’s own calendar starts on Sunday.
4. **Sulani’s unnamed events** (Town BBQ and the rest): show them with names made from the game’s settings, as the site does now, or leave them out?
5. **Nordhaven’s meetups:** keep one line (“Hobby meetups”) or show the game’s seven names?
6. **Starlight Accolades:** leave them in Brindleton Bay, or give Studio PBP Hottest Spot in Town once it’s built? (Already asked in `lot-trait-ideas.md`.)

---

## Notes on method

- “Every other week” comes from the tuning: these festivals have a cooldown of 169 hours, one hour more than a week, so they can’t run two weeks running (the wiki says the same for Mt. Komorebi). San Myshuno’s pairs come from its scheduling groups. Turtle Hatching’s cooldown is 337 hours, so every third week.
- Where the game names a day only by default (Family Fun Day, Creativity Celebration, Utili-Bot Contest, the Sunday bar night), Sunday is the game’s default day; the wiki agrees for the uni ones.
- Times without a game sign are start plus length from the tuning; the festivals with signs match this exactly, so the rest should be close.
- Scratch scripts and the downloaded wiki pages are in the session scratchpad (`festivals-work/`), not in the project.
