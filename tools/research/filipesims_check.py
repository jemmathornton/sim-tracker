"""Has filipesims posted a new world map, or updated their maps? (23 Nov 2026, her ask; run weekly by tools/gallery_refresh.py)

    python -X utf8 tools/research/filipesims_check.py          check now (needs the internet); writes research/data/filipesims-check.json

Reads filipesims' public list of posts (patreon.com/filipesims_art/sitemap: titles, dates and links only; no account, nothing
downloaded). Posts not seen before are kept as news when they're about maps:
  "world"   a map for a world Sim World still has from 20th Century Plumbob (tools/filipesims_maps.py MAPS doesn't have it)
  "update"  a patch or mod update (the maps fixed for a new game version: download them again)
  "map"     any other map post (a new version of a world already on filipesims, a bundle, an overview)
Admin > At a glance shows the news (tools/admin_data.py, js/sections.js). Once it's dealt with (the map downloaded and swapped
in with tools/filipesims_maps.py, or she says leave it), take its entry out of "news". The first run only notes what's there.
"""
import html, json, os, re, sys, urllib.request
from datetime import date
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import DATA, load, world_files

ROOT = os.path.dirname(DATA)
URL = 'https://www.patreon.com/filipesims_art/sitemap'
OUT = os.path.join(ROOT, 'research', 'data', 'filipesims-check.json')
POST = re.compile(r'(?:<p[^>]*postDate[^>]*>([^<]*)</p>\s*)?<a[^>]+href="(https://www\.patreon\.com/filipesims_art/posts/[\w-]*?(\d+))"[^>]*>([^<]+)</a>')


def posts(page):
    """[{id, title, url, date}] of every post on the list, once each (the date is as the list shows it, e.g. "Jun 27")."""
    out, seen = [], set()
    for d, url, pid, title in POST.findall(page):
        if pid in seen: continue
        seen.add(pid); out.append({'id': pid, 'title': html.unescape(title).strip(), 'url': url, 'date': html.unescape(d).strip()})
    return out


def worlds_named(title, names):
    t = title.lower()
    return [n for n in names if n.lower() in t]


def classify(title, names, on_filipesims):
    """(kind, worlds) for a post title; kind None if it isn't about maps."""
    t = title.lower()
    named = worlds_named(title, names)
    if re.search(r'\bpatch\b|mod update', t): return 'update', named
    if 'map' not in t and not named: return None, named   # "Testing", "Join for free" … (a world's name alone counts: "San Myshuno (Midnight & Sunset)")
    missing = [n for n in named if n not in on_filipesims]
    return ('world', missing) if missing else ('map', named)


def world_names():
    """Every world's name, and the names of those Sim World shows from filipesims."""
    import filipesims_maps
    names = {os.path.basename(p)[:-5]: load(p)['name'] for p in world_files()}
    return sorted(names.values(), key=len, reverse=True), {names[ws] for ws in filipesims_maps.MAPS if ws in names}


def check(page, state, today=None):
    """The new state: every post marked seen; map posts not seen before added to news (none on the very first run)."""
    today = today or date.today().isoformat()
    names, on_filipesims = world_names()
    first = not state.get('seen')
    seen, news = dict(state.get('seen') or {}), list(state.get('news') or [])
    found = posts(page)
    if not found: raise ValueError('no posts found on the list (has the page changed?)')
    for p in found:
        if p['id'] in seen: continue
        seen[p['id']] = p['title']
        kind, ws = classify(p['title'], names, on_filipesims)
        if kind and not first: news.append({**p, 'kind': kind, 'worlds': ws, 'found': today})
    return {'_about': 'tools/research/filipesims_check.py: filipesims\' posts already seen, and map news for Admin (take an entry '
                      'out of "news" once dealt with)', 'checked': today, 'posts': len(found), 'seen': seen, 'news': news}


def fetch():
    req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0 (Sim World map check)'})
    with urllib.request.urlopen(req, timeout=30) as r: return r.read().decode('utf-8', 'replace')


def main():
    state = json.load(open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    new = check(fetch(), state)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    tmp = OUT + '.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f: json.dump(new, f, ensure_ascii=False, indent=1)
    os.replace(tmp, OUT)
    added = len(new['news']) - len(state.get('news') or [])
    print(f"filipesims: {new['posts']} posts, {added} new map news" + (' (first run: noted what is there)' if not state.get('seen') else ''))
    return new


if __name__ == '__main__':
    main()
