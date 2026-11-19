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
LOG = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs', 'gallery-refresh.log')
try:
    from common import ROOT, SITE, GALLERY, slug, norm, load, save, world_files, lead_upload, first_with_pictures, picture_sources, save_picture_sources
except Exception:   # 15 Nov: a scheduled run failed with nothing in the log; even a broken setup leaves a trace now
    if __name__ == '__main__':
        import traceback; os.makedirs(os.path.dirname(LOG), exist_ok=True)
        with open(LOG, 'a', encoding='utf-8') as f: f.write(f"Gallery refresh, {datetime.now():%d %b %Y %H:%M}, started\nStopped with an error:\n{traceback.format_exc()}\n")
    raise

API = "https://drop-api.ea.com/ugx/the-sims-4"
CREATOR = "JemmaTheSimmer"
OWN_NAMES = {CREATOR.lower(), "mstiquelle", "misstiquelle"}   # her Library copies keep the name she had when she made them
HEADERS = {"User-Agent": "JemmasSimWorld/1.0 (personal site, weekly refresh)"}
KIND = {"lot": "lot", "room": "room", "household": "household"}
TODAY = date.today().isoformat()
report = []
LIVE = False   # True when run as the weekly refresh: each line goes into the log as it's said, so a run that's killed partway still shows


def say(s):
    report.append(s); print(s)
    if LIVE:
        try:
            with open(LOG, 'a', encoding='utf-8') as f: f.write(s + '\n')
        except OSError: pass


def save_safe(p, obj):
    """save() to a temporary file next to p, then swap it in, so a crash or power cut mid-write never leaves half a file."""
    tmp = p + '.tmp'; save(tmp, obj); os.replace(tmp, p)


def write_safe(p, text):
    tmp = p + '.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f: f.write(text)
    os.replace(tmp, p)


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
        if not d.get('hasNext') or not d['items']: return list(dict.fromkeys(ids + library_ids()))
        off += 24; time.sleep(0.3)


def library_ids():
    """Gallery ids of her shared items, read from her Library (the Tray folder): the Gallery's search leaves out uploads
    tagged as custom content (24 Oct: Palomino Junction, with her Sims' photos), but her Library copy keeps the id.
    Copies made under her old names count too (2 Nov: Pier Perfection, re-uploaded from a MsTiquelle copy, wasn't
    in the search); main() still only adds an upload when the Gallery itself says it's hers."""
    import base64, glob
    try:
        import sims4files as s4
        S = s4.save_schema(); out = []
        for f in glob.glob(os.path.join(os.path.dirname(s4.SAVES), 'Tray', '*.trayitem')):
            try: d = s4.decode(open(f, 'rb').read()[8:], '.EA.Sims4.Network.TrayMetadata', S, depth=0)
            except Exception: continue
            rid = d.get('remote_id')
            if isinstance(rid, (bytes, bytearray)) and len(rid) == 16 and any(rid) and (d.get('creator_name') or '').lower() in OWN_NAMES:
                out.append(base64.b64encode(bytes(rid)).decode())
        return list(dict.fromkeys(out))
    except Exception as e:
        say(f"  her Library couldn't be read for shared items: {e}"); return []


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


AGES = {1: "Baby", 2: "Toddler", 4: "Child", 8: "Teen", 16: "Young Adult", 32: "Adult", 64: "Elder", 128: "Infant"}


def member_check(i, h):
    """A household upload's members against the site's Sims (6 Nov, her 24 Oct ask): '' when they match, else what differs."""
    try: _, d = api(f"/item/{urllib.parse.quote(i, safe='')}?locale=en")
    except Exception: return ''
    mem = (((d or {}).get('data') or {}).get('typeDetails') or {}).get('members') or []
    gal = {(m.get('firstName', '') + ' ' + m.get('lastName', '')).strip(): AGES.get(m.get('age'), '') for m in mem}
    site = {s.get('name'): s.get('age') for s in h.get('sims') or []}
    if not mem or not site: return ''
    out = [f"only on the Gallery: {', '.join(k for k in gal if k not in site)}" if any(k not in site for k in gal) else '',
           f"only on the site: {', '.join(k for k in site if k not in gal)}" if any(k not in gal for k in site) else '',
           '; '.join(f"{k} is {gal[k]} on the Gallery, {site[k]} on the site" for k in gal if k in site and gal[k] and site[k] != gal[k])]
    return '; '.join(x for x in out if x)


