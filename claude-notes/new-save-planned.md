---
name: new-save-planned
description: "Her new save \"Jemma's Sim World\" (started 23 Oct, Slot_00000019.save) will hold the plan; until she's filled it, older saves' data are stand-ins"
metadata:
  node_type: memory
  type: project
  originSessionId: 0a5c276e-1356-48ae-af7e-812c68f890d1
  modified: 2026-10-28T22:15:54.728Z
---

Jemma said on 22 Oct 2026 she'd make a brand-new save for the project and re-import everything into it, from lots to the holiday calendar. She created it on 23 Oct 2026: **"Jemma's Sim World"** (Slot_00000019.save at the time; slot numbers can change if she uses Save As). On day one it was the game's fresh start (142 EA households, nothing of hers), so "some stuff will be off" until she works through for-jemma/new-save-checklist.md.

**Why:** none of her older saves matches the plan fully; the new save is built from the site and her Gallery ([[gallery-beats-building-save]], [[sims-source-gallery]]).

**How to apply:** treat data read from older saves (holidays from "Rotational", lot traits from "Building #2", own households) as provisional. Don't read the new save into the site until she says it's set up (her checklist ends "Save As 'Sim World' and tell Claude"); then re-read holidays, lot traits, units and households from it, and point tools/lot_traits.py etc. at it instead of the newest "Building" save. Saves are always read from temporary copies.

28 Oct 2026: after EA's patch 1.129 (27 Oct) she decided to start the new save again, once MCCC and a premade-fix mod are updated for the patch (the fix mod only works in a save made after it's installed). The 23 Oct save (91 lots placed in 11 worlds) will be replaced; when she starts the fresh one, remake research/data/new-save-baseline.json from a brand-new untouched save (`new_save_check.py --baseline <file>`) and point the check at the new slot.

After each of her building sessions (she says "I've done X, check it"), rerun tools/research/new_save_check.py then tools/build.py: it reads the newest copy of the save and Admin > Notes (New save) shows what's left. Related: [[gallery-beats-building-save]]
