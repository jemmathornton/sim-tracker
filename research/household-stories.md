# Household stories: how players keep them, and options for "Their story" (overnight 16–17 Oct)

> Out of date since 19 Oct: her call is her own bios for her Sims and EA’s own text word for word for EA’s (research/decisions/stories.md).

For the empty **Their story** section on household pages. Research and a prototype only: nothing in `site/`, `data/` or `tools/` is changed.

- **Prototype:** `for-jemma/prototypes/stories/index.html` (opens from the folder): Romeo, Juliette and Dante (Tartosa in her plan) and the Goths, each shown "On the household page" (my picks together) or "Each option" (alternatives side by side). Option letters below match the prototype.
- **Sources:** the Sims Wiki (through its API, 17 Oct), a few community sites (list at the end), `research/ea-family-lore.md`, `research/sims-display.md`, `research/sims-sources.md`, her Gallery data and TODO.md.
- **Her story is never made up.** The prototype only uses what she has decided already (TODO.md, 15–16 Oct) and leaves everything else as a gap marked "Yours to write". EA's side is summarised in our own words with links, not copied.

---

## 1. Where things are now

- Household pages end with **Their story: "No story yet."** (`site/js/app.js`, `household()`).
- Her story already exists in bits, scattered:
  - residents notes in her plan, e.g. "Monty (Romeo, Juliette and Dante, from Ondarion)", "Monty (the Sims 2 Montys, recreated)";
  - decisions on TODO.md: the Montys' move to Tartosa, Romeo and Juliette as outcasts of both dynasties who marry in Tartosa, the Sims 2 Montys at Renaissance Road, Enzo Alto's family at Giardino Del Grandioso, Ophelia Villa as a Haunted House;
  - **her own household uploads on the Gallery** (6 of them). Only one has a bio: "Spectra", about Ella leaving her family to go out into the world, tagged #notsoberry #mint #founder (see §6).
- EA's starting details are on the Goth cards (from the wiki). Where her Sims will come from is still open (`research/sims-sources.md`).

---

## 2. How players record Sims stories

