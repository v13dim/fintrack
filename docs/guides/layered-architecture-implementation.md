# Layered Architecture Implementation Guide

This document describes the detailed architecture implementation for FinTrack. For architectural decisions, see [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md).

## Architecture Layers

The application follows a Layered Architecture pattern with four main layers:

### 1. Presentation Layer (`components/`, `screens/`, `navigation/`)

- **UI Components** (`components/`): Organized flexibly by type, feature, or common/shared

  - UI components are presentation-only
  - Screens compose components and handle navigation
  - Container/Presentation pattern for logic separation

- **Screens** (`screens/`): Screen-level components that compose UI components

  - Handle navigation and lifecycle
  - Use hooks for business logic
  - Compose components from the `components/` directory

- **Navigation** (`navigation/`): Navigation configuration and routing setup
  - Navigation is used by screens, but screens don't depend on navigation internals

### 2. Business Logic Layer (`hooks/`, `services/`)

- **Hooks** (`hooks/`): Custom React hooks that encapsulate business logic

  - Examples: `useTransactions`, `useBudgets`, `useAuth`
  - Encapsulate business logic in reusable hooks

- **Services** (`services/`): Business logic services that handle data operations
  - Handle data operations and business rules
  - Pure functions where possible
  - Abstract data access (database, API)

### 3. Data Layer (`store/`, `db/`)

- **State Management** (`store/`): Application state management

  - To be decided (see ADR-003)

- **Database** (`db/`): Local database layer using **RealmJS by MongoDB**
  - Object-oriented database for local-first architecture
  - Schema definitions, models, and database configuration
  - Realm queries and data access patterns
  - Automatic persistence and real-time updates
  - Database accessed only through services, never directly from components

### 4. Infrastructure Layer (`utils/`, `theme/`, `constants/`, `assets/`)

- **Utilities** (`utils/`): Shared utilities and helpers

  - Pure functions only
  - No side effects
  - No dependencies on other app code

- **Theme** (`theme/`): Theme configuration

  - Design tokens (colors, typography, spacing)
  - Supports theme switching (future)

- **Constants** (`constants/`): Application constants

  - Immutable values only
  - No business logic

- **Assets** (`assets/`): Static assets
  - Images, fonts, SVG icons

## Component Organization

Components are organized flexibly within the `components/` directory. The structure adapts to project needs:

```
components/
  common/         # Widely reused components (Button, Input, Text)
  forms/          # Form-related components (FormField, FormGroup)
  cards/          # Card components (TransactionCard, BudgetCard)
  lists/          # List components (TransactionList, CategoryList)
  [feature]/      # Feature-specific components (if needed)
  index.ts        # Public API exports
```

**Organization Patterns:**

- **By Type**: `components/buttons/`, `components/forms/`, `components/cards/`
- **By Feature**: `components/transactions/`, `components/budgets/`, `components/categories/`
- **Common/Shared**: `components/common/` for widely reused components

**Principles:**

- Organize by purpose, type, or feature as makes sense
- Prioritize discoverability and logical grouping
- No strict hierarchy or dependency rules between component folders
- Components can import from other components as needed
- Focus on reusability through good design, not enforced structure
- Structure can evolve as the project grows

## Code Organization Principles

### 1. Separation of Concerns

- UI components are presentation-only
- Business logic lives in hooks and services
- Data access is abstracted through services

### 2. Single Responsibility Principle

- Each component/hook/service has one clear purpose
- Functions do one thing well

### 3. Dependency Rule

Dependencies point inward: screens → components → hooks/services → db

- Screens compose components and use hooks/services
- Navigation is used by screens, but screens don't depend on navigation internals
- Services and hooks can be used by any layer
- Database layer (`db/`) is accessed through services, not directly from components
- Utils are shared utilities with no dependencies

### 4. Testability

- Pure functions for business logic
- Dependency injection for services
- Components are easily testable in isolation

### 5. Type Safety

- TypeScript strict mode enabled
- All functions and components are typed
- Shared types in appropriate locations

## Technology Stack

- **Framework**: React Native 0.83+ with New Architecture
- **Language**: TypeScript (strict mode)
- **Database**: RealmJS by MongoDB (local-first, object database)
- **State Management**: To be decided (see ADR-003)
- **Navigation**: To be decided (see ADR-006)
- **Testing**: Jest, React Native Testing Library

## Design Patterns

### 1. Container/Presentation Pattern

- Separate data/logic containers from presentational components
- Improves testability and reusability

### 2. Custom Hooks Pattern

- Encapsulate business logic in reusable hooks
- Examples: `useTransactions`, `useBudgets`, `useAuth`

### 3. Provider Pattern

- Theme provider, Auth provider
- Context for cross-cutting concerns

### 4. Compound Components

- For complex UI patterns (forms, lists)
- Improves API flexibility

### 5. Render Props / HOC

- For cross-cutting functionality
- To be determined based on use case

## References

- [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md)
- [ADR-002: Project Structure](../adr/ADR-002-project-structure.md)
- [React Native Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Design Patterns](https://refine.dev/blog/react-design-patterns/)
