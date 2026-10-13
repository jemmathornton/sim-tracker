"""Weekly Gallery refresh: favourites, downloads, comments and details for every one of Jemma's uploads.

    python tools/gallery_refresh.py            refresh, keep this week's numbers in the history, rebuild the site
    python tools/gallery_refresh.py --no-build refresh only

Reads EA's public Gallery data (no sign-in needed). Writes data/gallery/*, adds a Gallery picture for linked lots
that have neither screenshots nor a picture yet, then runs tools/build.py. A short report goes to logs/.
Nothing is lost if EA can't be reached: uploads that fail keep their last numbers.
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import date, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, SITE, GALLERY, slug, norm, load, save, world_files

API = "https://drop-api.ea.com/ugx/the-sims-4"
CREATOR = "JemmaTheSimmer"
HEADERS = {"User-Agent": "JemmasSimWorld/1.0 (personal site, weekly refresh)"}
KIND = {"lot": "lot", "room": "room", "household": "household"}
TODAY = date.today().isoformat()
report = []
def say(s): report.append(s); print(s)


def get(url, tries=3):
    """GET with a few retries. Returns (status, bytes); 204 means 'nothing here'."""
    for n in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=30) as r:
                return r.status, r.read()
        except urllib.error.HTTPError as e:
            if e.code in (404, 410): return e.code, b''
            if n == tries - 1: raise
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            if n == tries - 1: raise
        time.sleep(2 * (n + 1))


def api(path):
    status, body = get(API + path)
    return status, (json.loads(body) if body else None)


def list_uploads():
    """Every upload the Gallery lists for her name (includes shell-challenge uploads credited to lilsimsie)."""
    ids, off = [], 0
    while True:
        _, d = api(f"/list-items?search={CREATOR}&limit=24&offset={off}")
        d = d['data']; ids += [i['slug'] for i in d['items']]
        if not d.get('hasNext') or not d['items']: return ids
        off += 24; time.sleep(0.3)


def fetch_item(i):
    status, d = api(f"/item/{urllib.parse.quote(i, safe='')}?locale=en")
    if status in (404, 410) or not d: return None
    d = d['data']; t = d.get('typeDetails') or {}
    return {"title": d['name'], "kind": KIND.get(d['type'], d['type']), "description": d.get('description') or '',
            "lotType": (t.get('lotType') or {}).get('name', ''), **({"roomType": t['roomType'].get('name', '')} if t.get('roomType') else {}),
            "size": f"{t['sizeX']}x{t['sizeZ']}" if t.get('sizeX') else '', "price": t.get('priceValue') or 0,
            "beds": t.get('bedroomsCount') or 0, "baths": t.get('bathsCount') or 0,
            "packs": [p['displayName'] for p in d.get('requiredPacks') or []], "images": d.get('images') or [],
            "favourites": d.get('favouritesCount') or 0, "downloads": d.get('downloadsCount') or 0,
            "creator": (d.get('creator') or {}).get('username', ''), "checked": TODAY}


def fetch_comments(i):
    out, cursor, seen = [], None, set()
    while True:
        q = f"/item/{urllib.parse.quote(i, safe='')}/comments?locale=en" + (f"&cursor={urllib.parse.quote(cursor, safe='')}" if cursor else "")
        status, d = api(q)
        if status == 204 or not d: return out
        for m in d.get('messages') or []:
            if m['id'] in seen: return out
            seen.add(m['id']); out.append({"m": m.get('message', ''), "t": m.get('createdTimestamp'), "u": (m.get('author') or {}).get('username', '')})
        cursor = d.get('nextCursor')
        if not cursor: return out
        time.sleep(0.3)


def auto_link(new_ids, uploads, worlds):
    """Link a new upload to a lot when its title names exactly one lot. Anything less certain (only a hashtag
    names the lot, or several lots match) is listed in data/gallery/unlinked.json for Jemma to decide."""
    lots = [(W, l) for W in worlds if W['owned'] for h in W['neighbourhoods'] for l in h['lots']]
    nt = lambda x: re.sub(r'^the', '', norm(x))
    linked, unl = [], load(os.path.join(GALLERY, 'unlinked.json'))
    for i in new_ids:
        u = uploads[i]
        if u['kind'] not in ('lot', 'room'): continue
        t = re.sub(r'\s*[\[(][^\])]*[\])]\s*$', '', u['title'])          # "Hallow Slough (SoupShell)" -> "Hallow Slough"
        tags = [x.lower() for x in re.findall(r'#(\w+)', u['description'])]
        hits = [(W, l) for W, l in lots if norm(t) in (norm(l['lot']), norm(l['myName']))]
        if not hits: hits = [(W, l) for W, l in lots if nt(t) in (nt(l['lot']), nt(l['myName']))]
        wt = [h for h in hits if norm(h[0]['name']) in tags]
        if len(hits) > 1 and wt: hits = wt
        if len(hits) == 1:
            W, l = hits[0]; l.setdefault('gallery', []).append(i); linked.append(W)
            say(f"  linked new upload “{u['title']}” to {W['name']} / {l['lot']}")
            continue
        maybe = hits or [(W, l) for W, l in lots if norm(l['lot']) in tags or (l['myName'] and norm(l['myName']) in tags)]
        unl['uploads'][i] = {"title": u['title'], "lot": None, "why": f"New on {TODAY}; " + (
            "no lot in the plan has this name." if not maybe else "not linked automatically, could be " + ", ".join(f"{h[0]['name']} / {h[1]['lot']}" for h in maybe) + ".")}
        say(f"  new upload “{u['title']}” not linked to a lot; listed in data/gallery/unlinked.json")
    save(os.path.join(GALLERY, 'unlinked.json'), unl)
    return linked


def add_covers(worlds, uploads):
    """First Gallery picture for linked lots with no screenshots and no picture yet (EA's frame cropped off lot pictures)."""
    from PIL import Image
    for W in worlds:
        if not W['owned']: continue
        ws = slug(W['name'])
        for h in W['neighbourhoods']:
            for l in h['lots']:
                ls = slug(l['lot']); dest = os.path.join(SITE, 'gallery', ws, ls + '.jpg')
                if not l.get('gallery') or l.get('versions') or os.path.isdir(os.path.join(SITE, 'shots', ws, ls)) or os.path.exists(dest): continue
                u = next((uploads[i] for i in l['gallery'] if uploads.get(i, {}).get('images')), None)
                if not u: continue
                try:
                    im = Image.open(io.BytesIO(get(u['images'][0])[1])).convert('RGB')
                    if u['kind'] == 'lot' and im.size == (744, 410): im = im.crop((67, 0, 677, 410))
                    os.makedirs(os.path.dirname(dest), exist_ok=True); im.save(dest, quality=88)
                    say(f"  added a Gallery picture for {W['name']} / {l['lot']}")
                except Exception as e:
                    say(f"  couldn't get a picture for {W['name']} / {l['lot']}: {e}")


def main():
    up_file, c_file = os.path.join(GALLERY, 'uploads.json'), os.path.join(GALLERY, 'comments.json')
    U, C = load(up_file), load(c_file)
    uploads, comments = U['uploads'], C['comments']
    say(f"Gallery refresh, {datetime.now():%d %b %Y %H:%M}")
    listed = list_uploads()
    ids = list(dict.fromkeys(list(uploads) + listed))
    new_ids = [i for i in listed if i not in uploads]
    say(f"{len(listed)} uploads listed on the Gallery, {len(new_ids)} new")
    failed, gone = [], []
    for n, i in enumerate(ids):
        try:
            rec = fetch_item(i)
            if rec is None: gone.append(i); continue
            cl = fetch_comments(i)
        except Exception as e:
            failed.append(i); continue
        old = uploads.get(i, {})
        if old.get('gone'): rec['gone'] = False
        uploads[i] = rec
        if cl or i in comments: comments[i] = cl
        time.sleep(0.2)
    for i in gone:
        if i in uploads: uploads[i]['gone'] = True
    if gone: say(f"{len(gone)} uploads no longer on the Gallery: " + ", ".join(uploads[i]['title'] for i in gone if i in uploads))
    if failed: say(f"{len(failed)} uploads couldn't be fetched this time and keep last week's numbers")
    save(up_file, U); save(c_file, C)

    # this week's numbers into the history (a second run on the same day replaces that day's rows)
    h_file = os.path.join(GALLERY, 'history.csv')
    rows = [r for r in open(h_file, encoding='utf-8').read().splitlines()[1:] if r and not r.startswith(TODAY + ',')]
    rows += [f"{TODAY},{i},{u['favourites']},{u['downloads']},{len(comments.get(i, []))}" for i, u in uploads.items() if u.get('checked') == TODAY]
    with open(h_file, 'w', encoding='utf-8', newline='\n') as f: f.write('date,id,favourites,downloads,comments\n' + '\n'.join(rows) + '\n')

    paths = world_files(); worlds = [load(p) for p in paths]
    changed = auto_link(new_ids, uploads, worlds)
    for p, W in zip(paths, worlds):
        if any(W is c for c in changed): save(p, W)
    add_covers(worlds, uploads)
    fav, dl = sum(u['favourites'] for u in uploads.values()), sum(u['downloads'] for u in uploads.values())
    say(f"Done: {fav} favourites, {dl} downloads, {sum(len(v) for v in comments.values())} comments across {len(uploads)} uploads")
    return not failed


if __name__ == '__main__':
    ok = False
    try:
        ok = main()
        if '--no-build' not in sys.argv:
            import subprocess
            # stdin=DEVNULL: the weekly task runs without a console, and Windows refuses to pass on a missing stdin
            r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')],
                               stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
            say((r.stdout or r.stderr).strip())
            ok = ok and r.returncode == 0
    except Exception:
        import traceback
        say("Stopped with an error:\n" + traceback.format_exc())
    finally:
        os.makedirs(os.path.join(ROOT, 'logs'), exist_ok=True)
        with open(os.path.join(ROOT, 'logs', 'gallery-refresh.log'), 'a', encoding='utf-8') as f: f.write('\n'.join(report) + '\n\n')
    sys.exit(0 if ok else 1)
