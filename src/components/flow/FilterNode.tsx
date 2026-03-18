'use client'

import { Handle, Position, NodeProps } from 'reactflow'
import { Filter } from 'lucide-react'

export function FilterNode({ data, selected }: NodeProps) {
  const isHours = data.label?.toLowerCase().includes('öffnungszeit')

  return (
    <div
      className={`bg-white rounded-xl border-l-4 border-l-orange-500 border-t border-r border-b shadow-sm w-56 transition-shadow ${
        selected ? 'shadow-md ring-2 ring-orange-200' : 'hover:shadow-md'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
            <Filter className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{data.label}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-3">{data.description}</p>

        {/* Postfach */}
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">Postfach</label>
          <select className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white">
            <option value="">Postfach aus "Neue eingehende Nachricht"</option>
            <option value="main">Main</option>
            <option value="support">Support</option>
          </select>
        </div>

        {isHours && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 py-1">
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs text-gray-600">Innerhalb der Öffnungszeiten</span>
            </div>
            <div className="flex items-center gap-2 py-1">
              <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              <span className="text-xs text-gray-600">Außerhalb der Öffnungszeiten</span>
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-orange-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="inside" className="w-2.5 h-2.5 bg-orange-300 border-2 border-white" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="outside" className="w-2.5 h-2.5 bg-orange-500 border-2 border-white" style={{ top: '75%' }} />
    </div>
  )
}
