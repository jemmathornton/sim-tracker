# Site audit, 16 Oct (overnight, read only)

Problems only. Nothing was changed. Each item says where, what, a suggested fix, and whether it's an **obvious bug** (can be fixed straight away) or **needs her decision**.

## What checked out fine

- `site/js/data.js` is exactly what `tools/build.py` makes from `data/` today (rebuilt in memory and compared: no differences). No pictures missing. The `?v=` fingerprints in `index.html` match the current code files.
- `tools/check_pages.js` at 1280px: 648 pages, no problems.
- Her spreadsheet matches the app (`tools/import_spreadsheet.py` report: 0 edits, 0 clashes; only the two known Residents cells, Spring Steppes and 3 Cobblebottom Street).
- `tools/lot_traits.py` report: all 168 shared lots found, nothing to write. Every unshared lot is free of lot traits.
- Every Gallery upload is on a lot or in `unlinked.json` (the 6 household uploads are skipped on purpose). Every Builds folder is in `screenshots.py`; picture counts match (the two "Gallery" pictures are skipped on purpose).
- The 16 Oct decisions in TODO §5, §6c and the not-owned worlds are all in the data (Tartosa, Ondarion, Innisgreen, Ciudad Enamorada, Forgotten Hollow, Gibbi Point, Brindleton Bay, Chestnut Ridge, Ravenwood, Del Sol Valley, Sulani, Willow Creek and the rest).

## 1. Site and data

