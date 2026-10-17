# World Plans review (17 Oct)

A look at her spreadsheet beyond the columns the app reads. Research only: her file was copied into a scratch folder and only the copy was read (openpyxl). Nothing in `site/`, `data/`, `tools/` or her folders was changed.

- `World Plans (fixed).xlsx` SHA-256 before and after: `EEEBDFEB…F148BEA` (same; last saved 16 Oct 20:32).
- Also read, from copies: her original `World Plans.xlsx` (11 Oct), the 12 Oct and 15 Oct backups, and the chat’s note `World Plans - changes for original sheet.md`.

## Headlines

- **One real formula bug:** Nordhaven’s Overall on the Overview averages the Nordhaven *and* Innisgreen rows, so it shows **10% instead of 20%**. It came in on 15 Oct, when the Innisgreen row was added.
- **The Overview table stops one row short:** Ondarion (row 34) is outside it, so it loses the stripes and gets left behind if she sorts or filters.
- **The sheet and the app agree.** The import finds 0 edits, 0 clashes and 0 missing lots. The only differences are the two tenant lots (by design) and one bedroom count (Spring Steppes: 9 in the sheet, 8 in the app).
- **Totals don’t miss anything by accident.** The secret lots are counted. The 5 not-owned worlds are left out of the totals on purpose (the note in A2 says so).
- **“Overall” is easy to misread.** It’s a plain average of Built, Shared, Screenshots and Sims Made. With 16 lots ticked for screenshots and 5 homes with Sims made, even Britechester (everything built and shared) shows 50%.
- **Things she wrote that the app doesn’t show:** four loose notes under the Statistics blocks. The Overview’s Owned column isn’t read by the import either.

## 1. What’s in the workbook

**Tabs:** Overview, then 30 world tabs in the same order as the app. No other tabs, no hidden tabs or rows, no comments, no charts or pictures, no coloured cells, no crossed-out or italic text.

**Overview** (made by the chat on 11 Oct, from the brief in her “changes” note; her original sheet had no Overview):

| Column | What it shows | Formula |
| --- | --- | --- |
| World | link to the tab | – |
| Pack | typed in | – |
| Owned | Yes/No dropdown | – |
| Lots | count of lots | helper M: `COUNTA(A3:A42) − 2 × COUNTIF("Lot Name")` |
| Built, Shared, Screenshots, Sims Made | TRUE out of TRUE + FALSE (N/A left out) | helpers N–U: `COUNTIF(…,TRUE)` and `COUNTIF(…,FALSE)` |
| Overall | average of the four | `AVERAGE(E:H)` |
| To build | Built = FALSE | helper O |
| Built, not shared | Built TRUE and Shared FALSE | helper V: `COUNTIFS` |
| Total (owned worlds), row 35 | sums only rows with Owned = Yes | `SUMIF(C5:C34,"Yes",…)` |

- Columns M–V (the helper counts) are hidden.
- A red → yellow → green colour scale (0%, 50%, 100%) on the percentages, E5:I35. It’s the only colour that carries meaning.
- Rows 1–4 are frozen. World names are blue links; each tab links back with “← Overview” in I1.

**World tabs:**

- One block per neighbourhood: a bold name row, a header row, the lots. The blocks are tables with a grey header and white/light grey stripes (Google Sheets’ export style); the look doesn’t carry meaning.
- Columns A–I are her plan. J–M (Lot Traits, Lot Challenges, Bedrooms, Bathrooms) were filled from the app on 15 Oct.
- “Eco footprint starts Green/Industrial” sits in column C of 10 neighbourhood rows (added from the app on 15 Oct).
- A Statistics block at the bottom: Built, Shared, Screenshots, Sims Made and Percentage Complete, the same sums as the Overview.
- A “Notes” heading beside each Statistics block, with four loose notes of hers: Willow Creek “Ella-Mint Cadberry”, Chestnut Ridge “One of Duo’s Parents”, Tomarang “Lynx” and Ciudad Enamorada “Lynx”. They were in her original sheet too.
- Row 1 is frozen on every tab except Innisgreen.
- Built, Shared, Screenshots and Sims Made were checkboxes in her original Google sheet. In this file they’re plain TRUE/FALSE.

**Saved by a script, not by Excel.** The file was last written by Claude’s script, which can’t work out formulas. So the Overview and Statistics results aren’t stored in the file. Excel and Google Sheets work them out again on opening (the file asks them to), but a quick preview (Windows preview, a phone) shows those cells blank.

## 2. What the app doesn’t show, and where they disagree

**Import run** (`tools/import_spreadsheet.py` on the copy): 0 spreadsheet edits, 0 clashes, 0 lots missing. 2 differences, both by design: the Residents cells of Spring Steppes (“Elderberry & Pleasant”) and 3 Cobblebottom Street (Cecilia Kang plus Moody & McMillan), which the app splits into owners and tenants.

**Extra checks** (the import doesn’t compare these): neighbourhood names and order, lot order, traits, challenges, eco notes, and Pack/Owned on the Overview all match the app. One difference:

| Lot | Sheet | App | Why |
| --- | --- | --- | --- |
| Spring Steppes (Britechester), Bedrooms | 9 | 8 | Two Gallery versions: University Housing (9 beds) and Residential Rental (8). The app leads with the rental, because her plan says Residential Rental |

