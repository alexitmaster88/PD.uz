"use client"

const TOKEN_KEY = "telc_admin_token"
const LOGIN_PATH = "/telc/admin/login"

/**
 * fetch() for TELC admin API calls: attaches the admin session token.
 * On 401 it clears the stored session, redirects to the login page and throws,
 * so callers' existing `.catch()` / try-catch paths handle it.
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  let token: string | null = null
  try { token = localStorage.getItem(TOKEN_KEY) } catch {}

  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(input, { ...init, headers })
  if (res.status === 401) {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem("telc_admin")
    } catch {}
    if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
      window.location.href = LOGIN_PATH
    }
    throw new Error("Unauthorized")
  }
  return res
}
