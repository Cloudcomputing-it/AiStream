'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TriggerNode } from './TriggerNode'
import { FilterNode } from './FilterNode'
import { ActionNode } from './ActionNode'
import { AIAgentNode } from './AIAgentNode'
import type { AutomationType } from '@/types'

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  filter: FilterNode,
  action: ActionNode,
  ai_agent: AIAgentNode,
}

function getTemplateNodes(type: AutomationType): { nodes: Node[]; edges: Edge[] } {
  const baseNodes: Node[] = [
    {
      id: 'start',
      type: 'trigger',
      position: { x: 300, y: 50 },
      data: { label: 'Neue eingehende Nachricht', description: 'Startet die Automation für jede neue eingehende Nachricht', nodeType: 'trigger' },
    },
  ]

  switch (type) {
    case 'outside_hours':
      return {
        nodes: [
          ...baseNodes,
          {
            id: 'filter',
            type: 'filter',
            position: { x: 580, y: 50 },
            data: { label: 'Öffnungszeiten', description: 'Filter ermöglichen bedingungsabhängige Aktionen', nodeType: 'filter' },
          },
          {
            id: 'agent',
            type: 'ai_agent',
            position: { x: 860, y: 50 },
            data: { label: 'KI-Agent', description: 'Lass den KI-Agenten automatisch das Gespräch mit deinen Kunden übernehmen', nodeType: 'ai_agent' },
          },
        ],
        edges: [
          { id: 'e1-2', source: 'start', target: 'filter', type: 'smoothstep' },
          { id: 'e2-3', source: 'filter', target: 'agent', sourceHandle: 'outside', type: 'smoothstep' },
        ],
      }
    case 'first_contact':
      return {
        nodes: [
          ...baseNodes,
          {
            id: 'filter',
            type: 'filter',
            position: { x: 580, y: 50 },
            data: { label: 'Erstkontakt', description: 'Nur bei neuen Kunden / erster Nachricht', nodeType: 'filter' },
          },
          {
            id: 'agent',
            type: 'ai_agent',
            position: { x: 860, y: 50 },
            data: { label: 'KI-Agent', description: 'KI-Agent übernimmt den Erstkontakt', nodeType: 'ai_agent' },
          },
        ],
        edges: [
          { id: 'e1-2', source: 'start', target: 'filter', type: 'smoothstep' },
          { id: 'e2-3', source: 'filter', target: 'agent', type: 'smoothstep' },
        ],
      }
    case 'always':
    case 'chat_open':
    default:
      return {
        nodes: [
          ...baseNodes,
          {
            id: 'agent',
            type: 'ai_agent',
            position: { x: 580, y: 50 },
            data: { label: 'KI-Agent', description: 'KI-Agent antwortet automatisch', nodeType: 'ai_agent' },
          },
        ],
        edges: [
          { id: 'e1-2', source: 'start', target: 'agent', type: 'smoothstep' },
        ],
      }
  }
}

interface Props {
  automationType: AutomationType
  automationName: string
  onPublish: () => void
  onBack: () => void
}

const instructions: Record<AutomationType, string[]> = {
  outside_hours: [
    'Mit dieser Automation übernimmt der KI-Agent die Unterhaltung außerhalb deiner Öffnungszeiten.',
    'So können Kontakte auch dann betreut werden, wenn kein Agent online ist.',
    'Schritte:',
    '1. Stelle sicher, dass in Einstellungen → Postfächer die Öffnungszeiten korrekt gesetzt sind.',
    '2. Wähle im Trigger die gewünschten Kommunikationskanäle aus.',
    '3. Klicke auf die KI-Agent-Node und wähle den passenden KI-Agenten aus.',
    '4. Veröffentliche anschließend die Automation.',
  ],
  first_contact: [
    'Diese Automation aktiviert den KI-Agenten nur beim ersten Kontakt.',
    'Ideal für Lead-Qualifizierung und Erstkontakt-Begrüßungen.',
    'Schritte:',
    '1. Wähle den gewünschten Kommunikationskanal.',
    '2. Konfiguriere den Erstkontakt-Filter.',
    '3. Wähle deinen KI-Agenten aus.',
    '4. Veröffentliche die Automation.',
  ],
  always: [
    'Der KI-Agent antwortet auf alle eingehenden Nachrichten.',
    'Menschliche Agenten können jederzeit einspringen.',
    'Schritte:',
    '1. Wähle den Kommunikationskanal.',
    '2. Wähle deinen KI-Agenten aus.',
    '3. Veröffentliche die Automation.',
  ],
  chat_open: [
    'Der KI-Agent antwortet bei jeder neuen Chat-Eröffnung.',
    'Ideal für Support & Ticketing-Workflows.',
    'Schritte:',
    '1. Wähle den Kommunikationskanal.',
    '2. Wähle deinen KI-Agenten aus.',
    '3. Veröffentliche die Automation.',
  ],
  manual: [
    'Der KI-Agent übernimmt nur, wenn dein Team manuell übergibt.',
    'Volle Kontrolle über wann der KI-Agent aktiv wird.',
    'Schritte:',
    '1. Konfiguriere die manuelle Übergabe-Bedingungen.',
    '2. Wähle deinen KI-Agenten aus.',
    '3. Veröffentliche die Automation.',
  ],
}

export function FlowBuilder({ automationType, automationName, onPublish, onBack }: Props) {
  const template = getTemplateNodes(automationType)
  const [nodes, setNodes, onNodesChange] = useNodesState(template.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(template.edges)
  const [isPublished, setIsPublished] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handlePublish = () => {
    setIsPublished(true)
    onPublish()
  }

  const steps = instructions[automationType] || instructions.always

  return (
    <div className="flex h-full">
      {/* Instructions Panel */}
      <div className="w-72 bg-yellow-50 border-r border-yellow-200 p-5 overflow-y-auto shrink-0">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Anleitung</h3>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <p key={i} className={`text-xs text-gray-700 ${step.startsWith('Schritte:') ? 'font-semibold mt-2' : ''}`}>
              {step}
            </p>
          ))}
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
              ← Zurück
            </button>
            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{automationName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {isPublished ? 'Aktiv' : 'Entwurf'}
            </span>
          </div>
          <button
            onClick={handlePublish}
            disabled={isPublished}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isPublished ? '✓ Veröffentlicht' : 'Veröffentlichen'}
          </button>
        </div>

        <div className="pt-14 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
          >
            <Controls className="bottom-4 left-4" />
            <MiniMap className="bottom-4 right-4" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
