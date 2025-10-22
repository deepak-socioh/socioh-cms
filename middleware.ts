import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith('/auth')
  const isPublicPage = nextUrl.pathname === '/' || isAuthPage

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
