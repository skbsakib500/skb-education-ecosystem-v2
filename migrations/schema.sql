-- Tenants (School/Coaching)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- school, college, coaching
  owner_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users with Role
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  role TEXT NOT NULL, -- super_admin, institution_admin, teacher, student
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  class_level INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  class_number INTEGER,
  section TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