1. **Manzanita Terrace shows no units.** `data/worlds/san-sequoia.json`: type is plain "Residential Rental", with no "(3)". The site only draws unit circles, the "· 3 units" badge, the units table and "(landlord)" when the type has a count. So the card shows "Robles" with no units, although 3 units were confirmed on 14 Oct (TODO §2) and her save's 3 units are already stored on the lot. Fix: type "Residential Rental (3)", rebuild (and the same cell in her spreadsheet, with her OK). **Obvious bug.**
2. **Rippling Flats: card and lot page disagree.** The plan says "(Current uni sims)". The lot page shows "Household: Current uni sims", but the card says "Free, Free, 0 let, 2 free", because notes in brackets aren't shown on rental cards. Fix: show the note under the card when no household is named (e.g. "Current uni sims" in place of "0 let"). Or she names a household. **Obvious bug** (the wording is her call).
3. **Taka Soi 15's units come out of order:** 09 first, then 08 (the save's own order). The circles read 1, 2 but are labelled "Unit 09", "Unit 08". Fix: sort units by name when every name is a number, or keep the game's order if she prefers. **Needs her decision** (small).
4. **Glimmer & Books is "shared" but "not built".** On 16 Oct it was made a Backroom and marked not built until she re-uploads it, but shared is still ticked. The lot page shows "Built: not yet" next to "Shared ✓", and it still counts as shared on Stats. Fix: either untick shared until the new upload, or keep both and accept it looks odd. **Needs her decision.**
5. **"Jemma's Sim World" has a straight apostrophe** on the home page heading (`site/js/app.js`), in the sidebar and top bar, and in the window title (`site/index.html`). The rule is curly apostrophes in displayed text. Fix: use ’ in all four places. **Obvious bug.**
6. **Calle del Ensueño** (Ciudad Enamorada, now a Community Market): "Sims made" is still `false` (left over from when it was a home); other venues have "N/A", so Stats shows "–" for it, not "n/a". Fix: `simsMade: "N/A"` (and the spreadsheet cell, with her OK). **Obvious bug.**
7. **Stats pages are 52px too wide in a narrower window.** At 1280px they fit. At 1024px (the size the preview opened at) the main Stats page and every world's Stats page scroll sideways. Phone layout is parked, so only worth fixing if she uses a smaller window. **Needs her decision.**
8. **Leftover code from the rental layout trials** (`site/js/app.js`, `site/site.css`): `buildingCard()` (the old apartment-building card with its own units list) is never used; the CSS rules for `.bcard`, `.bcard .units`, `.bgroup-head` go with it; there's a stray comment "rental layout trial (16 Oct)", and in app.js one comment says "(trial: Culpepper House only)" just above the comment that replaced it, after another comment that belongs further down. Nothing shows wrong on screen. Fix: remove them. **Obvious bug** (tidy-up).
9. **Rentals: "let" on the card, "lived in" on the lot page.** Spring Steppes' card says "1 let, 1 free" (the landlord's own unit isn't counted); its lot page says "3: 2 lived in, 1 free". Both are right, but it reads like two different counts. Apartment building cards say "lived in". Fix: pick one wording. **Needs her decision.**
10. **Rio Verde, Fern Park Flats, Midtown Meadows, Inner Circle, Tail's End, Upland Trailer Park:** the plan's household (often a group label such as "Elders" or "BFF") fills unit 1 and the other units show "Free". For Rio Verde that reads "1 let, 5 free" for a retirement home full of elders. This is what the code is meant to do until she decides households unit by unit (TODO §2), so just a reminder. **Needs her decision** (already on TODO).
11. **`for-jemma/rental-layouts.html`** (14–15 Oct mock-ups) is still there although layout 4 was chosen and the trials are gone. Fix: delete or move it to `old-chat-notes/`-style reference. **Needs her decision** (it's her folder of things to look at).

## 2. TODO.md

Done, but the text still says otherwise:

12. **Line 3** says "Ticked items were left out", but the list has many ticked items. Fix: "Ticked items are kept for the record." **Obvious bug.**
13. **§6c Moonwood Mill (line 171)** ends "Spreadsheet still to update". The spreadsheet was brought up to date at 20:32 (commit a8f3652) and the import now finds no differences. Fix: drop the phrase. **Obvious bug.**
14. **§2 rentals (line 76)**, "[Claude] Once decided: show each rental's units on its page and neighbourhood card…": most of it is done (layout 4: circles, household list, units table, "Free" per unit). Only bedrooms and bathrooms per unit are left. Fix: reword to just that part. **Obvious bug.**
15. **§5 Mystic Crossroads:** the long Community-mix paragraph (line 104) still ends "Mystic Crossroads stays to be decided (something commercial)". It was settled on 16 Oct (tarot and curiosities shop). Fix: update the end of that paragraph. **Obvious bug.**
16. **§6c Magnolia Promenade (line 181)** is unticked, but she chose on 16 Oct (Small Business for a rich family). Only the family is left to pick. Fix: tick it and keep "family to pick" as its own line, or leave it open. **Needs her decision.**
17. **§5 Moonwood Mill (line 100)** is unticked; everything is settled except Library or Backroom, which she'll decide when she owns the pack. Same choice as 16. **Needs her decision.**

Out of date or out of sync:

18. **§2 table (lines 37–60):** Upland Trailer Park is in it twice (lines 45 and 58); Tail's End says "Empty" but the Lynxes rent a unit there since 16 Oct; Manzanita Terrace says "? (3 per her Gallery text)" but line 73 says 3 was confirmed. Fix: one Upland row, Tail's End "Lynx (renting a unit)", Manzanita 3. **Obvious bug.**
19. **§2 intro (line 35):** "4 are owned by a family". Now 7: Spring Steppes (Elderberry), 3 Cobblebottom Street (Moody & McMillan), Manzanita Terrace (Robles), Sequoia Cottage (Lovejoy), Taka Soi 15 (Cahyaputri), Isda Riverfront (Rochana/Caberry), Casa Do Corsário (Aloisio Romualdo). **Obvious bug.**
20. **§2 line 70:** "landlords for the 17 rentals without one". With 7 of the 20 rentals owned by a family, it's 13. **Obvious bug.**
21. **Backroom counts disagree:** §8 (line 210) says "Backrooms now 4", §5 (line 99) "now 5", §6c (line 178) "now 6". In the data: 5 in owned worlds (StrangerVille Information Center, BridgeCreek Drive, The Old Mill, Hardcover, Glimmer & Books) plus Garliclauter Place in Forgotten Hollow (not owned) = 6. Fix: one figure, say "5, plus 1 in Forgotten Hollow". **Obvious bug.**
22. **Restaurants (line 105)** says 14, which is fine for the 12–18 range. Now it's 13: Jellyfish Jubilee (Gibbi Point) and The Final Draught (Ravenwood) became bars on 16 Oct, and Fisherman's Hut (Ondarion) was added. Still inside the range, but Gibbi Point and Ravenwood now have no restaurant. Fix: update the figure; she may want to know about the two worlds. **Needs her decision** (only to confirm she's happy).
23. **Other counts in the 15 Oct paragraph (line 104)** are now behind: Custom Venues "fine at 5" (6 in owned worlds since the Cozy Corner community farm). Fix: refresh the figures or mark them "as of 15 Oct". **Obvious bug.**
24. **§6b (line 162) and §6c (line 192)** both note The Old Clocktower being Retail in her save. Fix: keep one. **Obvious bug** (tiny).
25. **Rockridge Springs (line 75):** its rental upload still isn't linked (the Gallery data was last checked 14 Oct; only its Residential upload is on the lot). The Sunday refresh (18 Oct) should pick it up; check after. Not a problem yet.

## 3. CLAUDE.md and HANDOVER.md

26. **HANDOVER §7 step 5** says numpy "isn't installed: ask her first". It was installed on 16 Oct (CLAUDE.md and `extract_map.py` say so). Fix: "numpy is installed (16 Oct)". **Obvious bug.**
27. **HANDOVER §7 has no step for the banner height.** A new world now needs `heroY` (where its banner sits on its map, her call; every world file has one since 16 Oct). Fix: add it to step 6 or 7. **Obvious bug.**
28. **HANDOVER §0** has no entry for 16 Oct daytime work: the rental layout (layout 4, `units`, `noLandlord`), world banners (`heroY`), maps re-extracted at full size (numpy), neighbourhood banners zooming to their area, the new plumbob icon, and the world-by-world decisions. It also still says the app icon is "Lucide 'home' in brass". Fix: add a 16 Oct paragraph and a note on the icon. **Obvious bug.**
29. **HANDOVER §3** still gives the chat-era script paths (`build/extract_map.py`, `build/resize_screenshots.py`), although the same section was updated on 16 Oct with the full-size maps. They are now `tools/extract_map.py <package> <world-id>` and `tools/screenshots.py`. Fix: update the two paths or mark §3 as the chat's version. **Obvious bug.**
30. **CLAUDE.md, list of data fields:** world `glow` (Britechester, Mt. Komorebi) and lot `galleryVariants` (Britechester B&B, The Llama Picturehouse) are used but not listed (`galleryVariants` is only named in the Gallery rule). `site/` lists `icon.*`, but the icons are now `icon-16.png` … `icon-192.png` as well. Fix: add them. **Obvious bug.**
31. **CLAUDE.md, "To check"** says expect no problems from `check_pages.js`; that's only true at 1280px or wider (see item 7). Fix: say "at 1280px". **Obvious bug.**

## 4. Research notes that the data has moved past

These are dated write-ups, so this is expected; listed so nobody acts on them by mistake. Fix for all: a line at the top, "Some of this was decided on 16 Oct; TODO.md is current". **Obvious bug** (a note only).

32. **research/worlds/*.md** (written overnight 15–16 Oct) still give the plan before her 16 Oct choices, for example: Brindleton Bay (Deadgrass Discoveries "→ Cemetery", "the Lynxes don't appear anywhere"), Chestnut Ridge (Cozy Corner House "→ Library"), Gibbi Point (Jellyfish Jubilee "→ Restaurant"), Glimmerbrook (Glimmer & Books "a Library"), Magnolia Promenade (Magnolia Mall "Retail/Thrift and Boba Store"), San Sequoia (Celebration Center "Wedding Venue/Cemetery"), Ravenwood (The Final Draught "→ Restaurant", Mystic Crossroads "to be decided"), Willow Creek ("Villareel"), Oasis Springs ("Johnny Zest isn't in her plan").
33. **research/rentals-and-apartments.md** (13–14 Oct): Mossy Lane as a 4-unit rental (University Housing since 14 Oct), Spring Steppes "plan 4" (3 since 14 Oct), and Spring Steppes, Rockridge Springs and Slip 42 "still one home in her save". Her newest save now has them split into 3, 3 and 2 units (they're on the site).
34. **research/community-lots-mix.md** table: Restaurant 14, Café 12, Library 15, Rec Center 3, Onsen 2, Spa 2, Cemetery 7, Custom Venue 5 and others. `tools/research/community_mix.py` today gives 13, 11, 13, 4, 3, 3, 4 and 6. Glimmerbrook now has no library either (Glimmer & Books is a Backroom). Fix: rerun the script and refresh the table.
35. **research/restaurants.md:** "14 restaurants" and the world list (Gibbi Point and Ravenwood lost theirs on 16 Oct; Ondarion gained one).
