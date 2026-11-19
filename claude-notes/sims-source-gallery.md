---
name: sims-source-gallery
description: "Her own households go on the Gallery, one upload each (linked like lots); links between households re-added with MCCC"
metadata:
  node_type: memory
  type: project
  originSessionId: 0a5c276e-1356-48ae-af7e-812c68f890d1
  modified: 2026-10-18T18:12:17.908Z
---

Decided 19 Oct 2026: no single save is the Sims source. For now the site's Sims are a mix (EA's from game files, hers from whichever save or Library copy fits). Eventually she'll upload all her own households to the Gallery, and those uploads become the source.

**Why:** her saves hold different versions of her households; none is complete or current.

**How to apply:** don't push her to pick a save. When she says she's uploaded households, rerun `tools/own_import.py` (from her Library) and `tools/library_pictures.py --apply`. Related: [[gallery-beats-building-save]].

24 Oct 2026: one Gallery upload per household (so the site can link each household to its upload, like lots). She won't merge households to keep links through the Library; she re-adds links between households with MCCC from research/inter-household-relationships.md (tools/research/relationships.py). Don't suggest the save-together trick again.
