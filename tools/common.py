"""Shared helpers for the Sim World tools: paths, slugs, JSON in and out."""
import json, os, re, sys, unicodedata
from datetime import date

# names like Admiral’s Wreckage print fine in any Windows console (and there's no console at all for the weekly task)
for _s in (sys.stdout, sys.stderr):
    if _s is not None and hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
SITE = os.path.join(ROOT, 'site')
GALLERY = os.path.join(DATA, 'gallery')


def path(*parts):
    return os.path.join(ROOT, *parts)


def slug(s):
    """Same as slug() in site/js/app.js, so file names and page links agree (accents dropped, & -> and)."""
    s = unicodedata.normalize('NFD', str(s).lower())
    s = re.sub('[̀-ͯ]', '', s).replace('&', 'and')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def norm(s):
    """Loose comparison key for names: letters and digits only, accents dropped ("Chee-wít" = "Chee-wit")."""
    s = re.sub('[̀-ͯ]', '', unicodedata.normalize('NFD', (s or '').lower()))
    return re.sub(r'[^a-z0-9]', '', s.replace('&', 'and'))


def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def save(p, obj, inline=('lots',)):
    """Write JSON readably: indented, but each item of an `inline` list on one line (one lot per line)."""
    os.makedirs(os.path.dirname(p), exist_ok=True)
    marks = {}

    def mark(o):
        if isinstance(o, dict):
            return {k: ([_tag(x) for x in v] if k in inline and isinstance(v, list) else mark(v)) for k, v in o.items()}
        if isinstance(o, list):
            return [mark(x) for x in o]
        return o

    def _tag(x):
        key = f'@@{len(marks)}@@'
        marks[key] = json.dumps(x, ensure_ascii=False)
        return key

    text = json.dumps(mark(obj), ensure_ascii=False, indent=1)
    # short lists of plain values (colours, map spots) on one line
    text = re.sub(r'\[\n\s*((?:(?:"(?!@@)[^"\n]*"|[-\d.]+|true|false|null),\n\s*)*(?:"(?!@@)[^"\n]*"|[-\d.]+|true|false|null))\n\s*\]',
                  lambda m: '[' + re.sub(r',\n\s*', ', ', m.group(1)) + ']', text)
    text = re.sub(r'"(@@\d+@@)"', lambda m: marks[m.group(1)], text)
    write_text(p, text + '\n')


def write_text(p, text):
    """Write to a temporary file next to p, then swap it in, so a crash or power cut mid-write never leaves half a file (15 Nov)."""
    tmp = f"{p}.tmp"
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f: f.write(text)
    os.replace(tmp, p)


def run_output(r):
    """What a finished program said: its output and, after it, any errors (19 Nov: a build that failed partway after printing
    showed only its output, hiding why it failed)."""
    return '\n'.join(x for x in ((r.stdout or '').strip(), (r.stderr or '').strip()) if x)


def write_bytes(p, data):
    """write_text() for pictures and other binary files (19 Nov)."""
    tmp = f"{p}.tmp"
    with open(tmp, 'wb') as f: f.write(data)
    os.replace(tmp, p)


# ---------- which of a lot's Gallery uploads leads (19 Nov: one rule for the card, its cover and its other pictures) ----------
VERSION_END = r'(Market|Gardens?|Makers|Space)$'   # Community Space versions' titles end with one of these


def clean_title(t):
    """"Kin-Ship [Simsie Shell]" -> "Kin-Ship"."""
    return re.sub(r'\s*\[[^\]]*\]\s*$', '', t).strip()


def plan_types(lot):
    """The lot types in her plan's Type column ("Park/Cemetery" -> both; notes in brackets dropped)."""
    return [t.strip() for t in re.sub(r'\s*\([^)]*\)', '', lot.get('type') or '').split('/')]


# her own names for two of the game's lot types (CLAUDE.md), used wherever a Gallery upload's lot type is shown or compared
GALLERY_TYPE_NAMES = {"Thrift and Bubble Tea Store": "Thrift and Boba Store"}


def her_type(t):
    """A Gallery lot type in her words: Thrift and Bubble Tea Store -> Thrift and Boba Store, UBrite Commons -> UoB Commons."""
    if not t: return t
    if t.startswith('UBrite'): return 'UoB Commons'
    return GALLERY_TYPE_NAMES.get(t, t)


