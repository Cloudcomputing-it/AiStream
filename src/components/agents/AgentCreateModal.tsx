'use client'

import { useState } from 'react'
import { X, Paperclip, Globe, Loader2, ArrowUp } from 'lucide-react'
import type { AIAgent } from '@/types'

interface Props {
  onClose: () => void
  onCreated: (agent: AIAgent) => void
}

const templates = [
  { key: 'support', label: 'Support-Agent', emoji: '🎧' },
  { key: 'sales', label: 'Vertrieb-Agent', emoji: '💼' },
  { key: 'recruiting', label: 'Recruiting-Agent', emoji: '👤' },
]

export function AgentCreateModal({ onClose, onCreated }: Props) {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!description.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      if (!res.ok) throw new Error('API-Fehler')
      const agent = await res.json()
      onCreated(agent)
    } catch {
      // Fallback: lokaler Mock-Agent
      const mockAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        tenant_id: '00000000-0000-0000-0000-000000000001',
        name: 'SupportBuddy',
        avatar: '🤖',
        description,
        system_prompt: `Du bist ein freundlicher, intelligenter und effizienter KI-Agent. Deine Aufgabe ist es, Kunden bei Fragen, Problemen und Anliegen zu unterstützen.\n\nKernaufgaben:\n1. Begrüße die Kunden freundlich und stelle dich vor.\n2. Höre aufmerksam zu und verstehe die Anliegen.\n3. Biete klare, leicht verständliche Lösungen an.\n4. Erstelle eine interne Notiz, wenn ein Anliegen erfolgreich gelöst wurde.\n5. Übergib an einen menschlichen Agenten nur, wenn technische Unterstützung erforderlich ist.\n6. Schließe jedes Gespräch positiv ab.`,
        style_prompt: `Ton: freundlich, empathisch und professionell — niemals robotisch.\nStil: kurz, klar und lösungsorientiert.\nStruktur:\n- Beginne mit Empathie\n- Biete hilfreiche Schritte an\n- Schließe mit einer freundlichen Rückfrage`,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      onCreated(mockAgent)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className="rounded-2xl p-12 max-w-md w-full text-center"
          style={{
            background: 'linear-gradient(135deg, #e0f2f1 0%, #e8f4fd 50%, #f0f4ff 100%)',
          }}
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-2xl bg-white/50 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Dein KI-Agent wird konfiguriert ...
          </h3>
          <p className="text-sm text-gray-500">Das dauert nur ein paar Sekunden.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div
          className="p-6"
          style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #f0fdfa 100%)',
          }}
        >
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">
            Was soll dein KI-Agent für dich tun?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Beschreib in deinen Worten, was dein Agent tun soll.
          </p>

          {/* Input */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) handleCreate()
              }}
              placeholder="Erstelle einen Versicherungs-Agenten, der..."
              rows={5}
              className="w-full p-4 text-sm resize-none focus:outline-none"
              autoFocus
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  Datei
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  Webseite
                </button>
              </div>
              <button
                onClick={handleCreate}
                disabled={!description.trim()}
                className="w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Quick-Start Templates */}
          <div className="flex items-center gap-2 mt-4 justify-center flex-wrap">
            {templates.map((t) => (
              <button
                key={t.key}
                onClick={() =>
                  setDescription(
                    `Erstelle einen ${t.label}, der Kunden professionell und freundlich betreut.`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white/70 hover:bg-white text-xs text-gray-600 transition-colors"
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
