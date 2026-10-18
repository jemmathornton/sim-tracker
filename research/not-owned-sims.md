# Families in worlds she doesn't own yet (overnight, 18–19 Oct)

Research and a prototype only: nothing in `site/`, `data/` or `tools/` changed.
Prototype: `for-jemma/prototypes/not-owned/index.html` (opens from the folder, or at http://localhost:8002/for-jemma/prototypes/not-owned/). It runs the real app on the real data, with options A, B and C in the bar at the top.

## The problem

24 Sims in 9 households live in four worlds she doesn't own: Tartosa (Laurent, Markovic, Soto, Monticapp), Forgotten Hollow (Straud, Vatore), Moonwood Mill (Volkov) and Ciudad Enamorada (Nadir, López). Their Sims are in `data/worlds/*.json`, but they never show anywhere:

- `tools/build.py` skips every lot of a world that isn't owned (`if not owned: continue`). Those lots are kept only in the Stats rows.
- `app.js` makes households from lots. With no lots there's no household, so the Sims never reach `SIMS`. They get no page, no tree card and no dynasty role.
- What's lost: the Monticapps aren't on the Capp tree, Juliette isn't shown as a Capp outcast, there's no Monty dynasty page, and the Vatores' cousin link to Lily Zhu is gone.

## How the app treats worlds she doesn't own today

- `owned: false` also means `ready: false`, and a world page opens only if it's ready. The world, its neighbourhoods and its lots never open.
- **Sidebar:** these worlds are greyed in a "Not owned" group (the whole group is faded, with hollow dots) and can't be clicked.
- **Home page:** a "Not owned" section of greyed world tiles, marked "Pack not owned".
- **Stats page:** their rows are kept but faded, with "not owned" by the world's name.
- **Sims from `people.json` placed in one of these worlds** get a world chip with the tooltip "(not owned)". The family lists say "Tartosa (not owned)". Dynasty and club pages show the world crumb as plain text, "World (not owned)". This is the only "not owned" wording that exists for Sims so far.

## Three ways to show them (all in the prototype)

All three use the same marks. They copy the sidebar's hollow dot for not-owned worlds, so nothing new has to be learned:
- a **hollow dot** on the Sim's world chip ("Monticapp · Tartosa"),
- a **hollow monogram** on their cards (trees, family lists, relationships, dynasty members),
- one more line in the tree key: "○ In a world you don't own yet".

| | A: pages + sidebar (suggested) | B: pages, no sidebar | C: trees only |
|---|---|---|---|
| Household page | Yes, with a lighter banner and one line: "This family lives in Tartosa (My Wedding Stories), a world you don't own yet…" | Yes, same | No |
| Sim pages | Yes, all 24 | Yes, all 24 | Only Sims on an owned family's tree (Juliette, Romeo, Dante), as late relatives get today |
| Sidebar | The world in "Not owned" unfolds to its households (with a count), then to the Sims of the open one. The world itself still doesn't open | Unchanged | Unchanged |
| Search | Finds them, marked "not owned" | Same | Only the three Sims with pages |
| Lots, neighbourhoods, world | Plain text, no links (the crumb says "Tartosa (not owned)") | Same | Same |
| Vatore and Lily Zhu link | Shown on both trees | Same | **Lost**: neither household has an owned relative, so no page shows it |

**Why A:** it's the app's normal household and Sim layout with one note and lighter marks, so it ports with very little new code. Every family can be found. It also covers the Vatores, Straud and the Volkovs, who have no relatives in her owned worlds. When she buys a pack, nothing moves: the world opens and the marks disappear. B hides 9 households unless you happen to find a link. C is the smallest change (the audit's suggested fix) but leaves 21 of the 24 Sims as names only.

## Juliette and the Capp tree: a second fix is needed

Showing the Monticapps isn't enough to put Juliette on the Capp tree. Nothing in the data links her to Tybalt: neither of them has parents. The prototype shows her as Tybalt's sister through two empty parent boxes, as in `sims-data-audit.md` §2 question 9. The "Juliette as Tybalt's sister" tick box turns this off. Without it, the Capp tree shows only Tybalt and his children in every option, and the Monticapps reach the Capps only through the Capp dynasty page and Juliette's and Romeo's "Despised" relationship with Tybalt.

## Porting notes (once she picks)

- `tools/build.py`: keep the household lots of worlds she doesn't own (homes only, no pictures). `pre.js` rebuilds them from the Stats rows to show the idea.
- `app.js`: the wrappers in `post.js` say which function each one changes: `homeChip`, `simWhere`, `treeCard`, `simFamItem`, `simRelCard`, `memberCard`, `treeKey`, `householdNew`/`household`, `simPage`, `renderNav`, `searchIndex`. Also: no lot or neighbourhood pages for these worlds, and links to them become plain text.
- `site.css`: the first block of `not-owned.css`.
- Checked in the prototype: every page draws with no errors, bad links or junk text. That's 1,023 pages in A/B and 993 in C.

## Questions for her

1. Which option: A (suggested), B or C?
2. Should Juliette and Tybalt share two empty parent boxes (or Caliban and Cordelia Capp, as the wiki names them), so she's on the Capp tree?
3. Should the lighter banner stay, or is the one-line note enough?
