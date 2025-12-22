'use client'

import { use, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'

export default function PaymentComplete({ 
  searchParams 
}: { 
  searchParams: Promise<{ reference?: string }>
}) {
  const { clearCart } = useCart()
  const params = use(searchParams)
  const reference = params?.reference ?? null
  const hasCleared = useRef(false)

  // Clear cart when payment is complete (only once)
  useEffect(() => {
    if (reference && !hasCleared.current) {
      clearCart()
      hasCleared.current = true
    }
  }, [reference, clearCart])

  return (
    <section className="bg-[#f9f7f2] py-20 px-4">
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-stone-400">Payment Complete</p>
          <h1 className="text-3xl font-serif text-zinc-900 sm:text-4xl">Thank You!</h1>
        </div>
        {reference ? (
          <div className="space-y-4">
            <p className="text-zinc-600">Your payment reference is:</p>
            <p className="text-2xl font-mono font-semibold text-zinc-900 bg-stone-50 rounded-lg py-3 px-4 border border-stone-200">{reference}</p>
            <p className="text-sm text-zinc-600">We will email you a confirmation shortly.</p>
          </div>
        ) : (
          <p className="text-zinc-600">If the payment was successful you will receive an email confirmation. If not, please check your payment method.</p>
        )}
      </div>
    </section>
  )
}
