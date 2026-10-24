"""How far each of her own Sims is into their life stage, so brothers and sisters at the same stage show oldest first
(24 Oct, her ask: "siblings should go oldest to youngest"; Rosie, Alfie and Lucie Reynolds are all young adults).

    python tools/age_days.py           report (changes nothing)
    python tools/age_days.py --apply   write `ageDays` on each Sim in data/worlds/<world>.json, then rebuild

Read from the copy each Sim came from: the newest Library copy for households she has uploaded (`gallery`), otherwise
the save named in the Sim's `from`. Days into the stage only; a Sim aged by hand may not follow birth order.
Saves and Library files are read from temporary copies.
"""
import glob, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sims4files as s4
import library_update as LU
from common import ROOT, load, save

P = '.EA.Sims4.Persistence.'


def main(apply):
    S = LU.S; lib = LU.library(); saves = {}
    for p in os.listdir(s4.SAVES):
        if p.endswith('.save') and '--' not in p and 'ffffffff' not in p:
            try: saves.setdefault(s4.save_name(s4.read_save(os.path.join(s4.SAVES, p)), S)[0], p)
            except Exception: pass
    cache = {}
    def save_sims(name):
        if name not in cache:
            cache[name] = {}
            if name in saves:
                for fn, wt, v in s4.fields(s4.read_save(os.path.join(s4.SAVES, saves[name]))):
                    if fn == 6:
                        sm = s4.decode(v, P + 'SimData', S, depth=0)
                        cache[name].setdefault(f"{sm.get('first_name', '')} {sm.get('last_name', '')}".strip(), sm.get('age_progress'))
        return cache[name]
    n = 0
    for p in sorted(glob.glob(os.path.join(ROOT, 'data', 'worlds', '*.json'))):
        W = json.loads(open(p, 'rb').read().decode('utf-8')); touched = False
        for hn, h in (W.get('households') or {}).items():
            copy = lib.get(LU.norm(re.sub(r'\s+\d+$', '', hn))) if h.get('gallery') else None
            by = {f"{s.get('first_name', '')} {s.get('last_name', '')}".strip(): s.get('age_progress') for s in copy[1]} if copy else {}
            for sm in h.get('sims', []):
                d = by.get(sm['name'])
                if d is None:
                    m = re.match(r'save “([^”]+)”', sm.get('from') or '')
                    if m: d = save_sims(m.group(1)).get(sm['name'])
                if d is None: continue
                d = round(float(d), 1)
                if sm.get('ageDays') != d:
                    print(f"{W['name']} / {hn} / {sm['name']}: {sm.get('age')}, {d} days in"); sm['ageDays'] = d; touched = True; n += 1
        if apply and touched: save(p, W)
    print(f"{n} Sims" + ("" if apply else " (report only; --apply to write)"))
    if apply and n: subprocess.run([sys.executable, '-X', 'utf8', os.path.join(ROOT, 'tools', 'build.py')], check=True)


if __name__ == '__main__':
    main('--apply' in sys.argv)
