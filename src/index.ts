import { Hono } from 'hono'
const app = new Hono()
const KEY = "skb-master-2026"

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SKB Education OS</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
<style>body{font-family:'Hind Siliguri',sans-serif}</style>
</head><body class="bg-[#fffaf5] min-h-screen">
<nav class="flex justify-between items-center p-6 max-w-6xl mx-auto">
  <div class="flex items-center gap-2 font-bold text-xl"><div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">S</div> SKB OS</div>
  <a href="/super-admin" class="px-5 py-2 bg-black text-white rounded-full text-sm font-bold">Super Admin</a>
</nav>
<div class="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-center mt-6">
  <div>
    <div class="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-4">MASTERMIND: MD SAKIB AL MHAMUD</div>
    <h1 class="text-5xl font-bold leading-none">একটা<br><span class="text-orange-500">Platform</span><br>সব প্রতিষ্ঠান</h1>
    <p class="mt-4 text-zinc-600">স্কুল/কলেজ/কোচিং - সবার ডাটা 100% আলাদা।</p>
    <div class="mt-6 flex gap-3">
      <a href="/super-admin" class="px-6 py-3 bg-orange-500 text-white rounded-full font-bold">Dashboard খুলুন</a>
      <a href="/api/health" class="px-6 py-3 bg-white border rounded-full font-bold">API Check</a>
    </div>
    <div class="mt-8 grid grid-cols-3 gap-4 border-t pt-6">
      <div><div class="text-2xl font-bold" id="tCount">0</div><div class="text-xs text-zinc-500">Total Tenants</div></div>
      <div><div class="text-2xl font-bold">100%</div><div class="text-xs text-zinc-500">Isolated</div></div>
      <div><div class="text-2xl font-bold">Phase 2.5</div><div class="text-xs text-zinc-500">Live</div></div>
    </div>
  </div>
  <div class="bg-white rounded-[2rem] border shadow-2xl p-4">
    <div class="bg-zinc-900 rounded-[1.5rem] p-5 text-white">
      <div class="flex justify-between text-xs opacity-60 mb-4"><span>Live Tenants</span><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span></div>
      <div id="preview" class="space-y-3"><div class="h-16 bg-zinc-800 rounded-xl animate-pulse"></div></div>
    </div>
    <div class="p-4 text-sm"><div class="font-bold mb-2">Active Institutions</div><div id="list">Loading...</div></div>
  </div>
