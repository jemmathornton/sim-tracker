# Holidays in Jemma’s saves (overnight, 21–22 Oct)

Report only. Nothing in `data/` was changed. Every save was read from a temporary copy (`sims4files.read_save` copies the file to a temp folder first and deletes the copy after).

## The short version

- **Her “Rotational” save has her own holiday calendar:** seven holidays she made or remade (Flower Festival, Love Day, Bonfire Night, Dia De Los Muertos, Summer Celebration, HarvestFest, Yuletide) plus the game’s New Year’s Eve. It’s the best fit for the site (it also matches her plan best, see `for-jemma/overnight-18-oct.md`).
- Rotational was played with **two-week seasons**. Her own holidays all fall in the first two weeks, so on four-week seasons they bunch up in weeks 1–2. Only New Year’s Eve moves (to week 4).
- “Building #2” (newest) has the game’s calendar, with Harvestfest cut down to two traditions. The other saves are the game’s calendar, apart from Rosebud Challenge (three of her own) and the two 100 Baby saves (no days off).
- A ready-to-paste proposal for `calendar.json` `holidays` is at the bottom. **It’s a proposal for her, not applied.**

## Where the game keeps holidays

- `SaveSlotData.gameplay_data` → `holiday_service` (`PersistableHolidayService`):
  - `holidays`: every holiday she made or changed: name (as typed), traditions, day off work/school, decorations. A changed game holiday keeps the game’s id (e.g. 182142 Harvestfest).
  - `calendars`: one calendar per season length (0 = 1 week, 1 = 2 weeks, 2 = 4 weeks). Each entry is holiday id, season (0 summer, 1 autumn, 2 winter, 3 spring) and day of the season (0 = first day).
- Season length is a game option (`AccountData` → `gameplay_account_data` → `gameplay_options.season_length`); blank means the default, one week.
- The game’s holidays and traditions are tuning (`HolidayDefinition`, `HolidayTradition`), named from the game’s English text.

## How days become week and weekday (assumption)

- Every season in her saves starts on a whole week of game time (`season_start_time` is always a multiple of 7 days), and the game’s week starts on **Sunday**. So day 0 of a season is a Sunday.
- **Week = day ÷ 7, rounded down, + 1. Weekday = Sun, Mon, Tue … Sat for the remainder 0–6.** This is the same rule the site already uses for `gameHolidays` (Love Day day 19 = week 3 Friday).
- **One catch:** the site’s weeks run Monday to Sunday. A holiday on the game’s first Sunday (Dia De Los Muertos, HarvestFest, Yuletide) is shown at the *end* of its week, after that week’s Saturday, although in the game it comes first. Her call whether that matters (see questions).

## Every save

Dates are the file dates. Most saves show 21 Dec 2023 20:56, which looks like when the folder was copied, not when she last played. The `.ver0` backups match their saves and aren’t listed separately.

| Save | File date | Season length | Holidays |
|---|---|---|---|
| Building #2 (+ its Autosave) | 21 Oct 2026 | 1 week | Game calendar; **Harvestfest edited**: traditions Decorate and Grand Meal only |
| Season Events | 15 Mar 2026 | **4 weeks** | Game calendar, unchanged |
| Not So Berry | 11 Oct 2025 | 1 week | Game calendar, unchanged |
| 100 Baby Challenge!! | 24 Sep 2025 | 1 week | Game’s four, **no day off on any** (traditions unchanged) |
| Horses! | 12 Jan 2024 | 1 week | Game calendar, unchanged |
| **Rotational** | 21 Dec 2023 | **2 weeks** | **Her own seven + New Year’s Eve** (below) |
| Rosebud Challenge | 21 Dec 2023 | 1 week | Her own three (First Day of Summer, Harvestfest, Bonfire Night) + game’s Winterfest, New Year’s Eve, Love Day |
| Vivian – 100 Babies Challenge | 21 Dec 2023 | 1 week | As 100 Baby Challenge!! (no days off) |
| Sulani Save | 21 Dec 2023 | 2 weeks | Only New Year’s Eve and Love Day (Harvestfest and Winterfest removed) |
| Building, Tiquelle Legacy, Rags to Riches, StrangerVille Playthrough, Snowy Escape, Starter Save, Return to the HOB, Sims Sessions, Will the port be Promising?, All Universities, It’s Magic!, MC Save 00001111, Vivian – 100 Baby Test, My Saved Game 4,371 / 4,373 | 21 Dec 2023 | 1 week (Sims Sessions, All Universities: 2) | Game calendar, unchanged |
| Rotational (“--safe” copy), My Saved Game 2 / 6 / 4,370 / 4,375, Normal Lifespan, Wonder Child Challenge, SelfSim Take #1 | 21 Dec 2023 | – | No holiday calendar (made before Seasons, or a part-copy) |

## The game’s own calendar (for comparison)

Same in every unchanged save. Traditions from the game’s tuning.

