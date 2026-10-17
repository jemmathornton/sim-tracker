# Speed and accessibility (17 Oct, overnight, research only)

Nothing in the app, data or tools was changed. Findings and suggestions only.

**How it was checked:** the code (`site/js/app.js`, `site/site.css`, `site/index.html`), every picture in `site/` measured with Pillow, and the running `app` preview at 1280×800 in a tab of my own (closed afterwards, window size reset). Her laptop runs at 200%, so one pixel on the page is two on her screen; picture sizes below are judged for that. The browser pane was hidden overnight, so it only drew the page when a screenshot was taken: script and layout times are real measurements, but paint timings weren’t possible, so “pictures per page” comes from the code and was spot-checked in the preview. Opening every page in the preview reset the preview’s own “New since you looked” marks; her app on the shortcut keeps its own and isn’t affected.

## Short answer

- **The site is fast.** Every page is drawn in under 20 ms (a world’s Stats in under 40 ms), except the main **Stats** page: about 0.2–0.3 s to draw its 405-row table, and the same again on every key press, sort or world click there (up to 1 s when they come quickly one after another).
- **The only thing that holds up the first paint is Google Fonts.** It costs little with a good connection, but on slow or patchy Wi-Fi the window can stay blank until the request gives up.
- **Pictures are the right size** for cards and banners. The small circles and the thumbnail strip use the 720px card thumbnails (fine on her PC, wasteful online). **Gallery pictures are only 610×410**, so the 154 lot banners that use one look soft at 200%. That’s the size the Gallery gives, so it can’t be fixed from here.
- **Accessibility, the main problems:**
  - Light text over light parts of the maps: the small pack-name line above each world title is too faint on all 25 world banners, the brass half of the title is too faint on 24, and a third of neighbourhood titles are too faint (worst over snow and sand).
  - World colours used as small text on the light page are too pale for 16 of 25 worlds (Sulani’s yellow the worst).
  - The lot circles can’t be reached with the keyboard.
  - After choosing a page in the sidebar with the keyboard, the next Tab goes back to the top of the sidebar.
  - The brass focus outline is faint on the light page.

## 1. Speed

### Code files

| File | Size | Compressed (only matters online) | Notes |
|---|---|---|---|
| `js/data.js` | 462 KB | 91 KB | Read in about 6 ms. Gallery details are 157 KB of it (descriptions 46, tags 25, packs 20), photo lists 62 KB, Stats rows 82 KB (a second copy of each lot’s plan fields). Nothing to do. |
| `js/app.js` | 79 KB | 24 KB | |
| `site.css` | 43 KB | 10 KB | Leftover rules no page uses: `.ledger`/`.meter`, `.ticks`/`.tick`, `.mosaic`, `.chip-link`, `.alias`, `.sublabel`, `.bcard`, `.bgroup`, the old `.gallery` grid, `.who-list` (adds to item 8 of `site-audit-16-oct.md`). Harmless. |
| `js/icons.js` | 8 KB | 2 KB | |

The scripts sit at the end of the page, so they don’t hold anything up. Page ready in about 135 ms from the preview server; from the shortcut (`file://`) everything but the fonts comes straight off the disk.

### What holds up the first paint

- **Google Fonts** (`index.html` line 22). The browser waits for that stylesheet before showing anything (59 ms in the test, online). Offline it fails quickly and the page shows in Palatino and Segoe UI. On slow or captive Wi-Fi it can keep the window blank for several seconds. Then the text visibly jumps when the real fonts arrive (`display=swap`).
- Fix: keep the two fonts in `site/` (Instrument Serif and Manrope, both OFL). This was already suggested in `research/going-online.md`. It needs two font files downloaded (her OK).

### How long each page takes to draw (script + layout, 1280×800)

| Page | Usual | Slowest |
|---|---|---|
| Home | 7 ms | |
| World | 12 ms | 20 ms (Willow Creek) |
| Neighbourhood | 7 ms | 16 ms (Bedrock Strait) |
| Lot | 6 ms | 13 ms (Bargain Bend) |
| Household / world households | 5 ms | 11 ms |
| A world’s Stats | 28 ms | 38 ms (Ravenwood) |
| **Stats (all lots)** | **160–330 ms** | about 8,000 elements |

- **Stats is the slowest page by far.** Every key press in its search box, every sort and every world click redraws the whole lot table: about 0.3 s each, and up to 1 s when they come quickly one after another. The table layout itself is the cost; switching off the CSS made no difference.
- Fix, only if typing there ever feels sticky: wait about 150 ms after the last key before redrawing, or draw the table once and just hide the rows that don’t match.
- Sidebar search: 36 ms for the first letter (it builds its list once), then 15 ms. Fine.

