"""World map from a map replacement mod's .package (filipesims since 23 Nov 2026; 20th Century Plumbob before, and still
for the worlds filipesims hasn't made: see tools/filipesims_maps.py).

    python tools/extract_map.py "<...\\filipesims_<World>_MAP.package>" <world-id>

Writes site/maps/<world-id>.jpg (full size, up to 4096px; 1800px before 16 Oct) and .thumb.jpg (640px). The package is only read.
The textures are ATI2/BC5 pairs, luma + chroma (YCoCg), matched by instance (23 Nov: paired by instance, biggest pair wins, so
packages that also hold a world icon, like filipesims' Evergreen Harbor, still give the map). Needs numpy (installed 16 Oct with her OK).
San Myshuno's 20th Century Plumbob night map came out with scrambled colours with the old size-only pairing; the site kept its
older 1800px copy. Check every map by eye after re-extracting.
"""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE
from dbpf import entries

FULL = 4096   # the mod's own size, so neighbourhood banners can zoom in and stay sharp (16 Oct, her OK; was 1800)


def decode(pkg):
    """The map picture in a package, cropped to the map itself (PIL image)."""
    import numpy as np
    from PIL import Image
    pairs = {}
    for e in entries(pkg):
        if e['type'] == 0xb2d882:
            im = Image.open(io.BytesIO(e['data'])); im.load()
            pairs.setdefault(e['insthi'] << 32 | e['instlo'], []).append(im)
    best = None
    for ims in pairs.values():
        if len(ims) != 2: continue
        ims.sort(key=lambda i: -i.size[0])
        if best is None or ims[0].size[0] > best[0].size[0]: best = ims
    if best is None: raise ValueError(f'no map texture pair in {pkg}')
    big, small = best
    a = np.asarray(big).astype(float); c = np.asarray(small.resize(big.size, Image.BILINEAR)).astype(float)
    Y = a[..., 1]; A = a[..., 0]; co = c[..., 0] - 128; cg = c[..., 1] - 128
    t = Y - cg; rgb = np.clip(np.stack([t + co, Y + cg, t - co], -1), 0, 255).astype(np.uint8)
    ys, xs = np.where(A > 128); box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    return Image.fromarray(rgb).crop(box)


def save(img, full_path=None, thumb_path=None):
    """Write the full map (at most FULL px) and/or its 640px thumbnail."""
    from PIL import Image
    if full_path:
        full = img.copy(); full.thumbnail((FULL, FULL), Image.LANCZOS)
        full.save(full_path, quality=82, optimize=True, progressive=True)
    if thumb_path:
        thumb = img.copy(); thumb.thumbnail((640, 640), Image.LANCZOS)
        thumb.save(thumb_path, quality=80, optimize=True)


def extract(pkg, world_id):
    img = decode(pkg)
    save(img, os.path.join(SITE, 'maps', world_id + '.jpg'), os.path.join(SITE, 'maps', world_id + '.thumb.jpg'))
    print(world_id, img.size)


if __name__ == '__main__':
    extract(sys.argv[1], sys.argv[2])
