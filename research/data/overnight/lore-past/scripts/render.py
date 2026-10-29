import json,re,sys
from best import load,best,fmt
from s3notes import N as S3
o,ic,ex=load()
rows=json.load(open('boxes.json',encoding='utf8'))
notes={}
for f in ['notes-store.json','notes-other.json']: notes.update(json.load(open(f,encoding='utf8')))

def curly(s):
    s=re.sub(r"(\w)'(\w)", r"\1’\2", s)
    s=re.sub(r"(^|[\s(\[])'", r"\1‘", s)
    return s.replace("'", "’")
def who(members,sur=''):
    out=[];baby=False
    for m in members.split(','):
        m=m.strip()
        if not m: continue
        if m.lower().startswith('unborn'): baby=True; continue
        if sur and m.endswith(' '+sur) and len(m.split())>1: m=m[:-len(sur)-1]
        out.append(m)
    s=', '.join(out)
    return s+(' (+ baby due)' if baby else '')
def entry_for(r):
    return o.get(r['key'])
def gal(r):
    e=entry_for(r)
    if not e: return 'not searched'
    return fmt(best(e,ic,ex))

V_STORE={
("Broke family","Flat Broke"):"Skip (Skip is a teen here; Flat and Flo could join your tree as his parents)",
("Newbie family","Robert Newbie"):"Skip: Bob is a child here",
("Simovitch family","Vadim Simovitch"):"Skip: Betty Newbie's parents, a younger timeline",
("Lothario family","Don Lothario"):"Already in your plan",
("Pleasant family","Daniel Pleasant"):"Already in your plan (Maxis's older versions)",
("Caliente family","Dina Caliente"):"Already in your plan (Dina and Nina)",
("Burb family","John Burb"):"Skip: take the Sims 2 Burbs instead",
("Dreamer family","Darren Dreamer"):"Skip: Darren is late in the Sims 4 tree",
("Matlapin family","Omar Matlapin"):"Skip: Darleen is late in the Sims 4 tree",
("Specter family","Olive Specter"):"Skip: you have EA's Olive and Nyon",
("Beaker family","Bjorn Beaker"):"Skip (Bjorn and Gundrun only if you want Loki's parents)",
("Monty family","Patrizio Monty"):"Skip: a younger version of your recreated Montys",
("Monty family","Valentine Monty"):"Skip, or late ancestors on your Monty tree",
("Pantalone family","Vincentio Pantalone"):"Skip, or late ancestors (Isabella Monty's parents)",
("Capp family","Octavius Capp"):"Skip: only a grave",
("Capp family","Consort Capp"):"Skip: Consort is a ghost in the Sims 4",
("Thebe family","Hector Thebe"):"Skip, or late ancestors (Consort Capp's parents)",
("Alto family","Bert Alto"):"Skip: Bert is late in the Sims 4 tree (Enzo's father)",
("Alto family","Griffin Alto"):"Maybe → Sulani, with the Wahines (an Alto dynasty link)",
("Wahine family","Leo Wahine"):"Maybe → Sulani, with Griffin Alto",
("Kahale family","Kai Kahale"):"Maybe → Sulani",
("Goldbeard family","Eleanor Goldbeard"):"Maybe → Ondarion, with the Inkbeards",
("Inkbeard family","Shorty-John Inkbeard"):"Maybe → Ondarion, with the Goldbeards",
("Vanderburg family","Renauld Vanderburg"):"Maybe → Ondarion (a royal family)",
("Pertridge family","Lonnie Pertridge"):"Maybe → Ondarion, with the Vanderburgs",
("Mithrilen family","Fintan Mithrilen"):"Skip for now (Innisgreen later)",
("O'Connell family","Seamus O'Connell"):"Skip for now (Innisgreen later)",
}
V_OTHER={
("Landgraab family","Malcolm Landgrabb"):"Maybe: Mimi and Dudley only → San Myshuno",
("Whitt family","Alice Whitt"):"Maybe → Brindleton Bay (Best in Show cast)",
("Jones family (Garden Heights)","Thomas Jones"):"Maybe → Brindleton Bay, with Alice Whitt",
("DeBore family","Diana DeBore"):"Maybe → Brindleton Bay, as the villain",
("Loyal family","Stephen Loyal"):"Maybe → Brindleton Bay (Midnight Masquerade cast)",
("Loyal family","Diva Loyal"):"With Stephen Loyal",
("Davis family (Mesa Flats)","Erin Davis"):"Maybe → Brindleton Bay, with Stephen Loyal",
("Bachelor family","Michael Bachelor"):"See The Sims (Michael Bachelor)",
("Newbie family","Bob Newbie"):"See The Sims (Maxis's Newbies)",
("Pleasant family","Jeff Pleasant"):"See The Sims (Jeff and Diane)",
("Goth family","Mortimer Goth"):"Already in your plan",
("Roomies household (The Sims)","Chris Roomies"):"Skip",
}

