"""The app icon: a plumbob outline (its corners written out as coordinates below and joined with lines; no clip art or AI) in the app's yellow on purple.
Chosen 16 Oct: the old icon (Lucide's house on the sidebar's deep purple) looked near black and blurry at the corners.

    python tools/make_icons.py

Writes site/icon.svg (browser tab), site/icon.png (app window) and site/icon.ico (Windows shortcut).
Every size is drawn on its own (at 4x, then scaled down), so the small ones stay crisp.
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE

PURPLE, PURPLE_TOP, YELLOW = "#4A2E78", "#5C3A90", "#E6BE55"   # a brighter take on --nav; --brass, lifted
# the plumbob in a 32-unit square: a six-sided double pyramid, worked out rather than guessed. Its six middle corners sit
# on a circle, turned TURN degrees and seen a little from above (TILT), so the sides facing us show different widths
import math
TURN, R, CX, GY, TILT = 22, 7, 16, 14.8, 1.6
TOP, BOT = (CX, 2.5), (CX, 29.5)
ring = [(CX + R * math.cos(math.radians(TURN + 60 * k)), GY + TILT * math.sin(math.radians(TURN + 60 * k))) for k in range(6)]
front = [p for k, p in enumerate(ring) if math.sin(math.radians(TURN + 60 * k)) > 0]           # corners on our side
GR, GL = max(ring), min(ring)                                                                  # the outline's widest points
OUTLINE = [TOP, GR, BOT, GL]
girdle = sorted({GL, *front, GR}, key=lambda p: p[0])
FACETS = [girdle] + [[TOP, p, BOT] for p in front if p not in (GL, GR)]

pts = lambda ps: " ".join(f"{x},{y}" for x, y in ps)
SVG = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
       f'<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{PURPLE_TOP}"/><stop offset="1" stop-color="{PURPLE}"/></linearGradient></defs>'
       f'<rect width="32" height="32" rx="7" fill="url(#g)"/>'
       f'<g fill="none" stroke="{YELLOW}" stroke-linejoin="round" stroke-linecap="round">'
       f'<polygon points="{pts(OUTLINE)}" stroke-width="2"/>'
       + "".join(f'<polyline points="{pts(f)}" stroke-width="1.1"/>' for f in FACETS) +
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
    for f in FACETS: line(f, 1.2 if px >= 32 else 1.5)
    line(OUTLINE, 2 if px >= 32 else 2.4, closed=True)
    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    with open(os.path.join(SITE, "icon.svg"), "w", encoding="utf-8", newline="\n") as f: f.write(SVG)
    draw(512).save(os.path.join(SITE, "icon.png"))
    sizes = [16, 24, 32, 48, 64, 128, 256]
    big = draw(256); big.save(os.path.join(SITE, "icon.ico"), sizes=[(s, s) for s in sizes], append_images=[draw(s) for s in sizes[:-1]])
    print("wrote site/icon.svg, icon.png, icon.ico")