### Pictures per page, and lazy loading

How lazy loading works (`app.js` lines 634–637): world tiles on the home page and lot card pictures carry `data-lazy`. An IntersectionObserver sets the picture once the card is within 400px of the screen. Carousel slides after the first use the browser’s own `loading="lazy"`. Everything else loads straight away.

- **Home:** 30 world pictures (map thumbnails, 1.75 MB in all). 9 load at first, the rest as she scrolls.
- **World page:** the full map (0.4–1.3 MB; every neighbourhood card reuses the same file) plus one circle picture per lot that has one. That’s up to 18 (Oasis Springs), all at once, as the circles aren’t lazy. 0.8–1.9 MB a page (Britechester the heaviest).
- **Neighbourhood page:** the full map plus the lot cards, which are lazy (Olde Platz: 5 at first, 2 later). Heaviest about 1.5 MB (Britechester’s three). Apartment-building cards and rental unit circles aren’t lazy.
- **Lot page:** the banner is the first picture at full size, the same file as the first slide, so it loads once. The browser loads the first three slides; the rest come as she moves through them. Every thumbnail in the strip loads at once (38 on Von-Windenburg Castle, about 1.5 MB), and so do the “Also in” pictures. Typical lot page about 0.1 MB. Heaviest is Von-Windenburg Castle: about 2 MB up front, plus 9 MB more if she clicks through all 38 slides.
- **Household pages:** their home cards are lazy. The world households list has no pictures besides the banner. **Stats:** no pictures.

### Picture sizes against the size they’re shown at

| Picture | Stored | Shown at (page px; her screen needs twice that) | Verdict |
|---|---|---|---|
| World map, `maps/<world>.jpg` | 3075×2163, 0.4–1.3 MB (San Myshuno 1800 wide) | World banner 985 wide; neighbourhood cards zoomed into a 284-wide card; neighbourhood banners zoomed up to 3× | Right for banners and cards. On 15 of 82 neighbourhood banners the map is stretched more than 1.5× on her screen (Myshuno Meadows 2.4×; Acquisition Butte, Desert Bloom Park, Mirage Park, Galloping Gulch 1.9×). The code’s “stays sharp” limit counts page pixels, not screen pixels. |
| Map thumbnail, `.thumb.jpg` | 640×450, about 60 KB | Home tiles 284×178 | Right. |
| Screenshot, full | 1920×1080 (some 2000×1250 or 1600×900), typically 232 KB, at most 559 KB | Lot banner 985×368, carousel 465 wide, full screen | Right. |
| Screenshot thumbnail | 720×405, about 41 KB | Lot cards 284×213 (right), **circles 48** and **strip 84** wide | About 7× bigger than needed for circles, 4× for the strip. Fine on her PC; only worth smaller copies online. |
| Gallery picture, `gallery/<world>/<lot>.jpg` | 610×410 (12 at 744×410), about 57 KB, used as both full and thumbnail | Lot cards (right), carousel 465 wide (1.5× stretched on her screen), **lot banner 985 wide (about 3× stretched)** | Soft on lot banners and in the carousel. It’s what the Gallery gives, so there’s nothing bigger to fetch. |

Not used by any page: the five not-owned worlds’ full maps (3.7 MB, kept for when she owns them) and `gallery/windenburg/von-windenburg-estate.jpg` (the lot has screenshots instead). `site/` is 102 MB in all; the full-size screenshots are 53.5 MB of it.

## 2. Accessibility

Rules of thumb used (WCAG): text needs **4.5:1** against its background; big text (24px, or 19px bold) and focus outlines or icons need **3:1**.

### Colour contrast: sidebar, brass and the light page

| What | Ratio | |
|---|---|---|
| Sidebar world names, current row, hover | 9.8–14:1 | fine |
| Sidebar labels, neighbourhood and lot links, tagline, search placeholder | 5.8–7.2:1 | fine |
| “Jemma’s *Sim World*” brass in the sidebar / home banner | 6.4:1 / 5.1:1 | fine |
| **Not owned worlds in the sidebar** (faded twice: 45% text inside a 55% group) | **2.1:1** | Deliberately greyed and they don’t open, so the rules don’t strictly ask. Still hard to read. |
| Grey text on the light page | 5.1–5.8:1 | fine |
| **Brass text on white:** “unsure” tag on household cards; “X household” under a Sim’s relationships | **2.4:1** | too pale (12–13px) |
| **Brass focus outline on the light page** | **2.2:1** | Visible but faint (needs 3:1). Fine on the sidebar and in dark mode (7.6:1). |
| Ink on the brass “New” pill | 6.9:1 | fine |
| Stats “n/a” | 2.5:1 | deliberately faint |
| Stats rows of not-owned worlds (half see-through) | 2.1–3.3:1 | deliberately faint |

