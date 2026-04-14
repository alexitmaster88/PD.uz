import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Supported languages
const supportedLanguages = ["de", "en", "ru", "uz"]
const defaultLanguage = "de"

// Function to get language from path
function getLanguageFromPath(pathname: string): string | null {
  // Check if the path starts with a supported language code
  const segments = pathname.split("/")
  const langSegment = segments[1]

  if (supportedLanguages.includes(langSegment)) {
    return langSegment
  }

  return null
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip for assets, api routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Skip files like favicon.ico, etc.
  ) {
    return NextResponse.next()
  }

  // Get language from path
  const pathnameLanguage = getLanguageFromPath(pathname)

  // If URL already has a valid language code, no need to redirect
  if (pathnameLanguage) {
    // Set the HTML lang attribute
    const response = NextResponse.next()
    response.headers.set("x-language", pathnameLanguage)
    return response
  }

  // Try to get language from cookie or accept-language header
  const cookieLanguage = request.cookies.get("preferredLanguage")?.value

  // Get browser language
  const acceptLanguage = request.headers.get("accept-language") || ""
  const browserLanguages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase())

  // Find the first supported language from browser preferences
  const browserLanguage = browserLanguages.find((lang) => supportedLanguages.includes(lang))

  // Determine which language to use (cookie > browser > default)
  const language =
    cookieLanguage && supportedLanguages.includes(cookieLanguage) ? cookieLanguage : browserLanguage || defaultLanguage

  // Create the new URL with language prefix
  const newUrl = new URL(`/${language}${pathname === "/" ? "" : pathname}${search}`, request.url)

  // Redirect to the new URL
  return NextResponse.redirect(newUrl)
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except those starting with:
    "/((?!_next/|_vercel|api/|.*\\.).*)",
  ],
}
