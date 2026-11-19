"""More Gallery pictures for lots with no screenshots of hers (23 Oct): each Gallery upload has 4 pictures and the site
shows the first as its cover (site/gallery/<world>/<lot>.jpg). This saves the other 3 of the lead upload as
site/gallery-more/<world>/<lot>-<n>.jpg; tools/build.py lists them after the cover (kept, her call 23 Oct). The weekly
refresh runs it for new uploads. Pictures from an upload that no longer leads are fetched again from the one that does
(19 Nov; which upload they came from is kept in data/gallery/picture-sources.json).
    python tools/gallery_more.py          report
    python tools/gallery_more.py --apply  fetch the missing pictures (her own public Gallery pictures), then rebuild
"""
import os, sys, time, urllib.request, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SITE, DATA, load, slug, world_files, write_bytes, run_output, lead_upload, popular_or_chosen, picture_sources, save_picture_sources

GALLERY_DIR = os.path.join(DATA, 'gallery')
uploads = load(os.path.join(GALLERY_DIR, 'uploads.json'))['uploads']


def lead(lot):
    """The upload the lot's Gallery card leads with (common.lead_upload: the same rule as the build and the cover)."""
    return lead_upload(lot, uploads)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r: return r.read()


def main(apply, rebuild=True):
    todo, have, redo = [], 0, []
    src = picture_sources(GALLERY_DIR)
    for p in world_files():
        W = load(p); ws = os.path.basename(p)[:-5]
        for h in W['neighbourhoods']:
            for l in h['lots']:
                ls = slug(l['lot'])
                if (os.path.isdir(os.path.join(SITE, 'shots', ws, ls)) and not l.get('galleryPhotos')) or l.get('versions'): continue   # her screenshots, or Community Space tabs
                i = lead(l)
                if not i: continue
                key = f"{ws}/{ls}"
                old = [os.path.join(SITE, 'gallery-more', ws, f'{ls}-{n}.jpg') for n in (2, 3, 4)]
                old = [f for f in old if os.path.exists(f)]
                was = (src.get(key) or {}).get('more') or (popular_or_chosen(l, uploads) if old else None)
                if old and was != i:   # from an upload that no longer leads: fetch again from the lead
                    redo.append((key, W['name'] + ' / ' + l['lot'], old))
                elif old: have += len(old)
                for n, url in enumerate((uploads[i].get('images') or [])[1:4], 2):
                    out = os.path.join(SITE, 'gallery-more', ws, f'{ls}-{n}.jpg')
                    if not os.path.exists(out) or (old and was != i): todo.append((url, out, key, i))
    print(f"{have} pictures saved already, {len(todo)} to fetch" + (f" ({len(redo)} lots' pictures are from an upload that no longer leads: "
          + ", ".join(r[1] for r in redo) + ")" if redo else ""))
    if not apply: return
    for key, name, files in redo:   # the old upload's pictures go, so none of them lingers if the lead has fewer pictures
        for f in files: os.remove(f)
    got = set()
    for k, (url, out, key, i) in enumerate(todo, 1):
        os.makedirs(os.path.dirname(out), exist_ok=True)
        try:
            data = fetch(url)
            if data[:2] == b'\xff\xd8': write_bytes(out, data); got.add((key, i))
            else: print('not a JPEG:', url)
        except Exception as e: print('failed:', url, e)
        time.sleep(0.3)   # polite to EA's picture server
        if k % 50 == 0: print(k, 'of', len(todo), flush=True)
    if got:
        for key, i in got: src.setdefault(key, {})['more'] = i
        save_picture_sources(src, GALLERY_DIR)
    if not rebuild: return
    r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
    print(run_output(r))


if __name__ == '__main__':
    main('--apply' in sys.argv)
