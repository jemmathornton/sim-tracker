"""The app icon: a plumbob outline (its corners written out as coordinates below and joined with lines; no clip art or AI) in the app's yellow on purple.
Chosen 16 Oct: the old icon (Lucide's house on the sidebar's deep purple) looked near black and blurry at the corners.

    python tools/make_icons.py

Writes site/icon.svg, site/icon.png and icon-<size>.png (browser tab and the app window's taskbar icon) and site/icon.ico (Windows shortcut).
Every size is drawn on its own (at 4x, then scaled down), so the small ones stay crisp.
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE

PURPLE, PURPLE_TOP, YELLOW = "#4A2E78", "#5C3A90", "#E6BE55"   # a brighter take on --nav; --brass, lifted
# the plumbob in a 32-unit square. Since The Sims 2 it's a hexagonal bipyramid (Sims Wiki, "Plumbob"): two equal six-sided
# pyramids base to base, 12 matching triangles. Seen side-on, three of each pyramid's six sides face us; the middle one,
# straight on, is twice as wide as the two at its sides. Seen a touch from above, so the front corners sit slightly lower.
TOP, BOT, MID, R, DIP = (16, 2.5), (16, 29.5), 16, 7, 1.2
GL, GFL, GFR, GR = (16 - R, MID), (16 - R / 2, MID + DIP), (16 + R / 2, MID + DIP), (16 + R, MID)
OUTLINE = [TOP, GR, BOT, GL]
FACETS = [[GL, GFL, GFR, GR], [TOP, GFL, BOT], [TOP, GFR, BOT]]

PAGE_SIZES = (16, 24, 30, 32, 36, 40, 48, 64, 96, 192)
pts = lambda ps: " ".join(f"{x},{y}" for x, y in ps)
SVG = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
       f'<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{PURPLE_TOP}"/><stop offset="1" stop-color="{PURPLE}"/></linearGradient></defs>'
       f'<rect width="32" height="32" rx="7" fill="url(#g)"/>'
       f'<g fill="none" stroke="{YELLOW}" stroke-linejoin="round" stroke-linecap="round">'
       f'<polygon points="{pts(OUTLINE)}" stroke-width="1.45"/>'
       + "".join(f'<polyline points="{pts(f)}" stroke-width=".85"/>' for f in FACETS) +
       '</g></svg>\n')


def draw(px):
    """The same drawing as the SVG at px square: drawn 4x larger, then scaled down for smooth, sharp edges."""
    S = px * 4; u = S / 32
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    grad = Image.linear_gradient("L").resize((S, S))   # lighter purple at the top
    bg = Image.composite(Image.new("RGBA", (S, S), PURPLE), Image.new("RGBA", (S, S), PURPLE_TOP), grad)
    mask = Image.new("L", (S, S), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=7 * u, fill=255)
    im.paste(bg, (0, 0), mask)
    d = ImageDraw.Draw(im)
    P = lambda p: (p[0] * u, p[1] * u)
    def line(ps, width, closed=False):
        ps = [P(p) for p in ps] + ([P(ps[0])] if closed else [])
        w = max(1, round(width * u)); d.line(ps, fill=YELLOW, width=w, joint="curve")
        for x, y in ps: d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=YELLOW)
    for f in FACETS: line(f, .85 if px >= 32 else 1.2)
    line(OUTLINE, 1.45 if px >= 32 else 1.9, closed=True)
    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    with open(os.path.join(SITE, "icon.svg"), "w", encoding="utf-8", newline="\n") as f: f.write(SVG)
    draw(512).save(os.path.join(SITE, "icon.png"))
    # Chrome's app window takes its taskbar icon from the page's icons: give it each size drawn properly, so it never
    # has to stretch a small one (that's what made the taskbar icon blurry, 16 Oct)
    for s in PAGE_SIZES: draw(s).save(os.path.join(SITE, f"icon-{s}.png"))
    sizes = [16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256]   # incl. the in-between sizes Windows uses when scaled to 125% or 150%
    big = draw(256); big.save(os.path.join(SITE, "icon.ico"), sizes=[(s, s) for s in sizes], append_images=[draw(s) for s in sizes[:-1]])
    print("wrote site/icon.svg, icon.png, icon.ico")
