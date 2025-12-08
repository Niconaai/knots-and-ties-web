import createMiddleware from 'next-intl/middleware';
import {routing} from './routing'; // <--- Import the single source of truth
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(af|en)/:path*']
};