A darker brass for text and outlines on light backgrounds, e.g. `#7A5C18` (5.5:1 on the page, 6.2:1 on white), would fix the brass rows.

### World colours on the light page

The world colour is used as small text in three places: the label above “Neighbourhoods” and “The lots” (11px capitals), the “Open the X household” link on lot pages, and the “Family” tag on connected-household cards.

- **16 of 25 worlds are under 4.5:1:** Sulani 1.7; Oasis Springs, Newcrest 2.8; Del Sol Valley, Ondarion 2.9; Mt. Komorebi 3.0; StrangerVille, Henford-on-Bagley 3.4; Tomarang 3.7; Britechester 3.8; Gibbi Point 3.9; San Sequoia, Nordhaven 4.2; Evergreen Harbor 4.3; Copperdale, Selvadorada 4.4.
- Fix: use a darker mix of the world colour for text only (the Gallery tags already do this). `color-mix(in srgb, var(--h) 55%, var(--ink))` passes for every world. The colour itself stays as it is everywhere else.
- **White initials on the world colour** (household and Sim circles): only **Sulani** fails (1.9:1). The code already has `textOn()` for exactly this (the Gallery button uses it); the initials just don’t use it yet.
- In dark mode (only if Windows is set to dark; it wasn’t in the preview), 10 worlds’ colours are too dark as text instead (Brindleton Bay 2.6, San Myshuno 2.7, Windenburg 2.8, Chestnut Ridge 3.0 …).

### White text over the maps (banners)

Measured by redrawing each banner (map, position and fade exactly as the site does) and reading the colours behind the letters. “Too faint” means at least a tenth of the background behind the letters is below the rule. Pictures of the worst checked by eye: Mt. Komorebi, Yukimatsu, Oasis Springs.

| Text | World banners (25) | Neighbourhood banners (82) | Worst |
|---|---|---|---|
| Small line above the title (pack name, “Neighbourhood · World”) | too faint on **all 25** | too faint on **80** | Mt. Komorebi, Glimmerbrook, Mirage Canyon, Mua Pel’am: about 1:1, invisible over snow and sand |
| Title, white part (big) | 4 of 12 with a white word | **31** | Yukimatsu 1.2, Senbamachi 1.5, Bedrock Strait 1.7, Conifer Station 1.7, Mt. Komorebi 1.3 |
| Title, brass part (big) | **24** | (no brass part) | Oasis Springs, Glimmerbrook, Britechester, San Sequoia about 1.1 |
| Description (18px) | 11 | 34 of 74 | Yukimatsu 1.5, Foxbury Institute 1.9, Oasis Springs 2.1, Britechester 2.2 |
| Figures (numbers) | fine | fine | |
| Figure labels (“neighbourhoods”, “lots”) | 4 | 7 | Britechester, Mt. Komorebi 3.2–3.4 |
| Neighbourhood buttons | fine | fine | |
| “Map by 20th Century Plumbob” | 14 | 18 | Senbamachi 2.4 |

- **World households banners (25):** the brass “households” is too faint on 23; the small line on 24.
- **Lot banners (168 with a picture):** titles are fine (all above 3.7, which is enough for big text). The world and neighbourhood buttons above the title are under 4.5 on 38 lots.
- The fade is light at the top (5%) and still only 25% at 40% of the way down, which is where the small line and the start of the title sit.
- Ways to fix, each changing the look a little:
  - a soft dark shadow behind the small line, the description and the brass word (cheapest, barely visible);
  - a darker fade in the top half;
  - putting the small line in a see-through dark pill like the map credit.

### Pale banners: Britechester and Mt. Komorebi

Their “deep” shades are light (`#6A5C4A`/`#817059` and `#5A6573`/`#8E9BAA`). On their plain banners (household pages, and lot pages with no picture):
- white text is 4.3:1 (Britechester) and **2.6:1** (Mt. Komorebi);
- the “Household” label is 3.8 and 3.5;
- the brass initial in the household circle is **2.0 and 1.2**, close to invisible (seen on the Akiyama page).

CLAUDE.md says the deep shades must match the neighbourhood cards, so this is hers to weigh.

### Keyboard

- **Works well:**
  - Every real link and button can be reached with Tab and shows the brass outline. Buttons that reset their styling have their own outline rule.
  - The full-screen viewer takes focus, keeps Tab inside, closes with Escape and gives focus back.
  - The carousel works with its arrows, the thumbnails and the left/right keys.
  - Sidebar search works with the arrow keys and Enter; Escape clears it.
