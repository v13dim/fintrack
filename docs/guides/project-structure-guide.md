# Project Structure Guide

This document provides a detailed guide to the project structure adopted in [ADR-002: Project Structure](../adr/ADR-002-project-structure.md). For the architectural decision and rationale, see the ADR document.

## Project Structure

### Root Level

```
fintrack/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/                  # Application source code
├── __tests__/            # Root-level tests
├── __mocks__/            # Root-level mocks
├── docs/                  # Documentation
│   └── adr/              # ADR documents
├── App.tsx               # Application entry point
├── index.js              # React Native entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── jest.config.js        # Jest test configuration
└── README.md             # Project documentation
```

### Source Directory (`src/`)

```
src/
├── assets/               # Static assets
│   ├── fonts/            # Custom fonts
│   ├── images/           # Image files
│   └── svg/              # SVG icons
│       └── index.ts      # SVG exports
│
├── components/           # UI Components (flexible organization)
│   ├── common/           # Widely reused components
│   │   ├── Button/
│   │   │   ├── __tests__/
│   │   │   │   └── Button.test.tsx
│   │   │   ├── __mocks__/
│   │   │   │   └── Button.module-mocks.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Text/
│   │   └── index.ts      # Common component exports
│   │
│   ├── forms/            # Form-related components
│   │   ├── FormField/
│   │   ├── FormGroup/
│   │   └── index.ts      # Form component exports
│   │
│   └── index.ts          # Main component exports
│
├── screens/              # Screen components
│   ├── Home/
│   │   ├── __tests__/    # Local screen tests
│   │   │   └── HomeScreen.test.tsx
│   │   ├── __mocks__/    # Local screen mocks
│   │   │   └── HomeScreen.module-mocks.tsx
│   │   ├── components/   # Local screen components
│   │   ├── hooks/        # Local screen hooks
│   │   ├── HomeScreen.tsx
│   │   ├── HomeScreen.types.ts
│   │   ├── HomeScreen.styles.ts
│   │   └── index.ts
│   ├── Transactions/
│   ├── Analytics/
│   ├── Budgets/
│   ├── Categories/
│   ├── Settings/
│   ├── Auth/
│   │   ├── PinEntry/
│   │   ├── Onboarding/
│   │   └── Splash/
│   └── index.ts          # Screen exports
│
├── navigation/           # Navigation configuration
│   ├── index.ts          # Navigation setup
│   ├── MainStackNavigation/
│   │   ├── __tests__/        # Navigation tests
│   │   │   └── MainStackNavigation.test.tsx
│   │   ├── __mocks__/        # Navigation mocks
│   │   │   └── MainStackNavigation.module-mocks.ts
│   │   ├── MainStackNavigation.tsx
│   │   ├── MainStackNavigation.types.tsx
│   │   └── index.ts
│   ├── AuthStackNavigation/
│   │   ├── __tests__/
│   │   ├── __mocks__/
│   │   ├── AuthStackNavigation.tsx
│   │   └── index.ts
│   └── index.ts
│
├── hooks/                # Custom React hooks (stored directly in hooks folder)
│   ├── useTransactions.ts
│   ├── useBudgets.ts
│   ├── useCategories.ts
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── index.ts          # Hook exports
│
├── localization/         # Internationalization (i18n)
│   ├── index.ts          # Localization exports
│   └── translations/     # Translation files
│       ├── en.json       # English translations
│       └── ...           # Other language files
│
├── services/             # Business logic services
│   ├── transactionService/
│   │   ├── __tests__/
│   │   │   └── transactionService.test.ts
│   │   ├── __mocks__/
│   │   │   └── transactionService.module-mocks.ts
│   │   ├── transactionService.ts
│   │   └── index.ts
│   ├── categoryService/
│   │   ├── __tests__/
│   │   ├── __mocks__/
│   │   ├── categoryService.ts
│   │   └── index.ts
│   ├── budgetService/
│   ├── authService/
│   ├── exportService/
│   └── index.ts          # Service exports
│
├── contexts/             # React Context providers (global UI state)
│   ├── ThemeContext/     # Theme context (already exists)
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── FiltersContext/    # Global filter state
│   │   ├── FiltersContext.tsx
│   │   └── index.ts
│   ├── SettingsContext/   # App settings
│   │   ├── SettingsContext.tsx
│   │   └── index.ts
│   └── index.ts          # Context exports
│
├── db/                   # Database layer (if using RealmJS)
│   ├── __tests__/        # Database tests
│   │   └── db.test.ts
│   ├── __mocks__/        # Database mocks
│   │   └── db.module-mocks.ts
│   ├── index.ts          # Database initialization
│   ├── realm.ts          # Realm instance
│   ├── schemas/          # Realm schemas
│   │   ├── Transaction/
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── Transaction.ts
│   │   │   └── index.ts
│   │   ├── Category/
│   │   ├── Budget/
│   │   └── index.ts
│   ├── models/           # TypeScript models/interfaces
│   │   ├── Transaction/
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── Transaction.ts
│   │   │   └── index.ts
│   │   ├── Category/
│   │   └── index.ts
│   └── migrations/       # Database migrations
│       └── index.ts
│
├── utils/                # Utility functions (stored directly in utils folder)
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   ├── validation.ts     # Validation utilities
│   └── index.ts          # Utility exports
│
├── contexts/             # React Context providers
│   ├── ThemeContext/
│   │   ├── __tests__/
│   │   │   └── ThemeContext.test.tsx
│   │   ├── __mocks__/
│   │   │   └── ThemeContext.module-mocks.ts
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   └── index.ts          # Context exports
│
├── theme/                # Theme configuration
│   ├── lightTheme.ts      # Light theme object
│   ├── colors.ts          # Color palette
│   ├── commonColors.ts    # Common colors (theme-agnostic)
│   ├── typography.ts      # Font styles
│   ├── spacing.ts         # Spacing scale
│   ├── shadows.ts         # Shadow definitions
│   ├── theme.types.ts     # Theme TypeScript types
│   ├── createStyles.ts    # Style creation utilities (useStyles, createStyles)
│   └── index.ts           # Theme exports
│
├── testUtils/            # Testing utilities
│   ├── index.ts          # Test utility exports
│   ├── mockCreateReactElement.ts  # React element mock helper
│   └── ...               # Other test utilities
│
└── constants/            # Application constants
    ├── index.ts          # Constant exports
    ├── routes.ts         # Route names
    ├── storageKeys.ts    # Storage key constants
    └── config.ts         # App configuration
```

