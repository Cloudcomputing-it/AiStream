'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Bot, Sparkles, Clock } from 'lucide-react'
import { AgentCreateModal } from '@/components/agents/AgentCreateModal'
import { mockAgents } from '@/lib/mock-data'
import type { AIAgent } from '@/types'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents)
  const [showModal, setShowModal] = useState(false)

  const handleCreated = (agent: AIAgent) => {
    setAgents((prev) => [...prev, agent])
    setShowModal(false)
    router.push(`/agents/${agent.id}`)
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">KI-Agenten</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Smarte Agenten, die rund um die Uhr für dich arbeiten.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Neuer KI-Agent
          </button>
        </div>

        {/* Empty State */}
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[420px]">
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 flex items-center justify-center">
                <Bot className="w-16 h-16 text-teal-300" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Erstelle deinen ersten KI-Agenten
            </h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center max-w-sm">
              Beschreib in eigenen Worten, was dein Agent tun soll — AI Stream konfiguriert ihn automatisch.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              KI-Agent erstellen
            </button>

            {/* Quick tips */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg w-full">
              {[
                { emoji: '🎧', label: 'Support-Agent', hint: 'Beantwortet Kundenfragen automatisch' },
                { emoji: '💼', label: 'Vertrieb-Agent', hint: 'Qualifiziert neue Leads für dich' },
                { emoji: '👤', label: 'Recruiting-Agent', hint: 'Vorscreening von Bewerbern' },
              ].map((tip) => (
                <button
                  key={tip.label}
                  onClick={() => setShowModal(true)}
                  className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-2xl mb-2">{tip.emoji}</div>
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">{tip.label}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{tip.hint}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => router.push(`/agents/${agent.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:border-teal-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {agent.avatar}
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      agent.is_active
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {agent.is_active ? '● Aktiv' : '○ Inaktiv'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{agent.name}</h3>
                {agent.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{agent.description}</p>
                )}
                <div className="flex items-center gap-1 mt-3 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Zuletzt aktiv: heute</span>
                </div>
              </button>
            ))}

            {/* Add new card */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 text-left hover:border-teal-300 hover:bg-teal-50 transition-all flex flex-col items-center justify-center min-h-[140px] group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center mb-2 transition-colors">
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 group-hover:text-teal-700 transition-colors">
                Neuer KI-Agent
              </p>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <AgentCreateModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}
    </div>
  )
}
