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

const PRODUCT_TILES = [
  {
    title:       'In Development',
    description: 'Track features actively being built — sprint progress, blockers, and release targets.',
    icon:        WrenchIcon,
    accent:      'border-indigo-400',
    iconBg:      'bg-indigo-50 text-indigo-600',
  },
  {
    title:       'Coming Next',
    description: 'Upcoming features committed for the next release cycle.',
    icon:        ClockIcon,
    accent:      'border-violet-400',
    iconBg:      'bg-violet-50 text-violet-600',
  },
  {
    title:       'Future',
    description: 'Long-horizon roadmap items and strategic investments.',
    icon:        TelescopeIcon,
    accent:      'border-sky-400',
    iconBg:      'bg-sky-50 text-sky-600',
  },
  {
    title:       'Delivered',
    description: 'Recently shipped features — what was released and when.',
    icon:        CheckCircleIcon,
    accent:      'border-emerald-400',
    iconBg:      'bg-emerald-50 text-emerald-600',
  },
]

const PS_TILES = [
  {
    title:       'Revenue',
    description: 'PS revenue tracking — actuals vs targets across accounts and time periods.',
    icon:        CurrencyIcon,
    accent:      'border-green-400',
    iconBg:      'bg-green-50 text-green-600',
  },
  {
    title:       'Quote Requests',
    description: 'Manage and track incoming PS quote requests from the sales and CS teams.',
    icon:        ClipboardIcon,
    accent:      'border-orange-400',
    iconBg:      'bg-orange-50 text-orange-600',
  },
  {
    title:       'PS Engagements',
    description: 'Active and completed professional services engagements — scope, status, and delivery.',
    icon:        UsersIcon,
    accent:      'border-rose-400',
    iconBg:      'bg-rose-50 text-rose-600',
  },
  {
    title:       'Platinum',
    description: 'Platinum-tier accounts — dedicated support, SLAs, and escalation tracking.',
    icon:        StarIcon,
    accent:      'border-yellow-400',
    iconBg:      'bg-yellow-50 text-yellow-600',
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

        {/* Product */}
        <section>
          <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCT_TILES.map(tile => <ComingSoonTile key={tile.title} tile={tile} />)}
          </div>
        </section>

        {/* Professional Services */}
        <section>
          <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">Professional Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PS_TILES.map(tile => <ComingSoonTile key={tile.title} tile={tile} />)}
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

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  )
}

function TelescopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 13.5L17 17" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CurrencyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
