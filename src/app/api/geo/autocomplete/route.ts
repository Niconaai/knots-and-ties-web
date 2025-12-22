import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { input } = await request.json()
  const key = process.env.GOOGLE_MAPS_API_KEY

  if (!key) {
    return NextResponse.json({ error: 'Missing GOOGLE_MAPS_API_KEY' }, { status: 500 })
  }

  if (!input || input.trim().length < 3) {
    return NextResponse.json({ predictions: [] })
  }

  // Use Geocoding API for address search since it's simpler and already enabled
  const encoded = encodeURIComponent(`${input}, South Africa`)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&region=za&key=${key}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    
    // Check for API errors
    if (data.status === 'REQUEST_DENIED') {
      console.error('Google API Error:', data.error_message)
      return NextResponse.json({ 
        error: `API Error: ${data.error_message || 'Please check API key'}`, 
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
  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json({ error: 'Autocomplete failed', predictions: [] }, { status: 500 })
  }
}
