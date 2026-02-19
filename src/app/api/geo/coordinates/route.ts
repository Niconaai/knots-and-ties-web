import { NextResponse } from 'next/server'

type GeoRequest = {
  address_line1?: string
  city?: string
  state_province?: string
  postal_code?: string
  country?: string
}

export async function POST(request: Request) {
  const body: GeoRequest = await request.json()
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'Missing GOOGLE_MAPS_API_KEY' }, { status: 500 })
  }

  const addressParts = [body.address_line1, body.city, body.state_province, body.postal_code]
    .filter(Boolean)
    .join(', ')
  const country = body.country ?? 'South Africa'
  if (!addressParts) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  const encoded = encodeURIComponent(`${addressParts}, ${country}`)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&region=za&key=${key}`

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to contact Google Maps' }, { status: 502 })
  }

  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    return NextResponse.json({ error: 'No results' }, { status: 404 })
  }

  const result = data.results[0]
  return NextResponse.json({
    formatted_address: result.formatted_address,
    coordinates: result.geometry.location,
  })
}