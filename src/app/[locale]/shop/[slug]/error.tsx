'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Log to error service
    }
  }, [error])

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6 pt-24">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 mx-auto bg-stone-200 rounded-full flex items-center justify-center">
          <span className="text-4xl">👔</span>
        </div>
        
        <h1 className="text-3xl font-serif text-zinc-900">
          Product Not Available
        </h1>
        
        <p className="text-zinc-600">
          We couldn't load this product. It may have been removed or there's a temporary issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={reset}
            className="px-8 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => router.push('/shop')}
            className="px-8 py-3 border border-zinc-300 text-zinc-900 text-sm font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors"
          >
            Browse Shop
          </button>
        </div>
      </div>
    </main>
  )
}
