"""Gridded world maps for Jemma to place the neighbourhoods (8 columns A–H × 6 rows 1–6).

    python tools/map_grids.py

Writes for-jemma/map-grids/<nn>-<world>.jpg for every owned world whose neighbourhoods have no map spot yet.
She names a square per neighbourhood (e.g. "Bridgeview C4"); the square's centre goes into that neighbourhood's
"mapSpot" in data/worlds/<world>.json as fractions of the map: column A–H -> (i + 0.5) / 8, row 1–6 -> (j + 0.5) / 6.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SITE, slug, load, world_files

COLS, ROWS = "ABCDEFGH", 6
FONT = lambda size, bold=False: ImageFont.truetype(os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'segoeuib.ttf' if bold else 'segoeui.ttf'), size)


def grid(world, n, out_dir):
    ws = slug(world['name'])
    im = Image.open(os.path.join(SITE, 'maps', ws + '.jpg')).convert('RGB')
    W, H = im.size; cw, ch = W / len(COLS), H / ROWS
    over = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(over)
    for i in range(1, len(COLS)): d.line([(i * cw, 0), (i * cw, H)], fill=(255, 255, 255, 200), width=3)
    for j in range(1, ROWS): d.line([(0, j * ch), (W, j * ch)], fill=(255, 255, 255, 200), width=3)
    f = FONT(int(ch * .16), True)
    for i, c in enumerate(COLS):
        for j in range(ROWS):
            label = f"{c}{j + 1}"; x, y = i * cw + 10, j * ch + 8
            box = d.textbbox((x, y), label, font=f)
            d.rounded_rectangle((box[0] - 6, box[1] - 4, box[2] + 6, box[3] + 4), radius=8, fill=(0, 0, 0, 150))
            d.text((x, y), label, font=f, fill=(255, 255, 255, 255))
    im = Image.alpha_composite(im.convert('RGBA'), over).convert('RGB')
    # strip underneath: which neighbourhoods to place
    hoods = [h['name'] for h in world['neighbourhoods']]
    fs = FONT(34); fb = FONT(40, True)
    lines = [f"{world['name']}: which square is each neighbourhood in?", ", ".join(hoods)]
    strip = Image.new('RGB', (W, 150), (42, 29, 64)); ds = ImageDraw.Draw(strip)
    ds.text((24, 20), lines[0], font=fb, fill=(241, 244, 247)); ds.text((24, 82), lines[1], font=fs, fill=(201, 160, 74))
    page = Image.new('RGB', (W, H + 150)); page.paste(im, (0, 0)); page.paste(strip, (0, H))
    page.save(os.path.join(out_dir, f"{n:02d}-{ws}.jpg"), quality=85)


if __name__ == '__main__':
    out_dir = os.path.join(ROOT, 'for-jemma', 'map-grids'); os.makedirs(out_dir, exist_ok=True)
    k = 0
    for wf in world_files():
        W = load(wf)
        if not W['owned'] or any(h.get('mapSpot') for h in W['neighbourhoods']): continue
        k += 1; grid(W, k, out_dir)
    print(f"{k} gridded maps in for-jemma/map-grids")
