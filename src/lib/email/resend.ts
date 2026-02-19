import { renderOrderConfirmationEN } from './templates/order-confirmation/en'
import { renderOrderConfirmationAF } from './templates/order-confirmation/af'

type Order = any
type OrderItem = any

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || `orders@${process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') ?? 'localhost'}`
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend error: ${res.status} ${body}`)
  }

  return res.json()
}

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[],
  shipping: any,
  language: 'en' | 'af' = 'en'
) {
  try {
    const to = shipping?.email || order?.shipping_details?.email
    if (!to) throw new Error('No recipient email available')

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const tpl = language === 'af' ? renderOrderConfirmationAF(order, items, shipping, appUrl) : renderOrderConfirmationEN(order, items, shipping, appUrl)

    return await sendEmail(to, tpl.subject, tpl.html)
  } catch (err) {
    // Re-throw to let caller handle
    throw err
  }
}
