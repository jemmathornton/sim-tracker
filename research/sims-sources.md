# Where Sims, households and relationships could come from (overnight 16–17 Oct)

Research only. Nothing on the site, in `data/`, `tools/` or `TODO.md` was changed, and nothing was committed. Saves were read from temporary copies through `tools/sims4files.py`. Her Library files were copied to a scratch folder and read there. The “Building…” saves were opened only to read their names, never for Sims. Personal Sim names are not copied here; household names appear only as examples.

How to show Sims once we have them (cards, trees, webs) is covered in `research/sims-display.md`. This note is only about **where the data comes from**.

---

## Headlines

- **All three sources in the game hold family links.** Her other saves, her Library and the game’s own premade families all record mother, father and grandparents, plus partners.
- **Friendships and romances between households are only in saves** (with their names: Good Friends, Co-Workers and so on) **and in the game’s own premade set-up** (EA’s starting friendships between its families). The Library keeps family only.
- **Her other saves are big and old.** There are 30, mostly from before 2024. They hold thousands of townies and none of her rebuilt lots. In the newest, *Season Events* (15 Mar 2026), 53 household names match households in her plan, most of them EA families.
- **Her Library has 122 households (275 Sims).** 56 of them (129 Sims) are her own uploads; the rest are other creators’ or Maxis. Each has names, ages, traits and family links, but no friendships with other households.
- **EA’s families are in the game files.** The game has 191 premade household templates, 400 premade Sims, and a list of 348 starting relationships and 81 family fixes between them (e.g. which Willow Creek Sims start as good friends). Reading them needs one small new reader, which works in a scratch test.

---

## 1. Her saves other than “Building…”

30 saves (not counting the `.ver` backups). Two are Building saves and were skipped: *Building* (Slot 2) and *Building #2* (Slot 13, plus its Autosave). The dates are file dates; many show 21 Dec 2023, probably when the folder was copied over.

| Save | Date | Worlds | Households | Sims | Relationships | Family links |
|---|---|---|---|---|---|---|
| Season Events | 15 Mar 2026 | 32 | 957 | 1,735 | 11,867 | 987 (+ family tree: 1,596 Sims) |
| Not So Berry | 11 Oct 2025 | 30 | 1,719 | 1,966 | 15,071 | 1,723 |
| 100 Baby Challenge!! | 24 Sep 2025 | 29 | 348 | 764 | 7,931 | 597 |
| My Saved Game 4,375 | 13 Oct 2024 | 27 | 95 | 216 | 0 | 93 |
| Horses! | 12 Jan 2024 | 27 | 469 | 751 | 3,511 | 286 |
| Vivian – 100 Babies Challenge | Dec 2023 | 26 | 287 | 619 | 5,038 | 433 |
| Rotational | Dec 2023 | 24 | 475 | 702 | 5,292 | 327 |
| Rags to Riches | Dec 2023 | 18 | 351 | 423 | 3,677 | 423 |
| All Universities | Dec 2023 | 26 | 235 | 371 | 1,659 | 112 |
| 20 smaller saves (StrangerVille Playthrough, Sulani Save, Snowy Escape, Starter Save, …) | Dec 2023 | 5–25 | 9–191 | 27–311 | 0–4,008 | 14–185 |

“Relationships” counts pairs of Sims that know each other. Four of the oldest saves keep these on each Sim instead of in one list (2,504 and 4,008 in the two *My Saved Game* saves).

### What a save holds (field names from the game’s own save layout)

- **Households:** `SaveGameData.households` → `HouseholdData`: `name`, `sims` (ids), `home_zone` (the lot), `premade_household_template_id` (set for EA families), `is_player`, `is_unplayed`.
- **Sims:** `SaveGameData.sims` → `SimData`: `sim_id`, `household_id`, `first_name`, `last_name`, `gender`, `age` (a life-stage code), `primary_aspiration`, `significant_other`, `fiance`, `steadies`, and under `attributes`:
  - `trait_tracker.trait_ids` (the game’s own trait names can be looked up, as with lot traits)
  - `genealogy_tracker.family_relations` → `FamilyRelation` (`relation_type`, `sim_id`). The types are MOTHER, FATHER, the four grandparents, and in the list also SIBLING, SPOUSE, COUSIN, HALF_SIBLING etc. In practice saves store parents and grandparents; the rest is worked out from them.
  - `relationship_tracker.relationships` (older saves only): `target_id`, `bits`, `tracks`
