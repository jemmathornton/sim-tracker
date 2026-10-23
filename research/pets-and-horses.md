# Pets and horses: EA’s animals, her pet places, and showing them (overnight 17 Oct)

> Out of date since 19 Oct: option A is built (animals table, animal tree, pet pages); see research/decisions/pets.md.

Research only. Nothing on the site, in `data/`, `tools/` or `TODO.md` is changed, and nothing is committed.

**Sources:**
- The Sims Wiki, fetched through its API on 17 Oct: every premade pet and horse, their households, the world pages, the pack pages, and the pages on pets, horses, strays, breeding, pet traits, small pets and the vet clinic.
- The game’s own files, read only: the lot-type (venue) settings and the English game text (the Equestrian Center, competitions, breeding, the vet lesson, rental rules).
- Her plan in `data/worlds/*.json`, her Gallery texts, `research/sims-display.md`, `research/ea-family-lore.md`, `research/lot-trait-ideas.md`, `research/townies-and-roles.md` and TODO.md.

## Headlines

- **EA ships 17 named animals:** 7 pets in Brindleton Bay households, 4 horses in Chestnut Ridge, 2 stray townies in Brindleton Bay, and 4 pets with For Rent tenant households (in no world until they move into a rental).
- **Only two animal family links are in the game:** Josie → Bartholomew Jr (cats, Lynx household) and Luna → Starbrite (horses, Groves). A SimGuru said the Delgatos’ Bartholomew Sr is Jr’s father, but in the game they’re unrelated.
- **Her plan:** 5 vets in 4 worlds (1 built), 16 lots with a cat or dog visitor trait in 7 worlds, and 7 horse homes (6 in Chestnut Ridge, plus Paradise Stables). 14 of her 25 owned worlds have nothing for animals.
- **Gaps:** no vet in the city area or the desert worlds. No public stop for horses in New Appaloosa since Duke’s Hall became a home. Appaloosa Stables is a full household (2 Sims + 6 horses = 8). Dogs are welcome at only 2 community lots.
- **Showing them:** pets fit the roster planned in `sims-display.md`, with their own tab on the family tree where there are young ones (recommended, §4).

---

## 1. EA’s premade animals

### In households

| World | Household (game home → her plan) | Animals |
|---|---|---|
| Brindleton Bay | Delgato (Chateau Frise → same, not built) | **Blue**, dog, adult female, Shar Pei (Adventurous, Smart, Friendly); knows no commands. **Bartholomew A. Bittlebun Sr**, cat, adult male, Persian (Playful, Skittish, Talkative) |
| Brindleton Bay | Hecking (It’s A Good House → same, not built) | **Rosie**, dog, adult female, French Bulldog (Loyal, Glutton, Playful); knows heel, shake, speak and sit |
| Brindleton Bay | Lynx (Catscratch Cottage → a unit at Tail’s End) | **Doc**, cat, elder male, Siamese (Glutton, Talkative, Aloof). **Cleo**, cat, adult female, Sphynx (Clever, Friendly, Curious). **Josie**, cat, adult female, Abyssinian (Prowler, Free Spirit, Mischievous). **Bartholomew A. Bittlebun Jr**, kitten, male, mixed breed (Fluffy, Spoiled, Affectionate), Josie’s son |
| Chestnut Ridge | Grove (Biscuit’s Bastion → same, not built) | **Luna**, horse, adult mare, Mustang Cross (Mellow, Intelligent, Friendly), Umber’s childhood rescue horse. **Starbrite**, foal, female, Mustang (Energetic, Friendly, Needy), Luna’s daughter; Wren is training her |
| Chestnut Ridge | Sienna & Flapjack (Champion’s Grove → same, not built) | **Flapjack** (“Salt Lake Flapjack”), stallion, Nez Perce (Friendly, Intelligent, Brave). Skills 10 agility, 10 endurance, 9 jumping, 10 temperament. Several-time Ultimate Horse Championship winner with Sienna |
| Chestnut Ridge | Gooseman (Canyon Crossing → same, not built) | **Duke**, stallion, Clydesdale (Brave, Mellow, Free Spirit). Skills 10, 10, 8, 10. Don’s champion horse; Duke’s Hall is named after him |

### Without a home

