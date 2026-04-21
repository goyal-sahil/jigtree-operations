'use client'

import { useRouter } from 'next/navigation'

interface HubPageProps {
  userName: string
}

const TILES = [
  {
    route:       '/analyser',
    title:       'Ticket Analyser',
    description: 'Load any Kayako ticket — AI analysis, conversation timeline, and post internal notes.',
    icon:        SearchIcon,
    accent:      'border-blue-500',
    iconBg:      'bg-blue-50 text-blue-600',
  },
  {
    route:       '/bu-tickets',
    title:       'BU/PS Tickets',
    description: 'Live view of JigTree BU/PS tickets from Kayako view #64 — sortable, filterable table.',
    icon:        TableIcon,
    accent:      'border-purple-500',
    iconBg:      'bg-purple-50 text-purple-600',
  },
]

export default function HubPage({ userName }: HubPageProps) {
  const router = useRouter()

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="bg-slate-900 px-8 py-10">
        <p className="text-slate-400 text-sm mb-1">
          Welcome back, {userName || 'there'}
        </p>
        <h1 className="text-white text-3xl font-bold">JigTree Operations Hub</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Your central workspace for support operations tools.
        </p>
      </div>

      {/* Tiles */}
      <div className="px-8 py-8">
        <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {TILES.map(({ route, title, description, icon: Icon, accent, iconBg }) => (
            <button
              key={route}
              onClick={() => router.push(route)}
              className={`
                text-left bg-white border-2 ${accent} rounded-xl p-6
                shadow-sm hover:shadow-md transition-all
                group flex flex-col gap-4
              `}
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-900 font-semibold text-base">{title}</h3>
                  <ArrowIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
                </div>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
