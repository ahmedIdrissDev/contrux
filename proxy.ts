// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/unauthorized',
])

// Routes that ONLY admins can access
const isAdminOnlyRoute = createRouteMatcher([
  '/administration(.*)',
])

// Routes that Managers AND Admins can access
const isManagerRoute = createRouteMatcher([
  '/chantier(.*)',
  '/material(.*)',
  '/stock(.*)',
  '/achat(.*)'
])

// Routes that anyone with a valid role can access
const isUserRoute = createRouteMatcher([
  '/demande(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId, redirectToSignIn } = await auth()
  const pathname = req.nextUrl.pathname

  // Handle public routes first
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  const role = sessionClaims?.metadata?.role

  // Redirect from root to default dashboard if authenticated
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/material', req.url))
  }

  // 1. Admin only check
  if (isAdminOnlyRoute(req)) {
    if (role !== 'system:admin:all') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // 2. Manager & Admin check
  if (isManagerRoute(req)) {
    if (role !== 'system:manager:all' && role !== 'system:admin:all') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // 3. Any role check for user routes
  if (isUserRoute(req)) {
    if (!role) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}