| Who | What | Where |
|---|---|---|
| **Mayor Whiskers** | Stray tuxedo cat (Friendly, Talkative, Aloof). The locals elected him mayor (a painting in the game says so). Can be adopted once befriended | Brindleton Bay |
| **Captain Whitaker** | Ghost dog, Chesapeake Bay Retriever (Vocal, Adventurous, Playful); knows “play dead”. The game’s only premade dead pet; can be adopted. His grave is the build-mode sculpture “Tomb of the Unknown Pupper” (§700) | Brindleton Bay |
| **Kham** (For Rent tenants) | Dara Kham, a teen, and **Hanoi**, Chihuahua, one random trait | Only as rental applicants |
| **Lu** (For Rent tenants) | Kitty Lu, an elder Cat Lover, and three cats: **Bugella** (Sphynx; Frisky, Playful, Clever), **MacGoober** (calico; Glutton, Lazy, Territorial), **Mrs. Love** (Himalayan; Affectionate, Fluffy, Spoiled) | Only as rental applicants |

### Links and people around them

- **Animal family:** Josie → Bartholomew Jr and Luna → Starbrite (mothers only; no fathers given). The SimGuru’s Bartholomew Sr → Jr link is from a livestream; the wiki marks it “citation needed” and says the two have never met.
- **Don Gooseman** mentored Sienna and Umber’s late mother, who taught riding.
- **Roberto Crinkletop**, the hidden “Mysterious Rancher” NPC who wanders Chestnut Ridge, is **Robert Crumplebottom**: Agnes Crumplebottom’s ex-husband, who faked his death to leave Henford (EA video, Aug 2023). That’s a Henford–Chestnut Ridge link missing from `ea-family-lore.md`.
- The **Horse Trainer** NPC works by the Equestrian Center. Sienna runs the centre in her bio.

### Other packs’ animals (none are premade in a household)

| Animal | Pack (she owns it?) | How it lives |
|---|---|---|
| Hamster, rat, pygmy hedgehog, miniature bubalus | My First Pet Stuff (yes) | In a cage. No traits, life stages or breeding; can die; can pass on Rabid Rodent Fever |
| Mini goats, mini sheep | Horse Ranch (yes) | Carried in a Sim’s inventory; milk and wool once a day; die of old age |
| Cows, llamas, chickens | Cottage Living (yes) | In a shed or coop; only chickens breed. Wild foxes, rabbits and birds roam Henford |
| Crows | Life & Death (yes) | On a perch; bring gifts, learn to mimic Simlish; provoke them too often and it’s death by murder of crows |
| Familiars | Realm of Magic (yes) | Spellcasters can bind a cat or dog as a familiar, which suits Glimmerbrook |
| Fairies tending animals | Enchanted by Nature (no) | Fairies can meet animals’ needs and cure sick cats and dogs |

- Lovestruck adds no animals, and Adventure Awaits adds Imaginary Friends, which aren’t animals.
- In Cats & Dogs a fox is a small dog breed and a raccoon is a cat breed.
- A unicorn is a horse with a horn: looks only, no powers.

---

## 2. The game’s rules

**Households and ageing**
- Cats, dogs and horses are household members and count towards the 8. Goats, sheep, livestock, rodents and crows don’t.
- Life stages: kitten, puppy or foal, then adult, then elder. Pets die only of old age.
- The ageing settings cover Sims, cats, dogs and horses. Small animals have their own “Animal Aging” switch.
- Neighbourhood Stories can “Adopt Cats & Dogs” and “Rescue Horses” for other households, so unplanned animals can turn up.

**Breeding**
- Cats and dogs have litters of 1–3.
- Horses have one foal at a time: an adult or elder stallion with an adult mare, and the two must be friendly.
- Curious, Playful and Hardy only come through breeding. A foal of a Championship horse may get **Champion Genes** (faster skills, worth more). So horse lines matter in play.

**Strays**
- Strays roam only Brindleton Bay (and Selvadorada, through Jungle Adventure).
- Elsewhere they only come to lots with Cat Hangout or Dog Hangout. Sims adopt a stray once they’ve befriended it.

**Rentals:** a property owner can set **No Pets** on a unit. Breaking it means a §1,000 fine.

