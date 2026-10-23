# Screenshot matches by picture (22–23 Oct, overnight)

Follow-up to `screenshot-coverage.md` §3: her Screenshots folder compared picture by picture with her Gallery pictures, to find sets that can’t be tied to a lot by date. Report only. Her Screenshots and Builds folders were only read; nothing in `data/`, `site/` or `tools/` was changed. Review page: `for-jemma/screenshot-matches.html` (thumbnails in `for-jemma/screenshot-matches/1/`).

## Result

- **272 sets searched** (2,628 pictures). The folder makes 300 sets of pictures taken within 20 minutes of each other. Left out: 26 sets already used by Builds folders (all 8 from 22 Oct included) and the two 23 Apr 2021 sets she has already said are Cottage Am See.
- **No new lot matched.** None of the 148 shared lots without pictures matched any set clearly enough to propose.
- **One confident extra set:** set from `05-22-21_6-02-28 PM` to `05-22-21_6-22-11 PM` (29 pictures) is **Olde Platz Inn** (Windenburg, Waterlock Redoubt), which already has pictures. Two pictures match its Gallery cover closely (46 and 28 matching points; wrong lots never got past 15), and every picture in the set is the inn when you look at them. Her Builds folder “Olde Platz Inn” isn’t in the Screenshots folder, so this is probably the original shoot. Her call whether it adds anything.
- **Confirmed by picture:** the 23 Apr 2021 “Stonestreet” sets are Cottage Am See (111 and 19 points), as she said on 22 Oct.

## Method

1. Gallery pictures: the 4 pictures of each of the 189 uploads on her 170 shared lots (720, downloaded from her public Gallery), plus the cover and Community Space pictures in `site/gallery/`. They are the game’s own automatic views (from above, walls cut away), not her screenshots, so nothing matches pixel for pixel.
2. Every screenshot shrunk to 640 px wide. Small details (corners) found at four sizes in both pictures, each described by its edge directions.
3. Each detail looked up among all Gallery pictures; kept only if its closest look-alike in one lot is clearly closer than the best look-alike in any other lot. Then a geometry check: the kept details must line up in the same layout (one stretch/shift for the whole picture). The number that line up is the score.
4. A set’s score for a lot is its best picture, plus half the second and a quarter of the third.

**Tested on the 26 Builds sets (true answer known):** where the score reached 17 or more, the right lot came top every time (The Narwhal Arms, Forest Hideaway/Riverside Retreat, Finchwick Village Hall, Bailey-Moon Manor, Izakaya Hanamigawa Koen, Valley Views, Newcrest Wedding Hall, Rio Verde, Coorinberg Cottage, Bargain Bend). Wrong lots never scored above 15. Rule used: a lot’s best picture scores 20 or more, at least two pictures agree, and the lot leads the next by at least twice.

**Its limit:** it only works when one of her screenshots shows the build from much the same side as a Gallery picture. It found nothing for 122 Hakim House, Raffia Quinta, Midtown Meadows, 3 Olde Mill Lane, Town Square Stores (one weak picture) or Robert Piggott School, even though those sets are right; a closer one-to-one check on four of them didn’t help either. Midtown Meadows and Raffia Quinta lead with newer uploads than the photos, which also hurts. So about half of the true sets get missed: “no match” doesn’t mean the set isn’t one of her shared lots.

## What couldn’t be matched

- **261 of the 272 sets matched no lot at all**, and the other 10 only at noise level (best picture 5 or under, e.g. Potters Splay for a 23 Jun 2025 set, Comfortably Canalside for 9 Apr 2023; The Shrieking Llama scored 7 inside the Olde Platz Inn set). That covers the big undated sets (Mar–Jul 2023, Jan 2024, Jun and Sep 2025). They may be gameplay, unshared builds, or shared lots photographed from other angles; only she can tell by looking.
- Selfies and gameplay weren’t filtered separately: they matched nothing, so it made no difference.
- The 22 Oct rejected time guesses (Oak Alcove, Sultry Springside, Granada Place, Hindquarter Hideaway, Twin Oracle Point, Newcrest Community Space) were searched again against every lot: none matched anything.

Scripts and saved results (not needed again): scratchpad `shotmatch/` folder from this session.
