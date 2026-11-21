"""Neighbourhood descriptions in the plan (`desc` in data/worlds/*.json, many carried over from the old chat build) against
the game's own English text, word for word (21 Nov). Report only: changes nothing in data/.

    python tools/research/hood_descriptions.py      read the game's string tables, write research/hood-descriptions-check.md

Each description is: a match (the game's text exactly, or differing only in straight/curly quotes, which her curly
apostrophe rule changes), a near-match (both shown, with the words that differ), or not found in the game.
"""
import difflib, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import ROOT, load, world_files, write_text

QUOTES = str.maketrans({'’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-'})


def typo(s):
    """Text as compared for a match: quotes and dashes straightened, spaces tidied."""
    return re.sub(r'\s+', ' ', (s or '').translate(QUOTES)).strip()


def words(s): return re.findall(r"[a-z0-9']+", typo(s).lower())


def differences(a, b):
    """The words that differ, as 'plan → game' pairs."""
    wa, wb = typo(a).split(), typo(b).split()
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, wa, wb, autojunk=False).get_opcodes():
        if op != 'equal': out.append(f"“{' '.join(wa[i1:i2]) or '(nothing)'}” → “{' '.join(wb[j1:j2]) or '(nothing)'}”")
    return out


def british_only(site, game):
    """True when the game's text, put into British spelling the way the build does it (build.british), is the site's text."""
    try:
        from build import british
    except Exception:
        return False
    return typo(british(game)) == typo(site)


def best_match(desc, texts, index):
    """(kind, game text) for a description: 'match', 'near' or (None, None)."""
    t = typo(desc)
    if t in texts: return 'match', texts[t]
    ws = set(words(desc))
    if not ws: return None, None
    # candidates: game strings sharing most of the description's words
    count = {}
    for w in ws:
        for k in index.get(w, ()): count[k] = count.get(k, 0) + 1
    cands = sorted(count, key=lambda k: -count[k])[:40]
    best, score = None, 0.0
    for k in cands:
        r = difflib.SequenceMatcher(None, t.lower(), k.lower(), autojunk=False).ratio()
        if r > score: best, score = k, r
    if best and score >= 0.6: return 'near', texts[best]
    return None, None


def check(hoods, strings):
    """hoods: [(world, neighbourhood, desc)]; strings: game texts. Returns {'match': [...], 'near': [...], 'none': [...]}."""
    texts = {}
    for s in strings:
        if 20 <= len(s) <= 600: texts.setdefault(typo(s), s)
    index = {}
    for k in texts:
        for w in set(words(k)):
            if len(w) > 3: index.setdefault(w, []).append(k)
    out = {'match': [], 'near': [], 'none': []}
    for w, h, d in hoods:
        kind, game = best_match(d, texts, index)
        if kind == 'match': out['match'].append((w, h, d, game))
        elif kind == 'near': out['near'].append((w, h, d, game))
        else: out['none'].append((w, h, d, None))
    return out


def report(res):
    n = sum(len(v) for v in res.values())
    lines = ["# Neighbourhood descriptions against the game's own text (21 Nov)", "",
             f"Every neighbourhood description on the site ({n}) compared word for word with the game's English text "
             "(tools/research/hood_descriptions.py). Nothing in data/ was changed: which wording to keep is Jemma's call.", "",
             f"- **Match the game:** {len(res['match'])}",
             f"- **Near-matches:** {len(res['near'])} (shown below with the game's wording)",
             f"- **Not found in the game:** {len(res['none'])}", ""]
    if res['near']:
        brit = [x for x in res['near'] if british_only(x[2], x[3])]
        lines += ["## Near-matches", "", f"{len(brit)} of them differ only in British spelling (the site's descriptions were put into "
                  "British spelling in the old chat build): " + ", ".join(f"{w} / {h}" for w, h, d, g in brit) + ".", ""]
        for w, h, d, g in res['near']:
            if (w, h, d, g) in brit: continue
            lines += [f"### {w} / {h}", "", f"- Site: {d}", f"- Game: {g}", f"- Differs: {'; '.join(differences(d, g))}", ""]
    if res['none']:
        lines += ["## Not found in the game", "", "No game text is close (these may be from the old chat build, or the game has none).", ""]
        for w, h, d, _ in res['none']: lines += [f"- **{w} / {h}:** {d}"]
        lines.append("")
    if res['match']:
        lines += ["## Match the game", ""] + [f"- {w} / {h}" + (" (quotes differ only)" if d != g else "") for w, h, d, g in res['match']] + [""]
    return "\n".join(lines)


def plan_hoods():
    out = []
    for p in world_files():
        W = load(p)
        for h in W['neighbourhoods']:
            if h.get('desc'): out.append((W['name'], h['name'], h['desc']))
    return out


if __name__ == '__main__':
    import sims4files as s4
    res = check(plan_hoods(), s4.english().values())
    write_text(os.path.join(ROOT, 'research', 'hood-descriptions-check.md'), report(res) + "\n")
    print(f"{len(res['match'])} match, {len(res['near'])} near, {len(res['none'])} not found: research/hood-descriptions-check.md")
