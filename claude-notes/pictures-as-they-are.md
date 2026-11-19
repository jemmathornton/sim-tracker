---
name: pictures-as-they-are
description: "Her household/Sim pictures are shown exactly as the game made them: no cropping, no stretching, never combined into a new picture"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0a5c276e-1356-48ae-af7e-812c68f890d1
  modified: 2026-10-24T13:39:50.706Z
---

Household and Sim pictures (from her Library / Gallery uploads) are used exactly as the game made them (24 Oct, her call after crops cut feet and shadows: "just keep pics exactly as is no cropping at all"), never shown larger than their own size. Never build a new picture out of several (24 Oct 2026 she stopped a "group from the Sim pictures" fix at once: "Do not compose a picture").

**Why:** big families are drawn small by the game, so stretching them blurs them; every crop went wrong (feet cut, odd shadows), so she wants them untouched, like the Gallery shows them.

**How to apply:** no cropping or resizing in tools/library_pictures.py; layout only via CSS (`.hh-pic.library img`). Missing feet etc. come from the game itself; only her own screenshots fix that. Related: [[no-generated-text]]
