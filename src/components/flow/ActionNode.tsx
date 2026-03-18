'use client'

import { Handle, Position, NodeProps } from 'reactflow'
import { Play } from 'lucide-react'

export function ActionNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-l-4 border-l-gray-400 border-t border-r border-b shadow-sm w-56 transition-shadow ${
        selected ? 'shadow-md ring-2 ring-gray-200' : 'hover:shadow-md'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{data.label}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-gray-400 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-gray-400 border-2 border-white" />
    </div>
  )
}
