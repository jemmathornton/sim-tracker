# Calendar and admin page (23 Oct, report only)

Nothing in `site/`, `data/`, `tools/` or TODO.md was changed. Prototypes are in `for-jemma/prototypes/calendar-admin/`: `calendar.html` and `admin.html`. Both open straight from the folder, or at http://localhost:8002/for-jemma/prototypes/calendar-admin/calendar.html (and `admin.html`). They run the app’s own code and data. A switch at the bottom right flips between “Now” and the options.

## At a glance

- **Calendar, suggested: A.** Move it up the sidebar under Home. Give it a map banner like the world pages: a strip of the worlds with something on. Pick a world and the banner becomes that world’s map and colours. Every event opens its lot or neighbourhood.
- **World, neighbourhood and lot pages link to it:** a “What’s on” line under each world’s weather, festival names on neighbourhood pages, and a “Lot nights” row on lounge and thrift store pages.
- **B (a calendar under each world)** looks good where a lot is on. But 11 of the 25 owned worlds have no festivals or regular events, so their calendars would show only holidays.
- **Admin replaces Stats** and holds everything kept off the public pages: progress, the weekly refresh, checks, unlinked uploads, what’s waiting in game, and the Sims notes. Nothing of Stats stays public.
- **Private online, suggested:** keep Admin in its own folder next to `site/`, never uploaded. On your PC nothing changes: it’s all private already.

## 1. The calendar

### How it is now

- In the sidebar it sits at the very bottom, with Stats, under the not-owned worlds. Home doesn’t mention it.
- Its banner is the small plain one (“Across the save”, purple and brass), like Stats and Page not found. Worlds, neighbourhoods and lots all have map or photo banners.
- The month is good: world-coloured events, four weeks, seasons. Places in the side bands link to their lots and neighbourhoods. The events in the month only show their details when you hover; they don’t link anywhere.
- World pages don’t mention festivals. Neighbourhood cards and pages list them as plain text. Lot pages don’t mention lot nights.

### Where things stand (from the app’s data)

- 14 of the 25 owned worlds have something on: San Myshuno, Brindleton Bay, Del Sol Valley, Sulani, Britechester, Mt. Komorebi, Henford-on-Bagley, Copperdale, Chestnut Ridge, Tomarang, Ravenwood, Nordhaven, Gibbi Point, Ondarion.
- 11 have only the save’s holidays: Willow Creek, Oasis Springs, Newcrest, Granite Falls, Magnolia Promenade, Windenburg, Selvadorada, StrangerVille, Glimmerbrook, Evergreen Harbor, San Sequoia.
- Britechester’s 17 and Nordhaven’s 14 are mostly uni events and meetups; festivals are only in San Myshuno, Mt. Komorebi, Henford-on-Bagley, Ravenwood and Gibbi Point.

### Option A: one calendar, in the worlds’ colours (prototyped, suggested)

- **Sidebar:** Calendar moves up under Home, before Worlds. It’s about life in the worlds, so it sits with them rather than with Stats.
- **Banner:** a full map banner. With all worlds showing, it’s a strip of the maps of the worlds with something on, each with its colour along the top; one widens on hover and opens that world’s calendar. With one world picked, the banner is that world’s map and deep colour, exactly like its world page, with “All worlds” to go back.
- **Seasons** sit in the banner, where a world page lists its neighbourhoods. Figures: holidays, festivals and so on this season.
- **Links:** every event in the month opens its lot (lot nights) or neighbourhood (festivals). World chips become links (`#calendar-sulani`), so a world’s calendar has its own address.
- **From other pages:** world pages get a “What’s on” line under the weather (“What’s on: Spice Festival, Romance Festival… San Myshuno’s calendar →”); worlds with nothing say so. Neighbourhood pages link each festival name. Lot pages with lot nights get a row (“Lot nights: Fashion show, Monday and Friday 3–8 pm · calendar”).
- Pros: one page to keep, the worlds with little on don’t get near-empty pages, and it looks like the rest of the rebuild.
- Cons: the strip banner is busier than one map (10 to 14 maps side by side). Picking a world on the Calendar page shows that world’s map, but you stay on the Calendar in the sidebar, not under the world.

