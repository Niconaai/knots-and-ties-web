'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutError({
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
    <main className="min-h-screen bg-[#f9f7f2] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md bg-white/70 rounded-3xl border border-[#d8d3c4] p-10 shadow-lg">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">💳</span>
        </div>
        
        <h1 className="text-2xl font-serif text-zinc-900">
          Checkout Error
        </h1>
        
        <p className="text-zinc-600 text-sm">
          We encountered an issue processing your checkout. Your cart has been preserved. Please try again.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={reset}
            className="w-full px-8 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors rounded-xl"
          >
            Retry Checkout
          </button>
          
          <button
            onClick={() => router.push('/shop')}
            className="w-full px-8 py-3 border border-zinc-300 text-zinc-900 text-sm font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors rounded-xl"
          >
            Continue Shopping
          </button>
        </div>
        
        <p className="text-xs text-zinc-400 pt-4">
          If this issue persists, please contact our support team.
        </p>
      </div>
    </main>
  )
}
