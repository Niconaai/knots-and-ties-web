'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const { signIn } = useAuth()
  const t = useTranslations('Auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/account')
    } catch (err: any) {
      setError(t('loginError'))
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f9f7f2] py-20 px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="space-y-3 text-center mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-stone-500">{t('login')}</p>
            <h1 className="text-3xl font-serif text-zinc-900">{t('loginTitle')}</h1>
            <p className="text-sm text-zinc-600">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-zinc-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? t('loggingIn') : t('signInButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              {t('noAccount')}{' '}
              <Link href="/register" className="text-zinc-900 underline hover:text-stone-700 transition-colors duration-200 hover:underline-offset-4">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
