"""Her Gallery upload helper (22 Oct, her ask): for-jemma/upload-helper.html, one page that opens straight from the folder.
Upload tips, a hashtag checker (paste a title and description before sharing), and her old uploads with tags to fix.
The checker knows her plan's worlds, neighbourhoods and lots, the game's lot traits and the packs on her uploads.
Rerun after the plan changes:  python -X utf8 tools/upload_helper.py
"""
import collections, html, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, DATA, load, world_files

key = lambda s: re.sub(r'[^a-z0-9]', '', (s or '').lower().replace('&', 'and'))
uploads = load(os.path.join(DATA, 'gallery', 'uploads.json'))['uploads']

worlds, lots = [], []
for p in world_files():
    W = load(p)
    hoods = [h['name'] for h in W['neighbourhoods'] if h['name'] != 'Secret Lots']
    worlds.append({'name': W['name'], 'tag': key(W['name']), 'hoods': [key(h.split(' / ')[0]) for h in hoods]})
    for h in W['neighbourhoods']:
        for l in h['lots']:
            names = [n for n in (l.get('displayName'), l.get('myName'), l['lot']) if n and n != '?']
            lots.append({'names': list(dict.fromkeys(names)), 'game': key(l['lot']), 'hood': key(h['name'].split(' / ')[0]) if h['name'] != 'Secret Lots' else '',
                         'world': key(W['name']), 'worldName': W['name'], 'type': l.get('type') or ''})

packs = sorted({key(re.sub(r'^The Sims(™)? 4 ', '', p)) for u in uploads.values() for p in u.get('packs') or []} - {''})
traits = sorted({key(t['name']) for t in load(os.path.join(DATA, 'game', 'lot-traits.json'))['traits'].values()})
used = collections.Counter(t.lower() for u in uploads.values() for t in re.findall(r'#(\w+)', u.get('description') or ''))
MISSPELT = {'winderburg', 'windenberg', 'britchester', 'universityofbritchester', 'jellyfishfunction', 'parchedpropsect', 'puertollamantemarketpace',
            'ecolifestye', 'reduceandrecyle', 'notsoerry', 'nder20000', 'moveobejctson', 'playertestd', 'playtersted', 'childsply', 'cityliviing'}
common = sorted(t for t, n in used.items() if n >= 3 and t not in MISSPELT)
known = sorted(set(common) | set(packs) | set(traits) | {w['tag'] for w in worlds} | {h for w in worlds for h in w['hoods']}
               | {key(n) for l in lots for n in l['names']} | {l['game'] for l in lots})
WORLD_ALSO = {'evergreenharbour': 'evergreenharbor', 'mtkomorebi': 'mtkomorebi', 'mountkomorebi': 'mtkomorebi', 'henford': 'henfordonbagley'}

# old uploads with tags to fix when she re-uploads (research/gallery-findability.md, 17 Oct)
FIX = [
    ('Cottage Am See', '#winderburg → #windenburg'), ('Coorinberg Cottage', '#windenberg → #windenburg'),
    ('Drake Hall, Wyvern Hall', '#britchester → #britechester, #universityofbritchester → #universityofbritechester'),
    ('Gibbi Rec Center', '#jellyfishfunction → #jellyfishjunction'), ('Vista Quarry Villa', '#parchedpropsect → #parchedprospect'),
    ('Selvadorada Villa', '#puertollamantemarketpace → #puertollamantemarketplace'), ('Fern Park Flats (both copies)', '#ecolifestye → #ecolifestyle'),
    ('Stonestreet Apartments 3 and 4', '#reduceandrecyle → #reduceandrecycle'), ('Mint Starter', '#notsoerry → #notsoberry, #nder20000 → #under20000'),
    ('Mid-Nowhere', '#moveobejctson → #moveobjectson'), ('Newcrest Community Makers', '#playertestd → #playertested'),
    ('De Costadas', '#playtersted (it has #playtested too, so just drop it)'), ('Sapphire Shores', '#childsply → #childsplay'),
    ('2B Jasmine Suites', '#cityliviing → #cityliving'),
    ('Izakaya Hanamigawa Koen', 'no world tag: add #mtkomorebi'), ('3 Olde Mill Lane', 'no world tag: add #henfordonbagley'),
    ('Town Square Stores', 'no world tag: add #copperdale'), ('122 Hakim House', 'no world tag: add #sanmyshuno'),
    ('Skye Fitness, The Magic Realm, 17 Culpepper House, Foxbury Court, Waterside Warble, 920 Medina Studios, Hindquarter Hideaway, Mossy Lane, Spring Steppes (both)', 'no world tag'),
    ('Glimmerbrook Watch', '#basegame, but it needs Realm of Magic'), ('Cantina “El Árbol del Jaguar”', '#basegame, but it needs Jungle Adventure'),
    ('Newcrest Arts Center', 'add the game’s lot name, #civiccliffs'),
]