**Horses**
- There is no ranch lot type. Feeders, troughs, horse beds, jumps, barrels and the Ranch Community Board are ordinary build-mode objects.
- Horses live with a household, so on a home lot.
- The game’s settings let visiting NPC horses come only to **Residential, Residential Rental, Tiny Home and Haunted House** lots.
- A community lot can still have horse care: EA’s Duke’s Hall park did.
- Apartments and University Housing: not checked.
- Horses travel with their Sims. Chestnut Ridge is the world built for riding: Galloping Gulch trails, camp spots, public jumps and barrels, the ghost horse, Dreadhorse Caverns.
- Horses are bought (§1,000) or rescued (§250, with harder traits) through the Ranch Animal Exchange, a Ranch Community Board, a computer or the Equestrian Center.

**Competitions**
- They’re held at the **Hay Now! Equestrian Center**, a rabbit hole in New Appaloosa (Chestnut Ridge), open 7 am to 7 pm.
- To enter, travel with a horse to **any lot in New Appaloosa**, or use a Ranch Community Board.
- Four events: Barrel Racing, Endurance Racing, Show Jumping and Western Pleasure.
- Divisions are Beginner, Intermediate, Expert and Master. A horse must place in the top 3 to move up a division.
- The **Ultimate Horse Championship** is on Saturdays, for horses that have placed in every Master event.
- One event per horse per day; no foals or pregnant mares.
- The game sends riders to Duke’s Hall for horse care before they compete.

**Vet Clinic**
- Needs at least an **Exam Table, a Vet Podium and a bin**. A Surgery Station, Medicine Crafting Table and Medicine Vending Machine are recommended.
- A household buys and runs it, like a restaurant, and can sell it on with “Sell Venue”. Otherwise NPC vets run it.
- A new clinic starts at 1 star.
- **Cats and dogs only:** the game’s text has no horse illnesses and no horse vet visits.
- Allowed in every world.
- Recent fixes: clinics stuck at 3 stars (Nov 2025); black pet textures after a day at the vet (Jun 2026, not retroactive).

**Lot traits** (details in `lot-trait-ideas.md`)
- Cat/Dog Hangout: strays visit. Not on vets, spas, restaurants or onsens.
- Cat/Dog Friendly: owners bring their pets. Community lots only, and not on small businesses, retail, spas, restaurants, vets, onsens or cemeteries.
- Training Ground: faster pet training (dog tricks, obstacle courses), not horses.
- Breeding Ground: bigger litters when pets mate on the lot.
- Wild Prairie Grass (a challenge): hay for horses; any lot.

**Patch 196 (17 Mar 2026)** fixed pet and horse data going missing in premade households, but only in new saves.

---

## 3. Her pet places

### Counts

| Kind | Lots | Worlds | Built |
|---|---|---|---|
| Vet Clinic | 5 | 4 | 1 (Creek Clinic) |
| Cat Hangout | 10 | 5 | 9 (Glimmer & Books isn’t) |
| Dog Hangout | 7 | 4 | 7 |
| Cat Friendly / Dog Friendly | 1 / 2 | 1 / 2 | all |
| Training Ground / Breeding Ground | 4 / 1 | 2 / 1 | all |
| Horse homes | 7 | 2 | 4 (Appaloosa Stables, Red Roan Farm, Palomino Junction, Paradise Stables) |
| Wild Prairie Grass | 3 | 1 | 3 |
| Empty farms (no animals planned) | 2 | 2 | 0 |

### World by world

