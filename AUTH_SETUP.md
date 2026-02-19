# Authentication System Setup

This application now includes a complete authentication system using Supabase Auth. Users can register, log in, view their orders, and administrators can manage all orders.

## Features

### For Customers
- **Registration**: Create an account with email and password
- **Login**: Access your account
- **Account Dashboard**: View and edit profile information
- **Order History**: View all past orders with detailed information
- **Auto-fill Checkout**: Logged-in users have their details automatically filled in checkout

### For Administrators
- **Order Management**: View and manage all customer orders
- **Status Updates**: Change order status (pending, paid, processing, shipped, cancelled)
- **Tracking Numbers**: Add tracking numbers to shipped orders
- **Search & Filter**: Find orders by customer name, email, or order ID
- **Filter by Status**: View orders by their current status

## Setup Instructions

### 1. Apply Database Migrations

You need to apply both migrations in order:

#### Using Supabase CLI (Recommended)
```bash
# Apply initial schema
supabase db push

# The migrations will be applied automatically in order:
# 1. 20241222000000_initial_schema.sql (profiles, orders, order_items)
# 2. 20250219000000_add_admin_role.sql (admin role support)
```

#### Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:
   - First: `supabase/migrations/20241222000000_initial_schema.sql`
   - Then: `supabase/migrations/20250219000000_add_admin_role.sql`

### 2. Configure Environment Variables

Ensure your `.env.local` file has the required Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Make a User an Administrator

After a user registers, you can make them an admin by running this SQL in Supabase:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

## Pages Overview

### Public Pages (No Login Required)
- `/login` - Sign in to existing account
- `/register` - Create new account
- All shop pages work for both guests and logged-in users

### Protected Pages (Login Required)
- `/account` - User dashboard with orders and profile
- `/admin` - Admin dashboard for order management (admin users only)

### Enhanced Pages
- `/checkout` - Auto-fills user details when logged in

## Navigation

The authentication system is integrated into the main navigation:

### Desktop
- User icon in the top-right corner
- Dropdown menu shows:
  - **Not logged in**: Login, Sign Up
  - **Logged in**: My Account, Admin (if admin user)

### Mobile
- Account links appear in the mobile menu
- Same options as desktop based on login status

## How It Works

### User Registration Flow
1. User fills out registration form (name, email, password)
2. Account is created in Supabase Auth
3. Profile is automatically created via database trigger
4. User can immediately log in

### Login Flow
1. User enters email and password
2. Session is created
3. User is redirected to their account page
4. Session persists across page reloads

### Order Association
- **Guest Orders**: Created with `user_id` as `NULL`
- **Logged-in Orders**: Automatically linked to user's profile
- Users can view all their past orders in the account page

### Checkout Auto-fill
When logged in:
- Full name, email, and phone are pre-filled from profile
- User can still modify these fields if needed
- Address still needs to be entered (privacy consideration)

## Database Structure

### profiles
- Stores user profile information
- Linked to Supabase Auth via `auth.users`
- Fields: `id`, `email`, `full_name`, `phone`, `is_admin`
- Auto-created when user registers

### orders
- `user_id` can be NULL (guest orders) or reference a profile (logged-in orders)
- Status: pending, paid, processing, shipped, cancelled
- Contains shipping details as JSONB
- Has tracking number field for shipped orders

### order_items
- Linked to orders
- Contains product snapshot (title, price, image)
- Prevents data loss if products are modified/deleted in Sanity

## Row Level Security (RLS)

The database uses RLS policies to ensure data security:

### Profiles
- Users can view and update their own profile only
- Admins have full access

### Orders
- Users can view their own orders
- Admins can view all orders
- Admins can update order status and tracking

### Order Items
- Visible to order owner and admins

## Testing the System

### As a Customer
1. Register a new account at `/register`
2. Log in at `/login`
3. Add items to cart
4. Go to checkout - notice your details are pre-filled
5. Complete an order
6. Visit `/account` to see your order history

### As an Administrator
1. Have a user account made admin (see step 3 in setup)
2. Log in with admin account
3. Visit `/admin` to see all orders
4. Update order statuses
5. Add tracking numbers for shipped orders
6. Use filters to find specific orders

## Customization

### Adding More Admin Users
```sql
UPDATE profiles SET is_admin = true WHERE email = 'another-admin@example.com';
```

### Removing Admin Access
```sql
UPDATE profiles SET is_admin = false WHERE email = 'user@example.com';
```

## Security Notes

1. **Password Requirements**: Minimum 6 characters (enforced by Supabase)
2. **Email Verification**: Currently disabled - add via Supabase settings if needed
3. **Admin Check**: Admin pages should verify `is_admin` status server-side
4. **Session Management**: Handled automatically by Supabase
5. **RLS Policies**: Ensure database-level security regardless of client-side code

## Troubleshooting

### Users can't log in
- Check Supabase Auth is enabled in your project
- Verify environment variables are set correctly
- Check browser console for errors

### Profile not created after registration
- Verify the trigger function `handle_new_user()` exists
- Check migrations were applied correctly
- Look for errors in Supabase logs

### Admin can't see all orders
- Verify `is_admin` is set to `true` in profiles table
- Check RLS policies were created by the migration
- Ensure second migration was applied

### Checkout not auto-filling
- Verify user is logged in
- Check profile data exists in database
- Look for console errors in browser

## Future Enhancements

Possible additions to consider:
- Email verification on registration
- Password reset functionality
- Order notifications via email
- Admin notifications for new orders
- User address book for stored shipping addresses
- OAuth login (Google, GitHub, etc.)
- User roles beyond just admin (e.g., staff, manager)

## Support

For issues related to:
- **Supabase Auth**: Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- **RLS Policies**: Check [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- **Next.js Integration**: Check [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
