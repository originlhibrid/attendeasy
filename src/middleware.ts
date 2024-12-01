import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isAuth = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    if (isAuthPage) {
      if (isAuth) {
        // Redirect to home if user is already logged in
        return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
    }

    if (!isAuth) {
      // Redirect to signin if user is not logged in
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Let the middleware function handle the auth check
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