## Folder Organization Rules

### Components (`components/`)

**Structure per component:**

```
ComponentName/
  ├── __tests__/              # Component tests
  │   └── ComponentName.test.tsx
  ├── __mocks__/              # Component mocks
  │   └── ComponentName.module-mocks.ts
  ├── ComponentName.tsx       # Component implementation
  ├── ComponentName.styles.ts # Styles hook (using createStyles)
  ├── ComponentName.types.ts  # Component-specific types
  └── index.ts                # Export
```

**Component Organization:**

Components are organized flexibly within the `components/` directory. Common organizational patterns include:

1. **By Type** (`components/common/`, `components/forms/`, `components/cards/`, `components/lists/`)

   - Groups components by their UI pattern or purpose
   - Examples: `common/Button`, `forms/FormField`, `cards/TransactionCard`, `lists/TransactionList`
   - Good for discovering components by what they do
   - Promotes reuse of similar component types

2. **By Feature** (`components/transactions/`, `components/budgets/`, `components/categories/`)

   - Groups components by business domain or feature
   - Examples: `transactions/TransactionItem`, `budgets/BudgetCard`
   - Useful when components are tightly coupled to a specific feature
   - Can be combined with type-based organization

3. **Common/Shared** (`components/common/`)

   - Widely reused components that don't fit a specific category
   - Examples: `Button`, `Input`, `Text`, `Icon`, `Avatar`
   - Foundation components used throughout the app
   - No business logic, only presentation

**Organization Principles:**

- Organize by purpose, type, or feature as makes sense
- Prioritize discoverability and logical grouping
- No strict hierarchy or dependency rules between component folders
- Components can import from other components as needed
- Focus on reusability through good design, not enforced structure
- Structure can evolve as the project grows

### Screens (`screens/`)

**Structure per screen:**