</div>
<script>
fetch('/api/tenants').then(r=>r.json()).then(d=>{
  document.getElementById('tCount').innerText=d.length||0;
  document.getElementById('list').innerHTML=d.map(x=>'<div class="flex justify-between p-2 bg-zinc-50 rounded-lg mb-2"><span>'+x.name+'</span><span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">'+x.type+'</span></div>').join('')||'No tenants yet';
  document.getElementById('preview').innerHTML=d.slice(0,3).map(x=>'<div class="p-3 bg-zinc-800 rounded-xl flex justify-between"><div><div class="font-bold text-sm">'+x.name+'</div><div class="text-[10px] opacity-50">'+x.id+'</div></div><div class="text-[10px] px-2 py-1 bg-orange-500 rounded-full h-fit">ACTIVE</div></div>').join('')||'<div class="text-sm opacity-60">No tenants yet</div>';
}).catch(()=>{document.getElementById('list').innerHTML='API connecting...'})
</script>
</body></html>
  `)
})

app.get('/super-admin', (c) => {
  return c.html(`
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-[#fafaf9] min-h-screen flex">
<aside class="w-64 bg-zinc-900 text-white p-6 hidden md:block"><div class="font-bold mb-10">SKB Mastermind</div><nav class="space-y-2 text-sm"><div class="p-3 bg-white text-black rounded-xl font-bold">Tenants</div><a href="/" class="block p-3 opacity-60">Home</a></nav></aside>
<main class="flex-1 p-6 md:p-10">
<div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Tenants Control</h1><button onclick="document.getElementById('modal').classList.remove('hidden')" class="px-4 py-2 bg-orange-500 text-white rounded-full font-bold">+ New</button></div>
<div class="grid grid-cols-3 gap-4 mb-6"><div class="bg-white border rounded-2xl p-5"><div class="text-xs text-zinc-500">Total</div><div id="total" class="text-2xl font-bold">-</div></div><div class="bg-white border rounded-2xl p-5"><div class="text-xs text-zinc-500">Revenue</div><div class="text-2xl font-bold">৳ <span id="rev">0</span></div></div><div class="bg-white border rounded-2xl p-5"><div class="text-xs text-zinc-500">Status</div><div class="text-2xl font-bold text-green-600">Live</div></div></div>
<div class="bg-white border rounded-2xl"><div class="p-4 border-b font-bold">All Institutions</div><div id="table" class="divide-y p-4">Loading...</div></div>
</main>
<div id="modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-6"><div class="bg-white rounded-2xl p-6 w-full max-w-sm">
<h2 class="font-bold mb-4">New Institution</h2>
<form id="form" class="space-y-3"><input name="name" required placeholder="Name" class="w-full p-3 border rounded-xl"><select name="type" class="w-full p-3 border rounded-xl"><option value="coaching">Coaching</option><option value="school">School</option><option value="college">College</option></select><input name="owner_name" required placeholder="Owner" class="w-full p-3 border rounded-xl"><input name="phone" required placeholder="Phone" class="w-full p-3 border rounded-xl"><div class="flex gap-2"><button type="button" onclick="document.getElementById('modal').classList.add('hidden')" class="flex-1 p-3 border rounded-xl">Cancel</button><button class="flex-1 p-3 bg-black text-white rounded-xl font-bold">Create</button></div></form>
</div></div>
<script>
const KEY='skb-master-2026';
async function load(){
  const r=await fetch('/api/super-admin/tenants',{headers:{'X-Super-Admin-Key':KEY}});
  const d=await r.json();
  document.getElementById('total').innerText=d.total||d.tenants?.length||0;
  document.getElementById('rev').innerText=(d.total||0)*1500;
  document.getElementById('table').innerHTML=(d.tenants||[]).map(t=>'<div class="p-3 flex justify-between"><div><div class="font-bold">'+t.name+'</div><div class="text-xs text-zinc-500">'+t.id+'</div></div><span class="text-xs px-2 py-1 bg-green-100 rounded-full">'+t.status+'</span></div>').join('')||'No data';
}
load();
document.getElementById('form').addEventListener('submit',async(e)=>{
  e.preventDefault(); const fd=new FormData(e.target); const body=Object.fromEntries(fd.entries());
  const res=await fetch('/api/super-admin/tenants',{method:'POST',headers:{'Content-Type':'application/json','X-Super-Admin-Key':KEY},body:JSON.stringify(body)});
  const j=await res.json(); alert(j.success?'Created: '+j.tenant_id:j.error); if(j.success){document.getElementById('modal').classList.add('hidden'); load();}
})
</script></body></html>
  `)
})

app.get('/api/health', (c) => c.json({ status: 'Phase 2.5 Fixed', mastermind: 'SKB Sakib' }))
app.get('/api/tenants', async (c) => {
  try { const env = c.env as any; const { results } = await env.DB.prepare("SELECT id, name, type, status FROM tenants WHERE status='active'").all(); return c.json(results) }
  catch { return c.json([{id:'demo', name:'Demo Coaching', type:'coaching', status:'active'}]) }
})
app.get('/api/super-admin/tenants', async (c) => {
  const key = c.req.header('X-Super-Admin-Key'); if(key!==KEY) return c.json({error:'Forbidden'},403)
  try { const env = c.env as any; const { results } = await env.DB.prepare("SELECT * FROM tenants ORDER BY created_at DESC").all(); return c.json({total: results.length, tenants: results}) }
  catch (e:any){ return c.json({error:e.message},500) }
})
app.post('/api/super-admin/tenants', async (c) => {
  const key = c.req.header('X-Super-Admin-Key'); if(key!==KEY) return c.json({error:'Forbidden'},403)
  const { name, type, owner_name, phone } = await c.req.json()
  const id = name.toLowerCase().replace(/\\s+/g,'_').replace(/[^a-z0-9_]/g,'') + '_' + Date.now().toString().slice(-4)
  try { const env = c.env as any; await env.DB.prepare("INSERT INTO tenants (id, name, type, owner_name, phone) VALUES (?,?,?,?,?)").bind(id, name, type, owner_name, phone).run(); return c.json({success:true, tenant_id:id}) }
  catch (e:any){ return c.json({error:e.message},500) }
})
export default app
