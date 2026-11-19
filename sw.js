// Lets My Money open like an app, and with no signal using the last saved copy.
const C='mymoney-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png']).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  // newest copy when online, saved copy when offline
  e.respondWith(fetch(r).then(res=>{ if(res.ok){const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp));} return res; }).catch(()=>caches.match(r).then(h=>h||caches.match('./'))));
});
