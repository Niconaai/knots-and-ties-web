'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

type Order = {
  id: string
  user_id: string | null
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
  profiles: {
    full_name: string | null
    email: string
    phone: string | null
  } | null
}

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'cancelled'] as const
type OrderStatus = typeof STATUSES[number]

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const t = useTranslations('Admin')
  const tAccount = useTranslations('Account')
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [trackingInput, setTrackingInput] = useState<{ [key: string]: string }>({})
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
    if (user) {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchQuery])

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
          ),
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.paystack_reference.toLowerCase().includes(query) ||
          order.profiles?.email?.toLowerCase().includes(query) ||
          order.profiles?.full_name?.toLowerCase().includes(query) ||
          order.shipping_details.full_name?.toLowerCase().includes(query)
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const updateTrackingNumber = async (orderId: string) => {
    const tracking = trackingInput[orderId]
    if (!tracking) return

    try {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: tracking })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
      setTrackingInput({ ...trackingInput, [orderId]: '' })
    } catch (error) {
      console.error('Error updating tracking:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-stone-500">{t('allOrders')}</p>
            <h1 className="text-3xl font-serif text-zinc-900">{t('title')}</h1>
            <p className="text-sm text-zinc-600">{t('subtitle')}</p>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                {t('filterStatus')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
              >
                <option value="all">{t('allStatuses')}</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {tAccount(`status_${status}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          {loading ? (
            <p className="text-center text-sm text-zinc-600">Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-serif text-zinc-900">{t('noOrders')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#dcd7cf] bg-[#fdfdf9] overflow-hidden"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {tAccount('orderNumber')}
                        </p>
                        <p className="font-serif text-zinc-900 text-sm">
                          #{order.paystack_reference.slice(-8)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {t('customer')}
                        </p>
                        <p className="text-sm text-zinc-900">
                          {order.profiles?.full_name || order.shipping_details.full_name || 'Guest'}
                        </p>
                        <p className="text-xs text-stone-500">
                          {order.profiles?.email || order.shipping_details.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {tAccount('orderDate')}
                        </p>
                        <p className="text-sm text-zinc-900">{formatDate(order.created_at)}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-1">
                          {tAccount('orderStatus')}
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          disabled={updatingStatus === order.id}
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] border-0 ${getStatusColor(
                            order.status
                          )} ${updatingStatus === order.id ? 'opacity-50' : 'cursor-pointer'}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {tAccount(`status_${status}`)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                          {tAccount('orderTotal')}
                        </p>
                        <p className="font-serif text-zinc-900">R{order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                      className="text-sm uppercase tracking-[0.3em] text-zinc-700 underline hover:text-zinc-900 transition-all duration-200 hover:underline-offset-4 hover:scale-105"
                    >
                      {expandedOrder === order.id ? 'Hide' : tAccount('viewDetails')}
                    </button>

                    {expandedOrder === order.id && (
                      <div className="mt-6 space-y-6 border-t border-stone-200 pt-6">
                        {/* Order Items */}
                        <div>
                          <h3 className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-400">
                            {t('orderItems')}
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
                                  <p className="text-xs text-stone-500">
                                    Qty: {item.quantity} × R{item.unit_price.toFixed(2)}
                                  </p>
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
                            {tAccount('shippingAddress')}
                          </h3>
                          <p className="text-sm text-zinc-900">
                            {order.shipping_details.full_name}
                            <br />
                            {order.shipping_details.phone}
                            <br />
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
                        <div>
                          <h3 className="mb-2 text-xs uppercase tracking-[0.3em] text-stone-400">
                            {tAccount('trackingNumber')}
                          </h3>
                          {order.tracking_number ? (
                            <p className="font-mono text-sm text-zinc-900">
                              {order.tracking_number}
                            </p>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={trackingInput[order.id] || ''}
                                onChange={(e) =>
                                  setTrackingInput({ ...trackingInput, [order.id]: e.target.value })
                                }
                                placeholder={t('addTracking')}
                                className="flex-1 rounded-full border border-[#dcd7cf] bg-white px-4 py-2 text-sm text-zinc-900 transition focus:border-zinc-900 focus:outline-none"
                              />
                              <button
                                onClick={() => updateTrackingNumber(order.id)}
                                disabled={!trackingInput[order.id]}
                                className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                              >
                                {t('saveTracking')}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 border-t border-stone-200 pt-4">
                          <div className="flex justify-between text-sm text-zinc-600">
                            <span>{tAccount('subtotal')}</span>
                            <span>R{order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-zinc-600">
                            <span>{tAccount('shipping')}</span>
                            <span>R{order.shipping_cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-serif text-zinc-900">
                            <span>{tAccount('total')}</span>
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
