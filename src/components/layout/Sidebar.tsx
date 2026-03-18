'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Inbox,
  Bot,
  Zap,
  Megaphone,
  Users,
  Star,
  BarChart2,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/inbox', icon: Inbox, label: 'Posteingang' },
  { href: '/agents', icon: Bot, label: 'KI-Agenten' },
  { href: '/automations', icon: Zap, label: 'Automationen' },
  { href: '/campaigns', icon: Megaphone, label: 'Kampagnen' },
  { href: '/contacts', icon: Users, label: 'Kontakte' },
  { href: '/reviews', icon: Star, label: 'Bewertungen' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Einstellungen' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-1 shrink-0 z-10 shadow-[1px_0_0_0_#f3f4f6]">
      {/* Logo */}
      <Link
        href="/inbox"
        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mb-4 hover:scale-105 transition-transform shadow-md shadow-teal-200"
        title="AI Stream"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </Link>

      {/* Nav Items */}
      <div className="flex flex-col gap-1 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'w-full h-10 rounded-xl flex items-center justify-center transition-all group relative',
                isActive
                  ? 'bg-teal-50 text-teal-700 shadow-sm'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              )}
            >
              <item.icon
                className="w-[18px] h-[18px]"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                {item.label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-600 rounded-r-full" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Avatar */}
      <div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer hover:scale-105 transition-transform mb-1"
        title="Mein Profil"
      >
        AS
      </div>
    </aside>
  )
}
