// Server-only password hashing for telc_admins.password_hash.
// Format: scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>
// Legacy rows hold an unsalted SHA-256 hex digest; they are verified once and then
// re-hashed with scrypt on successful login (see app/api/telc/admin/login/route.ts).
// To create an admin by hand: `node scripts/hash-admin-password.mjs '<password>'`.
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "crypto"

const N = 16384, R = 8, P = 1, KEYLEN = 64

function scrypt(password: string, salt: Buffer, keylen: number, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCb(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key)))
  )
}

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`
}

export function isLegacyHash(stored: string): boolean {
  return /^[0-9a-f]{64}$/i.test(stored)
}

export async function verifyAdminPassword(password: string, stored: string): Promise<boolean> {
  if (isLegacyHash(stored)) {
    const given = createHash("sha256").update(password, "utf8").digest()
    return timingSafeEqual(given, Buffer.from(stored, "hex"))
  }

  const parts = stored.split("$")
  if (parts.length !== 6 || parts[0] !== "scrypt") return false
  const [, n, r, p, saltB64, hashB64] = parts as [string, string, string, string, string, string]
  const expected = Buffer.from(hashB64, "base64")
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  })
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

// Burn comparable CPU time when the email doesn't exist, so response timing
// doesn't reveal which admin emails are valid.
export async function dummyVerify(password: string): Promise<void> {
  await scrypt(password, Buffer.alloc(16), KEYLEN, { N, r: R, p: P })
}
