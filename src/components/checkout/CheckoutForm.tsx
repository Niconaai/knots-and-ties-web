'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLocale, useTranslations } from 'next-intl'

type Coordinates = {
  lat: number
  lng: number
  formatted_address: string
}

type ShippingDetails = {
  full_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state_province: string
  postal_code: string
  country: string
  coordinates?: Coordinates
}

type MapStatus = 'idle' | 'loading' | 'success' | 'error'

type PlacePrediction = {
  place_id: string
  description: string
}

const ADDRESS_FIELDS = new Set(['address_line1', 'city', 'state_province', 'postal_code', 'country'])
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(?:\+27|0)\d{9}$/

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
const isValidPhone = (value: string) => PHONE_REGEX.test(value)

export default function CheckoutForm() {
  const { items, total } = useCart()
  const { user, profile } = useAuth()
  const t = useTranslations('Checkout')
  const locale = useLocale()
  const [shipping, setShipping] = useState<ShippingDetails>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: 'South Africa',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapQuery, setMapQuery] = useState('')
  const [mapStatus, setMapStatus] = useState<MapStatus>('idle')
  const [mapHelperText, setMapHelperText] = useState<string | null>(null)
  const [allowManualEntry, setAllowManualEntry] = useState(false)
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user && profile) {
      setShipping((prev) => ({
        ...prev,
        full_name: profile.full_name || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
      }))
    }
  }, [user, profile])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const shippingCost = 100

  if (items.length === 0) {
    return (
      <section className="bg-[#f9f7f2] py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-3 rounded-3xl border border-[#d8d3c4] bg-white/70 p-10 shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
          <p className="text-sm uppercase tracking-[0.4em] text-stone-400">{t('heading')}</p>
          <h1 className="text-3xl font-serif text-zinc-900">{t('emptyCart')}</h1>
          <p className="text-sm text-zinc-600">{t('subtitle')}</p>
        </div>
      </section>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShipping((prev) => {
      const next = { ...prev, [name]: value }
      if (ADDRESS_FIELDS.has(name)) {
        next.coordinates = undefined
      }
      return next
    })

    if (ADDRESS_FIELDS.has(name)) {
      setMapStatus('idle')
      setMapHelperText(null)
    }
  }

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (input: string) => {
    if (input.trim().length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    try {
      const res = await fetch('/api/geo/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        setMapHelperText(data.error || 'Address lookup failed')
        setMapStatus('error')
        setSuggestions([])
        setShowDropdown(false)
        return
      }
      
      if (data.predictions) {
        setSuggestions(data.predictions)
        setShowDropdown(data.predictions.length > 0)
      }
    } catch {
      setMapHelperText('Network error - could not reach address service')
      setMapStatus('error')
    }
  }

  // Handle input change with debounce
  const handleMapQueryChange = (value: string) => {
    setMapQuery(value)
    setSelectedIndex(-1)
    
    if (mapStatus !== 'idle') {
      setMapStatus('idle')
      setMapHelperText(null)
    }

    // Debounce the autocomplete request
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  // Handle place selection
  const handlePlaceSelect = async (placeId: string, description: string) => {
    setMapQuery(description)
    setShowDropdown(false)
    setSuggestions([])
    setMapStatus('loading')
    setMapHelperText(null)

    try {
      const res = await fetch('/api/geo/place-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to get place details')
      }

      const coordinates: Coordinates = {
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
        formatted_address: data.formatted_address,
      }

      const components = data.address_components

      setShipping((prev) => ({
        ...prev,
        address_line1: components.address_line1 || '',
        city: components.city || '',
        state_province: components.state_province || '',
        postal_code: components.postal_code || '',
        country: components.country || 'South Africa',
        coordinates,
      }))
      setMapStatus('success')
      setMapHelperText(data.formatted_address)
      setAllowManualEntry(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Place lookup failed'
      setMapStatus('error')
      setMapHelperText(message)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const selected = suggestions[selectedIndex]
          handlePlaceSelect(selected.place_id, selected.description)
        }
        break
      case 'Escape':
        setShowDropdown(false)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(shipping.email)) {
      setError(t('emailInvalid'))
      return
    }

    if (!isValidPhone(shipping.phone)) {
      setError(t('phoneInvalid'))
      return
    }

    setLoading(true)

    try {
      const payload = {
        email: shipping.email,
        amount: Math.round((total + shippingCost) * 100),
        shipping_details: shipping,
        cart: items.map((it) => ({
          id: it.productId,
          title: it.title,
          quantity: it.quantity,
          unit_price: it.price,
          snapshot: it,
        })),
        language_preference: locale === 'af' ? 'af' : 'en',
        subtotal: total,
      }

      const res = await fetch('/api/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data))

      if (!data.authorization_url) throw new Error('Missing authorization URL')
      window.location.href = data.authorization_url
    } catch (err: any) {
      setError(err.message ?? String(err))
      setLoading(false)
    }
  }

  const formattedTotal = (total + shippingCost).toFixed(2)

  const mapStatusMessage =
    mapStatus === 'loading'
      ? t('mapLoading')
      : mapStatus === 'success'
        ? t('mapSuccess')
        : mapStatus === 'error'
          ? t('mapError')
          : ''

  return (
    <section className="bg-[#f9f7f2] py-16 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[36px] border border-[#d8d3c4] bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-stone-500">{t('heading')}</p>
          <h1 className="text-3xl font-serif text-zinc-900 sm:text-4xl">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-600 sm:text-base">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Search Section with Autocomplete */}
            <div className="space-y-3 rounded-3xl border border-[#dcd7cf] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-stone-400">{t('mapLabel')}</p>
              
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={mapQuery}
                  onChange={(e) => handleMapQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('mapPlaceholder')}
                  className="w-full rounded-full border border-[#dcd7cf] bg-[#fdfdf9] px-4 py-3 text-sm text-zinc-900 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none"
                />
                
                {/* Autocomplete Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full rounded-2xl border border-[#dcd7cf] bg-white shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => handlePlaceSelect(suggestion.place_id, suggestion.description)}
                        className={`w-full text-left px-4 py-3 text-sm transition ${
                          index === selectedIndex 
                            ? 'bg-stone-100 text-zinc-900' 
                            : 'text-zinc-700 hover:bg-stone-50'
                        } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                          index === suggestions.length - 1 ? 'rounded-b-2xl' : 'border-b border-stone-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{suggestion.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {mapStatus !== 'idle' && (
                <p
                  aria-live="polite"
                  className={`text-sm ${mapStatus === 'error' ? 'text-rose-600' : 'text-stone-500'}`}
                >
                  {mapStatusMessage}
                  {mapHelperText && mapStatus !== 'loading' && (
                    <span className="mt-1 block text-[11px] text-stone-400">{mapHelperText}</span>
                  )}
                </p>
              )}

              {/* Map Display */}
              {mapStatus === 'success' && shipping.coordinates && (
                <div className="rounded-2xl overflow-hidden border border-[#dcd7cf]">
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${shipping.coordinates.lat},${shipping.coordinates.lng}&zoom=15`}
                    title="Location Map"
                  />
                </div>
              )}

              <p className="text-[11px] text-stone-500">{t('mapNote')}</p>
            </div>

            {/* Manual Entry Checkbox */}
            {(mapStatus === 'error' || mapStatus === 'success') && (
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={allowManualEntry}
                  onChange={(e) => setAllowManualEntry(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300"
                />
                <span>{t('manualEntry')}</span>
              </label>
            )}

            {/* Personal Details Section */}
            <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.4em] text-stone-400">{t('shippingLabel')}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label={t('fullName')} name="full_name" value={shipping.full_name} onChange={handleChange} required />
              </div>
              <Input label={t('email')} name="email" type="email" value={shipping.email} onChange={handleChange} required />
              <Input label={t('phone')} name="phone" type="tel" value={shipping.phone} onChange={handleChange} required />
            </div>

            {/* Conditional Address Fields */}
            {(mapStatus === 'success' || allowManualEntry) && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label={t('address')} 
                  name="address_line1" 
                  value={shipping.address_line1} 
                  onChange={handleChange} 
                  required 
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
                <Input 
                  label={t('addressDetail')} 
                  name="address_line2" 
                  value={shipping.address_line2} 
                  onChange={handleChange}
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
                <Input 
                  label={t('city')} 
                  name="city" 
                  value={shipping.city} 
                  onChange={handleChange} 
                  required
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
                <Input 
                  label={t('state')} 
                  name="state_province" 
                  value={shipping.state_province} 
                  onChange={handleChange} 
                  required
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
                <Input 
                  label={t('postal')} 
                  name="postal_code" 
                  value={shipping.postal_code} 
                  onChange={handleChange} 
                  required
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
                <Input 
                  label={t('country')} 
                  name="country" 
                  value={shipping.country} 
                  onChange={handleChange} 
                  required
                  disabled={mapStatus === 'success' && !allowManualEntry}
                />
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.4em] text-stone-400">{t('note')}</p>
            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-zinc-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-stone-900 disabled:opacity-60"
            >
              {loading ? t('redirecting') : t('pay')}
            </button>
          </form>

          <aside className="space-y-6 rounded-3xl border border-[#d8d3c4] bg-[#f9f7f2] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-stone-400">{t('summary')}</p>
              <h3 className="text-2xl font-serif text-zinc-900">R{formattedTotal}</h3>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-stone-200 pb-2 last:border-none">
                  <div>
                    <p className="font-serif text-sm text-zinc-900">{item.title}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">{item.optionsText}</p>
                  </div>
                  <div className="text-right text-sm text-zinc-600">{item.quantity} × R{item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>{t('shipping')}</span>
              <span>R{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.4em] text-stone-500">
              <span>{t('total')}</span>
              <span>R{formattedTotal}</span>
            </div>
            <p className="text-xs text-stone-500">{t('note')}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

type InputProps = {
  label: string
  name: string
  value: string | undefined
  required?: boolean
  type?: string
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

function Input({ label, name, value, required, type = 'text', disabled, onChange }: InputProps) {
  return (
    <label className="text-sm text-stone-500">
      <span className="mb-1 block text-xs uppercase tracking-[0.3em] text-stone-400">{label}</span>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-full border px-4 py-3 text-sm shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition focus:border-zinc-900 focus:outline-none ${
          disabled 
            ? 'border-stone-300 bg-stone-100 text-stone-600 cursor-not-allowed' 
            : 'border-[#dcd7cf] bg-[#fdfdf9] text-zinc-900'
        }`}
      />
    </label>
  )
}
