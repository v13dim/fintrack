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
    alt Success
        DB-->>Service: Transaction saved
        Service-->>Hook: Success
        Hook-->>Screen: Update state
        Screen-->>User: Show success, navigate back
    else Database Error
        DB-->>Service: Error (e.g., validation failed, disk full)
        Service-->>Hook: Error with message
        Hook-->>Screen: Error state
        Screen-->>User: Show error message, keep form
    end
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
- Errors are caught and displayed to user without losing form data

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
        alt Biometric Success
            Biometric-->>Hook: Success
            Hook-->>Screen: Authentication success
            Screen-->>User: Navigate to Home
        else Biometric Failed/Cancelled
            Biometric-->>Hook: Failure/Cancelled
            Hook-->>Screen: Authentication failed
            Screen-->>User: Show error, allow PIN entry
        end
    else PIN
        Hook->>Service: validatePIN(pin)
        Service->>SecureStorage: Read stored PIN
        alt SecureStorage Available
            SecureStorage-->>Service: PIN hash
            Service->>Service: Compare hashes
            alt PIN Valid
                Service-->>Hook: Valid
                Hook-->>Screen: Authentication success
                Screen-->>User: Navigate to Home
            else PIN Invalid
                Service-->>Hook: Invalid
                Hook->>Hook: Increment failure count
                alt Failure Count < 3
                    Hook-->>Screen: Invalid PIN
                    Screen-->>User: Show error, allow retry
                else Failure Count >= 3
                    Hook-->>Screen: Too many failures
                    Screen-->>User: Show cooldown timer (30s)
                end
            end
        else SecureStorage Error
            SecureStorage-->>Service: Error (e.g., not accessible)
            Service-->>Hook: Storage error
            Hook-->>Screen: Critical error
            Screen-->>User: Show critical error message
        end
    end
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
- Failed authentication attempts are tracked (max 3 before cooldown)
- Cooldown period (30 seconds) prevents brute force attacks
- Biometric cancellation allows fallback to PIN entry

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
- Errors during export are caught and displayed to user

---

## Error Handling Patterns

This section describes common error handling patterns used throughout the application.

### Error Propagation Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen
    participant Hook
    participant Service
    participant External as External System

    User->>Screen: User action
    Screen->>Hook: Call hook method
    Hook->>Service: Call service method
    Service->>External: External operation
    alt Success
        External-->>Service: Success
        Service-->>Hook: Success result
        Hook-->>Screen: Update state (success)
        Screen-->>User: Show success feedback
    else Error
        External-->>Service: Error
        Service->>Service: Wrap error with context
        Service-->>Hook: Error object
        Hook->>Hook: Handle error (log, transform)
        Hook-->>Screen: Error state
        Screen->>Screen: Display user-friendly message
        Screen-->>User: Show error message
    end
