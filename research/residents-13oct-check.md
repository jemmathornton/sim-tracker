# Residents from the 13 Oct move: who decided? (31 Oct check)

Report only; nothing changed.

The residents audit (her 12 Oct spreadsheet against the plan) put 51 differences down to the 13 Oct move from the chat (commit daeeac9). That label was misleading: it looked for the first commit containing the *text* (e.g. “N/A”, “Empty”, “Delgato”) anywhere in the world file. Going lot by lot through every commit shows that **only 7 of the 51 still have the value the chat gave them**; the rest were changed later, almost all with her answer on record.

Sources: every commit touching each lot (lot-by-lot history of `data/worlds/*.json`), her chat messages and her answers to Claude’s questions in the two session transcripts, `old-chat-notes/`, `HANDOVER.md`, and the spreadsheet backups in Downloads (read through copies). Times below are UK time. The backups dated 14–23 Oct were written by Claude with her OK, so they show what was copied across, not her own edits.

## Summary

| Group | Lots | Result |
|---|---|---|
| Real home assignments | 23 | 22 her call, with her words; 1 (Paradise Stables) still open, already on her list |
| Venue lots now “N/A” (lot type changed) | 9 | all her lot-type choices, 15–16 Oct |
| Question marks dropped / wording | 5 | from the chat, 13 Oct; her own OK not kept for Kopf and the three Nordhaven families |
| Lots renamed (her sheet has the same value under the old spelling) | 6 | not real differences |
| Lots not in her sheet (blank or hidden lots) | 8 | the game’s defaults, filled on her say-so |

**Needs her:** nothing big. Four small ones where only the chat removed her question mark (Kopf at Riverside Roost; Loden, Koopman, Sarpong in Nordhaven). Paradise Stables is still undecided and already on her list.

## Real home assignments

| Lot (world) | Her sheet said | The site says | Verdict |
|---|---|---|---|
| Domus Familiaris (Brindleton Bay) | Large 3 Bedroom | Delgato | Her call, 18 Oct (just after midnight): “Yes move them and own it.” (cd27e23) |
| Brindleton Pawspital (Brindleton Bay) | N/A | Delgato (owners) | Same answer, 18 Oct |
| Chateau Frise (Brindleton Bay) | Delgato | Empty | Follows from the Delgato move, 18 Oct |
| Sporting Space / Brindleton Boathouse (Brindleton Bay) | Newbie? | Empty | Her call, 14 Oct: asked who lives there, answered “Nobody yet” (575a47f) |
| Spring Steppes (Britechester) | Elderberry & Pleasant | Elderberry, Pleasant twins renting unit 3 | Her call: 14 Oct “the Elderberry family owns it and Pleasant live there too… it’s only 3 units”; 22 Oct “Elderberry 1, Pleasant twins 3, 2 empty.” (cadec70, f9041cc) |
| Totter Park (Copperdale) | N/A (cemetery) | Price | Her call, 15 Oct: “I could move them to the big park lot as they’re a big family.” (e32cdd1) |
| BridgeCreek Drive (Copperdale) | Price | N/A (Backroom) | Same, 15 Oct |
| The Quarry Building (Evergreen Harbor) | N/A | Sterling Rico | Her idea, 15 Oct: “moving the Sterling Rico small business to the Quarry Building… that they also live on”; then “Yeah those changes are good.” (934bef2) |
| Stonestreet Apartments #4 (Evergreen Harbor) | Sterling Rico | Empty | Same, 15 Oct |
| The Old Mill (Evergreen Harbor) | Sterling Rico | N/A (Backroom) | Same, 15 Oct: “I could do a climbing gym back room?” |
| Pinecrest Apartments #402 (Evergreen Harbor) | Eco Roomies? | Empty | Her call, 21 Oct: asked #402 or #404, answered “It is 404” (7b38d33) |
| Pinecrest Apartments #404 (Evergreen Harbor) | 2 Bed | Eco Roomies | Same, 21 Oct |
| Crystal Cottage (Gibbi Point) | Addam Commune | N/A (Onsen Bathhouse) | Her call, 15 Oct: “Put it there and swap Addam Commune to Miner’s Manse.” (49363a8) |
| Miner’s Manse (Gibbi Point) | Empty | Addam Commune | Same, 15 Oct |
| 3 Cobblebottom Street (Henford-on-Bagley) | Cecilia Kang “A New Start” Moody & McMillan | Moody & McMillan, Cecilia Kang renting 3A | Split into owners + tenant by the chat (13 Oct); her call 22 Oct: asked “Cecilia in 3A, Moody & McMillan in 3B?”, answered “Keep as is” |
| Prowler’s Patch / New Moon Cabins (Moonwood Mill) | N/A | Werewolves in Training | Her rows had slipped by one; her OK 16 Oct, “yes fix” (107fc26); then “Residential rental, new friend I’m going to make” (cc9c16a) |
| The Grimtooth Bar & Bunker (Moonwood Mill) | Werewolves in Training | N/A (Bar) | Same fix, 16 Oct |
| 36 Bayani Place (San Sequoia) | Luna-Sullivan | N/A (Vet Clinic) | Her idea and call, 18 Oct (just after midnight): “I could move one of the families in Hopewell Hills into the other side of the rental”; then “Yes, and maybe leave owner as NPC for now” (2354314) |
| Sequoia Cottage (San Sequoia) | Lovejoy own | Lovejoy, Luna-Sullivans renting | Same night: “One kid moved next door and bought it and rented other half.” |
| Celebrazioni d’Amore (Tartosa) | Capp/Monty? | N/A (Lounge) | Her idea, 16 Oct: the runaway Montys move to Tartosa; Claude proposed the two lots go back to the game’s types, she said “I like that idea.” (319fb86) |
| La Coppia Serena (Tartosa) | Capp/Monty? | N/A (Wedding Venue) | Same, 16 Oct |
| Sungai Point (Tomarang) | Linh-Sadya & Linh | Linh-Sadya, with Linh renting | Her call, 18 Oct: “Yes split households and use each with EA bio.” (18bbea7; its message says 19 Oct, but it was 18 Oct) |
| Prospector’s Paradise / Paradise Stables (Gibbi Point) | Horses! | ? (Horses!) | Chat marked it “to be decided” (13 Oct); she confirmed 15 Oct: “Still deciding”. **Still open**, on her list (“Paradise Stables: who lives there?”) |

