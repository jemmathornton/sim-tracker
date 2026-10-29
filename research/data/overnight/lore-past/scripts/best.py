import json,re,unicodedata
from packs import missing
TITLES={'general','grand','marshal','mrs','miss','mr','mom','dr','captain','granny','ma','pappy','lady','sir','king','queen','big','lil'}
def norm(s):
    s=unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]','',s).strip()
def load():
    o=json.load(open('gal-results.json',encoding='utf8'))
    ic=json.load(open('item-cache.json',encoding='utf8'))
    try: ex=json.load(open('extra-cache.json',encoding='utf8'))['i']
    except Exception: ex={}
    return o,ic,ex
def strict(exp,members):
    gm=[(norm(m['first']),norm(m['last'])) for m in members]
    hit=0
    for e in exp:
        t=norm(e).split()
        if not t: continue
        last=t[-1] if len(t)>1 else ''
        firsts=[x for x in t[:-1] if x not in TITLES] or t[:1]
        ok=False
        for f,l in gm:
            fm=any(x==f or (len(x)>3 and f and (f.startswith(x) or x.startswith(f))) for x in firsts) or (len(f)>3 and f.replace(' ','') in ''.join(firsts))
            lm=(not last) or l==last or (last in l) or (l and l in last) or not l
            if fm and lm: ok=True;break
        hit+=ok
    return hit/len(exp) if exp else 0
def info(slug,ic,ex):
    it=ic.get(slug) or {}
    return {'name':it.get('name'),'creator':it.get('creator'),'dl':it.get('dl',0),'fav':it.get('fav',0),'miss':missing(it.get('packs',[])),
            'members':[f"{m['first']} {m['last']} ({m['age']})" for m in it.get('members',[])],'desc':it.get('desc','')}
def best(entry,ic,ex,minscore=None):
    exp=entry['expected']; n=len(exp)
    ms=minscore if minscore is not None else (0.75 if n>=3 else (0.5 if n==2 else 1.0))
    good=[]
    for r in entry['results']:
        it=ic.get(r['slug'])
        if not it or r['creator']=='Maxis': continue
        s=strict(exp,it['members'])
        if s>=ms: good.append((s,r))
    if not good: return None
    clean=[(s,r) for s,r in good if not missing((ic.get(r['slug']) or {}).get('packs',[]))]
    s,pick=max(clean or good,key=lambda x:(x[0]>=0.99, x[1]['dl']))
    i=info(pick['slug'],ic,ex); i['slug']=pick['slug']; i['score']=round(s,2); i['alts']=len(good)
    return i
def fmt(i):
    if not i: return 'nothing found'
    ms=i['miss']
    m=('; lacks '+(', '.join(ms) if len(ms)<=3 else ', '.join(ms[:3])+f' and {len(ms)-3} more')) if ms else ', nothing you lack'
    return f"\u201c{i['name']}\u201d by {i['creator']} ({i['dl']:,}{m})"
