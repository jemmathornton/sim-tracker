"""The app icon: Lucide's "home" icon (ISC licence) in brass on the sidebar's deep purple.

    python tools/make_icons.py

Writes site/icon.svg (browser tab), site/icon.png (app window) and site/icon.ico (Windows shortcut).
"""
import math, os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE

NAV, BRASS = "#2A1D40", "#C9A04A"   # --nav and --brass in site.css
SVG = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="{NAV}"/><g transform="translate(4 4)" fill="none" stroke="{BRASS}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></g></svg>
"""


def draw(px):
    """The same drawing as the SVG, at px square (drawn 4x larger, then scaled down for smooth edges)."""
    S = px * 4; u = S / 32                     # one SVG unit
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, S - 1, S - 1), radius=7 * u, fill=NAV)
    P = lambda x, y: ((x + 4) * u, (y + 4) * u)
    w = round(2 * u)
    # house outline: m3 9 9-7 9 7 v11 (rounded corner) H5 (rounded corner) z
    arc = lambda cx, cy, a0, a1: [P(cx + 2 * math.cos(math.radians(a)), cy + 2 * math.sin(math.radians(a))) for a in range(a0, a1 + 1, 10)]
    outline = [P(3, 9), P(12, 2), P(21, 9)] + arc(19, 20, 0, 90) + arc(5, 20, 90, 180) + [P(3, 9)]
    d.line(outline, fill=BRASS, width=w, joint="curve")
    d.line([P(9, 22), P(9, 12), P(15, 12), P(15, 22)], fill=BRASS, width=w, joint="curve")
    for x, y in outline + [P(9, 22), P(15, 22)]:   # round line ends and corners
        d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=BRASS)
    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    with open(os.path.join(SITE, "icon.svg"), "w", encoding="utf-8", newline="\n") as f: f.write(SVG)
    draw(512).save(os.path.join(SITE, "icon.png"))
    draw(256).save(os.path.join(SITE, "icon.ico"), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("wrote site/icon.svg, icon.png, icon.ico")