## The small ones

**Venue lots now “N/A”** (a home became a venue, so nobody lives there; all her lot-type choices):
- Ciudad Enamorada, 16 Oct: Torres Amanecer (restaurant; her idea, “the restaurant would be better in the downtown area”), Calle del Ensueño (Community Market; “Yes”), Casita del Amor and Caminito del Deseo (“Caminito as wedding venue. Casita as a rec center.”).
- Nordhaven, 15 Oct: New Harbor Park (Community Space), Lighthouse Lookout (Library; her idea, “it could be a library”).
- Ondarion, 16 Oct: Sankofa Residence (“let’s tag it as a museum then”), Fisherman’s Hut (seafood restaurant; “Either Fisherman’s or Sankofa would work”, “Sure”), The Lair in the Open-Air (“would be a good park… it has a pier out the back”).

**Question marks dropped or wording** (the chat, 13 Oct; still as the chat left them):
- Riverside Roost (Willow Creek): “Kopf?” → “Kopf”. The chat noted “needs your OK” and changed her spreadsheet on 12 Oct with a backup; her own OK isn’t kept. She has since treated the Kopfs as settled (24 Oct: “I’ve added Reynolds and Kopf to gallery”).
- Koffieboon “Loden?”, Terra-Potta “Koopman??”, Spilled Neon “Sarpong?” (Nordhaven) → no question marks. These are the game’s own families on those lots; her own OK isn’t kept.
- Specter Row / Moppy Manor (Ravenwood): “Specter & Rent Out” → “Specter (rent out)”: same meaning. Rental or haunted house is still open on her list.

**Lots renamed, not real differences** (her sheet has the same residents under her old spelling; spellings fixed with her OK, 13 Oct): Champion’s Grove (Sienna & Flapjack), Avenida de la Eternidad (Dynamic Daters), Creek Side Corner (3 Bed), Piccola Luce (N/A), The Summer Home (N/A), 1313 21 Chic Street (Empty in her sheet; Karaoke Legends since her answer on 31 Oct: “I think Karaoke Legends stay there for the two of them”).

**Not in her sheet** (blank or hidden lots, filled with the game’s defaults):
- Straud Mansion (Forgotten Hollow): her sheet’s Forgotten Hollow tab was blank (pack not owned). 16 Oct Claude showed her the world with “Straud Mansion: Vladislaus Straud, keep”; she said “Yes to both of those” (the other two lots) and didn’t object. The game’s own family.
- Secret lots, all venues (N/A): Hermit’s House, Mt. Komorebi Peak, Forgotten Grotto, Sylvan Glade (added 13 Oct); Mt. Komorebi Base Camp, The Croft Icefall, Omiscan Royal Baths (her pick, 15 Oct; Base Camp and Croft Icefall as the game’s Summit lot, her call 22 Oct).
