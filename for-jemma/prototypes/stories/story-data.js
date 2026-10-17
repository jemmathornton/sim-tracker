// Story prototypes (17 Oct): the story data, shaped the way research/household-stories.md proposes to store it.
// Nothing here is in the app or in data/. EA's side is summarised in our own words from The Sims Wiki (fetched 17 Oct)
// and research/ea-family-lore.md; "Your plan" lines are her own decisions as written on TODO.md (15–16 Oct).
// Her own story is left as placeholders ("todo"): nothing here is made up for her.
//
// src:  "ts4"     The Sims 4 (EA's story in this game)
//       "older"   The Sims 2 or 3 (EA's older games: not part of The Sims 4's story)
//       "gallery" a household EA put on the Gallery (not in the game's worlds)
//       "plan"    her plan (TODO.md / spreadsheet), not played yet
//       "mine"    played in her save (none yet)
//       "site"    worked out from the site's own data (her builds)
//       "todo"    a placeholder for her words
// stage: "before" (before the game starts) · "start" (as a new save starts) · "older" (older games) · "save" (her save)

const WIKI = p => "https://sims.fandom.com/wiki/" + p;

// Sims mentioned in the stories. hh = the household they belong to ("World|Name"); world/home for Sims with no household.
const SIMS = {
  // Romeo, Juliette and Dante (Tartosa in her plan)
  "romeo-monty":    {name: "Romeo Monty", hh: "Tartosa|Monty"},
  "juliette-monty": {name: "Juliette Monty", hh: "Tartosa|Monty", born: "Capp"},
  "dante-monty":    {name: "Dante Monty", hh: "Tartosa|Monty"},
  // the Capps (Ondarion)
  "tybalt-capp":    {name: "Tybalt Capp", hh: "Ondarion|Capp"},
  "beatrice-capp":  {name: "Beatrice Capp", hh: "Ondarion|Capp"},
  "celeste-capp":   {name: "Celeste Capp", hh: "Ondarion|Capp"},
  "virgilio-capp":  {name: "Virgilio Capp", hh: "Ondarion|Capp"},
  "consort-capp":   {name: "Consort Capp", world: "Ondarion", home: "a ghost with no home, as the game has him"},
  "caliban-capp":   {name: "Caliban Capp", late: true},
  "cordelia-capp":  {name: "Cordelia Capp", late: true},
  // her recreated Sims 2 Montys (Renaissance Road, Ondarion)
  "patrizio-monty": {name: "Patrizio Monty", hh: "Ondarion|Monty"},
  "isabella-monty": {name: "Isabella Monty", hh: "Ondarion|Monty"},
  "mercutio-monty": {name: "Mercutio Monty", hh: "Ondarion|Monty"},
  "antonio-monty":  {name: "Antonio Monty", hh: "Ondarion|Monty"},
  "beatrice-monty": {name: "Beatrice Monty", hh: "Ondarion|Monty"},
  "benedick-monty": {name: "Benedick Monty", hh: "Ondarion|Monty"},
  "bianca-monty":   {name: "Bianca Monty", hh: "Ondarion|Monty"},
  // the Goths and their links
  "mortimer-goth":  {name: "Mortimer Goth", hh: "Willow Creek|Goth"},
  "bella-goth":     {name: "Bella Goth", hh: "Willow Creek|Goth", born: "Bachelor"},
  "cassandra-goth": {name: "Cassandra Goth", hh: "Willow Creek|Goth"},
  "alexander-goth": {name: "Alexander Goth", hh: "Willow Creek|Goth"},
  "cornelia-goth":  {name: "Cornelia Goth", late: true, born: "Crumplebottom"},
  "agnes-crumplebottom": {name: "Agnes Crumplebottom", world: "Henford-on-Bagley", home: "in Henford-on-Bagley in the game; not in your plan"},
  "bob-pancakes":   {name: "Bob Pancakes", hh: "Willow Creek|Pancakes"},
  "eliza-pancakes": {name: "Eliza Pancakes", hh: "Willow Creek|Pancakes"},
  "nancy-landgraab":    {name: "Nancy Landgraab", hh: "Oasis Springs|Landgraab"},
  "geoffrey-landgraab": {name: "Geoffrey Landgraab", hh: "Oasis Springs|Landgraab"},
  "lady-ravendancer-goth": {name: "Lady Ravendancer Goth", world: "Ravenwood", home: "a ghost you summon with her tarot deck"},
  "zelmira-gomes":  {name: "Zelmira Gomes", hh: "Ravenwood|Gomes"},
};