```

**Error Handling Principles:**

1. **Service Layer**: Catches and wraps errors with context
2. **Hook Layer**: Transforms errors into user-friendly messages
3. **Screen Layer**: Displays errors without losing user context
4. **User Experience**: Errors are recoverable - user can retry or cancel

### Common Error Types

| Error Type | Source | User Action | Recovery |
|------------|--------|-------------|----------|
| **Validation Error** | Form validation | Show field-specific error | Fix input and retry |
| **Database Error** | Realm operations | Show generic error message | Retry operation |
| **Network Error** | N/A (offline-first) | N/A | N/A |
| **Authentication Error** | PIN/Biometric | Show error, allow retry | Re-enter credentials |
| **Storage Error** | File system | Show error message | Check storage space |
| **Critical Error** | System failure | Show critical error | Contact support or restart app |

---

## Authentication Error Flow

Detailed flow for handling authentication failures and edge cases.

```mermaid
sequenceDiagram
    participant User
    participant Screen as AuthScreen
    participant Hook as useAuth
    participant Service as authService
    participant SecureStorage as Keychain/Keystore
    participant Biometric as Biometric API

    User->>Screen: Attempt authentication
    Screen->>Hook: authenticate(credentials)
    
    alt Biometric Authentication
        Hook->>Biometric: Request authentication
        alt Success
            Biometric-->>Hook: Success
            Hook-->>Screen: Success
            Screen-->>User: Navigate to Home
        else User Cancelled
            Biometric-->>Hook: UserCancelled
            Hook-->>Screen: Cancelled
            Screen-->>User: Show PIN entry option
        else Biometric Failed
            Biometric-->>Hook: AuthenticationFailed
            Hook-->>Screen: Failed
            Screen-->>User: Show error, allow PIN entry
        else Biometric Not Available
            Biometric-->>Hook: NotAvailable
            Hook-->>Screen: Not available
            Screen-->>User: Show PIN entry only
        end
    else PIN Authentication
        Hook->>Service: validatePIN(pin)
        Service->>SecureStorage: Read PIN hash
        alt Storage Read Success
            SecureStorage-->>Service: PIN hash
            Service->>Service: Hash input PIN
            Service->>Service: Compare hashes
            alt PIN Match
                Service->>Service: Reset failure count
                Service-->>Hook: Success
                Hook-->>Screen: Success
                Screen-->>User: Navigate to Home
            else PIN Mismatch
                Service->>Service: Increment failure count
                Service-->>Hook: Invalid (with count)
                Hook->>Hook: Check failure count
                alt Count < 3
                    Hook-->>Screen: Invalid PIN
                    Screen-->>User: Show error, clear PIN, allow retry
                else Count >= 3
                    Hook->>Hook: Start cooldown timer (30s)
                    Hook-->>Screen: Too many failures
                    Screen-->>User: Show cooldown timer, disable input
                end
            end
        else Storage Read Error
            SecureStorage-->>Service: Error (corrupted, not accessible)
            Service-->>Hook: Critical error
            Hook-->>Screen: Critical error
            Screen-->>User: Show critical error, suggest reinstall
        end
    end
```

**Error Scenarios:**

1. **Biometric Cancelled**: User can fallback to PIN entry
2. **Biometric Failed**: User can retry or use PIN
3. **PIN Invalid**: User can retry (max 3 attempts)
4. **Too Many Failures**: 30-second cooldown timer prevents brute force
5. **Storage Error**: Critical error - may require app reinstall

---

## Database Error Flow

Handling database operation failures and recovery strategies.

```mermaid
sequenceDiagram
    participant User
    participant Screen
    participant Hook
    participant Service
    participant DB as Realm Database

    User->>Screen: Perform action (e.g., add transaction)
    Screen->>Hook: Call hook method
    Hook->>Service: Perform database operation
    Service->>DB: Execute operation
    
    alt Operation Success
        DB-->>Service: Success
        Service-->>Hook: Success result
        Hook-->>Screen: Update state
        Screen-->>User: Show success
    else Validation Error
        DB-->>Service: ValidationError (e.g., required field missing)
        Service->>Service: Extract validation details
        Service-->>Hook: ValidationError with details
        Hook-->>Screen: Validation error
        Screen-->>User: Show field-specific error
    else Database Locked
        DB-->>Service: DatabaseLockedError
        Service->>Service: Retry after delay
        alt Retry Success
            Service-->>Hook: Success
            Hook-->>Screen: Update state
            Screen-->>User: Show success (delayed)
        else Retry Failed
            Service-->>Hook: Database error
            Hook-->>Screen: Error state
            Screen-->>User: Show error, suggest retry
        end
    else Disk Full
        DB-->>Service: DiskFullError
        Service-->>Hook: Critical error
        Hook-->>Screen: Critical error
        Screen-->>User: Show critical error, suggest freeing space
    else Corrupted Database
        DB-->>Service: CorruptedDatabaseError
        Service->>Service: Attempt recovery
        alt Recovery Success
            Service-->>Hook: Success (with warning)
            Hook-->>Screen: Success with warning
            Screen-->>User: Show success, log warning
        else Recovery Failed
            Service-->>Hook: Critical error
            Hook-->>Screen: Critical error
            Screen-->>User: Show critical error, suggest backup restore
        end
    end
