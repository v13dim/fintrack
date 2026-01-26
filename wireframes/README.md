# FinTrack Wireframes

HTML mockups of all application screens based on the PRD wireframes.

## Structure

- **`styles.css`** - Base stylesheet with all colors, components, and utilities
- **`index.html`** - Navigation page with links to all wireframes
- Individual screen HTML files numbered by flow

## Color Scheme

### Accent Colors

- `#505160` - Dark accent
- `#68829e` - Medium accent (primary buttons, active states)
- `#aebd38` - Light accent
- `#598234` - Green accent (success states, progress bars)

### Category Colors

**Expenses:**

- Groceries: `#4CAF50`
- Transport: `#2196F3`
- Entertainment: `#9C27B0`
- Restaurants: `#FF9800`
- Health: `#F44336`
- Clothing: `#E91E63`
- Home: `#795548`
- Communication: `#00BCD4`
- Subscriptions: `#673AB7`
- Other: `#607D8B`

**Income:**

- Salary: `#4CAF50`
- Freelance: `#2196F3`
- Gifts: `#E91E63`
- Other: `#607D8B`

## Screen List

### Onboarding & Security

1. `01-splash.html` - Splash screen
2. `02-onboarding-1.html` - Onboarding screen 1
3. `02-onboarding-2.html` - Onboarding screen 2
4. `02-onboarding-3.html` - Onboarding screen 3
5. `03-pin-setup.html` - PIN creation
6. `03-pin-entry.html` - PIN entry with biometrics

### Main Screens

7. `04-home.html` - Home screen with balance and transactions
8. `06-transaction-list.html` - Full transaction list with filters
9. `07-transaction-detail.html` - Transaction detail/edit view
10. `08-analytics.html` - Analytics dashboard

### Add Transaction Flow

11. `05-add-transaction-amount.html` - Step 1: Amount input
12. `05-add-transaction-category.html` - Step 2: Category selection
13. `05-add-transaction-details.html` - Step 3: Date and note (optional)

### Budgets & Categories

14. `09-budgets-list.html` - Budget list with progress
15. `09-budgets-create.html` - Create/edit budget
16. `10-categories.html` - Categories management

### Settings

17. `11-settings.html` - App settings

## Usage

Open `index.html` in a web browser to navigate through all wireframes. Each screen is designed to match the mobile app dimensions (375x812px) and includes interactive elements styled according to the design system.

## Notes

- All screens use the same base stylesheet for consistency
- Colors match the PRD specifications
- Components are reusable and follow the design system
- Mobile-first responsive design
- Interactive elements (buttons, toggles) are styled but not functional
