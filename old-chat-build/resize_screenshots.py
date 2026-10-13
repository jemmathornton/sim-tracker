import os,re
from PIL import Image
src="/mnt/user-data/uploads/Builds"
M={"3 Olde Mill Lane":("henford-on-bagley","3-olde-mill-lane"),"Comfy Cubby":("newcrest","comfy-cubby"),"Coorinberg Cottage":("windenburg","coorinberg-cottage"),
"Cottage Am See":("windenburg","cottage-am-see"),"Finchwick Village Hall":("henford-on-bagley","5-cobblebottom-street"),"Lakeside Retreat":("granite-falls","lakeside-retreat"),
"Medina Studios 920":("san-myshuno","920-medina-studios"),"Midtown Meadows":("newcrest","midtown-meadows"),"Newcrest Wedding Hall":("newcrest","cookout-lookout"),
"Olde Platz Inn":("windenburg","waterlock-redoubt"),"Raffia Quinta":("oasis-springs","raffia-quinta"),"Rio Verde Retirement Villa":("oasis-springs","rio-verde")}
SKIP={"Gallery Pirce.png","Front Gallery.png"}
n=0
for folder,(w,l) in M.items():
    d=os.path.join(src,folder); od=f"site/shots/{w}/{l}"; os.makedirs(od,exist_ok=True)
    for f in sorted(os.listdir(d)):
        if f in SKIP or not f.lower().endswith('.png'): continue
        s=re.sub(r'[^a-z0-9]+','-',f.rsplit('.',1)[0].lower().replace('_s ',"s ")).strip('-')
        if os.path.exists(f"{od}/{s}.thumb.jpg"): continue
        im=Image.open(os.path.join(d,f)).convert('RGB')
        b=im.copy(); b.thumbnail((2000,2000),Image.LANCZOS); b.save(f"{od}/{s}.jpg",quality=82,optimize=True,progressive=True)
        t=im.copy(); t.thumbnail((720,720),Image.LANCZOS); t.save(f"{od}/{s}.thumb.jpg",quality=76,optimize=True); n+=1
print("done",n)
