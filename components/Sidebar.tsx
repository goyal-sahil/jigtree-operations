'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  userEmail: string
  isAdmin:   boolean
}

function initials(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export default function Sidebar({ userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const [collapsed,           setCollapsed]           = useState(false)
  const [supportTicketsOpen,  setSupportTicketsOpen]  = useState(true)
  const [accountMgmtOpen,     setAccountMgmtOpen]     = useState(true)
  const [productOpen,         setProductOpen]         = useState(true)
  const [psOpen,              setPsOpen]              = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) setCollapsed(stored === 'true')
    const sectionStored = localStorage.getItem('sidebar-support-tickets-open')
    if (sectionStored !== null) setSupportTicketsOpen(sectionStored !== 'false')
    const acctStored = localStorage.getItem('sidebar-account-mgmt-open')
    if (acctStored !== null) setAccountMgmtOpen(acctStored !== 'false')
    const productStored = localStorage.getItem('sidebar-product-open')
    if (productStored !== null) setProductOpen(productStored !== 'false')
    const psStored = localStorage.getItem('sidebar-ps-open')
    if (psStored !== null) setPsOpen(psStored !== 'false')
  }, [])

  function toggleCollapse() {
    setCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev))
      return !prev
    })
  }

  function toggleSupportTickets() {
    setSupportTicketsOpen(prev => {
      localStorage.setItem('sidebar-support-tickets-open', String(!prev))
      return !prev
    })
  }

  function toggleAccountMgmt() {
    setAccountMgmtOpen(prev => {
      localStorage.setItem('sidebar-account-mgmt-open', String(!prev))
      return !prev
    })
  }

  function toggleProduct() {
    setProductOpen(prev => {
      localStorage.setItem('sidebar-product-open', String(!prev))
      return !prev
    })
  }

  function togglePs() {
    setPsOpen(prev => {
      localStorage.setItem('sidebar-ps-open', String(!prev))
      return !prev
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(route: string): boolean {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  }

  return (
    <aside
      className={`
        flex flex-col h-screen bg-slate-900 border-r border-slate-700
        transition-all duration-200 shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700 min-h-[64px]">
        <span className="text-2xl shrink-0">🌳</span>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-none truncate">JigTree Ops</p>
            <p className="text-slate-400 text-xs mt-0.5 truncate">Operations Hub</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">

        {/* Hub */}
        <NavLink href="/" label="Hub" icon={HomeIcon} active={isActive('/')} collapsed={collapsed} />

        {/* Support Tickets section */}
        {collapsed ? (
          // Icon-only: show items directly without section header
          <>
            <NavLink href="/analyser"    label="Ticket Analyser" icon={SearchIcon} active={isActive('/analyser')}    collapsed={collapsed} />
            <NavLink href="/all-tickets" label="All Tickets"     icon={ListIcon}   active={isActive('/all-tickets')} collapsed={collapsed} />
            <NavLink href="/bu-tickets"  label="BU/PS Tickets"   icon={TableIcon}  active={isActive('/bu-tickets')}  collapsed={collapsed} />
          </>
        ) : (
          <div className="mt-2">
            {/* Section header */}
            <button
              onClick={toggleSupportTickets}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition"
            >
              <span>Support Tickets</span>
              <ChevronSmallIcon className={`w-3.5 h-3.5 transition-transform ${supportTicketsOpen ? 'rotate-90' : ''}`} />
            </button>

            {supportTicketsOpen && (
              <div className="flex flex-col gap-0.5 pl-2">
                <NavLink href="/analyser"    label="Ticket Analyser" icon={SearchIcon} active={isActive('/analyser')}    collapsed={false} />
                <NavLink href="/all-tickets" label="All Tickets"     icon={ListIcon}   active={isActive('/all-tickets')} collapsed={false} />
                <NavLink href="/bu-tickets"  label="BU/PS Tickets"   icon={TableIcon}  active={isActive('/bu-tickets')}  collapsed={false} />
              </div>
            )}
          </div>
        )}

        {/* Account Management section */}
        {collapsed ? (
          <ComingSoonNavItem icon={BriefcaseIcon} label="Portfolio" collapsed={true} />
        ) : (
          <div className="mt-2">
            <button
              onClick={toggleAccountMgmt}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition"
            >
              <span>Account Management</span>
              <ChevronSmallIcon className={`w-3.5 h-3.5 transition-transform ${accountMgmtOpen ? 'rotate-90' : ''}`} />
            </button>
            {accountMgmtOpen && (
              <div className="flex flex-col gap-0.5 pl-2">
                <ComingSoonNavItem icon={BriefcaseIcon} label="Portfolio" collapsed={false} />
              </div>
            )}
          </div>
        )}

        {/* Product section */}
        {collapsed ? (
          <>
            <ComingSoonNavItem icon={WrenchIcon}      label="In Development" collapsed={true} />
            <ComingSoonNavItem icon={ClockIcon}       label="Coming Next"    collapsed={true} />
            <ComingSoonNavItem icon={TelescopeIcon}   label="Future"         collapsed={true} />
            <ComingSoonNavItem icon={CheckCircleIcon} label="Delivered"      collapsed={true} />
          </>
        ) : (
          <div className="mt-2">
            <button
              onClick={toggleProduct}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition"
            >
              <span>Product</span>
              <ChevronSmallIcon className={`w-3.5 h-3.5 transition-transform ${productOpen ? 'rotate-90' : ''}`} />
            </button>
            {productOpen && (
              <div className="flex flex-col gap-0.5 pl-2">
                <ComingSoonNavItem icon={WrenchIcon}      label="In Development" collapsed={false} />
                <ComingSoonNavItem icon={ClockIcon}       label="Coming Next"    collapsed={false} />
                <ComingSoonNavItem icon={TelescopeIcon}   label="Future"         collapsed={false} />
                <ComingSoonNavItem icon={CheckCircleIcon} label="Delivered"      collapsed={false} />
              </div>
            )}
          </div>
        )}

        {/* Professional Services section */}
        {collapsed ? (
          <>
            <ComingSoonNavItem icon={CurrencyIcon}   label="Revenue"         collapsed={true} />
            <ComingSoonNavItem icon={ClipboardIcon}  label="Quote Requests"  collapsed={true} />
            <ComingSoonNavItem icon={UsersIcon}      label="PS Engagements"  collapsed={true} />
            <ComingSoonNavItem icon={StarIcon}       label="Platinum"        collapsed={true} />
          </>
        ) : (
          <div className="mt-2">
            <button
              onClick={togglePs}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition"
            >
              <span>Professional Services</span>
              <ChevronSmallIcon className={`w-3.5 h-3.5 transition-transform ${psOpen ? 'rotate-90' : ''}`} />
            </button>
            {psOpen && (
              <div className="flex flex-col gap-0.5 pl-2">
                <ComingSoonNavItem icon={CurrencyIcon}   label="Revenue"        collapsed={false} />
                <ComingSoonNavItem icon={ClipboardIcon}  label="Quote Requests" collapsed={false} />
                <ComingSoonNavItem icon={UsersIcon}      label="PS Engagements" collapsed={false} />
                <ComingSoonNavItem icon={StarIcon}       label="Platinum"       collapsed={false} />
              </div>
            )}
          </div>
        )}

        {/* Admin (admin users only) */}
        {isAdmin && (
          <NavLink href="/admin" label="Admin" icon={ShieldIcon} active={isActive('/admin')} collapsed={collapsed} />
        )}

        {/* Settings */}
        <NavLink href="/settings" label="Settings" icon={GearIcon} active={isActive('/settings')} collapsed={collapsed} />
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-2">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>

      {/* Footer */}
      <div className={`border-t border-slate-700 p-3 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials(userEmail)}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-slate-300 text-xs truncate">{userEmail}</p>
            <button onClick={signOut} className="text-slate-500 hover:text-red-400 text-xs mt-0.5 transition">
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Nav link helper ────────────────────────────────────────────────────────────

function NavLink({
  href, label, icon: Icon, active, collapsed,
}: {
  href:      string
  label:     string
  icon:      React.ComponentType<{ className?: string }>
  active:    boolean
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition
        ${collapsed ? 'justify-center' : ''}
        ${active
          ? 'bg-blue-600 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'}
      `}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  )
}

// ── Coming Soon nav item ───────────────────────────────────────────────────────

function ComingSoonNavItem({
  icon: Icon, label, collapsed,
}: {
  icon:      React.ComponentType<{ className?: string }>
  label:     string
  collapsed: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-default
        ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? `${label} — Coming Soon` : undefined}
    >
      <Icon className="w-5 h-5 shrink-0 opacity-50" />
      {!collapsed && (
        <>
          <span className="text-sm font-medium opacity-50">{label}</span>
          <span className="ml-auto text-[10px] font-semibold bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full leading-none">
            Soon
          </span>
        </>
      )}
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75v-6H8.25v6H3.75A.75.75 0 013 21V9.75z" />
    </svg>
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

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

function ChevronSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
