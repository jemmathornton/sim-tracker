# A Sims tab for World Plans (prototype, 17 Oct)

**File:** `world-plans-sims-tab.xlsx`, in this folder. It’s a **copy** of your World Plans (as saved on 16 Oct, 20:32) with two new tabs at the end, **Sims** and **Relationships**. Your own spreadsheet in Downloads wasn’t opened or changed. The 31 tabs you already had are in the copy unchanged (checked cell by cell), so you can flick between a world tab and the new ones. Don’t use the copy as your main file: if you like the tabs, we add them to your own file, but only once you say so.

The research behind it is in `research/sims-display.md` (§9 has the layout) and `research/sims-sources.md` (§4 asks whether you’d rather type Sims in chat or in a tab).

---

## The Sims tab

One row per Sim. It looks like your world tabs (same fonts, grey header, stripes), with drop-downs like Owned on the Overview tab. Hover over a column heading for a short note.

| Column | What goes in it |
|---|---|
| Sim ID | A short name that never changes, e.g. `bella-goth`. A second Sim with the same name gets `-2`. Everything else links by this |
| First Name, Last Name | As in the game |
| World | Drop-down of the 30 worlds on your Overview tab |
| Household | As in Residents/Owners on the world tab, without the notes in brackets. World + Household finds the home, so the Tartosa and Ondarion Montys stay apart |
| Life Stage | Drop-down: Newborn to Elder |
| Occult | Drop-down; blank means human |
| Origin | Drop-down: EA, EA (changed), Mine, Born in save |
| Parent 1, Parent 2 | Drop-down of the Sim IDs. **Brothers, sisters, cousins, aunts, grandparents are worked out from these**, so they’re never typed |
| Partner, Partner Type | Their partner now (drop-down of Sim IDs) and Spouse, Engaged or Partner |
| Late | Yes for Sims who have died and are only on the family tree (a playable ghost is Occult = Ghost instead) |
| Example | Yes = an example row (shown grey and italic) |
| Notes | Anything else |

Sims with no home (Consort Capp, or late parents like Cordelia and Caliban Capp) are rows with Household left blank. That’s what lets Juliette in Tartosa and Tybalt in Ondarion come out as sister and brother.

## The Relationships tab

One row per pair, for anything that isn’t family or a current partner: friends, rivals, exes, work, dynasties. Columns: **Sim A**, **Sim B** (drop-downs of the Sim IDs), **Tag** (drop-down), **Label** (your own words, like the game’s custom relationships), **Example**, **Notes**. Two grey columns fill themselves in: **Between** (e.g. “Zest (Del Sol Valley) ↔ Landgraab (Oasis Springs)”) and **Group**.

The tag list is on the right of that tab (column J) and the drop-down reads it, so you can change it there: 19 tags in 6 groups (Romance, Friends, Conflict, Work & school, Dynasty, Family), as proposed in the research.

## Examples in it

24 Sims and 8 relationship rows, all EA premades as the game ships them (from the Sims Wiki): the Goths, Pancakes, Landgraabs and Johnny Zest, the Vatores, Bess Sterling and Jules Rico, the Capps (with Consort and Tybalt’s late parents) and Romeo, Juliette and Dante Monty. Households and worlds follow your plan (Johnny at Upland Place, the Montys in Tartosa).

## Mistakes it catches

- The same Sim ID twice, or a parent or partner who isn’t a Sim ID: **red**.
- Two Sims who disagree about who their partner is: **amber**.
- A Sim A or Sim B who isn’t on the Sims tab, or a Sim paired with themselves: **red**.
- The drop-downs stop most typos in the first place.

---

## How the app would read it

The same way `tools/import_spreadsheet.py` reads your world tabs now: from a temporary copy, never your file itself, and only reporting until you say “apply”.

- **Sims** go into each world’s `households` in `data/worlds/<world>.json` (where the Goths’ cards come from now). Sims with no home go into a save-wide family list, so trees can still show them.
- **Partners and Relationships rows** go into one save-wide list of pairs, so a link between Tartosa and Ondarion is stored once.
- **Family** is worked out by the app from Parent 1 and 2.
- Like lots, it would be **three-way** (the tab as last imported, the tab now, the app): what you change in the tab comes across, and things only the app has (traits, aspirations, stories, pictures) are never overwritten.
- One small change is needed first: today’s importer treats every tab after Overview as a world, so it would pick these two up as empty worlds. Nothing breaks (tested: your 30 world tabs read exactly the same with the new tabs there), but it would need to skip them.

A test reader (scratch only, nothing in `tools/`) read the copy with no problems. It found 8 households in 7 worlds, 3 Sims with no home and 14 pairs (6 couples from the Partner column, 8 from Relationships). From the parents alone it worked out 23 family links, e.g. Juliette and Tybalt as sister and brother, Dante’s three Capp cousins, Consort as Tybalt and Juliette’s grandfather, and Johnny and Malcolm as brothers.

---

## Choices for you

1. **Tab or chat?** This tab, chat only, or both (the tab for the basics, chat for stories)?
2. **One tab or two?** Keep Relationships, or just give me friendships and rivalries in chat?
3. **Sim IDs:** typed by you (as here, never change), or made from the name automatically (less typing, but renaming a Sim would break links to them)?
4. **Partners:** in the Sims tab (as here), or every couple as a Relationships row (two fewer columns, every pair in one place)?
5. **Late Sims and ancestors:** rows on the Sims tab (as with Cordelia and Caliban), or just a “Relative” row when you don’t want to add them (as with Lilith and Caleb)?
6. **Tags:** add or drop any? I called the dynasty ones “Dynasty Ally”, “Dynasty Rival” and “Dynasty Outcast” so they don’t get mixed up with “Rivals” in the drop-down.
7. **Origin words:** EA / EA (changed) / Mine / Born in save. Fine, or other words?
8. **More columns?** Only the basics are here. Aspiration, traits, career, or a Role (Heir, Tenant) could be added for the households you play.
9. **The examples:** keep them as real rows (they’re EA’s start, not your save, so ages and partners may need updating), or delete them?
10. **If you want it:** shall I add the two tabs to your own World Plans? I’d do it on a copy and you’d swap it in yourself.
