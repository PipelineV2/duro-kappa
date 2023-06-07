import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { is_user_logged_in } from '@/contexts/auth.context';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(is_user_logged_in())
  return NextResponse.redirect(new URL('/home', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/(.*)',
};
