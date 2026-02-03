# State Management Implementation Guide

This guide provides detailed implementation instructions for state management in FinTrack. For the decision rationale, see [ADR-003: State Management](../adr/ADR-003-state-management.md).

## State Management Architecture

```
┌─────────────────────────────────────────┐
│         State Management Stack          │
├─────────────────────────────────────────┤
│ Business Data (Transactions, etc.)      │
│ → Realm useQuery/useObject hooks        │
│   Location: hooks/useTransactions.ts    │
│   Example: const transactions = useQuery(Transaction) │
├─────────────────────────────────────────┤
│ Global UI State (Filters, Settings)      │
│ → React Context                         │
│   Location: contexts/FiltersContext/     │
│   Example: const { filters } = useContext(FiltersContext) │
├─────────────────────────────────────────┤
│ Local UI State (Modals, Forms)          │
│ → useState / useReducer                 │
│   Location: Component level             │
│   Example: const [isOpen, setIsOpen] = useState(false) │
├─────────────────────────────────────────┤
│ Derived State (Analytics)               │
│ → useMemo + Realm queries               │
│   Location: hooks/useAnalytics.ts       │
│   Example: const total = useMemo(() => sum(transactions), [transactions]) │
└─────────────────────────────────────────┘
```

## Directory Structure

```
src/
  ├── contexts/              # React Context providers
  │   ├── FiltersContext/    # Global filter state
  │   │   ├── FiltersContext.tsx
  │   │   └── index.ts
  │   ├── SettingsContext/   # App settings
  │   │   ├── SettingsContext.tsx
  │   │   └── index.ts
  │   └── ThemeContext/     # Theme (already exists)
  │
  ├── hooks/                 # Custom hooks (wrappers around Realm)
  │   ├── useTransactions.ts
  │   ├── useCategories.ts
  │   ├── useBudgets.ts
  │   └── useAnalytics.ts
  │
  └── db/                    # Realm database (source of truth)
      ├── schemas/
      └── realm.ts
```

## Implementation Patterns

### 1. Business Data: Realm Hooks

Always use Realm hooks directly for business data. Realm is the source of truth.

```typescript
// hooks/useTransactions.ts
import { useQuery } from '@realm/react';
import { Transaction } from 'db/schemas/Transaction';

export const useTransactions = () => {
  const transactions = useQuery(Transaction);
  return transactions;
};

// With filtering
export const useTransactionsByType = (type: 'income' | 'expense') => {
  const transactions = useQuery(
    Transaction,
    (collection) => collection.filtered('type == $0', type),
    [type]
  );
  return transactions;
};
```

**Key Points:**
- Realm hooks automatically update components when data changes
- No need to manually sync or refresh
- Use filtered queries for performance
- Never duplicate Realm data in Context or local state

### 2. Global UI State: React Context

Use Context for state shared across unrelated screens.

```typescript
// contexts/FiltersContext/FiltersContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface Filters {
  dateRange?: { start: Date; end: Date };
  categoryIds?: string[];
  transactionType?: 'all' | 'income' | 'expense';
  searchQuery?: string;
}

interface FiltersContextValue {
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({});

  const clearFilters = () => setFilters({});

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ filters, setFilters, clearFilters }),
    [filters]
  );

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (): FiltersContextValue => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within FiltersProvider');
  }
  return context;
};
```

**Key Points:**
- Split contexts by concern (Filters, Settings, Theme)
- Memoize context values to prevent re-renders
- Only use Context for state that needs to be shared across unrelated screens
- Never use Context for business data (use Realm hooks)

### 3. Local UI State: useState / useReducer

Use local state for component-specific UI state.

```typescript
// Component level
const [isModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({});
const [selectedItem, setSelectedItem] = useState<string | null>(null);

// For complex local state
const [state, dispatch] = useReducer(formReducer, initialState);
```

**Key Points:**
- Use `useState` for simple state
- Use `useReducer` for complex state with multiple actions
- Keep state as local as possible
- Don't lift state up unless it's needed by multiple components

### 4. Derived State: useMemo

Use `useMemo` for computed values based on props or state.

```typescript
// hooks/useAnalytics.ts
import { useQuery } from '@realm/react';
import { useMemo } from 'react';
import { Transaction } from 'db/schemas/Transaction';

export const useAnalytics = () => {
  const transactions = useQuery(Transaction);

  const totalExpenses = useMemo(() => {
    return transactions
      .filtered('type == "expense"')
      .sum('amount') as number;
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filtered('type == "income"')
      .sum('amount') as number;
  }, [transactions]);

  const balance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  return { totalExpenses, totalIncome, balance };
};
```

**Key Points:**
- Compute values on render, don't store as state
- Use `useMemo` for expensive calculations
- Dependencies should include all values used in computation
- Can also compute in Realm queries for better performance

### 5. Multi-step Forms

