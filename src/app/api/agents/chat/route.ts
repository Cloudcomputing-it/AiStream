import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { agentId, systemPrompt, messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Nachrichten erforderlich' }, { status: 400 })
    }

    const defaultSystemPrompt = `Du bist ein freundlicher, intelligenter und effizienter KI-Agent.
Deine Aufgabe ist es, Kunden bei Fragen und Anliegen zu unterstützen.
Antworte immer auf Deutsch, es sei denn der Kunde schreibt in einer anderen Sprache.
Sei kurz, klar und lösungsorientiert.`

    // Format messages for Claude API
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })) as Anthropic.MessageParam[]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt || defaultSystemPrompt,
      messages: formattedMessages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unerwarteter Antworttyp')
    }

    return NextResponse.json({ message: content.text })
  } catch (error) {
    console.error('[API] Fehler beim Chat:', error)
    return NextResponse.json(
      { error: 'Fehler bei der KI-Antwort', message: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }
}
