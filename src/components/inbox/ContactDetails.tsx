'use client'

import { useState } from 'react'
import {
  X,
  ChevronRight,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Tag,
  FileText,
  StickyNote,
  Zap,
  Plus,
  ExternalLink,
} from 'lucide-react'
import type { Conversation } from '@/types'

interface Props {
  conversation: Conversation
  onClose: () => void
}

const sections = [
  { key: 'info', label: 'Kontaktinformationen', icon: UserRound },
  { key: 'files', label: 'Dateien', icon: FileText },
  { key: 'notes', label: 'Notizen', icon: StickyNote },
  { key: 'automations', label: 'Automationen', icon: Zap },
]

export function ContactDetails({ conversation, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>('info')
  const [lists, setLists] = useState<string[]>([])

  const initials = conversation.contact_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-64 bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Kontakt</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* Contact Avatar + Name */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center text-lg font-bold text-teal-700 mb-3">
          {initials}
        </div>
        <p className="text-sm font-semibold text-gray-900 text-center">{conversation.contact_name}</p>
        <p className="text-xs text-gray-400 mt-0.5 text-center">{conversation.contact_identifier}</p>
        <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-3 h-3" />
          Profil öffnen
        </button>
      </div>

      {/* Contact Lists */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Kontaktlisten
        </p>
        {lists.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Keiner Liste zugewiesen</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {lists.map((l) => (
              <span key={l} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{l}</span>
            ))}
          </div>
        )}
        <button
          onClick={() => setLists((prev) => [...prev, 'VIP Customer'])}
          className="mt-2 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Liste hinzufügen
        </button>
      </div>

      {/* Expandable Sections */}
      <div className="flex-1">
        {sections.map((section) => (
          <div key={section.key} className="border-b border-gray-100">
            <button
              onClick={() => setExpanded(expanded === section.key ? null : section.key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <section.icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{section.label}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 text-gray-300 transition-transform ${
                  expanded === section.key ? 'rotate-90' : ''
                }`}
              />
            </button>

            {expanded === section.key && (
              <div className="px-4 pb-4">
                {section.key === 'info' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="text-xs text-gray-500">{conversation.contact_identifier}</span>
                    </div>
                    {conversation.channel === 'email' && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="text-xs text-gray-500">{conversation.contact_identifier}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="text-xs text-gray-400 italic">Kein Standort</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="text-xs text-gray-400 italic">Keine Tags</span>
                    </div>
                    <button className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-1">
                      <Plus className="w-3 h-3" /> Info hinzufügen
                    </button>
                  </div>
                )}
                {section.key === 'files' && (
                  <div className="text-center py-4">
                    <FileText className="w-6 h-6 text-gray-200 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400">Noch keine Dateien</p>
                  </div>
                )}
                {section.key === 'notes' && (
                  <div>
                    <textarea
                      placeholder="Notiz hinzufügen..."
                      rows={3}
                      className="w-full text-xs border border-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                )}
                {section.key === 'automations' && (
                  <div className="text-center py-4">
                    <Zap className="w-6 h-6 text-gray-200 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400">Keine aktiven Automationen</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
