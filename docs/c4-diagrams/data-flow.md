# FinTrack - Data Flow Diagrams

This document describes the data flow and interaction sequences for key user flows in the FinTrack application.

For system architecture overview, see [C4 Diagram](./c4-diagram.md).

---

## Adding a Transaction

Sequence diagram showing the flow when a user adds a new transaction.

```mermaid
sequenceDiagram
    participant User
    participant Screen as AddTransactionScreen
    participant Hook as useTransactions
    participant Service as transactionService
    participant DB as Realm Database

    User->>Screen: Enter amount, select category
    Screen->>Hook: addTransaction(data)
    Hook->>Service: createTransaction(data)
    Service->>DB: Write transaction
    DB-->>Service: Transaction saved
    Service-->>Hook: Success
    Hook-->>Screen: Update state
    Screen-->>User: Show success, navigate back
```

**Flow Description:**

1. User enters transaction details (amount, category, optional date/note) in the `AddTransactionScreen`
2. Screen calls `addTransaction()` from `useTransactions` hook
3. Hook calls `createTransaction()` in `transactionService`
4. Service writes the transaction to Realm database
5. Database confirms successful save
6. Success propagates back through service → hook → screen
7. Screen updates UI and navigates back to home

**Key Points:**

- Screen only uses hooks, never directly calls services
- Service handles all database operations
- Database operations are synchronous (Realm)

---

## Authentication Flow

Sequence diagram showing the authentication process with PIN or biometric authentication.

```mermaid
sequenceDiagram
    participant User
    participant Screen as AuthScreen
    participant Hook as useAuth
    participant Service as authService
    participant SecureStorage as Keychain/Keystore
    participant Biometric as Biometric API

    User->>Screen: Enter PIN or use biometric
    Screen->>Hook: authenticate(credentials)
    alt Biometric
        Hook->>Biometric: Request authentication
        Biometric-->>Hook: Success/Failure
    else PIN
        Hook->>Service: validatePIN(pin)
        Service->>SecureStorage: Read stored PIN
        SecureStorage-->>Service: PIN hash
        Service->>Service: Compare hashes
        Service-->>Hook: Valid/Invalid
    end
    Hook-->>Screen: Authentication result
    Screen->>User: Navigate to Home or show error
```

**Flow Description:**

1. User enters PIN or initiates biometric authentication on `AuthScreen`
2. Screen calls `authenticate()` from `useAuth` hook
3. Hook determines authentication method:
   - **Biometric**: Direct call to system Biometric API
   - **PIN**: Calls `validatePIN()` in `authService`
4. For PIN authentication:
   - Service reads stored PIN hash from secure storage (Keychain/Keystore)
   - Service compares input PIN hash with stored hash
5. Authentication result (success/failure) propagates back to screen
6. Screen navigates to Home on success or shows error on failure

**Key Points:**

- Biometric authentication bypasses service layer (direct system API)
- PIN is never stored in plaintext, only hashed
- Secure storage is platform-specific (Keychain for iOS, Keystore for Android)

---

## Viewing Transaction List

Sequence diagram showing how transactions are loaded and displayed.

```mermaid
sequenceDiagram
    participant User
    participant Screen as HomeScreen
    participant Hook as useTransactions
    participant Service as transactionService
    participant DB as Realm Database

    User->>Screen: Opens home screen
    Screen->>Hook: useEffect: loadTransactions()
    Hook->>Service: getTransactions(filters)
    Service->>DB: Query transactions
    DB-->>Service: Transaction list
    Service-->>Hook: Formatted transactions
    Hook->>Hook: Update state
    Hook-->>Screen: Transactions data
    Screen->>Screen: Render transaction list
    Screen-->>User: Display transactions
```

**Flow Description:**

1. User opens `HomeScreen`
2. Screen's `useEffect` triggers `loadTransactions()` from `useTransactions` hook
3. Hook calls `getTransactions()` in `transactionService` with optional filters
4. Service queries Realm database for transactions
5. Database returns transaction list
6. Service formats and returns transactions to hook
7. Hook updates internal state
8. Screen receives transactions via hook state
9. Screen renders transaction list components

