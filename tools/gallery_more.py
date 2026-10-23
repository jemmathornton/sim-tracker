"""More Gallery pictures for lots with no screenshots of hers (trial, 23 Oct): each Gallery upload has 4 pictures and the site
shows only the first (site/gallery/<world>/<lot>.jpg). This saves the other 3 of the lead upload as
site/gallery-more/<world>/<lot>-<n>.jpg; tools/build.py lists them after the cover, marked "more" (the site's Gallery
pictures trial switch decides whether they show).
    python tools/gallery_more.py          report
    python tools/gallery_more.py --apply  fetch the missing pictures (her own public Gallery pictures), then rebuild
"""
import os, sys, time, urllib.request, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SITE, DATA, load, slug, world_files

uploads = load(os.path.join(DATA, 'gallery', 'uploads.json'))['uploads']


def lead(lot):
    """The upload the lot's Gallery card leads with: her chosen copy, else the most favourited and downloaded (as build.py)."""
    ids = [i for i in lot.get('gallery', []) if i in uploads]
    if not ids: return None
    if lot.get('galleryLead') in ids: return lot['galleryLead']
    return max(ids, key=lambda i: uploads[i]['favourites'] + uploads[i]['downloads'])


def main(apply):
    todo, have = [], 0
    for p in world_files():
        W = load(p); ws = os.path.basename(p)[:-5]
        for h in W['neighbourhoods']:
            for l in h['lots']:
                ls = slug(l['lot'])
                if os.path.isdir(os.path.join(SITE, 'shots', ws, ls)) or l.get('versions'): continue   # her screenshots, or Community Space tabs
                i = lead(l)
                if not i: continue
                for n, url in enumerate((uploads[i].get('images') or [])[1:4], 2):
                    out = os.path.join(SITE, 'gallery-more', ws, f'{ls}-{n}.jpg')
                    if os.path.exists(out): have += 1
                    else: todo.append((url, out))
    print(f"{have} pictures saved already, {len(todo)} to fetch")
    if not apply: return
    for k, (url, out) in enumerate(todo, 1):
        os.makedirs(os.path.dirname(out), exist_ok=True)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(req, timeout=30).read()
            if data[:2] == b'\xff\xd8': open(out, 'wb').write(data)
            else: print('not a JPEG:', url)
        except Exception as e: print('failed:', url, e)
        time.sleep(0.3)   # polite to EA's picture server
        if k % 50 == 0: print(k, 'of', len(todo), flush=True)
    r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
    print((r.stdout or r.stderr).strip())


if __name__ == '__main__':
    main('--apply' in sys.argv)
