---
name: port-prototypes-exactly
description: "When Jemma says put a prototype in the app, port the prototype's own design and code as it is; never rebuild it in a simpler style"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0a5c276e-1356-48ae-af7e-812c68f890d1
  modified: 2026-10-17T18:38:22.671Z
---

When Jemma approves a prototype and asks for it "on the actual app", copy the prototype as it is (its layout, fields, table style, tree, wording), adapting only the data plumbing. Don't redesign or simplify it from a list of her decisions.

**Why:** on 17 Oct I built the Sims pages into the app from my own reading of her decisions while the prototype was still being finished. The app version dropped facts (Origin, Played, Neighbourhood Stories), changed the Sims table style and simplified the tree. She asked "Why didn't you do that last time I thought that was what I asked you to do?"

**How to apply:** wait for the prototype to be final, port its code and CSS, then compare app and prototype side by side at 1280px before saying it's ready. Any difference must be one she asked for. Related: [[wait-before-next-item]]
