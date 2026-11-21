// Generate a password_hash value for a new telc_admins row.
// Usage: node scripts/hash-admin-password.mjs 'the-password'
// Then: INSERT INTO telc_admins (email, password_hash, role, name) VALUES ('x@y.uz', '<output>', 'admin', 'Name');
// Must match lib/admin-password.ts.
import { randomBytes, scryptSync } from "crypto"

const password = process.argv[2]
if (!password || password.length < 10) {
  console.error("Usage: node scripts/hash-admin-password.mjs '<password of at least 10 characters>'")
  process.exit(1)
}

const N = 16384, r = 8, p = 1
const salt = randomBytes(16)
const hash = scryptSync(password, salt, 64, { N, r, p })
console.log(`scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`)
