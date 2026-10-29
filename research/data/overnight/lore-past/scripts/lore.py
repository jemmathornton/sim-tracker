import json,re,sys
pages=json.load(open('fam/pages.json',encoding='utf8'))
pages.update({k:v for k,v in json.load(open('C:/Users/Jemma/Documents/SimTracker/research/data/overnight/lore-past/pages.json',encoding='utf8')).items() if k not in pages})
def strip(t):
    # remove templates (nested) 
    out='';d=0;i=0
    while i<len(t):
        if t.startswith('{{',i): d+=1; i+=2; continue
        if t.startswith('}}',i) and d>0: d-=1; i+=2; continue
        if d==0: out+=t[i]
        i+=1
    t=out
    t=re.sub(r'<ref[^>]*/>','',t); t=re.sub(r'<ref.*?</ref>','',t,flags=re.S)
    t=re.sub(r'\[\[(File|Image|Category):[^\]]*(\[\[[^\]]*\]\][^\]]*)*\]\]','',t)
    t=re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]',r'\1',t)
    t=re.sub(r'\[https?://\S+ ([^\]]*)\]',r'\1',t)
    t=re.sub(r"'''?",'',t); t=re.sub(r'<[^>]+>','',t)
    t=re.sub(r'\{\|.*?\|\}','',t,flags=re.S)
    t=re.sub(r'\n{2,}','\n',t)
    return t.strip()
def sections(t):
    parts=re.split(r'\n(={2,4})\s*(.*?)\s*\1\s*\n','\n'+t)
    out=[('lead',parts[0])]
    for i in range(1,len(parts)-2,3): out.append((parts[i+1],parts[i+2]))
    return out
def show(title,games=None,maxc=1800):
    p=pages.get(title)
    if not p: print('!! missing',title); return
    print('#####',title)
    for h,body in sections(p['text']):
        if h.lower() in ('gallery','trivia','references','see also','notes','external links','behind the scenes'): continue
        if games and h!='lead' and not any(g.lower() in h.lower() for g in games): continue
        s=strip(body)
        if not s: continue
        print('['+h+']',s[:maxc].replace('\n',' '))
if __name__=='__main__':
    games=None; maxc=1800; titles=[]
    for a in sys.argv[1:]:
        if a.startswith('--g='): games=a[4:].split(',')
        elif a.startswith('--m='): maxc=int(a[4:])
        else: titles.append(a)
    for t in titles: show(t,games,maxc)
