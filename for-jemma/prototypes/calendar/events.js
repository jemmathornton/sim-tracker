// Prototype, 17 Oct: every festival and regular event in her owned worlds, from the game's own files (tuning and English text),
// checked against the Sims Wiki. Write-up: research/festivals-calendar.md. Nothing here is used by the site.
//
// w: world (as in the site's data), hood: neighbourhood (as in the site's data, straight apostrophes), where: shown place if not just the neighbourhood
// days: weekdays ("Mon".."Sun"); special: "daily" | "newmoon" | "fullmoon" | "any" | "oncall" (no fixed day)
// time: as the game shows it ("about" where the game shows none), start: minutes from midnight (for sorting)
// often: "week" | "fortnight" (every other week) | "third" (every third week) | text
// kind: "festival" (open-world festivals and world events) | "school" (uni and high school) | "lot" (made below from her lots)
// star: the game never shows this name; it's made from its settings (as on the site)
// needs: what the event needs from her plan, ok: true (fine) | false (missing) | null (check in game)

const EVENTS = [
  // San Myshuno (City Living): pairs alternate, one of each pair a week; Flea Market every second Sunday
  {w: "San Myshuno", hood: "Arts Quarter", name: "Humor and Hijinks Festival", days: ["Mon"], time: "5–11 pm", start: 1020, often: "fortnight", kind: "festival", pair: "GeekCon"},
  {w: "San Myshuno", hood: "Fashion District", name: "GeekCon", days: ["Tue"], time: "10 am–4 pm", start: 600, often: "fortnight", kind: "festival", pair: "Humor and Hijinks"},
  {w: "San Myshuno", hood: "Spice Market", name: "Spice Festival", days: ["Fri"], time: "5 pm–1 am", start: 1020, often: "fortnight", kind: "festival", pair: "the Romance Festival"},
  {w: "San Myshuno", hood: "Fashion District", name: "Romance Festival", days: ["Sat"], time: "5 pm–1 am", start: 1020, often: "fortnight", kind: "festival", pair: "the Spice Festival"},
  {w: "San Myshuno", hood: "Spice Market", name: "Flea Market", days: ["Sun"], time: "10 am–6 pm", start: 600, often: "fortnight", kind: "festival"},

  // Mt. Komorebi (Snowy Escape): weekends, every other week each
  {w: "Mt. Komorebi", hood: "Senbamachi", name: "Festival of Light", days: ["Fri"], time: "6 pm–1 am", start: 1080, often: "fortnight", kind: "festival"},
  {w: "Mt. Komorebi", hood: "Yukimatsu", name: "Festival of Snow", days: ["Sat"], time: "3 pm–midnight", start: 900, often: "fortnight", kind: "festival"},
  {w: "Mt. Komorebi", hood: "Wakaba", name: "Festival of Youth", days: ["Sun"], time: "10 am–6 pm", start: 600, often: "fortnight", kind: "festival"},

  // Henford-on-Bagley (Cottage Living)
  {w: "Henford-on-Bagley", hood: "Finchwick", name: "Finchwick Fair", days: ["Sat"], time: "3.30–9.30 pm", start: 930, often: "week", kind: "festival",
   note: "Chicken, Cow, Garden, Llama or Oversized Crop fair, in turn", needs: {txt: "Lavina Chopra judges; homeless by your choice, still in the save", ok: null}},

  // Sulani (Island Living): Ohan'ali Town has something every day
  {w: "Sulani", hood: "Ohan'ali Town", name: "Town BBQ", star: true, days: ["Mon"], time: "about 4–10 pm", start: 980, often: "week", kind: "festival"},
  {w: "Sulani", hood: "Mua Pel'am", name: "Turtle Hatching", star: true, days: ["Mon"], time: "about 8 am–2 pm", start: 485, often: "third", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Flowers and Music", star: true, days: ["Tue"], time: "about 1–7 pm", start: 800, often: "week", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Town Potluck", star: true, days: ["Wed"], time: "about 6 pm–midnight", start: 1100, often: "week", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Island Celebration", star: true, days: ["Thu"], time: "9 am–midnight", start: 540, often: "fortnight", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Beach Bonfire", star: true, days: ["Fri"], time: "about 6 pm–midnight", start: 1100, often: "week", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Fishing Competition", star: true, days: ["Sat"], time: "noon–6 pm", start: 720, often: "week", kind: "festival"},
  {w: "Sulani", hood: "Ohan'ali Town", name: "Family Fun Day", star: true, days: ["Sun"], time: "about 9 am–4 pm", start: 560, often: "week", kind: "festival"},

  // Ravenwood (Life & Death)
  {w: "Ravenwood", hood: "Mourningvale", name: "Afterlife Anonymous", days: ["Mon", "Wed", "Fri"], time: "6–11 pm", start: 1080, often: "week", kind: "festival", note: "A meeting for ghosts"},
  {w: "Ravenwood", hood: "Mourningvale", name: "Afterlife Anonymous", days: ["Tue", "Thu"], time: "10 am–3 pm", start: 600, often: "week", kind: "festival", note: "A meeting for ghosts"},
  {w: "Ravenwood", hood: "Crow's Crossing", name: "Casket Sale", star: true, days: ["Mon", "Wed", "Fri"], time: "11 am–5 pm", start: 660, often: "week", kind: "festival"},
  {w: "Ravenwood", hood: "Crow's Crossing", name: "Funeral BBQ", star: true, days: ["Tue", "Thu", "Sun"], time: "11 am–5 pm", start: 660, often: "week", kind: "festival"},
  {w: "Ravenwood", hood: "Mourningvale", name: "Thinned Festiveil", days: ["Wed"], time: "10 am–6 pm", start: 600, often: "week", kind: "festival"},
  {w: "Ravenwood", hood: "Crow's Crossing", name: "Ravenwood Family Day", days: ["Sat"], time: "noon–8 pm", start: 720, often: "week", kind: "festival"},
  {w: "Ravenwood", hood: "Whispering Glen", name: "Moon Revelry", special: "daily", time: "7 pm–1 am", start: 1140, often: "Every night but the new moon", kind: "festival"},
  {w: "Ravenwood", hood: "Whispering Glen", name: "Full Moon Revelry", special: "fullmoon", time: "at night", start: 1200, often: "Every full moon", kind: "festival"},

  // Nordhaven (Businesses & Hobbies): seven hobby meetups, once in each neighbourhood a week
  ...[["Writers & Readers", ["Sat", "2–7 pm", 840], ["Mon", "noon–5 pm", 720]],
      ["Galactic Gambits", ["Mon", "8 pm–1 am", 1200], ["Wed", "8 pm–1 am", 1200]],
      ["Sweat & Socialize", ["Tue", "6–11 am", 360], ["Thu", "6–11 am", 360]],
      ["Pottery & Pals", ["Thu", "5–10 pm", 1020], ["Tue", "5–10 pm", 1020]],
      ["Munch & Mingle", ["Wed", "11 am–4 pm", 660], ["Fri", "11 am–4 pm", 660]],
      ["Spotlight Stars", ["Fri", "6–11 pm", 1080], ["Sun", "6–11 pm", 1080]],
      ["Creative Cowork", ["Sun", "8 am–1 pm", 480], ["Sat", "8 am–1 pm", 480]]]
    .flatMap(([name, g, i]) => [["Gammelvik", g], ["Iverstad", i]].map(([hood, [d, time, start]]) =>
      ({w: "Nordhaven", hood, name, days: [d], time, start, often: "week", kind: "festival", group: "Hobby meetup"}))),

  // Gibbi Point (Adventure Awaits)
  {w: "Gibbi Point", hood: "Jellyfish Junction", name: "Fitness Fest", days: ["Mon", "Tue", "Wed"], time: "9 am–6 pm", start: 540, often: "week", kind: "festival", note: "Wednesday is Wacky Wednesday", where: "Jellyfish Junction’s town square"},
  {w: "Gibbi Point", hood: "Jellyfish Junction", name: "Glow and Flow Festival", special: "newmoon", time: "7 pm–2 am", start: 1140, often: "Every new moon", kind: "festival", where: "Underlight Bay, Jellyfish Junction"},
  {w: "Gibbi Point", hood: "Crystal Valley", name: "Sunrise, Sunset Festival", days: ["Sat", "Sun"], time: "1–6 pm", start: 780, often: "week", kind: "festival"},
  {w: "Gibbi Point", hood: "Wanderwood Wilds", name: "'Round the Fire Festival", days: ["Sat", "Sun"], time: "7 pm–2 am", start: 1140, often: "week", kind: "festival"},

  // Tomarang (For Rent)
  {w: "Tomarang", hood: "Morensong", name: "Night Market", special: "daily", time: "6 pm–2 am", start: 1080, often: "Every night", kind: "festival", note: "Food and shopping stalls on the street"},

  // Chestnut Ridge (Horse Ranch)
  {w: "Chestnut Ridge", hood: "New Appaloosa", name: "Ultimate Horse Championship", days: ["Sat"], time: "7 am–7 pm", start: 420, often: "week", kind: "festival",
   where: "Hay Now! Equestrian Center, New Appaloosa", note: "For horses that have placed in every Master event; entry §2,000"},
  {w: "Chestnut Ridge", hood: "New Appaloosa", name: "Horse competitions", special: "any", time: "7 am–7 pm", start: 420, often: "Any day", kind: "festival",
   where: "Hay Now! Equestrian Center, New Appaloosa", note: "Barrel Racing, Endurance Racing, Show Jumping, Western Pleasure"},

  // Ondarion (Royalty & Legacy)
  {w: "Ondarion", hood: null, name: "Swordsmanship tournaments", special: "any", time: "when you enter one", start: 600, often: "Any day", kind: "festival",
   where: "", note: "Gunther Goth’s Cup, Regional Ondarion Invitational, SimNation Grand Masters"},

  // Britechester (Discover University): organisation events, for students who belong or are invited
  {w: "Britechester", hood: "University of Britechester", name: "Figure Painting", days: ["Sun"], time: "10 am–2 pm", start: 600, often: "week", kind: "school", where: "by the canal near the UoB Commons", note: "Art Society"},
  {w: "Britechester", hood: "University of Britechester", name: "Figure Painting", days: ["Mon", "Thu"], time: "3–7 pm", start: 900, often: "week", kind: "school", where: "by the canal near the UoB Commons", note: "Art Society"},
  {w: "Britechester", hood: "Foxbury Institute", name: "Utili-Bot Contest", days: ["Sun"], time: "noon–6 pm", start: 720, often: "week", kind: "school", where: "Foxbury quad", note: "Bot Savants"},
  {w: "Britechester", hood: "University of Britechester", name: "Creativity Celebration", days: ["Sun"], time: "3–9 pm", start: 900, often: "week", kind: "school", where: "UoB quad", note: "Spirit Corps"},
  {w: "Britechester", hood: "University of Britechester", name: "Debate Practice", days: ["Tue", "Wed"], time: "4–8 pm", start: 960, often: "week", kind: "school", where: "Darby’s Den (UoB Commons)", note: "Debate Guild"},
  {w: "Britechester", hood: "Foxbury Institute", name: "Robot Building Meetup", days: ["Tue", "Thu"], time: "7–11 pm", start: 1140, often: "week", kind: "school", where: "Larry’s Lagoon (Foxbury Commons)", note: "Bot Savants"},
  {w: "Britechester", hood: "Gibbs Hill", name: "Study Session", days: ["Mon", "Tue", "Wed", "Thu"], time: "3–7 pm", start: 900, often: "week", kind: "school", where: "Laurel Library", note: "Brainiacs",
   needs: {txt: "A Library: Laurel Library", ok: true}},
  {w: "Britechester", hood: "Gibbs Hill", name: "Bar nights", special: "daily", time: "8 pm–midnight", start: 1200, often: "Every night, one organisation a night", kind: "school", where: "The Royal Crown",
   needs: {txt: "A Bar: The Royal Crown", ok: true}},
  {w: "Britechester", hood: "Foxbury Institute", name: "Foxbury Game Day Party", days: ["Fri"], time: "3–7 pm", start: 900, often: "week", kind: "school", where: "Foxbury quad"},
  {w: "Britechester", hood: "University of Britechester", name: "Britechester Game Day Party", days: ["Fri", "Sat"], time: "3–7 pm", start: 900, often: "week", kind: "school", where: "UoB quad"},
  {w: "Britechester", hood: "University of Britechester", name: "Debate Showdown", days: ["Sat"], time: "8 am–2 pm", start: 480, often: "week", kind: "school", where: "UoB quad"},
  {w: "Britechester", hood: "Foxbury Institute", name: "School Spirit Day", days: ["Sat"], time: "11 am–5 pm", start: 660, often: "week", kind: "school", where: "Foxbury quad"},
  {w: "Britechester", hood: "Gibbs Hill", name: "Sprite Celebration Ritual", days: ["Wed", "Fri", "Sun"], time: "10 pm–2 am", start: 1320, often: "week", kind: "school", where: "Ritual Grounds, Gibbs Hill", note: "The secret society"},
  {w: "Britechester", hood: "University of Britechester", name: "Exam Cram", days: ["Mon"], time: "10 pm–6 am", start: 1320, often: "Most weeks", kind: "school", where: "Darby’s Den and Larry’s Lagoon"},
  {w: "Britechester", hood: "Foxbury Institute", name: "E-Sports", days: ["Wed"], time: "2–6 pm", start: 840, often: "week", kind: "school", where: "Larry’s Lagoon (Foxbury Commons)"},
  {w: "Britechester", hood: "University of Britechester", name: "Poetry night", days: ["Thu"], time: "8 pm–midnight", start: 1200, often: "week", kind: "school", where: "Darby’s Den (UoB Commons)"},
  {w: "Britechester", hood: "University of Britechester", name: "Mixer", days: ["Sat"], time: "8 pm–1 am", start: 1200, often: "Most weeks", kind: "school", where: "Darby’s Den and Larry’s Lagoon"},

  // Copperdale (High School Years)
  {w: "Copperdale", hood: "Rockridge Heights", name: "Football Team Sports Day", days: ["Thu"], time: "5–10 pm", start: 1020, often: "week", kind: "school", where: "the football field behind the high school"},
  {w: "Copperdale", hood: "Rockridge Heights", name: "Cheerleading Team Sports Day", days: ["Fri"], time: "5–10 pm", start: 1020, often: "week", kind: "school", where: "the football field"},
  {w: "Copperdale", hood: "Rockridge Heights", name: "High School Exams", days: ["Fri"], time: "10 am–3 pm", start: 600, often: "week", kind: "school", where: "Copperdale High School",
   needs: {txt: "The High School: the game’s build", ok: true}},
  {w: "Copperdale", hood: "Rockridge Heights", name: "Prom", days: ["Sat"], time: "7–11 pm", start: 1140, often: "week", kind: "school", where: "the Auditorium",
   note: "When a teen is played; after-party on Plumbite Cove’s pier", needs: {txt: "The Auditorium: the game’s build", ok: true}},
  {w: "Copperdale", hood: "Rockridge Heights", name: "High School Graduation", days: ["Sun"], time: "from 6 pm", start: 1080, often: "After a teen ages up", kind: "school", where: "the Auditorium",
   needs: {txt: "The Auditorium: the game’s build", ok: true}},
  {w: "Copperdale", hood: "Rockridge Heights", name: "Career Day", special: "oncall", time: "a school day", start: 600, often: "The game picks the day", kind: "school", where: "the Auditorium"},
  {w: "Copperdale", hood: "Rockridge Heights", name: "Science fairs", special: "oncall", time: "5–10 pm", start: 1020, often: "When the chess or computer team calls one", kind: "school", where: "the school grounds"},
];

// Lot nights: made from her plan's lot types and lot traits, so they follow the plan
const LOT_EVENTS = [
  {type: /^Lounge\b/, name: "Talent Showcase", days: ["Fri", "Sat"], time: "6–11 pm", start: 1080, pack: "Get Famous"},
  {type: /^Lounge\b/, trait: "Up-and-Coming Hotspot", name: "Meet A Celebrity", days: ["Mon", "Wed"], time: "10 am–4 pm", start: 600, pack: "Get Famous"},
  {type: /^Lounge\b/, trait: "Hottest Spot in Town", name: "Starlight Accolades", days: ["Sun"], time: "6–11 pm", start: 1080, pack: "Get Famous"},
  {type: /^Thrift and Boba Store/, name: "Fashion show", days: ["Mon", "Fri"], time: "3–8 pm", start: 900, pack: "High School Years"},
  {type: /^Thrift and Boba Store/, name: "Comedy open mic", days: ["Wed"], time: "3–8 pm", start: 900, pack: "High School Years"},
  {type: /^Thrift and Boba Store/, name: "Poetry open mic", days: ["Sun"], time: "3–8 pm", start: 900, pack: "High School Years"},
];

// Save-wide: every world
const SEASONS = [
  {season: "Spring", icon: "flower", holidays: [{day: "Fri", name: "Love Day", off: false}]},
  {season: "Summer", icon: "sun", holidays: []},
  {season: "Autumn", icon: "leaf", holidays: [{day: "Thu", name: "Harvestfest", off: true}]},
  {season: "Winter", icon: "snowflake", holidays: [{day: "Wed", name: "Winterfest", off: true}, {day: "Sat", name: "New Year's Eve", off: true}]},
];
const SURPRISE = [["Mon", "Rebate Day"], ["Wed", "The Lottery"], ["Thu", "TV Season Premiere"], ["Fri", "Night on the Town"],
  ["Sat", "Talk Like a Pirate Day"], ["Sat", "Neighborhood Brawl"], ["Sun", "Prank Day"], ["Sun", "New Skill Day"]];
// Lot nights the game puts on lounges she re-typed (for the "needs" notes)
const LOST_LOUNGES = [{w: "Gibbi Point", lot: "Fearful Fish Lounge", now: "Thrift ’n’ Fish (Thrift and Boba Store)"},
  {w: "Tomarang", lot: "The Screaming Gecko", now: "a Karaoke Bar"}];
