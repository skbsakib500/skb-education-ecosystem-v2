import { Hono } from 'hono'
const app = new Hono<{ Bindings: { DB: D1Database } }>()

const SUPER_ADMIN_KEY = "skb-master-2026"

const superAdminAuth = async (c: any, next: any) => {
  const key = c.req.header('X-Super-Admin-Key')
  if (key !== SUPER_ADMIN_KEY) return c.json({ error: 'Super Admin only' }, 403)
  await next()
}

// --- CSS + Layout ---
const layout = (title: string, body: string) => `
<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - SKB Education OS</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:'Hind+Siliguri',system-ui}</style>
</head><body class="bg-[#fafaf9] text-zinc-900">
${body}
</body></html>
`

// --- HOME PAGE ---
app.get('/', (c) => {
  const html = layout('Home', `
  <nav class="flex justify-between items-center px-6 md:px-10 py-5 max-w-7xl mx-auto">
    <div class="flex items-center gap-2"><div class="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">S</div><span class="font-bold text-xl">SKB Education OS</span></div>
    <div class="flex gap-3"><a href="/super-admin" class="px-5 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-semibold">Super Admin</a></div>
  </nav>
  <section class="max-w-7xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-20 grid md:grid-cols-2 gap-10 items-center">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-4">👑 MASTERMIND: SKB SAKIB</div>
      <h1 class="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight">একটা<br><span class="text-orange-500">Platform,</span><br>সব শিক্ষা<br>প্রতিষ্ঠান</h1>
      <p class="mt-6 text-lg text-zinc-600 leading-relaxed">স্কুল, কলেজ, কোচিং সেন্টার - সবাই এক জায়গায়। প্রতিটা প্রতিষ্ঠানের ডাটা 100% আলাদা। তুমি Super Admin হয়ে পুরো মার্কেট কন্ট্রোল করবে।</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="/signup" class="px-7 py-3.5 bg-orange-500 text-white rounded-full font-bold">প্রতিষ্ঠান যোগ করুন 🚀</a>
        <a href="/api/health" class="px-7 py-3.5 bg-white border rounded-full font-bold">API Status</a>
      </div>
      <div class="mt-10 grid grid-cols-3 gap-6 border-t pt-8">
        <div><div class="text-3xl font-bold">100%</div><div class="text-sm text-zinc-500">Isolated Data</div></div>
        <div><div class="text-3xl font-bold">8-12</div><div class="text-sm text-zinc-500">Class Support</div></div>
        <div><div class="text-3xl font-bold">∞</div><div class="text-sm text-zinc-500">Tenants</div></div>
      </div>
    </div>
    <div class="bg-white rounded-[2rem] border shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] p-3">
      <div class="bg-zinc-900 rounded-[1.5rem] p-6 text-white">
        <div class="flex justify-between items-center mb-6"><span class="text-sm opacity-60">Super Admin Dashboard</span><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span></div>
        <div class="space-y-3" id="tenant-preview"><div class="h-20 bg-zinc-800 rounded-xl animate-pulse"></div></div>
      </div>
      <div class="p-6">
        <div class="text-sm font-bold mb-3">Live Tenants</div>
        <div id="live-tenants" class="space-y-2 text-sm text-zinc-600">Loading...</div>
      </div>
    </div>
  </section>
  <script>
    fetch('/api/tenants').then(r=>r.json()).then(data=>{
      document.getElementById('live-tenants').innerHTML = data.map(t=>\`<div class="flex justify-between p-3 bg-zinc-50 rounded-xl"><span>\${t.name}</span><span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">\${t.type}</span></div>\`).join('') || '<div>No tenants yet</div>';
      document.getElementById('tenant-preview').innerHTML = data.slice(0,3).map(t=>\`<div class="p-4 bg-zinc-800 rounded-xl flex justify-between"><div><div class="font-bold">\${t.name}</div><div class="text-xs opacity-60">\${t.id}</div></div><div class="text-xs px-2 py-1 bg-orange-500 rounded-full h-fit">Active</div></div>\`).join('');
    })
  </script>
  `)
  return c.html(html)
})

