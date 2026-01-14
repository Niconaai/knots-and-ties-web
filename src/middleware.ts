import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { updateSession } from './lib/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, update Supabase session
  const supabaseResponse = await updateSession(request);
  
  // Then, handle internationalization
  const intlResponse = intlMiddleware(request);
  
  // Merge Supabase cookies into intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  
  return intlResponse;
}

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes, static files, and _next
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|studio).*)'
  ]
};