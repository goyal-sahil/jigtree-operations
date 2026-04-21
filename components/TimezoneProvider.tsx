'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const TimezoneContext = createContext<string>('UTC')

export function useTimezone(): string {
  return useContext(TimezoneContext)
}

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState<string>('UTC')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json() as Promise<{ timezone?: string }>)
      .then(d => { if (d.timezone) setTimezone(d.timezone) })
      .catch(() => {})
  }, [])

  return (
    <TimezoneContext.Provider value={timezone}>
      {children}
    </TimezoneContext.Provider>
  )
}
