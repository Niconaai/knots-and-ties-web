'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

type Order = {
  id: string
  paystack_reference: string
  status: string
  shipping_details: any
  subtotal: number
  shipping_cost: number
  total: number
  tracking_number: string | null
  created_at: string
  order_items: Array<{
    id: string
    sanity_product_id: string
    product_snapshot: any
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export default function AccountPage() {
  const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth()
  const t = useTranslations('Account')
  const tAuth = useTranslations('Auth')
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            sanity_product_id,
            product_snapshot,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateProfile({ full_name: fullName, phone })
      setEditMode(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'shipped':
        return 'text-purple-600 bg-purple-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  if (authLoading || !user) {
    return null
  }

  return (
    <section className="bg-[#f9f7f2] py-16 px-4 min-h-screen">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-stone-500">{tAuth('account')}</p>
              <h1 className="text-3xl font-serif text-zinc-900">{t('title')}</h1>
              <p className="text-sm text-zinc-600">{t('subtitle')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-zinc-300 px-6 py-2 text-sm uppercase tracking-[0.3em] text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:border-zinc-400 hover:shadow-md hover:scale-105 active:scale-95"
            >
              {tAuth('logout')}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-serif text-zinc-900">{t('profileTitle')}</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-sm uppercase tracking-[0.3em] text-zinc-700 underline hover:text-zinc-900 transition-all duration-200 hover:underline-offset-4 hover:scale-105"
              >
                {t('editProfile')}
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {tAuth('fullName')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editMode}
                className={`w-full rounded-full border px-4 py-3 text-sm shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none ${
                  editMode
                    ? 'border-[#dcd7cf] bg-[#fdfdf9] text-zinc-900'
                    : 'border-stone-300 bg-stone-100 text-stone-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {tAuth('email')}
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-600 shadow-[0_4px_20px_rgba(15,23,42,0.08)] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {tAuth('phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editMode}
                className={`w-full rounded-full border px-4 py-3 text-sm shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none ${
                  editMode
                    ? 'border-[#dcd7cf] bg-[#fdfdf9] text-zinc-900'
                    : 'border-stone-300 bg-stone-100 text-stone-600 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {editMode && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saving ? t('saving') : t('saveProfile')}
              </button>
              <button
                onClick={() => {
                  setEditMode(false)
                  setFullName(profile?.full_name || '')
                  setPhone(profile?.phone || '')
                }}
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm uppercase tracking-[0.3em] text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:border-zinc-400 hover:shadow-md hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <h2 className="mb-6 text-xl font-serif text-zinc-900">{t('ordersTitle')}</h2>

          {loading ? (
            <p className="text-center text-sm text-zinc-600">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-serif text-zinc-900">{t('noOrders')}</p>
              <p className="mt-2 text-sm text-zinc-600">{t('noOrdersDescription')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#dcd7cf] bg-[#fdfdf9] overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {t('orderNumber')}
                        </p>
                        <p className="font-serif text-zinc-900">
                          #{order.paystack_reference.slice(-8)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {t('orderDate')}
                        </p>
                        <p className="text-sm text-zinc-900">{formatDate(order.created_at)}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-1">
                          {t('orderStatus')}
                        </p>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {t(`status_${order.status}`)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {t('orderTotal')}
                        </p>
                        <p className="font-serif text-zinc-900">R{order.total.toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.id ? null : order.id)
                        }
                        className="text-sm uppercase tracking-[0.3em] text-zinc-700 underline hover:text-zinc-900 transition-all duration-200 hover:underline-offset-4 hover:scale-105"
                      >
                        {expandedOrder === order.id ? 'Hide' : t('viewDetails')}
                      </button>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-6 space-y-6 border-t border-stone-200 pt-6">
                        {/* Order Items */}
                        <div>
                          <h3 className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-400">
                            {t('items')}
                          </h3>
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between border-b border-stone-200 pb-2"
                              >
                                <div>
                                  <p className="font-serif text-sm text-zinc-900">
                                    {item.product_snapshot.title?.en || 'Product'}
                                  </p>
                                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm text-zinc-900">
                                  R{item.total_price.toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h3 className="mb-2 text-xs uppercase tracking-[0.3em] text-stone-400">
                            {t('shippingAddress')}
                          </h3>
                          <p className="text-sm text-zinc-900">
                            {order.shipping_details.address_line1}
                            {order.shipping_details.address_line2 &&
                              `, ${order.shipping_details.address_line2}`}
                            <br />
                            {order.shipping_details.city}, {order.shipping_details.state_province}{' '}
                            {order.shipping_details.postal_code}
                            <br />
                            {order.shipping_details.country}
                          </p>
                        </div>

                        {/* Tracking Number */}
                        {order.tracking_number && (
                          <div>
                            <h3 className="mb-2 text-xs uppercase tracking-[0.3em] text-stone-400">
                              {t('trackingNumber')}
                            </h3>
                            <p className="font-mono text-sm text-zinc-900">
                              {order.tracking_number}
                            </p>
                          </div>
                        )}

                        {/* Totals */}
                        <div className="space-y-2 border-t border-stone-200 pt-4">
                          <div className="flex justify-between text-sm text-zinc-600">
                            <span>{t('subtotal')}</span>
                            <span>R{order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-zinc-600">
                            <span>{t('shipping')}</span>
                            <span>R{order.shipping_cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-serif text-zinc-900">
                            <span>{t('total')}</span>
                            <span>R{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
