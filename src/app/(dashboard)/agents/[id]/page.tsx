'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Target,
  Database,
  Wrench,
  Zap,
  CreditCard,
  Globe,
  Upload,
  Plus,
  ChevronDown,
  Maximize2,
  Minimize2,
  ExternalLink,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { TestEnvironment } from '@/components/agents/TestEnvironment'
import type { AIAgent } from '@/types'

const sectionNav = [
  { key: 'personality', label: 'Ziele & Persönlichkeit', icon: Target },
  { key: 'knowledge', label: 'Wissen & Daten', icon: Database },
  { key: 'tools', label: 'Tools & Aktionen', icon: Wrench },
  { key: 'automations', label: 'Automationen', icon: Zap },
  { key: 'credits', label: 'Credits & Nutzung', icon: CreditCard },
]

const automationOptions = [
  {
    key: 'always',
    label: 'KI-Agent antwortet immer',
    description: 'KI antwortet immer, Mensch springt nur bei Bedarf ein.',
  },
  {
    key: 'first_contact',
    label: 'Nur bei Erstkontakt',
    description: 'Aktiviert nur bei neuen Kunden oder Leads (erste Nachricht).',
  },
  {
    key: 'chat_open',
    label: 'Bei jeder Chat-Eröffnung (Support & Ticketing)',
    description: 'Antwortet bei neu geöffneten Support-Chats & Tickets.',
  },
  {
    key: 'outside_hours',
    label: 'Nur außerhalb Öffnungszeiten',
    description: 'Antwortet automatisch, wenn dein Team offline ist.',
  },
  {
    key: 'manual',
    label: 'Manuelle Übergabe an KI-Agenten',
    description: 'KI übernimmt, wenn dein Team manuell übergibt.',
  },
]

