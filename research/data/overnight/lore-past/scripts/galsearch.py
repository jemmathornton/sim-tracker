import json,re,os,sys,time,unicodedata
from gal import search,item
rows=json.load(open('boxes.json',encoding='utf8'))
SC='search-cache.json'; IC='item-cache.json'
scache=json.load(open(SC,encoding='utf8')) if os.path.exists(SC) else {}
icache=json.load(open(IC,encoding='utf8')) if os.path.exists(IC) else {}
def save():
    json.dump(scache,open(SC,'w',encoding='utf8'),ensure_ascii=False)
    json.dump(icache,open(IC,'w',encoding='utf8'),ensure_ascii=False)
def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]','',s).strip()
TITLES={'general','grand','marshal','mrs','miss','mr','mom','dr','captain','granny','ma','pappy','lady','sir','king','queen'}
def gamenum(g):
    if g.startswith('The Sims 3'): return '3'
    if g.startswith('The Sims 2'): return '2'
    if 'Stories' in g: return 'stories'
    return '1'
def surname_of(page):
    s=re.sub(r'\s*\(.*\)','',page); s=re.sub(r'\s+(family|household|Family)$','',s).strip()
    return s
def members(r):
    out=[]
    for m in r['members'].split(','):
        m=m.strip()
        if not m or m.lower().startswith('unborn') or m.isdigit(): continue
        out.append(m)
    return out
def qrun(q):
    if q in scache: return scache[q]
    d=search(q,extra='&orderBy=downloads')
    its=[{'slug':i['slug'],'name':i['name'],'type':i['type'],'creator':i.get('creatorName'),'dl':i.get('downloadsCount',0),'fav':i.get('favouritesCount',0)} for i in d.get('items',[])]
    scache[q]=its; return its
def details(slug):
    if slug in icache: return icache[slug]
    d=item(slug)
    if not d: icache[slug]=None; return None
    mem=[{'first':m.get('firstName',''),'last':m.get('lastName',''),'age':m.get('age')} for m in (d.get('typeDetails') or {}).get('members',[])]
    icache[slug]={'name':d['name'],'desc':(d.get('description') or '')[:400],'creator':(d.get('creator') or {}).get('username',''),'dl':d.get('downloadsCount',0),'fav':d.get('favouritesCount',0),
       'packs':[(p.get('packCode'),p.get('packType'),p.get('displayName')) for p in d.get('requiredPacks') or []],'members':mem}
    return icache[slug]
def score(exp,cand):
    gm=[(norm(m['first']),norm(m['last'])) for m in cand['members']]
    hit=0
    for e in exp:
        toks=norm(e).split()
        if len(toks)>1: first=[t for t in toks[:-1] if t not in TITLES] or toks[:-1]; last=toks[-1]
        else: first=toks; last=''
        ok=False
        for f,l in gm:
            if any(t and (t==f or (len(t)>3 and (f.startswith(t) or t.startswith(f)) and f)) for t in first) or (f and f in ' '.join(toks)):
                ok=True;break
        hit+=ok
    return hit/len(exp) if exp else 0
places_skip={'','Tutorial','Pets','Weather','Hobbies','Magic','GPE8_Future','SWE7UniversityTest','Exotic Destinations'}
out={}
todo=[r for r in rows if not r['game'].startswith('The Sims 4')]
only=sys.argv[1:]  # optional filter of page names
for n,r in enumerate(todo):
    key=r['page']+' | '+r['game']+' | '+r['neighbor']
    if only and r['page'] not in only: continue
    exp=members(r)
    sur=surname_of(r['page']); g=gamenum(r['game'])
    ishh='household' in r['page'] or not exp or any(sur.lower() not in m.lower() for m in exp[:1])
    qs=[]
    if 'household' in r['page']:
        if exp: qs.append(exp[0]); 
        if len(exp)>1: qs.append(exp[1])
        qs.append(sur+' '+r['neighbor'] if r['neighbor'] not in places_skip else sur)
    else:
        qs.append(sur+' family')
        if r['neighbor'] not in places_skip: qs.append(sur+' '+r['neighbor'].replace('Downtown (The Sims 2)','Downtown'))
        if g in '123': qs.append(sur+' sims '+g)
    cands={}
    for q in qs:
        for it in qrun(q):
            if it['type']!='household': continue
            nm=norm(it['name'])
            if norm(sur) in nm or any(norm(e).split()[0] in nm for e in exp if norm(e)) or 'household' in r['page']:
                cands[it['slug']]=it
    top=sorted(cands.values(),key=lambda x:-x['dl'])[:8]
    res=[]
    for it in top:
        d=details(it['slug'])
        if not d: continue
        s=score(exp,d)
        res.append({'slug':it['slug'],'name':d['name'],'creator':d['creator'],'dl':d['dl'],'fav':d['fav'],'score':round(s,2),
                    'members':[f"{m['first']} {m['last']} ({m['age']})" for m in d['members']],'packs':[p[2] for p in d['packs']]})
    res.sort(key=lambda x:(-x['score'],-x['dl']))
    out[key]={'page':r['page'],'game':r['game'],'neighbor':r['neighbor'],'expected':exp,'queries':qs,'results':res}
    if n%10==0:
        save(); json.dump(out,open('gal-results.json','w',encoding='utf8'),ensure_ascii=False,indent=0); print(n,len(todo),key,flush=True)
save(); json.dump(out,open('gal-results.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print('done',len(out))