| Way | What it looks like | Take-away for her site |
|---|---|---|
| **Legacy challenge write-ups** (Pinstar's 10-generation Legacy; lilsimsie's Not So Berry, one colour per generation, mint first; pack legacies) | Blog or forum posts in **chapters**, usually numbered *generation.chapter* (1.1, 1.2, then 2.1 for the heir); a "founder" post first; screenshots with captions; some write each sibling's view in turn. Forum threads keep a "current chapter" line at the top | Chapters with a number, a title and pictures; a line saying where the story is up to |
| **SimLit and Simblr** (Sims stories on Tumblr) | Written stories built round in-game screenshots; profile pages per Sim (family, home, formative moments, friends, enemies, goals) | A short bio plus "who's who"; pictures do much of the telling |
| **Gallery household uploads** | Title, a short description (the game's household bio box) and hashtags | The bio is the one bit of story the game itself lets you write; hers would carry over |
| **Spreadsheets and Notion** (Rosannatxt's save-file and Pack Legacy dashboards, goodaurasonly trackers, Notion's "Backstory Creator") | A backstory cell per household; a page per generation with the heir's details and backstory; photo galleries per generation; prompt cards for inventing a backstory instead of the game's blurb box | Bio per household; generations as chapters |
| **Timelines** (Tiki-Toki, recommended by TheSimsTree for legacies) | Dated events with pictures, colour-coded per family line | A timeline that can follow one family or the whole save |
| **In the games themselves** | *Sims 2:* Story mode (photos + captions per household or neighbourhood) and memories. *Sims 3:* the Scrapbook (memories captured automatically, editable, shareable). *Sims 4:* the screenshot manager, and since Growing Together (2023) **milestones**: firsts, life and social moments listed per Sim in Simology | Life events are the natural units: born, fell in love, married, moved, had a baby, joined a dynasty, died |

What keeps coming back:
1. **Three shapes:** a short bio, a list of what happened (timeline or chapters), and a cast list of who's connected.
2. **Dates are the player's, not the game's.** People number by generation and chapter, or by when they posted. The Sims 4 calendar has seasons and days but no years, so "Year 2, Spring" is the player's own bookkeeping.
3. **Pictures carry it.** Her rule stands: only her screenshots, no AI art, no wiki pictures.
4. **EA's version and the player's are kept apart** when premades are used: "the lore" against the player's own take.

---

## 3. What EA's own household bios look like

Where they live: the household description in the game (picked when choosing a household, edited in Create a Sim) and on the Gallery when a household is uploaded. The Sims Wiki shows each one in the family's box, which makes the shape easy to compare:

| Game | Length | Shape | Example (summarised) |
|---|---|---|---|
| The Sims 2 | 2 sentences, about 30 words | A situation, then a question as a hook | The Montys: Patrizio never forgave Consort Capp's broken promise, and now his grandson loves the Capp heiress. Will the elders see the families united? |
| The Sims 3 | 1 paragraph, 35–50 words | Playful set-up of who's who | |
| The Sims 4 base game | 2–3 sentences, about 30 words | Who they are + a question | The Goths: gloomy and grand; Mortimer's dark stories, Bella's disappearances; will the children turn gloomy too? |
| Newer packs (My Wedding Stories, Royalty & Legacy) | A full paragraph, 70–150 words | History, money, ambitions, a tension to play; sometimes in one Sim's voice | The Montys (Royalty & Legacy): Juliette lost her rank and fortune for Romeo, is happier for it, and now dreams of getting it back. The Capps' bio is written in Tybalt's snobbish voice |

The usual ingredients: who's who (in relationship words), one event from the past (disowned, widowed, moved), the home and the money, and an open question or ambition for the player to pick up.

EA's story also hides in other places, which together give most of a "before the game" timeline:
- **Milestones premade Sims start with** (wiki, per Sim): Romeo has 7 (fell in love with Juliette, got married, had a baby, joined a dynasty…), Juliette 5 (including *Founded a Dynasty*), Dante 2 (*Became Dynasty Heir*), Tybalt 5. None are listed for the Goths.
- **Starting relationships and sentiments:** Juliette dislikes her grandfather Consort's ghost (a "Festering Grudge"); Tybalt despises both Romeo and Juliette.
- **Family trees**, including the ancestors added in February 2026 (Mortimer's late mother Cornelia, born a Crumplebottom, so Agnes Crumplebottom is his aunt).
- **Lot descriptions** (Rifugio dei Pirati has a "hidden history"), Ravenwood Rumours, dynasty data (head, heir, prestige, ideals, rivals), EA's Gallery households (the Copperdale Class of '00).

**Showing EA's bio:** the site already shows EA's own neighbourhood descriptions. For household bios there are two ways: a summary in our words with a link to the wiki (as in the prototype), or EA's exact text read from her installed game (the premade households' descriptions are in the game files, `research/sims-sources.md` §3). Her choice; if the site ever goes online, EA's words are EA's.

---

## 4. Options for the site

### A. A short bio
| Option | What | Good | Not so good |
|---|---|---|---|
| **A1. Hers first, EA's underneath (my pick)** | Her few sentences lead; "EA's version" sits below, foldable | Her words lead; the same for her own families (no EA part) | Empty until she writes something |
| A2. EA's until hers is written | EA's summary is the bio; hers replaces it later | Every premade has a bio from day one | Reads as if EA's version is her save's story |

### B. A dated timeline
One line per event, each with an icon by kind (born, fell in love, married, cast out, dynasty, moved, moved world, died, ancestor, build) and a word saying where it came from: **The Sims 4 · Older games · EA's Gallery · Your plan · On the site · Your story · Yours to write**.

Events fall into four groups: **Before the game starts** (EA), **In the older games** (kept apart: The Sims 4 is its own timeline), **When a new save starts**, **In your save**.

| Option | What |
|---|---|
| **B1. A line with icons (my pick)** | Cards down a line; each links its Sims, households and lots; switches for Everything / EA's story / Yours, older games on or off, her builds on or off |
| B1 compact | Titles and links only, for big families |
| B2. A table | When · What happened · Who and where · From; like the Stats sheet |

**Dates**, three kinds: the **month she played it** (her real date), an optional **time in the story** ("Year 1, Spring"; hers, since the game has no years), and for plans the **day she decided** ("Decided 16 Oct"). My pick: the month played, plus the story time when she wants it.