```

**Error Recovery Strategies:**

1. **Validation Errors**: User-friendly field-specific messages
2. **Database Locked**: Automatic retry with exponential backoff
3. **Disk Full**: Critical error - user must free space
4. **Corrupted Database**: Attempt automatic recovery, fallback to backup restore

---

## App Lifecycle Management

Handling app background/foreground transitions and session management.

```mermaid
sequenceDiagram
    participant User
    participant App
    participant AuthService as authService
    participant Screen as Current Screen
    participant Timer as Session Timer

    User->>App: App goes to background
    App->>Timer: Start session timer (5 minutes)
    App->>Screen: AppState: background
    Screen->>Screen: Save current state
    
    alt Timer Expires (5 minutes)
        Timer->>AuthService: Session expired
        AuthService->>AuthService: Clear session
        App->>App: Navigate to AuthScreen
        Note over App: User must re-authenticate
    else User Returns Before Timer
        User->>App: App returns to foreground
        App->>Timer: Cancel timer
        App->>Screen: AppState: active
        Screen->>Screen: Restore state
        Screen-->>User: Continue where left off
    else User Returns After Timer
        User->>App: App returns to foreground
        App->>AuthService: Check session
        AuthService-->>App: Session expired
        App->>App: Navigate to AuthScreen
        App-->>User: Show PIN/biometric prompt
    end
```

**Session Management Rules:**

1. **Background Timer**: 5-minute inactivity timer starts when app goes to background
2. **Immediate Return**: If user returns within 5 minutes, session continues
3. **Expired Session**: After 5 minutes, user must re-authenticate
4. **State Preservation**: Current screen state is saved before logout
5. **Future Enhancement**: Configurable timer duration in settings

**Implementation Notes:**

- Timer is reset on any user interaction
- Biometric prompt appears automatically on return if session expired
- PIN entry screen shown if biometric fails or unavailable

---

## Data Persistence & Reinstall

Handling data backup, restore, and app reinstall scenarios.

### Backup Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen as SettingsScreen
    participant Hook as useBackup
    participant Service as backupService
    participant ExportService as exportService
    participant TransactionService as transactionService
    participant CategoryService as categoryService
    participant BudgetService as budgetService
    participant DB as Realm Database
    participant FileSystem as File System

    User->>Screen: Tap "Create Backup"
    Screen->>Hook: createBackup()
    Hook->>Service: exportToJSON()
    Service->>ExportService: getAllData()
    ExportService->>TransactionService: getAllTransactions()
    TransactionService->>DB: Query all transactions
    DB-->>TransactionService: Transactions
    TransactionService-->>ExportService: Transaction data
    ExportService->>CategoryService: getAllCategories()
    CategoryService->>DB: Query all categories
    DB-->>CategoryService: Categories
    CategoryService-->>ExportService: Category data
    ExportService->>BudgetService: getAllBudgets()
    BudgetService->>DB: Query all budgets
    DB-->>BudgetService: Budgets
    BudgetService-->>ExportService: Budget data
    ExportService->>ExportService: Format as JSON backup
    ExportService->>Service: Backup data
    Service->>FileSystem: Write backup file
    alt Write Success
        FileSystem-->>Service: File path
        Service-->>Hook: Backup created
        Hook-->>Screen: Backup ready
        Screen->>Screen: Open share sheet
        Screen-->>User: Share/save backup file
    else Write Error
        FileSystem-->>Service: Error (e.g., disk full)
        Service-->>Hook: Error
        Hook-->>Screen: Error state
        Screen-->>User: Show error message
    end
```

