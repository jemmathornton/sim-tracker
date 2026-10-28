"""Pages from the Sims Wiki (sims.fandom.com) through its API (its web pages refuse scripted readers).
    python tools/research/wiki_fetch.py <folder> "Page title" ["Page title" ...]
Adds each page's wikitext to <folder>/pages.json ({title asked: {title, text}}); create the file as {} first.
Report only: reads the wiki, writes nothing else.
"""
import json,sys,time,urllib.request,urllib.parse
out=sys.argv[1]; titles=sys.argv[2:]
pages=json.load(open(out+'/pages.json',encoding='utf8'))
for i in range(0,len(titles),40):
  chunk=titles[i:i+40]
  q=urllib.parse.urlencode({'action':'query','prop':'revisions','rvprop':'content','rvslots':'main','titles':'|'.join(chunk),'redirects':1,'format':'json','formatversion':2})
  r=json.load(urllib.request.urlopen(urllib.request.Request('https://sims.fandom.com/api.php?'+q,headers={'User-Agent':'Mozilla/5.0 SimTracker research'})))
  red={x['from']:x['to'] for x in r['query'].get('redirects',[])}; norm={x['from']:x['to'] for x in r['query'].get('normalized',[])}
  got={p['title']:p['revisions'][0]['slots']['main']['content'] for p in r['query']['pages'] if 'revisions' in p}
  for t in chunk:
    tt=norm.get(t,t); tt=red.get(tt,tt)
    if tt in got: pages[t]={'title':tt,'text':got[tt]}
    else: print('missing',t)
json.dump(pages,open(out+'/pages.json','w',encoding='utf8'),ensure_ascii=False)
