"""The world maps (23 Nov 2026, filipesims' for 21 worlds, 20th Century Plumbob's for the rest): every map keeps the game's own
frame, so her neighbourhood boxes, banner zooms and nudges (all fractions of the map) still land in the right place.

If a map is ever swapped for a picture of another shape (her own in-game screenshots, say), this fails on purpose: her boxes
would then need checking or redrawing on the new picture before it goes in (her rule: never guess where a neighbourhood is).
"""
import os, unittest
from helpers import ROOT, WORLDS
import common, filipesims_maps

GAME_FRAME = 1537 / 1081   # the game's own map picture (UI.package), and every map replacement painted over it


def maps():
    """(world id, path) of every full map: owned worlds in site/maps, the others in not-shown-yet/maps."""
    out = []
    for folder in (os.path.join(common.SITE, 'maps'), os.path.join(ROOT, 'not-shown-yet', 'maps')):
        for f in sorted(os.listdir(folder)):
            if f.endswith('.jpg') and not f.endswith('.thumb.jpg'): out.append((f[:-4], os.path.join(folder, f)))
    return out


class Maps(unittest.TestCase):
    def test_every_map_keeps_the_games_frame(self):
        from PIL import Image
        for ws, p in maps():
            with Image.open(p) as im: w, h = im.size
            with self.subTest(world=ws, size=(w, h)):
                self.assertLess(abs(w / h / GAME_FRAME - 1), 0.01, f'{ws}: {w} x {h} is not the game map’s shape; check her neighbourhood boxes on it')

    def test_every_world_has_one_full_map(self):
        have = [ws for ws, p in maps()]
        self.assertEqual(sorted(have), sorted(set(have)))   # never in both site/maps and not-shown-yet
        self.assertEqual(sorted(have), sorted(ws for ws, W in WORLDS))

    def test_filipesims_worlds_are_real_worlds(self):
        names = {ws for ws, W in WORLDS}
        self.assertEqual(set(filipesims_maps.MAPS) - names, set())
        self.assertEqual(len(filipesims_maps.MAPS), 21)
        self.assertEqual(filipesims_maps.VARIANTS, {})   # no map Try switch left behind (its other versions lived in site/maps/try/)
        self.assertFalse(os.path.exists(os.path.join(common.SITE, 'maps', 'try')))


if __name__ == '__main__':
    unittest.main()