**Key Points:**

- Transactions are loaded reactively via hook state
- Service handles querying and formatting
- Database queries can include filters (date range, category, type)

---

## Budget Progress Calculation

Sequence diagram showing how budget progress is calculated and updated.

```mermaid
sequenceDiagram
    participant User
    participant Screen as BudgetScreen
    participant Hook as useBudgets
    participant BudgetService as budgetService
    participant TransactionService as transactionService
    participant DB as Realm Database

    User->>Screen: Opens budget screen
    Screen->>Hook: useEffect: loadBudgets()
    Hook->>BudgetService: getBudgets()
    BudgetService->>DB: Query budgets
    DB-->>BudgetService: Budget list
    BudgetService->>TransactionService: getTransactionsForPeriod(category, period)
    TransactionService->>DB: Query transactions by category and period
    DB-->>TransactionService: Transaction list
    TransactionService-->>BudgetService: Total spent amount
    BudgetService->>BudgetService: Calculate progress (spent / limit)
    BudgetService-->>Hook: Budgets with progress
    Hook-->>Screen: Budget data
    Screen->>Screen: Render budget cards with progress bars
    Screen-->>User: Display budgets
```

**Flow Description:**

1. User opens `BudgetScreen`
2. Screen loads budgets via `useBudgets` hook
3. Hook calls `getBudgets()` in `budgetService`
4. Service queries budgets from database
5. For each budget, service calculates progress:
   - Calls `transactionService` to get transactions for the category and period
   - Calculates total spent amount
   - Calculates progress percentage (spent / limit)
6. Budgets with calculated progress are returned to hook
7. Screen renders budget cards with progress bars

**Key Points:**

- Budget progress is calculated on-demand, not stored
- Service layer coordinates between budget and transaction services
- Progress calculation aggregates transactions by category and time period

---

## Export Data Flow

Sequence diagram showing the data export process (CSV or JSON backup).

```mermaid
sequenceDiagram
    participant User
    participant Screen as SettingsScreen
    participant Hook as useExport
    participant Service as exportService
    participant TransactionService as transactionService
    participant CategoryService as categoryService
    participant BudgetService as budgetService
    participant DB as Realm Database
    participant FileSystem as File System

    User->>Screen: Tap "Export to CSV" or "Create Backup"
    Screen->>Hook: exportData(format)
    Hook->>Service: exportToCSV() or exportToJSON()
    Service->>TransactionService: getAllTransactions()
    TransactionService->>DB: Query all transactions
    DB-->>TransactionService: All transactions
    TransactionService-->>Service: Transaction data
    Service->>CategoryService: getAllCategories()
    CategoryService->>DB: Query all categories
    DB-->>CategoryService: All categories
    CategoryService-->>Service: Category data
    Service->>BudgetService: getAllBudgets()
    BudgetService->>DB: Query all budgets
    DB-->>BudgetService: All budgets
    BudgetService-->>Service: Budget data
    Service->>Service: Format data (CSV or JSON)
    Service->>FileSystem: Write file
    FileSystem-->>Service: File path
    Service-->>Hook: File path
    Hook-->>Screen: File ready
    Screen->>Screen: Open share sheet
    Screen-->>User: Share file
```

**Flow Description:**

1. User initiates export from `SettingsScreen`
2. Screen calls `exportData()` from `useExport` hook with format (CSV or JSON)
3. Hook calls appropriate export method in `exportService`
4. Service collects data from multiple sources:
   - All transactions from `transactionService`
   - All categories from `categoryService`
   - All budgets from `budgetService`
5. Each service queries its data from database
6. Service formats collected data (CSV or JSON)
7. Service writes formatted file to file system
8. File path is returned to hook
9. Screen opens system share sheet with the file
10. User can save or share the file

**Key Points:**

- Export aggregates data from multiple services
- File is written to app's document directory
- System share sheet handles file sharing/saving

---

## References

- [C4 Model](https://c4model.com/)
- [C4 Diagram](./c4-diagram.md) - System architecture overview
- [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md)
- [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md)