| World | Vet | Pet traits | Horses, farms | Notes |
|---|---|---|---|---|
| Willow Creek | – | Magnolia Blossom Park (Cat and Dog Hangout) | – | The only place strays come in the city area |
| Windenburg | The Summer Home (not built, no owner) | The Shrieking Llama (Dog Friendly, Dog Hangout) | – | Coorinberg Cottage’s upload has “room for all your plants, animals” |
| Selvadorada | – | none needed (the game sends strays) | – | Hillside Hideaway: “you can even bring your dog” |
| Brindleton Bay | Brindleton Pawspital (not built, no owner); Creek Clinic (the Venturas, built; Training and Breeding Ground) | Pupperstone Park (Dog Friendly, Dog Hangout, Training Ground); The Bay Café (Cat Friendly, Cat Hangout); Tail’s End units 1 and 3 (Cat Hangout); Brindleton Boathouse, Bedlington Barn (+ Training Ground), Hindquarter Hideaway (Dog Hangout) | Hound’s Head (64×64, “Farm”, empty, not built). Its game text says it “has housed a variety of rich and powerful pets (and their owners)” | 7 premade pets, 2 strays. The Lynx cats go to Tail’s End unit 3 (suggested) |
| Sulani | – | Ohan’ali Beach (Dog Hangout) | – | |
| Glimmerbrook | – | Glimmer & Books (Cat Hangout) | – | Spellcasters’ cats can be familiars |
| Britechester | – | Mossy Lane, Spring Steppes unit 1 (Cat Hangout) | – | |
| Henford-on-Bagley | 2 Olde Mill Lane (the Watson-Holmes, who live next door; not built) | 3 Cobblebottom 3A, Finchwick Village Hall, 3 Olde Mill Lane, Cordelia’s Secret Cottage (Cat Hangout) | Livestock and foxes; no horses | Michael Bell is the creature keeper |
| Chestnut Ridge | Canter Clinic (not built, no owner) | Red Roan Farm (Training Ground) | Champion’s Grove (Sienna and Flapjack), Biscuit’s Bastion (Groves, Luna and Starbrite), Canyon Crossing (Don and Duke), Appaloosa Stables (elder couple, 6 horses), Palomino Junction (the Palumbos’ horse rescue), Red Roan Farm (hers: horses, dogs, mini sheep, hens). The Cozy Corner House: community farm (goats, sheep). Wild Prairie Grass on Appaloosa, Red Roan and Palomino | The Equestrian Center is in New Appaloosa |
| Ravenwood | – | – | Hay Hill Landing (64×64, “Vineyard/Farm”, empty) | Crows are Ravenwood’s pet |
| Gibbi Point | – | – | Paradise Stables (horses; residents to decide) | |

**Nothing for animals (14 owned worlds):** Oasis Springs, Newcrest, Granite Falls, Magnolia Promenade, San Myshuno, Del Sol Valley, StrangerVille, Evergreen Harbor, Mt. Komorebi, Copperdale, San Sequoia, Tomarang, Nordhaven and Ondarion. The same goes for the 5 worlds she doesn’t own. Pets can still live in any of them; this is about places.

### Gaps

1. **Vets against pets.**
   - Four worlds have pet traits but no vet: Willow Creek, Sulani, Glimmerbrook and Britechester.
   - By area, the city area (San Myshuno, with Newcrest and Willow Creek as suburbs and Magnolia Promenade beside them) has no vet. Neither do the desert worlds (Oasis Springs, Del Sol Valley, StrangerVille).
   - The vets are in Brindleton Bay (2), Windenburg, Henford and Chestnut Ridge.
   - Five vets is within the 4–6 judged realistic in `community-lots-mix.md`, and Sims can take a pet to another world’s vet. So this is a story question, not a broken game.
   - Every lot in the city area is either built or already planned, so a vet there means re-typing a planned lot or a built empty home.
2. **Vet owners.** 3 of the 5 have no owner (the Pawspital, The Summer Home, Canter Clinic), so NPC vets run them. The game’s Pawspital text says its owner is retiring and “interested in selling the place to a young aspiring vet”. Supriya Delgato dreams of being one.
3. **Canter Clinic only treats cats and dogs.** Chestnut Ridge has no premade cats or dogs; Red Roan Farm’s dogs would be its patients. Not a problem, just worth knowing.
4. **No public horse stop in New Appaloosa.**
   - EA’s Duke’s Hall park was the riders’ rest stop by the Equestrian Center. As Appaloosa Stables it’s a home: in game, visitors are the elder couple’s guests, and NPC Sims don’t drop in as they would at a park.
   - The Cozy Corner House (community farm, Custom Venue, not built, same neighbourhood) could take hay feeders, troughs and the “Horses Play and Learn” activity.
5. **Full households.**
   - Appaloosa Stables (2 Sims + 6 horses) is at the 8 limit, so no foal can be born there until a horse leaves.
   - Palomino Junction’s rescue has the same cap: Palumbos and horses together can’t pass 8, so the “lots of horses” in her upload means about 5–6.
6. **Gibbi Point.** Paradise Stables is its only horse place. Its riders ride their own lot and the outback, and travel to New Appaloosa to compete.
7. **Dogs welcome at only 2 community lots** (The Shrieking Llama, Pupperstone Park). Owners bring pets only where a Friendly trait is set; Hangouts bring strays, not owners’ pets.
   - Built parks with no pet trait: Desert Bloom (no traits at all; `lot-trait-ideas.md` already suggests Dog Friendly), The Ice Pavilion, Courtyard Lane Playground and Parkside Playground.
   - Parks not built yet: Myshuno Meadows, LaSuli Point, The Lair in the Open-Air, Plumbird Park and Inked Inlet.
