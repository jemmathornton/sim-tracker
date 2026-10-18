# Occult Sims on the site (for Jemma, 19 Oct)

**In short:** only 6 occults show as occults today (3 vampires, 3 werewolves), all with a **ghost** icon. At least 10 more are on the site but show as “Human” (the Charms and Acolytes are spellcasters; Kai, Esther, Zuleika and Consort Capp are ghosts).
**Suggested:** a life-state pill with its own icon on every occult Sim, plus one short “how” line (born, turned, died of…) on the Sim page only. Ghosts stay in their household and generation.
**Trailer lore** (Vlad turned Lilith…) shown, marked “Story from EA, not in her save”, until her save says otherwise.

Builds on `research/occults.md` (17 Oct) and `research/decisions/pets.md`. Nothing on the site or in `data/` is changed.

## What’s on the site now

**Shown as occults (`state` filled):**

| Life state | Sims | Household (world) |
|---|---|---|
| Vampire | Vladislaus Straud | Straud (Forgotten Hollow) |
| Vampire | Lilith, Caleb Vatore | Vatore (Forgotten Hollow) |
| Werewolf | Kristopher, Jacob Volkov, Lily Zhu | Volkov (Moonwood Mill) |

**On the site but shown as “Human” (the importer missed their life state):**

| Life state | Sims | Household (world) |
|---|---|---|
| Spellcaster | Minerva, Darrel, Gemma Charm, Emilia Ernest | Charm (Glimmerbrook) |
| Spellcaster | Grace Anansi, Tomax Collette | Amicable Acolytes (Glimmerbrook) |
| Ghost | Kai Aether (Ekade and Takama are human) | Aether (Ravenwood) |
| Ghost | Esther Gomes, Zuleika Izadi | Izadi-Gomes (Ravenwood) |
| Ghost | Consort Capp | no home (on the Capp tree) |
| Alien? | Pol. Tech 9 Smith | Smith (Oasis Springs): only if they’re Maxis’s Gallery family (still open) |

That’s 6 shown, 10 missing (11 with Pol. Tech 9).

**In her plan, not filled yet (no Sims on the site):**
- Innisgreen: **Summerdream** (Titania, Oberon, Mara: fairies), **Mystical Besties** (Nadya Kishka, fairy), **Enchanted Lovers** (Elric DeMuray, fairy).
- Moonwood Mill: **Rory & Friend** (Rory Oaklow, werewolf) and **Werewolves in Training** (maybe Lou Howell).
- Forgotten Hollow: “new vampires of her own, maybe” (Widowshild).
- Not in the plan (her choice): the four Sulani mermaids; the Sages (game characters).

**Two bugs found on the way** (fixing them is a quick job, not a choice):
- Every occult pill uses the ghost icon, so Lilith and Lily are “ghost Vampire” and “ghost Werewolf”.
- Pets use the same field (`state: "Horse"`), so 19 animals get a purple ghost pill too. `decisions/pets.md` already suggests moving them to `species`.

## Where it would show (today’s pages)

The pill already exists in four places; only the icon changes:
- **Sim page, hero chips:** `Young Adult · [droplet Vampire] · Premade`
- **Household roster, “Life state” column:** `[droplet Vampire]` (others: grey “Human”)
- **Family tree card, grey line under the name:** `Young Adult · Vampire`
- **Dynasty / club member card, same grey line:** `Adult · Spellcaster`

The new “how” line would sit **on the Sim page only**, in the facts list next to “Died”:
- Lilith: **Became a vampire:** turned by Vladislaus Straud *(story from EA, not in her save)*
- Minerva: **Spellcaster:** born, Strong Bloodline
- Kai: **Ghost:** died after a mix-up with a crow
- Lily: **Werewolf:** fled Vlad into Moonwood Mill’s tunnels and became one there *(story from EA)*

Ghosts on trees: already where they should be (Kai sits next to Ekade, above Takama). They’d get a soft outline instead of the faded look kept for **late** Sims (urn or grave).

## Options

| | What | Good | Not so good |
|---|---|---|---|
| **A** | Pill only, right icon per life state | Quickest; works for every Sim | Loses who turned whom and ghost stories |
| **B (suggested)** | A, plus the “how” line on Sim pages, ghost outline on tree cards | Tells the story where there’s room; trees and rosters stay tidy | One more optional field per Sim |
| **C** | B, plus a save-wide Occults page (who turned whom, packs, bloodlines, ghosts by world, haunted houses) | Best for vampire lines and packs | Mostly packs she doesn’t own yet; lots to type. Can come later |

## Icons (Lucide, ISC; all real Lucide names)

| Life state | Icon | | Life state | Icon |
|---|---|---|---|---|
| Ghost | `ghost` | | Mermaid | `shell` |
| Spellcaster | `wand-sparkles` | | Alien | `orbit` |
| Vampire | `droplet` (Lucide has no bat) | | Servo | `bot` |
| Werewolf | `moon` (already loaded) | | PlantSim | `sprout` |
| Fairy | `sparkles` | | Skeleton | `skull` |

- Only `ghost` and `moon` are in `site/js/icons.js` now; the rest would be added from Lucide.
- `moon` is also the Secret Society badge; fine, as the pill always shows its word too.
- A ghost spellcaster (Lady Ravendancer) gets two pills: Ghost, Spellcaster.

## Lore vs save

- **Her save first.** If her save shows who turned whom, that’s what shows.
- **EA’s story** (Vlad → Lilith, Morgyn → Grace, Miss Hell → Caleb) shows in small grey italics, “story from EA, not in her save”, because the game never links a vampire to their Master on the tree.
- Her own story on top is welcome; it shows like any other line.

## Data note (for later, not a choice)

- `origin` is already taken (“Premade” / “Mine”), so the “how” would need its own field, e.g. `became: "turned"`, `turnedBy`, `heritage`, `eaStory: true`.
- `state` becomes a list only for ghost occults (Lady Ravendancer); everyone else keeps one word.

## Decisions (yes / no)

1. Show occults as **B**: pill with its own icon everywhere, plus a “how” line on Sim pages only?
2. Ghosts drawn with a soft outline on trees (late Sims stay faded)?
3. Icons OK: ghost, wand-sparkles, droplet, moon, sparkles, shell, orbit, bot, sprout, skull?
4. EA’s trailer story shown in grey as “story from EA, not in her save”? (No = only what her save says.)
5. Fill the missing life states now (6 spellcasters, 4 ghosts) from the game’s own data?
6. A save-wide Occults page later, once she owns Vampires or Werewolves?
