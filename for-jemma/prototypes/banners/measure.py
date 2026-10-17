"""Prototype, 17 Oct: measures the text contrast on the banners in index.html and writes measured.js.

How: Chrome (headless, its own throwaway profile) draws each subject's five banners at 1280 wide and 2x (her 200% screen),
three times: as they are, with the measured text hidden (shadows kept), and with that text in magenta (to find the letters).
For each piece of text it takes the background right behind and around the letters, and keeps the faintest tenth:
the number shown is the contrast that 90% of the background beats. Changes nothing outside this folder and the temp folder.

Run:  python -X utf8 measure.py                 (all subjects, writes measured.js)
      python -X utf8 measure.py n:<hood-id> ... --out file.json   (any world "w:<id>" or neighbourhood "n:<id>", Now only)
"""
import json, os, re, subprocess, sys, tempfile, time
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
PAGE = (HERE / "index.html").as_uri()
CHROME = next(p for p in [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                          r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"] if os.path.exists(p))
SUBJECTS = ["mt-komorebi", "sulani", "oasis-springs", "britechester", "san-myshuno", "glimmerbrook", "yukimatsu", "crawdad-quarter"]
RULE = {"pack": 4.5, "tw": 3, "tb": 3, "desc": 4.5}
TMP = Path(tempfile.gettempdir()) / "banner-measure"
TMP.mkdir(exist_ok=True)
PROFILE = TMP / "profile"


def chrome(url, *extra, height=3400):
    args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
            f"--user-data-dir={PROFILE}", "--force-device-scale-factor=2", f"--window-size=1280,{height}",
            "--virtual-time-budget=20000", "--run-all-compositor-stages-before-draw", *extra, url]
    return subprocess.run(args, capture_output=True, text=True, encoding="utf8", timeout=180)


def rects_for(key):
    out = chrome(f"{PAGE}?measure={key}", "--dump-dom").stdout
    m = re.search(r'<script type="application/json" id="rects">(.*?)</script>', out, re.S)
    if not m:
        sys.exit(f"No measurements came back for {key}")
    return json.loads(m.group(1).replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">"))


def shot(key, mode, height):
    path = TMP / f"{key.replace(':', '_')}-{mode}.png"
    flag = {"full": "", "hide": "&hide=1", "mark": "&mark=1"}[mode]
    if path.exists():
        path.unlink()
    chrome(f"{PAGE}?measure={key}{flag}", f"--screenshot={path}", height=height)
    for _ in range(50):
        if path.exists():
            break
        time.sleep(.1)
    return np.asarray(Image.open(path).convert("RGB")).astype(np.float32)


def parse_colour(c):
    n = [float(v) for v in re.findall(r"[\d.]+", c)]
    if c.startswith("color("):          # color(srgb r g b / a), 0..1
        rgb, a = [v * 255 for v in n[:3]], (n[3] if len(n) > 3 else 1)
    else:                               # rgb(r, g, b) or rgba(r, g, b, a)
        rgb, a = n[:3], (n[3] if len(n) > 3 else 1)
    return np.array(rgb, np.float32), a


def lum(rgb):
    c = rgb / 255
    c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)
    return c @ np.array([.2126, .7152, .0722], np.float32)


def dilate(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dx * dx + dy * dy <= r * r:
                out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def measure(key, opts=None):
    info = rects_for(key)
    if not info["fonts"]:
        print(f"  warning: web fonts didn't load for {key}")
    if info["innerHeight"] != 800:
        print(f"  warning: window height {info['innerHeight']}, not 800")
    height = int(max(b["box"][1] + b["box"][3] for b in info["banners"])) + 20
    hide, mark = shot(key, "hide", height), shot(key, "mark", height)
    shot(key, "full", height)
    dpr = info["dpr"]
    glyph_all = np.abs(mark - hide).max(axis=2) > 60
    res = {}
    for b in info["banners"]:
        if opts and b["opt"] not in opts:
            continue
        r = {}
        for part, t in b["targets"].items():
            box = np.zeros(glyph_all.shape, bool)
            for x, y, w, h in t["rects"]:
                x0, y0 = int(x * dpr) - 2, int(y * dpr) - 2
                box[max(0, y0):int((y + h) * dpr) + 2, max(0, x0):int((x + w) * dpr) + 2] = True
            g = glyph_all & box
            if g.sum() < 20:
                continue
            region = dilate(g, 3) & dilate(box, 3)
            bg = hide[region]
            col, a = parse_colour(t["color"])
            fg = a * col + (1 - a) * bg
            lf, lb = lum(fg), lum(bg)
            ratio = (np.maximum(lf, lb) + .05) / (np.minimum(lf, lb) + .05)
            r[part] = round(float(np.percentile(ratio, 10)), 1)
        res[b["opt"]] = r
    return res


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else None
    if out:
        args = [a for a in args if a != out]
    keys = args or SUBJECTS
    data = {}
    for k in keys:
        print("measuring", k)
        data[k] = measure(k, None if not out else ["now"])
        print("  ", data[k])
    if out:
        Path(out).write_text(json.dumps(data, indent=1), encoding="utf8")
        return
    note = ("Measured with measure.py on 17 Oct: Chrome drew each banner at 1280 wide on a 200% screen, once with the text hidden; "
            "each number is the contrast that nine tenths of the background right behind the letters reaches.")
    js = "// Made by measure.py (17 Oct). Don't edit: run it again.\nwindow.MEASURED = " + json.dumps(
        {"made": "17 Oct 2026", "note": note, "rule": RULE, "subjects": data}, indent=1, ensure_ascii=False) + ";\n"
    (HERE / "measured.js").write_text(js, encoding="utf8")
    print("wrote measured.js")


if __name__ == "__main__":
    main()