def auto_link(new_ids, uploads, worlds):
    """Link a new upload to a lot when its title names exactly one lot. Anything less certain (only a hashtag
    names the lot, or several lots match) is listed in data/gallery/unlinked.json for Jemma to decide."""
    lots = [(W, l) for W in worlds if W['owned'] for h in W['neighbourhoods'] for l in h['lots']]
    nt = lambda x: re.sub(r'^the', '', norm(x))
    linked, unl = [], load(os.path.join(GALLERY, 'unlinked.json'))
    # uploads for her to sort, shown on Admin's Notes until she decides (23 Oct): new ones with no lot, and new copies of a build
    ts_file = os.path.join(GALLERY, 'to-sort.json'); ts = load(ts_file) if os.path.exists(ts_file) else {}
    for i in new_ids:
        u = uploads.get(i)
        if not u: say(f"  new upload {i} couldn't be read this time; it'll be tried again next week"); continue
        if u['kind'] == 'household':   # her household uploads (24 Oct): linked when the title names exactly one household (a numbered household like "Davidson 1" counts as "Davidson")
            hh = [(W, n, h) for W in worlds if W['owned'] for n, h in (W.get('households') or {}).items() if re.sub(r'\d+$', '', norm(n)) == norm(u['title'])]
            if len(hh) == 1:
                W, n, h = hh[0]
                if h.get('gallery'): ts[i] = {"title": u['title'], "lot": f"{W['name']} / {n} (household)", "why": f"New on {TODAY}: another copy of this household. Which should lead (normally the latest)?"}
                diff = member_check(i, h)
                if diff:
                    why = (ts[i]['why'] + " Also: " if i in ts else f"New on {TODAY}: ") + f"the upload's Sims differ from the site's ({diff}). Update the site from it?"
                    ts[i] = {"title": u['title'], "lot": f"{W['name']} / {n} (household)", "why": why}
                    say(f"  household upload “{u['title']}” differs from the site: {diff}")
                h.setdefault('gallery', []).append(i); linked.append(W)
                say(f"  linked new household upload “{u['title']}” to {W['name']} / {n}")
            else:
                unl['uploads'][i] = {"title": u['title'], "lot": None, "why": f"Household, new on {TODAY}; " + ("no household in the plan has this name." if not hh else "several households have this name: " + ", ".join(f"{x[0]['name']} / {x[1]}" for x in hh) + ".")}
                ts[i] = {"title": u['title'], "lot": None, "why": unl['uploads'][i]['why']}
                say(f"  new household upload “{u['title']}” not linked; listed in data/gallery/unlinked.json")
            continue
        if u['kind'] not in ('lot', 'room'): continue
        t = re.sub(r'\s*[\[(][^\])]*[\])]\s*$', '', u['title'])          # "Hallow Slough (SoupShell)" -> "Hallow Slough"
        tags = [x.lower() for x in re.findall(r'#(\w+)', u['description'])]
        hits = [(W, l) for W, l in lots if norm(t) in (norm(l['lot']), norm(l['myName']))]
        if not hits: hits = [(W, l) for W, l in lots if nt(t) in (nt(l['lot']), nt(l['myName']))]
        wt = [h for h in hits if norm(h[0]['name']) in tags]
        if len(hits) > 1 and wt: hits = wt
        if len(hits) == 1:
            W, l = hits[0]
            if l.get('gallery'): ts[i] = {"title": u['title'], "lot": f"{W['name']} / {l['lot']}", "why": f"New on {TODAY}: another copy of this build. Which should lead (normally the latest)?"}
            l.setdefault('gallery', []).append(i); linked.append(W)
            say(f"  linked new upload “{u['title']}” to {W['name']} / {l['lot']}")
            continue
        maybe = hits or [(W, l) for W, l in lots if norm(l['lot']) in tags or (l['myName'] and norm(l['myName']) in tags)]
        unl['uploads'][i] = {"title": u['title'], "lot": None, "why": f"New on {TODAY}; " + (
            "no lot in the plan has this name." if not maybe else "not linked automatically, could be " + ", ".join(f"{h[0]['name']} / {h[1]['lot']}" for h in maybe) + ".")}
        ts[i] = {"title": u['title'], "lot": None, "why": unl['uploads'][i]['why']}
        say(f"  new upload “{u['title']}” not linked to a lot; listed in data/gallery/unlinked.json")
    save_safe(os.path.join(GALLERY, 'unlinked.json'), unl)
    if ts: save_safe(ts_file, ts)
    return linked


