import json,sys,time,urllib.request,urllib.parse
UA={'User-Agent':'Mozilla/5.0 SimTracker research (JemmasSimWorld personal site)'}
def q(**params):
    params.setdefault('format','json'); params.setdefault('formatversion',2)
    url='https://sims.fandom.com/api.php?'+urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            r=json.load(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60))
            time.sleep(0.3); return r
        except Exception as e:
            print('retry',e,file=sys.stderr); time.sleep(3)
    raise SystemExit('failed '+url)
def catmembers(cat,ns=None):
    out=[];cont={}
    while True:
        p=dict(action='query',list='categorymembers',cmtitle=cat,cmlimit=500,**cont)
        if ns is not None: p['cmnamespace']=ns
        r=q(**p)
        out+= [m['title'] for m in r['query']['categorymembers']]
        if 'continue' in r: cont={'cmcontinue':r['continue']['cmcontinue']}
        else: return out
def search(text,limit=50):
    r=q(action='query',list='search',srsearch=text,srlimit=limit)
    return [x['title'] for x in r['query']['search']]
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='cat':
        for t in catmembers(sys.argv[2]): print(t)
    elif cmd=='search':
        for t in search(' '.join(sys.argv[2:])): print(t)
    elif cmd=='subcats':
        for t in catmembers(sys.argv[2],ns=14): print(t)
