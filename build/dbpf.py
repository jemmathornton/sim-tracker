import struct,zlib,sys
def entries(path):
    b=open(path,'rb').read()
    assert b[:4]==b'DBPF'
    cnt=struct.unpack_from('<I',b,36)[0]; pos=struct.unpack_from('<I',b,64)[0]
    flags=struct.unpack_from('<I',b,pos); p=pos+4; f=flags[0]
    const={}
    for i,name in enumerate(['type','group','insthi']):
        if f&(1<<i): const[name]=struct.unpack_from('<I',b,p)[0]; p+=4
    out=[]
    for _ in range(cnt):
        e={}
        for name in ['type','group','insthi']:
            if name in const: e[name]=const[name]
            else: e[name]=struct.unpack_from('<I',b,p)[0]; p+=4
        e['instlo'],e['off'],fs,e['memsize']=struct.unpack_from('<IIII',b,p); p+=16
        e['filesize']=fs&0x7fffffff
        if fs&0x80000000: e['comp'],e['committed']=struct.unpack_from('<HH',b,p); p+=4
        else: e['comp']=0
        raw=b[e['off']:e['off']+e['filesize']]
        if e['comp']==0x5a42: data=zlib.decompress(raw)
        elif e['comp']==0: data=raw
        else: data=None
        e['data']=data; out.append(e)
    return out
if __name__=='__main__':
    for e in entries(sys.argv[1]):
        d=e['data']
        print(hex(e['type']),hex(e['group']),hex(e['insthi']<<32|e['instlo']),hex(e['comp']),e['memsize'], d[:8] if d else None)
