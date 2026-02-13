import type { Configuration } from 'realm';

import { getOrCreateRealmEncryptionKey } from 'services/secureStorageService';

/** Default Realm file name. All app data (transactions, etc.) will be in this encrypted Realm. */
export const REALM_FILE_NAME = 'fintrack.realm';

/**
 * Build Realm configuration with encryption.
 * Key is stored in Keychain/Keystore; generated on first run, reused afterwards.
 * Never log or persist the key in plaintext.
 */
export async function getRealmConfig(): Promise<Configuration> {
  const encryptionKey = await getOrCreateRealmEncryptionKey();
  return {
    path: REALM_FILE_NAME,
    schema: [],
    schemaVersion: 1,
    encryptionKey,
  };
}