def add_covers(worlds, uploads):
    """The first Gallery picture of the lot's lead upload (the one its Gallery card shows, common.lead_upload) for linked lots
    with no screenshots of hers (EA's frame cropped off lot pictures). A cover from another upload is remade (19 Nov: covers
    used to come from the first linked upload, so a few showed a different copy from the card). Which upload each cover came
    from is kept in data/gallery/picture-sources.json."""
    from PIL import Image
    src = picture_sources(GALLERY); before = json.dumps(src, sort_keys=True)
    for W in worlds:
        if not W['owned']: continue
        ws = slug(W['name'])
        for h in W['neighbourhoods']:
            for l in h['lots']:
                ls = slug(l['lot']); dest = os.path.join(SITE, 'gallery', ws, ls + '.jpg')
                if not l.get('gallery') or l.get('versions') or (os.path.isdir(os.path.join(SITE, 'shots', ws, ls)) and not l.get('galleryPhotos')): continue   # her screenshots win
                i = lead_upload(l, uploads); u = uploads.get(i) or {}
                if not u.get('images'): continue
                rec = src.setdefault(f"{ws}/{ls}", {})
                if os.path.exists(dest):
                    was = rec.get('cover') or first_with_pictures(l, uploads)
                    if was == i: rec['cover'] = i; continue
                try:
                    im = Image.open(io.BytesIO(get(u['images'][0])[1])).convert('RGB')
                    if u['kind'] == 'lot' and im.size == (744, 410): im = im.crop((67, 0, 677, 410))
                    remade = os.path.exists(dest)
                    os.makedirs(os.path.dirname(dest), exist_ok=True); im.save(dest + '.tmp', 'JPEG', quality=88); os.replace(dest + '.tmp', dest)
                    rec['cover'] = i
                    say(f"  {'remade' if remade else 'added'} a Gallery picture for {W['name']} / {l['lot']}" + (f" (now from “{u['title']}”, the upload its card shows)" if remade else ""))
                except Exception as e:
                    say(f"  couldn't get a picture for {W['name']} / {l['lot']}: {e}")
    src = {k: v for k, v in src.items() if v}
    if json.dumps(src, sort_keys=True) != before: save_picture_sources(src, GALLERY)


def main():
    up_file, c_file = os.path.join(GALLERY, 'uploads.json'), os.path.join(GALLERY, 'comments.json')
    U, C = load(up_file), load(c_file)
    uploads, comments = U['uploads'], C['comments']
    if not report: say(f"Gallery refresh, {datetime.now():%d %b %Y %H:%M}")
    listed = list_uploads()
    ids = list(dict.fromkeys(list(uploads) + listed))
    new_ids = [i for i in listed if i not in uploads]
    say(f"{len(listed)} uploads listed on the Gallery, {len(new_ids)} new")
    failed, gone, others = [], [], {}
    for n, i in enumerate(ids):
        try:
            rec = fetch_item(i)
            if rec is None: gone.append(i); continue
            # the search lists anything that mentions her name: only new uploads by her are added, and her shell-challenge
            # builds, which the Gallery credits to lilsimsie and lists under her name
            if i not in uploads and rec['creator'].lower() not in (CREATOR.lower(), 'lilsimsie'): others[i] = rec; continue   # her shell-challenge builds are credited to lilsimsie (24 Oct: Hillside Haven)
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
    for rec in others.values(): say(f"  skipped “{rec['title']}” by {rec['creator'] or 'an unknown creator'}: it mentions her name but isn't her upload")
    new_ids = [i for i in new_ids if i not in others]
    save_safe(up_file, U); save_safe(c_file, C)

    # this week's numbers into the history (a second run on the same day replaces that day's rows)
    h_file = os.path.join(GALLERY, 'history.csv')
    rows = [r for r in open(h_file, encoding='utf-8').read().splitlines()[1:] if r and not r.startswith(TODAY + ',')]
    rows += [f"{TODAY},{i},{u['favourites']},{u['downloads']},{len(comments.get(i, []))}" for i, u in uploads.items() if u.get('checked') == TODAY]
    write_safe(h_file, 'date,id,favourites,downloads,comments\n' + '\n'.join(rows) + '\n')

    paths = world_files(); worlds = [load(p) for p in paths]
    changed = auto_link(new_ids, uploads, worlds)
    for p, W in zip(paths, worlds):
        if any(W is c for c in changed): save_safe(p, W)
    add_covers(worlds, uploads)
    try:   # the other three Gallery pictures of lots with no screenshots of hers (23 Oct)
        import gallery_more; gallery_more.main(True, rebuild=False)
    except Exception as e: say(f"  more Gallery pictures not fetched: {e}")
    fav, dl = sum(u['favourites'] for u in uploads.values()), sum(u['downloads'] for u in uploads.values())
    say(f"Done: {fav} favourites, {dl} downloads, {sum(len(v) for v in comments.values())} comments across {len(uploads)} uploads")
    return not failed