// Lots of worlds the app doesn't show yet (Tartosa isn't owned, so its lots aren't in site/js/data.js).
// Copied from data/worlds/tartosa.json.
const EXTRA_LOTS = {
  "Tartosa|Rifugio dei Pirati": {name: "Rifugio dei Pirati", hood: "Terra Amorosa", type: "Residential", size: "30x20", built: false, shared: false},
};
const EXTRA_HOUSEHOLDS = { "Tartosa|Monty": {name: "Monty", lots: ["Tartosa|Rifugio dei Pirati"]} };

/* ================= one story per household (world file, households.<Name>.story) ================= */
const STORIES = {
  "Tartosa|Monty": {
    title: "Romeo, Juliette and Dante",
    members: ["romeo-monty", "juliette-monty", "dante-monty"],
    bio: "",   // her words: empty until she writes them
    bioAsk: "Who are Romeo, Juliette and Dante in your save? Why Tartosa, and what does the wedding there mean to them?",
    ea: {
      bio: "Choosing Romeo cost Juliette her place in the Capp dynasty, her Noble rank and most of her money, but life with him is the happier for it. Dante takes after his kind-hearted dad. Now the family has settled, Juliette has started to dream of getting back what she lost.",
      game: "The Sims 4: Royalty & Legacy",
      source: [["Monty family", WIKI("Monty_family")], ["Juliette Monty", WIKI("Juliette_Monty")], ["Romeo Monty", WIKI("Romeo_Monty")]],
    },
    // "In the game" against "In your save". src on each side; "todo" = hers to fill.
    compare: [
      {topic: "Home",
       game: ["Renaissance Road, Bellacorde (Ondarion): a small 20 × 15 lot in the same neighbourhood as Tybalt Capp’s palace", "ts4"],
       mine: ["Rifugio dei Pirati, Terra Amorosa (Tartosa): a cheap starter with views of the Lover’s Tree", "plan", "16 Oct"]},
      {topic: "Married",
       game: ["Already married when the game starts", "ts4"],
       mine: ["They marry each other in Tartosa", "plan", "16 Oct"],
       ask: "In the game they’re married with a teenage son. In yours, is the Tartosa wedding their first, or a second one?"},
      {topic: "Dynasty",
       game: ["Juliette founded the Monty dynasty and heads it; Dante is the heir, Romeo a member. The Capps are their rivals", "ts4"],
       mine: ["Romeo and Juliette are outcasts of both the Monty and the Capp dynasties", "plan", "16 Oct"],
       ask: "Who holds the Monty dynasty now: the Renaissance Road Montys? And is Dante an outcast too?"},
      {topic: "Romeo’s family",
       game: ["Nobody: his family tree is empty in The Sims 4", "ts4"],
       mine: ["", "todo"],
       ask: "Is Romeo one of your recreated Sims 2 Montys (Patrizio and Isabella his grandparents, Mercutio his brother)?"},
      {topic: "Renaissance Road",
       game: ["Their home", "ts4"],
       mine: ["Your recreated Sims 2 Montys: Patrizio, Isabella, Mercutio, Antonio with Beatrice and Benedick, and Bianca", "plan", "16 Oct"]},
      {topic: "Juliette’s family",
       game: ["Her brother Tybalt despises her; she dislikes her grandfather Consort’s ghost (a festering grudge); she doesn’t know Tybalt’s three children", "ts4"],
       mine: ["", "todo"]},
      {topic: "What they want",
       game: ["Juliette dreams of winning back what the Capps took from her", "ts4"],
       mine: ["", "todo"]},
    ],
    chapters: [
      {n: "0", title: "As the game tells it", src: "ts4",
       text: "Juliette, a Capp, falls for Romeo Monty across the families’ feud. Cast out of the Capp dynasty, she marries him, raises Dante in a small house in Bellacorde, not far from her brother’s palace, and starts a dynasty of her own."},
      {n: "1", title: "", src: "todo", ask: "Chapter 1: the move to Tartosa (your plan)? Your title, the date you played it, a few lines and your screenshots."},
    ],
    links: [   // people and places, each with why (in the real thing, worked out from the timeline)
      ["lot", "Tartosa|Rifugio dei Pirati", "Their home in your plan"],
      ["lot", "Ondarion|Renaissance Road", "Their home in the game"],
      ["lot", "Ondarion|Bellacorde Palace", "The Capps’ palace"],
      ["hh", "Ondarion|Capp", "Juliette’s brother and his children"],
      ["hh", "Ondarion|Monty", "Your Sims 2 Montys"],
      ["sim", "consort-capp", "Juliette’s grandfather"],
      ["sim", "cordelia-capp", "Juliette’s late mother"],
      ["sim", "caliban-capp", "Juliette’s late father"],
    ],
  },

  "Willow Creek|Goth": {
    title: "The Goths",
    members: ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth"],
    bio: "",
    bioAsk: "Who are the Goths in your save? What has changed since the game started, if anything?",
    ea: {
      bio: "A grand old family with a gloomy air. Mortimer writes dark stories and Bella has a habit of vanishing without a word, and the game wonders whether Cassandra and Alexander will grow up gloomy too.",
      game: "The Sims 4",
      source: [["Goth family", WIKI("Goth_family")], ["Mortimer Goth", WIKI("Mortimer_Goth")], ["Bella Goth", WIKI("Bella_Goth")]],
    },
    compare: [
      {topic: "Home",
       game: ["Ophelia Villa, Pendula View: a three-storey Gothic house", "ts4"],
       mine: ["Ophelia Villa, now a Haunted House (lot type)", "plan", "15 Oct"]},
      {topic: "Who lives there",
       game: ["Mortimer, Bella, Cassandra and Alexander", "ts4"],
       mine: ["The same four on the site so far (EA’s starting details)", "site"]},
      {topic: "Dynasty",
       game: ["The Goth dynasty: Mortimer heads it, Cassandra is the heir (only in saves started after Royalty & Legacy)", "ts4"],
       mine: ["", "todo"],
       ask: "Was your save started after Royalty & Legacy, so the Goth dynasty is there?"},
      {topic: "Bella",
       game: ["Younger than Mortimer in this game; keeps disappearing (EA’s bio)", "ts4"],
       mine: ["", "todo"]},
      {topic: "Family elsewhere",
       game: ["Mortimer’s aunt Agnes Crumplebottom in Henford-on-Bagley; a shared ancestor with the Gomes family in Ravenwood", "ts4"],
       mine: ["Agnes isn’t in your plan (the game hides her household); the Gomeses live at Teardrop Cottage", "plan"]},
      {topic: "Since the game started",
       game: ["Nothing yet: this is how a new save starts", "ts4"],
       mine: ["", "todo"]},
    ],
    chapters: [
      {n: "0", title: "As the game tells it", src: "ts4",
       text: "Mortimer, a writer, and Bella, a secret agent, live at Ophelia Villa with teenage Cassandra and young Alexander. Mortimer lost his mother Cornelia in a fire; her sister Agnes lives in Henford-on-Bagley."},
      {n: "1", title: "", src: "todo", ask: "Chapter 1: your title, the date you played it, a few lines and your screenshots."},
    ],
    links: [
      ["lot", "Willow Creek|Ophelia Villa", "Their home"],
      ["hh", "Willow Creek|Pancakes", "Bob and Eliza: Mortimer and Bella’s classmates"],
      ["hh", "Oasis Springs|Landgraab", "Nancy and Geoffrey: classmates too"],
      ["hh", "Ravenwood|Gomes", "A shared ancestor"],
      ["sim", "agnes-crumplebottom", "Mortimer’s aunt"],
      ["sim", "cornelia-goth", "Mortimer’s late mother"],
      ["sim", "lady-ravendancer-goth", "A Goth ancestor"],
    ],
  },
};

