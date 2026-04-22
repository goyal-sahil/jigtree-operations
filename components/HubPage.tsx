'use client'

import { useRouter } from 'next/navigation'

interface HubPageProps {
  userName: string
  isAdmin:  boolean
}

const SUPPORT_TILES = [
  {
    route:       '/analyser',
    title:       'Ticket Analyser',
    description: 'Load any Kayako ticket — AI analysis, conversation timeline, and post internal notes.',
    icon:        SearchIcon,
    accent:      'border-blue-500',
    iconBg:      'bg-blue-50 text-blue-600',
  },
  {
    route:       '/all-tickets',
    title:       'All Tickets',
    description: 'All support tickets from Kayako view #242 — sortable, filterable table with full sync.',
    icon:        ListIcon,
    accent:      'border-teal-500',
    iconBg:      'bg-teal-50 text-teal-600',
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

const ACCOUNT_MGMT_TILES = [
  {
    title:       'Portfolio',
    description: 'Account portfolio overview — track accounts, health scores, and renewal timelines.',
    icon:        BriefcaseIcon,
    accent:      'border-amber-400',
    iconBg:      'bg-amber-50 text-amber-600',
  },
]

const ADMIN_TILES = [
  {
    route:       '/admin',
    title:       'Admin',
    description: 'Manage filter presets across all users, and other admin controls.',
    icon:        ShieldIcon,
    accent:      'border-slate-400',
    iconBg:      'bg-slate-50 text-slate-600',
  },
]

export default function HubPage({ userName, isAdmin }: HubPageProps) {
  const router = useRouter()

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="bg-slate-900 px-8 py-10">
        <p className="text-slate-400 text-sm mb-1">Welcome back, {userName || 'there'}</p>
        <h1 className="text-white text-3xl font-bold">JigTree Operations Hub</h1>
        <p className="text-slate-400 mt-2 text-sm">Your central workspace for support operations tools.</p>
      </div>

      <div className="px-8 py-8 flex flex-col gap-8 max-w-3xl">

        {/* Support Tickets */}
        <section>
          <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Support Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUPPORT_TILES.map(tile => <Tile key={tile.route} tile={tile} onClick={() => router.push(tile.route)} />)}
          </div>
        </section>

        {/* Account Management */}
        <section>
          <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Account Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACCOUNT_MGMT_TILES.map(tile => <ComingSoonTile key={tile.title} tile={tile} />)}
          </div>
        </section>

        {/* Admin (admin users only) */}
        {isAdmin && (
          <section>
            <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Administration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ADMIN_TILES.map(tile => <Tile key={tile.route} tile={tile} onClick={() => router.push(tile.route)} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function Tile({
  tile,
  onClick,
}: {
  tile:    { title: string; description: string; icon: React.ComponentType<{ className?: string }>; accent: string; iconBg: string }
  onClick: () => void
}) {
  const { title, description, icon: Icon, accent, iconBg } = tile
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white border-2 ${accent} rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col gap-4`}
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
  )
}

function ComingSoonTile({
  tile,
}: {
  tile: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; accent: string; iconBg: string }
}) {
  const { title, description, icon: Icon, accent, iconBg } = tile
  return (
    <div className={`relative text-left bg-white border-2 ${accent} rounded-xl p-6 shadow-sm opacity-60 flex flex-col gap-4`}>
      <span className="absolute top-3 right-3 text-[10px] font-semibold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full leading-none border border-amber-200">
        Coming Soon
      </span>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-slate-900 font-semibold text-base">{title}</h3>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
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

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
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
