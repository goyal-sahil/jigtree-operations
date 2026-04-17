import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// Server-only — never import this in client components.
const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_SECRET
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_SECRET must be a 64-character hex string (32 bytes). Generate with: openssl rand -hex 32')
  }
  return Buffer.from(hex, 'hex')
}

/**
 * Encrypt a plaintext string.
 * Returns base64( iv[12 bytes] + authTag[16 bytes] + ciphertext )
 * Each call produces a unique output (fresh random IV).
 */
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

/**
 * Decrypt a base64 blob produced by encrypt().
 * Throws if the key is wrong or the blob is tampered.
 */
export function decrypt(blob: string): string {
  const key = getKey()
  const buf = Buffer.from(blob, 'base64')
  const iv       = buf.subarray(0, 12)
  const authTag  = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(ciphertext) + decipher.final('utf8')
}
