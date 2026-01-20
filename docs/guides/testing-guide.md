# Testing Strategy Guide

This guide provides detailed implementation instructions for testing in FinTrack. For the decision rationale, see [ADR-005: Testing Strategy](../adr/ADR-005-testing-strategy.md).

## Table of Contents

- [Test Organization](#test-organization)
- [Mocking Strategy](#mocking-strategy)
- [Test Utils](#test-utils)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Service Testing](#service-testing)
- [Redux Testing](#redux-testing)
- [Utils Testing](#utils-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Test Organization

### File Structure

Every module follows this structure:

```
ModuleName/
  ├── __tests__/
  │   └── ModuleName.test.tsx (or .test.ts)
  ├── __mocks__/
  │   └── ModuleName.module-mocks.ts
  ├── ModuleName.tsx (or .ts)
  ├── ModuleName.types.ts (optional)
  ├── ModuleName.styles.ts (optional)
  └── index.ts
```

### Test Utils Structure

```
src/testUtils/
  ├── index.ts                    # Exports all test utils
  ├── mockCreateReactElement.ts    # Helper for creating mock React elements
  └── mockData/
      ├── index.ts
      ├── transactions.ts         # Mock transaction data
      ├── categories.ts           # Mock category data
      └── budgets.ts              # Mock budget data
```

### Global Mocks

```
__mocks__/
  ├── react-native.ts             # Mock React Native components
  ├── @react-navigation/
  │   └── native.ts               # Mock React Navigation
  └── realm.ts                    # Mock Realm database
```

## Mocking Strategy

### Principles

1. **Mock All Dependencies**: Mock everything except the unit under test
2. **Co-located Mocks**: Mocks live in `__mocks__/` next to the code
3. **Import Mocks in Tests**: Explicitly import mocks in test files
4. **No require/requireActual/requireMock**: Use Jest's automatic mocking and manual mocks
5. **Type Safety**: Mocks maintain TypeScript types

### Module Mocks

Module mocks are co-located with the code they mock:

```typescript
// src/components/Button/__mocks__/Button.module-mocks.ts
import { mockCreateReactElement } from 'testUtils';

jest.mock('react-native', () => ({
  TouchableOpacity: (props: any) =>
    mockCreateReactElement('TouchableOpacity', {
      ...props,
      testID: props.testID || 'touchable-opacity',
    }),
  Text: (props: any) =>
    mockCreateReactElement('Text', {
      ...props,
      testID: props.testID || 'text',
    }),
}));
```

## Test Utils

### mockCreateReactElement

Helper for creating mock React elements:

```typescript
// src/testUtils/mockCreateReactElement.ts
import { createElement, ElementType } from 'react';

export const mockCreateReactElement = (
  component: string,
  props: Record<string, any> = {},
) => {
  return createElement(component as ElementType, props);
};
```

### Mock Data

Create reusable mock data:

```typescript
// src/testUtils/mockData/transactions.ts
import { Transaction } from 'db/types';

export const mockTransaction: Transaction = {
  _id: new Realm.BSON.ObjectId(),
  amount: 100.0,
  type: 'expense',
  category: mockCategory,
  date: new Date('2024-01-15'),
  note: 'Test transaction',
  createdAt: new Date('2024-01-15'),
};

export const mockTransactions: Transaction[] = [
  mockTransaction,
  // ... more transactions
];
```

## Component Testing

### Example Component Test

```typescript
// src/components/Button/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

// Import mocks
import '../__mocks__/Button.module-mocks';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with title', () => {
    render(<Button title="Click me" onPress={mockOnPress} />);

    const button = screen.getByTestId('button');
    expect(button).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    render(<Button title="Click me" onPress={mockOnPress} />);

    const button = screen.getByTestId('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should render disabled state', () => {
    render(<Button title="Click me" onPress={mockOnPress} disabled />);

    const button = screen.getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });
});
```



## Hook Testing

### Example Hook Test

```typescript
// src/hooks/useTransactions/__tests__/useTransactions.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTransactions } from '../useTransactions';
import { transactionService } from 'services/transactionService';

// Mock the service
jest.mock('services/transactionService');

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions on mount', async () => {
    const mockTransactions = [
      { id: '1', amount: 100, type: 'expense' },
      { id: '2', amount: 200, type: 'income' },
    ];

    (transactionService.findAll as jest.Mock).mockResolvedValue(
      mockTransactions,
    );

    const { result, waitForNextUpdate } = renderHook(() => useTransactions());

    expect(result.current.loading).toBe(true);
    expect(result.current.transactions).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.transactions).toEqual(mockTransactions);
    expect(transactionService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch');
    (transactionService.findAll as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useTransactions());

    await waitForNextUpdate();

    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });
});
```

## Service Testing

### Example Service Test

```typescript
// src/services/transactionService/__tests__/transactionService.test.ts
import { transactionService } from '../transactionService';
import { getRealm } from 'db';
import { mockTransaction, mockTransactions } from 'testUtils/mockData';

// Mock Realm
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
      objectForPrimaryKey: jest.fn(),
      delete: jest.fn(),
    };

    (getRealm as jest.Mock).mockReturnValue(mockRealm);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction', () => {
      const data = {
        amount: 100,
        type: 'expense' as const,
        date: new Date(),
      };

      let createdTransaction: any;
      mockRealm.create.mockImplementation((schema, transactionData) => {
        createdTransaction = { ...transactionData, _id: '123' };
        return createdTransaction;
      });

      const result = transactionService.create(data);

      expect(mockRealm.write).toHaveBeenCalledTimes(1);
      expect(mockRealm.create).toHaveBeenCalledWith(
        'Transaction',
        expect.objectContaining(data),
      );
      expect(result).toEqual(createdTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions sorted by date', () => {
      const mockResults = {
        sorted: jest.fn().mockReturnValue(mockTransactions),
      };
      mockRealm.objects.mockReturnValue(mockResults);

      const result = transactionService.findAll();

      expect(mockRealm.objects).toHaveBeenCalledWith('Transaction');
      expect(mockResults.sorted).toHaveBeenCalledWith('date', true);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('findByDateRange', () => {
    it('should filter transactions by date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockResults = {
        filtered: jest.fn().mockReturnThis(),
        sorted: jest.fn().mockReturnValue(mockTransactions),
      };
      mockRealm.objects.mockReturnValue(mockResults);

      const result = transactionService.findByDateRange(startDate, endDate);

      expect(mockRealm.objects).toHaveBeenCalledWith('Transaction');
      expect(mockResults.filtered).toHaveBeenCalledWith(
        'date >= $0 AND date <= $1',
        startDate,
        endDate,
      );
      expect(result).toEqual(mockTransactions);
    });
  });
});
```

## Redux Testing

### Reducer Test

```typescript
// src/store/slices/transactions/__tests__/transactionsSlice.test.ts
import {
  transactionsSlice,
  addTransaction,
  removeTransaction,
} from '../transactionsSlice';
import { mockTransaction } from 'testUtils/mockData';

describe('transactionsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('should handle addTransaction', () => {
    const action = addTransaction(mockTransaction);
    const state = transactionsSlice.reducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockTransaction);
  });

  it('should handle removeTransaction', () => {
    const stateWithTransaction = {
      ...initialState,
      items: [mockTransaction],
    };

    const action = removeTransaction(mockTransaction._id.toString());
    const state = transactionsSlice.reducer(stateWithTransaction, action);

    expect(state.items).toHaveLength(0);
  });
});
```

### Action Test (Async Thunk)

```typescript
// src/store/slices/transactions/__tests__/transactionsThunks.test.ts
import { fetchTransactions } from '../transactionsSlice';
import { transactionService } from 'services/transactionService';
import { mockTransactions } from 'testUtils/mockData';

jest.mock('services/transactionService');

describe('fetchTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions successfully', async () => {
    (transactionService.findAll as jest.Mock).mockResolvedValue(
      mockTransactions,
    );

    const dispatch = jest.fn();
    const getState = jest.fn();

    await fetchTransactions()(dispatch, getState, undefined);

    expect(transactionService.findAll).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'transactions/fetchTransactions/fulfilled',
        payload: mockTransactions,
      }),
    );
  });
});
```

### Selector Test

```typescript
// src/store/slices/transactions/__tests__/transactionsSelectors.test.ts
import {
  selectAllTransactions,
  selectTransactionsByType,
} from '../transactions.selectors';
import { mockTransactions } from 'testUtils/mockData';

describe('transactionsSelectors', () => {
  const state = {
    transactions: {
      items: mockTransactions,
      loading: false,
      error: null,
    },
  };

  it('should return all transactions when selecting all', () => {
    const result = selectAllTransactions(state);
    expect(result).toEqual(mockTransactions);
  });

  it('should filter transactions by type', () => {
    const result = selectTransactionsByType(state, 'expense');
    expect(result).toEqual(mockTransactions.filter(t => t.type === 'expense'));
  });
});
```

## Utils Testing

### Example Utils Test

```typescript
// src/utils/formatCurrency/__tests__/formatCurrency.test.ts
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000.5)).toBe('$1,000.50');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle edge cases', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
    expect(formatCurrency(999999.99)).toBe('$999,999.99');
  });
});
```

## Integration Testing

### Example Integration Test

```typescript
// src/__tests__/integration/transactionFlow.test.tsx
import React from 'react';
import { renderWithProviders, screen, fireEvent } from 'testUtils';
import { TransactionForm } from 'components/TransactionForm';
import { TransactionList } from 'components/TransactionList';
import { transactionService } from 'services/transactionService';

jest.mock('services/transactionService');

describe('Transaction Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and display a transaction', async () => {
    const mockTransaction = {
      id: '1',
      amount: 100,
      type: 'expense',
      date: new Date(),
    };

    (transactionService.create as jest.Mock).mockResolvedValue(mockTransaction);
    (transactionService.findAll as jest.Mock).mockResolvedValue([
      mockTransaction,
    ]);

    const { store } = renderWithProviders(
      <>
        <TransactionForm />
        <TransactionList />
      </>,
    );

    // Fill form
    const amountInput = screen.getByTestId('amount-input');
    fireEvent.changeText(amountInput, '100');

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Wait for transaction to appear
    await screen.findByTestId('transaction-1');

    expect(transactionService.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100 }),
    );
  });
});
```

## E2E Testing

### Example E2E Test (Detox)

```typescript
// e2e/transactions.e2e.ts
import { by, element, expect as detoxExpect } from 'detox';

describe('Transactions E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a transaction', async () => {
    // Navigate to add transaction
    await element(by.id('add-transaction-button')).tap();

    // Fill form
    await element(by.id('amount-input')).typeText('100');
    await element(by.id('category-select')).tap();
    await element(by.id('category-groceries')).tap();

    // Submit
    await element(by.id('submit-button')).tap();

    // Verify transaction appears
    await detoxExpect(element(by.id('transaction-list'))).toBeVisible();
    await detoxExpect(element(by.id('transaction-1'))).toBeVisible();
  });
});
```

## Best Practices

### 1. Test Isolation

```typescript
// ✅ Good - Each test is independent
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test behavior 1', () => {
    // ...
  });

  it('should test behavior 2', () => {
    // ...
  });
});

// ❌ Bad - Tests depend on each other
describe('Component', () => {
  let sharedState;

  it('should set shared state', () => {
    sharedState = 'value';
  });

  it('should use shared state from previous test', () => {
    // Depends on test 1
    expect(sharedState).toBe('value');
  });
});
```

### 2. Mock Everything Except Unit Under Test

```typescript
// ✅ Good - Mock dependencies
jest.mock('services/transactionService');
jest.mock('hooks/useAuth');

// ❌ Bad - Use real dependencies
import { transactionService } from 'services/transactionService'; // Real service
```

### 3. Use Descriptive Test Names (Must Start with "should")

All test descriptions must start with "should" to clearly express the expected behavior:

```typescript
// ✅ Good
it('should display error message when transaction creation fails', () => {
  // ...
});

it('should render with title', () => {
  // ...
});

it('should call onPress when pressed', () => {
  // ...
});

// ❌ Bad
it('test 1', () => {
  // ...
});

it('renders with title', () => {
  // ...
});

it('calls onPress when pressed', () => {
  // ...
});
```

### 4. Arrange-Act-Assert Pattern

```typescript
// ✅ Good
it('should create transaction', () => {
  // Arrange
  const data = { amount: 100, type: 'expense' };
  mockService.create.mockResolvedValue(mockTransaction);

  // Act
  const result = service.create(data);

  // Assert
  expect(result).toEqual(mockTransaction);
  expect(mockService.create).toHaveBeenCalledWith(data);
});
```

### 5. Test Edge Cases

```typescript
// ✅ Good
describe('formatCurrency', () => {
  it('should handle positive numbers', () => {
    /* ... */
  });
  it('should handle negative numbers', () => {
    /* ... */
  });
  it('should handle zero', () => {
    /* ... */
  });
  it('should handle very large numbers', () => {
    /* ... */
  });
  it('should handle decimal precision', () => {
    /* ... */
  });
});
```

### 6. Clean Up After Tests

```typescript
// ✅ Good
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  // Clean up resources
});
```

## Exclusions

We do not test:

- `src/assets/` - Static assets (images, fonts, SVG)
- Global configuration files (e.g., `index.js`, `App.tsx` root)
- Third-party library internals
- Generated code

## References

- [ADR-005: Testing Strategy](../adr/ADR-005-testing-strategy.md) - Decision rationale
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) - Component testing
- [Jest Documentation](https://jestjs.io/docs/getting-started) - JavaScript testing framework
- [Detox Documentation](https://wix.github.io/Detox/) - E2E testing for React Native
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) - Testing philosophy
