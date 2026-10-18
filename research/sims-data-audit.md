# Sims and households: data audit (overnight, 18 Oct)

Checked: every household's Sims in `data/worlds/*.json` (119 households, 332 Sims), `data/people.json`, `data/groups.json`, each against the lots in the plan, EA's game files (`research/data/premades.json`) and the wiki notes in `research/ea-family-lore.md`. Each finding below was checked against the data. Research only: nothing in `site/`, `data/` or `tools/` was changed.

Clean: no parent younger than their child, no child or teen living without an adult, no household over 8, no broken parent or partner ids, every club has exactly one leader, every club meeting place is a real lot, and no pet has an aspiration, traits or a bonus trait.

---

## 1. Clear bugs (obvious fixes Claude can make)

1. **24 Sims never show anywhere.** Households in the four worlds she doesn't own (Tartosa: Laurent, Markovic, Soto, Monticapp; Forgotten Hollow: Straud, Vatore; Moonwood Mill: Volkov; Ciudad Enamorada: Nadir, López) have Sims in `data/`, but the build leaves out the lots of worlds she doesn't own, so these Sims never get a household or a Sim page. Effects:
   - Juliette, Romeo and Dante are missing from the Capp tree, though the 17 Oct decision says the Capp tree shows them.
   - Juliette doesn't show as a Capp outcast, and the Monty dynasty has no page at all.
   - The Vatore and Lily Zhu cousin link (Lily is in Moonwood Mill) never shows.
   
   Fix: in `app.js`, add the Sims of a world she doesn't own the same way as `people.json` Sims (they get a world chip but no household link).
2. **Missing family links** that both the game and the wiki give:
   - **Thi Linh** has no parents. The game's `FamilyParent_Linh` gives her Chánh and Arturo, as it does for her sister Liên. Add `parents: ["ch-nh-linh", "arturo-linh"]`.
   - **Jay Robles** has no parents. The wiki says he is Ignacio's child, and the game gives Jay and Ignacio a "Supportive" (parent) link. Add `parents: ["ignacio-robles"]`.
   - **Thiago Abrantes** has no parents. The wiki says he is Ermelinda's elder son and Sofia's brother. Add `parents: ["ermelinda-abrantes"]`. This joins the Thebe and Abrantes trees.
   - **Mei Prescott** has no parents. The wiki says Tai Lum is her father. Add `parents: ["tai-lum"]`. The game files don't link them, so this one comes from the wiki only.
3. **Her Sims marked as EA's are the wrong way round.** Some EA Sims are marked `"origin": "Mine"`, but her rule says EA's Sims stay "Premade" even when she has changed them:
   - Mark Eggleston, Alice Martin and Leslie Holland (Eclectic Arts) are EA's StrangerVille "New Blood" household.
   - Miko Ojo (Santiago Ojo) is EA's (Karaoke Legends).
   
   Set all four to `"Premade"`. Keep her save's versions of them.
4. **Unreadable career text:** Judith Ward and Venessa Jeong show "{M0.Actor}{F0.Actress}" as their career. Both are female, so it should read "Actress". The game files have it this way too.
5. **Stray spaces** at the end of two aspirations: Mónica López ("Romantic Explorer ") and Misty Haynes ("Inner Peace ").
6. **School missing for 28 children and teens.** About a third of the children and teens have no school line. The game files only give some of them one, and the others get it when the game loads. Fill "Grade school" or "High school" by age, with no grade (as Alexander Goth already has). The full list is in §3d.
7. **Small gaps:**
   - Bella Goth's career has no level. The game says level 2.
   - Alexander Goth's school has no grade. The game says grade C.
   - Malcolm Landgraab and Zoe Patel have no `career` field at all (every other Sim has one, even if empty).
8. **Five dynasties have no details** in `groups.json`. Only Goth and Landgraab have ideals and prestige. The game's details for Alto, Abrantes, Darong and Thebe are in `ea-family-lore.md` §2d and can be copied in. Capp and Monty wait on her answer in §2.
9. **Club tidy-up (harmless):** 17 of the 21 `others` entries in `groups.json` repeat Sims who already list the club themselves. Ulrike Faust has `null` as her household, though she lives with the Free Spirits. These entries can go.

