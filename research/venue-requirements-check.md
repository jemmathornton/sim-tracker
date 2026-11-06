# Venue lots against the game's required objects (6 Nov)

Every venue lot in "Building #2" (as saved 6 Nov, read from a copy) was checked against the objects its lot type requires. The lists are the game's own, the same ones Build mode shows under venue info (research/playtest-checklist.md). Objects were matched by the catalogue tags the game uses for those lists. Tool: tools/research/venue_check.py.

**Result: 110 of 111 venue lots have everything they need.**
- **The one gap:** the empty Park lot in Oasis Springs, which is Desert Bloom. You said it's waiting to be built.
- **Cleared lots** with nothing on them yet are left out.

**Not checkable this way:**
- **Restaurant dining spots:** the game counts a table with chairs as a pair, not as one object.
- **Pools:** a pool isn't an object.

Your restaurants and Palm Springs Public Pool work in game, so these are fine.

When the new save is set up, the same check can run on it: `python tools/research/venue_check.py "<save name>"`.
