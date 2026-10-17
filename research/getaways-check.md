# Getaways and Custom Venues: a check of her plan (overnight 17 Oct)

Research only. Nothing in the app, data, tools or TODO.md was changed, and nothing was committed. No save was opened.

**Sources:**
- The game’s own files, read with `tools/research/tuning.py` and `tools/sims4files.py`: the Getaway and Custom Venue settings, the list of lot types a Getaway may use, the 11 schedule presets and their roles, the 14 rules, which activities can go on a schedule, and the game’s own help texts.
- The Sims Wiki: Getaway, Custom venue, Vacation rental, Gibbi Point’s three neighbourhoods, Imaginary friend, The Sims 4: Adventure Awaits.
- Her plan (`data/worlds/*.json`), her Gallery uploads, TODO.md and the research notes (gibbi-point.md, lot-types-reference.md, undecided-lots.md, pets-and-horses.md).

---

## In short

- **A Getaway is an event, not a lot type.** It’s planned from the phone, computer or calendar, on almost any home or community lot, for a few hours up to several days. It has roles, a daily schedule, up to 5 rules, and a cost or earnings.
- **Vacation Rentals can’t host a Getaway.** Nor can Residential Rentals, University Housing, Restaurants, Retail, Small Business lots, Vet Clinics or Wedding Venues. Her 14 Vacation Rentals stay plain holiday lets, which is fine.
- **A Custom Venue is a lot type** that runs its schedule every day, Getaway or not. It needs only a sink, a toilet and a bin. Nobody owns it and it earns nothing.
- **Only a home earns.** A Getaway at the played household’s own home pays them. Anywhere else, Custom Venues included, the household pays a daily fee.
- **So Love Highland as a Custom Venue can’t be the Addams’ business in game.** They can be its hosts, but they earn nothing, and they pay if she plays them and plans a Getaway there. In the game it’s their home, which is how they earn. Her call (§2b).
- **Revive and Thrive (her build) has no beds** (Gallery: 0), but the Fitness Retreat schedule sleeps there at midnight. Day Getaways work; overnight ones need beds.
- **Small answers:** Care for Animals covers the mini goats and sheep (The Cozy Corner House, TODO §6c). Excavate, Authenticate Artifacts, Give Massages and Go Hiking can’t be put on a schedule.
- **Nothing else breaks.** All 7 Custom Venues are allowed in their worlds. The game’s link between Revive and Thrive Retreat and the Fitness Retreat is only for EA’s statistics, so turning that lot into the Rec Center loses nothing.

---

## 1. How it works

### Getaways

| What | What the game does |
|---|---|
| Planning | Phone (travel app), computer or calendar. Pick a lot (any world), the start, the length (hours to several days) and the end hour. Can repeat weekly on chosen days, but not all seven |
| Who | Up to 20 Sims, the household included. At least one played Sim needs a role. Empty roles are filled with Sims who match them |
| Schedule | Up to 8 time slots a day, each at least 3 hours. Each has a main activity; each role can have its own, and the role’s wins |
| Rules | Up to 5 of the 14. Only one elimination rule; one Sim leaves a day (11 am in EA’s texts) until one is left |
| Work and school | Paused for the whole Getaway, with nothing lost |
| Money | At the played household’s own home: they earn daily, more for a pricier lot and more guests, plus tips (less if guests leave early). Anywhere else: a daily fee at noon, by lot value and number of Sims. If they can’t pay, the Getaway ends |
| Beds | The game warns if an overnight Getaway hasn’t enough beds for everyone |
| Rewards | The kind of activity a Sim did most (Outdoor, Social, Hobbies, Food and Drink, Art and Music, Kid Activities, Mischief) can give a reward trait, e.g. “Remember Outdoorsy Getaway Memories”. Rules give their own rewards |
| Lot type changed | Planned Getaways on that lot are cancelled if the new type can’t host |
| Invitations | Friends phone to suggest the Fitness Retreat, Kids Camp or Romantic Competition. That opens the planner with the preset (3, 4 and 7 days); she still picks the lot |

### Which lot types can host a Getaway (the game’s own list)

| Can | Can’t |
|---|---|
| Residential, Tiny Home, Haunted House, Penthouse | Vacation Rental (all three kinds), Residential Rental, University Housing |
| Custom Venue, Generic | Restaurant, Retail, Small Business Venue, Vet Clinic |
| Bar, Lounge, Nightclub, Karaoke Bar, Backroom | Wedding Venue, Acting Studio |
| Café, Thrift and Boba Store, Community Market, Community Space* | Hidden and story lots (Sylvan Glade, Forgotten Grotto, The Magic Realm, Omiscan Royal Baths, Mt. Komorebi Summit, Secret Lab, the Get to Work lots) |
| Park, Playground, Pool, Beach, National Park, Cemetery | |
| Gym, Spa, Onsen Bathhouse, Recreation Center, Library, Museum, Arts Center | |
| UoB and Foxbury Commons; also High School, Auditorium, Center Park, Chalet Gardens, Ancient Ruins | |

