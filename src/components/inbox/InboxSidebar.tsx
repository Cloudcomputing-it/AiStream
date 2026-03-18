'use client'

import { useState } from 'react'
import {
  Inbox,
  FileText,
  MessageSquare,
  User,
  UserX,
  Mail,
  Star,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockMailboxes, mockSavedFilters, mockConversations } from '@/lib/mock-data'

export type InboxFilter =
  | 'inbox'
  | 'drafts'
  | 'all'
  | 'assigned'
  | 'unassigned'
  | 'unread'
  | 'starred'
  | 'trash'
  | 'spam'
  | string // mailbox id or saved filter id

const navItems: { icon: typeof Inbox; label: string; filter: InboxFilter; countFn?: () => number }[] = [
  {
    icon: Inbox,
    label: 'Posteingang',
    filter: 'inbox',
    countFn: () => mockConversations.filter((c) => c.status === 'open').length,
  },
  { icon: FileText, label: 'Entwürfe & Geplant', filter: 'drafts' },
  { icon: MessageSquare, label: 'Alle Unterhaltungen', filter: 'all' },
  {
    icon: User,
    label: 'Mir zugewiesen',
    filter: 'assigned',
    countFn: () => mockConversations.filter((c) => c.assigned_to === 'me').length,
  },
  {
    icon: UserX,
    label: 'Nicht zugewiesen',
    filter: 'unassigned',
    countFn: () => mockConversations.filter((c) => !c.assigned_to).length,
  },
  {
    icon: Mail,
    label: 'Ungelesen',
    filter: 'unread',
    countFn: () => mockConversations.filter((c) => !c.is_read).length,
  },
  {
    icon: Star,
    label: 'Markiert',
    filter: 'starred',
    countFn: () => mockConversations.filter((c) => c.is_starred).length,
  },
  { icon: Trash2, label: 'Papierkorb', filter: 'trash' },
  { icon: AlertTriangle, label: 'Spam', filter: 'spam' },
]

interface InboxSidebarProps {
  activeFilter: InboxFilter
  onFilterChange: (filter: InboxFilter) => void
}

export function InboxSidebar({ activeFilter, onFilterChange }: InboxSidebarProps) {
  const [mailboxOpen, setMailboxOpen] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(true)

  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col overflow-y-auto shrink-0 select-none">
      {/* Navigation */}
      <div className="px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const count = item.countFn?.()
          const isActive = activeFilter === item.filter
          return (
            <button
              key={item.filter}
              onClick={() => onFilterChange(item.filter)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all text-left',
                isActive
                  ? 'bg-[#EBF5FB] text-[#0E7490] font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon
                className={cn('w-[15px] h-[15px] shrink-0', isActive ? 'text-[#0E7490]' : 'text-gray-400')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {count != null && count > 0 && (
                <span className={cn(
                  'text-[11px] font-semibold min-w-[18px] text-center px-1',
                  isActive ? 'text-[#0E7490]' : 'text-gray-400'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-gray-100 my-1" />

      {/* Postfächer / Inboxes */}
      <div className="px-2">
        <button
          onClick={() => setMailboxOpen(!mailboxOpen)}
          className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          {mailboxOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Postfächer
        </button>

        {mailboxOpen && (
          <div className="mt-0.5 pb-1">
            {mockMailboxes.map((mb) => {
              const isActive = activeFilter === mb.id
              const count = mockConversations.filter(
                (c) => c.mailbox_id === mb.id && c.status === 'open'
              ).length
              return (
                <button
                  key={mb.id}
                  onClick={() => onFilterChange(mb.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all text-left',
                    isActive
                      ? 'bg-[#EBF5FB] text-[#0E7490] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: mb.color }}
                  />
                  <span className="flex-1 truncate">{mb.name}</span>
                  {count > 0 && (
                    <span className={cn(
                      'text-[11px] font-semibold',
                      isActive ? 'text-[#0E7490]' : 'text-gray-400'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
            <button className="w-full flex items-center gap-2.5 px-3 py-[7px] text-[13px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Neues Postfach
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-gray-100 my-1" />

      {/* Gespeicherte Filter */}
      <div className="px-2 pb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          {filtersOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Gespeicherte Filter
        </button>

        {filtersOpen && (
          <div className="mt-0.5">
            {mockSavedFilters.map((f) => {
              const isActive = activeFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => onFilterChange(f.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all text-left',
                    isActive
                      ? 'bg-[#EBF5FB] text-[#0E7490] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span className="text-sm leading-none">{f.emoji}</span>
                  <span className="truncate flex-1">{f.name}</span>
                </button>
              )
            })}
            <button className="w-full flex items-center gap-2.5 px-3 py-[7px] text-[13px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Filter erstellen
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