/* ================= events, save-wide (data/story-events.json in the proposal) =================
   One list for the whole save, so an event shared by two households (a move, a wedding between families) is typed once
   and shows on every household, lot and world it names. */
const EVENTS = [
  // ---------- Romeo, Juliette and Dante ----------
  {id: "juliette-born-capp", stage: "before", src: "ts4", kind: "born", order: 1,
   title: "Juliette is born a Capp",
   text: "Daughter of Caliban and Cordelia Capp (both late now), granddaughter of Consort Capp, and Tybalt’s sister.",
   sims: ["juliette-monty", "tybalt-capp", "consort-capp", "caliban-capp", "cordelia-capp"], households: ["Ondarion|Capp"], lots: [],
   source: [["Juliette Monty", WIKI("Juliette_Monty")]]},
  {id: "romeo-juliette-love", stage: "before", src: "ts4", kind: "love", order: 2,
   title: "Romeo and Juliette fall in love",
   text: "Across the Capp–Monty feud. It’s one of the milestones both of them start the game with.",
   sims: ["romeo-monty", "juliette-monty"], households: [], lots: [],
   source: [["Romeo Monty", WIKI("Romeo_Monty")]]},
  {id: "juliette-disowned", stage: "before", src: "ts4", kind: "outcast", order: 3,
   title: "The Capps cast Juliette out",
   text: "For choosing Romeo she loses her Noble rank and most of her fortune. Tybalt becomes the highest-ranking Noble in Bellacorde.",
   sims: ["juliette-monty", "tybalt-capp"], households: ["Ondarion|Capp"], lots: [],
   source: [["Monty family", WIKI("Monty_family")], ["Capp family", WIKI("Capp_family")]]},
  {id: "romeo-juliette-married", stage: "before", src: "ts4", kind: "married", order: 4,
   title: "Romeo and Juliette marry",
   text: "She takes his surname, Monty.",
   sims: ["romeo-monty", "juliette-monty"], households: [], lots: [],
   source: [["Juliette Monty", WIKI("Juliette_Monty")]]},
  {id: "dante-born", stage: "before", src: "ts4", kind: "born", order: 5,
   title: "Dante is born",
   text: "",
   sims: ["dante-monty", "romeo-monty", "juliette-monty"], households: [], lots: [],
   source: [["Dante Monty", WIKI("Dante_Monty")]]},
  {id: "monty-dynasty", stage: "before", src: "ts4", kind: "dynasty", order: 6,
   title: "Juliette founds the Monty dynasty",
   text: "Romeo and Dante join; Dante becomes the heir. One star of prestige, ideals Passionate and Hardworking, and the Capps as rivals.",
   sims: ["juliette-monty", "romeo-monty", "dante-monty"], households: [], lots: [],
   source: [["Dynasty", WIKI("Dynasty")]]},
  {id: "montys-start", stage: "start", src: "ts4", kind: "home", order: 7,
   title: "At Renaissance Road, Bellacorde",
   text: "A small lot and modest savings, in the same neighbourhood as Tybalt’s palace. Romeo is a line cook, 42 days from Elder; Juliette has no job; Dante is a teen. Tybalt despises them both.",
   sims: ["romeo-monty", "juliette-monty", "dante-monty", "tybalt-capp"], households: ["Ondarion|Capp"], lots: ["Ondarion|Renaissance Road"],
   source: [["Ondarion", WIKI("Ondarion")], ["Romeo Monty", WIKI("Romeo_Monty")]]},
  {id: "veronaville", stage: "older", src: "older", kind: "older", order: 8,
   title: "Teenage sweethearts in Veronaville (The Sims 2)",
   text: "Romeo, grandson of Patrizio and Isabella and younger brother of Mercutio, has a secret crush on Juliette Capp. The feud began with Consort Capp’s broken promise to Patrizio. The Sims 4 doesn’t carry this over.",
   sims: ["romeo-monty", "juliette-monty", "patrizio-monty", "mercutio-monty", "consort-capp"], households: ["Ondarion|Monty"], lots: [],
   source: [["Veronaville", WIKI("Veronaville")], ["Monty family", WIKI("Monty_family")]]},
  {id: "montys-to-tartosa", stage: "save", src: "plan", kind: "moved-world", order: 9, decided: "16 Oct",
   title: "Romeo, Juliette and Dante move to Tartosa",
   text: "From Renaissance Road in Ondarion to Rifugio dei Pirati, a cheap starter above Hideaway Falls with views of the Lover’s Tree.",
   sims: ["romeo-monty", "juliette-monty", "dante-monty"], households: ["Tartosa|Monty"], lots: ["Ondarion|Renaissance Road", "Tartosa|Rifugio dei Pirati"],
   ask: "Why do they leave, and when?"},
  {id: "montys-outcasts", stage: "save", src: "plan", kind: "outcast", order: 10, decided: "16 Oct",
   title: "Outcasts of both dynasties",
   text: "Romeo is cast out of the Monty dynasty and Juliette out of the Capp dynasty.",
   sims: ["romeo-monty", "juliette-monty"], households: ["Ondarion|Monty", "Ondarion|Capp"], lots: [],
   ask: "Who heads each dynasty in your save?"},
  {id: "montys-tartosa-wedding", stage: "save", src: "plan", kind: "married", order: 11, decided: "16 Oct",
   title: "A wedding in Tartosa",
   text: "Romeo and Juliette marry each other in Tartosa.",
   sims: ["romeo-monty", "juliette-monty"], households: ["Tartosa|Monty"], lots: [],
   ask: "Where in Tartosa, and is it their first wedding?"},
  {id: "renaissance-road-montys", stage: "save", src: "plan", kind: "moved", order: 12, decided: "16 Oct",
   title: "The Sims 2 Montys at Renaissance Road",
   text: "You recreate Patrizio, Isabella, Mercutio, Antonio with the twins Beatrice and Benedick, and Bianca. Antonio worked at the family restaurant; the dynasty skill is Gourmet Cooking.",
   sims: ["patrizio-monty", "isabella-monty", "mercutio-monty", "antonio-monty", "beatrice-monty", "benedick-monty", "bianca-monty"], households: ["Ondarion|Monty"], lots: ["Ondarion|Renaissance Road"],
   ask: "How is Romeo related to them? (Two Beatrices: Antonio’s twin and Tybalt’s daughter.)"},
  {id: "rifugio-build", stage: "save", src: "site", kind: "build", order: 13,
   title: "Your Rifugio dei Pirati",
   text: "Not built yet: Tartosa is a world you don’t own.",
   sims: [], households: [], lots: ["Tartosa|Rifugio dei Pirati"]},
  {id: "montys-next", stage: "save", src: "todo", kind: "todo", order: 14,
   title: "", ask: "What happens once you play them: a birthday, a new job, a visit to Ondarion…", sims: [], households: ["Tartosa|Monty"], lots: []},

  // ---------- the Goths ----------
  {id: "mortimer-born", stage: "before", src: "ts4", kind: "born", order: 1,
   title: "Mortimer is born a Goth",
   text: "His mother is Cornelia Goth, born a Crumplebottom; his father isn’t on the game’s family tree. Cornelia’s sister is Agnes Crumplebottom, so Agnes is Mortimer’s aunt.",
   sims: ["mortimer-goth", "cornelia-goth", "agnes-crumplebottom"], households: [], lots: [],
   source: [["Cornelia Goth", WIKI("Cornelia_Goth")], ["Agnes Crumplebottom", WIKI("Agnes_Crumplebottom")]]},
  {id: "copperdale-00", stage: "before", src: "gallery", kind: "school", order: 2,
   title: "Classmates at Copperdale High",
   text: "EA’s “Copperdale Class of ’00” Gallery household has teenage Mortimer and Bella Bachelor in the same class as Bob Pancakes, Eliza Hastings, Nancy Landgraab and Geoffrey (then Osteer).",
   sims: ["mortimer-goth", "bella-goth", "bob-pancakes", "eliza-pancakes", "nancy-landgraab", "geoffrey-landgraab"], households: ["Willow Creek|Pancakes", "Oasis Springs|Landgraab"], lots: [],
   source: [["Copperdale Class of ’00", WIKI("Copperdale_Class_of_%2700")]]},
  {id: "goths-married", stage: "before", src: "ts4", kind: "married", order: 3,
   title: "Mortimer and Bella marry",
   text: "Bella was born a Bachelor.",
   sims: ["mortimer-goth", "bella-goth"], households: [], lots: [],
   source: [["Bella Goth", WIKI("Bella_Goth")]]},
  {id: "cornelia-dies", stage: "before", src: "ts4", kind: "died", order: 4,
   title: "Cornelia dies in a fire",
   text: "She is on the family tree since the February 2026 update, but can’t come back as a ghost.",
   sims: ["cornelia-goth", "mortimer-goth"], households: [], lots: [],
   source: [["Cornelia Goth", WIKI("Cornelia_Goth")]]},
  {id: "goth-children", stage: "before", src: "ts4", kind: "born", order: 5,
   title: "Cassandra and Alexander are born",
   text: "",
   sims: ["cassandra-goth", "alexander-goth", "mortimer-goth", "bella-goth"], households: [], lots: [],
   source: [["Goth family", WIKI("Goth_family")]]},
  {id: "goth-dynasty", stage: "before", src: "ts4", kind: "dynasty", order: 6,
   title: "The Goth dynasty",
   text: "With Royalty & Legacy: Mortimer heads it and Cassandra is the heir. Three stars of prestige, ideals Passionate and Mysterious. Only in saves started after the pack.",
   sims: ["mortimer-goth", "cassandra-goth"], households: [], lots: [],
   source: [["Dynasty", WIKI("Dynasty")]]},
  {id: "ravendancer", stage: "before", src: "ts4", kind: "ancestor", order: 7,
   title: "An ancestor in Ravenwood",
   text: "Lady Ravendancer Goth, a ghost from long ago, is a distant ancestor of Zelmira Gomes: the Gomes family and the Goths share an ancestor.",
   sims: ["lady-ravendancer-goth", "zelmira-gomes"], households: ["Ravenwood|Gomes"], lots: [],
   source: [["Zelmira Gomes", WIKI("Zelmira_Gomes")]]},
  {id: "goths-start", stage: "start", src: "ts4", kind: "home", order: 8,
   title: "At Ophelia Villa, Pendula View",
   text: "Mortimer is a freelance writer, Bella a secret agent, Cassandra a teen at high school and Alexander a child, 14 days from his teens.",
   sims: ["mortimer-goth", "bella-goth", "cassandra-goth", "alexander-goth"], households: [], lots: ["Willow Creek|Ophelia Villa"],
   source: [["Ophelia Villa", WIKI("Ophelia_Villa")], ["Mortimer Goth", WIKI("Mortimer_Goth")]]},
  {id: "goths-older", stage: "older", src: "older", kind: "older", order: 9,
   title: "Pleasantview and Sunset Valley (The Sims 2 and 3)",
   text: "In the older games Bella vanishes and Mortimer raises the children alone, and Mortimer’s parents Gunther and Cornelia appear. The Sims 4 is its own timeline, so none of this happened here unless you say so.",
   sims: ["bella-goth", "mortimer-goth", "cornelia-goth"], households: [], lots: [],
   source: [["Goth family", WIKI("Goth_family")]]},
  {id: "ophelia-haunted", stage: "save", src: "plan", kind: "build", order: 10, decided: "15 Oct",
   title: "Ophelia Villa becomes a Haunted House",
   text: "Your choice of lot type for the Goths’ home.",
   sims: [], households: [], lots: ["Willow Creek|Ophelia Villa"],
   ask: "Does the haunting belong in their story?"},
  {id: "ophelia-build", stage: "save", src: "site", kind: "build", order: 11,
   title: "Your Ophelia Villa",
   text: "Not built yet.",
   sims: [], households: [], lots: ["Willow Creek|Ophelia Villa"]},
  {id: "goths-next", stage: "save", src: "todo", kind: "todo", order: 12,
   title: "", ask: "What happens once you play them: Cassandra’s birthday, a new job, a visit from Agnes…", sims: [], households: ["Willow Creek|Goth"], lots: []},
];
// which household each event belongs to (in the real thing: any event naming one of its Sims, its household or its home)
const EVENTS_OF = {
  "Tartosa|Monty": ["juliette-born-capp", "romeo-juliette-love", "juliette-disowned", "romeo-juliette-married", "dante-born", "monty-dynasty", "montys-start", "veronaville", "montys-to-tartosa", "montys-outcasts", "montys-tartosa-wedding", "renaissance-road-montys", "rifugio-build", "montys-next"],
  "Willow Creek|Goth": ["mortimer-born", "copperdale-00", "goths-married", "cornelia-dies", "goth-children", "goth-dynasty", "ravendancer", "goths-start", "goths-older", "ophelia-haunted", "ophelia-build", "goths-next"],
};

