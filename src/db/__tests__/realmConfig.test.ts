import { getOrCreateRealmEncryptionKey } from 'services/secureStorageService';

import { getRealmConfig, REALM_FILE_NAME } from '../realmConfig';

jest.mock('services/secureStorageService', () => ({
  getOrCreateRealmEncryptionKey: jest.fn(),
}));

describe('realmConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRealmConfig', () => {
    it('should return config with path, schema, schemaVersion and encryptionKey', async () => {
      const key = new ArrayBuffer(64);
      (getOrCreateRealmEncryptionKey as jest.Mock).mockResolvedValue(key);

      const config = await getRealmConfig();

      expect(getOrCreateRealmEncryptionKey).toHaveBeenCalled();
      expect(config.path).toBe(REALM_FILE_NAME);
      expect(config.schema).toEqual([]);
      expect(config.schemaVersion).toBe(1);
      expect(config.encryptionKey).toBe(key);
    });
  });

  describe('REALM_FILE_NAME', () => {
    it('should be fintrack.realm', () => {
      expect(REALM_FILE_NAME).toBe('fintrack.realm');
    });
  });
});
