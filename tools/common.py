"""Shared helpers for the Sim World tools: paths, slugs, JSON in and out."""
import json, os, re, unicodedata
from datetime import date

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
    """Loose comparison key for names: letters and digits only."""
    return re.sub(r'[^a-z0-9]', '', (s or '').lower().replace('&', 'and').replace('é', 'e'))


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
    with open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text + '\n')


def nice_date(iso):
    """'2026-10-11' -> '11 Oct 2026' (how dates are shown on the site)."""
    d = date.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b')} {d.year}"


def world_files():
    """World data files in the order the worlds arrived (data/worlds.json)."""
    return [os.path.join(DATA, 'worlds', s + '.json') for s in load(os.path.join(DATA, 'worlds.json'))['order']]
