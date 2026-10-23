# New-save glitches (researched 23 Oct 2026)

## At a glance

1. **"Content not installed" with everything owned** is a known, still-open EA bug. It has been reported since the Marketplace update (17 Mar 2026). It's usually only a wrong message, so place the lot and check it.
2. **Gallery hiding your own uploads** matches a filter bug that EA fixed in part on 28 Apr 2026. Players still report the pack filters misbehaving in Sept–Oct 2026. Toggling the filter off and on is the known workaround.
3. **Britechester crash:** I found no 2025–2026 report of a crash specific to Britechester. Older reports point to one bad lot, or to replacing certain Maxis lots, not to the world.
4. **Fixes to try, in order:** check My Collection, restart the game while online, clear the cache, Repair, then test without mods.
5. **The Community Space cheat still exists:** Shift-click the voting board and choose "Instant Enact Community Space Project". Guides list it up to 2023, and I found no report that it's broken.

Note: EA's forums block automatic reading, so dates for single forum posts are worked out from post order and the patches they mention. Treat them as approximate.

## 1. "Content not installed" when placing her own lots

**What's known**
- The main EA bug report is "[GALLERY] 'Content not installed' warning with all content owned". Many similar threads have been merged into it. It is open, with no EA fix. It covers lots and households from the Gallery and from your own Library.
- Many players say it began with the update of 17 Mar 2026. That update launched the Marketplace, sold kits only for Moola, and moved Pack Select to Marketplace > My Collection.
- Most players say nothing goes missing and only the message is wrong. A few say the whole lot failed to appear, or a household wouldn't load.
- One tester tied the warning to lots that use Growing Together, Horse Ranch or For Rent. Another traced it to a hidden stray object, or to an item from a live event. **Unconfirmed.**
- The 16 Apr 2026 update fixed packs showing as switched off or "Not Owned" after installing. This was the same kind of check, but the Gallery warning carried on after it.
- The 22 Sep 2026 notes (the latest I found) do not fix it.

**Likely causes in her case (unconfirmed)**
- The game's ownership check goes wrong for newer content: kits, Maker Packs, and live-event or bonus items.
- A pack or kit is switched off in My Collection (Pack Select now lives there).

**Fixes to try, in order**
1. Open Marketplace > My Collection. Check that every pack and kit is on, then restart the game.
2. Restart the game while online and signed in to the EA app. This lets it refresh what you own. One player linked the bug to offline mode (unconfirmed).
3. Delete `localthumbcache.package` from Documents\Electronic Arts\The Sims 4, then restart.
4. In the EA app, run The Sims 4 > Manage > Repair. Several players say this didn't help.
5. If one lot keeps warning: place it, look for hidden or stray objects (`bb.moveobjects`, then the Build/Buy search), and save it to the Library again.
6. Last resort: move the whole Sims 4 user folder aside, Repair, then copy Saves and Tray back. One player says this cleared it. **Unconfirmed.**

**Sources**
- EA Forums, main bug report (open; comments mostly from Mar–Apr 2026, some later): https://forums.ea.com/idea/the-sims-4-bug-reports-en/gallery-content-not-installed-warning-with-all-content-owned/12640662
- Thread merged into it, "Can't place lots from my own library", where the whole lot failed to appear (about Apr 2026): https://forums.ea.com/idea/the-sims-4-bug-reports-en/cant-place-lots-from-my-own-library/13307901
- Thread "Content Not Installed message when placing lots/households from my Gallery" (about Apr 2026): https://forums.ea.com/idea/the-sims-4-bug-reports-en/content-not-installed-message-when-placing-lotshouseholds-from-my-gallery/13309896
- Marketplace launch, 17 Mar 2026 (TheSimsTree, 18 Mar 2026): https://thesimstree.com/en/news-about-the-sims/tst-news/the-sims-4-marketplace-launches-on-pc-and-mac-moola,-free-kit,-and-over-60-bug-fixes.html
- EA update notes, 16 Apr 2026 (pack status fixes): https://www.ea.com/games/the-sims/the-sims-4/news/update-4-16-2026
- EA update notes, 22 Sep 2026 (no fix): https://www.ea.com/games/the-sims/the-sims-4/news/update-9-22-2026

## 2. Gallery hiding her own uploads

**What's known**
- On 28 Apr 2026, EA fixed a Gallery filter bug: wrong results came back "in some situations". EA said no uploads had been removed.
- A bug report about her own uploads disappearing, or showing for friends but not for her, is marked Fixed. This was around the same time.
- Players still report the "only show packs I own" filter acting oddly in Sept–Oct 2026. It is said to be "inclusive", not exclusive. A separate thread says "Using only these packs" returns no results.
- The Gallery server failed to load content after frequent searches. EA fixed this on its server in August 2026.
- EA's help page says to toggle the custom content box off and on when items seem to be missing. This is the same trick that worked for her.

**Likely cause (unconfirmed):** the pack-owned filter checks each upload against what you own. That check is the same one that gives the false "not installed" warnings (problem 1). So her own newer uploads get filtered out by mistake.

**Fixes to try, in order**
1. Turn off every pack and custom content filter when searching her own profile. Toggling the filter off and on, as she did, also works.
2. Restart the game while online, then search again.
3. For a full list, use her My Library tab or the web Gallery, not a filtered search.

**Hashtag search**
- The Gallery has separate searches for Item Name, Hashtag and EA Account ID.
- Hashtags are the #words in an upload's description. That is how uploading works, but I found no EA page that says it in so many words.
- EA's SimSearch post (26 May 2026) says the new Cross-Language search (Beta, in-game only) adds description text. This suggests the older searches don't read the full description.
- **Unconfirmed:** whether a #tag in the title counts as a hashtag. Safest to keep tags in the description.