8. **Rentals.**
   - The Lynx unit at Tail’s End must not have No Pets set.
   - For Rent’s two pet households turn up only as rental applicants. Kitty Lu, an elder Cat Lover with 3 cats, would suit Tail’s End unit 1 (Cat Hangout) on the cat wharf, or the Rio Verde Retirement Home if a unit is free. Dara Kham and Hanoi could take one of the empty units already on TODO.
9. **Premade data.** Because of the patch 196 bug, check in game that Rosie still knows her commands and that Duke and Flapjack still have their skills (10/10/8/10 and 10/10/9/10).

Small story ideas (little change to the game): Captain Whitaker’s “Tomb of the Unknown Pupper” in Deadgrass Discoveries, the shipwreck museum on the isle with the Saint Bernard legend. A champion foal (Flapjack’s or Duke’s) for Paradise Stables. The wiki lists no Champion trait for either stallion, so Champion Genes would need one of them to win again in her save.

---

## 4. Showing pets and horses on the site

**Already planned:**
- `sims-display.md` §9 has a `pets` list on each household.
- The prototype household page has a placeholder line (“Cats, dogs and horses would be listed here”).
- Her saves store pets and horses like Sims (the save layout has species and breed fields, and the same family links). So if pets are typed in the same shape as Sims, a later save reader fills them in without extra work.
- The Building rule still applies: no animals from Building saves.

**What’s worth showing:**

| Level | Cats and dogs | Horses | Small animals |
|---|---|---|---|
| Basics | Name, species, life stage | Name, life stage, mare or stallion | A count (“6 hens, 2 mini goats”) |
| Profile | Breed, 3 traits | Breed, 3 traits (+1 from breeding), who rides it | – |
| Extras | Commands it knows | Champion, events won | – |

Skill levels change as she plays, so leave them out, as with Sims. The exception is a champion horse’s, which stay at the top.

### Options

| | A. Pets in the roster (recommended) | B. One-line strip | C. Full members and a Horses page |
|---|---|---|---|
| Household page | Pets as rows in the same roster as the Sims, with a species pill and life stage (“Starbrite · Horse · Foal”). Header count “3 Sims · 2 horses”. A small card only for pets with a profile. Small animals as one counts line | A line under the Sims: “Luna (horse, adult) · Starbrite (foal, Luna’s)”. No cards | Pets get cards like Sims, with traits, breed, rider, events won and photos |
| Family tree | Kept off the Sims tree. An **Animals** tab appears only where a mother and young live (now: Lynx and Groves), drawn with the same tree code. A paw chip on the owner’s card (“Wren · Starbrite”) | None; parents in words | Pets hang under their owners on the Sims tree, plus a save-wide **Horses** page: every horse, its home and its line across households and worlds |
| Relationships | Owners come from the household. Animal family is worked out from `parents`. One optional link to a Sim: **Rider** or **Best friend** (the game gives Sims and pets only a friendship bar, no romance) | None | Pet friendships and mates in `relationships.json`, with the same tags as Sims |
| Good | Works at Basics from day one; trees stay readable | Least typing | Shows horse breeding best |
| Not so good | One more tab on trees | Loses lines and champions | Lots to type; trees get crowded (Appaloosa Stables alone has 6 horses); events won go stale |

**Recommendation: A, filled at Basics first.**
- Add the Animals tab only where there are young ones.
- Show Bartholomew Sr → Jr as an “In the game: unrelated / SimGuru: father” note, unless she makes it real in her save.
- Strays and town animals (Mayor Whiskers, Captain Whitaker) go in a small “Town animals” line on the world’s households page, like homeless Sims.

**Icons:**
- Lucide has cat, dog, rabbit (small pets), bird (crows), egg (hens), paw-print and trophy (champions), but no horse.
- Lucide Lab, from the same project and also ISC-licensed, has horse-head and cow-head.

**Proposed data** (written here only; not applied; the `//` notes are explanations):

