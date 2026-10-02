"""Vectorise the supplied KrisLynx mark (raster PNG) into a clean SVG path.
Run once; output is committed to public/brand/. Requires opencv-python + pillow."""
import cv2, numpy as np
from PIL import Image

def smooth_path(pts, closed=True):
    # Catmull-Rom -> cubic Bezier through simplified points
    n=len(pts); d=[]
    fmt=lambda p: f"{p[0]:.1f} {p[1]:.1f}"
    d.append(f"M{fmt(pts[0])}")
    for i in range(n if closed else n-1):
        p0=pts[(i-1)%n]; p1=pts[i]; p2=pts[(i+1)%n]; p3=pts[(i+2)%n]
        c1=(p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6)
        c2=(p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6)
        d.append(f"C{fmt(c1)} {fmt(c2)} {fmt(p2)}")
    return "".join(d)+("Z" if closed else "")

def trace(src, eps=1.6, scale=1.0):
    im=Image.open(src).convert("RGBA"); a=np.array(im)
    # opaque + not-near-white pixels form the mark
    rgb=a[:,:,:3].astype(int); alpha=a[:,:,3]
    ink=(alpha>100)&(rgb.min(axis=2)<242)
    mask=(ink*255).astype(np.uint8)
    mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    mask=cv2.GaussianBlur(mask,(0,0),2.2)
    mask=np.where(mask>127,255,0).astype(np.uint8)
    ys,xs=np.where(mask>0); x0,y0,x1,y1=xs.min(),ys.min(),xs.max(),ys.max()
    mask=mask[y0:y1+1,x0:x1+1]; h,w=mask.shape
    cs,_=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    paths=[]
    for c in cs:
        if cv2.contourArea(c)<30: continue
        ap=cv2.approxPolyDP(c,eps,True).reshape(-1,2)*scale
        paths.append(smooth_path([tuple(p) for p in ap]))
    # sample gradient colours from the artwork
    crop=a[y0:y1+1,x0:x1+1]
    return " ".join(paths), w*scale, h*scale

d,w,h=trace("content/images/source/brand-mark.png")
grad='<linearGradient id="kx-g" x1="0" y1=".62" x2="1" y2=".38"><stop offset="0" stop-color="#0A4DFF"/><stop offset=".55" stop-color="#08A6F7"/><stop offset="1" stop-color="#7BEFFB"/></linearGradient>'
svg=lambda fill,defs: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" role="img" aria-label="KrisLynx">{defs}<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>'
open("public/brand/krislynx-mark.svg","w").write(svg("url(#kx-g)",f"<defs>{grad}</defs>"))
open("public/brand/krislynx-mark-mono.svg","w").write(svg("currentColor",""))
open("public/brand/krislynx-mark-white.svg","w").write(svg("#FFFFFF",""))
open("src/generated/mark-path.json","w").write('{"d":"%s","w":%.1f,"h":%.1f}'%(d,w,h))
print("mark",w,h,len(d))

# --- Wordmark: split the supplied wordmark into its two lines and trace each
from PIL import Image as _I
wm=_I.open("content/images/source/brand-wordmark.png").convert("RGBA")
arr=np.array(wm); ink=(arr[:,:,3]>100)&(arr[:,:,:3].min(axis=2)<242)
rows=np.where(ink.any(axis=1))[0]
gaps=[i for i in range(1,len(rows)) if rows[i]-rows[i-1]>20]
top=(rows[0],rows[gaps[0]-1]); bot=(rows[gaps[0]],rows[-1])
for name,(a,b) in (("wordmark",top),("descriptor",bot)):
    wm.crop((0,max(a-4,0),wm.width,b+5)).save(f"/tmp/{name}.png")
    d2,w2,h2=trace(f"/tmp/{name}.png",eps=1.2)
    open(f"src/generated/{name}-path.json","w").write('{"d":"%s","w":%.1f,"h":%.1f}'%(d2,w2,h2))
    open(f"public/brand/krislynx-{name}.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w2:.0f} {h2:.0f}" role="img" aria-label="KrisLynx"><path fill="currentColor" fill-rule="evenodd" d="{d2}"/></svg>')
    print(name,w2,h2)