**Sources**
- EA update notes, "Gallery Fixes and Console Updates", 28 Apr 2026: https://www.ea.com/games/the-sims/the-sims-4/news/update-4-28-2026
- EA Forums, uploads disappearing and showing up inconsistently (marked Fixed, about Apr 2026): https://forums.ea.com/idea/the-sims-4-bug-reports-en/gallery-uploaded-items-disappearing-and-showing-up-inconsistently/13337199
- EA Forums, "Only show packs owned" ignored (after the 22 Sep 2026 update): https://forums.ea.com/discussions/the-sims-4-technical-issues-pc-en/%E2%80%9Conly-show-packs-owned%E2%80%9D-%E2%80%94-ignored-/13774705
- EA Forums, Gallery filter "show owned" not working correctly (2026): https://forums.ea.com/discussions/the-sims-4-gameplay-en/gallery-filter-show-owned-is-not-working-correctly/13510004
- EA Forums, "Using only these" pack filter gives no results (2026): https://forums.ea.com/idea/the-sims-4-bug-reports-en/gallery-using-only-these-pack-filter-has-no-results-in-some-cases/13266006
- EA Help, The Sims 4 Gallery (toggle custom content off and on; undated): https://help.ea.com/en/help/the-sims/the-sims-4/the-sims-4-gallery/
- EA news, SimSearch, 26 May 2026: https://www.ea.com/games/the-sims/the-sims-4/news/simsearch

## 3. Crash while placing a lot in Britechester

**What's known**
- I found no 2025–2026 report of a crash specific to Britechester. The 16 Apr and 22 Sep 2026 notes contain no Britechester or University Housing placement fix.
- Older reports (about 2020–2021): one player's crash came from replacing Darby's Den with a Gallery build. Some players couldn't use the dorm lots. Both were put down to the lot, not the world.
- In general, 2025–2026 threads report Gallery or Library placement crashing or loading forever on some lots. Players blame certain builds, often ones made after For Rent. EA has not confirmed a cause.
- 22 Sep 2026 fixed Wedding Venues placing as Residential, and an error with pools inside contour walls. So lot type and complex builds are areas EA is still fixing.

**Fixes to try, in order**
1. Save first. Then try the same lot again, or place it on a different Britechester plot. If only one lot crashes, the build is the problem.
2. Place it from inside the lot (Build mode > Gallery or Library) rather than from Manage Worlds. Some players say this works when placing from the map crashes. EA fixed a crash when going from Build mode to Manage Worlds on 22 Sep 2026.
3. For a University Housing plot, set the lot type first if the plot needs it, then place the build onto that plot.
4. Delete `localthumbcache.package`, then restart.
5. Move the Mods folder out and test again.
6. Run Repair in the EA app.
7. Test the lot in a new, empty save to see whether the build or the save is at fault.
8. Library vs Gallery: no source says one is safer than the other.

**Sources**
- EA Forums, placing lots from the Gallery crashes or loads forever (about May 2026): https://forums.ea.com/idea/the-sims-4-bug-reports-en/placing-lots-from-the-gallery-crashes-my-game-or-leaves-it-endlessly-loading/13410382
- EA Forums, the older report of the same thing (with moderator tips: cache, Repair, new save): https://forums.ea.com/idea/the-sims-4-bug-reports-en/placing-lots-from-the-gallery-freezes-gameendless-loading/11935975
- EA Forums, game crashes when placing a lot on the world map: https://forums.ea.com/idea/the-sims-4-bug-reports-en/game-crashes-when-placing-lot-in-world-map/13189503
- EA Answers HQ, "Lot keeps crashing – Discover University" (Darby's Den; about 2020): https://answers.ea.com/t5/Technical-Issues-PC/Lot-keeps-crashing-Discovery-University/td-p/8429334
- EA update notes, 22 Sep 2026: https://www.ea.com/games/the-sims/the-sims-4/news/update-9-22-2026

## Extra: switching a Community Space's version

- Turn on `testingcheats true`, Shift-click the Public Voting Board and choose "Instant Enact Community Space Project (Cheat)". Then pick Community Garden, Marketplace, Maker Space or the default.
- Shift-clicking the mailbox or the voting board also gives you Influence Points.
- Guides from 2020 and 2023 describe it. I found no report that it's broken, and no newer source that has tested it. **Unconfirmed for 2026.**
- Without cheats, the version changes when the neighbourhood votes at the weekend.

**Sources**
- SimsCommunity, Eco Lifestyle cheats (21 Jan 2023): https://simscommunity.info/2023/01/21/sims-4-eco-lifestyle-cheats/
- Twinfinite, Eco Lifestyle cheats and Neighbourhood Action Plans (2020): https://twinfinite.net/guides/sims-4-eco-lifestyle-cheats/

## Checked on her PC (23 Oct, night)

- **Every pack her uploads need is installed.** All 190 Gallery uploads on her owned worlds' lots were looked up on the Gallery (their pack codes, e.g. SP06 for Romantic Garden Stuff) and compared with the pack folders in her game: none needs a pack she doesn't have.
- **The lots that warned placed in full.** Courtyard Lane Playground, Nookstone, Optimist’s Outlook and Asphalt Abodes have every object of her Building #2 copies (Asphalt Abodes has 78 more, a newer upload); Tail’s End matched object for object. So the warning she saw was the false one described above.
- **Mods:** her Mods folder has LittleMsSam's Dress Code Lot Trait, which shows up as an unknown lot trait on Strike Out!. Two Library copies of Palomino Junction and one of Nookstone are marked as containing mods or custom content; the Gallery copies aren't.
