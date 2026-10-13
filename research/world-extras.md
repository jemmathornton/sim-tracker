# World extras from the game’s own files

Read overnight on 13–14 October 2026 from the game installed on her PC (its tuning, the settings behind each world). Nothing on the site was changed. These are the “festivals/events, eco footprint, climate and landmarks per world” ideas on the to-do list, now with real data behind them.

Data: `research/data/world-extras.json`, made by `tools/research/world_extras.py`.

## Headlines

- **Every world has its own weather list per season** except Ondarion, whose list is empty in the game files (it may get its weather some other way). Batuu is always partly cloudy.
- **Seven worlds never get snow:** Sulani, San Sequoia, Tomarang, Ravenwood, Ciudad Enamorada, Tartosa and Selvadorada (plus Ondarion and Batuu, which have no list). Sulani, Tomarang and Ciudad Enamorada get monsoons; Mt. Komorebi and Moonwood Mill can get a thundersnowstorm.
- **Festivals and events are tied to a neighbourhood in 9 worlds** (list below), so they could sit on neighbourhood cards.
- **Only 12 neighbourhoods start with an eco footprint other than Neutral**: Port Promise starts Industrial; the rest start Green.
- **Every world has three “highlights”**, the landmarks the game shows when you pick a world.

## Weather

The three likeliest kinds of weather in each season, from the game’s own forecasts (most likely first).

| World | Spring | Summer | Autumn | Winter |
|---|---|---|---|---|
| Willow Creek | sunny, chance of rain, partly cloudy | heat wave, thunderstorms, cloudy | partly cloudy, cloudy, rain | snow, chance of snow, freezing |
| Oasis Springs | sunny, partly cloudy, cloudy | heat wave, sunny, partly cloudy | sunny, partly cloudy, mysterious weather | sunny, rain, chance of rain |
| Newcrest | chance of rain, mysterious weather, partly cloudy | heat wave, thunderstorms, cloudy | chance of rain, mysterious weather, partly cloudy | snow, freezing, chance of snow |
| Granite Falls | chance of rain, rain, sunny | thunderstorms, heat wave, cloudy | windy, partly cloudy, sunny | snow, chance of snow, windy |
| Magnolia Promenade | sunny, chance of rain, partly cloudy | heat wave, thunderstorms, cloudy | partly cloudy, cloudy, rain | snow, chance of snow, freezing |
| Windenburg | chance of snow, partly cloudy, sunny | cloudy, partly cloudy, sunny | chance of rain, partly cloudy, sunny | snow, freezing, chance of snow |
| San Myshuno | chance of rain, partly cloudy, cloudy | cloudy, partly cloudy, sunny | partly cloudy, sunny, windy | snow, chance of snow, sunny |
| Forgotten Hollow | partly cloudy, cloudy, chance of rain | cloudy, heat wave, thunderstorms | cloudy, partly cloudy, rain | chance of snow, cloudy, partly cloudy |
| Selvadorada | sunny, chance of rain, rain | sunny, heat wave, partly cloudy | sunny, chance of rain, rain | chance of rain, rain, partly cloudy |
| Brindleton Bay | chance of rain, rain, partly cloudy | thunderstorms, partly cloudy, sunny | chance of rain, partly cloudy, rain | snow, chance of snow, freezing |
| Del Sol Valley | sunny, chance of rain, chance of snow | sunny, cloudy, partly cloudy | sunny, windy, chance of rain | sunny, chance of rain, chance of thunderstorms |
| StrangerVille | sunny, partly cloudy, cloudy | heat wave, sunny, partly cloudy | sunny, partly cloudy, mysterious weather | sunny, rain, chance of rain |
| Sulani | sunny, chance of rain, cloudy | sunny, windy, monsoons | sunny, windy, monsoons | sunny, cloudy, windy |
| Glimmerbrook | chance of rain, partly cloudy, sunny | cloudy, partly cloudy, sunny | chance of rain, partly cloudy, sunny | snow, chance of snow, freezing |
| Britechester | cloudy, sunny, partly cloudy | cloudy, sunny, rain | sunny, cloudy, partly cloudy | chance of snow, cloudy, partly cloudy |
| Evergreen Harbor | sunny, partly cloudy, windy | sunny, partly cloudy, cloudy | sunny, partly cloudy, windy | partly cloudy, cloudy, windy |
| Mt. Komorebi | sunny, rain, partly cloudy | sunny, partly cloudy, cloudy | rain, chance of rain, partly cloudy | snow, freezing, chance of snow |
| Henford-on-Bagley | partly cloudy, cloudy, sunny | partly cloudy, cloudy, sunny | partly cloudy, chance of thunderstorms, cloudy | chance of snow, snow, chance of rain |
| Tartosa | sunny, partly cloudy, cloudy | sunny, partly cloudy, cloudy | sunny, partly cloudy, cloudy | sunny, windy, partly cloudy |
| Moonwood Mill | sunny, rain, chance of rain | sunny, rain, heat wave | sunny, partly cloudy, windy | snow, chance of snow, sunny |
| Copperdale | sunny, chance of rain, partly cloudy | partly cloudy, sunny, heat wave | partly cloudy, sunny, cloudy | snow, chance of snow, freezing |
| San Sequoia | sunny, partly cloudy, rain | sunny, partly cloudy, cloudy | cloudy, sunny, chance of rain | partly cloudy, sunny, chance of rain |
| Chestnut Ridge | sunny, windy, rain | sunny, partly cloudy, heat wave | windy, sunny, rain | snow, chance of snow, freezing |
| Tomarang | rain, partly cloudy, cloudy | cloudy, partly cloudy, sunny | chance of rain, sunny, partly cloudy | rain, sunny, cloudy |
| Ciudad Enamorada | cloudy, rain, partly cloudy | sunny, partly cloudy, rain | partly cloudy, sunny, chance of rain | sunny, windy, rain |
| Ravenwood | partly cloudy, cloudy, sunny | sunny, partly cloudy, chance of rain | partly cloudy, cloudy, sunny | cloudy, partly cloudy, sunny |
| Nordhaven | chance of rain, sunny, partly cloudy | sunny, partly cloudy, cloudy | chance of rain, partly cloudy, sunny | sunny, snow, chance of snow |
| Innisgreen | chance of rain, sunny, partly cloudy | sunny, cloudy, chance of rain | sunny, chance of rain, partly cloudy | snow, chance of snow, sunny |
| Gibbi Point | sunny, rain, partly cloudy | sunny, cloudy, partly cloudy | cloudy, sunny, partly cloudy | sunny, cloudy, chance of snow |
| Ondarion | – | – | – | – |