### Option B: a calendar for each world (prototyped)

- Everything in A, plus a “Calendar” under each world in the sidebar, after Households (like a world’s own page). It has the world’s map banner and shows every kind of event held there, uni and school events included.
- The whole-save calendar stays under Home for an overview.
- Pros: a world’s calendar is found where the world is; it reads as part of the world.
- Cons: 11 worlds would have a Calendar showing only holidays (could be left out for those, but then the sidebar differs from world to world). Two ways to reach the same events.

### Option C: no calendar page, a box on each world page (not prototyped)

- The 17 Oct option C: each world page lists its own week; holidays on the home page. Turned down on 19 Oct in favour of a page, so only mentioned for completeness.

### Smaller things, whichever option

- The “Progress, lot by lot” card at the bottom of world pages goes (it points at Stats). The “What’s on” line takes its place higher up.
- The sidebar search’s “Search every lot on the Stats page” and the same link on Page not found would need to go too (public), or point at Admin (on her PC).
- Phone: the strip banner hides world names (no hover on phones); the rest uses the existing calendar phone layout.

## 2. The admin page

### What it holds (prototype `admin.html`)

Tabs (or one long page with jump links; both in the switch):

| Tab | What’s in it | Where it comes from |
|---|---|---|
| At a glance | Cards: weekly Gallery refresh (last good run, a warning if Sunday’s run was missed or stopped), New since you looked, built and shared, checks, waiting in game, unlinked uploads, shared lots with no screenshots, Sims to double-check | All the tabs below |
| Progress | The old Stats page as it is: By world (with percentages) and Every lot, with its filters | `data.js` (`stats`) |
| Gallery | The last 8 refresh runs (done or stopped, what was linked); New since you looked; On the Gallery (weekly totals, biggest gains, most downloaded and most loved, newest comments, as on Stats now); the 33 uploads not on a lot, each with its reason; hashtag slips folded away | `logs/gallery-refresh.log`, `data/gallery/unlinked.json`, research/gallery-findability.md |
| Checks | The “Automatic Checks panel” idea (TODO §8): shared with no upload, uploaded but not ticked shared, shared but not built, no type, no size, plan size or lot type differs from the Gallery’s, same name twice in a world, in the plan with no page. Today: **2 to look at**, both Glimmer & Books (on the Gallery but not ticked Shared; a Library on the Gallery, a Backroom in the plan). Her British lot-type names and EA’s “Missing sims translation” aren’t counted | Worked out from the app’s data |
| Build next | Built but not shared (27); the suggested order of 15 from research/build-priorities.md, with a pill once one is built or shared; shared lots with no screenshots of hers, by world (146; TODO.md’s 137 was counted on 16 Oct); empty homes (39) and free rental units (29) | App data; research/build-priorities.md |
| In game | Her in-game checklist, unticked items only (17); TODO items that need the game (9); everything on TODO.md waiting for her, folded (70) | `for-jemma/in-game-checklist.md`, TODO.md |
| Sims | By world: households, Sims made in game (with percentages), households with no Sims, her own screenshot or a Library picture; the 86 Sims filled from her saves or Library, by household, with which save, to double-check | App data (`from` on each Sim) |

- The badge on each tab is its count. The banner says “Only you”, with a lock.
- In the sidebar, Stats becomes **Admin** (lock icon), still last. Calendar moves up (option A).
- Read only. It doesn’t edit anything: she still tells Claude, as now.
- Percentages stay allowed here (the Stats rule moves with it).

### Ideas from earlier that fit here (in the prototype or easy to add)

