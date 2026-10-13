import sys,io; sys.path.insert(0,'/tmp/claude-0/-home-claude/c6f03ba3-a895-5a60-a731-eb5e329c0746/scratchpad/maps')
from dbpf import entries
from PIL import Image
import numpy as np
pkg,out=sys.argv[1],sys.argv[2]
ims=[]
for e in entries(pkg):
    if e['type']==0xb2d882:
        im=Image.open(io.BytesIO(e['data'])); im.load(); ims.append(im)
ims.sort(key=lambda i:-i.size[0])
big,small=ims[0],ims[1]
a=np.asarray(big).astype(float); c=np.asarray(small.resize(big.size,Image.BILINEAR)).astype(float)
Y=a[...,1]; A=a[...,0]; co=c[...,0]-128; cg=c[...,1]-128
t=Y-cg; rgb=np.clip(np.stack([t+co,Y+cg,t-co],-1),0,255).astype(np.uint8)
ys,xs=np.where(A>128); box=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
img=Image.fromarray(rgb).crop(box)
img.thumbnail((1800,1800),Image.LANCZOS)
img.save(out,quality=82,optimize=True,progressive=True)
print(box,img.size)
