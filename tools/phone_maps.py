"""Phone-sized copies of the world maps, for every map picture on phones (round 5 review, 22 Nov 2026).

    python tools/phone_maps.py          make or refresh site/maps/<world>.phone.webp for every site/maps/<world>.jpg
    python tools/phone_maps.py --check  only say which copies are missing or older than their map (exit 1 if any)

On a phone (700px wide or less) js/app.js draws every map picture from this copy: the world banner, the neighbourhood cards
and the neighbourhood banners. Those zoom in at most 3x on a 390px screen (about 1170 CSS pixels of map), so 2400px still gives
two device pixels per CSS pixel, at about a third of the full map's download (Willow Creek: 831 KB to about 285 KB). Laptops and
tablets keep the full map. The build (tools/build.py) only points the page at a copy that exists and is newer than its map, so a
stale copy is never shown: run this after a map changes, then build.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE

WIDTH, QUALITY = 2400, 72
MAPS = os.path.join(SITE, 'maps')


def phone_path(ws, maps=MAPS):
    return os.path.join(maps, ws + '.phone.webp')


def is_fresh(ws, maps=MAPS):
    """True when the world's phone copy exists and is at least as new as its map."""
    src, dst = os.path.join(maps, ws + '.jpg'), phone_path(ws, maps)
    return os.path.exists(src) and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src)


def worlds(maps=MAPS):
    return sorted(f[:-4] for f in os.listdir(maps) if f.endswith('.jpg') and not f.endswith('.thumb.jpg'))


def make(ws, maps=MAPS):
    """Write the phone copy (never wider than the map itself). Returns its size in bytes."""
    from PIL import Image
    src, dst = os.path.join(maps, ws + '.jpg'), phone_path(ws, maps)
    with Image.open(src) as im:
        im = im.convert('RGB')
        if im.width > WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
        tmp = dst + '.tmp'
        im.save(tmp, 'WEBP', quality=QUALITY, method=6)
    os.replace(tmp, dst)   # never half a file
    return os.path.getsize(dst)


def main(argv):
    stale = [ws for ws in worlds() if not is_fresh(ws)]
    if '--check' in argv:
        for ws in stale: print(f"needs a phone copy: {ws}")
        if not stale: print("every map has a fresh phone copy")
        return 1 if stale else 0
    for ws in stale:
        n = make(ws)
        print(f"{ws}: {os.path.getsize(os.path.join(MAPS, ws + '.jpg')) // 1024} KB -> {n // 1024} KB")
    if not stale: print("every map already has a fresh phone copy")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