/* ================= moves that already follow from her plan (research/ea-family-lore.md §4) =================
   Premade households whose home in her plan is in another world than the game's. A "moved world" event for each
   could be made automatically (src "plan"), with no typing. */
const WORLD_MOVES = [
  ["BFF", "Summer, Travis and Liberty", "Willow Creek", "Garden Essence", "Newcrest|BFF", "Newcrest|Fern Park", "probably the same trio"],
  ["Roomies", "J, Mitchell, Gavin and Zoe", "Oasis Springs", "Cacti Casa", "Del Sol Valley|Roomies", "Del Sol Valley|Inner Circle", ""],
  ["Zest", "Johnny Zest", "Oasis Springs", "Slipshod Mesquite", "Del Sol Valley|Zest", "Del Sol Valley|Upland Place", ""],
  ["Bjergsen", "Bjorn, Clara, Sofia and Elsa", "Windenburg", "The Lighthouse", "Willow Creek|Bjergsen", "Willow Creek|Brook Bungalow", ""],
  ["Villareal", "Jacques, Hugo, Luna and Max", "Windenburg", "Von-Windenburg Estate", "Willow Creek|Villareal", "Willow Creek|Umbrage Manor", ""],
  ["Behr", "Candy and Yuki", "Windenburg", "Waterlock Redoubt", "San Myshuno|Behr", "San Myshuno|702 ZenView", ""],
  ["Bro", "Sergio and Joaquin", "Windenburg", "Dock Den", "San Myshuno|Bro & Kennedy", "San Myshuno|701 ZenView", "with Kennedy"],
  ["Jeong", "Venessa Jeong", "Del Sol Valley", "Upland Place", "San Myshuno|Jeong", "San Myshuno|1310 21 Chic Street", ""],
  ["Eclectic Arts", "Alice, Mark and Leslie", "StrangerVille", "Dream Weavers Way", "Del Sol Valley|Eclectic Arts", "Del Sol Valley|Upland Place", "maybe split in three"],
  ["Monty", "Romeo, Juliette and Dante", "Ondarion", "Renaissance Road", "Tartosa|Monty", "Tartosa|Rifugio dei Pirati", ""],
];
