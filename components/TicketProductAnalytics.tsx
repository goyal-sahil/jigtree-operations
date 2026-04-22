'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

export interface ProductAnalyticsRow {
  product: string
  count:   number
}

interface Props {
  products:   ProductAnalyticsRow[]
  storageKey: string   // e.g. 'analytics-open-all-tickets'
}

export default function TicketProductAnalytics({ products, storageKey }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(true)

  // Restore collapsed state from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) setOpen(stored !== 'false')
  }, [storageKey])

  // NProgress: done when URL changes (handled by Filters component — we only need to start it)
  const lastSpRef = useRef(searchParams.toString())
  useEffect(() => {
    const cur = searchParams.toString()
    if (cur !== lastSpRef.current) {
      lastSpRef.current = cur
      NProgress.done()
    }
  }, [searchParams])

  function toggle() {
    setOpen(prev => {
      localStorage.setItem(storageKey, String(!prev))
      return !prev
    })
  }

  function handleProductClick(product: string) {
    const p = new URLSearchParams(searchParams.toString())
    const activeProducts = p.getAll('product')

    // Toggle: if this is the only active product, clear it and remove openOnly; otherwise set it
    if (activeProducts.length === 1 && activeProducts[0] === product) {
      p.delete('product')
      p.delete('openOnly')
    } else {
      p.delete('product')
      p.append('product', product)
      p.set('openOnly', 'true')
    }
    p.set('page', '1')
    NProgress.start()
    router.push(`?${p.toString()}`)
  }

  if (products.length === 0) return null

  const totalOpen      = products.reduce((sum, r) => sum + r.count, 0)
  const activeProducts = searchParams.getAll('product')

  return (
    <div className="mb-4 border border-slate-200 rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-slate-700">Open by Product</span>
          <span className="text-xs text-slate-400">
            {products.length} product{products.length !== 1 ? 's' : ''} · {totalOpen.toLocaleString()} open
          </span>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            excl. Closed &amp; Completed
          </span>
        </div>
        <ChevronIcon className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Pills */}
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {products.map(({ product, count }) => {
              const isActive = activeProducts.includes(product)
              return (
                <button
                  key={product}
                  onClick={() => handleProductClick(product)}
                  className={`
                    inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all
                    ${isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'}
                  `}
                >
                  <span className="font-medium">{product}</span>
                  <span className={`
                    text-xs font-bold min-w-[20px] text-center px-1.5 py-0.5 rounded-full
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'}
                  `}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
          {activeProducts.length > 0 && (
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString())
                p.delete('product')
                p.delete('openOnly')
                p.set('page', '1')
                NProgress.start()
                router.push(`?${p.toString()}`)
              }}
              className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition underline"
            >
              Clear product filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
