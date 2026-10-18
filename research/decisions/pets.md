# Pets and horses on household pages (for Jemma, 19 Oct)

**In short:** 19 animals are already on the site (10 horses, 6 cats, 3 dogs, in 9 households), but they show as Sims: counted as “Sims”, with a ghost “life state”, foals and kittens called “Child”, and drawn on the Sims family tree.
**Suggested:** keep them in the same household data, but show them apart: an **Animals** list under the Sims, their own small family tree where there are young ones, and a pet page that says pet things.
**Small animals** (goats, hens, sheep, llamas, cows) aren’t household members in the game, so leave them off households; at most one line on the lot page.

Builds on `research/pets-and-horses.md` (17 Oct). Nothing on the site or in `data/` is changed.

## Who has animals

**On the site now** (from the game for EA’s families, from her saves for her own):

| World | Household | Sims | Animals |
|---|---|---|---|
| Brindleton Bay | Delgato | 4 | Blue (dog), Bartholomew Sr (cat) |
| Brindleton Bay | Hecking | 2 | Rosie (dog) |
| Brindleton Bay | Lynx | 1 | Doc, Josie, Cleo, Bartholomew Jr (cats; Jr is Josie’s kitten) |
| Brindleton Bay | Ventura (hers) | 1 | Cocoa (dog) |
| Henford-on-Bagley | Watson-Holmes (hers) | 3 | Peanut (cat) |
| Chestnut Ridge | The Grove Family | 3 | Luna, Starbrite (horses; Starbrite is Luna’s foal) |
| Chestnut Ridge | Sienna & Flapjack | 1 | Flapjack (champion stallion) |
| Chestnut Ridge | Gooseman | 1 | Duke (champion stallion) |
| Chestnut Ridge | Palumbo (hers) | 2 | Puzzles, Longface, Bluebell, Queen, Pie, Buttercup (horses; Buttercup is Bluebell and Longface’s foal) |

That’s 9 of the 124 households with Sims. The Palumbos are full (2 + 6 = 8).

**In her plan, not on the site yet:**
- Appaloosa Stables: the Horse Elder Couple and **6 horses** (her Gallery text). Not made yet.
- Red Roan Farm (“Mine”): horses, dogs, mini sheep and hens (her Gallery text). No Sims yet.
- Paradise Stables (Gibbi Point): “? (Horses!)”, residents to decide.
- The Lovejoys (she’ll upload them): her Season Events copy has Dusty (dog) and Chubbs (cat).

Other saves give some premade families extra pets (the Delgatos have two puppies in Building #2). The Sims rule keeps EA’s families as the game ships them, so these aren’t used.

## What’s wrong now (obvious bugs, can be fixed without her)

- The header says “8 Sims” for the Palumbos (2 Sims and 6 horses).
- The “Life state” column and Sim page show “Horse” or “Cat” with the **ghost** icon, as if it were an occult.
- Foals and kittens say “Child”; the game says Foal, Kitten, Puppy.
- Pet traits are missing for EA’s pets (the game reader keeps only Sim traits).

## Options

**A. An Animals list under the Sims (suggested)**
- Household page: the Sims table stays for Sims only. Under it, “The *animals*” with a row each: name, Cat/Dog/Horse with its icon, life stage, breed, sex. Header: “2 Sims · 6 horses”.
- Family tree: animals off the Sims tree. Where an animal has a parent (Lynx, Groves, Palumbos), a small second tree, “Animal family”, drawn with the same code.
- Pet page: same layout as a Sim page, but labelled Cat, Dog or Horse; traits, breed, horse skills, mother and father; no aspiration, career or “Human”.
- Owner’s Sim page: a small “Their animals” line (only where she names a rider or favourite person).
- Good: clear, fits what’s built, works with what’s already in `data/`. Not so good: one more section on 9 pages.

**B. One line under the Sims**
- “Animals: Luna (horse, adult) · Starbrite (foal, Luna’s)”. No pet pages, no animal trees.
- Good: least work, quietest. Not so good: loses Bluebell’s line, the champions and the Palumbos’ herd at a glance.

**C. Animals as full members, plus a Horses page**
- Animals stay in the Sims table and on the Sims tree (with the bugs fixed), and a save-wide Horses page lists every horse, home, line and champion.
- Good: shows horse breeding best. Not so good: trees get crowded (the Palumbos’ 6 horses), and it’s the most typing.

## Horses: what’s different

- They live with a household on a home lot (the game has no ranch lot type), so they belong on the household page like cats and dogs.
- Foals have one mother and father: worth the small Animal family tree (Starbrite ← Luna; Buttercup ← Bluebell and Longface).
- Champions: Duke, Flapjack (and Bluebell, near 10 in all four skills) could carry a trophy badge. Skills change in play, so keep them on the pet page only.
- Lot page: a counts line for horse homes (“Horses: 6”) would show the ranches at a glance.

## Small animals

Goats, sheep, hens, cows, llamas, rodents and crows don’t count towards the 8 and live in coops, sheds or cages, so the save doesn’t store them as household members.
- **Leave out** (suggested for now): nothing on households.
- Or **a line on the lot page** from her own words: Red Roan Farm (mini sheep, hens), Cordelia’s Secret Cottage (hens), Rustic Residence (chickens), The Cozy Corner House (goats, sheep).

## Data (written here only, not applied)

Animals stay in `households.<name>.sims` as now, with a few changes so the page can tell them apart:

```json
{"id": "starbrite", "name": "Starbrite", "species": "Horse", "sex": "f", "age": "Foal",
 "breed": "Mustang", "traits": ["Energetic", "Friendly", "Needy"], "parents": ["luna"],
 "origin": "Premade", "rider": "wren-grove"},
{"id": "duke-gooseman", "name": "Duke", "species": "Horse", "sex": "m", "age": "Adult",
 "champion": true, "rider": "don-gooseman"}
```

- `species` (Cat, Dog, Horse) replaces today’s `state: "Horse"`; `state` goes back to occults only (a ghost or unicorn horse).
- `age`: Kitten, Puppy or Foal, then Adult, Elder.
- New, all optional: `breed`, `champion`, `rider` (horses) or `owner` (a cat or dog’s favourite Sim).
- Lot-level, only if she wants small animals: `"animals": [["Mini sheep", 2], ["Hen", 6]]`.
- The two importers would write `species` instead of `state`, and read pet traits too.

## Recommendation

**Option A**, with the bugs fixed first, the Animal family tree only where there are young ones, and small animals left out for now.
Second choice: **B** if she’d rather keep household pages quiet. **C** only if she plans to breed horses seriously.

## For Jemma to decide (yes/no)

1. Animals in their own list under the Sims (A)? If no: a one-line strip (B)?
2. Header like “2 Sims · 6 horses”, not “8 Sims”?
3. A small Animal family tree where an animal has a mother or father (Lynx, Groves, Palumbos)?
4. Pets get their own page like Sims?
5. A “Their animals” line on the owner’s or rider’s Sim page?
6. A trophy badge for champion horses (Duke, Flapjack)?
7. A “Horses: 6” line on horse-home lot pages?
8. Small animals left off for now? If no: one line on the lot page?
9. Lucide Lab’s horse-head icon for horses (Lucide has cat and dog, but no horse)?
