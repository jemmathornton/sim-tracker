# Townies checked against The Sims Wiki (18 Oct 2026)

Fifteen townie/NPC-ish Sims on the site compared with their Sims Wiki pages (read through the wiki API) and with `research/data/premades.json`. Traits, aspirations, careers and skills on the site match the game files for every Sim. Where the wiki disagrees with the game files, both are given below. The game files win for starting stats.

## Suggested changes (summary)

1. **Dustin Broke: add Skip Broke as his father.** The game files set this up with `loot_Relationship_Starting_NPC_Parent_DaughterSon` (Dustin to Skip, template 454820), and the wiki agrees ("Father, Friend", only with Get Famous + Adventure Awaits). The site has them only as "Friends" and gives Dustin no `parents`. Skip is already on the site (`gibbi-point.json`, id `skip-broke`). This looks like an obvious fix.
2. **Name the Vatore/Zhu placeholders?** The wiki names the people behind the site's empty boxes: `unknown-10` = **Gioia Vatore** (Lilith and Caleb's mother), `unknown-12` = **Fiorenza Zhu** (Lily's mother; the two mothers were sisters) and `unknown-11` = **Vittorio Pasquale** (grandfather of all three). The game's tree has these links (502150 → 502141 → Vatores) but no names in our extract. **Her call.**
3. **Henford Scotts: missing starting relationships.** The game files give Sara a friendship with Agnes Crumplebottom (50, plus a "Henford heart-to-heart" sentiment) and acquaintances (10) with Agatha Crumplebottom, Kim Goldbloom, Lavina Chopra and Michael Bell. They give Simon −20 with Agnes (plus a sentiment) and an acquaintance with Kim Goldbloom. The site shows only Ian Moody and Thomas Watson. That may be because the others have no household on the site, but Agnes is in `people.json`.
4. **Fame details** (Get Famous townies) are on the wiki but not on the site, if she wants them: stars, reputation and fame quirks for Dustin, Venessa and Judith (see below).
5. **Home worlds differ from the game** (probably on purpose, her own placements): Dustin and Venessa are in Del Sol Valley in the game, not Willow Creek or San Myshuno. The BFF household is played in Willow Creek in the game, not Newcrest.
6. **Wiki/game disagreements to note, not fix:** Venessa's second bonus trait (Muser), Vlad's Vampire Lore skill, the vampire ranks, the BFF housemates being acquaintances, and George's "Retired".

## Per Sim

### Dustin Broke (Willow Creek, Broke)
- Wiki: father **Skip Broke** (Gibbi Point), relationship "Father, Friend" (50). See change 1.
- Wiki home: Del Sol Valley. He is one of only three Del Sol Valley Sims who come from an earlier game (with Dirk Dreamer and Holly Alto).
- Extras: 3-star celebrity with a **bad** reputation. Fame quirks are Emotion Bomb and Refined Palate. 26 days from adult.
- Lore: in The Sims 2 he is Brandi's son and Beau's brother (Pleasantview), dating Angela Pleasant. Those are a different timeline, not in TS4.

### Salim Benali (San Myshuno, Benali)
- No differences. Extras: grew up in the Arts Quarter. He reviews places as "SalimtheDream" on EA's San Myshuno map. The name means "safe" in Arabic.

### Diego Lobo (San Myshuno, Lobo)
- No differences. Extras: a feared art critic who has no Painting skill. He reviews places as "TheLoboD".

### Penny Pizzazz (San Myshuno, Pizzazz)
- No differences with the final version. Extras: lives at 1312 21 Chic Street (Fashion District) with §4,000. She once lived in Jasmine Suites. She reviews places as "Pennyforyourthoughts". She is on the City Living box and a city billboard.
- **"Pinku" is not a nickname.** `hH_Template_Pinku` in the game files is the **scrapped early Penny** (pink hair), who never appears in game. Wiki and files agree on her: Computer Whiz, Creative/Outgoing/Ambitious, Quick Learner, Charisma 6, Comedy 7, Cooking 3, Programming 5, Video Gaming 5. Leave her off the site.

### Venessa Jeong (San Myshuno, Jeong)
- **Wiki says two bonus traits (Gregarious + Muser). The game files say only Gregarious.**
- Wiki home: Del Sol Valley. Extras: 1-star, neutral reputation, fame quirk Brushes With Fame. She dyes her hair (brown brows). She is on the Get Famous box and also appears in The Sims Mobile.

### Judith Ward (Del Sol Valley, Ward)
- No differences. Extras: **5-star** (the only premade 5-star celebrity), **awful** reputation. Fame quirks are No Touching, Vain Street, Emotion Bomb and Refined Palate. She starts with the first two milestones of Mansion Baron done. Her bio says she has been married several times, but she has no exes in game.

### George Cahill (StrangerVille, Cahill)
- Wiki career: "Retired". The game files have no career, and the site shows none. Extras: a retired pilot whose plane "Old Penelope" crashed after a flash of light. He lives in its cargo bay. His papers can be searched for clues in the StrangerVille mystery. He appears in EA's StrangerVille comic with Alice Martin, but they have no relationship in game.

### Vladislaus Straud (Forgotten Hollow, Straud)
- **Wiki says Vampire Lore 10 and rank Grand Master. The game files list only Charisma 8 and Pipe Organ 10.** (Lily Zhu's Vampire Lore does come through, so this isn't just missing from our extract.)
- Lore: Count Vladislaus Straud IV, who founded Forgotten Hollow about 200 years ago and was the only survivor of 25 settlers. EA's Seasons blog makes him a cousin of **Arthur Climate** (blog only, not in game). He turned Miss Hell, who turned Caleb. He turned and trained Lilith, and tried to turn Lily Zhu. He dislikes the Vatores but doesn't know them at the start.

### Lilith and Caleb Vatore (Forgotten Hollow, Vatore)
- Mother **Gioia Vatore**, grandfather **Vittorio Pasquale** (see change 2). **Lilith is the older sister.**
- Wiki: the siblings start as Acquaintances (15) and are Friends (50) with cousin Lily Zhu. The game files have only the Lily friendships, as the site does.
- Wiki rank: both Master Vampire. Our extract doesn't read ranks.
- Lore: Lilith was turned and trained by Vlad and "always had a dark side". Caleb was turned by Miss Hell, was a "gentle soul" as a child, is a Guilty Drinker and is shown as bisexual in a teaser. Neither cousin comes from the world they now live in.

### Sara and Simon Scott (Henford-on-Bagley, The Scotts)
- Missing relationships: see change 3. (The wiki's Simon page leaves out Agnes, but the game files have her at −20.)
- Extras: they own The Gnome's Arms across the road, and Sara tends the bar. Sara talked Simon into leaving the city, and he doesn't like cottage life. They want a baby, and there's a spare room for a nursery. The wiki also lists likes and dislikes (Sara: fitness, mixology, video gaming, red, jazz, blues; dislikes electronica and easy listening. Simon: comedy, dancing, purple, hip hop, retro; dislikes mixology and electronica).

### Travis Scott, Liberty Lee and Summer Holiday (Newcrest, BFF)
- **Wiki says all three start as Acquaintances (15). The game files have no relationships for them.**
- Wiki home: Willow Creek (playable household). Extras: the game bio says Summer and Liberty both have feelings for Travis. That goes back to a MySims Kingdom love triangle, but there is no romance in game. Travis is not related to the Henford Scotts. Maxis also put teen versions of all three on the Gallery ("Back in the Day").

## Pages
- https://sims.fandom.com/wiki/Dustin_Broke
- https://sims.fandom.com/wiki/Skip_Broke
- https://sims.fandom.com/wiki/Salim_Benali
- https://sims.fandom.com/wiki/Diego_Lobo
- https://sims.fandom.com/wiki/Penny_Pizzazz
- https://sims.fandom.com/wiki/Venessa_Jeong
- https://sims.fandom.com/wiki/Judith_Ward
- https://sims.fandom.com/wiki/George_Cahill
- https://sims.fandom.com/wiki/Vladislaus_Straud
- https://sims.fandom.com/wiki/Lilith_Vatore
- https://sims.fandom.com/wiki/Caleb_Vatore
- https://sims.fandom.com/wiki/Lily_Zhu
- https://sims.fandom.com/wiki/List_of_minor_Sims (Gioia Vatore, Vittorio Pasquale, Fiorenza Zhu)
- https://sims.fandom.com/wiki/Sara_Scott
- https://sims.fandom.com/wiki/Simon_Scott
- https://sims.fandom.com/wiki/Travis_Scott
- https://sims.fandom.com/wiki/Liberty_Lee
- https://sims.fandom.com/wiki/Summer_Holiday