- Weekly refresh status (the home-page notice she turned down on 22 Oct).
- Sims made and “from save, to check” markers (taken off household pages on 19 Oct).
- Hashtag slips and missing world tags (she’ll check herself when re-uploading; here as a quiet folded list, no to-do).
- Not yet in the prototype, could be added: a dated “What’s new” list made from git (TODO §8, no preference yet); “last played” per household; deleted Gallery uploads (the refresh doesn’t mark them yet); the 88 shared lots with fewer than 3 lot traits; the reminder to rerun the Gallery deep dive in mid-November.

### What stays public

- Suggested: **nothing of Stats.** Lot pages already show favourites and downloads, so the public site loses no Gallery numbers that matter.
- Open question: neighbourhood cards say “x of y lots built” and “x of y with Sims made”, and lot pages have a Progress row (built, shared, Sims made). They’re allowed by the no-admin-notes rule, but they’re admin-ish. They could stay, or move to Admin.
- Maybe public: “Most loved” and “Most downloaded” could become a small “Favourites on the Gallery” row on the home page. Only if she wants it.

## 3. “Only visible by me”

- **Today:** the app is files on her PC. Nobody else can see any of it, Admin included. Nothing extra is needed.
- **Why hiding a link isn’t enough online:** anything in `site/` can be opened by anyone who can open the site, `data.js` included. A hidden link or a password typed into the page keeps nobody out.

| Option | How | Pros | Cons |
|---|---|---|---|
| **1. Admin never uploaded (suggested)** | Admin lives in its own folder next to `site/` (say `admin/`), like these prototypes: it runs the app’s code from `site/` and adds its own `admin-data.js`, made by the build. The sidebar’s Admin link only shows when the site is opened from her PC. Admin-only data (refresh log, checks, to-dos, Sims sources, and the Stats rows and Gallery history now in `data.js`) moves out of `data.js` into `admin-data.js` | Free, nothing to set up; private by design, because only `site/` is ever uploaded (already the rule in CLAUDE.md); public `data.js` gets smaller | Admin only on her PC (where the tools and her data live anyway) |
| 2. Cloudflare Access on `/admin` | Upload Admin too, and add an Access rule on the admin path with her email only (the rest of the site could have its own rule for friends, or none) | Admin on her phone or other devices | Must still keep admin data out of the public `data.js`; needs Cloudflare Access set up (free, but an account and, it seems, maybe a card); one more thing to get right |
| 3. Two builds | A public build (no Admin, no other players’ comments) and a private one with everything, behind Access | Clean split | Two uploads every week; more to maintain |
| 4. Hidden link or page password | — | — | Not private: `data.js` can be read by anyone. Not recommended |

- **Suggested:** option 1 now. It also leaves the door open for option 2 later: the admin folder is already separate, so it could be uploaded behind Access if she ever wants Admin on her phone.
- Same rule as research/going-online.md: a public site would also need other players’ comments and usernames left out of `data.js`.

## Questions for Jemma

1. Calendar: A (one calendar, under Home, with the map strip) or B (also one under each world)?
2. Admin: tabs or one long page?
3. The “lots built” and “with Sims made” lines on neighbourhood cards, and the Progress row on lot pages: keep them public, or move them to Admin?
4. Admin online one day: only on your PC (suggested), or behind a sign-in so you can see it on your phone?

## How the prototypes work (for Claude)

- `proto-shell.js` runs `site/js/app.js` unchanged and takes over some pages and the sidebar; `<base href>` points at `site/` so pictures load, and hash links are kept on the prototype page.
- `proto-calendar.js` copies `calendarPage()` with the new banner and links; `proto-admin.js` builds Admin from the app’s own `statsPage()`, `galleryOverTime()` and data.
- `make_admin_data.py` (read only) makes `admin-data.js` from the refresh log, `unlinked.json`, the in-game checklist, TODO.md, research/gallery-findability.md and research/build-priorities.md. Rerun it to refresh the prototype: `python -X utf8 for-jemma/prototypes/calendar-admin/make_admin_data.py`.
- Three Lucide icons were added for the prototype only (lock, refresh-cw, list-checks, in `proto-icons.js`); they’d go into `site/js/icons.js` if chosen.
- If chosen, port the prototype as it is (memory: port prototypes exactly).
