OWNED_KITS={'Country Kitchen','Courtyard Oasis','Fashion Street','Blooming Rooms','Desert Luxe','Home Chef Hustle','Crystal Creations','Comfy Gamer'}
NOT_EP={'EP16':'Lovestruck','EP19':'Enchanted by Nature'}
NOT_GP={'GP04':'Vampires','GP09':'Journey to Batuu','GP11':'My Wedding Stories','GP12':'Werewolves'}
import re
def short(name):
    n=re.sub(r'The Sims™? ?4™? ?','',name).replace('™','').strip()
    n=re.sub(r'\s+(Expansion Pack|Stuff Pack|Game Pack|Kit|Stuff)$','',n).strip()
    return n
def missing(packs):
    out=[]
    for code,typ,name in packs:
        if code in NOT_EP: out.append(NOT_EP[code]); continue
        if code in NOT_GP: out.append(NOT_GP[code]); continue
        if typ=='KIT' or (code and code.startswith('SP') and int(code[2:])>18):
            s=short(name)
            if not any(k.lower() in s.lower() for k in OWNED_KITS): out.append(s+' Kit' if typ=='KIT' else s)
    return out
