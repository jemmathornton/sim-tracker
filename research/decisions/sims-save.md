# Which save the Sims come from (19 Oct)

**In short**
- None of your saves today is a good Sims source: Building #2 has your lots but mostly stand-in households; the other 30 are old games.
- Best: the **new save you’re making from the Gallery** becomes the one save for Sims too. Until then, keep what the site has (EA families from the game, 23 of yours from old copies, marked to check).
- Name suggestion: **“Sim World”**, so it isn’t a “Building…” save and the tools can find it by name.

Research only: nothing on the site or in your files changed. Saves were read from temporary copies.

---

## Your saves

The site’s plan has **144 households**: 100 EA families (filled from the game), 23 of yours (filled from old copies), 21 still empty.
“Plan” = households on the site whose name is in the save. “Yours” = how many of your own 23 it has.

| Save | Date | Size | Households | Plan | Yours |
|---|---|---|---|---|---|
| Building #2 (+ autosave) | 16 Oct 2026 | 33 MB | 593 | 85 | 6 |
| Season Events | 15 Mar 2026 | 47 MB | 957 | 58 | 4 |
| Not So Berry | 11 Oct 2025 | 80 MB | 1,719 | 16 | 2 |
| 100 Baby Challenge!! | 24 Sep 2025 | 14 MB | 348 | 59 | 1 |
| My Saved Game 4,375 | 13 Oct 2024 | 6 MB | 95 | 58 | 1 |
| Horses! | 12 Jan 2024 | 24 MB | 469 | 56 | 2 |
| Rotational | Dec 2023 | 17 MB | 475 | 49 | 9 |
| Starter Save, Snowy Escape, It’s Magic!, MC Save, Vivian ×2, Sims Sessions, All Universities, Will the port be Promising?, Return to the HOB | Dec 2023 | 6–15 MB | 88–287 | 45–53 | 0–3 |
| 14 smaller ones (Building, Sulani Save, StrangerVille Playthrough, Tiquelle Legacy, …) | Dec 2023 | 1–10 MB | 9–351 | 8–42 | 0–5 |

What this shows:
- **Building #2 matches most names (85)**, but its homes mostly hold stand-ins: e.g. one Sim, Toshie Akamine, where your “Mine” household goes, and the Kirklands as two young adults. `own_import.py` already ranks it last for that reason.
- **Old saves match EA families** (they start in every game) but only a handful of yours, each in a different state (the Kopf and Davidson copies already looked wrong to you).
- **No save has all 23 of yours.** 21 households aren’t in any save or the Library at all.
- Dec 2023 dates are when the folder was copied over, not when you played.

---

## Options

**a) Building save doubles as the Sims source** (an exception, like rental units)
- ✔ Exists now; already has your lots, so households are on the right homes.
- ✘ Mostly stand-in households; and you’re replacing it with the Gallery save anyway.
- Tools: `own_import.py` ranks Building first instead of last; one-line change. Your effort: fix households in the Building save first.

**b) A separate save just for Sims** (e.g. “Sims”)
- ✔ Clean: only real households, nothing half-built.
- ✘ A second save to keep in step with the lots; homes won’t match unless you build there too.
- Tools: `own_import.py` reads that one save by name. Your effort: make every household twice (once for the lots, once here) or move them about.

**c) The new Gallery-built save, for lots and Sims** ✔ recommended
- ✔ One save that is your real world: right lots, right households in the right homes, played as you play.
- ✔ It replaces Building #2 anyway, so no extra save to keep.
- ✘ Doesn’t exist yet; Sims stay as they are on the site until it does.
- Tools: `own_import.py` reads only this save (by name), takes households by home lot as well as name, and can **refresh** households that came from it (today it never overwrites). `premade_import.py` stays as it is for EA families you haven’t played; once you play one, it can come from the save instead. `lot_traits.py` and the lot rules switch to this save too. Your effort: build it (planned anyway), move households in.

**d) No save: you type Sims in** (chat, or the Sims tab prototype: `for-jemma/prototypes/world-plans-sims-tab.xlsx`)
- ✔ Exactly your story; works for households that don’t exist in the game yet.
- ✘ Slow for 144 households; no traits, skills or careers unless typed.
- Tools: `import_spreadsheet.py` reads two new tabs (small change); save importers retire. Your effort: high, ongoing.

---

## Recommendation

**c)**, with **d) by chat** for the gaps.
- Now: no new save imports. Keep EA families from the game files and your 23 copied households (still to check); tell me in chat about the 21 missing households if you want them before the new save.
- When the new save exists: call it **“Sim World”** (not “Building…”), and that one save is the source for lots and Sims. Old saves and the Building saves retire as sources.
- Your own story bits (who’s married, who’s whose son) stay app-side as now, so a refresh from the save never undoes them.

---

## Decisions (yes / no)

1. The new Gallery-built save is the one source for both lots and Sims?
2. Call it “Sim World”? (Or tell me your name for it.)
3. Until it exists, no Sims from Building #2 (no exception like rental units)?
4. Retire the 30 old saves as a source once the new save is in (keep the 23 copied households on the site till then)?
5. When the new save is in, refresh your households from it, replacing the old copies (your app-side changes kept)?
6. EA families you’ve played in the new save come from the save; the rest stay as EA starts them?
7. Gaps before then: by chat, not the Sims tab?