```
ScreenName/
  ├── __tests__/            # Screen tests
  │   └── ScreenName.test.tsx
  ├── __mocks__/            # Screen mocks
  │   └── ScreenName.module-mocks.ts
  ├── ScreenName.tsx        # Screen component
  ├── ScreenName.styles.ts  # Screen-specific styles
  ├── ScreenName.types.ts   # Screen-specific types
  ├── components/           # Screen-specific components (if any)
  ├── hooks/                # Screen-specific hooks (if any)
  └── index.ts             # Export
```

**Guidelines:**

- Screens compose components from the `components/` directory
- Screens use hooks for business logic
- Screens handle navigation and lifecycle
- Screen-specific components go in `components/` subfolder

### Contexts (`contexts/`)

**Structure per context:**

```
ContextName/
  ├── __tests__/            # Context tests
  │   └── ContextName.test.tsx
  ├── __mocks__/            # Context mocks
  │   └── ContextName.module-mocks.ts
  ├── ContextName.tsx       # Context implementation
  └── index.ts             # Export
```

**Examples:**

- `ThemeContext/` - Theme provider and context

**Guidelines:**

- One context per folder
- Contexts provide global state and configuration
- Used for cross-cutting concerns (theme, auth, etc.)
- Export from `contexts/index.ts` for easy imports
- Components and hooks can consume contexts

### Hooks (`hooks/`)

**Naming:** `useCamelCase`

**Structure:**

Hooks are stored directly in the `hooks/` folder as individual files:

- `useHookName.ts` - Hook implementation
- `index.ts` - Hook exports

**Examples:**

- `useTransactions.ts` - Transaction data and operations
- `useBudgets.ts` - Budget data and operations
- `useAuth.ts` - Authentication state and methods
- `useTheme.ts` - Theme access and switching

**Guidelines:**

- One hook per file
- Hooks encapsulate business logic
- Hooks can use services and other hooks
- Export from `hooks/index.ts` for easy imports
- Tests should be in `__tests__/` folder at the hooks level if needed

### Services (`services/`)

**Naming:** `camelCaseService`

**Structure per service:**

```
ServiceName/
  ├── __tests__/            # Service tests
  │   └── ServiceName.test.ts
  ├── __mocks__/            # Service mocks (if needed)
  │   └── ServiceName.module-mocks.ts
  ├── ServiceName.ts        # Service implementation
  └── index.ts              # Export
```

**Examples:**

- `transactionService/` - Transaction CRUD operations
- `categoryService/` - Category management
- `authService/` - Authentication logic
- `exportService/` - Data export functionality

**Guidelines:**

- One service per folder
- Services abstract data access (database, API)
- Services contain business rules
- Services are pure functions or classes
- Services can use database layer (`db/`)

### Database (`db/`)

**Structure:**

```
db/
  ├── index.ts           # Database initialization
  ├── realm.ts           # Realm instance and configuration
  ├── schemas/           # Realm schema definitions
  ├── models/            # TypeScript interfaces/types
  └── migrations/        # Database migration scripts
```

**Guidelines:**

- Realm schemas in `schemas/`
- TypeScript types/interfaces in `models/`
- Database accessed only through services
- Components never import from `db/` directly

### Utils (`utils/`)

**Naming:** `camelCase`

**Structure:**

Utilities are stored directly in the `utils/` folder as individual files:

- `utilityName.ts` - Utility implementation
- `index.ts` - Utility exports

**Examples:**

- `formatCurrency.ts` - Currency formatting
- `formatDate.ts` - Date formatting
- `validation.ts` - Validation utilities

**Guidelines:**

- One utility function per file (or group related utilities in one file)
- Pure functions only
- No side effects
- No dependencies on other app code
- Can be easily tested in isolation
- Tests should be in `__tests__/` folder at the utils level if needed

### Theme (`theme/`)

**Structure:**

```
theme/
  ├── index.ts          # Theme exports
  ├── lightTheme.ts     # Light theme object
  ├── colors.ts         # Color palette
  ├── commonColors.ts   # Common colors (theme-agnostic)
  ├── typography.ts     # Font styles
  ├── spacing.ts        # Spacing scale
  ├── shadows.ts        # Shadow definitions
  ├── theme.types.ts    # Theme TypeScript types
  └── createStyles.ts   # Style creation utilities (useStyles, createStyles)
```