GAL_OVR={
("Whitt family","Alice Whitt"):"“Pet Stories - ALice Whitt” by Azarseth666 (67, nothing you lack)",
("Loyal family","Stephen Loyal"):"“Stephen and Diva Loyal” by Azarseth666 (18, nothing you lack)",
("Loyal family","Diva Loyal"):"in “Stephen and Diva Loyal” (above)",
("Landgraab family","Malcolm Landgrabb"):"Maxis’s “The Landgraab Family” (37,023; lists Vampires); “Mimi & Dudley Landgraab” by bloodycrumpet87 (267, nothing you lack)",
("Goth family","Samuel Goth"):"“Samuel Goth and Family” by Jana520 (83, nothing you lack; adds Lolita)",
("Alto family","Griffin Alto"):"“Griffin Alto” by Minty1992 (160, nothing you lack)",
("Alto family","Alfonso Alto"):"“Alfonso Alto” by Katz013 (116; lacks My Wedding Stories, Werewolves) or “Alto Family (TS3) ♥” by MidnightNixx (1,263; lacks three kits)",
("Martinez family","Pablo Martinez"):"– (EA’s own)",
("Curious family","Marshall Curious"):"nothing found (Notzo alone: “Notzo Curious” by HolesimContent, 59)",
}

def table(rs,vfun,story):
    out=['| Household | Who | Story | Sims 4 Gallery (community) | Verdict |','|---|---|---|---|---|']
    for r in rs:
        k=(r['page'],(r['members'].split(',')[0].strip()))
        st,v=story(r,k),vfun(r,k)
        name=re.sub(r'\s*\((?:family bin|[^)]*)\)$','',r['page']) if 'household' not in r['page'] else r['page']
        name=name.replace(' family','').replace(' Family','')
        sur=name if 'household' not in name else ''
        g=GAL_OVR.get(k) or ('–' if v.startswith('Already') or v.startswith('See') or v.startswith('With') else gal(r))
        out.append(f"| {curly(name)} | {curly(who(r['members'],sur))} | {curly(st)} | {g} | {curly(v)} |")
    return '\n'.join(out)

def s3story(r,k):
    return S3.get(k,('',''))[0] or (notes.get(r['key'],{}).get('note',''))
def s3verdict(r,k):
    return S3.get(k,('','Skip'))[1]
def nstory(r,k):
    n=notes.get(r['key'],{})
    s=n.get('note','')
    if n.get('link') and not n['link'].lower().startswith('possibly'): s+=' *Link:* '+n['link']
    if n.get('occult'): s+=' ('+n['occult']+')'
    return s
def vstore(r,k): return V_STORE.get(k,'Skip')
def vother(r,k): return V_OTHER.get(k,'Skip')

def pick(game=None,games=None,nb=None,exclude=()):
    out=[]
    for r in rows:
        if r['page'] in exclude: continue
        if games and r['game'] not in games: continue
        if game and r['game']!=game: continue
        if nb is not None and r['neighbor']!=nb: continue
        out.append(r)
    out.sort(key=lambda r:(0 if not S3.get((r['page'],r['members'].split(',')[0].strip()),('','Skip'))[1].startswith('Skip') else 1, r['page']))
    return out

def vsort(rs,vf):
    order=lambda v:(0 if v.startswith('Already') else 1 if v.startswith('Maybe') else 2 if v.startswith('With') or v.startswith('See') else 3)
    return sorted(rs,key=lambda r:(order(vf(r,(r['page'],r['members'].split(',')[0].strip()))),r['page']))

