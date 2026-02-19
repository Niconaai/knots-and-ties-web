import { z } from 'zod'

// ============ CHECKOUT VALIDATION ============

// Phone regex: South African format (+27 or 0 followed by 9 digits)
const phoneRegex = /^(?:\+27|0)\d{9}$/

// Email regex: Standard email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const shippingDetailsSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .transform((val) => val.trim()),
  
  email: z
    .string()
    .regex(emailRegex, 'Please enter a valid email address')
    .max(255, 'Email is too long')
    .transform((val) => val.toLowerCase().trim()),
  
  phone: z
    .string()
    .regex(phoneRegex, 'Please use format: +27XXXXXXXXX or 0XXXXXXXXX')
    .transform((val) => val.trim()),
  
  address_line1: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long')
    .transform((val) => val.trim()),
  
  address_line2: z
    .string()
    .max(200, 'Address line 2 is too long')
    .optional()
    .transform((val) => val?.trim() || undefined),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City name is too long')
    .transform((val) => val.trim()),
  
  state_province: z
    .string()
    .min(2, 'Province must be at least 2 characters')
    .max(100, 'Province name is too long')
    .transform((val) => val.trim()),
  
  postal_code: z
    .string()
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code is too long')
    .transform((val) => val.trim()),
  
  country: z
    .string()
    .default('South Africa'),
  
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
    formatted_address: z.string(),
  }).optional(),
})

export type ShippingDetails = z.infer<typeof shippingDetailsSchema>

// ============ CART ITEM VALIDATION ============

export const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  image: z.string().url().optional().or(z.any()), // Can be string URL or Sanity image object
  optionsText: z.string().max(500),
  quantity: z.number().int().positive().max(100),
})

export type CartItem = z.infer<typeof cartItemSchema>

// ============ PAYMENT INIT VALIDATION ============

export const paymentInitSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, 'Invalid email format')
    .transform((val) => val.toLowerCase().trim()),
  
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount exceeds maximum'), // Max R10,000 in cents
  
  shipping_details: shippingDetailsSchema,
  
  cart: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  
  language_preference: z.enum(['en', 'af']).default('en'),
  
  subtotal: z.number().positive(),
})

export type PaymentInitRequest = z.infer<typeof paymentInitSchema>

// ============ GEO/AUTOCOMPLETE VALIDATION ============

export const autocompleteSchema = z.object({
  input: z
    .string()
    .min(3, 'Search query too short')
    .max(200, 'Search query too long')
    .transform((val) => val.trim()),
})

export const placeDetailsSchema = z.object({
  placeId: z.string().min(1, 'Place ID required'),
})

export const coordinatesSchema = z.object({
  address_line1: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().default('South Africa'),
})

// ============ UTILITY FUNCTIONS ============

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'&]/g, '') // Remove dangerous characters
    .trim()
}

/**
 * Validate and sanitize shipping details
 * Returns { success: true, data } or { success: false, errors }
 */
export function validateShippingDetails(data: unknown) {
  const result = shippingDetailsSchema.safeParse(data)
  
  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    }
  }
  
  return {
    success: true as const,
    data: result.data,
  }
}

/**
 * Validate payment init request
 */
export function validatePaymentInit(data: unknown) {
  const result = paymentInitSchema.safeParse(data)
  
  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    }
  }
  
  return {
    success: true as const,
    data: result.data,
  }
}
