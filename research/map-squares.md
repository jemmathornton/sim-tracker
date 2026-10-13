# Suggested map squares: why there aren’t any

Tried overnight on 13–14 October 2026. **Result: the game’s files can’t say where a neighbourhood is on the map pictures, so there are no suggestions.** Her rule stands: she names the squares.

## What was tried

1. **The game’s world map data.** Each world has a map record listing its lots with x/y/z positions. These turned out to be each lot’s position inside its own neighbourhood, not on the world map: in Willow Creek, lots of the same neighbourhood are spread right across the range and different neighbourhoods overlap. Fitting them to her six Willow Creek map spots was off by a third of the picture.
2. **The map record’s camera.** The record starts with what looks like a camera (position, direction, field of view). Projecting the lots through it put Sage Estates and Pendula View on the same spot, and Courtyard Lane on the wrong side. Still off by about a sixth of the picture on average, which is more than a grid square.
3. **The world files.** These also place lots only within their own neighbourhood.

The map pictures (from the 20th Century Plumbob mod) are angled views with no labels, so they can’t be read for names either.

## What’s still needed from her

Willow Creek is done. The other worlds still need a square for each neighbourhood, from the pictures in `for-jemma/map-grids/` or the clickable `tools/map-squares.html` (click the spot for each neighbourhood, then Copy answers). “Secret Lots” and “Special Lots” groups may not need a spot at all; her call.
