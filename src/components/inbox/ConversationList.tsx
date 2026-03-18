'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, PenSquare, ChevronDown } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Conversation, ConversationStatus } from '@/types'

interface Props {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conv: Conversation) => void
  activeTab: ConversationStatus
  onTabChange: (tab: ConversationStatus) => void
  title?: string
}

const tabs: { key: ConversationStatus; label: string }[] = [
  { key: 'open', label: 'Offen' },
  { key: 'later', label: 'Angehalten' },
  { key: 'done', label: 'Erledigt' },
]

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Gestern'
  return format(d, 'dd.MM.', { locale: de })
}

function ChannelBadge({ channel }: { channel: string }) {
  if (channel === 'whatsapp') {
    return (
      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-white fill-none" strokeWidth="2.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    </div>
  )
}

function ContactAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = [
    'from-blue-200 to-blue-300 text-blue-800',
    'from-green-200 to-green-300 text-green-800',
    'from-purple-200 to-purple-300 text-purple-800',
    'from-orange-200 to-orange-300 text-orange-800',
    'from-pink-200 to-pink-300 text-pink-800',
    'from-teal-200 to-teal-300 text-teal-800',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

export function ConversationList({ conversations, selectedId, onSelect, activeTab, onTabChange, title = 'Alle Unterhaltungen' }: Props) {
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filtered = conversations.filter((c) =>
    search
      ? c.contact_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.preview_text ?? '').toLowerCase().includes(search.toLowerCase())
      : true
  )

  return (
    <div className="w-[300px] border-r border-gray-100 bg-white flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-gray-100">
        {showSearch ? (
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearch('') }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Abbruch
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[13px] font-semibold text-gray-800 truncate max-w-[160px]">{title}</h2>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowSearch(true)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                title="Suchen"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                title="Filter"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                className="w-7 h-7 rounded-lg bg-[#0E7490] hover:bg-[#0c6882] flex items-center justify-center transition-colors"
                title="Neue Unterhaltung"
              >
                <PenSquare className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'flex-1 py-1 text-[12px] rounded-md font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort row */}
        <div className="flex items-center justify-between mt-2">
          <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
            <span>Neueste zuerst</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <span className="text-[11px] text-gray-300">{filtered.length} Unterhaltungen</span>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-gray-500 text-center">Keine Unterhaltungen</p>
            <p className="text-[12px] text-gray-400 mt-1 text-center leading-relaxed">
              {activeTab === 'open' ? 'Alle erledigt — super Arbeit! 🎉' : 'Hier ist noch alles leer.'}
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = selectedId === conv.id
            const isUnread = !conv.is_read
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors relative',
                  isSelected && 'bg-[#EBF5FB]'
                )}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0E7490] rounded-r-full" />
                )}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <ContactAvatar name={conv.contact_name} />
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <ChannelBadge channel={conv.channel} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn(
                        'text-[13px] truncate',
                        isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-800'
                      )}>
                        {conv.contact_name}
                      </span>
                      <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    {conv.mailbox && (
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conv.mailbox.color }} />
                        <span className="text-[11px] text-gray-400">{conv.mailbox.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn(
                        'text-[12px] truncate leading-snug',
                        isUnread ? 'text-gray-700 font-medium' : 'text-gray-400'
                      )}>
                        {conv.preview_text}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {conv.is_starred && <span className="text-yellow-400 text-xs">★</span>}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#0E7490] shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