S=[]
def sec(title,intro,rs,vf,st):
    S.append(f"### {title}\n{intro}\n\n"+table(vsort(rs,vf),vf,st)+"\n")

S3G=('The Sims 3','The Sims 3: Ambitions','The Sims 3: Late Night','The Sims 3 Late Night','The Sims 3: Pets','The Sims 3: Supernatural','The Sims 3: Showtime','The Sims 3: Island Paradise')
sec('Sunset Valley (base game)',"The Sims 3 is set before the Sims 2, so these are the Goths, Landgraabs, Altos and Bachelors a generation or two earlier. Everyone else is new. Sims 4 echo: Willow Creek (the Goths) and Oasis Springs (the Landgraabs); as a quiet suburb, Willow Creek or San Sequoia suits the rest, if homes free up.",
    [r for r in rows if r['game']=='The Sims 3' and r['neighbor']=='Sunset Valley' and r['page'] not in ('French family','McIrish family')],s3verdict,s3story)
sec('Twinbrook (Ambitions)',"A swampy town of career families. Its one lore family is the Curious ancestors. Sims 4 echo: Willow Creek's bayou feel; Evergreen Harbor for the eco family.",
    [r for r in rows if r['neighbor']=='Twinbrook'],s3verdict,s3story)
sec('Bridgeport (Late Night)',"A big city of celebrities and vampires. Vampires need the Vampires pack, which you don't own. Sims 4 echo: San Myshuno and Del Sol Valley.",
    [r for r in rows if r['neighbor']=='Bridgeport'],s3verdict,s3story)
sec('Appaloosa Plains (Pets)',"A Midwest ranch town of horses, cats and dogs. Sims 4 echo: Chestnut Ridge (Horse Ranch) for the horse families, Brindleton Bay (Cats & Dogs) for the dog people.",
    [r for r in rows if r['neighbor']=='Appaloosa Plains'],s3verdict,s3story)
sec('Moonlight Falls (Supernatural)',"Witches, werewolves, vampires, fairies and ghosts. You own Realm of Magic and Life & Death, so witches (Glimmerbrook) and ghosts (Ravenwood) work; werewolves, vampires and fairies need packs you don't have.",
    [r for r in rows if r['neighbor']=='Moonlight Falls'],s3verdict,s3story)
sec('Starlight Shores (Showtime)',"A showbiz town. Sims 4 echo: Del Sol Valley.",
    [r for r in rows if r['neighbor']=='Starlight Shores'],s3verdict,s3story)
sec('Isla Paradiso (Island Paradise)',"A tropical resort island with houseboats and mermaids. Sims 4 echo: Sulani. Its Altos are probably kin of the Sunset Valley Altos (the wiki's guess), which ties them to Enzo's dynasty in Ondarion.",
    [r for r in rows if r['neighbor']=='Isla Paradiso'],s3verdict,s3story)
sec('Family bin (base game)',"Households with no town.",
    [r for r in rows if r['game']=='The Sims 3' and not r['neighbor']],s3verdict,s3story)
S3TEXT='\n'.join(S); S.clear()

def nsec(title,intro,rs,vf):
    S.append(f"### {title}\n{intro}\n\n"+table(vsort(rs,vf),vf,lambda r,k:nstory(r,k))+"\n")
nsec('Sims University (University Life)',"Unplayable students and townies. **Skip.**",[r for r in rows if r['neighbor']=='Sims University' or r['neighbor']=='SWE7UniversityTest'],vother)
nsec('Oasis Landing (Into the Future)',"The future town, full of Plumbots. Loki Beaker's twins, a later Landgraab branch and the last Spector live here. **Skip** (a different future from yours).",[r for r in rows if r['neighbor'] in ('Oasis Landing','GPE8_Future')],vother)
nsec('World Adventures (Champs Les Sims, Shang Simla, Al Simhara)',"Unplayable locals of the three holiday destinations. **Skip.**",[r for r in rows if r['game']=='The Sims 3: World Adventures'],vother)
S3B='\n'.join(S); S.clear()

