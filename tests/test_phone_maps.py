"""tools/phone_maps.py: phone-sized map copies (round 5); the build only uses a copy newer than its map, and every owned map has one."""
import os, time, unittest
from helpers import temp_dir
import common, phone_maps


class PhoneMaps(unittest.TestCase):
    def test_copy_is_smaller_and_fresh(self):
        from PIL import Image
        with temp_dir() as d:
            Image.new('RGB', (3000, 2100), (90, 140, 120)).save(os.path.join(d, 'w.jpg'), quality=95)
            self.assertFalse(phone_maps.is_fresh('w', d))
            phone_maps.make('w', d)
            with Image.open(phone_maps.phone_path('w', d)) as im:
                self.assertEqual(im.size, (phone_maps.WIDTH, round(2100 * phone_maps.WIDTH / 3000)))
            self.assertTrue(phone_maps.is_fresh('w', d))

    def test_stale_copy_is_not_fresh(self):
        from PIL import Image
        with temp_dir() as d:
            Image.new('RGB', (800, 560)).save(os.path.join(d, 'w.jpg'))
            phone_maps.make('w', d)
            with Image.open(phone_maps.phone_path('w', d)) as im: self.assertEqual(im.width, 800)   # never wider than the map
            later = time.time() + 60
            os.utime(os.path.join(d, 'w.jpg'), (later, later))   # the map changed after the copy was made
            self.assertFalse(phone_maps.is_fresh('w', d))

    def test_every_site_map_has_a_fresh_copy(self):
        stale = [ws for ws in phone_maps.worlds() if not phone_maps.is_fresh(ws)]
        self.assertEqual(stale, [], "run tools/phone_maps.py, then tools/build.py")


if __name__ == '__main__':
    unittest.main()
