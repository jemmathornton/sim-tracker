"""World map from the 20th Century Plumbob map replacement mod.

    python tools/extract_map.py "<...\\Mods\\20thCenturyPlumbob Maps\\20thCPlumbob-MapReplacement-<World>.package>" <world-id>

Writes site/maps/<world-id>.jpg (full size, up to 4096px; 1800px before 16 Oct) and .thumb.jpg (640px). Her Mods folder is only read.
The textures are ATI2/BC5 pairs, luma + chroma (YCoCg), matched by instance. Needs numpy (pip install numpy),
(installed 16 Oct with her OK).
"""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE
from dbpf import entries

FULL = 4096   # the mod's own size, so neighbourhood banners can zoom in and stay sharp (16 Oct, her OK; was 1800)


def extract(pkg, world_id):
    import numpy as np
    from PIL import Image
    ims = []
    for e in entries(pkg):
        if e['type'] == 0xb2d882:
            im = Image.open(io.BytesIO(e['data'])); im.load(); ims.append(im)
    ims.sort(key=lambda i: -i.size[0])
    big, small = ims[0], ims[1]
    a = np.asarray(big).astype(float); c = np.asarray(small.resize(big.size, Image.BILINEAR)).astype(float)
    Y = a[..., 1]; A = a[..., 0]; co = c[..., 0] - 128; cg = c[..., 1] - 128
    t = Y - cg; rgb = np.clip(np.stack([t + co, Y + cg, t - co], -1), 0, 255).astype(np.uint8)
    ys, xs = np.where(A > 128); box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    img = Image.fromarray(rgb).crop(box)
    full = img.copy(); full.thumbnail((FULL, FULL), Image.LANCZOS)
    full.save(os.path.join(SITE, 'maps', world_id + '.jpg'), quality=82, optimize=True, progressive=True)
    thumb = img.copy(); thumb.thumbnail((640, 640), Image.LANCZOS)
    thumb.save(os.path.join(SITE, 'maps', world_id + '.thumb.jpg'), quality=80, optimize=True)
    print(box, full.size)


if __name__ == '__main__':
    extract(sys.argv[1], sys.argv[2])
