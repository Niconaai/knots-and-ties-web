# Supabase Setup Guide

## 1. Apply Database Migrations

You have two options to apply the schema:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Apply the migration:
```bash
supabase db push
```

### Option B: Manual via Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/20241222000000_initial_schema.sql`
4. Click **Run**

## 2. Get Your API Keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Verify the Setup

After applying the migration, you should have:

### Tables:
- ✅ `profiles` - User profile information
- ✅ `orders` - Order records with status tracking
- ✅ `order_items` - Line items with product snapshots

### Security:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only view/edit their own data
- ✅ Service role can bypass RLS for webhooks

### Automatic Features:
- ✅ New users automatically get a profile created
- ✅ Updated timestamps automatically maintained
- ✅ Proper indexes for query performance

## 5. Usage in Your Code

### Client Components (Browser):
```typescript
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // Fetch user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
}
```

### Server Components:
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
}
```

### Webhooks/API Routes (Service Role):
```typescript
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createServiceClient()
  
  // Service role can bypass RLS
  const { data } = await supabase
    .from('orders')
    .insert({ ... })
}
```

## 6. Test the Database

Try creating a test order in the SQL Editor:

```sql
INSERT INTO orders (
  paystack_reference,
  shipping_details,
  language_preference,
  subtotal,
  total
) VALUES (
  'TEST_REF_' || gen_random_uuid()::text,
  '{"full_name": "John Doe", "email": "test@example.com", "phone": "+27123456789", "address_line1": "123 Main St", "city": "Cape Town", "state_province": "Western Cape", "postal_code": "8000", "country": "South Africa"}'::jsonb,
  'en',
  500.00,
  600.00
) RETURNING *;
```

## Next Steps

- [ ] Test authentication flow
- [ ] Create order creation API route
- [ ] Set up Paystack webhook handler
- [ ] Configure Resend for email notifications
- [ ] Build admin dashboard for order management
