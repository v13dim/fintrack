# Phase 2: Core Features

**Total Story Points**: 117  
**Timeline**: Week 2-3  
**Priority**: Mix of P0, P1, P2

## EPIC: Authentication & Security

**Total: 21 points**

### US-201: Splash Screen

**Story Points**: 2 | **Priority**: P0

As a user, I need a splash screen on app launch, so I see branding while app initializes.

**Acceptance Criteria:**

- Given the app launches
- When the app initializes
- Then splash screen displays with branding
- And splash screen hides after app initialization completes

---

### US-202: Onboarding

**Story Points**: 5 | **Priority**: P0

As a new user, I need onboarding screens (3 screens) explaining app features, so I understand how to use the app.

**Acceptance Criteria:**

- Given I launch the app for the first time
- When the app loads
- Then I see the first onboarding screen with description and illustration

- Given I'm on an onboarding screen
- When I tap "Next"
- Then I proceed to the next screen

- Given I'm on any onboarding screen
- When I tap "Skip"
- Then I proceed to PIN creation

- Given I'm on the last onboarding screen
- When I tap "Get Started"
- Then I proceed to PIN creation

---

### US-203: PIN Authentication

**Story Points**: 8 | **Priority**: P0

As a user, I need PIN authentication to secure my data, so my financial information is protected.

**Acceptance Criteria:**

**PIN Creation:**

- Given I'm on the PIN creation screen
- When I enter 4 digits
- Then I see a prompt to repeat the PIN

- Given I entered PIN the first time
- When I enter the same PIN again
- Then the PIN is saved and I'm taken to the home screen

- Given I entered PIN the first time
- When I enter a different PIN the second time
- Then I see an error "PINs don't match"
- And I return to the first entry

**PIN Login:**

- Given I open the app (not first time)
- When the app loads
- Then I see the PIN entry screen

- Given I'm on the PIN entry screen
- When I enter the correct PIN
- Then I'm taken to the home screen

- Given I'm on the PIN entry screen
- When I enter incorrect PIN
- Then I see an error and can try again

- Given I entered incorrect PIN 3 times in a row
- When I try to enter PIN again
- Then I see a 30-second countdown timer
- And keyboard buttons are disabled

---

### US-204: Biometric Authentication

**Story Points**: 5 | **Priority**: P1

As a user, I need biometric authentication (Face ID/Touch ID) option, so I can access the app quickly and securely.

**Acceptance Criteria:**

- Given biometrics is enabled in settings
- When I open the app
- Then biometric prompt appears automatically

- Given biometric prompt appeared
- When authentication succeeds
- Then I'm taken to the home screen

- Given biometric prompt appeared
- When authentication fails or is cancelled
- Then I can enter PIN manually

---

### US-205: Auto-lock

**Story Points**: 3 | **Priority**: P1

As a user, I need auto-lock functionality after inactivity, so my data remains secure.

**Acceptance Criteria:**

- Given I'm in the app
- When I minimize the app for more than X minutes (configurable)
- Then upon return PIN/biometric is required

- Given I'm in settings
- When I change auto-lock time
- Then the new value is applied
- And available values are: 30 sec, 1 min, 5 min, never

---

### US-206: Secure Storage

**Story Points**: 3 | **Priority**: P0

As a developer, I need secure storage for sensitive data (encrypted Realm), so user data is protected.

**Acceptance Criteria:**

- Given sensitive data needs to be stored
- When data is stored
- Then it's encrypted using Realm encryption
- And PIN is stored in Keychain (iOS) / Keystore (Android), not plaintext

---

## EPIC: Transactions

**Total: 34 points**

### US-301: Create Transaction

**Story Points**: 5 | **Priority**: P0

As a user, I need to create a transaction (income/expense) with amount, category, date, and optional note, so I can track my finances.

**Acceptance Criteria:**

**Add Expense:**

- Given I'm on the home screen
- When I tap the FAB (+)
- Then the add screen opens in "Expense" mode

- Given I'm on the add screen
- When I enter amount and tap "Next"
- Then I see category selection

