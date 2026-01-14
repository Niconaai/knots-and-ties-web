import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { paymentInitSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const rawBody = await request.json()
    
    // Validate and sanitize input
    const validation = paymentInitSchema.safeParse(rawBody)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message
          }))
        }, 
        { status: 400 }
      )
    }
    
    const body = validation.data
    const shipping_cost = 100 // flat rate

    const payload = {
      email: body.email,
      amount: Math.round((body.subtotal + shipping_cost) * 100),
      // redirect users to a frontend completion page; rely on webhook for server-side confirmation
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/payment/complete`,
      metadata: {
        shipping_details: body.shipping_details,
        cart: body.cart,
        language_preference: body.language_preference,
        subtotal: body.subtotal,
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
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
      }

      // Avoid duplicate pending orders
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('paystack_reference', reference)
        .limit(1)
        .maybeSingle()

      if (!existing) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              paystack_reference: reference,
              user_id: null,
              status: 'pending',
              shipping_details: body.shipping_details,
              language_preference: body.language_preference,
              subtotal: body.subtotal,
              shipping_cost,
              total: body.subtotal + shipping_cost,
            },
          ])
          .select()
          .single()

        if (orderError && process.env.NODE_ENV === 'development') {
          // Only log in development
        }
      }
    } catch {
      // Silent fail - order will be created by webhook if needed
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