**Guidelines:**

- Centralized design tokens
- Used by all components
- Supports theme switching (future)
- Use `useTheme()` hook to access theme in components
- Use `createStyles()` to create style hooks with access to theme, dimensions, and insets
- Each component should create its own style hook using `createStyles`
- Define interface for extra data if styles depend on component props/state

**Creating Styles:**

Styles are created using `createStyles` which provides access to:

- `theme` - Current theme object (colors, typography, spacing, shadows)
- `dimensions` - Screen dimensions (width, height, scale, fontScale)
- `insets` - Safe area insets (top, right, bottom, left)
- `extra` - Extra data that affects styles (define interface for extra data)

Example with extra data:

```typescript
// Component.styles.ts
import { createStyles } from 'theme';

interface ComponentStylesExtra {
  isActive: boolean;
  variant?: 'primary' | 'secondary';
}

export const useComponentStyles = createStyles(
  (
    { theme: { colors, typography, spacing }, dimensions: { width }, insets: { top } },
    { isActive, variant = 'primary' }: ComponentStylesExtra,
  ) => ({
    container: {
      backgroundColor: isActive ? colors.accent.green : colors.background.primary,
      padding: spacing.lg,
      paddingTop: top + spacing.md,
      width: width,
    },
    text: {
      ...typography.body,
      color: variant === 'primary' ? colors.text.primary : colors.text.secondary,
    },
  }),
);

// In component:
const styles = useComponentStyles({ isActive: true, variant: 'primary' });
```

Example without extra data:

```typescript
// Component.styles.ts
import { createStyles } from 'theme';

export const useComponentStyles = createStyles(({ theme: { colors, spacing } }) => ({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
}));

// In component:
const styles = useComponentStyles();
```

### Localization (`localization/`)

**Structure:**

```
localization/
  ├── index.ts           # Localization exports
  └── translations/      # Translation files
      ├── en.json        # English translations
      ├── ua.json        # Ukranian translations (future)
      └── ...            # Other language files
```

**Guidelines:**

- One JSON file per language
- Translation keys organized by feature/screen
- Used for all user-facing text
- Supports future multi-language support

**Example structure:**

```json
// translations/en.json
{
  "screens": {
    "helloWorld": {
      "title": "Hello world!"
    }
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### Test Utils (`testUtils/`)

**Structure:**

```
testUtils/
  ├── index.ts                    # Test utility exports
  ├── mockCreateReactElement.ts   # React element mock helper
  └── ...                         # Other test utilities
```

**Guidelines:**

- Shared testing utilities and helpers
- Mock creation helpers
- Test setup utilities
- Used across all test files

**Examples:**

- `mockCreateReactElement.ts` - Helper for creating mocked React elements

### Constants (`constants/`)

**Naming:** `camelCase.ts`

**Examples:**

- `routes.ts` - Route name constants
- `storageKeys.ts` - Storage key strings
- `config.ts` - App configuration

**Guidelines:**

- Immutable values only
- No business logic
- Used across the application

## File Naming Conventions

| Type       | Convention                  | Example                                      |
| ---------- | --------------------------- | -------------------------------------------- |
| Components | `PascalCase.tsx`            | `Button.tsx`, `TransactionCard.tsx`          |
| Screens    | `PascalCase.tsx`            | `HomeScreen.tsx`, `SettingsScreen.tsx`       |
| Hooks      | `useCamelCase.ts`           | `useTransactions.ts`, `useAuth.ts`           |
| Services   | `camelCaseService.ts`       | `transactionService.ts`, `authService.ts`    |
| Utils      | `camelCase.ts`              | `formatCurrency.ts`, `validateInput.ts`      |
| Types      | `PascalCase.ts`             | `Transaction.ts`, `Category.ts`              |
| Constants  | `camelCase.ts`              | `routes.ts`, `storageKeys.ts`                |
| Tests      | `*.test.tsx` or `*.test.ts` | `Button.test.tsx`, `useTransactions.test.ts` |
| Styles     | `*.styles.ts`               | `Button.styles.ts`, `HomeScreen.styles.ts`   |

## Import Organization

### Import Order

```typescript
// 1. External dependencies (React, React Native, third-party)
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Internal absolute imports (by layer, alphabetical)
// Navigation
import { routes } from 'navigation';

