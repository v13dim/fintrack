/**
 * Keychain service names. Each secret uses a distinct service so we can store
 * PIN hash and Realm encryption key separately.
 *
 * These are identifiers only (like a key name), not the actual secrets. The real
 * data is stored and protected by Keychain/Keystore. Keeping these constants in
 * code is safe; never log or expose the actual stored values (PIN hash, Realm key).
 */
export const KEYCHAIN_SERVICE_PIN_HASH = '@fintrack/secure_pin_hash';
export const KEYCHAIN_SERVICE_PIN_FAILED_ATTEMPTS = '@fintrack/pin_failed_attempts';
export const KEYCHAIN_SERVICE_PIN_LOCKOUT_UNTIL = '@fintrack/pin_lockout_until';
export const KEYCHAIN_SERVICE_REALM_KEY = '@fintrack/secure_realm_key';
export const KEYCHAIN_SERVICE_BIOMETRIC_ENABLED = '@fintrack/biometric_enabled';
export const KEYCHAIN_SERVICE_BIOMETRIC_TOKEN = '@fintrack/biometric_token';

/** Realm encryption key length in bytes (512 bits). Public API requirement, not sensitive. */
export const REALM_ENCRYPTION_KEY_LENGTH = 64;
