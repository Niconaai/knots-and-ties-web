import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

type InitRequest = {
  email: string
  amount: number // in cents (e.g., ZAR cents)
  shipping_details?: any
  cart?: any
  language_preference?: 'en' | 'af'
  subtotal?: number
}

export async function POST(request: Request) {
  try {
    const body: InitRequest = await request.json()

    const shipping_cost = 100 // flat rate

    const payload = {
      email: body.email,
      amount: Math.round((body.subtotal ?? 0 + shipping_cost) * 100),
      // redirect users to a frontend completion page; rely on webhook for server-side confirmation
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/payment/complete`,
      metadata: {
        shipping_details: body.shipping_details ?? {},
        cart: body.cart ?? [],
        language_preference: body.language_preference ?? 'en',
        subtotal: body.subtotal ?? null,
        shipping_cost,
      },
    }

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    const reference = data.data.reference

    // Create a pending order record with snapshot (idempotent guard)
    try {
      const supabase = createServiceClient()

      // Check if Supabase client is properly configured
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
      }

      // Avoid duplicate pending orders
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('paystack_reference', reference)
        .limit(1)
        .maybeSingle()

      let orderRecord
      if (!existing) {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              paystack_reference: reference,
              user_id: null,
              status: 'pending',
              shipping_details: body.shipping_details ?? {},
              language_preference: (body.language_preference ?? 'en') as 'en' | 'af',
              subtotal: body.subtotal ?? 0,
              shipping_cost,
              total: (body.subtotal ?? 0) + shipping_cost,
            },
          ])
          .select()
          .single()

        if (orderError) {
          console.error('Failed to create pending order', orderError)
          console.error('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
          console.error('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
          console.error('Service key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length)
        }
        orderRecord = order
      }
    } catch (err) {
      console.error('Error creating pending order', err)
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference,
      raw: data,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
