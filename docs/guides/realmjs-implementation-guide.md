# RealmJS Implementation Guide

This guide provides detailed implementation instructions for using RealmJS in FinTrack. For the decision rationale, see [ADR-004: Data Persistence](../adr/ADR-004-data-persistence.md).

## Table of Contents

- [Database Structure](#database-structure)
- [Schema Definitions](#schema-definitions)
- [Realm Instance Configuration](#realm-instance-configuration)
- [Key Patterns](#key-patterns)
- [Integration with Services](#integration-with-services)
- [Integration with Redux](#integration-with-redux)
- [Migrations](#migrations)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Database Structure

```
src/db/
  ├── index.ts                 # Database exports
  ├── realm.ts                 # Realm instance and configuration
  ├── schemas/
  │   ├── Transaction.ts       # Transaction schema
  │   ├── Category.ts          # Category schema
  │   ├── Budget.ts            # Budget schema
  │   ├── UserSettings.ts      # User settings schema
  │   └── index.ts             # Schema exports
  ├── migrations/
  │   └── index.ts             # Migration definitions
  ├── types/
  │   └── index.ts             # TypeScript types for Realm objects
  └── __tests__/              # Database tests
```

## Schema Definitions

### Transaction Schema

```typescript
import Realm from 'realm';
import { Category } from './Category';

export class Transaction extends Realm.Object<Transaction> {
  _id!: Realm.BSON.ObjectId;
  amount!: number;
  type!: 'income' | 'expense';
  category!: Category;
  date!: Date;
  note?: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Transaction',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      amount: 'double',
      type: 'string',
      category: 'Category',
      date: 'date',
      note: 'string?',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
```

### Category Schema

```typescript
import Realm from 'realm';
import { Transaction } from './Transaction';

export class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  icon!: string;
  color!: string;
  type!: 'income' | 'expense' | 'both';
  isDefault!: boolean;
  sortOrder!: number;
  transactions!: Realm.List<Transaction>;

  static schema: Realm.ObjectSchema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      icon: 'string',
      color: 'string',
      type: 'string',
      isDefault: 'bool',
      sortOrder: 'int',
      transactions: 'Transaction[]',
    },
  };
}
```

### Budget Schema

```typescript
import Realm from 'realm';
import { Category } from './Category';

export class Budget extends Realm.Object<Budget> {
  _id!: Realm.BSON.ObjectId;
  category!: Category;
  amount!: number;
  period!: 'monthly';
  notifications!: boolean;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Budget',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      category: 'Category',
      amount: 'double',
      period: 'string',
      notifications: 'bool',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
```

### UserSettings Schema

```typescript
import Realm from 'realm';

export class UserSettings extends Realm.Object<UserSettings> {
  _id!: Realm.BSON.ObjectId;
  currency!: string;
  dateFormat!: string;
  theme!: 'light' | 'dark' | 'system';
  biometricEnabled!: boolean;
  autoLockEnabled!: boolean;
  autoLockTimeout!: number;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'UserSettings',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      currency: { type: 'string', default: 'USD' },
      dateFormat: { type: 'string', default: 'MM/DD/YYYY' },
      theme: { type: 'string', default: 'system' },
      biometricEnabled: { type: 'bool', default: false },
      autoLockEnabled: { type: 'bool', default: true },
      autoLockTimeout: { type: 'int', default: 300 }, // seconds
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };
}
```

## Realm Instance Configuration

### Basic Configuration

```typescript
// src/db/realm.ts
import Realm from 'realm';
import { Transaction } from './schemas/Transaction';
import { Category } from './schemas/Category';
import { Budget } from './schemas/Budget';
import { UserSettings } from './schemas/UserSettings';

const realmConfig: Realm.Configuration = {
  schema: [Transaction, Category, Budget, UserSettings],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
    // Migration logic (see Migrations section)
  },
};

// For production, enable encryption for sensitive data
const getEncryptionKey = (): ArrayBuffer => {
  // Generate or retrieve encryption key from secure storage
  // This is a placeholder - implement secure key management
  return new ArrayBuffer(64);
};

const encryptedConfig: Realm.Configuration = {
  ...realmConfig,
  encryptionKey: getEncryptionKey(),
};

let realmInstance: Realm | null = null;

export const getRealm = (): Realm => {
  if (!realmInstance) {
    realmInstance = new Realm(encryptedConfig);
  }
  return realmInstance;
};

export const closeRealm = (): void => {
  if (realmInstance) {
    realmInstance.close();
    realmInstance = null;
  }
};
```

### Indexes for Performance

Add indexes to frequently queried fields:

```typescript
const realmConfig: Realm.Configuration = {
  schema: [
    {
      ...Transaction.schema,
      properties: {
        ...Transaction.schema.properties,
        // Add indexes
        date: { type: 'date', indexed: true },
        type: { type: 'string', indexed: true },
      },
    },
    {
      ...Category.schema,
      properties: {
        ...Category.schema.properties,
        // Add indexes
        type: { type: 'string', indexed: true },
        isDefault: { type: 'bool', indexed: true },
      },
    },
  ],
  // ... rest of config
};
```

## Key Patterns

### 1. Schema-First Approach

- Define all schemas in `schemas/` directory with TypeScript types
- Use Realm.Object as base class for all models
- Define static schema property for Realm configuration
- Export schemas from `schemas/index.ts`

### 2. Single Realm Instance

- Use singleton pattern for Realm instance
- Configure Realm once at app startup
- Close Realm instance on app shutdown

### 3. Encryption

Enable encryption for sensitive data:

```typescript
import * as Keychain from 'react-native-keychain';

const getEncryptionKey = async (): Promise<ArrayBuffer> => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials && credentials.password) {
    // Use existing key
    return stringToArrayBuffer(credentials.password);
  }
  // Generate new key
  const key = generateEncryptionKey();
  await Keychain.setGenericPassword('realm-key', key);
  return stringToArrayBuffer(key);
};
```

### 4. Services Layer Pattern

All database access goes through services:

```typescript
// src/services/transactionService.ts
import { getRealm } from 'db';
import { Transaction } from 'db/schemas';

export const transactionService = {
  create: (data: CreateTransactionData): Transaction => {
    const realm = getRealm();
    let transaction: Transaction;
    realm.write(() => {
      transaction = realm.create<Transaction>('Transaction', {
        ...data,
        _id: new Realm.BSON.ObjectId(),
        createdAt: new Date(),
      });
    });
    return transaction!;
  },

  findAll: (): Realm.Results<Transaction> => {
    const realm = getRealm();
    return realm.objects<Transaction>('Transaction').sorted('date', true);
  },

  findByDateRange: (startDate: Date, endDate: Date): Realm.Results<Transaction> => {
    const realm = getRealm();
    return realm
      .objects<Transaction>('Transaction')
      .filtered('date >= $0 AND date <= $1', startDate, endDate)
      .sorted('date', true);
  },

  findByCategory: (categoryId: string): Realm.Results<Transaction> => {
    const realm = getRealm();
    return realm
      .objects<Transaction>('Transaction')
      .filtered('category._id == $0', new Realm.BSON.ObjectId(categoryId))
      .sorted('date', true);
  },

  update: (id: string, data: Partial<Transaction>): void => {
    const realm = getRealm();
    const transaction = realm.objectForPrimaryKey<Transaction>('Transaction', id);
    if (transaction) {
      realm.write(() => {
        Object.assign(transaction, data);
      });
    }
  },

  delete: (id: string): void => {
    const realm = getRealm();
    const transaction = realm.objectForPrimaryKey<Transaction>('Transaction', id);
    if (transaction) {
      realm.write(() => {
        realm.delete(transaction);
      });
    }
  },
};
```

### 5. Type Safety

Use TypeScript types for all Realm objects:

```typescript
// src/db/types/index.ts
import { Transaction } from '../schemas/Transaction';
import { Category } from '../schemas/Category';
import { Budget } from '../schemas/Budget';
import { UserSettings } from '../schemas/UserSettings';

export type { Transaction, Category, Budget, UserSettings };

// Helper types for creating/updating
export type CreateTransactionData = Omit<Transaction, '_id' | 'createdAt'>;
export type UpdateTransactionData = Partial<Omit<Transaction, '_id' | 'createdAt'>>;
```

### 6. Transactions (Atomic Operations)

Use Realm transactions for atomic operations:

```typescript
const realm = getRealm();
realm.write(() => {
  // Multiple operations that must succeed or fail together
  const transaction = realm.create('Transaction', transactionData);
  const category = realm.objectForPrimaryKey('Category', categoryId);
  if (category) {
    category.transactions.push(transaction);
  }
});
```

### 7. Reactive Queries

Use Realm's reactive queries for automatic UI updates:

```typescript
// In a hook or component
import { useEffect, useState } from 'react';
import { getRealm } from 'db';
import { Transaction } from 'db/schemas';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const realm = getRealm();

  useEffect(() => {
    const results = realm.objects<Transaction>('Transaction').sorted('date', true);

    // Subscribe to changes
    const subscription = results.addListener(updatedResults => {
      setTransactions(Array.from(updatedResults));
    });

    // Initial load
    setTransactions(Array.from(results));

    return () => {
      subscription.remove();
    };
  }, [realm]);

  return transactions;
};
```

## Integration with Services

Services in `src/services/` handle all database operations:

- **Abstraction**: Components and hooks never access Realm directly
- **Type Safety**: Services provide typed interfaces
- **Error Handling**: Services handle error cases and data validation
- **Business Logic**: Services contain business logic related to data operations

Example service structure:

```typescript
// src/services/transactionService.ts
import { getRealm } from 'db';
import { Transaction, CreateTransactionData } from 'db/types';

export const transactionService = {
  // CRUD operations
  create: (data: CreateTransactionData): Transaction => {
    /* ... */
  },
  findAll: (): Realm.Results<Transaction> => {
    /* ... */
  },
  findById: (id: string): Transaction | null => {
    /* ... */
  },
  update: (id: string, data: Partial<Transaction>): void => {
    /* ... */
  },
  delete: (id: string): void => {
    /* ... */
  },

  // Business logic operations
  getTotalByCategory: (categoryId: string, startDate: Date, endDate: Date): number => {
    /* ... */
  },
  getTotalByType: (type: 'income' | 'expense', startDate: Date, endDate: Date): number => {
    /* ... */
  },
};
```

## Integration with Redux

Realm database and Redux store work together:

- **Realm**: Source of truth for persistent data
- **Redux**: In-memory state for UI and derived data
- **Services**: Sync between Realm and Redux

### Initial Hydration

```typescript
// On app startup
import { store } from 'store';
import { transactionService } from 'services/transactionService';
import { setTransactions } from 'store/slices/transactions/transactionsSlice';

const hydrateStore = () => {
  const transactions = transactionService.findAll();
  store.dispatch(setTransactions(Array.from(transactions)));
};
```

### Syncing Updates

```typescript
// In transactionService.create
export const transactionService = {
  create: (data: CreateTransactionData): Transaction => {
    const realm = getRealm();
    let transaction: Transaction;
    realm.write(() => {
      transaction = realm.create<Transaction>('Transaction', data);
    });

    // Sync with Redux
    store.dispatch(addTransaction(transaction));

    return transaction!;
  },
};
```

## Migrations

Realm provides a built-in migration system for schema changes:

```typescript
// src/db/migrations/index.ts
import Realm from 'realm';

export const migrations = {
  1: (oldRealm: Realm, newRealm: Realm) => {
    // Initial schema - no migration needed
  },

  2: (oldRealm: Realm, newRealm: Realm) => {
    // Example: Add new field to Transaction
    const oldTransactions = oldRealm.objects('Transaction');
    const newTransactions = newRealm.objects('Transaction');

    for (let i = 0; i < oldTransactions.length; i++) {
      newTransactions[i].newField = 'defaultValue';
    }
  },

  3: (oldRealm: Realm, newRealm: Realm) => {
    // Example: Rename field
    const oldTransactions = oldRealm.objects('Transaction');
    const newTransactions = newRealm.objects('Transaction');

    for (let i = 0; i < oldTransactions.length; i++) {
      newTransactions[i].newFieldName = oldTransactions[i].oldFieldName;
    }
  },
};

// In realm.ts
const realmConfig: Realm.Configuration = {
  schema: [Transaction, Category, Budget, UserSettings],
  schemaVersion: 3, // Increment on schema changes
  migration: (oldRealm, newRealm) => {
    const oldVersion = oldRealm.schemaVersion;
    const newVersion = newRealm.schemaVersion;

    for (let version = oldVersion + 1; version <= newVersion; version++) {
      if (migrations[version]) {
        migrations[version](oldRealm, newRealm);
      }
    }
  },
};
```

## Best Practices

### 1. Always Use Transactions for Writes

```typescript
// ✅ Good
realm.write(() => {
  realm.create('Transaction', data);
});

// ❌ Bad
realm.create('Transaction', data); // Will throw error
```

### 2. Close Realm Listeners

```typescript
useEffect(() => {
  const results = realm.objects('Transaction');
  const subscription = results.addListener(() => {
    /* ... */
  });

  return () => {
    subscription.remove(); // Always clean up
  };
}, []);
```

### 3. Use Filtered Queries for Performance

```typescript
// ✅ Good - uses index
realm.objects('Transaction').filtered('date >= $0', startDate);

// ❌ Bad - scans all objects
realm.objects('Transaction').filter(t => t.date >= startDate);
```

### 4. Batch Writes

```typescript
// ✅ Good - single transaction
realm.write(() => {
  transactions.forEach(data => {
    realm.create('Transaction', data);
  });
});

// ❌ Bad - multiple transactions
transactions.forEach(data => {
  realm.write(() => {
    realm.create('Transaction', data);
  });
});
```

### 5. Handle Errors

```typescript
try {
  realm.write(() => {
    realm.create('Transaction', data);
  });
} catch (error) {
  if (error instanceof Realm.Exception) {
    // Handle Realm-specific errors
    console.error('Realm error:', error.message);
  } else {
    // Handle other errors
    throw error;
  }
}
```

### 6. Use ObjectId for Primary Keys

```typescript
// ✅ Good
_id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() }

// ❌ Bad
id: { type: 'string', indexed: true }
```

## Testing

### Mock Realm for Tests

```typescript
// src/db/__tests__/realm.test.ts
import Realm from 'realm';
import { Transaction } from '../schemas/Transaction';

describe('Realm Database', () => {
  let realm: Realm;

  beforeEach(() => {
    realm = new Realm({
      schema: [Transaction],
      inMemory: true, // Use in-memory database for tests
    });
  });

  afterEach(() => {
    realm.close();
  });

  it('should create a transaction', () => {
    let transaction: Transaction;
    realm.write(() => {
      transaction = realm.create('Transaction', {
        amount: 100,
        type: 'expense',
        date: new Date(),
      });
    });

    expect(transaction).toBeDefined();
    expect(transaction!.amount).toBe(100);
  });
});
```

### Test Services

```typescript
// src/services/__tests__/transactionService.test.ts
import { transactionService } from '../transactionService';
import { getRealm } from 'db';

jest.mock('db', () => ({
  getRealm: jest.fn(),
}));

describe('transactionService', () => {
  let mockRealm: any;

  beforeEach(() => {
    mockRealm = {
      objects: jest.fn(),
      create: jest.fn(),
      write: jest.fn(callback => callback()),
    };
    (getRealm as jest.Mock).mockReturnValue(mockRealm);
  });

  it('should create a transaction', () => {
    const data = { amount: 100, type: 'expense', date: new Date() };
    transactionService.create(data);

    expect(mockRealm.write).toHaveBeenCalled();
    expect(mockRealm.create).toHaveBeenCalledWith('Transaction', expect.objectContaining(data));
  });
});
```

## References

- [ADR-004: Data Persistence](../adr/ADR-004-data-persistence.md) - Decision rationale
- [RealmJS Documentation](https://www.mongodb.com/docs/realm/sdk/react-native/) - Official documentation
- [RealmJS TypeScript Guide](https://www.mongodb.com/docs/realm/sdk/react-native/examples/define-a-realm-object-model/) - TypeScript integration
- [RealmJS Performance Guide](https://www.mongodb.com/docs/realm/sdk/react-native/performance/) - Performance optimization
- [RealmJS Migrations](https://www.mongodb.com/docs/realm/sdk/react-native/examples/modify-an-object-schema/) - Schema migrations
