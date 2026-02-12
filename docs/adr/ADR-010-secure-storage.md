# ADR-010: Secure Storage (PIN and Realm Encryption Key)

## Status

Accepted

## Context

FinTrack stores sensitive data locally: user PIN for app access and all app data in Realm. We need to ensure:

- PIN is never stored or logged in plaintext; only a hash is used for verification.
- Realm database is encrypted at rest; the encryption key must be stored securely and never in plaintext or logs.
- All sensitive values use platform secure storage (Keychain on iOS, Keystore on Android) via a single abstraction.

## Decision

### 1. Secure storage abstraction

- **Library**: `react-native-keychain` for Keychain (iOS) and Keystore (Android).
- **Service**: `src/services/secureStorageService/` exposes:
  - **PIN**: `setPin(pin)`, `verifyPin(pin)`, `hasPin()`, `getPinHash()` / `setPinHash()`, `clearPinHash()`.
  - **Realm key**: `getOrCreateRealmEncryptionKey()`, `getRealmEncryptionKey()`, `setRealmEncryptionKey()`, `generateRealmEncryptionKey()`.

### 2. Where things are stored

| Data                 | Storage location                                            | Format                                    |
| -------------------- | ----------------------------------------------------------- | ----------------------------------------- |
| PIN                  | Keychain / Keystore (service: `@fintrack/secure_pin_hash`)  | bcrypt hash only; **never** plaintext PIN |
| Realm encryption key | Keychain / Keystore (service: `@fintrack/secure_realm_key`) | 64-byte key, stored as hex string         |

- PIN is **never** written to disk or logs in plaintext. Only the bcrypt hash is persisted for verification.
- Realm encryption key is generated once (secure random), stored in Keychain/Keystore, and reused for the lifetime of the app database.

### 3. Realm encryption

- **Config**: `src/db/realmConfig.ts` — `getRealmConfig()` returns a Realm configuration with:
  - `encryptionKey`: 64-byte key from `getOrCreateRealmEncryptionKey()` (from secure storage, or generated and then stored).
  - All app data (transactions, etc.) will live in this single encrypted Realm.

### 4. Security practices

- No sensitive data (PIN, Realm key, or any secret) is logged or written to non-secure storage.
- Constants for Keychain service names are not logged.
- `react-native-get-random-values` is used for key generation so `crypto.getRandomValues` is available in React Native.

## Consequences

- PIN verification is done via bcrypt compare against the stored hash; plaintext PIN is only in memory during the check.
- Realm file is encrypted at rest; without the key from Keychain/Keystore it cannot be read.
- Tests mock Keychain/Keystore and optionally crypto so no real secrets are used in CI.

## References

- US-206 Secure Storage (P0)
- ADR-004 Data Persistence (Realm choice, encryption support)
