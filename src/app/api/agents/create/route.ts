import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Beschreibung erforderlich' }, { status: 400 })
    }

    // Claude generiert den System Prompt automatisch
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Experte für KI-Agenten-Konfiguration. Erstelle basierend auf folgender Beschreibung einen vollständigen System Prompt und Stil-Prompt für einen KI-Agenten.

Beschreibung: "${description}"

Antworte NUR mit einem JSON-Objekt in diesem Format (keine anderen Texte):
{
  "name": "Agenten-Name (kurz, prägnant, auf Deutsch)",
  "avatar": "Ein passendes Emoji",
  "system_prompt": "Vollständiger System Prompt auf Deutsch (Rolle, Aufgaben, Kernfunktionen, Eskalationsregeln)",
  "style_prompt": "Stil & Sprache Beschreibung auf Deutsch (Ton, Kommunikationsstruktur, Do's und Don'ts)"
}`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unerwarteter Antworttyp')
    }

    let parsed
    try {
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Kein JSON gefunden')
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      parsed = {
        name: 'KI-Agent',
        avatar: '🤖',
        system_prompt: description,
        style_prompt: 'Freundlich, professionell und lösungsorientiert.',
      }
    }

    const agent = {
      id: `agent-${Date.now()}`,
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: parsed.name || 'KI-Agent',
      avatar: parsed.avatar || '🤖',
      description,
      system_prompt: parsed.system_prompt || description,
      style_prompt: parsed.style_prompt || '',
      is_active: false,
      pinecone_namespace: `agent-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error('[API] Fehler bei Agent-Erstellung:', error)
    // Fallback ohne Claude API
    const fallbackAgent = {
      id: `agent-${Date.now()}`,
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: 'SupportBuddy',
      avatar: '🤖',
      description: 'KI-Agent',
      system_prompt: `Du bist ein freundlicher KI-Agent. Helfe Kunden professionell und effizient.`,
      style_prompt: `Ton: freundlich und professionell. Stil: kurz und lösungsorientiert.`,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(fallbackAgent)
  }
}
