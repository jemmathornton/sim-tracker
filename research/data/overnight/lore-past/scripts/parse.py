import json,re
pages=json.load(open('fam/pages.json',encoding='utf8'))
def boxes(text):
    out=[]
    for m in re.finditer(r'\{\{\s*Infobox (family\d?|household\d?)',text,re.I):
        i=m.start(); depth=0; j=i
        while j<len(text):
            if text.startswith('{{',j): depth+=1; j+=2; continue
            if text.startswith('}}',j):
                depth-=1; j+=2
                if depth==0: break
                continue
            j+=1
        body=text[m.end():j-2]
        # split top-level pipes
        parts=[];d=0;cur=''
        k=0
        while k<len(body):
            if body.startswith('{{',k) or body.startswith('[[',k): d+=1; cur+=body[k:k+2]; k+=2; continue
            if body.startswith('}}',k) or body.startswith(']]',k): d-=1; cur+=body[k:k+2]; k+=2; continue
            if body[k]=='|' and d==0: parts.append(cur); cur=''; k+=1; continue
            cur+=body[k]; k+=1
        parts.append(cur)
        f={'_type':m.group(1)}
        for p in parts:
            if '=' in p:
                a,b=p.split('=',1); f[a.strip().lower()]=b.strip()
        out.append(f)
    return out
def clean(s):
    s=re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]',r'\1',s)
    s=re.sub(r'<br\s*/?>',', ',s); s=re.sub(r'<[^>]+>','',s)
    s=re.sub(r"'''?",'',s); s=re.sub(r'\{\{[^}]*\}\}','',s)
    return re.sub(r'\s+',' ',s).strip(' ,')
rows=[]
for t,v in pages.items():
    for b in boxes(v['text']):
        rows.append({'page':t,'game':clean(b.get('game','')),'neighbor':clean(b.get('neighbor','') or b.get('neighborhood','') or b.get('world','')),
          'members':clean(b.get('members','')),'play':clean(b.get('play','')),'lot':clean(b.get('lot','')),'caption':clean(b.get('caption','')),'name':clean(b.get('name','')),'connect':clean(b.get('connect',''))})
json.dump(rows,open('boxes.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
import collections
print(len(rows))
c=collections.Counter(r['game'] for r in rows)
for k,n in c.most_common(): print(n,k)
nob=[t for t,v in pages.items() if not boxes(v['text'])]
print('no box:',nob)