REFRESH_PATHS = ['data/gallery', 'data/worlds', 'site/js/data.js', 'site/js/admin-data.js', 'site/index.html', 'site/gallery', 'site/gallery-more',
                 'for-jemma/new-save-checklist.md', 'research/new-save-status.md', 'research/data/new-save-status.json']


def git(*a, stdin=None, root=None):
    import subprocess
    feed = {'input': stdin} if stdin is not None else {'stdin': subprocess.DEVNULL}   # the weekly task has no console stdin
    return subprocess.run(['git', *a], cwd=root or ROOT, capture_output=True, text=True, encoding='utf-8',
                          creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0), **feed)


def changed_files(root=None):
    """Files under the refresh's folders that differ from the last commit (changed, new or deleted), as git paths."""
    r = git('status', '--porcelain', '-z', '--untracked-files=all', '--', *REFRESH_PATHS, root=root)
    out, parts = set(), r.stdout.split('\0')
    k = 0
    while k < len(parts):
        e = parts[k]; k += 1
        if len(e) < 4: continue
        out.add(e[3:])
        if e[0] in 'RC': k += 1   # a rename's old name follows; it isn't ours to commit
    return out


SHARED_PATHS = ('data/worlds/',)   # the plan: hers and Claude's to edit too; everything else in REFRESH_PATHS only the refresh (and its build) writes


def commit_refresh(before=frozenset(), root=None):
    """Save the refresh in the project's history (her OK, 23 Oct), so a bad week can always be undone. A world file in
    data/worlds that already had uncommitted changes when the run started (her or Claude's work) is left out and named in
    the log (15 Nov review). Files only the refresh writes (Gallery data, data.js, admin-data.js, index.html, Gallery
    pictures, the checklist, the new-save status) are always taken, even if a failed run left them changed (19 Nov:
    before, one failed build kept them out of every later weekly save). Never pushes anywhere."""
    try:
        before = sorted(p for p in before if p.startswith(SHARED_PATHS))
        mine = sorted(changed_files(root) - set(before))
        if not mine: return say("Nothing new to save in the project history")
        lst = '\0'.join(mine) + '\0'
        a = git('add', '--pathspec-from-file=-', '--pathspec-file-nul', stdin=lst, root=root)
        r = a if a.returncode else git('commit', '-m', f"Weekly Gallery refresh, {datetime.now():%d %b %Y} (automatic)", '--only',
                                       '--pathspec-from-file=-', '--pathspec-file-nul', stdin=lst, root=root)
        say("Saved in the project history" if r.returncode == 0 else "Couldn't save in the project history: " + (r.stderr or r.stdout).strip()[:300])
        if before: say(f"  left out of the automatic save (already being changed before the refresh): {', '.join(sorted(before)[:10])}" + (" …" if len(before) > 10 else ""))
    except Exception as e: say(f"Couldn't save in the project history: {e}")


if __name__ == '__main__':
    ok = False
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    LIVE = True
    say(f"Gallery refresh, {datetime.now():%d %b %Y %H:%M}, started")   # ", started": this run writes as it goes and ends with "Finished" (admin_data.py)
    try:
        before = changed_files()   # work in progress in the refresh's folders, kept out of its automatic commit
        ok = main()
        if '--no-build' not in sys.argv:
            import subprocess
            # stdin=DEVNULL: the weekly task runs without a console, and Windows refuses to pass on a missing stdin
            r = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')],
                               stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')
            say('\n'.join(x for x in ((r.stdout or '').strip(), (r.stderr or '').strip()) if x) + ('' if r.returncode == 0 else '\nBuild failed'))
            ok = ok and r.returncode == 0
            if r.returncode == 0:
                rebuilt = True   # False if the build after the new-save check fails
                try:   # her new save against the plan, for Admin > Notes (24 Oct); a problem here never stops the refresh
                    n = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'research', 'new_save_check.py')],
                                       stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8', timeout=900)
                    if n.returncode == 0:
                        b = subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8')   # build again: admin-data.js and its fingerprint in index.html
                        if b.returncode == 0: say("New-save check refreshed")
                        else:   # 19 Nov: a failed second build is a failed run, and nothing is saved in the history
                            say('\n'.join(x for x in ((b.stdout or '').strip(), (b.stderr or '').strip()) if x) + '\nBuild failed (after the new-save check)')
                            ok = rebuilt = False
                    else: say("New-save check not refreshed: " + (n.stderr or n.stdout).strip()[-200:])
                except Exception as e: say(f"New-save check not refreshed: {e}")
                if rebuilt: commit_refresh(before)
    except Exception:
        import traceback
        say("Stopped with an error:\n" + traceback.format_exc())
    finally:
        say(("Finished" if ok else "Finished with problems") + "\n")
    sys.exit(0 if ok else 1)