- Given I selected a category
- When I tap on it
- Then the transaction is saved with current date
- And I return to home screen
- And the new transaction is visible in the list

- Given I selected a category
- When I want to add details
- Then I can change date and add a note
- And then save

**Add Income:**

- Given I'm on the add transaction screen
- When I switch to "Income" tab
- Then categories change to income categories
- And interface color changes to green

- Given I'm adding income
- When I save the transaction
- Then it shows with plus sign in the list
- And balance increases

---

### US-302: View Transaction List

**Story Points**: 5 | **Priority**: P0

As a user, I need to view a list of all transactions grouped by day, so I can see my spending history.

**Acceptance Criteria:**

- Given I'm on the home screen
- When the screen loads
- Then I see transactions grouped by day
- And days are sorted newest to oldest
- And each day shows a total

- Given there are many transactions
- When I scroll down
- Then older transactions load (infinite scroll)

- Given I'm on the home screen
- When I pull down (pull-to-refresh)
- Then the list refreshes

---

### US-303: Edit Transaction

**Story Points**: 3 | **Priority**: P0

As a user, I need to edit a transaction, so I can correct mistakes.

**Acceptance Criteria:**

- Given I'm viewing a transaction
- When I tap "Edit"
- Then the edit screen opens with current data

- Given I'm on the edit screen
- When I change data and save
- Then the transaction updates
- And I return to viewing

- Given I'm on the edit screen
- When I cancel changes
- Then data is not saved

---

### US-304: Delete Transaction

**Story Points**: 2 | **Priority**: P0

As a user, I need to delete a transaction with confirmation, so I can remove incorrect entries.

**Acceptance Criteria:**

- Given I'm viewing a transaction
- When I tap the delete icon
- Then a confirmation appears "Delete transaction?"

- Given confirmation appeared
- When I confirm deletion
- Then the transaction is deleted
- And I return to the list
- And balance recalculates

- Given I'm in the transaction list
- When I swipe a transaction left
- Then a delete button appears

---

### US-305: Filter Transactions

**Story Points**: 5 | **Priority**: P1

As a user, I need to filter transactions by type (income/expense), category, and date range, so I can find specific transactions.

**Acceptance Criteria:**

- Given I'm on the all transactions screen
- When I select "Expenses only" filter
- Then only expenses show in the list

- Given I'm on the all transactions screen
- When I select a specific category
- Then only transactions in that category show

- Given I applied filters
- When I reset filters
- Then all transactions show

---

### US-306: Search Transactions

**Story Points**: 3 | **Priority**: P1

As a user, I need to search transactions by note or amount, so I can quickly find entries.

**Acceptance Criteria:**

- Given I'm on the all transactions screen
- When I tap the search icon
- Then a search field appears

- Given I entered text in search
- When text is >= 2 characters
- Then the list filters by note matches

- Given search is active
- When I clear the field or close search
- Then the full list shows

---

### US-307: Swipe Actions

**Story Points**: 5 | **Priority**: P1

As a user, I need swipe actions (edit/delete) on transaction list items, so I can quickly manage transactions.

**Acceptance Criteria:**

- Given I'm in the transaction list
- When I swipe a transaction right
- Then edit button appears

- Given I'm in the transaction list
- When I swipe a transaction left
- Then delete button appears

---

### US-308: Pull-to-Refresh

**Story Points**: 2 | **Priority**: P2

As a user, I need pull-to-refresh on transaction list, so I can reload data.

**Acceptance Criteria:**

- Given I'm on the transaction list screen
- When I pull down
- Then the list refreshes
- And transactions are reloaded from database

---

### US-309: Infinite Scroll

**Story Points**: 3 | **Priority**: P2

As a user, I need infinite scroll for transaction list, so I can view large datasets efficiently.

**Acceptance Criteria:**

- Given there are many transactions
- When I scroll near the bottom
- Then older transactions load automatically
- And list continues scrolling smoothly

---

### US-310: Realm Persistence

**Story Points**: 3 | **Priority**: P0

As a developer, I need transaction data persisted in Realm database, so data survives app restarts.

