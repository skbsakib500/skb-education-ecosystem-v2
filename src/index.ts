import { Hono } from 'hono'
const app = new Hono<{ Bindings: { DB: D1Database } }>()

// --- CONFIG ---
const SUPER_ADMIN_PHONE = "01700000000" // তোমার নাম্বার দেবে এখানে
const SUPER_ADMIN_KEY = "skb-master-2026" // Super Admin Secret Key

// --- Middleware: Super Admin Check ---
const superAdminAuth = async (c: any, next: any) => {
  const key = c.req.header('X-Super-Admin-Key')
  if (key !== SUPER_ADMIN_KEY) {
    return c.json({ error: 'Super Admin only - Access denied' }, 403)
  }
  await next()
}

// --- HOME ---
app.get('/', (c) => c.html(`
<h1>🎓 SKB Education Ecosystem - Phase 2</h1>
<h2>👑 Mastermind: SKB Sakib</h2>
<p>Status: Multi-Tenant Active ✅</p>
<p>Super Admin Key: Use Header X-Super-Admin-Key</p>
<hr>
<a href="/api/health">Health</a> | 
<a href="/api/tenants">Public Tenants List</a> |
<a href="/api/classes">Global Classes</a>
<style>body{font-family:system-ui;padding:30px;line-height:1.6}h1{color:#f97316}</style>
`))

app.get('/api/health', (c) => c.json({
  status: 'Phase 2 Multi-Tenant Running ✅',
  mastermind: 'SKB Sakib',
  system: 'Super Admin Control Enabled',
  tenants_isolated: true,
  roles: ['super_admin','institution_admin','teacher','student']
}))

// --- PUBLIC: List Tenants (limited info) ---
app.get('/api/tenants', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT id, name, type, status FROM tenants WHERE status='active'").all()
    return c.json(results)
  } catch {
    return c.json([{id: 'demo-school', name: 'Demo School (DB not connected yet)', type: 'school'}])
  }
})

// --- SUPER ADMIN: Create Tenant (School/Coaching) ---
app.post('/api/super-admin/tenants', superAdminAuth, async (c) => {
  const { id, name, type, owner_name, phone } = await c.req.json()
  const tenantId = id || name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4)
  try {
    await c.env.DB.prepare(
      "INSERT INTO tenants (id, name, type, owner_name, phone) VALUES (?,?,?,?,?)"
    ).bind(tenantId, name, type, owner_name, phone).run()
    return c.json({ success: true, message: 'Tenant Created', tenant_id: tenantId, owner: owner_name })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- SUPER ADMIN: All Tenants with Stats ---
app.get('/api/super-admin/tenants', superAdminAuth, async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM tenants").all()
    return c.json({ total: results.length, mastermind: 'SKB Sakib', tenants: results })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- AUTH: Signup (with tenant_id & role) ---
app.post('/api/auth/signup', async (c) => {
  const { name, phone, role, tenant_id, class_level } = await c.req.json()
  if (!tenant_id || !role) return c.json({ error: 'tenant_id and role required' }, 400)
  const userId = 'user_' + Date.now()
  try {
    await c.env.DB.prepare(
      "INSERT INTO users (id, tenant_id, role, name, phone, class_level) VALUES (?,?,?,?,?,?)"
    ).bind(userId, tenant_id, role, name, phone, class_level || null).run()
    return c.json({ success: true, user_id: userId, tenant_id, role, message: `Welcome ${name} as ${role}` })
  } catch (e: any) {
    return c.json({ error: e.message, hint: 'Phone maybe duplicate' }, 500)
  }
})

// --- TENANT ISOLATED: Get Users of a Tenant ---
app.get('/api/:tenantId/users', async (c) => {
  const tenantId = c.req.param('tenantId')
  try {
    const { results } = await c.env.DB.prepare("SELECT id, name, role, class_level FROM users WHERE tenant_id=?").bind(tenantId).all()
    return c.json({ tenant_id: tenantId, count: results.length, users: results })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- Classes per Tenant ---
app.get('/api/:tenantId/classes', async (c) => {
  const tenantId = c.req.param('tenantId')
  // Default classes 8-12 if DB empty
  const defaultClasses = [
    {class: 8, subjects: ['Math','Science','English']},
    {class: 9, subjects: ['Physics','Chemistry','Biology']},
    {class: 10, subjects: ['SSC Preparation']},
    {class: 11, group: 'Science/Arts/Commerce'},
    {class: 12, group: 'HSC'}
  ]
  return c.json({ tenant_id: tenantId, classes: defaultClasses })
})

export default app
