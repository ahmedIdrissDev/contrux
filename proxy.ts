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
  'achat(.*)'
  
])

// Routes that anyone with a valid role (User, Manager, Admin) can access
const isUserRoute = createRouteMatcher([
  '/demande(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next()
  
  const { sessionClaims , isAuthenticated } = await auth()
  const pathname =  req.nextUrl.pathname
  if (!isAuthenticated) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url })
  }

  const role = sessionClaims?.metadata?.role as string | undefined
   if(isAuthenticated && pathname=='/'){
          return NextResponse.redirect(new URL('/material', req.url))
   }
  // 1. Admin only check
  if (isAdminOnlyRoute(req)) {
    if (role !='system:admin:all') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.next()
  }

  // 2. Manager & Admin check
  if (isManagerRoute(req)) {
    if (role !== 'system:manager:all' && role !== 'system:admin:all') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.next()
  }

  // 3. Any role check for user routes
  if (isUserRoute(req)) {
    if (!role) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}