## Festivals and events by neighbourhood

Names are the game’s own, except those marked * (the game never shows a name for them, so the name is made from its settings).

| World | Neighbourhood | Festivals and events |
|---|---|---|
| San Myshuno | Spice Market | Spice Festival, Flea Market |
| | Arts Quarter | Humor and Hijinks Festival |
| | Fashion District | GeekCon, Romance Festival |
| Sulani | Ohan’ali Town | Island Celebration*, Fishing Competition*, Beach Bonfire*, Town BBQ*, Town Potluck*, Flowers and Music*, Family Fun Day* |
| | Mua Pel’am | Turtle Hatching* |
| Britechester | University of Britechester | Debate Showdown, Figure Painting, Britechester Game Day Party, Creativity Celebration |
| | Foxbury Institute | School Spirit Day, Utili-Bot Contest, Foxbury Game Day Party |
| | Gibbs Hill | Sprite Celebration Ritual (the game puts it at the Ritual Grounds in Gibbs Green) |
| Mt. Komorebi | Wakaba | Festival of Youth |
| | Senbamachi | Festival of Light |
| | Yukimatsu | Festival of Snow |
| Henford-on-Bagley | Finchwick | Finchwick fairs: Oversized Crop, Garden, Cow, Chicken and Llama |
| Copperdale | Rockridge Heights | Sports days (cheerleading, football) and science fairs (chess, computer) |
| Ravenwood | Crow’s Crossing | Ravenwood Family Day, Funeral BBQ*, Casket Sale* |
| | Mourningvale | Thinned Festiveil, Afterlife Anonymous (the game’s own text uses that name) |
| | Whispering Glen | Moon Revelry, Full Moon Revelry |
| Nordhaven | Gammelvik and Iverstad | Hobby meetups in both: books, creative, fitness, food and drink, logic, performer, pottery* |
| Gibbi Point | Jellyfish Junction | Glow and Flow Festival, Fitness Fest (and its Wacky Wednesday) |
| | Crystal Valley | Sunrise, Sunset Festival |
| | Wanderwood Wilds | ’Round the Fire Festival |

