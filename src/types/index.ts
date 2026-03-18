// AI Stream – TypeScript Typen

export type Channel = 'whatsapp' | 'email' | 'instagram' | 'telegram'
export type ConversationStatus = 'open' | 'later' | 'done'
export type MessageRole = 'customer' | 'agent' | 'ai'
export type AutomationType = 'always' | 'first_contact' | 'chat_open' | 'outside_hours' | 'manual'
export type AutomationStatus = 'draft' | 'active' | 'paused'
export type KnowledgeType = 'website' | 'file' | 'qa'
export type KnowledgeStatus = 'pending' | 'processing' | 'ready' | 'error'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'premium' | 'enterprise'
  credits_used: number
  credits_limit: number
  created_at: string
}

export interface User {
  id: string
  tenant_id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'owner' | 'admin' | 'agent'
}

export interface Mailbox {
  id: string
  tenant_id: string
  name: string
  color: string
  position: number
}

export interface SavedFilter {
  id: string
  tenant_id: string
  name: string
  emoji: string
  config: Record<string, unknown>
  position: number
}

export interface Conversation {
  id: string
  tenant_id: string
  mailbox_id?: string
  channel: Channel
  status: ConversationStatus
  contact_name: string
  contact_identifier: string
  assigned_to?: string
  last_message_at: string
  is_read: boolean
  is_starred: boolean
  preview_text?: string
  mailbox?: Mailbox
  created_at: string
}

export interface Message {
  id: string
  tenant_id: string
  conversation_id: string
  role: MessageRole
  content: string
  channel: Channel
  is_note: boolean
  sent_at: string
}

export interface AIAgent {
  id: string
  tenant_id: string
  name: string
  avatar: string
  description?: string
  system_prompt?: string
  style_prompt?: string
  is_active: boolean
  pinecone_namespace?: string
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface AgentKnowledge {
  id: string
  tenant_id: string
  agent_id: string
  type: KnowledgeType
  name: string
  content: Record<string, unknown>
  status: KnowledgeStatus
  pages_count: number
  created_at: string
}

export interface QAItem {
  id: string
  question: string
  answer: string
}

export interface QAList {
  id: string
  name: string
  items: QAItem[]
}

export interface Automation {
  id: string
  tenant_id: string
  agent_id?: string
  name: string
  type: AutomationType
  flow_config: FlowConfig
  status: AutomationStatus
  runs: number
  tasks: number
  folder?: string
  created_by?: string
  created_by_name?: string
  created_at: string
  updated_at: string
}

export interface FlowConfig {
  nodes: FlowNode[]
  edges: FlowEdge[]
  instructions?: string
}

export interface FlowNode {
  id: string
  type: 'trigger' | 'filter' | 'action' | 'ai_agent' | 'start'
  position: { x: number; y: number }
  data: FlowNodeData
}

export interface FlowNodeData {
  label: string
  description?: string
  config?: Record<string, unknown>
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