## 2. Questions for her

1. **Lucy Kopf and Alfie Reynolds are on the site twice.** Each is a child in Willow Creek (Kopf and Reynolds households) and a young adult in San Myshuno ("Livin' In The City"). The copies come from two different saves. Are they the same Sims grown up (keep one), or two different Sims?
2. **The Kopfs:** are Leon and Lucy (children) Anja's children, or her younger brother and sister? At the moment nobody in the household is linked, so there's no tree.
3. **Natalie Watson** (Watson-Holmes, hers) lives in Henford-on-Bagley with EA's Watsons. Is she related to Thomas, or is the same name a coincidence?
4. **Where do the elder Greenburgs live?** Mary and Blossom are only on The Portsmouth Promenade, which is a Small Business in the plan. People can't live on that lot type, so they have no home. (In the game they live there.)
5. **Homes the site doesn't show:** the Cahyaputris (Taka Soi 15) and Aloisio Romualdo (Casa Do Corsário) own their rental and live in it. Because the plan says "(own)", the site treats both as businesses, and their household pages show no home. Should "(own)" mean "owns and lives here" for these two? The Robles family uses "(own)" for a rental they don't live in.
6. **The Scotts** are only on The Gnome's Arms, as NPCs. Should they stay without a home?
7. **Linh-Sadya & Linh** is one household of 6 on the site. In the game it's two: the Linh-Sadyas in 11A and Thi Linh alone in 11B. Should they be split into two households, one per unit?
8. **Dynasty heirs.** The game files only name heads. From the wiki:
   - Capp: Beatrice is the heir, and Virgilio is the outcast (he is a "member" on the site).
   - Darong: Jawara is the heir.
   - Thebe: Thiago is the heir.
   - Abrantes: Sofia is the heir.
   
   Use these, or are they different in your save? The Monty dynasty has no head on the site, only Romeo as an outcast (this is the open question on TODO about Juliette and Renaissance Road).
9. **Capp family:** Juliette is Tybalt's sister in the game, but they aren't linked. Should they share two empty parent boxes (or Caliban and Cordelia Capp, who are named on the wiki)? Should Consort Capp, the homeless ghost grandfather, go on the tree as a townie?
10. **Name the empty boxes the wiki can name?**
    - Colin, Karmine's late father (unknown-3). Xochitl isn't shown as his widow.
    - Aghata Ananou, Afua's late mother (unknown-7). Her box is shown as "x" rather than female.
    - Gioia Vatore, Fiorenza Zhu and Vittorio Pasquale. This one is already asked in `townie-wiki-check.md`.
11. **Tight homes** (bedroom counts from her Gallery uploads):
    - Free Spirits: 2 housemates in a 1-bedroom tiny home.
    - Partihaus: 4 adults in 2 bedrooms.
    - Kealoha: a couple, a teen and a toddler in 2 bedrooms.
    
    Fine as they are?

## 3. Lists

### 3a. Households in her plan with no Sims yet (owned worlds, 23)

The EA ones can be filled from the game files the same way as the others ("EA's versions unless she says otherwise"):
- **Pleasant** (Britechester, tenants at Spring Steppes): EA's twins, Lilith and Angela Pleasant ("OddTwins" in the game files). They were missed because they are tenants.
- **Bro & Kennedy** (San Myshuno, 701 ZenView): Sergio Romeo and Joaquin Le Chien are EA's. They are already in the Paragons and Spin Masters clubs, but as empty stubs. "Kennedy" is unknown.

Hers, or still to make:

| World | Household | Lot | Note |
|---|---|---|---|
| Chestnut Ridge | Horse Elder Couple | Duke's Hall | not in any save |
| Chestnut Ridge | Mine | Red Roan Field | not in any save |
| Copperdale | Cheer/Football Teens | Lakeview Library | maybe her Library "Teens!" |
| Copperdale | Chess/Comp Teens | ThrifTea | maybe her Library "Teens!" |
| Del Sol Valley | My Celebs | Chateau Peak | any of the game's celebrities? |
| Newcrest | Single Mum Friends | Midtown Meadows | not in any save |
| Oasis Springs | Elders | Rio Verde | not in any save |
| Ondarion | Alto | Giardino Del Grandioso | vineyard Altos, to create |
| Ondarion | Monty | Renaissance Road | recreated Sims 2 Montys |
| Ravenwood | Specter | Moppy Manor (Specter Row) | which Specters? |
| San Sequoia | Lovejoy 1, Lovejoy 2 | 23 Eucalyptus Lane, Sequoia Cottage | she'll upload them |
| Sulani | Mine | Caldera Camp | not in any save |
| Tomarang | Cadberry | Isda Riverfront | which Cadberrys? |
| Willow Creek | Davidson 1, Davidson 2 | Streamlet Single, Garden Essence | |
| Willow Creek | Ella-Mint Cadberry | Hallow Slough | |
| Windenburg | Tiquelle 1–4 | The Lighthouse, Pier Palace, Dock Den, Von-Windenburg Estate | |

Worlds she doesn't own, also without Sims: Dynamic Daters (Ciudad Enamorada), Rory & Friend and Werewolves in Training (Moonwood Mill), new vampires (Forgotten Hollow), and six Innisgreen households (Nhoam, Ladipo, two Enchanted Lovers, Summerdream, Mystical Besties).

### 3b. Dynasties on the site

| Dynasty | Head | Heir | Others | In groups.json |
|---|---|---|---|---|
| Goth | Mortimer | Cassandra | Bella, Alexander | yes |
| Landgraab | Nancy | Malcolm | Geoffrey; outcast Johnny Zest | yes |
| Capp | Tybalt | – | Beatrice, Celeste, Virgilio; outcast Juliette (not shown) | no |
| Monty | – | – | outcast Romeo (not shown) | no |
| Darong | Adekoya | – | Jawara, Amarachi, Obi | no |
| Thebe | Cordelia V | – | Thiago | no |
| Abrantes | Ermelinda | – | Sofia | no |
| Alto | Enzo | – | – | no |

### 3c. Clubs (members from Sims plus `groups.json`)

All 11 have a leader who is a member: Avant Gardes (Maaike), Garden Gnomes (Moira), Knights of the Hedge (Jacques), League of Adventurers (Elsa), Paragons (Siobhan), Partihaus (Jade), Powerhouse (Marcus), Renegades (Max), Spin Masters (Dominic), The Good Timers (Bjorn), Upper Crusts (Clara). Age rules are kept: League is children only, and Good Timers are teens and up. Two members aren't on the site: Sergio Romeo (Paragons) and Joaquin Le Chien (Spin Masters). Both are waiting for Bro & Kennedy (§3a).

### 3d. Children and teens with no school (28)

- **Teens:**
  - Copperdale: Ash Harjo, Noah Kane, Molly Prescott, Savannah, Sidney Price, Kevin Puri
  - Others: Luz López, Jeb Harris, Rashidah Watson, Kiyoshi Ito, Kaori Nishidake, Duane Talla, Zhafira Cahyaputri
- **Children:**
  - Amy Prescott, Jayden Price, Gideon Harris, Olive Tinker, Aeris and Erin Chavez-Ralston, Dougie Perry
  - Taku and Miki Akiyama, Nanami Ito, Atlas Michaelson, Karmine Luna, Christie Sigworth, Cam Sadya, Wren Grove
- **Pets and foals with the age "Child"** need no school (Bartholomew Jr., Starbrite, Pie, Buttercup). The site might call them kitten and foal instead. That's her call.

### 3e. Checked and fine

- These Sims are in two places on purpose: Skip Broke (Addam Commune, Dustin's father) and Don Lothario (moved out of the Calientes).
- Kenny and Sylvia Cadberry have 5 and 4 traits. That's real: extra slots from aging and rewards.
- Eleanor Sullivan's Babysitter career is the game's adult part-time job.
- Celeste Capp is male in the game too.
- Liên Sadya has both Chánh and Arturo as parents, as in the game.
- Afua is Adekoya's secret daughter, as in the game.
- Partners listed on one side only (Savanna and Chris Winters, Gunther and Cornelia Goth) show correctly, because the page reads the link from either side.