### Restore Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen as SettingsScreen
    participant Hook as useBackup
    participant Service as backupService
    participant ImportService as importService
    participant TransactionService as transactionService
    participant CategoryService as categoryService
    participant BudgetService as budgetService
    participant DB as Realm Database
    participant FileSystem as File System

    User->>Screen: Tap "Restore from Backup"
    Screen->>Screen: Open file picker
    User->>Screen: Select backup file
    Screen->>Hook: restoreFromBackup(filePath)
    Hook->>Service: importFromJSON(filePath)
    Service->>FileSystem: Read backup file
    FileSystem-->>Service: Backup file content
    Service->>Service: Validate backup format
    alt Valid Backup
        Service->>Service: Parse JSON
        Service->>Screen: Show confirmation dialog
        Screen-->>User: "Replace current data?"
        User->>Screen: Confirm
        Screen->>Service: Proceed with restore
        Service->>DB: Begin transaction
        Service->>ImportService: Clear existing data
        ImportService->>TransactionService: Delete all transactions
        TransactionService->>DB: Delete transactions
        ImportService->>CategoryService: Reset categories
        CategoryService->>DB: Reset categories
        ImportService->>BudgetService: Delete all budgets
        BudgetService->>DB: Delete budgets
        Service->>ImportService: Import backup data
        ImportService->>TransactionService: Create transactions
        TransactionService->>DB: Write transactions
        ImportService->>CategoryService: Create categories
        CategoryService->>DB: Write categories
        ImportService->>BudgetService: Create budgets
        BudgetService->>DB: Write budgets
        Service->>DB: Commit transaction
        alt Restore Success
            DB-->>Service: Success
            Service-->>Hook: Restore complete
            Hook-->>Screen: Success
            Screen-->>User: Show success, navigate to Home
        else Restore Error
            DB-->>Service: Error
            Service->>DB: Rollback transaction
            Service-->>Hook: Error
            Hook-->>Screen: Error state
            Screen-->>User: Show error, data unchanged
        end
    else Invalid Backup
        Service-->>Hook: Invalid format error
        Hook-->>Screen: Error state
        Screen-->>User: Show error "Invalid backup file"
    else File Read Error
        FileSystem-->>Service: Error
        Service-->>Hook: Error
        Hook-->>Screen: Error state
        Screen-->>User: Show error "Cannot read file"
    end
```

### App Reinstall Scenario

```mermaid
sequenceDiagram
    participant User
    participant App
    participant AuthService as authService
    participant BackupService as backupService
    participant FileSystem as File System

    User->>App: Install app (first launch)
    App->>AuthService: Check for existing PIN
    AuthService-->>App: No PIN found (new install)
    App->>App: Show onboarding → PIN setup
    App-->>User: Create PIN
    
    Note over User,FileSystem: User should create backup before reinstall
    
    User->>App: Reinstall app
    App->>AuthService: Check for existing PIN
    AuthService-->>App: No PIN found (reinstall)
    App->>App: Show onboarding → PIN setup
    App-->>User: Create new PIN
    User->>App: Navigate to Settings
    User->>App: Tap "Restore from Backup"
    App->>BackupService: Check for backup files
    BackupService->>FileSystem: Search Documents/iCloud Drive
    alt Backup Found
        FileSystem-->>BackupService: Backup file path
        BackupService-->>App: Backup available
        App-->>User: Show "Restore from backup?" prompt
        User->>App: Confirm restore
        App->>BackupService: Restore backup
        Note over BackupService: See Restore Flow above
    else No Backup Found
        FileSystem-->>BackupService: No backup found
        BackupService-->>App: No backup available
        App-->>User: Show "No backup found" message
        Note over User: User must start fresh or manually import backup
    end
```

**Data Persistence Strategy:**

1. **Manual Backup**: User creates backup before reinstall (recommended)
2. **Automatic Backup**: Optional automatic backup to Documents folder (future enhancement)
3. **Restore Process**: User restores from backup file after reinstall
4. **Backup Format**: JSON file with version, timestamp, and all data
5. **Validation**: Backup format validation before restore
6. **Transaction Safety**: Restore uses database transactions for atomicity

**Backup File Structure:**

```json
{
  "version": "1.0",
  "createdAt": "2024-01-26T10:00:00Z",
  "appVersion": "0.0.1",
  "data": {
    "transactions": [...],
    "categories": [...],
    "budgets": [...],
    "settings": {...}
  }
}
```

---

## References

- [C4 Model](https://c4model.com/)
- [C4 Diagram](./c4-diagram.md) - System architecture overview
- [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md)
- [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md)