Some events need no typing:
- **From her plan:** 10 premade households already live in another world in her plan than in the game (BFF, Roomies, Johnny Zest, Bjergsens, Villareals, Behrs, the Bro household, Venessa Jeong, Eclectic Arts, the Montys), 17 more moved within their own world, and 2 homeless households got homes (`research/ea-family-lore.md` §4). Each can become a "moved" event marked "Your plan".
- **From the site:** her build of their home (built, shared on the Gallery, with the month the Gallery gives). Optional, as builds are her as a builder, not the Sims' story.
- **From the game:** premade milestones and family trees, once EA's families are read from the game files (`sims-sources.md` §3), or typed from the wiki.

### C. EA's version and hers, side by side (EA's families)
| Option | What | Good | Not so good |
|---|---|---|---|
| **C1. Topic by topic (my pick)** | Rows: Home, Who lives there, Married, Dynasty, Family elsewhere, What they want, Since the game started; "In the game" against "In your save", shaded where they differ | Shows exactly what she changed; Home fills itself from her plan against the game's home (`research/data/game-lots.json`) | Only for EA's families |
| C2. Two bios | EA's bio next to hers | Short, reads like a story | Harder to see what changed |

This is the "In the game / In my save" idea from `research/sims-display.md` §8C, applied to the whole household.

### D. Chapters
Legacy-blog style: numbered chapters (generation.chapter), a title, the month played, a few lines and her screenshots. "Chapter 0: as the game tells it" can hold EA's backstory. Only worth it for households she plays as a story. Pictures would come from her Sims 4 Screenshots folder, the way lot pictures come from her Builds folders (a new folder rule in `tools/screenshots.py`, only with her OK).

### E. Links to the lots and households involved
| Option | What |
|---|---|
| **E1. People and places cards (my pick)** | Homes, households and Sims with no home on the site, each with why they're linked ("Juliette's brother and his children"); worked out from the timeline, nothing extra to type; across worlds (Tartosa's Montys link to Ondarion's Capps); worlds she doesn't own shown dashed |
| E2. Only as links on each event | Nothing extra on the page, but no single list of who's connected |

### F. One timeline for the whole save
The same events make a save-wide "What's happened" page, filtered by world or family. It would start with the 10 world moves above. Later, if she wants it.

### My picks together
On each household page's "Their story": **A1** (bio), **C1** (EA's families only), **B1** (timeline), **E1** (people and places), **D** only once she writes chapters. In the real site, empty parts and "Yours to write" prompts would be hidden or shown as one quiet line (her call, see §7).

---

## 5. How it would be stored (proposal only, nothing written)

**Per household, in the world file** (`data/worlds/<world>.json`, under `households.<Name>`, next to `sims` and `links`):

```json
"Monty": {
  "story": {
    "bio": "",
    "ea": {"bio": "Summary in our words", "source": [["Monty family", "https://sims.fandom.com/wiki/Monty_family"]]},
    "compare": [{"topic": "Married", "game": ["Already married when the game starts", "ts4"],
                 "mine": ["They marry each other in Tartosa", "plan", "16 Oct"]}],
    "chapters": [{"n": "1.1", "title": "", "played": "2026-11", "text": "", "shots": []}]
  }
}
```

**One save-wide list of events** (`data/story-events.json`), so an event shared by two households (a move between worlds, a wedding between families) is typed once and shows on every household, lot and world it names:

```json
{"id": "montys-to-tartosa", "kind": "moved-world", "src": "plan", "stage": "save", "decided": "16 Oct",
 "played": "", "inStory": "", "title": "Romeo, Juliette and Dante move to Tartosa", "text": "",
 "sims": ["romeo-monty", "juliette-monty", "dante-monty"], "households": ["Tartosa|Monty"],
 "lots": ["Ondarion|Renaissance Road", "Tartosa|Rifugio dei Pirati"], "source": [], "shots": []}
```