- *Only the plain Community Space is on the list, not its Garden, Marketplace or Maker Space versions. Check in game if it ever matters.
- A home with a business registered (her “Small Business Residential”) is still Residential, so it can host.

### Custom Venues

| What | What the game does |
|---|---|
| Needs | A sink, a toilet and a bin. Allowed in every world, Granite Falls and Selvadorada included |
| Every day | Sims who match the roles come and follow the schedule whenever she’s there; no Getaway needed. Elimination rules only work in Getaways |
| Roles | Up to 30, up to 8 Sims each. Criteria: age, skill, gender, orientation, region, trait, occult, career, relationship, fame. An outfit per role |
| Casting named Sims | Only while visiting with a played Sim, not from Manage Worlds |
| Presets | 8 to pick from (below), or her own. Saved presets stay in that save; a Custom Venue shared to the Gallery takes its preset with it |
| Getaways there | Pick up the venue’s preset automatically |
| Owner, money | None. It isn’t one of the lot types a household can buy (Restaurant, Retail, Vet Clinic, Small Business) |
| EA’s own | Since the 2 Dec 2025 patch, Camp Gibbi Gibbi and Revive and Thrive Retreat run their own schedules, unless edited |

### The 8 presets

| Preset | Roles (Sims) | The day | Rules set | EA’s lot |
|---|---|---|---|---|
| Fitness Retreat | Retreat Leader (1), Fitness Trainer (2), Retreat Guest (6) | Workout 7 am, breakfast, free time with swimming and diving, dinner, self-care, sleep at midnight | – | Revive and Thrive Retreat (Freeda Perry) |
| Outdoor Kids Camp | Camp Director (1), Camp Counselor (2, teens or young adults), Camper (8 children) | Breakfast 6 am, archery, swimming and kayaks, campfire, sleep 10 pm | – | Camp Gibbi Gibbi (Nigel and Sara Chavez-Ralston) |
| Romantic Competition | Romantic Host (2), Singles (8) | Breakfast 8 am, outdoors, dinner, mingling and hot tub, sleep 1 am | Romantic Elimination, Love Is in the Air | Love Highland (the Addams) |
| Cooking Competition | Chef, Mean Chef, Amateur Chef (5), Staff (2) | Cooking from 10 am, dinner served at 4 pm | Cooking Skills Elimination | – |
| Cozy Bed and Breakfast | Host (1), Guest (6), Staff (2) | Host serves breakfast at 7 am and dinner at 5 pm; free time | – | – |
| Creativity Retreat | Artist (4), Writer (2), Musician (2), Staff (2) | Arts and music morning and evening, meals served | Renaissance Studio | – |
| Senior Living Community | Senior (6 elders), Visitor (3), Staff (2), Entertainer (1) | Breakfast 5 am, exercise, table games, dinner 4 pm, bed 10 pm | – | – |
| Sim Popularity Contest | Sporty, Brainy, Friendly, Rebel and Popular Sims (3 each) | Meals, free time, outdoors | Popularity Elimination | – |

- The files also hold Wilderness Park, 24 Hour Entertainment Center and Bachelor / Bachelorette, which don’t seem to be offered.
- The three Gibbi Point host roles look first for the game’s hidden “Seasoned Retreat Leader”, “Seasoned Camp Director” and “Seasoned Romantic Host” traits (“From Revive and Thrive”, “From Camp Gibbi Gibbi”, “From Love Highland”). So wherever those presets run, the game probably picks Freeda, Nigel and the Addams first (check in game).

### The 14 rules

- **Elimination (one at a time):** Romantic, Popularity, Player Choice, Cooking Skills, Creative Skills, Survival of the Fittest, Child Skills.
- **Others:** Love Is in the Air, No Strings Attached (no jealousy), House of Grudges, Grindset Mindset, Hardcore Mode, Renaissance Studio, Activity Shuffle.

### Activities that matter for her venues

| Can go on a schedule | Can’t |
|---|---|
| Care for Animals: horses, mini goats, mini sheep, chickens, cows, llamas, cats, dogs, small pets | Give Massages (a small business job; Spa lots bring their own masseurs) |
| Care for Livestock (chickens, cows, llamas only), Care for Ranch Animals, Horses Play and Learn | Excavate, Authenticate Artifacts |
| Hold Lectures (needs a hobby whiteboard), Attend Lectures, Mentoring (Getaways), Mentor Fitness | Go Hiking, Wander Maze |
| Do Spa Activities, Do Yoga, Meditate, Use Hot Tub, Swim, Use Diving Board | Run Lectures and Classes, Offer Paid Mentoring, Do Tarot Readings (small businesses only) |
| Tend Bar, Mix Bar Drinks, Cook, Serve Meal, Make Smoothies | |
| Go Skiing, Go Snowboarding, Go Sledding, Go Rock Climbing | |
| Brew Herbal Remedies; Craft Apothecary Elixirs, Use Fairy Abilities, Natural Living (Enchanted by Nature) | |
| Collect Butterflies, Use Kayaks, Campfire, Do Archery, Tend Garden, Read Tarot Cards | |

