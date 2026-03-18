'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  CheckCheck,
  Paperclip,
  FileText,
  Send,
  Smile,
  ChevronDown,
  UserRound,
  UserPlus,
  Tag,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  PanelRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockMessages } from '@/lib/mock-data'
import type { Conversation } from '@/types'

interface Props {
  conversation: Conversation
  onShowContact?: () => void
  showContactButton?: boolean
}

export function ChatView({ conversation, onShowContact, showContactButton = true }: Props) {
  const [message, setMessage] = useState('')
  const [isNote, setIsNote] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messages = mockMessages[conversation.id] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const initials = conversation.contact_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0 bg-white">
        {/* Contact info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center text-xs font-bold text-teal-700">
            {initials}
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900 leading-tight">
              {conversation.contact_name}
            </h3>
            <p className="text-[11px] text-gray-400">
              via {conversation.contact_identifier}
            </p>
          </div>
        </div>

        {/* Action buttons — like Superchat reference */}
        <div className="flex items-center gap-0.5">
          <ActionBtn icon={UserPlus} label="Zuweisen" />
          <ActionBtn icon={Tag} label="Labels" />
          <ActionBtn icon={Clock} label="Anhalten" />
          <ActionBtn icon={CheckCircle2} label="Erledigt" highlight />
          <ActionBtn icon={MoreHorizontal} label="Mehr" />
          {showContactButton && (
            <button
              onClick={onShowContact}
              className="w-8 h-8 ml-1 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Kontaktdetails"
            >
              <PanelRight className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-[#F9FAFB]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <UserRound className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Noch keine Nachrichten</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isCustomer = msg.role === 'customer'
            const isNote = msg.is_note
            const showDate =
              idx === 0 ||
              format(new Date(messages[idx - 1].sent_at), 'dd.MM.yyyy') !==
                format(new Date(msg.sent_at), 'dd.MM.yyyy')

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-[11px] text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                      {format(new Date(msg.sent_at), "EEEE, d. MMMM", { locale: de })}
                    </span>
                  </div>
                )}

                {/* Internal note */}
                {isNote ? (
                  <div className="flex justify-end">
                    <div className="max-w-sm bg-yellow-50 border border-yellow-100 px-4 py-2.5 rounded-2xl rounded-tr-md">
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] font-semibold text-yellow-600 uppercase tracking-wide">
                          Interne Notiz
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] text-yellow-400 text-right mt-1">
                        {format(new Date(msg.sent_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={cn('flex', isCustomer ? 'justify-start' : 'justify-end')}>
                    {isCustomer && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 mr-2 mt-1 shrink-0">
                        {conversation.contact_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-sm px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed',
                        isCustomer
                          ? 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-100'
                          : 'bg-[#0E7490] text-white rounded-tr-md shadow-sm'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className={cn('flex items-center gap-1 mt-1.5', isCustomer ? 'justify-start' : 'justify-end')}>
                        <span className={cn('text-[10px]', isCustomer ? 'text-gray-400' : 'text-white/60')}>
                          {format(new Date(msg.sent_at), 'HH:mm')}
                        </span>
                        {!isCustomer && <CheckCheck className="w-3 h-3 text-white/60" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-4 shrink-0">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-2.5">
          <button
            onClick={() => setIsNote(false)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all',
              !isNote
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            <Send className="w-3 h-3" />
            Antworten
          </button>
          <button
            onClick={() => setIsNote(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all',
              isNote
                ? 'bg-yellow-50 text-yellow-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            <FileText className="w-3 h-3" />
            Notiz
          </button>
          <div className="ml-auto">
            <button className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              WhatsApp Vorlage
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div
            className={cn(
              'flex-1 border rounded-xl overflow-hidden transition-all',
              isNote
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-gray-200 bg-white focus-within:border-[#0E7490] focus-within:ring-2 focus-within:ring-[#0E7490]/10'
            )}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isNote
                  ? 'Interne Notiz — nur für dein Team sichtbar...'
                  : 'Nachricht schreiben...'
              }
              rows={2}
              className="w-full resize-none px-3.5 py-2.5 text-[13px] focus:outline-none bg-transparent leading-relaxed"
            />
            <div className="flex items-center px-3 pb-2 gap-2">
              <button className="text-gray-300 hover:text-gray-500 transition-colors" title="Emoji">
                <Smile className="w-4 h-4" />
              </button>
              <button className="text-gray-300 hover:text-gray-500 transition-colors" title="Datei">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-9 h-9 rounded-xl bg-[#0E7490] hover:bg-[#0c6882] disabled:opacity-30 flex items-center justify-center transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  icon: Icon,
  label,
  highlight = false,
}: {
  icon: React.ElementType
  label: string
  highlight?: boolean
}) {
  return (
    <button
      title={label}
      className={cn(
        'flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-colors group',
        highlight
          ? 'text-[#0E7490] hover:bg-teal-50'
          : 'text-gray-500 hover:bg-gray-100'
      )}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  )
}