The other worlds have no events tied to a neighbourhood. Bar nights, study groups, open mics and the like belong to a lot type, not a place. Willow Creek also has a Music Festival (a time-limited live event).

## Eco footprint at the start

The game sets a starting eco footprint for these neighbourhoods. Everywhere else starts Neutral.

| World | Neighbourhood | Starts |
|---|---|---|
| Evergreen Harbor | Port Promise | Industrial (fully) |
| Evergreen Harbor | Grims Quarry | Green (fully) |
| Willow Creek | Magnolia Blossom Park | Green (fully) |
| Oasis Springs | Desert Bloom Park | Green (fully) |
| San Myshuno | Myshuno Meadows | Green (fully) |
| Henford-on-Bagley | The Bramblewood | Green (fully) |
| Henford-on-Bagley | Old New Henford | Green |
| San Sequoia | Gilbert Gardens | Green |
| San Sequoia | Hopewell Hills | Green |
| Tartosa | Terra Amorosa | Green (fully) |
| Innisgreen | Sprucederry Grove and Everdew | Green |

“Fully” means the game’s furthest setting. This is only where each neighbourhood starts; the footprint changes in a save as Sims build and vote.

## Highlights (landmarks)

The three highlights the game shows for each world:

| World | Highlights |
|---|---|
| Willow Creek | Pendula View, Ferryboat, Home to Bob Pancakes |
| Oasis Springs | Brontosaurus Bend, Abandoned Mine, Mirage Canyon Lookout |
| Newcrest | Lots of Space!, Peace and Quiet, Plenty Room to Jog |
| Granite Falls | Camping and Cabins, Insect Collecting, Granite Falls Forest |
| Magnolia Promenade | Scout Out Your Shop Location, Outdoor Park Activities, Watch the Ducks |
| Windenburg | The Bluffs, Von Haunt Estate, Olde Platz Ruins |
| San Myshuno | Festivals, Night Life, Myshuno Meadows |
| Forgotten Hollow | Great for Night Owls!, Local History, Unique Flora |
| Selvadorada | Explore the Jungle, Hidden Temple, Ancient Artifacts |
| Brindleton Bay | The Best Dog Walking Paths, Lighthouse, Whiskerman’s Wharf |
| Del Sol Valley | Starlight Boulevard, Picturesque Views, Celebrities! |
| StrangerVille | Strangerville Plaza, Shady Acres Vista, Interesting Locals |
| Sulani | Active Volcano!, Ocean Activities, Local Culture |
| Glimmerbrook | Magic Portal, Casters Alley, Enchantment |
| Britechester | University of Britechester Campus, Foxbury Institute Campus, Historic Mysteries |
| Evergreen Harbor | Port Promise, Grims Quarry, Conifer Station |
| Mt. Komorebi | Snow Sports, Onsen Venue, Mountain Climbing Excursion |
| Henford-on-Bagley | Ramble the Bramblewood, A Cozy Village, Weekly Fair |
| Tartosa | Village Square, Romantic Sights, Local History |
| Moonwood Mill | Local History, Natural Wonder, Mysterious Sightings |
| Copperdale | Pier Attractions, Academia, Town Centre |
| San Sequoia | Park Paradise, Wharf Wonders, Family Friendly |
| Chestnut Ridge | Explore Dreadhorse Caverns, Go Horseback Riding, Rare Fishing Spots |
| Tomarang | Night Market, Local Living, Rich History |
| Ciudad Enamorada | Revel in Romance, Looking for Love, Enchanting Locale |
| Ravenwood | Ghosts & Grim, Memorial Sites, Chilling Collections |
| Nordhaven | Old Town Charm, Practice Your Hobby, Get Inked |
| Innisgreen | Bohemian Lifestyle, Healing Haven, An Enchanting World |
| Gibbi Point | Natural Wonders, Outdoor Activities, Fluttery and Feathery |
| Ondarion | Sunny Coastline, Emerald Sea, Elite Lifestyle |
| Batuu | Black Spire Outpost, Millennium Falcon, The Resistance Encampment |

Each highlight also has a sentence or two of the game’s own description in the data file. These are EA’s words, so on the site they’d need to be shown as the game’s text (short) rather than as her own.

## What could go on the site (her call)

- A small “Weather” line on each world page (e.g. “Snowy winters, heat waves in summer”, or the table row).
- Festivals on the neighbourhood cards of the 9 worlds above.
- “Starts Green” / “Starts Industrial” on the 12 neighbourhood cards.
- The three highlights on each world page.
