import json,sys,time,urllib.request,urllib.parse,urllib.error
API="https://drop-api.ea.com/ugx/the-sims-4"
H={"User-Agent":"JemmasSimWorld/1.0 (personal site research)"}
def get(path):
    for n in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(API+path,headers=H),timeout=40) as r:
                b=r.read(); time.sleep(0.3); return json.loads(b) if b else None
        except urllib.error.HTTPError as e:
            if e.code in (404,410): return None
            time.sleep(2*(n+1))
        except Exception as e:
            time.sleep(2*(n+1))
    return None
def search(words,limit=24,offset=0,extra=''):
    d=get(f"/list-items?search={urllib.parse.quote(words)}&limit={limit}&offset={offset}{extra}")
    return (d or {}).get('data',{})
def item(slug):
    d=get(f"/item/{urllib.parse.quote(slug,safe='')}?locale=en")
    return (d or {}).get('data')