**In the sheet but not on the site, or not read back:**

| What | Where | Today |
| --- | --- | --- |
| Loose notes (4) | beside each Statistics block | not in the app; meaning not recorded anywhere |
| Owned, Pack | Overview | the app keeps its own (they match now). If she sets a world to Owned after buying the pack, the import won’t notice |
| Screenshots %, Overall, To build, Built not shared, per world | Overview | the app’s Stats page has Lots, Built, % built, Shared, Sims made and % Sims made per world. “Not built yet” and “Built, not shared” are only filters there |
| J–M edits | world tabs | filled from the app; her edits there don’t come back |
| A lot moved to another neighbourhood, or renamed | world tabs | the import matches by lot name only: a move is ignored, a rename shows as a new lot plus a missing one |

**Odd-looking, but on purpose:**

- Glimmerbrook shows Shared 83% above Built 67%. Glimmer & Books (Elixirs and Brews) is shared but marked not built until she adds the bar (16 Oct).
- Plumbob Pictures and The ██████ Lab have N/A in Built, Shared and Screenshots. They count in Lots (359) but not in Built % (out of 357).
- Bailey-Moon Manor and Izakaya Hanamigawa Koen are ticked for screenshots with no pictures on the site yet (their pictures are in her Screenshots folder; see TODO).

## 3. Formula problems

| Where | Problem | Effect |
| --- | --- | --- |
| Overview I31 (Nordhaven Overall) | `AVERAGE(E31:H32)` instead of `E31:H31` | Shows 10%, should be 20% (the Nordhaven tab’s own Percentage Complete says 20%) |
| Overview table | ends at row 33 (`A4:K33`) | Ondarion isn’t in the table: no stripes, and it stays put if the table is sorted or filtered |
| Every world’s helper counts and Statistics | fixed ranges that end at the last lot row (Willow Creek, Oasis Springs, Windenburg and San Myshuno have one spare row) | A lot added at the bottom of the last neighbourhood is left out of both. Rows inserted inside a neighbourhood are fine |

Both bugs came in on 15 Oct, when the Innisgreen row was added at 18:44; the backups from before that are right.

**Totals:** what the Overview shows once the file is opened (owned worlds; the app’s Stats page has the same counts):

| Lots | Built | Shared | Screenshots | Sims made | Overall | To build | Built, not shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 359 | 195 of 357 (55%) | 168 (47%) | 16 (4%) | 5 of 180 homes (3%) | 27% | 162 | 28 |

Not-owned worlds (Forgotten Hollow, Tartosa, Moonwood Mill, Ciudad Enamorada, Innisgreen: 46 lots) show 0% and stay out of the total, as the A2 note says. All 405 lots together: 48% built.

**Percentages that may mislead:**

- **Overall weighs all four the same.** Screenshots and Sims Made are nearly empty, so Overall sits near half of Built for every world.
- **Worlds with no homes look better.** Granite Falls, Magnolia Promenade and Selvadorada have no Sims Made column to average, so their Overall comes from three columns (Granite Falls: 52%).
- **Shared is out of all lots, not built ones.** 47% of lots, but 86% of built lots.
- **The total Overall (27%)** is the average of the four totals, not of the worlds (that would be 28%).

## 4. Suggestions (her call)

1. **Fix the two Overview bugs:** I31 to `AVERAGE(E31:H31)`, and the table to `A4:K34`. It’s her file, so only with her OK (backup first, as before).
2. **Spring Steppes bedrooms:** 8 to match the app, or tell us which version should lead.
3. **Ranges that can’t go stale:** whole columns, e.g. `COUNTIF('Willow Creek'!F:F,TRUE)`, and Lots as `COUNTIF(F:F,TRUE)+COUNTIF(F:F,FALSE)+COUNTIF(F:F,"N/A")`. New lots would then always count.
4. **What “Overall” should mean:** keep it, call it “Average of the four”, or base it on Built and Shared only, with Screenshots and Sims Made shown on their own.
5. **Shared out of built lots** instead of all lots (“how much of what I’ve built is on the Gallery”).
6. **Her four notes:** tell us what they mean; they could go on the lot or household pages, or stay sheet-only.
7. **One home for Owned:** when she buys a pack, change it in the app (or the import could learn to read the Overview’s Owned column).
8. **Small tidy-ups:** freeze row 1 on Innisgreen like the other tabs.
9. **Checkboxes and charts:** Excel’s tick boxes would look nicer than TRUE/FALSE, and charts are possible. But Claude’s script would probably strip both the next time it updates her file, so charts are safer on the app’s Stats page.
10. **Could the Overview come from the app?** Yes: the app already has every number. Options:
    - **Keep the formulas** (fixed as above). They work when she edits the sheet herself.
    - **Have Claude write the numbers in** each time it updates the sheet. No bugs, but they go stale as soon as she edits a tick.
    - **Drop the Overview** and add To build, Built not shared and Screenshots to the Stats page’s “By world” table (percentages are allowed on Stats).

    While the sheet may still be where she edits (TODO §0), keeping the formulas and fixing them is the safe choice.
