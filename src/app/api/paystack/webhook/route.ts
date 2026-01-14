import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/email/resend'

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Missing PAYSTACK_SECRET_KEY' }, { status: 500 })

  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')

  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(raw)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Accept a few possible success signals: event name or data.status
  const eventName = payload.event ?? payload.event_type ?? ''
  const dataStatus = payload.data?.status ?? ''
  const isSuccess =
    eventName === 'charge.success' ||
    eventName === 'transaction.success' ||
    dataStatus === 'success'

  if (!isSuccess) {
    return NextResponse.json({ received: true })
  }

  const data = payload.data || {}
  const reference: string = data.reference
  const metadata = data.metadata ?? {}

  const subtotal = metadata.subtotal ?? null
  const shipping_cost = metadata.shipping_cost ?? 100
  const total = (data.amount ? Number(data.amount) / 100 : subtotal ? subtotal + shipping_cost : null)
  const shipping_details = metadata.shipping_details ?? {}
  const language_preference = metadata.language_preference ?? 'en'
  const cart = metadata.cart ?? []

  try {
    const supabase = createServiceClient()

    // Idempotency: avoid inserting duplicate orders for the same reference
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('paystack_reference', reference)
      .limit(1)
      .maybeSingle()

    if (existing && existing.id) {
      return NextResponse.json({ status: 'ok', note: 'order exists' })
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          paystack_reference: reference,
          user_id: null,
          status: 'paid',
          shipping_details,
          language_preference,
          subtotal: subtotal ?? (total ? total - shipping_cost : 0),
          shipping_cost,
          total: total ?? 0,
        },
      ])
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: orderError ?? 'Failed to create order' }, { status: 500 })
    }

    if (Array.isArray(cart) && cart.length > 0) {
      const items = cart.map((it: any) => ({
        order_id: order.id,
        sanity_product_id: it.sanity_product_id ?? it.id ?? '',
        product_snapshot: it.snapshot ?? it,
        quantity: it.quantity ?? 1,
        unit_price: it.unit_price ?? it.price ?? 0,
        total_price: (it.quantity ?? 1) * (it.unit_price ?? it.price ?? 0),
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(items)
      if (itemsError) {
        return NextResponse.json({ error: itemsError }, { status: 500 })
      }
      // Attempt to send confirmation email (best-effort)
      try {
        // sendOrderConfirmation expects order, items, shipping, language
        await sendOrderConfirmation(order, items, shipping_details, (language_preference as 'en' | 'af'))
      } catch {
        // Silent fail - email errors should not fail the webhook
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