TIPS = [
    ('The title is what name search reads.', 'Titles that say the place and what it is (Oasis Springs Library, Anchorpoint Rec Center) come up in the top five.'),
    ('Core hashtags first, extras after.', 'The description stops at 500 characters. Core: the lot’s name, the game’s lot name, its neighbourhood, its world, what it is (#library, #communityspace, #vacationrental…), #nocc, #playtested.'),
    ('Small, specific tags are where you can be near the top:', 'the neighbourhood and the game’s lot name. Busy ones (#library, #oasissprings) mostly help in the first days.'),
    ('Drop the rare twins:', '#playtested, #moo and #under20k are far busier than #playertested, #moveobjectson and #under20000.'),
    ('#cosy and #cozy reach different searches;', '#cozy is the busier one.'),
    ('#basegame only when no pack is needed;', 'a “packonly” tag (#seasonsonly) when just one pack is.'),
    ('Holiday lets: add #vacationrental.', 'The Gallery shows them as Residential.'),
    ('Set the lot type and bedrooms and bathrooms before saving.', 'That’s what the filters and the Gallery page show.'),
    ('Daytime picture, with the build in view.', 'Pause the game when the light is right, then save.'),
    ('Maxis picks', 'go to builds with no custom content that look right without move objects.'),
]

data = {'known': known, 'packs': packs, 'worlds': worlds, 'worldAlso': WORLD_ALSO, 'lots': lots,
        'twins': {'playertested': 'playtested', 'moveobjectson': 'moo', 'under20000': 'under20k'}}