- **Relationships (current saves):** `SaveSlotData.gameplay_data.relationship_service.relationships` → `PersistableServiceRelationship`: `sim_id_a`, `sim_id_b`, and `bidirectional_relationship_data` with `bits` (e.g. Friend, Good Friends, Acquaintances, Co-Workers, Has Met, family bits), `tracks` (friendship and romance bars, −100 to 100: `LTR_Friendship_Main`, `LTR_Romance_Main`), `family_trope_id`, `romance_trope_id`, plus `relationship_label_data`.
- **Family tree (newest saves only):** `gameplay_data.family_tree_service.family_tree_graph` → `FamilyTreeNode` (`sim_id`, `first_name`, `last_name`, `gender`, `culled` for Sims no longer in the save, `outgoing_edges` → `FamilyTreeEdge`: `source_sim_id`, `target_sim_id`, `relationship_flags`) and `premade_ancestors`. Only *Season Events* has one. It keeps dead and removed ancestors too, which is useful for trees.
- `SaveGameData.relgraph` (`SimRelationshipGraphData`) exists in the layout but is empty in every save.

Relationship names come from the game: 481 of the 726 relationship “bits” have an English name (the rest are hidden markers such as “Greeted”).

**Effort:** low. The existing tools read all of this; a script like `lot_traits.py` would do it. The real work is choosing **which** save, and keeping only the households on her plan, not the thousands of townies.

**Catch:** none of these saves has her rebuilt lots, so “who lives where” won’t match her plan. A save shows what happened in that game, not her current story.

---

## 2. Her Library (Tray folder)

122 households: 56 hers (JemmaTheSimmer, 129 Sims), 6 Maxis, 60 from other creators (Tiquelle and others). 20 household names match residents in her plan.

A household is 4+ files with the same id:

| File | What it is | Readable? |
|---|---|---|
| `.trayitem` | The Library card: household name, description, creator, and a summary of each Sim (name, age, gender, traits, aspiration, likes/dislikes, family links, life state) | Yes: an 8-byte header, then `TrayMetadata` |
| `.householdbinary` | The full household: every Sim as a `SimData` (as in a save), money, inventory | Yes: a short header (three versions, 0/1/2), then `FamilyData.family_account` (`AccountFamilyData`: `familyname`, `sim`, `description`, `original_creator_string`) |
| `.hhi` | The household picture in the Library | Scrambled image, not a plain JPEG; would need extra decoding |
| `.sgi` | One portrait per Sim | Same as `.hhi` |

What’s in them (all 122 read):

- **Names, ages, gender, traits, aspiration:** yes, for every Sim.
- **Family links:** 43 households (200 links, MOTHER / FATHER / grandparents). 27 of her 56 have them.
- **Partners:** `significant_other` is set on 56 Sims.
- **Friendships:** only within the household, and only in 6 households (62 pairs). **Never to Sims in other households** (the game drops them when a household goes to the Library).

**Effort:** low; the same reader as saves.

**Catch:** the Library is a snapshot from whenever she saved each household. A household she never saved isn’t there, and it doesn’t say where the household lives.

---

## 3. EA’s premade families in the game files

There are two layers, both in the package files under the game folder.

### a) Premade household files

197 household resources (`householdbinary`, as in the Library) in the Client packages, with 419 Sims. They include the older base-game families stored by name (Goth, Caliente, Pancakes, Landgraab, Spencer-Kim-Lewis, Bheeda, …) and many later ones stored under template names (`premadeHouseholdTemplate_EP11_Kang`, …). 64 of them have family links. They don’t hold friendships. Newer ones have no names inside: their names are text keys in the game’s English strings, which `sims4files.english()` already reads.

### b) The premade tuning

The game’s tuning (its “combined tuning”) defines:

- **191 `PremadeHouseholdTemplate`** (`_household_members`, and `_household_relationship` with `is_spouse`, `family_relationship` such as FATHER/MOTHER, and `relationship_bits`). For example, the Goths: Mortimer and Bella spouses, both parents of Cassandra and Alexander.
- **400 `PremadeSimTemplate`** (`first_name`/`last_name` text keys, traits, and a link to the Sim’s look file `.siminfo`).
- **`world.premade_sim_relationships`**, the links *between* households:
  - `FAMILY_RELATIONS_FIXUP`: 81 (PARENT 59, SPOUSE 12, CHILD 9, SECRET_PARENT 1)
  - `RELATIONSHIP_MAP`: 348 pairs, each with a relationship “loot”: Good Friend 54, Acquaintance 42, Friends 9, Mildly Disliked 4, Close Friends 2, Significant Other 1, plus story set-ups (e.g. Businesses & Hobbies’ Betrayed Business Partner, Cottage Living’s villagers, Werewolves’ Moonwood Mill packs, Royalty & Legacy’s criminals). All 348 pairs are between premade Sims, e.g. Windenburg’s Villareal, Bjergsen, Fyres and Romeo friends.

