import { NextResponse } from 'next/server'
import { autocompleteSchema, sanitizeString } from '@/lib/validation'

export async function POST(request: Request) {
  const rawBody = await request.json()
  
  // Validate input
  const validation = autocompleteSchema.safeParse(rawBody)
  
  if (!validation.success) {
    return NextResponse.json({ predictions: [] })
  }
  
  const input = sanitizeString(validation.data.input)
  const key = process.env.GOOGLE_MAPS_API_KEY

  if (!key) {
    return NextResponse.json({ error: 'Missing GOOGLE_MAPS_API_KEY' }, { status: 500 })
  }

  // Use Geocoding API for address search since it's simpler and already enabled
  const encoded = encodeURIComponent(`${input}, South Africa`)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&region=za&key=${key}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    
    // Check for API errors
    if (data.status === 'REQUEST_DENIED') {
      return NextResponse.json({ 
        error: 'Address lookup unavailable', 
        predictions: [] 
      }, { status: 403 })
    }
    
    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ predictions: [] })
    }

    if (!res.ok || data.status === 'UNKNOWN_ERROR') {
      return NextResponse.json({ 
        error: 'Failed to contact Google Maps', 
        predictions: [] 
      }, { status: 502 })
    }

    // Convert geocoding results to autocomplete-like format
    const predictions = (data.results || []).slice(0, 5).map((result: any) => ({
      place_id: result.place_id,
      description: result.formatted_address,
    }))

    return NextResponse.json({
      predictions,
      status: data.status
    })
  } catch {
    return NextResponse.json({ error: 'Autocomplete failed', predictions: [] }, { status: 500 })
  }
}
