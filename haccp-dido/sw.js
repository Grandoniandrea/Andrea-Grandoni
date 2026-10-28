// Copia offline: prima la rete, se manca usa la copia salvata
const C="haccp-dido-v13";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.json","./icon-192.png"]).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const ok=new URL(r.url).origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(r.url);if(!ok)return;
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))))});