// Components (organized by type/feature)
import { Button } from 'components/common';
import { FormField } from 'components/forms';
import { TransactionList } from 'components/lists';

// Contexts
import { ThemeProvider } from 'contexts/ThemeContext';

// Hooks
import { useTransactions } from 'hooks';

// Services
import { transactionService } from 'services';

// Utils
import { formatCurrency } from 'utils';

// Theme
import { createStyles } from 'theme';

// Constants
import { STORAGE_KEYS } from 'constants';

// Localization
import { t } from 'localization';

// Test Utils (only in test files)
import { mockCreateReactElement } from 'testUtils';

// 3. Relative imports
import { useComponentStyles } from './Component.styles';
import { Transaction } from './types';
```

### Import Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "assets/*": ["assets/*"],
      "components/*": ["components/*"],
      "constants/*": ["constants/*"],
      "contexts/*": ["contexts/*"],
      "db/*": ["db/*"],
      "hooks/*": ["hooks/*"],
      "localization/*": ["localization/*"],
      "navigation/*": ["navigation/*"],
      "screens/*": ["screens/*"],
      "services/*": ["services/*"],
      "store/*": ["store/*"],
      "testUtils/*": ["testUtils/*"],
      "theme/*": ["theme/*"],
      "utils/*": ["utils/*"]
    }
  }
}
```

## Component File Structure Template

```typescript
// 1. Imports (external → internal → relative)
import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'components/common';
import { useTransactions } from 'hooks';
import { styles } from './styles';

// 2. Types/Interfaces
interface IComponentProps {
  // props definition
}

// 3. Component
export const Component: FC<IComponentProps> = ({ ...props }) => {
  // Component logic
  return <View style={styles.container}>{/* JSX */}</View>;
};

// 4. Styles (use createStyles hook)
const styles = useComponentStyles();

// 5. Exports (if needed)
export default Component;
```

## Index Files Pattern

Each folder should have an `index.ts` file that exports public APIs:

```typescript
// components/common/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Text } from './Text';

// components/index.ts
export { Button, Input, Text } from './common';
export { FormField } from './forms';
export { TransactionCard } from './cards';

// hooks/index.ts
export { useTransactions } from './useTransactions';
export { useBudgets } from './useBudgets';
export { useAuth } from './useAuth';
```

**Benefits:**

- Cleaner imports: `import { Button } from 'components/common'` or `import { Button } from 'components'`
- Encapsulation: hide internal structure
- Easier refactoring: change internal structure without breaking imports
- Flexible organization: components can be reorganized without breaking external imports

## Module Structure Pattern

**Consistent Pattern for All Modules:**

Every module (component, hook, service, utility, screen, etc.) follows this consistent structure:

```
ModuleName/
  ├── __tests__/                    # Test files
  │   └── ModuleName.test.tsx (or .ts)
  ├── __mocks__/                    # Mock files
  │   └── ModuleName.module-mocks.ts (or .tsx)
  ├── ModuleName.tsx (or .ts)      # Implementation
  ├── ModuleName.types.ts           # Types (if separate)
  ├── ModuleName.styles.ts          # Styles hook using createStyles (if separate)
  └── index.ts                      # Export
```

**Benefits of This Structure:**

1. **Consistency**

   - Same structure everywhere makes codebase predictable
   - Developers know exactly where to find tests and mocks

2. **Organization**

   - Tests and mocks are clearly separated from implementation
   - Easy to identify test-related files

3. **Scalability**

   - Easy to add more test files or mock files as needed
   - Structure supports complex modules with multiple test files

4. **IDE Support**

   - IDEs can easily recognize test folders
   - Better code navigation and search

5. **Build Tools**

   - Jest and other tools can easily find tests
   - Mock resolution works seamlessly

6. **Team Collaboration**
   - Clear conventions reduce confusion
   - New team members understand structure immediately

## Guidelines for Adding New Code

### Adding a New Component

