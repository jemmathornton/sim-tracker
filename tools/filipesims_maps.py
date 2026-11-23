"""filipesims' world maps on Sim World (her pick, 23 Nov 2026): 21 worlds; 20th Century Plumbob's stay for the other 9
(Granite Falls, Forgotten Hollow, Selvadorada, StrangerVille, Glimmerbrook, Moonwood Mill, Ravenwood, Gibbi Point, Ondarion).

    python -X utf8 tools/filipesims_maps.py ["<folder with filipesims_*.package>"]          default: her Downloads
    python -X utf8 tools/filipesims_maps.py --try ["<folder>"]                              also the Try switch versions

The packages are filipesims' own (from their Patreon, downloaded by her on 23 Nov) and are only read; the pictures are kept in
git like the rest of the site (her call, 23 Nov: “I want it all uploaded”). After running this: tools/phone_maps.py, then build.
Owned worlds get site/maps/<world>.jpg and .thumb.jpg; worlds she doesn't own get the thumbnail in site/maps and the full map
in not-shown-yet/maps (as before). The “LEGACY” packages hold the same pictures for older game versions, so they aren't used.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE
import extract_map

ROOT = os.path.dirname(SITE)
DOWNLOADS = os.path.join(os.path.expanduser('~'), 'Downloads')

# world id -> the package (filipesims_<stem>.package) Sim World shows
MAPS = {
    'brindleton-bay': 'BrindletonBay_MAP', 'britechester': 'Britechester_MAP', 'chestnut-ridge': 'ChestnutRidge_MAP',
    'ciudad-enamorada': 'CiudadEnamorada_MAP', 'copperdale': 'Copperdale_MAP', 'del-sol-valley': 'DelSolValley_HD_MAP',
    'evergreen-harbor': 'EvergreenHarbor_NAP_HD_MAP', 'henford-on-bagley': 'HenfordOnBagley_MAP', 'innisgreen': 'Innisgreen_MAP',
    'magnolia-promenade': 'MagnoliaPromenade_MAP', 'mt-komorebi': 'MtKomorebi_MAP', 'newcrest': 'Newcrest_MAP',
    'nordhaven': 'Nordhaven_MAP', 'oasis-springs': 'OasisSprings_MAP', 'san-myshuno': 'SanMyshunoMidnight_MAP',
    'san-sequoia': 'SanSequoia_MAP', 'sulani': 'Sulani_HD_MAP', 'tartosa': 'Tartosa_MAP', 'tomarang': 'Tomarang_MAP',
    'willow-creek': 'WillowCreek_MAP', 'windenburg': 'Windenburg_MAP',
}

# Worlds filipesims made in more than one version, for a Try switch while she picks (the first is the one in MAPS; the others
# go to site/maps/try/<world>--<key>.jpg with --try). Her picks, 23 Nov: the first version everywhere (Willow Creek, Oasis
# Springs and Newcrest full, not lite; San Sequoia grey bridge; Tartosa day), except Evergreen Harbor: NAP
# (three apartment blocks by the harbour), and San Myshuno: Midnight (her pick, 23 Nov, from the colours page; its tall buildings are
# separate pictures the game draws on top, so every San Myshuno map has gaps there, which she's happy to live with). Switch removed;
# add entries here again to offer a new choice.
VARIANTS = {}


def owned(ws):
    with open(os.path.join(ROOT, 'data', 'worlds', ws + '.json'), encoding='utf-8') as f:
        return json.load(f)['owned']


def package(folder, stem):
    p = os.path.join(folder, f'filipesims_{stem}.package')
    if not os.path.exists(p): raise SystemExit(f'Missing: {p}')
    return p


def main(folder=DOWNLOADS, tries=False):
    maps = os.path.join(SITE, 'maps')
    for ws, stem in MAPS.items():
        img = extract_map.decode(package(folder, stem))
        full = os.path.join(maps if owned(ws) else os.path.join(ROOT, 'not-shown-yet', 'maps'), ws + '.jpg')
        extract_map.save(img, full, os.path.join(maps, ws + '.thumb.jpg'))
        print(f'{ws}: {stem} {img.size[0]} x {img.size[1]}' + ('' if owned(ws) else ' (not owned: full map in not-shown-yet)'))
    if tries:
        os.makedirs(os.path.join(maps, 'try'), exist_ok=True)
        for ws, versions in VARIANTS.items():
            for key, stem in versions[1:]:
                img = extract_map.decode(package(folder, stem))
                base = os.path.join(maps, 'try', f'{ws}--{key}')
                extract_map.save(img, base + '.jpg' if owned(ws) else None, base + '.thumb.jpg')
                print(f'try {ws} {key}: {stem}')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--try']
    main(args[0] if args else DOWNLOADS, '--try' in sys.argv)
