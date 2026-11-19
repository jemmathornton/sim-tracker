"""Add Jemma's build screenshots to the site.

    python tools/screenshots.py

Reads her Documents\\Builds folders (never changes them) and writes site/shots/<world>/<lot>/<name>.jpg
(full size up to 2000px) and <name>.thumb.jpg (720px). Pictures already done are skipped. File names become
captions (exterior shots first, floor plans last). Then rebuilds the site.

A new Builds folder needs a line in FOLDERS saying which lot it belongs to.
"""
import os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SITE, run_output

BUILDS = os.path.join(os.path.expanduser('~'), 'Documents', 'Builds')
FOLDERS = {  # Builds folder -> (world, lot) as used in page links
    "3 Olde Mill Lane": ("henford-on-bagley", "3-olde-mill-lane"), "Comfy Cubby": ("newcrest", "comfy-cubby"),
    "Coorinberg Cottage": ("windenburg", "coorinberg-cottage"), "Cottage Am See": ("windenburg", "cottage-am-see"),
    "Finchwick Village Hall": ("henford-on-bagley", "5-cobblebottom-street"), "Lakeside Retreat": ("granite-falls", "lakeside-retreat"),
    "Medina Studios 920": ("san-myshuno", "920-medina-studios"), "Midtown Meadows": ("newcrest", "midtown-meadows"),
    "Newcrest Wedding Hall": ("newcrest", "cookout-lookout"), "Olde Platz Inn": ("windenburg", "waterlock-redoubt"),
    "Raffia Quinta": ("oasis-springs", "raffia-quinta"), "Rio Verde Retirement Villa": ("oasis-springs", "rio-verde"),
    "Willow's": ("willow-creek", "bargain-bend"),
    "Von-Windenburg Castle": ("windenburg", "von-windenburg-estate"),   # her castle build is the Estate lot (15 Oct)
    # 22 Oct: sets found in her Sims 4 Screenshots folder by time, checked, pruned and named by her
    "Bailey-Moon Manor": ("del-sol-valley", "bailey-moon-manor"), "Izakaya Hanamigawa Koen": ("mt-komorebi", "hanamigawa-koen"),
    "122 Hakim House": ("san-myshuno", "122-hakim-house"), "Valley Views": ("del-sol-valley", "pectoral-fitness"),
    "Town Square Stores": ("copperdale", "town-square-terrace"), "The Narwhal Arms": ("windenburg", "the-narwhal-arms"),
    "The Forest Tavern": ("granite-falls", "forest-hideaway"), "Granite Falls Spa": ("granite-falls", "riverside-retreat"),
}
NOT_LOTS = {"Bubble World", "Robert Piggott School", "New folder"}   # bonus builds (TODO §5) and an empty folder
SKIP = {"Gallery Pirce.png", "Front Gallery.png"}


def main():
    from PIL import Image
    n = 0
    for folder, (w, l) in FOLDERS.items():
        src = os.path.join(BUILDS, folder)
        if not os.path.isdir(src): print(f"Not found: Builds\\{folder}"); continue
        out = os.path.join(SITE, 'shots', w, l); os.makedirs(out, exist_ok=True)
        for f in sorted(os.listdir(src)):
            if f in SKIP or not f.lower().endswith('.png'): continue
            s = re.sub(r'[^a-z0-9]+', '-', f.rsplit('.', 1)[0].lower().replace('_s ', "s ")).strip('-')
            if os.path.exists(os.path.join(out, s + '.thumb.jpg')): continue
            im = Image.open(os.path.join(src, f)).convert('RGB')
            big = im.copy(); big.thumbnail((2000, 2000), Image.LANCZOS); big.save(os.path.join(out, s + '.jpg'), quality=82, optimize=True, progressive=True)
            t = im.copy(); t.thumbnail((720, 720), Image.LANCZOS); t.save(os.path.join(out, s + '.thumb.jpg'), quality=76, optimize=True)
            n += 1; print(f"Added {w}/{l}/{s}")
    other = sorted(set(os.listdir(BUILDS)) - set(FOLDERS) - NOT_LOTS) if os.path.isdir(BUILDS) else []
    print(f"{n} new screenshots." + (f" Builds folders not linked to a lot yet: {', '.join(other)}" if other else ""))
    if n:
        r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
        print(run_output(r))


if __name__ == '__main__':
    main()
