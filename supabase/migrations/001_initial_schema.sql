-- AI Stream – Initiales Datenbankschema
-- Alle Tabellen mit tenant_id für Multi-Tenancy

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TENANTS
-- ============================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'premium', 'enterprise')),
  credits_used INTEGER DEFAULT 0,
  credits_limit INTEGER DEFAULT 270000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHANNELS (WhatsApp, E-Mail, Instagram etc.)
-- ============================================================
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'email', 'instagram', 'telegram')),
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MAILBOXES (Postfächer)
-- ============================================================
CREATE TABLE mailboxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATIONS (Unterhaltungen)
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  mailbox_id UUID REFERENCES mailboxes(id),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'instagram', 'telegram')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'later', 'done')),
  contact_name TEXT NOT NULL,
  contact_identifier TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES (Nachrichten)
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'agent', 'ai')),
  content TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'instagram', 'telegram')),
  is_note BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI AGENTS (KI-Agenten)
-- ============================================================
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🤖',
  description TEXT,
  system_prompt TEXT,
  style_prompt TEXT,
  is_active BOOLEAN DEFAULT false,
  pinecone_namespace TEXT,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AGENT KNOWLEDGE (Wissen & Daten)
-- ============================================================
CREATE TABLE agent_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('website', 'file', 'qa')),
  name TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'error')),
  pages_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AGENT AUTOMATIONS (Automationen)
-- ============================================================
CREATE TABLE agent_automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agents(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('always', 'first_contact', 'chat_open', 'outside_hours', 'manual')),
  flow_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  runs INTEGER DEFAULT 0,
  tasks INTEGER DEFAULT 0,
  folder TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAVED FILTERS (Gespeicherte Unterhaltungsfilter)
-- ============================================================
CREATE TABLE saved_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🔖',
  config JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_tenant_status ON conversations(tenant_id, status);
CREATE INDEX idx_conversations_last_message ON conversations(tenant_id, last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_tenant ON messages(tenant_id);
CREATE INDEX idx_ai_agents_tenant ON ai_agents(tenant_id);
CREATE INDEX idx_agent_knowledge_agent ON agent_knowledge(agent_id);
CREATE INDEX idx_agent_automations_tenant ON agent_automations(tenant_id);
CREATE INDEX idx_users_tenant ON users(tenant_id);

-- ============================================================
-- ROW LEVEL SECURITY (Tenant-Isolation)
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_filters ENABLE ROW LEVEL SECURITY;

-- RLS Policies: tenant_id Isolation
CREATE POLICY "users_tenant_isolation" ON users FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "channels_tenant_isolation" ON channels FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "mailboxes_tenant_isolation" ON mailboxes FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "conversations_tenant_isolation" ON conversations FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "messages_tenant_isolation" ON messages FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "ai_agents_tenant_isolation" ON ai_agents FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "agent_knowledge_tenant_isolation" ON agent_knowledge FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "agent_automations_tenant_isolation" ON agent_automations FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE POLICY "saved_filters_tenant_isolation" ON saved_filters FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Demo-Tenant für Entwicklung
INSERT INTO tenants (id, name, slug, plan, credits_used, credits_limit)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Unternehmen', 'demo', 'premium', 143, 270000);