// Demo agent data – in production: fetch from Supabase
function getDemoAgent(id: string): AIAgent {
  return {
    id,
    tenant_id: '00000000-0000-0000-0000-000000000001',
    name: 'SupportBuddy',
    avatar: '🤖',
    description: 'KI-Support-Agent für Kundenfragen',
    system_prompt: `Du bist ein freundlicher, intelligenter und effizienter AI Support Agent für AI Stream. Deine Aufgabe ist es, Kunden bei Fragen, Problemen und Anliegen rund um die Nutzung von AI Stream zu unterstützen. Du repräsentierst die vertrauenswürdige und hilfsbereite Stimme von AI Stream und sorgst dafür, dass sich jeder Kunde gehört und unterstützt fühlt.\nKernaufgaben:\n1. Begrüße die Kunden freundlich und stelle dich als AI Support Agent vor: "Ich bin SupportBuddy, dein AI Support Agent von AI Stream. Wie kann ich dir helfen?"\n2. Höre aufmerksam zu und verstehe die Anliegen der Kunden. Stelle bei Bedarf kurze, relevante Rückfragen.\n3. Biete klare, leicht verständliche Lösungen oder nächste Schritte basierend auf den häufigsten Fragen und Problemen (z.B. Kontoerstellung, technische Schwierigkeiten, Zahlungsfragen).\n4. Bestätige die Lösung, wenn das Problem behoben scheint, und erstelle eine kurze interne Notiz für das Team.\n5. Erstelle eine interne Notiz, wenn:\n- Ein Anliegen erfolgreich gelöst wurde.\n- Der Kunde um Unterstützung durch einen menschlichen Agenten bittet.\n- Halte die Notiz kurz und prägnant (max. 2-3 Sätze).\n6. Übergabe an einen menschlichen Agenten nur, wenn:\n- Das Anliegen technische Unterstützung erfordert oder\n- Der Kunde ausdrücklich darum bittet.\n7. Schließe jedes Gespräch positiv ab, mit einem freundlichen und beruhigenden Ton.`,
    style_prompt: `Ton: freundlich, empathisch und professionell — wie ein hilfsbereit AI Stream-Experte, niemals robotisch oder zu lässig.\nStil: kurz, klar und lösungsorientiert.\nStruktur für jede Nachricht:\n- Beginne mit Empathie oder Anerkennung ("Das tut mir leid, das ist frustrierend — keine Sorge, ich helfe dir dabei!").\n- Biete die hilfreichen Schritte oder eine kurze Erklärung an.\n- Schließe mit einer freundlichen Rückfrage oder Bestätigung.`,
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AgentConfigPage({ params }: PageProps) {
  const { id } = use(params)
  const [agent, setAgent] = useState<AIAgent>(getDemoAgent(id))
  const [activeSection, setActiveSection] = useState('personality')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [websites, setWebsites] = useState<{ url: string; pages: number; status: 'processing' | 'ready' }[]>([])
  const [expandedPrompt, setExpandedPrompt] = useState(false)

  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) return
    setWebsites((prev) => [...prev, { url: websiteUrl, pages: 0, status: 'processing' }])
    setWebsiteUrl('')
    // Simulate crawling
    setTimeout(() => {
      setWebsites((prev) =>
        prev.map((w) =>
          w.url === websiteUrl ? { ...w, pages: Math.floor(Math.random() * 50) + 5, status: 'ready' } : w
        )
      )
    }, 2000)
  }

  return (
    <div className="flex h-full">
      {/* Agent Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link
            href="/agents"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Alle Agenten</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-xl shrink-0">
              {agent.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{agent.name}</p>
              <p className="text-xs text-gray-400">KI-Agent konfigurieren</p>
            </div>
          </div>
        </div>

        <nav className="p-2 flex-1">
          {sectionNav.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left mb-0.5 ${
                activeSection === item.key
                  ? 'bg-teal-50 text-teal-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 shrink-0 ${activeSection === item.key ? 'text-teal-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-white min-w-0">
        {/* Personality Section */}
        {activeSection === 'personality' && (
          <div className="max-w-2xl mx-auto p-6">
            {/* Hero Banner */}
            <div className="w-full h-24 rounded-xl bg-gradient-to-br from-teal-100 to-blue-100 mb-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-teal-600 uppercase tracking-wider">KI-Agent</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">Ziele & Persönlichkeit</h2>
            <p className="text-sm text-gray-500 mb-6">
              Lege fest, wie dein KI-Agent spricht, denkt und arbeitet.
            </p>

            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-xs text-gray-400 mb-2">Der Name wird nur intern in AI Stream angezeigt.</p>
              <input
                type="text"
                value={agent.name}
                onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Avatar */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <p className="text-xs text-gray-400 mb-2">Nur für dich und dein Team sichtbar.</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-2xl cursor-pointer hover:border-teal-400 transition-colors">
                  {agent.avatar}
                </div>
                <div className="flex gap-2">
                  {['🤖', '🎧', '💼', '👤', '🏆', '⚡', '🌟', '🎯'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAgent({ ...agent, avatar: emoji })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors ${
                        agent.avatar === emoji ? 'bg-teal-50 ring-2 ring-teal-500' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Role & Tasks */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Rolle & Aufgaben</span>
                  <span className="text-xs text-gray-400">Definiere, welche Rolle die KI übernimmt und was sie konkret tun soll.</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <div className="px-4 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was macht der KI-Agent konkret?
                </label>
                <div className="relative">
                  <textarea
                    value={agent.system_prompt || ''}
                    onChange={(e) => setAgent({ ...agent, system_prompt: e.target.value })}
                    rows={expandedPrompt ? 20 : 10}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                  <button
                    onClick={() => setExpandedPrompt(!expandedPrompt)}
                    className="absolute top-2 right-2 w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    {expandedPrompt ? (
                      <Minimize2 className="w-3 h-3 text-gray-500" />
                    ) : (
                      <Maximize2 className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Style & Language */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Stil & Sprache</span>
                  <span className="text-xs text-gray-400">Lege fest, wie die KI kommuniziert.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">optional</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </button>
              <div className="px-4 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wie soll der KI-Agent kommunizieren?
                </label>
                <textarea
                  value={agent.style_prompt || ''}
                  onChange={(e) => setAgent({ ...agent, style_prompt: e.target.value })}
                  rows={8}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Section */}
        {activeSection === 'knowledge' && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="w-full h-24 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Wissen & Daten</h2>
            <p className="text-sm text-gray-500 mb-6">
              Definiere, auf welches Wissen dein KI-Agent zugreifen kann.
            </p>

            {/* Websites */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Webseiten <span className="text-gray-400">{websites.length}</span>
                  </h3>
                  <p className="text-xs text-gray-400">Verbinde deine Website, damit dein KI-Agent alles weiß, was er braucht.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <Plus className="w-3.5 h-3.5" />
                  Webseite hinzufügen
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://beispiel.de"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWebsite()}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={handleAddWebsite}
                  className="px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700"
                >
                  Hinzufügen
                </button>
              </div>

              {websites.map((site, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{site.url}</p>
                    <p className="text-xs text-gray-400">
                      {site.status === 'processing'
                        ? 'Wird gecrawlt...'
                        : `${site.pages} Seiten zugänglich gemacht`}
                    </p>
                  </div>
                  {site.status === 'processing' ? (
                    <Clock className="w-4 h-4 text-gray-400 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>

            {/* Files */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Dateien <span className="text-gray-400">0</span>
                  </h3>
                  <p className="text-xs text-gray-400">Lade Dateien hoch, damit dein KI-Agent alles weiß, was er braucht.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <Upload className="w-3.5 h-3.5" />
                  Datei hochladen
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">PDF, DOCX oder XLSX hier ablegen</p>
              </div>
            </div>

            {/* Q&A */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Q&A Listen <span className="text-gray-400">0</span>
                  </h3>
                  <p className="text-xs text-gray-400">Füge häufige Fragen hinzu, die dein Chatbot beantworten können sollte.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <Plus className="w-3.5 h-3.5" />
                  Q&A erstellen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tools Section */}
        {activeSection === 'tools' && (
          <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Tools & Aktionen</h2>
            <p className="text-sm text-gray-500 mb-8">
              Verbinde deinen KI-Agenten mit externen Diensten und Aktionen.
            </p>
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
              <Wrench className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-base font-medium text-gray-500 mb-1">Tools hinzufügen</h3>
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          </div>
        )}

        {/* Automations Section */}
        {activeSection === 'automations' && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="w-full h-24 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 mb-6" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Automationen</h2>
            <p className="text-sm text-gray-500 mb-2">
              Bestimme, wann und wie dein KI-Agent aktiv wird.
            </p>
            <p className="text-sm font-medium text-gray-700 mb-4">Wähle, wann dein KI-Agent aktiv wird:</p>

            <div className="space-y-2">
              {automationOptions.map((option) => (
                <Link
                  key={option.key}
                  href={`/automations?type=${option.key}&agent=${agent.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                      <Zap className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-teal-500" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Credits Section */}
        {activeSection === 'credits' && (
          <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Credits & Nutzung</h2>
            <p className="text-sm text-gray-500 mb-6">Übersicht über deinen Verbrauch und deinen Plan.</p>

            <div className="border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">AI-Credits</p>
                  <p className="text-xs text-gray-400">Limit wird in 5 Tagen zurückgesetzt</p>
                </div>
                <span className="text-sm font-bold text-gray-900">143 / 270K</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${(143 / 270000) * 100}%` }}
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Aktueller Plan</p>
                <p className="text-xs text-gray-400">Premium Plan – unbegrenzte Agenten</p>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700">
                Upgraden
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Test Environment */}
      <TestEnvironment agent={agent} />
    </div>
  )
}
