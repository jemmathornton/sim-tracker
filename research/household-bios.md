# EA’s household bios: how the game links them (19 Oct)

**In short:** found EA’s own bio for **98 of the 101** EA households on the site, read word for word from the game. 91 are certain; 7 need a look; 3 have none.

Data: `research/data/household-bios.json` (from `tools/research/household_bios.py`, report only).

## How the game does it

- The bio isn’t in the household file (apart from 3) or in the household tuning. It sits with the **lot**.
- Every lot EA moved a family into has a **house description** (resource type `0x729F6C4F`, in each pack’s Simulation packages). Near its end are two values side by side: the bio’s **text key** and the **household’s id** (the `familyid` of the household file, which a save keeps as `premade_household_id`).
- A new save looks up the text and copies it into the household’s `description`, which is what the game shows.
- Example: the Goths. House description `0x7A55` holds text key `0x43CAAED5` (“The Goths are an aristocratic family…”) next to household id `125326178772849712`.
- The 3 that also carry their bio in the household file (BFF, Landgraab, Spencer-Kim-Lewis) have the same text in their house description.
- Check: the bios in her newest save match these for every EA household in it (88 matches).

## Needing a look (sure: false)

- **Caliente and Lothario**: one EA family, one bio (about Katrina’s “mooching boyfriend”), split into two households on the site.
- **Greenburg and Knox Greenburg**: same thing, split.
- **Santiago Ojo**: Miko comes from EA’s Karaoke Legends, whose bio is about Miko, Darling and Kibo. Alicia (hers) lives there instead.
- **Linh-Sadya & Linh**: two EA households merged, so two bios (Liên and Alon’s, and Thi’s).
- **Monticapp**: correct (EA’s Monty bio, about Juliette, Romeo and Dante); only flagged because of the new surname.

## None found

- **Broke** and **Curious**: EA gives them no home, so no house description and no bio (a fresh save leaves Broke’s blank too). The only Nova Curious text in the game is the start of her tutorial story, not a bio.
- **Smith** (Oasis Springs): not in the game’s files at all (her copy came from her Library).

## Other texts worth knowing

- **Pancakes**: a second bio, about baby Iggy, is in her save but isn’t linked to any lot in the game. The site’s Pancakes are just Bob and Eliza, so the linked bio fits.
- **Landgraab**: Ondarion’s pack has a second Landgraab text (“Yet, under that polished surface…”), used elsewhere, not as the household bio.
- **Capp**: Consort Capp (a ghost townie, not on the site) has his own household and bio; the site’s Capps get Tybalt’s.
- A few bios end in a stray line break in the game; it’s trimmed.
