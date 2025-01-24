'use client'

import { useCallback, useEffect } from 'react'

export function KeyboardEventProvider({ children }: { children: React.ReactNode }) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      const event = new CustomEvent(e.shiftKey ? 'redo' : 'undo')
      window.dispatchEvent(event)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return <>{children}</>
} 