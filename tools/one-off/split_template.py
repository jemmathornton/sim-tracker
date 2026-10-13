"""One-off (13 Oct 2026): split the chat's single-page template (old-chat-build/template.html) into the app's files.

site/index.html   the page skeleton
site/site.css     the styles (unchanged; kept next to index.html so picture paths in them work)
site/js/icons.js  Lucide icons (from old-chat-build/icons.json)
site/js/app.js    the page code (unchanged, except the data it used to carry now comes from js/data.js)
"""
import json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from common import path, SITE

if os.path.exists(os.path.join(SITE, 'js', 'app.js')): sys.exit('site/ has been edited since the split; this one-off would overwrite it.')

tpl = open(path('old-chat-build', 'template.html'), encoding='utf-8').read()
lines = tpl.split('\n')

# the claude.ai page wrapper's own defaults (margin 0, etc.), kept so the page looks the same
wrapper_css = re.search(r'<head>.*?<style>(.*?)</style></head>', lines[0]).group(1)
css = re.search(r'\n<style>\n(.*?)\n</style>\n', tpl, re.S).group(1)
body = re.search(r'</style>\n\n(<div class="topbar">.*?<main id="main">.*?</main>)\n', tpl, re.S).group(1)
script = re.search(r'\n<script>\n(.*?)\n</script>', tpl, re.S).group(1)

swap = {
    r'^// Icons from Lucide \(https://lucide.dev\), ISC licence\.\nconst ICONS = __ICONS__;\n': '',
    r'^const FAMILY_LINKS = .*;$': 'const FAMILY_LINKS = DATA.familyLinks;',
    r'^const TENANTS = .*;$': 'const TENANTS = DATA.tenants;',
    r'^const NAME_FIX = .*;$': 'const NAME_FIX = DATA.nameFix;',
    r'^const DATA = __DATA__;\n': '',
    r'^const NB_PT = .*;$': 'const NB_PT = DATA.nbPt;',
    r'^const CS_VERSIONS = .*;$': 'const CS_VERSIONS = DATA.csVersions;',
}
for pat, rep in swap.items():
    script, k = re.subn(pat, lambda m: rep, script, flags=re.M)
    assert k == 1, pat

os.makedirs(os.path.join(SITE, 'js'), exist_ok=True)
def write(p, text):
    with open(os.path.join(SITE, p), 'w', encoding='utf-8', newline='\n') as f: f.write(text)

write('site.css', "/* Jemma's Sim World: styles. */\n\n/* page defaults (as on the claude.ai page) */\n" + wrapper_css.replace('}', '}\n') + "\n" + css + "\n")
icons = json.load(open(path('old-chat-build', 'icons.json'), encoding='utf-8'))
write('js/icons.js', "// Icons from Lucide (https://lucide.dev), ISC licence.\nconst ICONS = " + json.dumps(icons, ensure_ascii=False, indent=1) + ";\n")
write('js/app.js', "// Jemma's Sim World: the page code. Everything is drawn from DATA (js/data.js, built by tools/build.py).\n" + script + "\n")
write('index.html', f"""<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Jemma's Sim World</title>
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="site.css">
</head>
<body>
{body}

<script src="js/icons.js"></script>
<script src="js/data.js"></script>
<script src="js/app.js"></script>
</body>
</html>
""")
print('wrote site/index.html, site.css, js/icons.js, js/app.js')
