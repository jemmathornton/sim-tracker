import json
from wapi import catmembers
roots=["Category:Families from The Sims","Category:Families from The Sims 2","Category:Families from The Sims 3",
"Category:Families from Life Stories","Category:Families from Pet Stories","Category:Families from Castaway Stories",
"Category:Families from The Sims Bustin' Out","Category:Families from The Sims (console)","Category:Families from The Sims 2: Pets (console)",
"Category:Families from The Sims 3 (console)","Category:Families from The Sims 3: Pets (console)","Category:Families from The Sims 3 (Nintendo DS)","Category:Families from The Sims 3 (Wii)"]
fam={}
seen=set()
def walk(cat,depth=0):
    if cat in seen: return
    seen.add(cat)
    for t in catmembers(cat):
        if t.startswith('Category:'):
            if depth<3: walk(t,depth+1)
        else:
            fam.setdefault(t,[]).append(cat.replace('Category:',''))
for r in roots: walk(r)
json.dump(fam,open('families-by-cat.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(fam)); print(sorted(seen))
