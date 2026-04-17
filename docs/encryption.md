# Credential Encryption

## What Is Encrypted

Two fields in `user_settings` are encrypted before being written to the database:

| Field | What it holds |
|---|---|
| `kayakoPasswordEnc` | Kayako API password |
| `anthropicKeyEnc` | Anthropic API key |

`kayakoUrl` and `kayakoEmail` are stored in plaintext — they are not secrets.

---

## Algorithm

**AES-256-GCM** via Node.js `crypto` module.

- **Key size**: 256 bits (32 bytes), provided as a 64-character hex string in `ENCRYPTION_SECRET`
- **IV (nonce)**: 12 bytes, generated fresh with `crypto.randomBytes(12)` for each encryption. This means the same plaintext encrypts to a different ciphertext every time.
- **Authentication tag**: 16 bytes (GCM mode provides authenticated encryption — any tampering is detected on decrypt)

### Stored format

```
base64( iv[12 bytes] + authTag[16 bytes] + ciphertext[variable] )
```

All three parts are concatenated before base64-encoding so a single column holds everything needed to decrypt.

---

## Code

`lib/encryption.ts` — server-only, never import in client components.

```typescript
// Encrypt
export function encrypt(plaintext: string): string
// Returns: base64(iv + authTag + ciphertext)

// Decrypt
export function decrypt(blob: string): string
// Throws if key is wrong or ciphertext is tampered
```

### Key derivation

The key comes directly from `ENCRYPTION_SECRET` (a 64-char hex string → 32-byte buffer). There is no KDF — the secret itself is the 256-bit key. Keep it long, random, and secret.

---

## Generating the Secret

```bash
openssl rand -hex 32
```

This produces exactly 64 hex characters. Put the output in `.env.local` as `ENCRYPTION_SECRET`.

**Do not reuse the secret across environments.** Use a different value for local dev and production.

---

## Key Rotation

There is no automatic key rotation. If you need to rotate:

1. Generate a new `ENCRYPTION_SECRET`
2. For each `UserSettings` row: decrypt the old values with the old key, re-encrypt with the new key, update the row
3. Deploy with the new secret

Until rotation is implemented, treat the secret as permanent. Back it up securely.

---

## Security Properties

- **Confidentiality**: AES-256 is computationally infeasible to brute-force
- **Integrity**: GCM auth tag detects any modification to the ciphertext. `decrypt()` throws if the blob is tampered
- **Uniqueness**: Fresh IV per encryption prevents ciphertext comparison attacks (two users with the same password get different stored values)
- **No plaintext in DB**: Even with full DB read access, credentials are unreadable without `ENCRYPTION_SECRET`
- **No plaintext in logs**: Credentials are decrypted in memory inside the API route handler and used immediately — they are not logged or returned to the client
