const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch();
 const f='file://'+process.cwd()+'/jemmas-sim-world.html';
 const report=[];
 for (const vp of [{width:1300,height:900,name:'desktop'},{width:390,height:844,name:'phone'}]) {
  const p=await b.newPage({viewport:{width:vp.width,height:vp.height}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(f+'#home'); await p.waitForTimeout(400);
  const keys=await p.evaluate(()=>['home','stats','stats-willow-creek',...worlds.filter(w=>w.ready).flatMap(w=>['w-'+w.id,'f-'+w.id,...w.hoods.map(h=>'n-'+h.id)]),...Object.keys(lotIndex),...Object.keys(hhIndex)]);
  const valid=new Set(keys);
  for (const k of keys){
    await p.evaluate(k=>{location.hash=k},k); await p.waitForTimeout(25);
    const r=await p.evaluate((valid)=>{
      const v=new Set(valid); const out={};
      out.overflow=document.documentElement.scrollWidth>document.documentElement.clientWidth+1 ? document.documentElement.scrollWidth : 0;
      out.badLinks=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(h=>h && !v.has(h)).slice(0,5);
      const txt=document.getElementById('view').innerText;
      out.junk=(txt.match(/\b(undefined|NaN|null|\[object Object\])\b/g)||[]).slice(0,3);
      out.empty=!txt.trim();
      out.h1=document.querySelector('#view h1')?.innerText.replace(/\n/g,' ');
      return out; },[...valid]);
    if (r.overflow||r.badLinks.length||r.junk.length||r.empty) report.push({vp:vp.name,k,...r});
  }
  report.push({vp:vp.name, pages:keys.length, errors:errs.slice(0,5)});
  await p.close();
 }
 console.log(JSON.stringify(report,null,1)); await b.close();})();
