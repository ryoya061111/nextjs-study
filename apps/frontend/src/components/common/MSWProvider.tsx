'use client'
import { useEffect } from 'react'

// 開発環境でのみ MSW の Service Worker を起動する
// API Route が存在する場合は onUnhandledRequest: 'bypass' で素通りさせる
export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    import('@/mocks/browser').then(({ worker }) => {
      worker.start({ onUnhandledRequest: 'bypass' })
    })
  }, [])

  return <>{children}</>
}