### Childhood and Imaginary Friends

- **Some childhood goals need a Getaway:** get over feeling Homesick at one, make a “Getaway friend”, and spend some hours at one. Getting over homesickness is a formative moment: as an adult, that Sim makes friends faster.
- Any Getaway with a child in it counts. Camp Gibbi Gibbi is the obvious one, for children from any world. Whether a child can go without a parent: check in game.
- **Imaginary Friends aren’t tied to a lot.** They start as a doll that arrives for a baby or toddler.

### Gibbi Point’s own lots, and her plan

| Lot | In the game | Her plan | Getaway there |
|---|---|---|---|
| Hothead Rock Hideaway | Empty, 64×64 | Revive and Thrive, Custom Venue (built, shared, no beds) | Yes; day trips unless beds go in |
| Camp Gibbi Gibbi | Custom Venue, Outdoor Kids Camp | The same (not built) | Yes |
| Revive and Thrive Retreat | Custom Venue, Fitness Retreat (Freeda Perry) | Gibbi Rec Center (built, shared) | Yes, as a Recreation Center (day trips) |
| Love Highland | The Addams’ home (8 beds), Romantic Competition | Custom Venue; the Addams at Miner’s Manse (not built) | Yes, but see §2b |
| Jellyfish Jubilee | Vacation Rental (3 beds) | Bar (not built) | A Bar can host, but has no beds |
| Crystal Cottage | Home | Onsen Bathhouse (not built) | Yes |
| Prospector’s Paradise | Empty | Paradise Stables, a horse home | Yes; her own home earns |

---

## 2. Her plan checked

### 2a. Custom Venues (7; 6 in worlds she owns)

| Lot (world) | Built | Her idea | OK? | Notes |
|---|---|---|---|---|
| Revive and Thrive (Gibbi Point) | Shared | Fitness, yoga, spa, hot spring | Yes | Attach the Fitness Retreat. No beds. Massages only happen if a Sim she plays gives them |
| Camp Gibbi Gibbi (Gibbi Point) | No | EA’s kids’ camp | Yes | EA’s build comes with its preset |
| Love Highland (Gibbi Point) | No | The Addams’ Getaway business | Partly | Works as a place; not as a business (§2b) |
| Belomisia Field Station (Selvadorada) | Shared | A base for the jungle: dorms, dinner, pool, archaeology mentoring | Yes | 9 beds, so overnight Getaways for up to 9. Excavating and authenticating can’t be scheduled; “Mentoring” (Getaways only) has skilled Sims mentor whoever is practising |
| Kiyomatsu Point (Mt. Komorebi) | No | With a bar and restaurant area | Yes | Bartender and Chef roles serve drinks and group meals, but there’s no menu or table service as in a Restaurant. Skiing, snowboarding, sledding and climbing can be scheduled; hiking can’t |
| The Cozy Corner House (Chestnut Ridge) | No | Community farm: animals, garden, lectures | Yes | **Care for Animals covers the mini goats and sheep** (and horses), which answers the TODO §6c check. Hold Lectures needs a hobby whiteboard. 20×20 is tight for pens plus the sink, toilet and bin |
| The Watering Hole (Innisgreen, not owned) | No | Fairy healing retreat | Yes | Herbal remedies, apothecary elixirs, fairy abilities, spa, yoga, meditation and hot tubs can all be scheduled, and a role can ask for fairies (occult). No massages |

### 2b. Love Highland as the Addams’ business

| | Custom Venue (her plan) | Their home (the game’s way) |
|---|---|---|
| Day to day | A dating venue: 2 hosts (probably the Addams) and 8 singles, on her schedule | Just their home |
| Getaway there, Addams played | They pay a daily fee | They earn daily (EA’s build is worth about §154,000; more guests and tips earn more) |
| Getaway there, another household | That household pays | That household pays |
| Where the Addams live | Miner’s Manse (3 bedrooms) | Love Highland (8 beds); Miner’s Manse empty again |
| On the site | Run by the Addams, as now | Residents: Addam Commune |

- **A Small Business wouldn’t help:** Small Business Venue lots can’t host Getaways. A business registered at their home keeps it Residential, so that would work.
- **For the story, the Custom Venue is fine:** the Addams host every day, and the money side only shows if she plays them.

### 2c. Vacation Rentals (14, plus 2 with two types)