**Acceptance Criteria:**

- Given I create a transaction
- When I close and reopen the app
- Then the transaction is still present
- And data persists across app restarts

---

## EPIC: Categories

**Total: 21 points**

### US-401: Preset Categories

**Story Points**: 3 | **Priority**: P0

As a user, I need preset categories (expenses and income) with icons and colors, so I can quickly categorize transactions.

**Acceptance Criteria:**

- Given I'm in settings
- When I open "Categories"
- Then I see a list of categories split into Expenses and Income
- And each category shows icon, name, color

**Preset Expense Categories:**

- Groceries 🛒 (#4CAF50)
- Transport 🚗 (#2196F3)
- Entertainment 🎬 (#9C27B0)
- Restaurants 🍽️ (#FF9800)
- Health 💊 (#F44336)
- Clothing 👕 (#E91E63)
- Home 🏠 (#795548)
- Communication 📱 (#00BCD4)
- Subscriptions 📺 (#673AB7)
- Other 📦 (#607D8B)

**Preset Income Categories:**

- Salary 💰 (#4CAF50)
- Freelance 💻 (#2196F3)
- Gifts 🎁 (#E91E63)
- Other 📥 (#607D8B)

---

### US-402: Create Custom Category

**Story Points**: 5 | **Priority**: P0

As a user, I need to create custom categories with name, icon, color, and type, so I can personalize my categories.

**Acceptance Criteria:**

- Given I'm on the categories screen
- When I tap "+"
- Then the creation screen opens

- Given I'm on the category creation screen
- When I enter name, select icon and color, select type
- Then I can save the category

- Given I saved the category
- When I return to the list
- Then the new category is visible in the appropriate section

---

### US-403: Edit Category

**Story Points**: 3 | **Priority**: P0

As a user, I need to edit custom categories, so I can update category details.

**Acceptance Criteria:**

- Given I'm on the categories screen
- When I tap on a category
- Then the edit screen opens

- Given I'm on the edit screen
- When I change data and save
- Then the category updates
- And all transactions with this category reflect changes

---

### US-404: Delete Category

**Story Points**: 5 | **Priority**: P1

As a user, I need to delete custom categories (with transaction reassignment), so I can manage my category list.

**Acceptance Criteria:**

- Given I'm editing a category
- When I tap "Delete"
- Then a warning appears

- Given the category has transactions
- When I confirm deletion
- Then transactions move to "Other" category
- And the category is deleted

- Given this is a preset category
- When I try to delete
- Then I see a message that default categories cannot be deleted

---

### US-405: Sort Categories

**Story Points**: 5 | **Priority**: P1

As a user, I need to reorder categories by drag & drop, so I can prioritize frequently used categories.

**Acceptance Criteria:**

- Given I'm on the categories screen
- When I hold the drag handle (≡) on a category
- Then I can drag it up or down

- Given I dragged a category
- When I release
- Then the new order is saved
- And when adding transactions categories are in new order

---

## EPIC: Budgets

**Total: 21 points**

### US-501: Create Budget

**Story Points**: 5 | **Priority**: P0

As a user, I need to set a monthly budget for a category, so I can control my spending.

**Acceptance Criteria:**

- Given I'm on the budgets screen
- When I tap "+"
- Then the budget creation screen opens

- Given I'm creating a budget
- When I select a category and enter amount
- Then I can save the budget

- Given I saved the budget
- When I return to the list
- Then the new budget is visible with 0% progress

---

### US-502: View Budget Progress

**Story Points**: 5 | **Priority**: P0

As a user, I need to view budget progress with a progress bar, so I can see how much I've spent.

**Acceptance Criteria:**

- Given I have a budget for a category
- When I view the budgets list
- Then I see: spent / limit, percentage, progress bar

- Given spent < 80%
- Then progress bar is green, status "Within budget"

- Given spent 80-99%
- Then progress bar is yellow/orange, status "Almost exhausted"

- Given spent >= 100%
- Then progress bar is red, status "Exceeded"

---

### US-503: Edit/Delete Budget

**Story Points**: 3 | **Priority**: P0

As a user, I need to edit or delete a budget, so I can adjust my spending limits.

**Acceptance Criteria:**

**Edit Budget:**

- Given I'm on the budgets screen
- When I tap on a budget
- Then the edit screen opens

- Given I'm on the edit screen
- When I change amount and save
- Then the limit updates
- And progress recalculates

**Delete Budget:**

- Given I'm editing a budget
- When I tap "Delete"
- Then confirmation appears

- Given I confirmed deletion
- Then the budget is deleted
- And transactions remain unchanged

---

### US-504: Budget Notifications

**Story Points**: 8 | **Priority**: P1

As a user, I need notifications when budget reaches 80% and 100%, so I'm aware of my spending.

**Acceptance Criteria:**

- Given I have a budget with notifications enabled
- When I add a transaction and total reaches 80%
- Then I receive push notification "Budget for [category] is 80% spent"

- Given total reaches 100%
- When I add a transaction
- Then I receive notification "Budget for [category] exhausted"

---

## EPIC: Analytics

**Total: 21 points**

### US-601: Pie Chart by Category

**Story Points**: 5 | **Priority**: P0

As a user, I need a pie chart showing expenses by category, so I can see spending distribution.

**Acceptance Criteria:**

- Given I'm on the analytics screen
- When the screen loads
- Then I see a pie chart with expense distribution

- Given I'm viewing the pie chart
- When I tap on a segment
- Then details show: category, amount, percentage

---

### US-602: Line Chart Trends

**Story Points**: 5 | **Priority**: P0

As a user, I need a line chart showing spending trends over time, so I can track spending patterns.

**Acceptance Criteria:**

- Given I'm on the analytics screen
- When I scroll to the "Trends" section
- Then I see a line/bar chart by month

- Given I'm viewing the chart
- When I select a period (week/month/year)
- Then the chart updates for the selected period

---

### US-603: Summary Cards

**Story Points**: 3 | **Priority**: P0

As a user, I need summary cards showing total income, expenses, and balance, so I have a quick overview.

**Acceptance Criteria:**

- Given I'm on the analytics screen
- When the screen loads
- Then I see summary cards showing:
  - Total income
  - Total expenses
  - Balance (income - expenses)

---

### US-604: Period Comparison

**Story Points**: 5 | **Priority**: P1

As a user, I need comparison with previous period (month/week), so I can see spending changes.

**Acceptance Criteria:**

- Given I'm on the analytics screen
- When I view the summary
- Then I see comparison with previous period
- And up/down arrow shows the change
- And percentage change is shown

---

### US-605: Efficient Calculations

**Story Points**: 3 | **Priority**: P0

As a developer, I need analytics data calculated efficiently from transactions, so charts load quickly.

**Acceptance Criteria:**

- Given I'm on the analytics screen
- When the screen loads
- Then charts load within performance requirements (<300ms)
- And calculations are optimized for large datasets

---

## EPIC: Data Management

**Total: 20 points**

### US-207: Settings Screen

**Story Points**: 5 | **Priority**: P1

As a user, I need a Settings screen to manage app and security options, so I can enable biometric login, configure auto-lock, and access data management (export, backup, etc.).

**Context:** US-204 (Biometric authentication) implements the flow at app open (prompt → Home or PIN). The choice «use biometric login» is persisted in secure storage but has no UI until this story. US-205 (Auto-lock) and US-701–US-704 refer to «Given I'm in settings»; this story delivers the screen they depend on.

**Acceptance Criteria:**

**Settings screen**

- Given I'm on the Home screen
- When I open the Settings tab (or navigate to Settings)
- Then I see the Settings screen with at least a «Security» section

**Biometric login toggle (completes US-204)**

- Given I'm on the Settings screen
- When I see the «Security» (or «Biometric») section
- Then I see a switch «Вход по биометрии» / «Use Face ID / Touch ID» (or similar, from `biometric.enable`)

- Given the device supports Face ID / Touch ID / fingerprint
- When I turn the switch ON
- Then the app calls `BiometricAuthService.enableBiometric()` (or equivalent)
- And the choice is stored in secure storage (Keychain), not in plain text
- And on next app open the biometric prompt is shown (US-204 flow)

- Given biometric login is enabled
- When I turn the switch OFF
- Then the app calls `BiometricAuthService.disableBiometric()` (or equivalent)
- And on next app open the PIN entry screen is shown without attempting biometric

- Given the device has no biometric hardware or it is unavailable
- When I'm on the Settings screen
- Then the biometric switch is either hidden or disabled with an explanation (e.g. `biometric.unavailable`)

**Auto-lock (placeholder for US-205)**

- Given I'm on the Settings screen
- When the «Security» section is implemented
- Then a placeholder or link for «Auto-lock» (US-205) may be present; configuration of auto-lock time is part of US-205

**Technical notes**

- Use `BiometricAuthService.isBiometricAvailable()` and `BiometricAuthService.isBiometricEnabled()` to control visibility/state of the toggle.
- Use existing localization keys: `biometric.enable`, `biometric.unavailable`, `biometric.failed`, and `settings.*` as needed.

---

### US-701: Export to CSV

**Story Points**: 5 | **Priority**: P1

As a user, I need to export transactions to CSV, so I can analyze data in spreadsheet applications.

**Acceptance Criteria:**

- Given I'm in settings
- When I select "Export to CSV"
- Then a file is generated with all transactions

- Given the file is generated
- When generation completes
- Then the system share sheet opens
- And I can save the file or send it

**CSV Format:**

```
date,type,category,amount,note
2024-12-15,expense,Groceries,54.00,Lidl
```

---

### US-702: Create Backup

**Story Points**: 5 | **Priority**: P1

As a user, I need to backup all data to JSON file, so I can restore data if needed.

**Acceptance Criteria:**

- Given I'm in settings
- When I select "Create Backup"
- Then a JSON file is generated with all data

- Given backup is created
- When generation completes
- Then share sheet opens for saving

**JSON contains:**

- all transactions
- all categories (including custom)
- all budgets
- settings
- format version

---

### US-703: Restore from Backup

**Story Points**: 3 | **Priority**: P1

As a user, I need to restore data from JSON backup, so I can recover my data.

**Acceptance Criteria:**

- Given I'm in settings
- When I select "Restore"
- Then file picker opens

- Given I selected a backup file
- When the file is valid
- Then confirmation appears "Replace current data?"

- Given I confirmed
- When restore completes
- Then all data is replaced with backup data
- And I see a success message

---

### US-704: Delete All Data

**Story Points**: 2 | **Priority**: P2

As a user, I need to clear all data with confirmation, so I can reset the app.

**Acceptance Criteria:**

- Given I'm in settings
- When I select "Delete All Data"
- Then a warning appears

- Given the warning appeared
- When I confirm by typing "DELETE"
- Then all transactions and budgets are deleted
- And categories reset to defaults
- And PIN remains

- Given I didn't enter confirmation
- When I tap "Cancel"
- Then nothing is deleted

---

### US-705: Jest Coverage for Services and Utils

**Story Points**: 2 | **Priority**: P1

As a developer, I need Jest coverage thresholds enabled for `src/services` and `src/utils`, so business logic and utilities are covered by tests.

**Acceptance Criteria:**

- Given services and/or utils are implemented in the codebase
- When Jest runs with coverage
- Then `jest.config.js` includes coverage thresholds for `src/services/**/*.ts` and `src/utils/**/*.ts` (e.g. 80% branches, functions, lines, statements)
- And the related TODO in `jest.config.js` is resolved (uncommented and linked to this story)

---

## Deliverables

- Complete authentication flow (PIN required, biometric optional)
- Secure data storage
- Onboarding screens
- Working transaction CRUD
- Transaction list with filtering and search
- Complete category management with drag & drop
- Budget management with progress visualization
- Analytics dashboard with charts
- Data export/import functionality

## References

- [Product Backlog](../product-backlog.md) - Back to main backlog
- [Project Estimation](../estimation.md) - Estimation and roadmap
