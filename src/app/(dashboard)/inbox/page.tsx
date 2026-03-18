'use client'

import { useState } from 'react'
import { InboxSidebar } from '@/components/inbox/InboxSidebar'
import { ConversationList } from '@/components/inbox/ConversationList'
import { ChatView } from '@/components/inbox/ChatView'
import { ContactDetails } from '@/components/inbox/ContactDetails'
import { mockConversations, mockSavedFilters } from '@/lib/mock-data'
import type { Conversation, ConversationStatus } from '@/types'
import type { InboxFilter } from '@/components/inbox/InboxSidebar'
import { MessageSquare } from 'lucide-react'

function filterConversations(
  conversations: Conversation[],
  filter: InboxFilter,
  tab: ConversationStatus
): Conversation[] {
  let list = conversations

  switch (filter) {
    case 'inbox':
      list = conversations.filter((c) => c.status === 'open')
      break
    case 'drafts':
      return [] // no draft conversations in mock
    case 'all':
      list = conversations
      break
    case 'assigned':
      list = conversations.filter((c) => c.assigned_to === 'me')
      break
    case 'unassigned':
      list = conversations.filter((c) => !c.assigned_to)
      break
    case 'unread':
      list = conversations.filter((c) => !c.is_read)
      break
    case 'starred':
      list = conversations.filter((c) => c.is_starred)
      break
    case 'trash':
    case 'spam':
      return []
    default: {
      // Check if it's a mailbox id
      const isSavedFilter = mockSavedFilters.find((f) => f.id === filter)
      if (isSavedFilter) {
        if (isSavedFilter.name === 'VIP Customer') {
          list = conversations.filter((c) => c.is_starred)
        } else if (isSavedFilter.name === 'New Leads') {
          list = conversations.filter((c) => !c.assigned_to && !c.is_read)
        } else {
          list = conversations
        }
      } else {
        // Mailbox filter
        list = conversations.filter((c) => c.mailbox_id === filter)
      }
    }
  }

  // For filters that don't use tab filtering (like "all", "unread", "starred")
  const noTabFilters: InboxFilter[] = ['all', 'unread', 'starred', 'assigned', 'unassigned']
  if (noTabFilters.includes(filter)) {
    return list.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
  }

  // Apply tab filter
  return list
    .filter((c) => c.status === tab)
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
}

function getFilterTitle(filter: InboxFilter): string {
  switch (filter) {
    case 'inbox': return 'Posteingang'
    case 'drafts': return 'Entwürfe & Geplant'
    case 'all': return 'Alle Unterhaltungen'
    case 'assigned': return 'Mir zugewiesen'
    case 'unassigned': return 'Nicht zugewiesen'
    case 'unread': return 'Ungelesen'
    case 'starred': return 'Markiert'
    case 'trash': return 'Papierkorb'
    case 'spam': return 'Spam'
    default: {
      const saved = mockSavedFilters.find((f) => f.id === filter)
      if (saved) return `${saved.emoji} ${saved.name}`
      const { mockMailboxes } = require('@/lib/mock-data')
      const mb = mockMailboxes.find((m: { id: string; name: string }) => m.id === filter)
      return mb?.name ?? 'Unterhaltungen'
    }
  }
}

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [activeTab, setActiveTab] = useState<ConversationStatus>('open')
  const [activeFilter, setActiveFilter] = useState<InboxFilter>('inbox')
  const [showContactDetails, setShowContactDetails] = useState(false)

  const filtered = filterConversations(mockConversations, activeFilter, activeTab)

  const handleFilterChange = (filter: InboxFilter) => {
    setActiveFilter(filter)
    setSelectedConversation(null)
    setShowContactDetails(false)
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
  }

  return (
    <div className="flex h-full bg-white">
      {/* Inbox Sidebar */}
      <InboxSidebar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Conversation List */}
      <ConversationList
        conversations={filtered}
        selectedId={selectedConversation?.id}
        onSelect={handleSelectConversation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title={getFilterTitle(activeFilter)}
      />

      {/* Chat View or Empty State */}
      {selectedConversation ? (
        <>
          <ChatView
            conversation={selectedConversation}
            onShowContact={() => setShowContactDetails(!showContactDetails)}
            showContactButton
          />
          {showContactDetails && (
            <ContactDetails
              conversation={selectedConversation}
              onClose={() => setShowContactDetails(false)}
            />
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Keine Unterhaltung ausgewählt
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Wähle eine Unterhaltung aus der Liste,<br />um zu antworten oder weiterzulesen.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
