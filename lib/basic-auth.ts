import { createHash, timingSafeEqual } from "crypto"

// Constant-time string comparison (hashing first makes lengths equal).
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest())
}

/**
 * Checks an `Authorization: Basic ...` header against expected credentials.
 * Returns false if either expected value is missing, so an unset env var never matches.
 * Splits on the FIRST colon only (passwords may contain ':').
 */
export function checkBasicAuth(header: string | null, expectedUser: string | undefined, expectedPass: string | undefined): boolean {
  if (!expectedUser || !expectedPass || !header?.startsWith("Basic ")) return false
  const decoded = Buffer.from(header.slice(6), "base64").toString()
  const i = decoded.indexOf(":")
  if (i === -1) return false
  const userOk = safeEqual(decoded.slice(0, i), expectedUser)
  const passOk = safeEqual(decoded.slice(i + 1), expectedPass)
  return userOk && passOk
}