page = f'''<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Upload helper</title>
<style>
:root{{--paper:#F4F1EA;--surface:#fff;--ink:#22262A;--muted:#667;--line:#E2DDD2;--brass:#B8862C;--ok:#2E7D4F;--warn:#A4581F}}
@media (prefers-color-scheme: dark){{:root{{--paper:#101412;--surface:#181D1A;--ink:#E9EEEA;--muted:#A3AEA7;--line:#29312D;--ok:#5CC48A;--warn:#E3A060}}}}
body{{margin:0;background:var(--paper);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}}
main{{max-width:1080px;margin:0 auto;padding:32px 20px 60px}}
h1{{font:600 30px Georgia,serif;margin:0 0 4px}} h2{{font:600 21px Georgia,serif;margin:0 0 12px}}
.sub{{color:var(--muted);margin:0 0 26px}}
.grid{{display:grid;grid-template-columns:1.25fr 1fr;gap:22px;align-items:start}}
section{{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin-bottom:22px}}
label{{display:block;font-weight:600;font-size:13px;margin:10px 0 4px}}
input,textarea{{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:9px;padding:9px 11px;font:inherit;background:var(--paper);color:var(--ink)}}
textarea{{min-height:190px;resize:vertical}}
.count{{font-size:13px;color:var(--muted);margin-top:4px}} .count.over{{color:var(--warn);font-weight:600}}
ul.res{{list-style:none;padding:0;margin:14px 0 0}} ul.res li{{padding:7px 0 7px 26px;border-top:1px solid var(--line);position:relative;font-size:14px}}
ul.res li::before{{position:absolute;left:4px;top:7px;font-weight:700}}
li.warn::before{{content:"!";color:var(--warn)}} li.ok::before{{content:"✓";color:var(--ok)}} li.tip::before{{content:"·";color:var(--brass)}}
code{{font:13px ui-monospace,Consolas,monospace;background:var(--paper);padding:1px 5px;border-radius:5px}}
ol.tips{{margin:0;padding-left:20px}} ol.tips li{{margin:0 0 9px;font-size:14px}}
table{{border-collapse:collapse;width:100%;font-size:14px}} td{{padding:7px 8px;border-top:1px solid var(--line);vertical-align:top}} td:first-child{{font-weight:600;width:42%}}
@media (max-width:820px){{.grid{{grid-template-columns:1fr}}}}
</style></head><body><main>
<h1>Upload helper</h1>
<p class="sub">Paste a build’s title and description before you share it on the Gallery. Nothing is sent anywhere: it all runs on this page.</p>
<div class="grid">
<section><h2>Check a description</h2>
<label for="t">Title</label><input id="t" placeholder="e.g. Oasis Springs Library">
<label for="d">Description and hashtags</label><textarea id="d" placeholder="Paste the whole description here, hashtags included"></textarea>
<div class="count" id="c">0 of 500 characters</div>
<ul class="res" id="r"></ul></section>
<section><h2>Tips</h2><ol class="tips">{''.join(f'<li><b>{html.escape(a)}</b> {html.escape(b)}</li>' for a, b in TIPS)}</ol></section>
</div>
<section><h2>Old uploads with tags to fix</h2><p class="sub" style="margin-bottom:10px">Uploads can’t be edited, so these are only worth fixing when you re-upload the build anyway.</p>
<table>{''.join(f'<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td></tr>' for a, b in FIX)}</table></section>
</main>
<script>
const D = {json.dumps(data, ensure_ascii=False)};
const K = new Set(D.known), key = s => (s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
function dist(a, b){{ if (Math.abs(a.length - b.length) > 2) return 9; const m = Array.from({{length: a.length + 1}}, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return m[a.length][b.length]; }}
const near = t => {{ if (t.length < 6 || K.has(t)) return null; let best = null, bd = 3; for (const k of K) {{ const d = dist(t, k); if (d < bd && d <= (t.length > 9 ? 2 : 1)) {{ bd = d; best = k; }} }} return best; }};
function check(){{
  const title = document.getElementById("t").value, desc = document.getElementById("d").value, out = [];
  const c = document.getElementById("c"), n = [...desc].length;
  c.textContent = n + " of 500 characters" + (n > 500 ? ": the Gallery stops at 500, so the end will be cut" : n > 470 ? ": nearly full" : ""); c.className = "count" + (n > 500 ? " over" : "");
  const tags = [...desc.matchAll(/#(\\w+)/g)].map(m => m[1].toLowerCase());
  if (!desc.trim()) {{ document.getElementById("r").innerHTML = ""; return; }}
  if (!tags.length) out.push(["warn", "No hashtags yet."]);
  const dup = tags.filter((t, i) => tags.indexOf(t) !== i); if (dup.length) out.push(["warn", "Used twice: " + [...new Set(dup)].map(t => "<code>#" + t + "</code>").join(", ")]);
  if (n > 500) {{ let cut = [...desc].slice(0, 500).join(""), lost = tags.filter(t => !cut.toLowerCase().includes("#" + t)); if (lost.length) out.push(["warn", "Cut off at 500 characters: " + lost.map(t => "<code>#" + t + "</code>").join(", ")]); }}
  for (const t of new Set(tags)) {{ const k = near(t); if (k) out.push(["warn", `<code>#${{t}}</code>: did you mean <code>#${{k}}</code>?`]); }}
  for (const [rare, busy] of Object.entries(D.twins)) if (tags.includes(rare)) out.push(["tip", `<code>#${{rare}}</code> is rarely searched; <code>#${{busy}}</code> is much busier${{tags.includes(busy) ? ", and you have it already, so this one can go" : ""}}.`]);
  const wtags = new Set([...D.worlds.map(w => w.tag), ...Object.keys(D.worldAlso)]);
  // which lot is this? her title against her plan's names
  const tk = key(title), lot = tk ? D.lots.find(l => l.names.some(nm => key(nm) === tk)) || D.lots.find(l => l.names.some(nm => key(nm).length > 5 && tk.includes(key(nm)))) : null;
  if (lot) {{
    out.push(["ok", `Looks like <b>${{lot.names[0]}}</b> (${{lot.worldName}}${{lot.type ? ", " + lot.type : ""}}).`]);
    const want = [[lot.world, "its world"], [lot.hood, "its neighbourhood"], [lot.game, "the game’s lot name"]].filter(([t]) => t && !tags.includes(t) && !(t === lot.world && tags.some(x => D.worldAlso[x] === t)));
    if (want.length) out.push(["warn", "Missing core tags: " + want.map(([t, w]) => `<code>#${{t}}</code> (${{w}})`).join(", ")]);
    if (/vacation rental/i.test(lot.type) && !tags.includes("vacationrental")) out.push(["tip", "A holiday let: add <code>#vacationrental</code> (the Gallery shows it as Residential)."]);
  }} else if (!tags.some(t => wtags.has(t))) out.push(["warn", "No world tag (e.g. <code>#oasissprings</code>)."]);
  if (tags.some(t => t === "basegame" || t === "basegameonly")) {{ const p = tags.filter(t => D.packs.includes(t)); if (p.length) out.push(["warn", `<code>#basegame</code>, but also pack tags: ${{p.map(t => "<code>#" + t + "</code>").join(", ")}}. Check it really needs no packs.`]); }}
  if (tags.includes("cosy") && !tags.includes("cozy")) out.push(["tip", "<code>#cozy</code> is busier than <code>#cosy</code>; both reach more searches."]);
  if (!tags.includes("nocc") && tags.length) out.push(["tip", "No <code>#nocc</code>: add it if the build has no custom content."]);
  if (!out.some(([k]) => k === "warn")) out.unshift(["ok", "No problems found."]);
  document.getElementById("r").innerHTML = out.map(([k, s]) => `<li class="${{k}}">${{s}}</li>`).join("");
}}
document.getElementById("t").addEventListener("input", check); document.getElementById("d").addEventListener("input", check);
</script></body></html>'''
out = os.path.join(ROOT, 'for-jemma', 'upload-helper.html')
open(out, 'w', encoding='utf-8').write(page)
print(f"Wrote {out}: {len(known)} known tags, {len(lots)} lots, {len(packs)} packs")
