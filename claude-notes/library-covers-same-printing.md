---
name: library-covers-same-printing
description: "Library covers - every book in a series from one printing, shown as a whole series row, and asked before each change"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 685a58b9-e30d-4ad0-8d37-bec5690d9700
  modified: 2026-10-31T23:18:18.616Z
---

In Jemma's home library (Documents\HomeLibrary), series covers must all come from the **same printing** (same publisher edition and year), matching the copies she owns. Never mix in another country's or publisher's printing (an Open Library picture for her Eagle Strike ISBN was a US Scholastic photo, and she was annoyed it was used). Pictures must be flat, uncropped scans.

She lives in the UK: lean to UK printings whenever unsure (31 Oct 2026, after Dengue Boy showed the US cover of her UK ISBN). Open Library pictures are often US editions, so check them.

**Why:** she wants consistency on the shelves, and judging covers one at a time out of context led to her rejecting good ones (30 Oct 2026).

**How to apply:**
- Show each series as one row in reading order (her copies plus the proposal) before asking; never put a cover on without asking, even when it's her own ISBN's picture.
- Libib ISBNs can be wrong (St Clare's), so when she describes her copy, believe her over the ISBN; offer her own photos as the sure fix.
- Good source for UK printings: Oxfam's online shop API, `https://onlineshop.oxfam.org.uk/ccstore/v1/products/HD_<n>` (fields ox_isbn13, ox_year, primaryFullImageURL; add `&height=940` to the image URL). Listings from one shop sit on neighbouring HD numbers, so scanning around one finds the rest of a set.
- World of Books has flat UK scans by ISBN: `https://image-server.worldofbooks.com/images/<isbn13>.jpg` (try it first for her own ISBNs).
- The site shows every cover whole at its own shape (30 Oct); a picture that is cropped or squashed shows as an odd shape, so swap in a full scan of the same cover.
- See [[no-generated-text]] for blurbs.