For multi-step forms, use React Navigation params or Context.

**Option A: Navigation Params (Simple Forms)**

```typescript
// Step 1: AmountInputScreen
const handleNext = () => {
  navigation.navigate('CategorySelection', { 
    amount, 
    type: 'expense' 
  });
};

// Step 2: CategorySelectionScreen
const { amount, type } = route.params;
const handleNext = () => {
  navigation.navigate('TransactionDetails', { 
    amount, 
    type, 
    categoryId 
  });
};
```

**Option B: Context (Complex Forms)**

```typescript
// contexts/TransactionFormContext/TransactionFormContext.tsx
export const TransactionFormContext = createContext<TransactionFormContextValue | null>(null);

export const TransactionFormProvider = ({ children }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: null,
    type: 'expense',
    categoryId: null,
    date: new Date(),
    note: '',
  });

  const updateFormData = (updates: Partial<TransactionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      amount: null,
      type: 'expense',
      categoryId: null,
      date: new Date(),
      note: '',
    });
  };

  return (
    <TransactionFormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </TransactionFormContext.Provider>
  );
};
```

## Integration with Database

- **Realm is the source of truth** for all business data
- **No synchronization needed** - use Realm hooks directly
- **Services layer** handles all database operations (CRUD)
- **Hooks** provide reactive access to Realm data
- **Context** only for UI state, never for business data

## Best Practices

### When to Use Each Approach

| Use Case | Solution | Example |
|----------|----------|---------|
| Transactions list | Realm `useQuery` | `const transactions = useQuery(Transaction)` |
| Single transaction | Realm `useObject` | `const transaction = useObject(Transaction, id)` |
| Global filters | Context | `const { filters } = useFilters()` |
| App settings | Context | `const { settings } = useSettings()` |
| Modal visibility | Local state | `const [isOpen, setIsOpen] = useState(false)` |
| Form inputs | Local state | `const [value, setValue] = useState('')` |
| Analytics totals | `useMemo` | `const total = useMemo(() => sum(data), [data])` |
| Filtered transactions | Realm query | `useQuery(Transaction, (c) => c.filtered('type == $0', type))` |

### Performance Optimization

1. **Split Contexts**: Don't put all global state in one context
   ```typescript
   // ❌ Bad: One large context
   <AppContext.Provider value={{ filters, settings, theme, ... }}>
   
   // ✅ Good: Split by concern
   <FiltersProvider>
     <SettingsProvider>
       <ThemeProvider>
   ```

2. **Memoize Context Values**: Prevent unnecessary re-renders
   ```typescript
   const value = useMemo(
     () => ({ filters, setFilters }),
     [filters]
   );
   ```

3. **Use Filtered Queries**: Filter at database level, not in JavaScript
   ```typescript
   // ❌ Bad: Filter in JavaScript
   const all = useQuery(Transaction);
   const filtered = all.filter(t => t.type === 'expense');
   
   // ✅ Good: Filter in Realm query
   const filtered = useQuery(
     Transaction,
     (collection) => collection.filtered('type == "expense"')
   );
   ```

4. **Memoize Expensive Computations**: Use `useMemo` for derived values
   ```typescript
   const total = useMemo(() => {
     return transactions.reduce((sum, t) => sum + t.amount, 0);
   }, [transactions]);
   ```

## Common Patterns

### Pattern 1: Realm Hook Wrapper

```typescript
// hooks/useTransactions.ts
export const useTransactions = () => {
  return useQuery(Transaction);
};

// Usage in component
const transactions = useTransactions();
```

### Pattern 2: Context with Persistence

```typescript
// contexts/SettingsContext/SettingsContext.tsx
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from AsyncStorage on init
    return loadSettings();
  });

  useEffect(() => {
    // Persist to AsyncStorage on change
    saveSettings(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

### Pattern 3: Combined Hook

```typescript
// hooks/useFilteredTransactions.ts
export const useFilteredTransactions = () => {
  const { filters } = useFilters();
  const allTransactions = useQuery(Transaction);

  const filtered = useMemo(() => {
    let result = allTransactions;
    
    if (filters.transactionType && filters.transactionType !== 'all') {
      result = result.filtered('type == $0', filters.transactionType);
    }
    
    if (filters.categoryIds?.length) {
      result = result.filtered('category._id IN $0', filters.categoryIds);
    }
    
    return result;
  }, [allTransactions, filters]);

  return filtered;
};
```

## Testing

See [Testing Guide](./testing-guide.md) for detailed testing patterns for Context and hooks.

## References

- [ADR-003: State Management](../adr/ADR-003-state-management.md) - Decision rationale
- [Realm React Hooks Documentation](https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/) - Realm React hooks
- [React Context API](https://react.dev/reference/react/useContext) - React Context documentation
- [React useMemo Hook](https://react.dev/reference/react/useMemo) - useMemo documentation
