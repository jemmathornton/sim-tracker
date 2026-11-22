---
name: app-shows-main-checkout
description: "Jemma's app shortcut opens the main checkout, so worktree-branch work is invisible to her until merged into main (merging needs her OK)"
metadata:
  node_type: memory
  type: project
  originSessionId: 6f7f90d3-995c-4fa8-8100-9f72f239c318
  modified: 2026-10-13T18:10:18.646Z
---

The "Jemma's Sim World" shortcut opens the main checkout's site in its own Chrome window: since 22 Nov 2026 through the family server, http://localhost:8050/sim-world/ (Jemma's Journals' tools/open_site.pyw sim-world), which serves `C:\Users\Jemma\Documents\JemmasJournals\sim-world\site` (before the move: `Documents\SimTracker\site\index.html` via file://). Work done on a worktree branch doesn't show in her app until it's merged into main.

**Why:** On 13 Oct 2026 two sessions ran in parallel (one on main, one in a worktree) and both made gridded maps and edited TODO.md. Merging the worktree into main was blocked by auto mode until she said "ok merge now".

**How to apply:** Ask before merging into main. If another session may be active, check main's `git status` and log first. Suggested to her: one session at a time, working on main. She hasn't confirmed this as a rule yet. Related: [[jemma-reviews-by-looking]]