def resolved_types(lot, types):
    """The Gallery's lot types for a lot's uploads, with "Missing sims translation" (newer lot types such as Backroom have no
    English name on the Gallery) taken to be a plan type no other upload has, so her Backroom re-uploads lead (21 Oct)."""
    plan, out = plan_types(lot), list(types)
    for k, t in enumerate(out):
        if t == 'Missing sims translation': out[k] = next((p for p in plan if p not in set(out)), plan[0])
    return out


def lead_upload(lot, uploads):
    """The id of the upload a lot (or household) leads with, from its `gallery` ids; None if it has none. Her rule (13 Oct):
    the copy she chose (`galleryLead`), else the most favourited and downloaded. Community Space lots lead with the upload
    that isn't a version; lots with versions she keeps on purpose (`galleryVariants`, rental + regular) with the one matching
    the plan's lot type, then the rental (her chosen copy still wins). Used by the build (the Gallery card), the weekly
    refresh (the cover picture) and tools/gallery_more.py (the other three pictures), so all three show the same upload."""
    ids = [i for i in lot.get('gallery', []) if i in uploads]
    if not ids: return None
    pop = lambda i: uploads[i]['favourites'] + uploads[i]['downloads']
    chosen = lot.get('galleryLead') if lot.get('galleryLead') in ids else None
    if len(ids) > 1 and lot.get('versions'):
        titles = [clean_title(uploads[i]['title']) for i in ids]
        return (next((i for i, t in zip(ids, titles) if not re.search(r'\b' + VERSION_END, t)), None)
                or next((i for i, t in zip(ids, titles) if t.endswith('Space')), ids[0]))
    types = [her_type(uploads[i].get('lotType')) for i in ids]
    if len(ids) > 1 and (lot.get('galleryVariants') or 'Residential Rental' in types):
        types, plan = resolved_types(lot, types), plan_types(lot)
        pick = [i for i, t in zip(ids, types) if t in plan] or [i for i, t in zip(ids, types) if t == 'Residential Rental'] or ids
        return chosen or max(pick, key=pop)
    return chosen or max(ids, key=pop)


# which upload each lot's Gallery pictures came from (19 Nov), so they're remade when the lead upload changes:
# {"<world>/<lot>": {"cover": id, "more": id}}, cover = site/gallery/<world>/<lot>.jpg, more = site/gallery-more/<world>/<lot>-<n>.jpg
def picture_sources(gallery_dir=GALLERY):
    p = os.path.join(gallery_dir, 'picture-sources.json')
    return load(p)['lots'] if os.path.exists(p) else {}


def save_picture_sources(lots, gallery_dir=GALLERY):
    save(os.path.join(gallery_dir, 'picture-sources.json'), {
        "_note": "Which Gallery upload each lot's pictures came from (tools/gallery_refresh.py add_covers: the cover; tools/gallery_more.py: "
                 "the other three), so they're remade when the lot's lead upload changes. Written by those tools; don't hand-edit.",
        "lots": dict(sorted(lots.items()))}, inline=())


def first_with_pictures(lot, uploads):
    """The upload covers were taken from before 19 Nov (the first linked upload with pictures): what a cover with no record came from."""
    return next((i for i in lot.get('gallery', []) if (uploads.get(i) or {}).get('images')), None)


def popular_or_chosen(lot, uploads):
    """The upload tools/gallery_more.py took the other three pictures from before 19 Nov (her chosen copy, else the most popular)."""
    ids = [i for i in lot.get('gallery', []) if i in uploads]
    if not ids: return None
    return lot['galleryLead'] if lot.get('galleryLead') in ids else max(ids, key=lambda i: uploads[i]['favourites'] + uploads[i]['downloads'])


def shown_name(name_fix, world, l):
    """A lot's name as the site shows it, from a built lot (data.js): her spelling (nameFix), then her Gallery title, then
    her own name unless it's just "?", then the in-game name. The same order as lotName() in site/js/app.js (15 Nov: one place)."""
    mine = (l.get('mine') or '').strip()
    return name_fix.get(f"{world}|{l['lot']}") or (l.get('gallery') or {}).get('title') or (mine if mine.strip('?') else None) or l['lot']


def nice_date(iso):
    """'2026-10-11' -> '11 Oct 2026' (how dates are shown on the site)."""
    d = date.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b')} {d.year}"


def world_files():
    """World data files in the order the worlds arrived (data/worlds.json)."""
    return [os.path.join(DATA, 'worlds', s + '.json') for s in load(os.path.join(DATA, 'worlds.json'))['order']]
