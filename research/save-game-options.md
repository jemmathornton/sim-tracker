# Save game options: what each field is in the Game Options menu

23 Oct 2026. Report only. Where: every save holds `AccountData → gameplay_account_data → gameplay_options` (message `EA.Sims4.Persistence.GameplayOptions`, in `GameplaySaveData_pb2` in the game's generated.zip). These are the options of the save you have loaded (Game Options → Gameplay / Seasons etc.).

How this was worked out: (1) the field list and defaults straight from the protobuf descriptor; (2) the game's own table in `TS4_x64.exe` that links each menu control to the script command it runs (e.g. `culling.set_max_player_population` → UI key `MaxProtectedSims`); (3) the Python service that loads each field (`aging_service`, `culling_service`, `story_progression_service`, `tutorial_service`…); (4) the menu labels from the game's English string tables. "Sure" = all of these agree.

| Save field (default) | Menu label (English) | What it does | How sure |
|---|---|---|---|
| `autonomy_level` (FULL) | Autonomy: Off / Limited / Medium / Full | How much Sims act on their own | Sure |
| `selected_sim_autonomy_enabled` (true) | Disable Autonomy for Selected Sim (inverted) | | Sure |
| `sim_life_span` (NORMAL) | Sim Lifespan: Short / Normal / Long | Length of each life stage | Sure |
| `allow_aging` (ENABLED) | **Auto Age (Played Households):** DISABLED = Off, FOR_ACTIVE_FAMILY = Only Active Household, ENABLED = all Played Households | Whether Sims in My Households age by themselves | Sure (field read by `aging_service` as `PlayedHouseholdSimAgingOptions`, command `sims.set_aging_enabled_option`) |
| `unplayed_aging_enabled` (true) | **Auto Age (Unplayed Households):** on/off | Whether everyone else (Other Households, townies) ages | Sure (`sims.set_aging_unplayed_sims`) |
| `aging_enabled` (true) | none any more | Old on/off from before the three-way option; the game uses `allow_aging` now | Fairly sure |
| `max_player_population` (50) | **Maximum Sim Count:** | Cap on Sims in My Households (the game calls them "protected" Sims, UI key `MaxProtectedSims`); Sims outside it can be culled. Hers is 150 | Sure |
| `npc_population_enabled` (true) | **not in the menu** | No menu control and no script reads it (only the protobuf definition mentions it). Not Neighborhood Stories and not the Sim count. Probably a leftover from the 2014 game; a `False` there likely does nothing in today's game | Fairly sure it's not in the menu; what (if anything) it once did is unknown |
| `story_progression_effects_enabled` (true) | **Enable Neighborhood Stories** | The main Neighborhood Stories switch (`story_progression.set_story_progression_effects_enabled`). The per-household settings (move in/out, marry, babies…) are stored elsewhere in the save, with the households, not in GameplayOptions | Sure |
| `pivotal_moments_enabled` (true) | **Enable Discovery Quests:** | The base-game tutorial quests ("Discovery Quests"; "pivotal moments" is only the code name) | Sure |
| `reset_pivotal_moments` | Reset Discovery Quests: | One-off reset button | Sure |
| `npc_civic_voting_enabled` (true) | Enable NPC Voting | Eco Lifestyle: whether NPCs vote on Neighbourhood Action Plans | Sure |
| `npc_autonomy_breakups_enabled` (true) | Allow Automatic Breakups: | NPCs breaking up couples on their own | Sure |
| `npc_autonomy_friendly_enabled` / `_romantic_enabled` | NPC friendly / romantic autonomy switches (same group) | NPCs starting friendships / romances by themselves | Fairly sure (exact labels not found in text) |
| `dynasty_prestige_decay_enabled` (true) | Enable Dynasty Prestige Decay | Dynasty prestige slowly falls when nobody earns it | Sure |
| `season_length` (NORMAL_SEASON) | Season Length: 7 / 14 / 28 days (normal / long / very long) | | Sure on the label; the day counts from memory |
| `initial_season` | Not a Game Options control; the season the save started in (`SetInitialSeason`) | | Fairly sure |
| `rain_options`, `snow_options`, `temperature_effects_enabled`, `icy_conditions_enabled`, `thunder_snow_storms_enabled` | Rain Options:, Snow Options:, Enable Temperature Effects On Sims:, icy conditions, thundersnow | Seasons weather | Sure |
| others (`lifestyles_effects_enabled`, `dust_system_enabled`, `creature_aging_enabled`, `restrict_npc_werewolves`, `luck_enabled`, `scandal_system_enabled`, autosave fields…) | Each has its own switch (same table in the exe) | | Sure they're menu options |

What this means for her save: `allow_aging` DISABLED and `unplayed_aging_enabled` False together = nobody in the world ages. `npc_population_enabled` False can be ignored. Neighborhood Stories on/off is `story_progression_effects_enabled`, not `npc_population_enabled`.

Sources: game files read in place (copies in a temp folder): `Game\Bin\Python\generated.zip` (GameplaySaveData_pb2), `Data\Simulation\Gameplay\simulation.zip` (aging_service, culling_service, story_progression_service, tutorial_service, pivotal_moment), `Game\Bin\TS4_x64.exe` (menu-to-command table), `Strings_ENG_US.package` files (labels, via tools/sims4files.py `english()`). A web search for `npc_population_enabled` found nothing.

## Neighbourhood Stories rules (found 24 Oct, night)

They're not in GameplayOptions. SaveGameData field 23 `protected_households_story_progression_rule_set` is **My Households** and field 24 `unprotected_households_story_progression_rule_set` is **Other Households**: each has `enabled` (the tab's switch) and `rules` (rule id, ticked or not). The rule ids are the game's `StoryProgressionRuleDisplayInfo` tuning:

| Rule id | Rule |
|---|---|
| 273735 | Move In |
| 273878 | Move Out |
| 273734 | Have a Baby |
| 273882 | Adopt a Child |
| 273888 | Adopt Cats & Dogs |
| 337807 | Rescue Horses |
| 273879 | Join a Career |
| 282068 | Leave a Career |
| 282070 | Retire from Career |
| 273881 | Die in Accidents |
| 380608 | Friendship Changes |
| 380610 | Romance Changes |

Her new save (22:48, 23 Oct): My Households off; Other Households on with all 12 ticked (the game's default). `tools/research/new_save_check.py` now compares these with her picks.

**Defaults:** a setting left at the game's default isn't written into the save, so a missing field means the default (Season Length 7 days, Automatic Breakups on, Prestige Decay on, Neighbourhood Stories on).
