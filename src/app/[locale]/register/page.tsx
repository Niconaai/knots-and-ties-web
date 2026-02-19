'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const t = useTranslations('Auth')
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError(t('passwordMinLength'))
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, fullName)
      router.push('/login')
    } catch (err: any) {
      setError(err.message || t('registerError'))
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f9f7f2] py-20 px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="space-y-3 text-center mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-stone-500">{t('register')}</p>
            <h1 className="text-3xl font-serif text-zinc-900">{t('registerTitle')}</h1>
            <p className="text-sm text-zinc-600">{t('registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
              />
            </div>

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
              <p className="mt-1 text-xs text-stone-500">{t('passwordMinLength')}</p>
            </div>

            {error && (
              <p className="text-sm text-rose-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-zinc-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? t('creatingAccount') : t('signUpButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              {t('hasAccount')}{' '}
              <Link href="/login" className="text-zinc-900 underline hover:text-stone-700 transition-colors duration-200 hover:underline-offset-4">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
