"""Pictures from her Library (the game's Tray folder): household pictures (.hhi) and Sim pictures (.sgi).

The game stores them as a JPEG with every byte XOR'd against an 8-byte key (the key is found from the JPEG's fixed opening bytes)
after a 24-byte header, and a see-through mask as a PNG inside the JPEG's "ALFA" segment. Files are read from temporary copies.

    import tray_pictures as tp; tp.read(path) -> PIL image (RGBA)
"""
import io, os, shutil, tempfile
from PIL import Image

JPEG_START = bytes.fromhex('ffd8ffe000104a46')   # SOI, APP0, length 16, "JF"


def decode(raw):
    p = raw[24:]
    key = bytes(a ^ b for a, b in zip(p[:8], JPEG_START))
    d = bytes(c ^ key[i % 8] for i, c in enumerate(p))
    im = Image.open(io.BytesIO(d)).convert('RGB')
    a = d.find(b'ALFA')
    if a > 0:
        n = int.from_bytes(d[a + 4:a + 8], 'big')
        mask = Image.open(io.BytesIO(d[a + 8:a + 8 + n])).convert('L')
        if mask.size == im.size: im.putalpha(mask)
    return im.convert('RGBA')


def read(path):
    """Decode a Library picture from a temporary copy (never opened in place)."""
    tmp = tempfile.mkdtemp()
    try:
        c = os.path.join(tmp, 'pic'); shutil.copy(path, c)
        return decode(open(c, 'rb').read())
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
