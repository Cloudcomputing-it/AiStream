'use client'

import { useState } from 'react'
import {
  Plus,
  Folder,
  Search,
  Edit,
  MoreHorizontal,
  ChevronRight,
  Bot,
  Zap,
  Clock,
  User,
  MessageSquare,
  X,
  PlayCircle,
  Sparkles,
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { mockAutomations } from '@/lib/mock-data'
import { FlowBuilder } from '@/components/flow/FlowBuilder'
import { cn } from '@/lib/utils'
import type { Automation, AutomationType } from '@/types'

const automationTypeOptions = [
  {
    key: 'always' as AutomationType,
    icon: Bot,
    label: 'KI-Agent antwortet immer',
    description: 'KI antwortet auf alle eingehenden Nachrichten.',
    color: 'text-teal-600 bg-teal-50 border-teal-100',
  },
  {
    key: 'first_contact' as AutomationType,
    icon: User,
    label: 'Nur bei Erstkontakt',
    description: 'Aktiviert nur bei neuen Kunden oder Leads.',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    key: 'chat_open' as AutomationType,
    icon: MessageSquare,
    label: 'Bei jeder Chat-Eröffnung',
    description: 'Antwortet bei neu geöffneten Support-Chats.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'outside_hours' as AutomationType,
    icon: Clock,
    label: 'Außerhalb der Öffnungszeiten',
    description: 'Antwortet automatisch, wenn dein Team offline ist.',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    key: 'manual' as AutomationType,
    icon: Zap,
    label: 'Manuelle Übergabe an KI',
    description: 'KI übernimmt, wenn dein Team manuell übergibt.',
    color: 'text-gray-600 bg-gray-50 border-gray-200',
  },
]

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState<'automations' | 'activity'>('automations')
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [activeAutomation, setActiveAutomation] = useState<Automation | null>(null)

  const handleNewAutomation = () => setShowTypeSelector(true)

  const handleSelectType = (type: AutomationType) => {
    const now = new Date().toISOString()
    const label = automationTypeOptions.find((o) => o.key === type)?.label ?? 'Neue Automation'
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: label,
      type,
      flow_config: { nodes: [], edges: [] },
      status: 'draft',
      runs: 0,
      tasks: 0,
      folder: 'My Automations',
      created_by_name: 'Mika Hally',
      created_at: now,
      updated_at: now,
    }
    setAutomations((prev) => [...prev, newAuto])
    setActiveAutomation(newAuto)
    setShowTypeSelector(false)
  }

  const handlePublish = () => {
    if (!activeAutomation) return
    setAutomations((prev) =>
      prev.map((a) => (a.id === activeAutomation.id ? { ...a, status: 'active' } : a))
    )
  }

  // Show Flow Builder
  if (activeAutomation) {
    return (
      <div className="h-full">
        <FlowBuilder
          automationType={activeAutomation.type}
          automationName={activeAutomation.name}
          onPublish={handlePublish}
          onBack={() => setActiveAutomation(null)}
        />
      </div>
    )
  }

  // Type Selector Modal
  if (showTypeSelector) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Automation erstellen</h2>
              <p className="text-xs text-gray-400 mt-0.5">Wähle, wann dein KI-Agent aktiv wird</p>
            </div>
            <button
              onClick={() => setShowTypeSelector(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="p-3">
            {automationTypeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelectType(option.key)}
                className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${option.color}`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Automationen</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Lass AI Stream für dich arbeiten — 24/7, ohne Unterbrechung.
            </p>
          </div>
          <div className="flex items-start gap-3">
            {/* Credits Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 text-right min-w-36 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">Automationen</span>
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">Upgrade</button>
              </div>
              <p className="text-xs text-gray-400 mb-1.5">Premium Plan</p>
              <div className="flex items-center justify-between text-xs text-gray-600 font-semibold mb-1">
                <span>0</span><span className="text-gray-400 font-normal">/ 24</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div className="bg-teal-500 h-1 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <button
              onClick={handleNewAutomation}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Neue Automation
            </button>
          </div>
        </div>

        {/* Academy Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-sm">
          <div className="relative z-10 text-white max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">AI Stream Academy</p>
            </div>
            <h3 className="text-base font-semibold mb-3">Lerne alles über AI Stream — einfach erklärt.</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-semibold transition-colors">
              <PlayCircle className="w-3.5 h-3.5" />
              Jetzt entdecken
            </button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-28 bg-white/10 rounded-2xl" />
          <div className="absolute right-16 top-4 w-10 h-10 bg-white/15 rounded-xl" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-5">
          {[
            { key: 'automations', label: 'Automationen' },
            { key: 'activity', label: 'Aktivitätsprotokoll' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Automation suchen..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            <Folder className="w-4 h-4 text-gray-400" />
            Ordner erstellen
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Name', 'Erstellt von', 'Zuletzt bearbeitet', 'Status', 'Runs', 'Tasks'].map((col) => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {/* Folder Row */}
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3" colSpan={6}>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    <Folder className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">My Automations</span>
                    <span className="text-xs text-gray-400 ml-1">({automations.length})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                      <Edit className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>

              {automations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Noch keine Automationen</p>
                      <p className="text-xs text-gray-400">Erstelle deine erste Automation mit dem Button oben rechts.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                automations.map((auto) => (
                  <tr
                    key={auto.id}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setActiveAutomation(auto)}
                  >
                    <td className="px-4 py-3.5 pl-10">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{auto.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {format(new Date(auto.created_at), 'dd. MMM yyyy', { locale: de })}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                          {(auto.created_by_name || 'M')[0]}
                        </div>
                        <span className="text-sm text-gray-600">{auto.created_by_name || 'Mika Hally'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-400">
                      Heute, {format(new Date(auto.updated_at), 'HH:mm', { locale: de })} Uhr
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          auto.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : auto.status === 'paused'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {auto.status === 'active' ? '● Aktiv' : auto.status === 'paused' ? '⏸ Pausiert' : '○ Entwurf'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{auto.runs}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{auto.tasks}</td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                          <Edit className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                          <MoreHorizontal className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