| Holiday | Season | 1-week seasons | 4-week seasons | Day off | Traditions |
|---|---|---|---|---|---|
| Love Day | Spring | Fri | Week 3 Fri | No | Romantic Spirit, Give Flowers, Go on a Date |
| Harvestfest | Autumn | Thu | Week 4 Thu | Yes | Decorate, Holiday Gnomes, Grand Meal, Thankful Spirit |
| Winterfest | Winter | Wed | Week 3 Wed | Yes | Decorate, Festive Spirit, Open Presents, Grand Meal, Father Winter |
| New Year’s Eve | Winter | Sat | Week 4 Sat | Yes | Decorate, Party Spirit, Make Resolutions, Countdown to Midnight |

Nothing in summer. Surprise holidays (Rebate Day, The Lottery and the rest) are random and not on the calendar.

## Rotational, holiday by holiday

“Day” is the day of the season in the save. On 2-week seasons (how she played it) every holiday below is on the same week and day except New Year’s Eve (week 2 Sat).

| Holiday | Season | Day | 4-week seasons | Day off | Traditions | Note |
|---|---|---|---|---|---|---|
| Flower Festival | Spring | 6 | Week 1 Sat | Yes | Egg Hunt, Flower Bunny, Party Spirit, Baking, Gardening | Her own |
| Love Day | Spring | 9 | Week 2 Tue | No | Go on a Date, Give Flowers, Give Gifts, Romantic Spirit | Her own version; the game’s Love Day is off her calendar |
| Summer Celebration | Summer | 6 | Week 1 Sat | Yes | Baking, Drinking, Bar-B-Que, Go on a Vacation or Travel, Water Fun | Her own |
| Dia De Los Muertos | Autumn | 0 | Week 1 Sun | No | Decorate, Festive Lighting, Trick or Treat, Wear Costumes, Remembrance | Her own; spelt as she typed it |
| Bonfire Night | Autumn | 5 | Week 1 Fri | No | Fireworks, Fire, Party Spirit, Bar-B-Que | Her own |
| HarvestFest | Autumn | 7 | Week 2 Sun | Yes | Decorate, Grand Meal, Holiday Gnomes, Thankful Spirit | Her own copy (same traditions as the game’s Harvestfest); the game’s is off her calendar |
| Yuletide | Winter | 7 | Week 2 Sun | Yes | Decorate, Grand Meal, Give Gifts, Father Winter, Open Presents | Her own; replaces Winterfest |
| New Year’s Eve | Winter | 27 (13 on 2-week) | Week 4 Sat | Yes | Decorate, Party Spirit, Make Resolutions, Countdown to Midnight | The game’s, unchanged |

## Rosebud Challenge (the other save with her own holidays)

| Holiday | Season | 4-week seasons | Day off | Traditions |
|---|---|---|---|---|
| First Day of Summer | Summer | Week 1 Mon | Yes | Baking, Drinking, Bar-B-Que, Gardening, Water Fun |
| Harvestfest | Autumn | Week 1 Tue | Yes | Grand Meal, Decorate, Holiday Gnomes, Thankful Spirit, Gardening |
| Bonfire Night | Autumn | Week 1 Fri | No | Fire, Fireworks, Bar-B-Que |

Plus the game’s Love Day, Winterfest and New Year’s Eve on their usual days.

## Questions for her

1. Use Rotational’s holidays for the site?
2. Four-week seasons: keep them where the game puts them (bunched in weeks 1–2), or spread them out (e.g. double the week: week 1 → 1, week 2 → 3)?
3. Holidays on the season’s first Sunday (Dia De Los Muertos; HarvestFest and Yuletide on week 2’s): the site’s Monday-to-Sunday weeks show them at the end of the week, though in the game they come first. Fine, or move them?
4. Spelling on the site: “HarvestFest” or the game’s “Harvestfest”; “Dia De Los Muertos” or “Día de los Muertos”?

## Proposal for `data/calendar.json` `holidays` (not applied)

From Rotational’s 4-week calendar, as the game would put them. `off` = day off work and school (same as `gameHolidays`). `replaces` hides the game’s holiday of that name (the site already supports it). New Year’s Eve is left out: it already shows from `gameHolidays` on the same day.

```json
"holidays": [
 {"name": "Flower Festival", "season": "Spring", "week": 1, "day": "Sat", "off": true},
 {"name": "Love Day", "season": "Spring", "week": 2, "day": "Tue", "off": false, "replaces": "Love Day"},
 {"name": "Summer Celebration", "season": "Summer", "week": 1, "day": "Sat", "off": true},
 {"name": "Dia De Los Muertos", "season": "Autumn", "week": 1, "day": "Sun", "off": false},
 {"name": "Bonfire Night", "season": "Autumn", "week": 1, "day": "Fri", "off": false},
 {"name": "HarvestFest", "season": "Autumn", "week": 2, "day": "Sun", "off": true, "replaces": "Harvestfest"},
 {"name": "Yuletide", "season": "Winter", "week": 2, "day": "Sun", "off": true, "replaces": "Winterfest"}
]
```

How it was found: scratch scripts in the session scratchpad (`holidays/read.py`, `tun.py`, `names.py`), using `tools/sims4files.py` and `tools/research/tuning.py`.