// --- SUPER ADMIN DASHBOARD ---
app.get('/super-admin', (c) => {
  const html = layout('Super Admin', `
  <div class="min-h-screen flex">
    <aside class="w-72 bg-zinc-900 text-white p-6 hidden md:block">
      <div class="font-bold text-xl mb-10">👑 SKB Mastermind</div>
      <nav class="space-y-2 text-sm">
        <a class="flex gap-3 p-3 bg-white text-black rounded-xl font-bold">🏢 Tenants</a>
        <a class="flex gap-3 p-3 opacity-60">💰 Revenue</a>
        <a class="flex gap-3 p-3 opacity-60">👥 All Users</a>
        <a href="/" class="flex gap-3 p-3 opacity-60">🏠 Home</a>
      </nav>
      <div class="mt-auto pt-20 text-xs opacity-50">Mastermind: SKB Sakib<br>Key: skb-master-2026</div>
    </aside>
    <main class="flex-1 p-6 md:p-10 bg-[#fafaf9]">
      <div class="flex justify-between items-center mb-8"><h1 class="text-3xl font-bold">Tenants Control</h1><button onclick="document.getElementById('addModal').classList.remove('hidden')" class="px-5 py-2.5 bg-orange-500 text-white rounded-full font-bold">+ New Institution</button></div>
      <div class="grid md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white border rounded-2xl p-6"><div class="text-sm text-zinc-500">Total Tenants</div><div id="totalCount" class="text-3xl font-bold">-</div></div>
        <div class="bg-white border rounded-2xl p-6"><div class="text-sm text-zinc-500">Active Coaching</div><div id="coachingCount" class="text-3xl font-bold">-</div></div>
        <div class="bg-white border rounded-2xl p-6"><div class="text-sm text-zinc-500">Monthly Revenue</div><div class="text-3xl font-bold">৳ <span id="rev">0</span></div></div>
      </div>
      <div class="bg-white border rounded-2xl overflow-hidden">
        <div class="p-6 border-b font-bold">All Institutions (Isolated Data)</div>
        <div id="table" class="divide-y">Loading...</div>
      </div>
    </main>
  </div>
  <div id="addModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-6">
    <div class="bg-white rounded-[1.5rem] p-8 w-full max-w-md">
      <h2 class="font-bold text-xl mb-4">New Institution Add করো</h2>
      <form id="addForm" class="space-y-3">
        <input name="name" placeholder="Institution Name" required class="w-full p-3 border rounded-xl">
        <select name="type" class="w-full p-3 border rounded-xl"><option value="school">School</option><option value="college">College</option><option value="coaching">Coaching Center</option></select>
        <input name="owner_name" placeholder="Owner Name" required class="w-full p-3 border rounded-xl">
        <input name="phone" placeholder="Phone" required class="w-full p-3 border rounded-xl">
        <div class="flex gap-2 pt-2"><button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="flex-1 p-3 border rounded-xl">Cancel</button><button class="flex-1 p-3 bg-zinc-900 text-white rounded-xl font-bold">Create Tenant</button></div>
      </form>
    </div>
  </div>
  <script>
    const KEY = 'skb-master-2026';
    async function load(){
      const res = await fetch('/api/super-admin/tenants', {headers:{'X-Super-Admin-Key':KEY}});
      const data = await res.json();
      document.getElementById('totalCount').innerText = data.total || data.tenants?.length || 0;
      document.getElementById('coachingCount').innerText = data.tenants?.filter(t=>t.type==='coaching').length || 0;
      document.getElementById('rev').innerText = (data.total || 0)*1000;
      document.getElementById('table').innerHTML = (data.tenants||[]).map(t=>\`<div class="p-4 flex justify-between items-center"><div><div class="font-bold">\${t.name}</div><div class="text-xs text-zinc-500">\${t.id} • \${t.owner_name} • \${t.phone}</div></div><span class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">\${t.status}</span></div>\`).join('') || '<div class="p-10 text-center text-zinc-500">No tenants yet</div>';
    }
    load();
    document.getElementById('addForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = Object.fromEntries(fd.entries());
      const res = await fetch('/api/super-admin/tenants', {method:'POST', headers:{'Content-Type':'application/json','X-Super-Admin-Key':KEY}, body:JSON.stringify(body)});
      const j = await res.json();
      alert(j.success ? 'Tenant Created: '+j.tenant_id : j.error);
      if(j.success){ document.getElementById('addModal').classList.add('hidden'); load(); }
    })
  </script>
  `)
  return c.html(html)
})

// --- API (keep existing) ---
app.get('/api/health', (c) => c.json({ status: 'Phase 2.5 UI Fixed ✅', mastermind: 'SKB Sakib', phase: 'Home + Super Admin Dashboard' }))
app.get('/api/tenants', async (c) => {
  try { const { results } = await c.env.DB.prepare("SELECT id, name, type, status FROM tenants WHERE status='active'").all(); return c.json(results) } 
  catch { return c.json([{id:'demo', name:'Demo School', type:'school', status:'active'}]) }
})
app.get('/api/super-admin/tenants', superAdminAuth, async (c) => {
  try { const { results } = await c.env.DB.prepare("SELECT * FROM tenants").all(); return c.json({ total: results.length, tenants: results }) }
  catch (e: any) { return c.json({ error: e.message }, 500) }
})
app.post('/api/super-admin/tenants', superAdminAuth, async (c) => {
  const { name, type, owner_name, phone, id } = await c.req.json()
  const tenantId = id || name.toLowerCase().replace(/\\s+/g,'_').replace(/[^a-z0-9_]/g,'') + '_' + Date.now().toString().slice(-4)
  try { await c.env.DB.prepare("INSERT INTO tenants (id, name, type, owner_name, phone) VALUES (?,?,?,?,?)").bind(tenantId, name, type, owner_name, phone).run(); return c.json({ success: true, tenant_id: tenantId }) }
  catch (e: any) { return c.json({ error: e.message }, 500) }
})

export default app