- `src`: ts4 · older · gallery · plan · mine · site. `stage`: before · older · start · save. `kind`: from a fixed list, each with a Lucide icon.
- **Keys:** lots as "World|in-game lot name" (as `tenants` and `nameFix` already do: stable even if she renames a lot); households as "World|Name"; Sims by id (`sims-display.md` §9, or the game's sim id, as the TODO [Claude] note says). Numbered households ("Davidson 1") get their number from the order of homes, so a story should name them by home lot to be safe.
- `compare`: optional; the Home row can be worked out (her plan against the game's home), so only typed rows are stored.
- **App-side only:** the spreadsheet import never touches stories (like `displayName`). `build.py` would copy them into `data.js` and stop if an event names a lot, household or Sim that doesn't exist (as it does for missing pictures).
- Displayed text follows the usual rules (British English, curly apostrophes: the app curls straight ones; no percentages).
- **How her words get in:** (1) she tells Claude in chat, Claude writes the files (as now; my pick to start); (2) a plain text file per household she can write in Notepad (`data/stories/<world>/<household>.md`: bio, then chapters under headings), read by `build.py`; good once she writes chapters; (3) a Stories tab in World Plans (her file, only with her OK; long text is awkward in cells).

The prototype's "How this page's story would be stored" panel shows the full data for both families.

---

## 6. Found on the way

- **The Cadberrys may be a Not So Berry legacy.** Her "Spectra" household upload is tagged #notsoberry #mint #founder, and mint is the challenge's first generation. Her plan has Ella-Mint Cadberry (Hallow Slough, Willow Creek, Sims made), Leah-Moon Cadberry+ (Nookstone, Oasis Springs), Sylvia & Kenny Cadberry (Asphalt Abodes, Newcrest) and "Rochana/Caberry" (Isda Riverfront, Tomarang). If so, they're the natural first family for chapters (generation.chapter). Not assumed: a question for her.
- Her other 5 household uploads (Barraza, Jameson twice, Barnes, Davidson) have no bio.
- **Romeo and Juliette are already married** with a teenage son when the game starts; her plan has them marry in Tartosa. A first wedding or a second one?
- **Tartosa isn't owned,** so the Montys' Tartosa household page doesn't exist in the app yet; their story would show once it does.
- Two Beatrices (Antonio's twin and Tybalt's daughter) are already on TODO; the timeline makes it visible on both sides.

---

## 7. Decisions for Jemma

1. **Bio:** yours first with EA's underneath (A1), or EA's until you write yours (A2)? EA's in our words with a link, or EA's own text from your game?
2. **Timeline:** worth having? Date your events by the month you played, by a time in the story, or both? Show the older games (Sims 2 and 3)? Show your builds on it?
3. **EA's families:** topic-by-topic table (C1) or two bios side by side (C2)?
4. **Chapters:** for which households, if any? The Cadberrys, if they're your Not So Berry family?
5. **People and places:** cards (E1) or only links on each event (E2)?
6. **Gaps:** on the real site, hide empty parts, or show one quiet "Yours to write" line?
7. **Writing it:** chat, or a text file per household?
8. **Save-wide timeline (F):** wanted? Fine to start it with "moved" events made from your plan?
9. **Story questions from the pages:** is the Tartosa wedding Romeo and Juliette's first? Who holds the Monty dynasty, and is Dante an outcast too? How is Romeo related to your Sims 2 Montys? Was your save started after Royalty & Legacy (the Goth dynasty)? Is "Spectra" Ella-Mint Cadberry's household?

---

## Sources

- Sims Wiki pages (API, 17 Oct): Romeo Monty, Juliette Monty, Dante Monty, Tybalt Capp, Consort Capp, Monty family, Capp family, Goth family, Mortimer Goth, Bella Goth, Cornelia Goth, Ophelia Villa, Laurent family, Thebe family, Ondarion, Tartosa, Veronaville, Dynasty, Milestone, Memory, Story mode, Player challenge (Legacy Challenge), Household, The Sims 4 Gallery. https://sims.fandom.com/wiki/
- SimLit on Tumblr: https://simscommunity.info/2023/09/02/sims-4-stories-creating-simlit/
- Growing Together milestones: https://simscommunity.info/2023/03/24/sims-4-growing-together-milestones/
- Not So Berry rules: https://simscommunity.info/2017/03/08/not-so-berry-legacy-challenge/
- A chapter-by-chapter legacy write-up on EA's forums: https://forums.ea.com/discussions/the-sims-4-creative-corner-en/the-grove-pack-legacy-challenge-updated-7-19-2026/11933351
- Notion and spreadsheet trackers: https://www.notion.com/templates/backstory-creator , https://rosannatxt.gumroad.com/l/aamco , https://goodaurasonly.notion.site
- EA help, the Gallery: https://help.ea.com/en/help/the-sims/the-sims-4/the-sims-4-gallery/
- Earlier research in this folder: `ea-family-lore.md`, `sims-display.md`, `sims-sources.md`, `site-ideas-from-other-trackers.md` (Tiki-Toki, TheSimsTree, Threads of Life)