1. Determine appropriate organization (common, forms, cards, lists, or feature-specific)
2. Create folder: `components/{category}/ComponentName/`
   - Use `common/` for widely reused components (Button, Input, Text)
   - Use `forms/` for form-related components (FormField, FormGroup)
   - Use `cards/` for card components (TransactionCard, BudgetCard)
   - Use `lists/` for list components (TransactionList, CategoryList)
   - Use feature folders if component is feature-specific (e.g., `transactions/TransactionItem`)
3. Create folder structure:
   - `__tests__/ComponentName.test.tsx` - Test file
   - `__mocks__/ComponentName.module-mocks.ts` - Mock file
   - `ComponentName.tsx` - Component implementation
   - `ComponentName.styles.ts` (if needed) - Styles hook using createStyles
   - `ComponentName.types.ts` (if needed) - Types
   - `index.ts` - Export file
4. Export from `components/{category}/index.ts` (if category has index file)
5. Export from `components/index.ts` for public API

### Adding a New Screen

1. Create folder: `screens/ScreenName/`
2. Create folder structure:
   - `__tests__/ScreenName.test.tsx` - Test file
   - `__mocks__/ScreenName.module-mocks.ts` - Mock file
   - `ScreenName.tsx` - Screen component
   - `ScreenName.styles.ts` - Screen styles hook using createStyles
   - `ScreenName.types.ts` (if needed) - Screen types
   - `components/` (optional) - Screen-specific components
   - `hooks/` (optional) - Screen-specific hooks
   - `index.ts` - Export file
3. Add route in `navigation/routes.ts`
4. Export from `screens/index.ts`

### Adding a New Hook

1. Create file: `hooks/useHookName.ts`
2. Encapsulate business logic
3. Export from `hooks/index.ts`

### Adding a New Service

1. Create folder: `services/serviceNameService/`
2. Create folder structure:
   - `__tests__/serviceNameService.test.ts` - Test file
   - `__mocks__/serviceNameService.module-mocks.ts` - Mock file
   - `serviceNameService.ts` - Service implementation
   - `index.ts` - Export file
3. Export from `services/index.ts`

### Adding a New Database Schema

1. Create schema folder: `db/schemas/ModelName/`
   - `__tests__/ModelName.test.ts` - Schema tests
   - `__mocks__/ModelName.module-mocks.ts` - Schema mocks
   - `ModelName.ts` - Realm schema definition
   - `index.ts` - Export file
2. Create model folder: `db/models/ModelName/`
   - `__tests__/ModelName.test.ts` - Model tests
   - `__mocks__/ModelName.module-mocks.ts` - Model mocks
   - `ModelName.ts` - TypeScript interface/type
   - `index.ts` - Export file
3. Export from respective `index.ts` files
4. Register schema in `db/realm.ts`

### Adding a New Utility Function

1. Create file: `utils/utilityName.ts`
2. Keep functions pure (no side effects)
3. Export from `utils/index.ts`

### Adding a New Translation File

1. Create file: `localization/translations/{languageCode}.json`
2. Follow the existing translation structure
3. Use nested objects for organization (e.g., `screens.helloWorld.title`)
4. Export from `localization/index.ts` if needed

**Example:**

```json
// localization/translations/es.json
{
  "screens": {
    "helloWorld": {
      "title": "¡Hola mundo!"
    }
  }
}
```

### Adding a New Test Utility

1. Create file: `testUtils/utilityName.ts`
2. Export from `testUtils/index.ts`
3. Document usage in code comments
4. Add tests if the utility is complex

**Guidelines:**

- Keep utilities simple and focused
- Use TypeScript for type safety
- Document with JSDoc comments
- Make utilities reusable across test files

## Migration Strategy

If code exists outside this structure:

1. **Gradual Migration**

   - Move files incrementally
   - Update imports as you go
   - Don't break existing functionality

2. **Refactoring Steps**

   - Identify file's purpose
   - Determine correct location
   - Move file and update imports
   - Run tests to verify

3. **Linting Rules**
   - Add ESLint rules to enforce structure
   - Prevent incorrect imports between layers

## References

- [ADR-002: Project Structure](../adr/ADR-002-project-structure.md) - Architectural decision
- [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md) - High-level architecture
- [Layered Architecture Implementation Guide](./layered-architecture-implementation.md) - Architecture implementation details
- [React Native Project Structure](https://reactnative.dev/docs/contributing)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- Project Specification: `fintrack-spec-en.md`
