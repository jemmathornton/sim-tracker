import json,os,sys,re
from gal import search,item
from packs import missing
C='extra-cache.json'
cache=json.load(open(C,encoding='utf8')) if os.path.exists(C) else {'q':{},'i':{}}
qs=[l.strip() for l in open(sys.argv[1],encoding='utf8') if l.strip()]
for q in qs:
    if q not in cache['q']:
        d=search(q,extra='&orderBy=downloads')
        cache['q'][q]=[{'slug':i['slug'],'name':i['name'],'type':i['type'],'creator':i.get('creatorName'),'dl':i.get('downloadsCount',0)} for i in d.get('items',[])]
    hh=[i for i in cache['q'][q] if i['type']=='household'][:int(sys.argv[2]) if len(sys.argv)>2 else 6]
    print('##',q)
    for i in hh:
        if i['slug'] not in cache['i']:
            d=item(i['slug'])
            cache['i'][i['slug']]=None if not d else {'name':d['name'],'creator':(d.get('creator') or {}).get('username',''),'dl':d.get('downloadsCount',0),'fav':d.get('favouritesCount',0),'desc':(d.get('description') or '')[:300],
               'packs':[(p.get('packCode'),p.get('packType'),p.get('displayName')) for p in d.get('requiredPacks') or []],
               'members':[f"{m.get('firstName','')} {m.get('lastName','')} ({m.get('age')})" for m in (d.get('typeDetails') or {}).get('members',[])]}
        v=cache['i'][i['slug']]
        if not v: continue
        print(f"   dl{v['dl']} fav{v['fav']} '{v['name']}' by {v['creator']} | {', '.join(v['members'])} | miss:{','.join(missing(v['packs'])) or '-'} | {i['slug']}")
    json.dump(cache,open(C,'w',encoding='utf8'),ensure_ascii=False)
