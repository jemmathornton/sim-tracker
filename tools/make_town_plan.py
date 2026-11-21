"""Draw the town-plan line pictures for the site's look (her pick 21 Nov 2026, "S1f-a, town plan").

Plain line drawings, no art: streets, plots split along them, a few house footprints and one crescent, in the
site's purple ink at low strength. Written to site/townplan/ (light and dark versions; site.css picks one):

  town.svg / town-dark.svg       the home and plain page banners (fading in from the right)
  town-light.svg                 the faint plan over the map banners (white lines, the same in both modes)
  side.svg / side-dark.svg       the sidebar's faint repeating plan

Same drawing every run (fixed seeds). The layout came from the mock-up's generator
(JemmasJournals research/app-styles/simworld/gen.js, townplan()). Run: python -X utf8 tools/make_town_plan.py
"""
import math, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "site", "townplan")


def n(x):
    """One decimal, as the mock-up wrote them."""
    return f"{x:.1f}"


def townplan(col, W, H, seed, xs, ys, street=20, crescent=None):
    s = seed

    def rnd():
        nonlocal s
        s = (s * 16807) % 2147483647
        return s / 2147483647

    sw = street
    out = [f"<svg xmlns='http://www.w3.org/2000/svg' width='{W}' height='{H}' viewBox='0 0 {W} {H}'>"
           f"<g fill='none' stroke='{col}' stroke-width='1'>"]
    for y in ys:   # street edges
        out.append(f"<path d='M0,{y}H{W}M0,{y + sw}H{W}'/>")
    for x in xs:
        out.append(f"<path d='M{x},0V{H}M{x + sw},0V{H}'/>")
    bx, by = [-sw, *xs, W], [-sw, *ys, H]
    for i in range(len(bx) - 1):
        for j in range(len(by) - 1):
            x0, x1, y0, y1 = bx[i] + sw + 6, bx[i + 1] - 6, by[j] + sw + 6, by[j + 1] - 6
            if x1 - x0 < 60 or y1 - y0 < 50:
                continue
            mid = (y0 + y1) / 2
            for ya, yb, front in ((y0, mid, "top"), (mid, y1, "bottom")):
                x = x0
                while x < x1 - 30:   # plots along the street, a house footprint on about half of them
                    w = min(x1 - x, 34 + int(rnd() * 40))
                    out.append(f"<rect x='{n(x)}' y='{n(ya)}' width='{n(w)}' height='{n(yb - ya)}'/>")
                    if rnd() < .55:
                        hw, hh = w * (.45 + rnd() * .2), (yb - ya) * (.35 + rnd() * .15)
                        hx = x + (w - hw) / 2
                        hy = ya + 7 if front == "top" else yb - 7 - hh
                        out.append(f"<rect x='{n(hx)}' y='{n(hy)}' width='{n(hw)}' height='{n(hh)}' fill='{col}' fill-opacity='.35'/>")
                    x += w
    if crescent:
        cx, cy, r = crescent
        out.append(f"<circle cx='{cx}' cy='{cy}' r='{r}'/><circle cx='{cx}' cy='{cy}' r='{r - sw}'/>")
        for a in range(0, 360, 30):
            t = a * math.pi / 180
            out.append(f"<path d='M{n(cx + math.cos(t) * r)},{n(cy + math.sin(t) * r)}L{n(cx + math.cos(t) * (r + 46))},{n(cy + math.sin(t) * (r + 46))}'/>")
    out.append("</g></svg>")
    return "".join(out) + "\n"


BANNER = dict(W=1600, H=820, seed=7, xs=[150, 420, 700, 980, 1260], ys=[110, 330, 560], street=18, crescent=(1130, 720, 80))
OVER_MAP = dict(W=1400, H=700, seed=11, xs=[260, 600, 940, 1250], ys=[150, 420], street=24)
SIDE = dict(W=280, H=420, seed=3, xs=[140], ys=[130, 300], street=14)
FILES = {
    "town.svg": ("rgba(61,42,92,.26)", BANNER),          # purple ink on the pale lilac banner
    "town-dark.svg": ("rgba(201,186,234,.16)", BANNER),  # pale lilac lines on the dark banner
    "town-light.svg": ("rgba(255,255,255,.30)", OVER_MAP),
    "side.svg": ("rgba(61,42,92,.07)", SIDE),
    "side-dark.svg": ("rgba(214,203,240,.05)", SIDE),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (col, kw) in FILES.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(townplan(col, **kw))
        print("wrote site/townplan/" + name)


if __name__ == "__main__":
    main()
