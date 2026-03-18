'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot } from 'lucide-react'
import type { AIAgent, ChatMessage } from '@/types'

interface Props {
  agent: AIAgent
}

export function TestEnvironment({ agent }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          systemPrompt: agent.system_prompt,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-lg">
            {agent.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
            <p className="text-xs text-gray-400">KI-Agent testen</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Teste, wie dein Agent antwortet — und mach ihn bereit für den Live-Einsatz.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl mb-3">
              {agent.avatar}
            </div>
            <p className="text-xs text-gray-500">Schreibe eine Testnachricht um den Agenten auszuprobieren.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-1.5 shrink-0 mt-0.5">
                {agent.avatar}
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-1.5 shrink-0">
              {agent.avatar}
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm">
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={`Teste, was dein KI-Agent kann ...`}
            rows={2}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