```json
"pets": [
  {"id": "luna-grove", "name": "Luna", "species": "Horse", "sex": "Female", "age": "Adult",
   "breed": "Mustang Cross", "traits": ["Mellow", "Intelligent", "Friendly"],
   "origin": "ea", "notes": "Umber's childhood rescue horse"},
  {"id": "starbrite-grove", "name": "Starbrite", "species": "Horse", "sex": "Female", "age": "Foal",
   "parents": ["luna-grove"], "rider": "wren-grove"},
  {"id": "flapjack", "name": "Flapjack", "species": "Horse", "sex": "Male", "age": "Adult",
   "champion": true, "rider": "sienna-grove"}
],
"animals": [{"kind": "Mini goat", "count": 2}, {"kind": "Hen", "count": 6}]   // not members, just counts
```

- `species`: Cat, Dog or Horse. `age`: Kitten, Puppy or Foal, then Adult, Elder. `state`: Ghost or Unicorn, as a pill like a Sim’s occult.
- Ids follow the same save-wide scheme as Sims. `parents` on a pet points only to pets.
- `late: true` for pets that have died (the game gives them graves).

---

## 5. Decisions for Jemma

1. **Pets on household pages:** in the roster with the Sims (A, recommended), a one-line strip (B), or full cards plus a Horses page (C)?
2. **Animal family lines:** an Animals tab on the family tree, only where there are young ones? And show Bartholomew Sr as Jr’s father (the SimGuru’s word), or keep them unrelated as the game does?
3. **Small animals** (goats, sheep, hens, cows, llamas, rodents, crows): a counts line, or leave them off?
4. **A vet for the city area or the desert worlds,** or is a trip to Brindleton Bay fine?
5. **Brindleton Pawspital’s owner:** the Delgatos (Supriya’s dream, and the game’s “young aspiring vet” story)? The Summer Home and Canter Clinic stay NPC-run?
6. **New Appaloosa’s horse stop:** give The Cozy Corner House feeders, troughs and “Horses Play and Learn”, or let Appaloosa Stables be the stop? Appaloosa is full at 8, so no foals there unless a horse leaves.
7. **For Rent’s pet households** (Kitty Lu and her 3 cats; Dara Kham and Hanoi): use them for empty rental units?
8. **In game:** check the premade pets and horses kept their commands and skills (patch 196). Turn off “Adopt Cats & Dogs” and “Rescue Horses” in Neighbourhood Stories so no unplanned animals appear (goes with the settings question on TODO §6d)?
9. **Icons:** OK to use Lucide Lab’s horse-head for horses?

---

## Sources

- Sims Wiki (API, 17 Oct): Pre-made (The Sims 4); Blue; Bartholomew A. Bittlebun, Sr.; Rosie; Doc; Cleo (Brindleton Bay); Josie; Bartholomew A. Bittlebun, Jr.; Mayor Whiskers; Captain Whitaker; Hanoi; Bugella; MacGoober; Mrs. Love; Duke Gooseman; Luna (Chestnut Ridge); Starbrite; Flapjack; Roberto Crinkletop; Lynx household; Delgato family; Hecking family; Grove family; Sienna & Flapjack household; Gooseman household; Kham household; Lu household; Dara Kham; Kitty Lu; Brindleton Bay; Chestnut Ridge; New Appaloosa; Riders’ Glen; Henford-on-Bagley; The Sims 4: Cats & Dogs; The Sims 4: Horse Ranch; The Sims 4: My First Pet Stuff; The Sims 4: Cottage Living; The Sims 4: Life & Death; The Sims 4: Lovestruck; The Sims 4: Enchanted by Nature; The Sims 4: Adventure Awaits; Pet; Adoption (pets take household slots); Horse; Unicorn; Fox; Stray; Breeding; Pet trait (The Sims 4); Life stages (pet); Minor pet; Rodent; Vet clinic; Veterinarian; Agility; Endurance; Jumping; Temperament; Milestone; Aspiration (The Sims 4); Family tree; patches 149, 190, 196, 203 and 207. https://sims.fandom.com
- The game’s own files (read only, through `tools/sims4files.py` and `tools/research/tuning.py`, from a scratch script): the venue settings for Vet Clinic, Residential, Residential Rental, Tiny Home, Haunted House and the community lot types; English text for the Equestrian Center, competitions and divisions, horse buying and breeding, the vet lesson, and the No Pets rule; the save layout’s pet fields.
- Lucide icon lists: lucide-static 0.460.0 and 1.58.0 (no horse); @lucide/lab 0.7.0 (horse-head, cow-head; ISC).
- Her plan: `data/worlds/*.json`, `data/gallery/uploads.json` (lot texts), and the research notes named at the top.