**Effort:** medium. The base game’s main tuning is plain XML, but the packs’ updates are in a packed binary form (a SimData “PackedXmlDocument”). A 50-line scratch reader turned it back into XML in tests, and the Goth template and relationship lists came out cleanly. A real tool would add that reader to `sims4files.py` (about 100 lines), then match templates to the households in her plan by surname.

**Catch:** this is how EA **starts** a new save, not what happened in hers. Ages, partners and babies change once she plays. It covers EA’s families only.

---

## 4. Typing them in

| Way | Pros | Cons |
|---|---|---|
| **Tell Claude in chat**, Claude writes `data/worlds/*.json` (how the Goths were added, from the Sims Wiki) | Nothing new to build; her story bits (e.g. Romeo and the Sims 2 Montys) fit easily | Slow for many Sims; she depends on a session |
| **A new tab in World Plans** (World · Household · Sim · Life stage · Mother · Father · Partner · Notes), read by `import_spreadsheet.py` | She already works there; easy to review in one place; three-way import already exists | Family trees are awkward in rows; mistyped names break links; it’s her file, so the tab is hers to add |
| **A form in the app** | Nicest to use | The site is static files with no server, so it can’t save; it would need a small local server first (as the taskbar-icon fix would), and more care before going online |
| **Sims Wiki** (as for the Goths) | Good for EA lore, ancestors and pictures of who’s who | EA’s version, not hers; link to it rather than copy its text; its pictures aren’t hers, so they can’t go on the site |

---

## Comparison

| Source | Who it covers | Names, ages, traits | Family links | Friendships / romance between households | Matches her plan? | Effort |
|---|---|---|---|---|---|---|
| Other saves | Everyone in that game | Yes | Yes (and trees in the newest) | Yes, named | No (old games, EA lots) | Low |
| Library | Households she saved | Yes | Yes | No | Partly (20 names) | Low |
| Game files (EA premades) | EA’s families only | Yes (names via text keys) | Yes, in and between households | Yes, EA’s starting ones (348) | Yes for EA families, as EA starts them | Medium |
| A save she makes for Sims | Whoever she puts in it | Yes | Yes | Yes | Yes, if it’s her current world | Low (once it exists) |
| Typing in (chat / spreadsheet) | Anything | What she types | What she types | What she types | Yes | Ongoing, by hand |

---

## Recommendation

1. **EA families first, from the game files.** This fills in every EA household in her plan with their members, family links and EA’s starting friendships, with no typing and no save rules involved. Mark them “In the game” (the origin tag already on TODO).
2. **Her own Sims from a save.** The best source would be a save that has her rebuilt world *and* her households, which today is only *Building #2*. Either she makes an exception to the Building rule for households (as she did for rental units on 16 Oct), or she keeps a separate save for Sims (e.g. named “Sims…”) that the tool reads instead. The old saves aren’t worth importing: they don’t match her plan.
3. **The Library as a top-up** for households she builds in CAS and saves before moving them in (names, traits, family links), and as a quick check.
4. **Her own story by hand** in chat, kept app-side so imports never overwrite it (as `displayName` works now).

Whichever she picks: give every Sim the game’s `sim_id` as its key, not the full name, so two Sims with the same name can’t clash (see `sims-display.md` §8).

---

## Decisions for Jemma

1. **Which save is the Sims source?** An exception for households in *Building #2*, or a separate save she names for Sims (and what to call it)?
2. **EA families from the game files:** fill them in automatically as EA starts them, or only for families she has actually played?
3. **Friendships:** show EA’s starting friendships (Good Friends, Acquaintances…), or only relationships from her own save?
4. **Library:** use her Library households as a source, or ignore it? Only her own uploads, or Maxis/other creators’ too?
5. **Typing in:** chat only, or a Sims tab in World Plans?
6. **Pictures:** the Library’s household and Sim portraits are game renders of her Sims, but scrambled. Worth decoding for Sim cards, or stick to her screenshots?
