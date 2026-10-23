# Lot traits and challenges: what they do, a check, and ideas (17 Oct)

> Partly out of date since 21 Oct: The Old Dockyard has no Off-the-Grid (that was another build in her save), and Studio PBP gets Hottest Spot in Town when built.

Research only; nothing in the app, data or tools is changed. Every suggestion is just that: her call.

**Sources:**
- The game’s own trait tuning (the “zone modifiers”), read 17 Oct: real effects, which lot types allow each one, and built-in clashes.
- The Sims Wiki page “Lot traits and challenges”.
- Her shared lots’ traits and rental units in `data/worlds/*.json` (from her “Building #2” save), her notes in TODO.md and research/.

**Ground rules from the game:**
- Up to **3 lot traits** per lot. On a rental, each unit has its own 3. Lot challenges have **no limit** and don’t use trait slots.
- **Locked** traits are set by the game on certain lots (mostly San Myshuno flats) and can’t be added or removed.
- **Not installed yet:** Vampires, Lovestruck and Enchanted by Nature. So Vampire Nexus, On a Dark Ley Line, Registered Vampire Lair, Singles Hangout and Fairy Passage can’t be used yet.
- **Event rewards:** Regal Residence (Lost Legacies, Feb–Mar 2026) and Scare Seeker (Reaper’s Rewards) only show if she unlocked them.

## 1. What each trait and challenge does

### Skill traits (work on any lot, for any Sim practising there)

| Trait | Pack | Effect |
|---|---|---|
| Great Acoustics | Base | Music skills (singing, guitar, piano, violin, DJ) half as fast again; inspired while playing |
| Fast Internet | Base | Programming, video gaming and writing half as fast again; energised. Can’t go with Off-the-Grid |
| Homey | Base | Cooking, baking, mixology, handiness and gardening half as fast again; happy while doing them |
| Science Lair | Base | Logic (chess too) and rocket science half as fast again; focused |
| Convivial | Base | Charisma, comedy and mischief half as fast again; confident while socialising |
| Natural Light | Base | Painting (murals too) and photography half as fast again; inspired while painting |
| Bracing Breezes | Base | Fitness and wellness half as fast again; energised while exercising |
| Chef’s Kitchen | City Living | Cooking a little faster; “Inspired Chef” for 2 hours after cooking |
| Home Studio | City Living | Painting and writing a little faster; paintings, books and woodwork come out better |
| Child’s Play | City Living | Children (and Childish adults) get playful at children’s skill objects |
| Peace and Quiet | Jungle Adventure | Skill from books half as fast again; tense moods fade on arrival |
| Study Spot | Discover University | Homework and studying quicker and for longer; a small boost to every skill |
| Training Ground | Cats & Dogs | Pet Training faster (dog tricks, fetch, obstacle course). Not horses |

No trait helps pottery, tattooing, nectar making, horse riding or the vet skill.

### Mood, social and atmosphere (any lot unless noted)

| Trait | Pack | Effect |
|---|---|---|
| Party Place | City Living | Happy on arrival; friendly and romantic chats go better; party goals easier |
| Romantic Aura | City Living | Romantic chats can give a confident boost that makes romance easier |
| Mean Vibe | City Living | Mischief makes the target angry |
| Sunny Aspect | City Living | Around 6–7:30 pm, everyone on the lot gets energised, happy or inspired until they leave |
| Penny Pixies | City Living | Sims find small change while sitting, cleaning, napping or rummaging |
| Gnomes | City Living | Broken things mended at 3 am, **only while every Sim on the lot is asleep**, so homes only in practice |
| Private Dwelling | Base | No uninvited doorbell callers, welcome wagon or fans. Homes; little effect on venues |
| Clandestine | Royalty & Legacy | Secrets and scandals done here don’t get out |
| On Hallowed Grounds | Life & Death | Twice a day at random times: flickering lights, TVs on static, cold spots, Netherworld rifts. Macabre Sims love it |
| Island Spirits | Island Living | Ancient spirits visit (morning, afternoon and night); Sims can commune with, release or banish them |
| Oceanic Paradise | Island Living | More sea life when swimming in the ocean; dolphins. **Locked**: only Sulani lots that ship with it |

### Visitors

| Trait | Pack | Effect | Where it’s allowed |
|---|---|---|---|
| Teen Neighborhood | Base | More teens hang about the neighbourhood | Any |
| Cat Hangout, Dog Hangout | Cats & Dogs | Stray cats or dogs visit | Not vets, spas, restaurants, onsens |
| Cat Friendly, Dog Friendly | Cats & Dogs | Owners bring their pets | **Community lots only**; not small businesses, retail, spas, restaurants, vets, onsens, cemeteries |
| University Student Hang Out | Discover University | Food and drink about a third cheaper; students and professors drop by | **Community lots only**; not restaurants, retail, spas, vets, small businesses, vacation rentals |
| Up-and-Coming Hotspot | Get Famous | B-listers and up get a quarter off; Meet a Celebrity only at **lounges** with it | Community lots; not with Hottest Spot |
| Hottest Spot in Town | Get Famous | Prices doubled; restaurants charge §50 for a table; the Starlight Accolades only at **lounges** with it (the game’s own is Studio PBP) | Community lots, not vets; not with Up-and-Coming or University Student Hang Out |
| Clothing Optional | Base | Visitors come nude; children are sent home | **Community lots only**, not vets, playgrounds or schools |
| Vampire Nexus | Vampires (not installed) | More vampires visit | Any |
| Singles Hangout | Lovestruck (not installed) | More single Sims about | Any |
| Fairy Passage | Enchanted by Nature (not installed) | Fairies visit more | Any |

### Home and family

| Trait | Pack | Effect | Where it’s allowed |
|---|---|---|---|
| Good Schools | City Living | Children and teens who live there do better at school | Any, but only helps residents |
| On Ley Line | City Living | Twins more likely when trying for a baby **on the lot** | Any |
| Breeding Ground | Cats & Dogs | Bigger litters, when pets mate **on the lot** | Any |
| Celebrity Home | Get Famous | Home tours, restricted access, more fame. A non-famous household are “posers” (embarrassed) | Homes and rentals only |
| Regal Residence | Event reward | Needs fall slower and moods last longer as lot value rises (the key point is §250,000) | Homes, rentals and Generic |
| Registered Vampire Lair | Vampires (not installed) | Gifts from the League by post | Homes only |
| On a Dark Ley Line | Vampires (not installed) | Babies conceived there more likely to be vampires | Any |

### Bills and eco (Eco Lifestyle)

| Trait | Effect |
|---|---|
| Natural Well | About 29 water units a day off the bill; “Fresh Spring Water” happy moodlet when drinking water (that part works anywhere) |
| Geothermal | The same off the power bill; pools stay warm (“Warm Waters” moodlet, works anywhere) |
| Eco Lot | The lot’s eco footprint turns green a little faster |

### Set by the game

- **Tiny Living:** Let It Grow, Lighten The Load, You Got The Touch, Feelin’ Fine All The Time, Cozy Comforts, Let’s All Get Along. Added automatically to Tiny Home Residential lots, depending on how small they are. They can’t be picked, so they don’t show in her data.
- **Locked City Living flat traits:**
  - **Quiet:** no noise from the neighbours.
  - **Lively Neighbors:** more disruption, and goofballs walk in.
  - **Great View:** energised looking out of a window.
  - **Historical:** a fixed plaque that inspires.
  - **Romantic Fireplace:** a fixed fireplace that makes Sims flirty.
  - **Needs TLC:** power cuts, burst pipes and pests.
  - **Serviced Apartment:** a free maid on weekdays at 9 am.
  - **Spooky** (flat version): a ghost at 10:30 pm.
  - **Pricey, Cheap Rent, Low Deposit:** no real effect.

### Lot challenges

| Challenge | Pack | Effect | Where it’s allowed |
|---|---|---|---|
| Quake Zone | City Living | Small and big tremors; Sims get scared, some arrive scared | Any |
| Cursed | City Living | Voodoo on arrival; bad moods last longer; more fires and deaths by electrocution; food poisoning at restaurants | Any |
| Grody | City Living | 1 in 3 chance of nausea after eating, drinking or the toilet | Any |
| Gremlins | City Living | Things break at midnight while everyone sleeps | Homes in practice |
| Filthy | City Living | Things get dirty twice as fast | Any |
| Spooky | City Living | A ghost turns up late at night (11 pm–2 am); everyone gets scared | Any |
| Creepy Crawlies | Jungle Adventure | Spiders, bees or bats drop on Sims; a small chance of poison | Any |
| Volcanic Activity | Island Living | Eruptions, lava bombs (can start fires; cool to minerals), steam vents | Any |
| Off-the-Grid | Base | No mains power or water: most electric and plumbing objects stop working; no bills | **Homes, rentals, small businesses and Generic only**; not with Fast Internet |
| Heist Havoc | Base | More burglars; alarms misbehave | Homes, rentals and small businesses |
| Landfill Lot | Eco Lifestyle | Townies dump rubbish; footprint turns industrial faster; outdoor rubbish becomes trash plants at 3 am | **Community lots only**, not restaurants |
| Reduce and Recycle | Eco Lifestyle | Bins fill up and must be sorted; recyclables; a weekly waste collector | Any |
| Simple Living | Cottage Living | Every recipe needs real ingredients; food tastes better; cookbooks at Cooking 10 | Any |
| Wild Foxes | Cottage Living | Foxes steal eggs and attack chickens and rabbits | Any |
| Wild Prairie Grass | Horse Ranch | Prairie grass spreads daily (hay for horses, nectar) | Any |
| Mold | For Rent | Mould grows if puddles, rubbish or dirty plumbing are left; black mould can kill | Any |
| Maintenance Troubles | For Rent | Rental-style emergencies (electrics, cursed books, pool algae) | **Ordinary Residential only**: not rentals (they have their own), tiny or haunted homes |
| Scare Seeker | Event reward | Sims get bored without scares; occult Sims walk by and may leave gifts | Homes, rentals and Generic |

**Built-in clashes** (the game won’t allow both): Off-the-Grid with Fast Internet; Hottest Spot in Town with Up-and-Coming Hotspot; Hottest Spot in Town with University Student Hang Out.

## 2. Check of her current choices

None of her lots has a built-in clash. What stands out:

### Traits that do little or nothing where they are

| Lot | Trait | Why | Idea |
|---|---|---|---|
| The Old Dockyard (Evergreen Harbor, Community Space) | Off-the-Grid | Not allowed on a Community Space, so it’s probably switched off. It’s likely left over from when this was The Shipping Views, a home. Just as well: the Maker Space needs a powered fabricator | Remove it in game, or leave it |
| Britechester B&B (Café/Vacation Rental) | University Student Hang Out | Not allowed on a Vacation Rental, only on the café | Fine while it’s a café |
| Burners & Builders (gym), Pixel Café, The Llama Picturehouse | Gnomes | Only mends things while everyone on the lot is asleep, so it never happens on a venue | Gym: Homey (handiness, for the builders) or Party Place. Pixel Café: Convivial. Picturehouse: Romantic Aura (date night) |
| Lotus Ridge Spa, Sento Senbamachi | On Ley Line | Only matters if a couple tries for a baby there | Peace and Quiet (tension fades on arrival) suits a spa or bathhouse |
| Creek Clinic (vet) | Breeding Ground | Only works when pets mate on the lot | Peace and Quiet or Sunny Aspect. The pet visitor traits aren’t allowed on vets |
| Calico (Brindleton Bay, Lounge) | Hottest Spot in Town | The Starlight Accolades go to any lounge with it. Calico is the only lounge with it now (Valley Views is a restaurant), so the awards would be in Brindleton Bay, not Del Sol Valley | Put it on Studio PBP when it’s built; keep Calico’s, or swap it for Up-and-Coming Hotspot |

**Smaller notes:**
- **Chef’s Kitchen on venues** (Willow’s, De Costadas, The Aqua Grill and others): the staff cook there, so it only helps if one of her Sims cooks there. Fine as story.
- **Up-and-Coming Hotspot** on Strike Out! (nightclub) and Starlight Fitness (gym): the celebrity discount works; Meet a Celebrity needs a lounge. Orchid A Go Go has it, so that’s covered.
- **Training Ground on Red Roan Farm:** helps with dogs and cats only, not horses.
- **Good Schools** only helps children and teens who live there. It’s waiting for a family on Comfy Cubby, 2-4-3 Wakabamori and Rockridge Springs. Stonestreet #3 is Knox Greenburg on his own.
- **Natural Well on 5-1-1 Kiyomatsu** (vacation rental): a rental has no bills, so only the spring-water moodlet counts.
- **Story pulls:**
  - Quake Zone on Lotus Ridge Spa and the Public Pool may scare guests on arrival, against a relaxing visit. It’s Oasis Springs’ theme (8 of its lots), so her call.
  - Sungai Point 11C (Spooky and Mold) is meant for “any family just getting started”, and black mould can kill.
- **Sunny Aspect is on 49 lots,** the most of any trait. It only does anything around 6 pm, so where a slot is free, a trait that fits the lot says more.

### Shared lots with fewer than 3 traits (88, leaving out The Magic Realm)

**No traits at all (17):** the rentals are under “Rentals” below.

| World | Lot | Ideas |
|---|---|---|
| Willow Creek | Rindle Rose (Pancakes) | Homey, Great Soil, Peace and Quiet (like the other Willow Creek homes) |
| Oasis Springs | Springscape (empty) | Sunny Aspect, Homey (like its neighbours) |
| Oasis Springs | Desert Bloom (Park) | Sunny Aspect, Child’s Play (playground), Dog Friendly |
| Newcrest | Asphalt Abodes | Homey, Fast Internet, Sunny Aspect |
| Newcrest | Optimist’s Outlook (crafts, tattoos, music) | Home Studio, Great Acoustics, Convivial |
| Granite Falls | Campground | Bracing Breezes, Peace and Quiet, Sunny Aspect |
| Mt. Komorebi | 5-1-2 Kiyomatsu | Bracing Breezes, Natural Well, Convivial (as 5-1-1) |
| Gibbi Point | Gibbi Rec Center | Bracing Breezes, Child’s Play, Convivial |
| Glimmerbrook | Brooks Bridge (haunted house) | On Hallowed Grounds, Peace and Quiet |
| San Myshuno | Fraternity and Sorority Apartments | Party Place, Study Spot, Fast Internet |
| San Myshuno | 930 Medina Studios (Arts Quarter) | Natural Light, Home Studio |
| San Myshuno | 17 Culpepper House (Spice Market) | Chef’s Kitchen, Homey |
| Evergreen Harbor | Pinecrest #404 | Eco Lot (+ Reduce and Recycle), like Stonestreet |
| Windenburg | Mid-NoWhere (woods, portal) | Peace and Quiet, Bracing Breezes |

**One trait (12, plus two rentals):**

| World | Lot | Has | Could add |
|---|---|---|---|
| Oasis Springs | Vista Quarry Villa (family) | Natural Light | Good Schools, Homey |
| Oasis Springs | Palm Springs Public Pool | Bracing Breezes | Geothermal (warm pools), Party Place |
| San Myshuno | 18 Culpepper House | Historical (locked) | Homey, Chef’s Kitchen |
| San Myshuno | 19 Culpepper House | Needs TLC (locked) | Gnomes (mends what TLC breaks), Homey |
| San Myshuno | 920 Medina Studios (Bheedas) | Quiet (locked) | Natural Light, Homey |
| San Myshuno | 122 Hakim House | Historical (locked) | Natural Light, Home Studio |
| San Myshuno | 1310 21 Chic Street (Venessa Jeong) | Lively Neighbors (locked) | Convivial; Celebrity Home once she’s famous |
| Selvadorada | Hillside Hideaway | Sunny Aspect | Peace and Quiet, Bracing Breezes |
| Sulani | Caldera Camp (hers; off-grid by the volcano) | Eco Lot | **Geothermal** and **Natural Well**: the volcano’s heat and spring water; they may also count as power and water made on an off-grid lot (check in game) |
| Evergreen Harbor | The Portsmouth Promenade (classes) | Study Spot | Eco Lot, Home Studio (Blossom paints) |
| Mt. Komorebi | Izakaya Hanamigawa Koen | Convivial | Chef’s Kitchen, Sunny Aspect |
| Nordhaven | Fisherman’s Wharf (tattoos, pottery, candy café) | Home Studio | Homey (baking), Convivial (selling) |

**Two traits (57; one idea each for the third slot; Rio Verde, Fern Park Flats, Spring Steppes and Rockridge Springs are under “Rentals” below):**
- **Willow Creek:** Riverside Roost + Homey.
- **Oasis Springs:**
  - Agave Abode + Romantic Aura (Don Lothario).
  - Sandtrap Flat + Homey.
  - Pebble Burrow + Great Soil.
  - Granada Place + Science Lair (if the Curious household are the Strangetown scientists).
  - Sultry Springside + Homey.
  - Raffia Quinta + Great Soil.
  - The Futures Past + Science Lair.
  - Rattlesnake Juice Bar + Great Acoustics.
  - Lotus Ridge Spa: see above.
- **Newcrest:** Newcrest Community Space + Child’s Play; Newcrest Wedding Hall + Great Acoustics.
- **Granite Falls:** Granite Falls Spa + Peace and Quiet; Green Getaway + Bracing Breezes (On Ley Line suits a honeymoon cabin).
- **Windenburg:**
  - Factory One + Convivial.
  - Olde Platz Inn + Chef’s Kitchen.
  - The Narwhal Arms + Great Acoustics.
  - Rustic Residence + Peace and Quiet.
  - Von-Windenburg Castle + On Hallowed Grounds (a haunted castle).
- **San Myshuno:** 1010 Alto + Convivial; Skye Fitness + Party Place.
- **Selvadorada:**
  - Selvadorada Villa + Peace and Quiet.
  - Cantina “El Árbol del Jaguar” + Great Acoustics.
  - Jungle Bungalow + Sunny Aspect.
  - Belomisia Field Station + Science Lair (a research station).
- **Brindleton Bay:** The Bay Café + Peace and Quiet (reading in a cat café).
- **Del Sol Valley:** Strike Out! + Convivial.
- **StrangerVille:** Carpophagous Corner + Peace and Quiet.
- **Sulani:**
  - Admiral’s Wreckage + Island Spirits.
  - Journey’s End + Island Spirits (a local family).
  - Ohan’ali Beach + Bracing Breezes.
  - Sand Simoleon Beach + Bracing Breezes.
- **Glimmerbrook:** Glimmer & Books + Clandestine (a hidden bar after dark).
- **Britechester:**
  - Britechester B&B + Homey.
  - The Royal Crown + Great Acoustics.
  - Mossy Lane + Study Spot.
- **Evergreen Harbor:**
  - Stonestreet #3 + Convivial (Knox the campaigner).
  - Stonestreet #4 + Natural Well.
  - The Old Dockyard + Eco Lot (like the other community spaces).
- **Mt. Komorebi:**
  - 2-4-2 Wakabamori + Homey.
  - 2-4-3 Wakabamori + Homey.
  - Sento Senbamachi + Peace and Quiet or Natural Well.
- **Henford-on-Bagley:** 3 Olde Mill Lane + Great Soil; Finchwick Village Hall + Peace and Quiet (the library upstairs).
- **Copperdale:** Town Square Stores + Convivial.
- **San Sequoia:**
  - 23 Eucalyptus Lane + Good Schools.
  - Anchorpoint Rec Center + Bracing Breezes.
  - Parkside Playground + Sunny Aspect.
- **Chestnut Ridge:** Appaloosa Stables + Bracing Breezes; Big Sky Reach + Bracing Breezes.
- **Tomarang:** Chee-wít Chee-waa Kanto + Convivial.
- **Ravenwood:** Crow’s Chronicles + Peace and Quiet.
- **Nordhaven:** Canalside Daycare + Homey.

### Rentals: units with no traits

Where only unit 1 has traits, they’re probably the lot’s traits from before it was split (research/rental-units.md). Maintenance Troubles can’t go on a rental, but rentals have their own repair events anyway.

| Rental | Units with none | Ideas |
|---|---|---|
| Rio Verde Retirement Home (elders) | 2–6 | Sunny Aspect and Homey as unit 1, plus Peace and Quiet or Great Soil for gardening elders |
| Fern Park Flats (BFF) | 2–5 | Fast Internet and Sunny Aspect as unit 1; Party Place in the penthouse |
| Midtown Meadows (single mums) | 2–5 | Child’s Play, Good Schools, Gnomes, as unit 1 |
| Inner Circle (Roomies) | 2–4 | Party Place, Convivial (and Quake Zone and Filthy, as unit 1) |
| Upland Trailer Park | 2–4 | Eclectic Arts: Natural Light, Home Studio, Great Acoustics, a different art each. Johnny Zest (4): Convivial (comedy) |
| Slip 42 | 1 has only challenges, 2 has nothing | Science Lair, Bracing Breezes; the same challenges on 2 for the desert grit |
| Spring Steppes | 2–3 | 2 (the Pleasant twins): Study Spot, Fast Internet. 3 (students): Study Spot, Party Place |
| Old Torget House (Nordhaven) | all 3 | One hobby per flat for the hobby city: Home Studio, Great Acoustics, Homey |
| Isda Riverfront (not shared) | both | Sunny Aspect (riverside), Homey |
| Sungai Point 11C (not shared) | Spooky and Mold, no traits | Gnomes, Homey, to soften it for a starter family |

- **Every unit has 2, room for a third:** Tail’s End (4 units) and Rockridge Springs (3; Eco Lot on each suits Evergreen Harbor, or Great Soil if Mary Greenburg the gardener moves in).
- **Not split yet:** Rippling Flats (Study Spot, Fast Internet, Party Place for the uni Sims), Specter Row and Casa Do Corsário.

## 3. Suggestions for unshared and planned lots

### By lot type

| Lot type | Good fits | Watch out |
|---|---|---|
| Family home | Good Schools, Child’s Play, Homey; On Ley Line for twins | Private Dwelling also keeps friends from dropping round |
| Single or couple | Homey, Romantic Aura, the skill trait for their hobby | |
| Farm or ranch | Great Soil, Homey; challenges Simple Living, Wild Foxes, Wild Prairie Grass (hay) | Training Ground doesn’t cover horses |
| Rich home or palace | Regal Residence (if unlocked), Private Dwelling, Party Place; Clandestine for schemers | |
| Celebrity home | Celebrity Home, Party Place | Non-famous residents are “posers” |
| Haunted house | On Hallowed Grounds; Spooky (challenge) for more ghosts | |
| Tiny home | Great Soil, Peace and Quiet | The tiny-home bonuses come by themselves |
| Rental unit | The tenant’s hobby trait; Gnomes; Mold or Filthy for a cheap flat | No Maintenance Troubles |
| University Housing | Study Spot, Fast Internet, Party Place | No Celebrity Home or University Student Hang Out |
| Small business | Convivial (selling) and the trade’s skill trait; Heist Havoc is allowed | A business venue can’t have Cat or Dog Friendly or University Student Hang Out |
| Vacation Rental | Sunny Aspect, Bracing Breezes, Peace and Quiet; Romantic Aura and On Ley Line for honeymoons | Bill traits do nothing; no Off-the-Grid or University Student Hang Out |
| Library | Peace and Quiet, Study Spot, Child’s Play or Fast Internet | |
| Backroom | Clandestine, Party Place, plus one for the day side (Peace and Quiet for books, Bracing Breezes for a gym, Natural Light for art) | |
| Bar or pub | Convivial, Party Place, Great Acoustics, Homey (mixology) | Gnomes does nothing |
| Karaoke Bar, Nightclub | Great Acoustics, Party Place, Romantic Aura; University Student Hang Out in a uni town | |
| Lounge | Hottest Spot in Town (awards) or Up-and-Coming Hotspot (meet celebrities), Great Acoustics | Not both |
| Restaurant | Chef’s Kitchen, Romantic Aura, Convivial; Hottest Spot for a posh one | No pet or student traits |
| Café, Thrift and Boba | Convivial, Peace and Quiet (reading), Teen Neighborhood; Cat Friendly for a cat café | |
| Park, playground, beach, national park | Bracing Breezes, Sunny Aspect, Child’s Play, Dog Friendly, Teen Neighborhood | |
| Gym, Rec Center, Pool | Bracing Breezes, Party Place; Geothermal warms a pool | |
| Spa, Onsen | Peace and Quiet, Romantic Aura, Natural Well | No pet traits; Quake Zone scares guests |
| Museum, Arts Center | Natural Light, Home Studio, Great Acoustics | |
| Wedding Venue | Romantic Aura, Party Place, Great Acoustics | |
| Cemetery | On Hallowed Grounds, Peace and Quiet; Spooky | No Cat or Dog Friendly |
| Community Space or Market | Eco Lot, Convivial, Homey (Market’s shared kitchen) | No Off-the-Grid |
| Vet Clinic | Training Ground, Peace and Quiet, Sunny Aspect | No pet visitor traits |
| Generic | Whatever the place is for; it can take Off-the-Grid | |

### Per lot, where her notes give a story

| Lot (world) | Ideas | Why |
|---|---|---|
| Studio PBP (Del Sol Valley) | Hottest Spot in Town, Party Place, Great Acoustics | The game’s own Starlight Accolades venue |
| Chateau Peak (Del Sol Valley) | Celebrity Home, Party Place, Sunny Aspect | “My Celebs” |
| Plumbob Pictures Museum (Del Sol Valley) | Up-and-Coming Hotspot, Convivial, Natural Light | A film museum in the fame world; allowed on a small business |
| Affluista Mansion (Oasis Springs) | Regal Residence (if unlocked), Private Dwelling, Party Place | The Landgraabs; a 50×50 mansion passes §250,000 easily |
| Yuma Heights (Oasis Springs) | Clandestine, Romantic Aura, Party Place | The Caliente sisters’ schemes stay secret |
| Dusty Turf (Oasis Springs) | Chef’s Kitchen, Homey (+ Quake Zone like the neighbours) | The De Costas run De Costadas |
| Ophelia Villa (Willow Creek) | On Hallowed Grounds, Good Schools, Peace and Quiet | The Goths’ haunted house, with children at school |
| Cordelia Church (Willow Creek) | On Hallowed Grounds, Peace and Quiet; Spooky | Church and cemetery |
| Cypress Terrace (Willow Creek) | Good Schools, Child’s Play, Homey | The Spencer-Kim-Lewis children |
| Willow Creek Archive, Quad Manor, Lighthouse Lookout | Peace and Quiet, Study Spot, plus Child’s Play (Willow Creek, Nordhaven) or University Student Hang Out (Quad Manor, a uni town) | Libraries |
| University of Windenburg | La Discotheque and Students Union: University Student Hang Out, Party Place or Study Spot. Halls: Study Spot, Party Place, Fast Internet. Sports Center: Bracing Breezes | The same mix as Britechester |
| The Crumbling Isle homes (Tiquelles) | Private Dwelling, Peace and Quiet; Spooky like the castle | One family on a quiet isle, so matching traits tie them together |
| Catscratch Cottage (Brindleton Bay) | Chef’s Kitchen, Sunny Aspect, Convivial | Wharf seafood. Sadly Cat Hangout isn’t allowed on a restaurant |
| Deadgrass Discoveries (Brindleton Bay) | Natural Light, Peace and Quiet; Spooky | Shipwreck museum; the isle’s after-dark rumours |
| Brindleton Pawspital, The Summer Home, Canter Clinic, 2 Olde Mill Lane | Training Ground, Peace and Quiet, Sunny Aspect | Vets |
| StrangerVille Information Center | Clandestine, Peace and Quiet, Science Lair | The conspiracy town’s archive by day, a secret club by night |
| Key Point (Sulani) | Keep its game traits (Oceanic Paradise is locked) | **Off-the-Grid works only if it’s a home, Tiny Home or Generic, not a Vacation Rental** (the open check in undecided-lots.md) |
| Chieftain’s Villa (Sulani) | Island Spirits, Homey, Great Soil | The Hoapilis, the island’s old family |
| Specter Row (Ravenwood) | On Hallowed Grounds on each unit (allowed on rentals) | Maintenance Troubles isn’t possible on a rental (correcting undecided-lots.md) |
| Old Ravenwood Estate, The Cozy Casket House, Mourning Mist Manor, Eternal Hollow | On Hallowed Grounds (the game’s own on the first two), Peace and Quiet; Spooky on the haunted houses | Ravenwood |
| Mystic Crossroads (Ravenwood) | On Hallowed Grounds, Convivial; Spooky | Tarot and curiosities; Macabre shoppers love it |
| The Gnome’s Arms (Henford) | Convivial, Homey, Great Acoustics | Despite the name, Gnomes does nothing on a pub |
| 1 Cobblebottom Street (Henford) | Homey, Chef’s Kitchen, Cat Hangout | The tea-room idea |
| 13 and 14 Nettle Lane (Henford) | Great Soil, Peace and Quiet; Wild Foxes. Fairy Passage once she has Enchanted by Nature | Kept for a fairy area |
| Isle of Volpe (Henford) | Bracing Breezes, Sunny Aspect; Wild Foxes | “Volpe” is Italian for fox; foxes only bother chickens and rabbits |
| Prescott and Lakeview Boarding Houses (Copperdale) | Prescott (chess and computers): Study Spot, Science Lair, Fast Internet. Lakeview (cheer and football): Bracing Breezes, Party Place, Teen Neighborhood | Chess is the Logic skill |
| Paradise Stables (Gibbi Point), Champion’s Grove (Chestnut Ridge) | Wild Prairie Grass, Great Soil, Bracing Breezes | Horses (hay) |
| Grapevine Terrace, Sweet Nectar Glade (Chestnut Ridge) | Home: Great Soil, Homey. Bar: Convivial, Sunny Aspect | Grapes; no trait speeds up nectar making |
| The Rusty Horseshoe (Chestnut Ridge) | Great Acoustics, Party Place, Convivial | The dance hall |
| Sutefani Onsen Bathhouse, Crystal Cottage | Peace and Quiet, Natural Well, Romantic Aura | Hot springs |
| Dambele, Verdemar and Bellacorde Palaces; Giardino Del Grandioso (Ondarion) | Regal Residence (if unlocked), Clandestine, Party Place | Dynasties scheming for the crown |
| Hardcover (Ondarion) | Clandestine, Peace and Quiet, Party Place | Library by day, underground club by night |
| Renaissance Road (Ondarion) | Chef’s Kitchen, Homey | The Montys’ dynasty skill is Gourmet Cooking |
| La Vivace (Ondarion) | Party Place, Romantic Aura, Great Acoustics | Balls and waltzes |
| Zanbira Market (Ondarion) | Homey, Convivial | Homey speeds up cooking in the shared kitchen |
| Pigulock Manor, The Quarry Building, Miner Mansion, Pinecrest #402 (Evergreen Harbor) | Eco Lot on all. Tinkers: Home Studio, Child’s Play. Sterling Ricos: Fast Internet (influencer). Eco Roomies: Natural Well; Reduce and Recycle | The eco world |
| Abandoned Views (Evergreen Harbor) | Eco Lot; Mold or Filthy | “Abandoned”, in industrial Port Promise |
| Miner’s Manse, Love Highland (Gibbi Point) | Commune: Eco Lot, Great Soil; Simple Living. Getaway: Romantic Aura, Bracing Breezes | The Addam Commune |

**Worlds she doesn’t own yet** (for when she buys them):
- **Forgotten Hollow:**
  - Registered Vampire Lair on Straud Mansion and Widowshild Townhome.
  - Vampire Nexus (the game’s own) and Clandestine on Garliclauter Place, as vampires keep themselves secret.
  - On Hallowed Grounds on Fledermaus Bend.
- **Innisgreen:** Fairy Passage, as the game ships it on several Everdew and Sprucederry Grove lots and Starsong Lounge.
- **Ciudad Enamorada:** Singles Hangout on Mirador del Amor and the plaza; Romantic Aura on the wedding venue.
- **Tartosa:** Romantic Aura on La Coppia Serena and Baia dell’Amore; Clandestine on Rifugio dei Pirati, for the runaway couple.
- **Moonwood Mill:** nothing werewolf-specific; Bracing Breezes on New Moon Cabins.

## For her to decide

1. **The Old Dockyard:** take off Off-the-Grid (inactive there)?
2. **Gnomes on the three venues:** swap them for something that works?
3. **Starlight Accolades:** Hottest Spot in Town on Studio PBP when it’s built? Keep Calico’s too?
4. **Caldera Camp:** add Geothermal and Natural Well?
5. **Key Point:** if Off-the-Grid matters, it has to be a home, Tiny Home or Generic.
6. **Rental units 2+:** fill them in game? (Already on TODO §6d.)
7. **Fill the free slots:** which of the ideas above to use when she’s in game?
