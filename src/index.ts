import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.html(`
<h1>🎓 SKB Education Ecosystem</h1>
<p>Phase 1 - Running ✅</p>
<p>Owner: skbsakib500</p>
<a href="/api/classes">API Test</a>
<style>body{font-family:system-ui;padding:40px;text-align:center}</style>
`))

app.get('/api/health', (c) => c.json({ 
  status: 'Running ✅',
  owner: 'skbsakib500',
  phase: 'Phase 1 Foundation'
}))

app.get('/api/classes', (c) => c.json([
  {class: 8, subject: 'Math'},
  {class: 9, subject: 'Science'},
  {class: 10, subject: 'SSC'},
  {class: 11, group: 'Science/Arts/Commerce'},
  {class: 12, group: 'HSC'}
]))

export default app
