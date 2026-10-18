# What’s on: festivals, holidays and events (18 Oct)

**In short:** add C, a small “What’s on” box on each world page, with days and times. Start with festivals only, plus one line for the four holidays every world shares.
**Why:** festival names already show on neighbourhood cards and pages. C adds the days and times, in the place you already look, and needs no new page or menu item.
**Later, if you want:** lot nights (lounges, thrift stores), uni and school events, then A (a whole-save week calendar) once there’s enough to fill it.

Research only: nothing in the site or data was changed. Background: `research/festivals-calendar.md`; the three options side by side: `for-jemma/prototypes/calendar/index.html` (opens straight from the folder).

---

## What the site has now

**Festivals (from the game’s own files)**, stored per neighbourhood as names only, with no days or times:

| World | Festivals and events | Where |
|---|---|---|
| Sulani | 8 | Ohan’ali Town (7), Mua Pel’am (Turtle Hatching) |
| Britechester | 8 | quads, canal, Ritual Grounds |
| Ravenwood | 7 | Mourningvale, Crow’s Crossing, Whispering Glen |
| San Myshuno | 5 | Arts Quarter, Fashion District, Spice Market |
| Henford-on-Bagley | 5 | Finchwick (the five fairs) |
| Copperdale | 4 | school grounds and football field |
| Gibbi Point | 4 | Jellyfish Junction, Crystal Valley, Wanderwood Wilds |
| Mt. Komorebi | 3 | one in each neighbourhood |
| Nordhaven | 2 | “Hobby meetups”, once per neighbourhood |

- **46 entries in 9 worlds.** The other 16 owned worlds have none.
- **Not on the site as festivals:** Tomarang’s Night Market (only as a world highlight), Chestnut Ridge’s horse competitions and Ondarion’s sword tournaments (any day, at a rabbit hole).
- **Days and times** exist only in the prototype (`events.js`: 35 festivals and 24 uni and school events, with day, time and “every other week”). Moving them into `data/` is the main work for any option.
- **University organisations:** 7, with 16 events between them, each already with its day and time in words (e.g. “Utili-Bot Contest on the quad (Sun, 12–6 pm)”). Shown on each organisation’s page.
- **Clubs:** 11, each with a meeting place and activities, but **no meeting days** (the game has none; you set them when you play).
- **Holidays:** not on the site anywhere. Love Day, Harvestfest, Winterfest and New Year’s Eve are the same in every world.

## How festivals show now

- **Neighbourhood card** (on the world page): “Festivals and events: …” with the first three names, then “and 2 more”.
- **Neighbourhood page:** the same line with every name, under “The lots”.
- **World page:** nothing of its own. Its last block is “Weather and highlights”, from the game.
- Nowhere says which day anything is on.

---

## The options

**A. A week calendar for the whole save** (new page, Monday to Sunday, every world at once)
- For: the one place to see a busy Saturday across all your worlds; holidays and seasons fit neatly underneath.
- Against: a new page and menu item; 16 worlds would never appear on it; crowded on Saturdays; “every other week” has to be shown as faint outlines because which week depends on your save.

**B. A list by world** (new page, one section per world)
- For: easy to scan; can show what each event needs from your plan (e.g. a lounge).
- Against: also a new page, and it mostly repeats what the world pages would hold; you’d go there and then back.

**C. A small box on each world page** (between the neighbourhoods and the weather)
- For: builds on what’s there; you see it where you already look; worlds with nothing simply don’t get a box; no new page.
- Against: no view across the whole save, so you can’t compare worlds at a glance.

**None**
- For: no work; names already show on neighbourhoods.
- Against: still no days or times anywhere.

---

## Recommendation: C

**At first:**
- A “What’s on” box on the 9 world pages that have festivals (Tomarang too, if the Night Market goes in). Days in order, each with its events, time, neighbourhood (linked) and “every other week” where it is.
- One line underneath: “Plus the holidays every world shares: Love Day (spring, Friday), Harvestfest (autumn, Thursday), Winterfest and New Year’s Eve (winter, Wednesday and Saturday)”.
- Neighbourhood cards and pages keep their festival line as now, perhaps with the day in brackets (shown at the bottom of option C in the prototype).

**Later (each a separate yes):**
- Lot nights on the lot’s own world: lounges (Calico, Orchid A Go Go) and Thrift and Boba Stores. These follow your lot types, so they’d change when you re-type a lot.
- Britechester’s organisation events and Copperdale’s school events in the same box (they’re already in the festival list there; this would add their times).
- Club meeting days, if you decide them; they’d show on the club’s page and its lot’s world.
- Option A, once lot nights and clubs are in and there’s enough for a whole-save week to be worth it. It would use the same data, so nothing is wasted.

---

## Your decisions (yes or no)

1. A “What’s on” box on each world page (C), rather than a new page (A or B)?
2. Festivals and the four holidays only, to start?
3. Week starting Monday? (No = Sunday, as in the game.)
4. Add Tomarang’s Night Market as a festival in Morensong?
5. Add Chestnut Ridge’s horse competitions and Ondarion’s tournaments as “any day” lines?
6. Show the day in brackets on neighbourhood cards too (e.g. “Flea Market (Sunday, every other week)”)?
7. Sulani’s unnamed events: keep the names made from the game’s settings (Town BBQ and the rest), as now?
8. Nordhaven: show the seven meetups by name, instead of one “Hobby meetups” line?
9. Later: lounge and thrift store nights on their worlds?
10. Later: a meeting day for each club, chosen by you?
