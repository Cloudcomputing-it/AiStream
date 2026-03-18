'use client'

import { Handle, Position, NodeProps } from 'reactflow'
import { Zap } from 'lucide-react'

export function TriggerNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-l-4 border-l-green-500 border-t border-r border-b shadow-sm w-56 transition-shadow ${
        selected ? 'shadow-md ring-2 ring-green-200' : 'hover:shadow-md'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{data.label}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>

        {/* Kommunikationskanal Dropdown */}
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">Kommunikationskanäle</label>
          <select className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white">
            <option value="">Kanal auswählen</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-Mail</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-green-500 border-2 border-white" />
    </div>
  )
}
