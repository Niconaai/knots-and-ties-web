export function renderOrderConfirmationAF(order: any, items: any[], shipping: any, appUrl: string) {
  const logo = `${appUrl.replace(/\/$/, '')}/logo_hor.png`
  const itemsHtml = (items || [])
    .map(
      (it: any) => `
        <tr>
          <td style="padding:8px 12px;border-top:1px solid #eee">${it.product_snapshot?.title || it.sanity_product_id}</td>
          <td style="padding:8px 12px;border-top:1px solid #eee;text-align:center">${it.quantity}</td>
          <td style="padding:8px 12px;border-top:1px solid #eee;text-align:right">R${(Number(it.unit_price) || 0).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Bestelling bevestig</title>
  </head>
  <body style="margin:0;background:#f7f6f3;font-family:Inter, system-ui, -apple-system, 'Helvetica Neue', Arial;color:#0f172a">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="padding:32px 16px;">
          <table style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding:24px 24px;border-bottom:1px solid #eee;text-align:left;">
                <img src="${logo}" alt="Knots & Ties" width="180" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 12px 0;font-size:20px;color:#111827">Dankie vir jou bestelling</h1>
                <p style="margin:0 0 16px 0;color:#374151">Verwysing: <strong>${order.paystack_reference}</strong></p>

                <h3 style="margin-top:18px;margin-bottom:8px;color:#111827">Items</h3>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  ${itemsHtml}
                </table>

                <h3 style="margin-top:18px;margin-bottom:8px;color:#111827">Versending</h3>
                <p style="margin:0 0 8px 0">${shipping.full_name || ''}<br/>${shipping.address_line1 || ''}${shipping.address_line2 ? ', ' + shipping.address_line2 : ''}<br/>${shipping.city || ''}</p>

                <p style="margin-top:20px;color:#6b7280">Asseblief antwoord op hierdie e-pos as jy vrae het.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#fbfaf8;color:#6b7280;font-size:13px;text-align:center">Knots & Ties - Handmade in South Africa</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `

  return {
    subject: `Bestelling bevestig — ${order.paystack_reference}`,
    html,
  }
}
