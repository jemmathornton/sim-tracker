# EA families: what the wiki adds (overnight 18–19 Oct)

Builds on `research/ea-family-lore.md` (who's who, links, older-game lore) and `research/townie-wiki-check.md` (15 townies). This note covers only what the game files didn't give the site: names for the "Unknown" boxes, late ancestors, dynasty heirs and details, birth surnames, fame and occult ranks, and EA's household bios (in my own words). Research only: nothing in `site/`, `data/` or `tools/` is changed.

- **Source:** The Sims Wiki through its API (18 Oct): every premade Sim page on the site (in her placement), the family and household pages, the family-tree templates, *Dynasty*, *The Sims 4/Patch 193* and *List of minor Sims*. Compared with `data/worlds/*.json`, `data/people.json`, `data/groups.json` and `research/data/premades.json`.
- **Game vs wiki:** where they disagree, both are given. The wiki's Sims 4 pages only; older-game relatives (Chester and Queenie Landgraab, the Sims 2 Montys, Capp in-laws) are left out unless the Sims 4 tree has them.
- The game extract (`premades.json`) has EA's household description for only 3 of 197 households (BFF, Landgraab, Spencer-Kim-Lewis), so the bios below come from the wiki.

---

## Suggested data additions (after her OK)

**A. Name the placeholders in `people.json`** (all named on the game's own tree since patch 193 (Feb 2026), unless marked)
1. `unknown-10` → **Gioia Vatore** (f), Lilith and Caleb's mother. Her father is Vittorio, so she was born a Pasquale (worked out from the tree, not stated).
2. `unknown-11` → **Vittorio Pasquale** (m), grandfather of Lilith, Caleb and Lily Zhu.
3. `unknown-12` → **Fiorenza Zhu** (f), Lily Zhu's mother; also born a Pasquale (worked out). The patch notes spell her "Fiorenzia"; her wiki entry says "Fiorenza".
4. `unknown-13` → **Manu Kealoha** (m), father of Lilliana Kealoha and Duane Talla.
5. `unknown-14` → **Tallulah Grove** (f, late), mother of Umber and Sienna; taught riding; Don Gooseman was her mentor. Their father also died (bio), unnamed.
6. `unknown-15` → **Orodueynna Gomes** (f, late), mother of Tziporah and Esther. Their father is unnamed and also late.
7. `unknown-8`/`unknown-9` → **Cahya** (father) and **Wulan** (mother), both late (the bio blames a microwaved-water accident). The game stores them as "Cahya Bapak" and "Wulan Ibu", Indonesian for "father" and "mother". Question 3.
8. `unknown-3` → **Colin Sullivan** (m, late, died in a fire while cooking): Eleanor's son, Xochitl's husband (Late Spouse), Karmine's father. On the wiki's tree; not confirmed as a game ancestral Sim.
9. `unknown-7` → **Aghata Ananou** (f, late, died in a fire): Ekene's daughter, Afua's mother, Adekoya Darong's lover (wiki tree).
10. No name anywhere: `unknown-1` (Dougie Perry's parent), `unknown-2` (Kaori Nishidake's parent; see question 4), `unknown-4` (Lia Hauata's parent, "Unknown Hauata" on the wiki), `unknown-5` (Rohan Elderberry's parent), `unknown-6` (the Behr sisters' parent; the bio names only a late "Grandma Behr"), `villareal-mother`.

**B. Parents missing on the site** (wiki and bios agree; obvious gaps unless she says otherwise)
1. **Thiago Abrantes** ← Ermelinda Abrantes (she calls him son, Cordelia her daughter-in-law; the Thebe bio says "Thiago of the Abrantes Dynasty").
2. **Mei Prescott** ← **Tai Lum** (bio: "her father, Tai Lum"; Mei was born a Lum).
3. **Thi Linh** ← Arturo Linh (father) and Chánh Linh (stepfather); her sister Liên has parents on the site, Thi has none.
4. **Kasem Bun Ma** ← **Yao** (late), Bua's late boyfriend (her Tomarang secret; on the wiki's tree as "Yao Bun Ma").
5. **Nyon Specter** ← the **Grim Reaper** (Grimborn trait; Grim on his tree since patch 173). Question 6.

**C. Late ancestors on the game's tree** (wiki says "ancestral Sim" stored in the game files; new `people.json` entries, `late: true`)
1. **Capp:** Caliban Capp and Cordelia Capp (both died in a fire), parents of Tybalt and Juliette. Cordelia's parents: Consort Capp (the ghost) and Contessa Capp (late). Consort was born a Thebe, son of Hector and Andromache Thebe.
2. **Thebe:** Cordelia Thebe IV (drowned), mother of Cordelia V; her mother Cordelia III, grandmother Cordelia II, back to Queen Cordelia Thebe I and John Wilson Beard Beard. Cordelia V's father isn't on the tree.
3. **Alto:** Bert Alto (late, elder), Enzo's father. His brother Nick and Nick's wife Vita (both late) are Holly Alto's parents, if Holly is ever added.
4. **Darong:** Ade and Eniola Darong (late), Adekoya's parents; Imani Darong (late), Adekoya's wife and Jawara's mother; an unnamed late husband for Jawara (Amarachi and Obi's father; the bio says he died suddenly). Ade's sister Lina is Dirk Dreamer's great-grandmother (only matters if Dirk is added).
5. **Laurent:** Arnessa's late husband, "Unknown Laurent" (one of her secrets says he died in a fire). Arnessa's parent is "Unknown Thebe" (late); her grandfather is Rodrigo Thebe.
6. **Prescott:** Mei's late husband, "Unknown Prescott".
7. **Not on any tree but in the bios or wiki, lower value:** Ignacio Robles's late wife; Eleanor Sullivan's late husband; Hattie Loden's late husband (Nora's father); Nin Bun Ma's mother; the Koopmans' daughter at university; Mónica López's ex-husband; Noah Kane's father ("Unknown Kane" on the wiki tree) and Ash Harjo's other parent; Kristopher Volkov's parents **Maria and John Volkov** (lore only, from objects and Greg's diary); Ollie Mark's birth parents **Jayde and Skid Mark** (from The Urbz; Crispin's secret dialogue). Gallery-only relatives (Lydia Spencer, Sebastian Michaelson, Merrilyn Ralston, Iggy Pancakes) are already question 9 in ea-family-lore.md.

**D. Dynasties (`groups.json` has only Goth and Landgraab)**
1. Roles: **Beatrice Capp heir** (site: member), **Virgilio Capp outcast** (site: member), **Jawara Darong heir** (site: member), **Thiago Abrantes heir of the Thebe dynasty** (site: member), **Sofia Abrantes heir** (site: member). Consort Capp is a Capp member (he isn't on the site).
2. New group entries for Capp, Darong, Thebe, Abrantes and Alto (and Monty if she wants it; her story makes Romeo and Juliette outcasts), with prestige, unity, ideals, skills, allies/rivals, perks and family words. Table in §Ondarion.

**E. Birth surnames (`born`)**: Eliza Pancakes (Hastings), Geoffrey Landgraab (Osteer; he took Nancy's name), Olive Specter (Muenda; Sims 2 lore, see Windenburg), Ava Harjo (Kane), Mei Prescott (Lum), Liên Sadya (Linh), Dominique Soto (Umeh), Consort Capp (Thebe, if added), Gioia and Fiorenza (Pasquale, worked out). Johnny Zest was born a Landgraab but took a stage name, so that's a name change, not a marriage. Kept their own names on marriage: Alice Spencer-Kim, Octavia Moon, Xochitl Luna, Thiago Abrantes.

**F. Fame (Get Famous stars, reputation, fame quirks)**: Judith Ward 5★ awful (No Touching, Vain Street, Emotion Bomb, Refined Palate); Thorne Bailey 4★ bad (Paparazzi Darling, A Stan); Octavia Moon 3★ good (Juice Enthusiast, Fan Mail); Orange Bailey-Moon 2★ good (Phone Fanatic); Dustin Broke 3★ bad (Emotion Bomb, Refined Palate); Venessa Jeong 1★ neutral (Brushes With Fame); Megumi Ito 3★ great, Naoki Ito 2★ neutral (only with Get Famous installed); Tybalt Capp, Jawara Darong and Cordelia Thebe V 3★ neutral. Not on the site: Holly Alto 3★ good, Dirk Dreamer 4★ good. The wiki also gives a "reputation" (Neutral, Good, Pristine…) for many other Sims; "Pristine" isn't a Get Famous level, so I've left those out.

**G. Occults (`state` plus a new `rank`)**. The game extract tags only vampires, werewolves and mermaids.
1. Spellcasters (missing on the site): Minerva Charm **Master**, Darrel Charm **Adept**, Emilia Ernest **Apprentice**, Gemma Charm **Neophyte**, Grace Anansi and Tomax Collette **Acolyte**.
2. Ghosts (missing on the site): Kai Aether **Phantasmal Ascendant**, Esther Gomes **Wispling**, Zuleika Izadi **Transcendent Wraith**. Consort Capp is also a ghost.
3. Vampire ranks: Vladislaus Straud **Grand Master**, Lilith and Caleb Vatore **Master Vampire**. Vlad's Vampire Lore 10 is still missing (townie check).
4. Werewolf ranks: Kristopher Volkov **Apex**, Lily Zhu **Apex**, Jacob Volkov **Runt**.
5. Nyon Specter's fourth trait is **Grimborn** (inherited). The site lists only Loner and Chased by Death.
6. Lady Ravendancer Goth (NPC, not on the site) is a ghost *and* a spellcaster in the game files (WITCH).

**H. Household bios**: a one-line summary per household below, in my own words. Where they'd go (a `bio` field shown on the household page?) is question 10.

---

## Questions for Jemma

1. **Name the placeholders** in list A (Gioia, Vittorio, Fiorenza, Manu, Tallulah, Orodueynna, Cahya and Wulan, Colin, Aghata)? They're on EA's own tree, so they'd show as late relatives, not empty boxes.
2. **Add the late ancestors** in list C? The Capp and Thebe lines are long (back to Queen Cordelia I). Stop at grandparents, or show the full line?
3. **Cahyaputri parents:** show them as "Cahya Cahyaputri" and "Wulan Cahyaputri", as the game's "Cahya Bapak" and "Wulan Ibu", or just as "Cahya" and "Wulan"?
4. **Kaori Nishidake's parents:** the site has one placeholder (female). The wiki has two late parents: Shigeru and Sachiko's **son** and his partner. Which is right in your game?
5. **Step-parents:** the game (and the site) give these children both adults as parents, but the wiki says one is a step-parent: Takama Aether (Ekade is his stepfather), Olive Tinker (Tina is her stepmother), Knox Greenburg (adopted by Blossom; Mary is his stepmother) and Liên Sadya (Chánh is her stepfather). Show them as step-parents?
6. **Nyon Specter:** add the Grim Reaper as his father (and give Nyon the Grimborn trait)?
7. **Lilliana Kealoha:** the wiki says her father is Manu *Kealoha*, which makes her a Kealoha by birth, married to Makoa *Kealoha*, while her brother is Duane *Talla*. Odd but that's what the tree says. Leave it as the game has it?
8. **Dynasty heirs and outcast** (list D): apply Beatrice, Jawara, Thiago and Sofia as heirs and Virgilio as outcast, and add the five Ondarion dynasty pages?
9. **Fame and ranks** (lists F and G): show stars and reputation on Sim pages, and occult ranks next to the life-state (see the TODO question on showing occults)?
10. **Household bios:** show a short bio on each EA household page (my one-liners, or your own words)?
11. **Ollie Mark's birth parents** (Jayde and Skid Mark, from The Urbz): add them as relatives who aren't in the save, or leave them out?

---

## By world (her placement)

Key: **Unknowns** = placeholders the wiki names; **Ancestors** = late relatives worth a box; **Née** = birth surname; **Fame/Occult** = what the extract missed; **Bio** = EA's household description, summarised.

### Willow Creek
- **Goth.** Ancestors: already on the site (Cornelia, Gunther, the Crumplebottoms). Heir: Cassandra (site has it). Née: Bella Bachelor (on the site). Bio: a gloomy, aristocratic family; Mortimer writes dark stories, Bella keeps vanishing, and the question is whether the children turn out gloomy too.
- **Villareal.** Unknowns: the children's mother has no name anywhere; the bio only says she "disappeared". Bio: a widowed eccentric in a huge mansion with teenage twins and a wild youngest son.
- **Bjergsen.** Bio: teenage music prodigy Sofia wants fame despite a gloomy dad, a perfectionist mum and a genius little sister.
- **Broke (Dustin).** Fame: 3★, bad reputation (in townie check). Bio (game): a rebel who secretly wishes someone would tell him what to do.
- **Pancakes.** Née: Eliza Hastings. Gallery extra: their toddler Iggy (lore question 9). Bio: an unhappy marriage where neither can please the other.
- **Spencer-Kim-Lewis.** Ancestors: Lydia Spencer, Dennis's ex-wife and Alice's mother, is named only in the bio (she may be related to Francine Spencer, the wiki guesses). Alice kept her own name. Bio: three generations from two families under one roof after a divorce and a marriage.

### Oasis Springs
- **Landgraab.** Heir: Malcolm (on the site); Johnny an outcast (on the site). Née: Geoffrey Osteer. The wiki's Chester and Queenie Landgraab are Sims 3 only. Bio: a picture-perfect rich family where both parents hide secrets.
- **Caliente.** Nothing new in Sims 4 terms (the twins' "real" parents Flamenco and Nighat are older-game lore). Bio: Katrina has moved her freeloading younger boyfriend Don into a house of three women.
- **Lothario.** No relatives in the Sims 4. Bio: his description is the Caliente one above.
- **Curious (Nova).** Parent: the wiki says Vidcund *or* Lazlo Curious (unclear); a cousin of Tycho. Bio (scenario): a top programmer starting her first job, who may run into her university rival again.

### Newcrest
- **BFF.** Nothing new (see townie check). Bio: three unlikely friends, with two of them falling for the third.

### Windenburg
- **Fyres.** Bio: a happy couple whose daughters clash; party girl Morgan against social climber Siobhan.
- **Munch.** Bio: a hard-working single mum with an adult son who won't move out, a gloomy rebel and a sweet youngest.
- **Partihaus.** Bio: four party housemates in a former factory, with barely one job between them.
- **Free Spirits.** Bio: two unmaterialistic housemates, a writer and a painter, hoping to sell some work.
- **Specter (her Specter Row).** Nyon's father is the Grim Reaper (question 6); that one is in the Sims 4. Older-game lore only (Sims 2, the wiki's general intro): Olive was born a Muenda (parents Peponi and Lerato), and her late husbands Hugh Thanasia, Rigger Mortis and Ichabod Specter are buried in her garden. The Sims 4 bio only hints at the husbands, and the game's tree doesn't have them. So list E's "Olive (Muenda)" is older-game; drop it if she keeps to the Sims 4. Bio: Olive's husbands all died suddenly, she's now engaged to musician Layne Coffin, and Death keeps an eye on the house because of Nyon.

### San Myshuno
- **Behr.** Unknowns: none named; the bio mentions only a late "Grandma Behr". Bio: two sisters who inherited their grandmother's home; a DJ and her hacker little sister.
- **Benali.** Bio: a would-be writer from the Arts Quarter who keeps putting it off.
- **Bheeda.** Bio: a baby on the way in a tiny flat; will Jesminder keep her mixology job or paint at home?
- **Jang.** Bio: moved to the city for Baako's comedy career and Anaya's choice between singing and painting; their daughter barges into the neighbours' flats.
- **Jeong (Venessa).** Fame: 1★ neutral. Bio: a small-town actress hoping for her big break (in the game she lives in Del Sol Valley).
- **Lobo.** Bio: the art critic whose verdict makes or breaks artists.
- **Pizzazz.** Bio: the city's top trend-spotter, maybe too busy for romance.
- **Rasoya.** Bio: a successful chef whose mother nags him to settle down.
- **Feng.** Bio: a politician and a businesswoman secretly plotting to take over the city.

### Forgotten Hollow
- **Straud.** Rank: Grand Master; Vampire Lore 10 missing. Bio: the latest Count in a line of "ancestors" who all look strangely alike.
- **Vatore.** Unknowns: Gioia Vatore (`unknown-10`), Vittorio Pasquale (`unknown-11`). The tree also has an "Unknown Vatore" father. Ranks: both Master Vampire. Bio: siblings who moved to town a few years ago and don't get on with Vlad (they say it's a difference in taste).

### Brindleton Bay
- **Delgato.** Bio: a stay-at-home mum who dreams of buying the local vet clinic.
- **Hecking.** Bio: newlyweds, a painter and an explorer, who both want to take the dog out.
- **Lynx.** Bio: a cat lady whose home every stray finds.

### Del Sol Valley
- **Zest (Johnny).** Born a Landgraab; outcast (on the site). Bio: disowned for leaving school, he wants to make it as a stand-up comedian (talent uncertain).
- **Roomies.** Bio: a sitcom-style house of four mismatched housemates.
- **Bailey-Moon.** Fame: Thorne 4★ bad, Octavia 3★ good, Orange 2★ good (quirks in list F). Octavia kept her name. Bio: a celebrity couple where she writes his hits; after his social-media slip, fans are noticing she's the real talent.
- **Ward.** Fame: 5★ awful. Bio: a ruthless acting legend, married several times (no exes in the game).

### StrangerVille
- **Cahill.** Bio: a retired pilot living in his crashed plane after a strange flash of light.
- **Roswell.** Bio: the town's oldest family; the mayor pushes technology and hides things at the Secret Lab.
- **Sigworth.** Bio: newcomers; Jess transferred to the base and her husband and daughter notice she's changing.

### Sulani
- **Hoapili.** Unknowns: `unknown-4` = "Unknown Hauata" on the wiki; the wiki notes the game leaves the parent link blank, so Keala may be a teacher-grandmother rather than a blood one. Bio: the town's wise grandmother teaching Lia the island's culture.
- **Kahananui.** Bio: a retired couple, self-styled island ambassadors, in a quiet retreat.
- **Kealoha.** Unknowns: `unknown-13` = Manu Kealoha (question 7). Bio: a young, close, traditional island family.
- **Ngata.** Bio: Leila came for inspiration and fell for the islands, Oliana and her son.

### Glimmerbrook
- **Charm.** Occult: all spellcasters; Minerva Master, Darrel Adept, Emilia Apprentice, Gemma Neophyte. Bio: a long line of spellcasters; Gemma resents the pressure, Darrel duels and is engaged to newly turned Emilia.
- **Amicable Acolytes.** Occult: both Acolytes. Bio: housemates racing each other to Adept.

### Britechester
- **Best of Friends.** Bio: friends since kindergarten, starting university together.
- **Fletcher.** Bio: a keen student who struggles to make friends.
- **Elderberry.** Unknowns: `unknown-5` unnamed. Bio: a couple who've lived in the area all their lives; their teenage grandson has moved in before university.

### Evergreen Harbor
- **Greenburg and Knox Greenburg.** Knox is Blossom's adopted son and Mary's stepson (question 5). Bio: an older couple brightening the town with gardens and murals; their eco-activist son sometimes fights too literally.
- **Harris.** Bio: a cheap heritage house that seems too good to be true, Cletus's free-spirited mother, a son with a bag on his head, and only one job between them.
- **Sterling Rico.** Bio: a money-minded couple, a civil designer and a style influencer.
- **Tinker.** Olive is Yasemin's daughter; Tina is her stepmother (question 5). Bio: an overworked crafter, a wife who wants her to slow down, and a daughter who wants to follow them both.

### Mt. Komorebi
- **Akiyama.** Fame: Kado and Jenna have a "good" reputation but no stars. Bio: moved to Kado's home town; his childhood sweetheart Megumi is back too.
- **Ito.** Fame: Megumi 3★ great, Naoki 2★ neutral (with Get Famous). Bio: two former champions; he wants tourism and development; the son has a crush.
- **Nishidake.** Unknowns: `unknown-2` (question 4). Fame: Sachiko "great" reputation, no stars. Bio: guardians of the mountain; Shigeru feuds with the Itos, while orphaned granddaughter Kaori loves skiing and the Ito boy.

### Henford-on-Bagley
- **Cecilia Kang.** Bio: left the city after heartbreak for a garden and chickens; one bad date with Michael Bell.
- **Moody & McMillan.** Bio: Derek left office life for his family cottage with Ian; they fend off developers and enjoy retirement.
- **The Scotts.** Bio: they run the village pub, Sara's dream; city boy Simon is still nervous of chickens; they want a baby.
- **The Watsons.** Bio: Thomas inherited the farm and is struggling; Rahmi's affections have wandered; the eldest dreams of leaving.

### Tartosa
- **Laurent.** Ancestors: Arnessa's late husband ("Unknown Laurent", died in a fire); her parent "Unknown Thebe" and grandfather Rodrigo Thebe. Her tie to the Ondarion Thebes: patch 193 calls her a second cousin of Caliban Capp and Cordelia Thebe IV. The wiki elsewhere makes Consort her first cousin once removed, so the wiki isn't consistent here. Bio: an old wedding-venue family under a newer name; Hilary cooks at her parents' restaurant.
- **Markovic.** Bio: wedding musicians who keep putting off their own wedding, partly because of friction with the Laurents and Lucia's history with Hector.
- **Soto.** Née: Dominique Umeh. Bio: married in Tartosa years ago, came back every year, and now retired there; a painter and a local historian.
- **Monticapp.** Née: Juliette Capp (on the site). Ancestors: Juliette's late parents Caliban and Cordelia Capp; grandfather Consort Capp (ghost). In the game Juliette heads the Monty dynasty with Dante as heir; her story makes them outcasts of both (decided 18 Oct). The game gives Romeo no relatives. Bio (game's Monty household): Juliette lost her rank and fortune for love, is happy with Romeo and their kind son, but dreams of winning it all back.

### Moonwood Mill
- **Volkov.** Ranks: Kristopher Apex, Jacob Runt, Lily Zhu Apex. Unknowns: Lily's mother Fiorenza Zhu (`unknown-12`). Lore: Kristopher's parents Maria (founder of the Moonwood Collective, the first mooncaster) and John Volkov; Jacob was born in Evergreen Harbor. Bio: the long-lived founder of the werewolf pack who takes in lost wolves.

### Copperdale
- **Harjo.** Née: Ava Kane. Unknowns (wiki tree, not on the site): Noah's father "Unknown Kane"; Ash's other parent "Unknown". Bio: brought together by food; she runs the school canteen, he washes up; Ash is an influencer, Noah has a secret crush on Sidney Price.
- **Prescott.** Née: Mei Lum. Missing parent: Mei ← Tai Lum. Ancestor: Mei's late husband. Bio: the principal of the high school, still grieving, smothering her daughters, in the old family house with her father, the school janitor.
- **Price.** Bio: high-school sweethearts back in their home town with three children and an exchange student.

### San Sequoia
- **Michaelson.** Gallery: Celeste's father Sebastian. Bio: met at a start-up, adopted two children to raise as fellow nerds.
- **Robles.** Ancestor: Ignacio's late wife (unnamed). Bio: an old fishing family who know everyone.
- **Robles-Ruano.** Bio: unconventional, expressive parents hoping their clingy daughter gains confidence.
- **Luna-Sullivan.** Unknowns: `unknown-3` = Colin Sullivan. Bio: after Karmine's dad died in a cooking accident, her silly grandmother moved in to help.

### Chestnut Ridge
- **The Grove Family and Sienna & Flapjack.** Unknowns: `unknown-14` = Tallulah Grove. Both parents are late (bios). Bio (Groves): childhood sweethearts on the family ranch; their son trains a foal. Bio (Sienna): a champion rider running the equestrian centre.
- **Gooseman.** Link: mentor to Tallulah Grove. Bio: a retired horse champion living simply with his horse Duke.
- **The Nectar Making Duo.** Bio: an ambitious networker and a careful expert trying to make a name in nectar.

### Tomarang
- **Bun Ma.** Ancestor: Yao, Bua's late boyfriend and Kasem's father (list B). Nin's mother is unnamed. Bio: a traditional family; Bua made her son's family move in so she could help raise Sud.
- **Cahyaputri.** Unknowns: Cahya and Wulan (`unknown-9`/`unknown-8`; question 3). Bio: after losing their parents, the elder sister is guardian to a teenager and landlady to tenants.
- **Linh-Sadya & Linh.** Née: Liên Linh. Chánh is the girls' stepfather (question 5); Thi has no parents on the site (list B). Bio: a busy three-generation household that pays its way from several incomes; Thi lives in the unit below.

### Ciudad Enamorada
- **Nadir.** Bio: teenage sweethearts from the countryside; she's now the city's matchmaker and he feels left behind.
- **López.** Ancestor: Mónica's ex-husband left to sculpt garden gnomes (not in the game). Bio: Mónica falls for Manuel Aguilar, her son's old classmate.

### Ravenwood
- **Aether.** Occult: Kai is a ghost (Phantasmal Ascendant). Takama is Kai's son, Ekade's stepson (question 5). Bio: Kai died after a mix-up with a crow and doesn't believe he's a ghost.
- **Gomes.** Unknowns: `unknown-15` = Orodueynna Gomes. Zelmira's distant ancestor is Lady Ravendancer Goth (in ea-family-lore.md). Bio: the parents tried being ghosts and came back; Radwan keeps his clumsy wife alive; Zelmira studies the afterlife.
- **Izadi-Gomes.** Occult: Esther ghost (Wispling), Zuleika ghost (Transcendent Wraith). Bio: Esther took in newly dead Zuleika (a cowplant accident) and is teaching her to be a ghost.

### Nordhaven
- **Koopman.** Unknown: their daughter at university (the wiki tree has her as "Unknown Koopman"). Bio: a pottery family whose long marriage is cooling, with gossip about Gert.
- **Loden.** Ancestor: Hattie's late husband, Nora's father. Bio: the family that has always run the café; Nora worries about who takes over.
- **Sarpong.** Bio: a tattoo artist back home with a daughter, opening her own studio.
- **Urbane Housesharers.** Lore: Ollie's birth parents are Jayde and Skid Mark (question 11). Bio: a jazz singer saving for his own lounge shares with Crispin and his adopted teen.

### Gibbi Point
- **Addam Commune.** Skip Broke is Dustin's father (already fixed). Bio: the prickly couple behind Love Highland plus two housemates.
- **Chavez-Ralston.** Gallery: Nigel's mother Merrilyn Ralston. Bio: a camp director and counsellor with very different twin daughters.
- **Perry.** Unknowns: `unknown-1` unnamed. Bio: a fitness-retreat owner raising her shy grandson.

### Ondarion
- **Capp.** Heir **Beatrice**, outcast **Virgilio** (site: both members). Ancestors: Caliban and Cordelia Capp (parents, fire), Consort (ghost; born a Thebe) and Contessa Capp. Fame: Tybalt 3★ neutral. Bio: Tybalt, the top noble since ousting Juliette, eyes the crown; his three grown children won't settle down. Consort's own bio: back as a ghost to make his descendants behave.
- **Darong.** Heir **Jawara** (site: member). Ancestors: Ade and Eniola (Adekoya's parents), Imani (his late wife), Jawara's late husband. Fame: Jawara 3★ neutral. Bio: a philanthropic family; Adekoya wants Jawara to be queen, but her husband's sudden death and snooping rivals threaten that.
- **Thebe.** Heir **Thiago** (site: member). Missing parent: Thiago ← Ermelinda. Ancestors: Cordelia Thebe IV (drowned) and the line of Cordelias. Fame: Cordelia V 3★ neutral. Bio: back from the sea and married into the Abrantes, but will she really rule, or sail off again?
- **Abrantes.** Heir **Sofia** (site: member). Bio: Ermelinda should retire after her son's good marriage, but keeps scheming; teenage Sofia notices the court scandals.
- **Ananou.** Unknowns: `unknown-7` = Aghata Ananou. Bio: a playful, prank-loving family; Ekene raises his granddaughter, whose father is a secret (gifts turn up in the post).
- **Enzo Alto.** Ancestor: Bert Alto (father). His mother is alive but unnamed (her plan adds her). Bio: his mother calls him the kingdom's top bachelor and wants him to grow up; his many exes disagree.
- **Aloisio Romualdo.** Bio: a schemer who moved from Dambele to his father's home district to profit from the noble–commoner divide.

**Dynasty details (wiki *Dynasty* page)**

| Dynasty | Head | Heir | Outcast | Prestige | Unity | Ideals | Skills | Allies / rivals | Family words |
|---|---|---|---|---|---|---|---|---|---|
| Capp | Tybalt | Beatrice | Virgilio | 7 | Crisis | Diplomatic, Connoisseur, Artistic | Piano | ally Alto; rival Monty | Bound By Honor |
| Monty | Juliette | Dante | – | 1 | Neutral | Passionate, Hardworking | Gourmet Cooking | rival Capp | – |
| Darong | Adekoya | Jawara | – | 7 | Neutral | Scholarly, Caring, Artistic | Painting, Writing | – | Strength Through Union |
| Thebe | Cordelia V | Thiago | – | 8 | Stability | Bold, Jolly, Nature-Loving | Swordsmanship, Logic, Mixology | ally Abrantes | We Ride The Storm |
| Abrantes | Ermelinda | Sofia | – | 5 | Neutral | Devious, Connoisseur | Mischief | allies Thebe, Landgraab | – |
| Alto | Enzo | – | – | 3 | Neutral | Devious, Connoisseur, Passionate | Charisma | ally Capp; rival Landgraab | – |
| Goth | Mortimer | Cassandra | – | 3 | Neutral | Passionate, Mysterious | Writing, Charisma | – | – |
| Landgraab | Nancy | Malcolm | Johnny Zest | 5 | Neutral | Devious, Connoisseur | Mischief, Charisma | ally Abrantes; rival Alto | – |

Perks (bought with prestige): Capp: Nepotism 1, Tutor, Market Manipulator, Arrange Promotion, Gracious Host 3, Friends in High Places 3, Social Affinity. Darong: Grade Boost 3, Tutor, Arrange Promotion, Respected Head 2, Gracious Host 2, Friends in High Places 1, Mental and Creative Affinity. Thebe: Nepotism 3, Arrange Promotion, Respected Head 3, Easier Alliances 2, Matchmaker 3, Physical Affinity. Abrantes: Grade Boost 2, Tutor, Market Manipulator, Discreet 3, Easier Alliances 1, Social Affinity. Alto: Market Manipulator, Easier Alliances 1, Matchmaker 2, Friends in High Places 1. Monty: Nepotism 1. Goth: Grade Boost 1, Tutor, Respected Head 1, Matchmaker 1, Creative Affinity. Landgraab: Nepotism 2, Market Manipulator, Arrange Promotion, Discreet 2, Gracious Host 1, Easier Alliances 1, Friends in High Places 1, Social Affinity. Each dynasty also has a one-line game description (on the wiki page) that could go on its group page in her own words.

---

## Pages
- https://sims.fandom.com/wiki/The_Sims_4/Patch_193 (the relatives added in Feb 2026)
- https://sims.fandom.com/wiki/Dynasty
- https://sims.fandom.com/wiki/List_of_minor_Sims (Gioia Vatore, Vittorio Pasquale, Fiorenza Zhu, Orodueynna Gomes, Lydia Spencer, Maria and John Volkov)
- Family-tree templates: `https://sims.fandom.com/wiki/Template:<Name>_Family_Tree` (Vatore Zhu, Kealoha, Grove, Goth-Gomes, Cahyaputri, Luna-Sullivan, Dreamer (Darongs), Capp-Thebe-Laurent, Alto, Bun Ma, Nishidake, Prescott-Lum, Harjo, Koopman, Hoapili-Hauata, Elderberry)
- Ancestor pages: Caliban Capp, Cordelia Capp, Consort Capp, Cordelia Thebe IV, Bert Alto, Jayde, Skid Mark
- Each premade Sim's page and each family page: `https://sims.fandom.com/wiki/<Name>`; disambiguated ones: Harris family (Evergreen Harbor), Tinker family (Evergreen Harbor), Perry family (Gibbi Point), Scott family (Henford-on-Bagley), Soto family (Tartosa), Roomies household (Oasis Springs)
