# Special lot groups: what the game says

Checked overnight 21–22 October 2026, report only. Sources: the game’s own files (each area’s world file, its name and description, street and region tuning, lot type list), her newest “Building” save (Building #2, read from a temporary copy, lots only: which world each lot sits in) and EA’s public Gallery. Nothing on the site was changed.

## At a glance

- **Four groups aren’t real neighbourhoods:** Secret Lots in Magnolia Promenade, Del Sol Valley, StrangerVille and Ravenwood. The Magic Realm (Glimmerbrook) is a fifth, borderline one.
- **None of them works like Windenburg’s.** Windenburg’s three lots sat inside the Windenburg world. The Get to Work lots and The Magic Realm are separate worlds in the game. Plumbob Pictures, the Lab and the Netherworld Department each have their own area in their world, and nothing in the files ties them to a neighbourhood.
- **Suggestion: keep all five groups.** The game files give no neighbourhood to link any of them into. Two small things for her to decide are below (Sixam on its own; the name “Secret Lots” for Plumbob Pictures).
- **Every other group is a real game area.** Deadgrass Isle, Myshuno Meadows, Magnolia Blossom Park, Desert Bloom Park, Granite Falls Forest and Rockridge Heights all match the game. So do the lots already linked in by hand (Isle of Volpe, Omiscan Royal Baths, the three Mt. Komorebi climb lots).
- **Mt. Komorebi:** Base Camp, The Croft Icefall and the Peak are all lot type **Mount Komorebi Summit** (game id 247118). Unchanged Gallery copies of all three carry that id.

## How the game marks a real neighbourhood

Each area of a world is its own world file. A real neighbourhood’s file has a name, a description and a picture for the world map (e.g. Windslar, Deadgrass Isle, Myshuno Meadows). Special lots sit in files of their own with no name, or a name but no picture. The save also says which world each lot belongs to. That’s how Windenburg’s three lots showed up as “in Windenburg, own area, no neighbourhood”.

The files don’t say where a lot appears on the world map, so nothing below is about map position.

## Task 1: the groups

### Magnolia Promenade – “Secret Lots”

| Lot | The game’s own home |
|---|---|
| Police Station | None: a separate world, “Office Site” in her save (Get to Work’s civic area) |
| Willow Creek Hospital | None: a separate world, “Office Site” (same civic area file as the Police Station) |
| FutureSim Labs | None: a separate world, “Office Site” (its own science lab area) |
| Sixam | None: a separate world with no name, the alien world |

**Suggestion: keep the group.** None of the four is in the Magnolia Promenade world in the game, so there’s no neighbourhood to link them into. *Her call:* Sixam is a different kind of place from the three workplaces, so it could be its own group, like The Magic Realm.

### Del Sol Valley – “Secret Lots”

| Lot | The game’s own home |
|---|---|
| Plumbob Pictures | Del Sol Valley world, its own area. The game names that area “Plumbob Pictures” and gives it a description (“Where the Magic Happens!”) |

**Suggestion: keep it separate.** The game treats it as its own named place and links it to none of the three neighbourhoods. *Her call:* it isn’t really secret (it’s the acting studio), so the group could be called “Plumbob Pictures” instead. If she sees it as part of a neighbourhood’s area, it can be linked in like Windenburg, but only on her word.

### StrangerVille – “Secret Lots”

| Lot | The game’s own home |
|---|---|
| The ██████ Lab | StrangerVille world, its own area, named “Crater Base” in the game (description: “Mysterious!”) |

**Suggestion: keep the group.** It’s a named place of its own (the crater lab), not part of StrangerVille Plaza or Shady Acres in the files.

### Ravenwood – “Secret Lots”

| Lot | The game’s own home |
|---|---|
| Netherworld Department | Ravenwood world, its own area, named “HeadlessQuarters” in the game (Grim’s office), with a description but no map picture |

**Suggestion: keep the group.** The files link it to none of the three neighbourhoods. If she thinks of it as part of Mourningvale’s area, it could be linked in like Windenburg, but that has to come from her.

### Glimmerbrook – “The Magic Realm”

| Lot | The game’s own home |
|---|---|
| The Magic Realm | None: a separate world, “The Magic Realm” in her save (its own region in the game) |

**Suggestion: keep it as it is.** It really is its own place.

### Already fine (real areas, or lots linked in by hand)

- **Real game areas with one or two lots:** Deadgrass Isle (full neighbourhood with name, description and picture), Myshuno Meadows (same), Magnolia Blossom Park and Desert Bloom Park (each its own named park area), Granite Falls Forest, Rockridge Heights.
- **Lots inside the right area already:** Isle of Volpe (same area file as The Bramblewood) and Omiscan Royal Baths (same area file as Belomisia Jungle).
- **Lots linked into a neighbourhood by hand, like Windenburg:**
  - Hermit’s House (Granite Falls Forest group): its own area in Granite Falls.
  - Base Camp, The Croft Icefall and Mt. Komorebi Peak (Yukimatsu): three small areas of their own in Mt. Komorebi. The game’s own hint text puts the Croft Icefall “on your way up Mt. Komorebi”.
- **Worth knowing, her call:** Sylvan Glade (in Foundry Cove) and Forgotten Grotto (in Desert Bloom Park, her choice on 13 Oct) are separate secret worlds in the game, the same as The Magic Realm. The site links two of them into a neighbourhood but keeps The Magic Realm as its own group. Either way is fine. It only matters if she wants them all done the same way.

## Task 2: Mt. Komorebi climb lots

**Answer: all three are Mount Komorebi Summit**, the game’s own lot type for the climb (venue id 247118, `venue_MountainExcursion`).

Evidence:

- **The game’s lot type list** has only one climbing lot type, “Mount Komorebi Summit”. It’s hidden from the lot type list in Build mode, and Mt. Komorebi is the only world that allows it. The pack’s only other new type is Onsen Bathhouse.
- **The Gallery stores the lot type id.** Unchanged copies of each lot, at the game’s own sizes, carry id 247118:
  - Base Camp, 20×15: three copies (Chichi3chi, katie_london, lilsimsie)
  - The Croft Icefall, 20×15: one copy (katie_london)
  - Mt. Komorebi Peak, 20×20: one copy (Issabella14)

  The Gallery shows that id as “Missing sims translation”, EA’s own text bug for a type it has no name for. So the “one Gallery copy” in the to-do list is really several, and all of them agree.
- **Most Gallery copies say Residential** (about 50 Base Camps, 40 Icefalls, 115 Peaks). The builders changed the lot type to upload or rebuild them, so those copies say nothing about the original.
- **Not evidence:** the Gallery upload *titled* “Mount Komorebi Summit” (Drutrubuilder) is a 50×50 Park. Only the title matches.
- Her Building save stores no lot type for any of the three. That’s normal for a lot that has never been changed. The game’s lot records and area files don’t store a starting lot type either.

**Small catch:** because the type is hidden in Build mode, a lot changed to something else probably can’t be set back from the lot type list. Keep the original lots untouched if the climb has to keep working.

If she agrees, Base Camp and The Croft Icefall get type “Mount Komorebi Summit”, like the Peak (TODO.md, the [Jemma] item on their lot type).
