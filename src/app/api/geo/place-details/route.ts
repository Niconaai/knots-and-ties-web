import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { placeId } = await request.json()
  const key = process.env.GOOGLE_MAPS_API_KEY

  if (!key) {
    return NextResponse.json({ error: 'Missing GOOGLE_MAPS_API_KEY' }, { status: 500 })
  }

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID required' }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_components,formatted_address,geometry&key=${key}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to contact Google Maps' }, { status: 502 })
    }

    const data = await res.json()
    
    if (!data.result) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }

    const result = data.result
    const components = result.address_components || []

    // Extract address components
    const getComponent = (types: string[]) => {
      const component = components.find((c: any) => 
        types.some(type => c.types.includes(type))
      )
      return component?.long_name || ''
    }

    const address_line1 = [
      getComponent(['street_number']),
      getComponent(['route']),
    ].filter(Boolean).join(' ')

    const city = getComponent(['locality', 'sublocality']) || 
                 getComponent(['administrative_area_level_2'])

    const state_province = getComponent(['administrative_area_level_1'])
    const postal_code = getComponent(['postal_code'])
    const country = getComponent(['country'])

    return NextResponse.json({
      formatted_address: result.formatted_address,
      coordinates: result.geometry.location,
      address_components: {
        address_line1: address_line1 || result.formatted_address.split(',')[0],
        city,
        state_province,
        postal_code,
        country,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Place details lookup failed' }, { status: 500 })
  }
}