No Vacation Rental can host a Getaway. They’re booked for a holiday instead (1–7 days, priced by lot value). Granite Falls and Selvadorada have their own kind, with other holidaymakers in the rentals next door.

| World | Vacation Rentals |
|---|---|
| Granite Falls | Campground, Green Getaway, Lakeside Retreat |
| Selvadorada | Hillside Hideaway, Selvadorada Villa, Jungle Bungalow |
| Mt. Komorebi | 5-1-1 Kiyomatsu, 5-1-2 Kiyomatsu, 6-4-1 Hanamigawa |
| StrangerVille, Sulani, Chestnut Ridge | Carpophagous Corner, Lagoon of Love, Big Sky Reach |
| Not owned | Villa Cálida (Ciudad Enamorada), Piccola Luce (Tartosa) |
| Two types | Britechester B&B (Café/Vacation Rental): as a Café it can host a Getaway, e.g. Cozy Bed and Breakfast (3 bedrooms). Olde Platz Inn (Restaurant/Vacation Rental): neither type can |

- **Nothing to change.** Holidays and Getaways are separate, and both work. Green Getaway is a Getaway in name only.
- To use one for Getaways, it would have to become Residential, Generic or a Custom Venue, and could no longer be booked for a holiday.

### 2d. Open decisions this touches

| Open decision (TODO) | What this adds |
|---|---|
| Key Point: Vacation Rental or Generic | Generic can host a Getaway (a castaway weekend) and allows Off-the-Grid; a Vacation Rental can do neither |
| Paradise Stables: riding stables as Small Business Residential | Still Residential, so the family could also host a pony-camp Getaway at home and earn |
| 1 Cobblebottom Street: tea room or Vacation Rental | A tea room at home could host a Getaway; a Vacation Rental couldn’t |
| Rio Verde Retirement Home (noted only) | A Residential Rental can’t host the Senior Living Community preset as a Getaway |

### 2e. Gaps

- **Overnight at Revive and Thrive:** no beds in her build.
- **No holiday rental in Gibbi Point** since Jellyfish Jubilee became a Bar (her choice, 16 Oct). Visitors stay through Getaways at Camp Gibbi Gibbi, Love Highland, or Revive and Thrive once it has beds. Fine as it is.
- **Massages:** neither wellness Custom Venue (Revive and Thrive, The Watering Hole) can schedule them. Spa and Onsen lots bring their own staff.
- **Otherwise none:** every world can host Getaways on homes and most community lots.

---

## 3. Corrections to other notes (for whoever next edits them)

- **research/lot-types-reference.md:**
  - The six “cross-pack presets” (Dog Training, Corporate Retreat, Off the Grid Survival, Child Care, Refreshing Spa Getaway, Ultimate Fitness Boot Camp) aren’t in the game’s files, though she owns those packs. They’re probably EA Gallery uploads, not built-in presets.
  - Open point 4 is settled: there’s no “Getaway Venue” type. Camp Gibbi Gibbi and Revive and Thrive Retreat are Custom Venues; Love Highland is a home.
  - The exact list of lot types a Getaway can use is in §1 here. Vacation Rentals aren’t on it.
- **research/worlds/gibbi-point.md:** guests pay the household only when it’s the household she’s playing.
- **research/undecided-lots.md** (Mystic Crossroads): there is a tarot job for small business staff, “Do Tarot Readings”, and “Read Tarot Cards” for Custom Venues and clubs.

---

## 4. Suggestions

Her call each time; how much each changes the game is in brackets.

1. **Love Highland:** keep it a Custom Venue as a story business (none), or give it back to the Addams as their home (small; Miner’s Manse is empty again).
2. **Revive and Thrive:** a few guest cabins or a dorm for overnight Fitness Retreats (small; a build change on a shared lot), or keep it for day trips (none).
3. **Attach the presets in game:** Fitness Retreat on Revive and Thrive, Romantic Competition on Love Highland; Camp Gibbi Gibbi keeps Outdoor Kids Camp (none).
4. **The Cozy Corner House:** Care for Animals, Tend Garden, Hold Lectures, and Horses Play and Learn with feeders and troughs (pets-and-horses.md) (none).
5. **Belomisia Field Station:** an archaeology table on the lot so Sims practise there, and Mentoring on its Getaway schedule (none).
6. **Kiyomatsu Point:** a ski lodge day: skiing and snowboarding in the daytime, the bar and hot tubs after (none).
7. **A week at Camp Gibbi Gibbi** for a child she plays, for the Homesick formative moment (none).
8. **Key Point:** Generic, if she’d like castaway Getaways there (none; adds to the open choice).

---

## 5. Decisions for her

1. **Love Highland:** a Custom Venue run by the Addams (story only), or their home again?
2. **Revive and Thrive:** add beds for overnight stays, or day trips only?