STORE_INTRO={
'Riverview':"A free farming town. The Brokes, Newbies, Simovitches and Don Lothario appear, all earlier in their lives. Sims 4 echo: Henford-on-Bagley.",
'Barnacle Bay':"A pirate-themed island. The Caliente sisters live here after the Sims 2. Sims 4 echo: Ondarion's pirate side, or Sulani.",
'Hidden Springs':"An alpine spa town with a royal family. Bert Alto hides here. Sims 4 echo: Ondarion for the royals.",
'Lunar Lakes':"A colony on another planet, with descendants of many Sims 3 families. Sims 4 echo: none (Sixam, at a stretch).",
'Lucky Palms':"A desert town. Young Darren Dreamer and Darleen Matlapin meet here. Sims 4 echo: Del Sol Valley or Oasis Springs.",
'Sunlit Tides':"A tropical island where Daniel and Mary-Sue Pleasant honeymoon. Sims 4 echo: Sulani.",
'Monte Vista':"An Italian village with the early Montys and Pantalones. Sims 4 echo: Tartosa (not owned) or Ondarion.",
'Aurora Skies':"A Nordic town where young Loki Beaker grows up. Sims 4 echo: Nordhaven or Windenburg.",
'Dragon Valley':"A fantasy town with dragons, and the Burbs before their wedding. Sims 4 echo: Innisgreen (not owned).",
'Midnight Hollow':"A gloomy town where young Olive Specter lives with toddler Nervous. Sims 4 echo: Ravenwood.",
'Roaring Heights':"A 1920s-to-50s city where young Consort and Contessa Capp live near his parents, the Thebes. Sims 4 echo: San Myshuno.",
'':"Downloadable households with no town.",
}
for nb in ['Riverview','Barnacle Bay','Hidden Springs','Lunar Lakes','Lucky Palms','Sunlit Tides','Monte Vista','Aurora Skies','Dragon Valley','Midnight Hollow','Roaring Heights','']:
    rs=[r for r in rows if r['game']=='The Sims 3 Store' and r['neighbor']==nb]
    nsec(nb or 'Downloadable households',STORE_INTRO[nb],rs,vstore)
STORE='\n'.join(S); S.clear()

OTHER=[
("The Sims (console): Willville and SimValley","The console version's own town and party households.",lambda r: r['game']=='The Sims (console)'),
("The Sims Bustin' Out","Malcolm Landgraab, his children Mimi and Dudley, and Mom (your Sim's mother, later their stepmother).",lambda r: 'Bustin' in r['game']),
("The Sims 2 (console and handheld)","Separate stories.",lambda r: r['game'] in ('The Sims 2 (console)','The Sims 2 (GBA)')),
("The Sims 2 Pets (console): Whiskerton","",lambda r: r['neighbor']=='Whiskerton'),
("The Sims 3 (console): Moonlight Bay","Includes a grown-up Malcolm Landgraab.",lambda r: r['game']=='The Sims 3 (console)'),
("The Sims 3 (Wii): Vista Beach","",lambda r: r['game']=='The Sims 3 (Wii)'),
("The Sims 3 (Nintendo DS): Beacon Bay","Includes a grown-up Alexander Goth.",lambda r: r['game']=='The Sims 3 (Nintendo DS)'),
("The Sims 3: Pets (console): Sugar Maple Coast","",lambda r: r['game']=='The Sims 3: Pets (console)'),
("The Sims Life Stories: Four Corners","",lambda r: r['game']=='The Sims Life Stories'),
("The Sims Pet Stories: Arbor Falls, Garden Heights, Mesa Flats","The two story modes, Best in Show and Midnight Masquerade, star households here.",lambda r: r['game']=='The Sims Pet Stories'),
("The Sims Castaway Stories: Felicity Island, Wanmami Island","",lambda r: r['game']=='The Sims Castaway Stories'),
]
for t,i,f in OTHER:
    rs=[r for r in rows if f(r)]
    nsec(t,i,rs,vother)
OTHERTEXT='\n'.join(S)
open('part-sims3.md','w',encoding='utf8',newline='').write(S3TEXT+'\n'+S3B)
open('part-store.md','w',encoding='utf8',newline='').write(STORE)
open('part-other.md','w',encoding='utf8',newline='').write(OTHERTEXT)
# counts
cnt={'s3':S3TEXT.count('\n| ')-2*S3TEXT.count('| Household |'),}
print(len(S3TEXT),len(S3B),len(STORE),len(OTHERTEXT))