- **Lot circles can’t be reached.** They’re `<i>` elements with a click handler, no `tabindex` and no role, inside the card’s link. That covers lot circles on neighbourhood cards, rental unit circles, and household names on lot cards (`<b>`).
  - Their names only show on mouse hover.
  - Their `aria-label` is ignored by screen readers, as `<i>` has no role.
  - Nothing is lost for most of them: each lot is also a card on its neighbourhood page, and each household is linked from its lot page.
  - The exception is the **12 apartment buildings (30 apartments)**: the building card isn’t a link, so by keyboard their apartments are only reachable through the sidebar list or search. Culpepper House, Jasmine Suites, Medina Studios, Hakim House, ZenView, 21 Chic Street, Alto and Landgraab Apartments (San Myshuno); Stonestreet and Pinecrest Apartments (Evergreen Harbor); Bright Cliff and Lakeview Apartments (Ondarion).
  - Making the circles reachable adds up to 30 Tab stops on a world page (San Myshuno).
- **Focus jumps after the sidebar.**
  - Tested: Enter on “Newcrest” in the sidebar opens the page, but the sidebar is redrawn, so the next Tab lands on “Home” at the top of the sidebar.
  - From a card in the page it’s fine: Tab carries on into the new page.
  - About 40 sidebar links come before the page content (41 on Bedrock Strait), and there’s no “skip to content” link.
  - Fix: after drawing a page, put focus back on the same sidebar link (or on the page title).
- The search box drops its outline on focus and only its thin border turns brass. Visible on the purple, just subtle.
- Folding a list in the sidebar (click the current item) isn’t announced to screen readers (no `aria-expanded`).

### Pictures and alt text

- Every `<img>` has alt text. Carousel and full-screen pictures read “Lot name: caption”. Strip thumbnails have empty alt inside labelled buttons, which is correct.
- Card pictures, maps and circles are CSS backgrounds inside links that already have text, which is fine.
- Plot drawings are labelled (“30 by 20 lot”), and icons are hidden from screen readers.
- The built/shared/Sims-made dots only have a mouse tooltip, so screen readers get nothing. The “Faded means not yet” key covers sighted use.

### Headings

All 623 pages checked: each has exactly one main heading and no skipped levels. Language is set to en-GB and the window title changes per page.

### Motion

- With Windows’ animation effects turned off, the site switches off all its transitions (`site.css` lines 416 and 456), so carousel slides jump instead of sliding. There’s no autoplay anywhere.
- Not covered: four smooth scrolls in `app.js` don’t check that setting:
  - back to top when clicking the page she’s on (line 142);
  - in-page jumps (191);
  - Sim links (469);
  - a Stats world click (612).
- Hover zooms on pictures and plans still happen, just instantly.

## 3. What to do, in order

**Obvious fix** (no look changes, or bugs)
1. Sulani’s white initials: use the existing `textOn()` for the household and Sim initial circles.
2. Keep keyboard focus on the sidebar link after choosing a page there (or move it to the page title).
3. Let the four smooth scrolls respect “reduce motion”.
4. Remove the leftover CSS rules (with audit item 8).

**Her call**
5. Banner text over light maps: a soft shadow behind the small line, the description and the brass word, or a darker fade at the top. This is the biggest readability gain.
6. World colours as small text: a darker mix for text only (keeps the colours elsewhere).
7. A darker brass for text and the focus outline on the light page (`#7A5C18`).
8. Britechester and Mt. Komorebi plain banners: deeper shades, or leave them matching the cards.
9. Keyboard access to the lot circles and apartment-building cards (adds Tab stops; at least the buildings).
10. Keep the two fonts in `site/` (needs the files downloaded): no blank window on slow Wi-Fi, no font jump, works fully offline.
11. Stats: wait a moment after typing before redrawing, only if it feels slow.
12. Not-owned worlds in the sidebar: a little less faded, if she finds them hard to read.
13. Neighbourhood banners zoom further than her 200% screen keeps sharp on 15 of 82; letting the code count screen pixels would zoom those out a little. Taste.

**Only if it goes online**
14. Small circle and strip thumbnails (about 200px, 6 KB instead of 41 KB) and lazy-load the circles and “Also in” pictures: up to 0.7 MB less per world page.
15. Leave the five not-owned world maps and the unused Von-Windenburg Estate Gallery picture out of the upload.
16. Screen-reader extras: names for the status dots, a “skip to content” link, `aria-sort` on Stats columns, `aria-expanded` on folding lists, a label on the full-screen viewer.
