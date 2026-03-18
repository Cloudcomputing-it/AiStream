'use client'

import { Handle, Position, NodeProps } from 'reactflow'
import { Bot } from 'lucide-react'

export function AIAgentNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-l-4 border-l-blue-500 border-t border-r border-b shadow-sm w-56 transition-shadow ${
        selected ? 'shadow-md ring-2 ring-blue-200' : 'hover:shadow-md'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{data.label}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-3">{data.description}</p>

        {/* Agent Auswahl */}
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">KI-Agent</label>
          <select className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
            <option value="">Wähle einen KI-Agenten aus</option>
            <option value="supportbuddy">SupportBuddy</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
          <span className="text-xs text-gray-500">Wenn der Kontakt innerhalb von 12h nicht antwortet</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-blue-500 border-2 border-white" />
    </div>
  )
}
