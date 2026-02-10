# FinTrack - C4 Architecture Diagrams

This document contains C4 model diagrams for the FinTrack personal finance tracking application. The C4 model provides different levels of abstraction to understand the system architecture.

## Diagram Levels

1. **Context Diagram (Level 1)**: System and its users
2. **Container Diagram (Level 2)**: High-level technical building blocks
3. **Component Diagram (Level 3)**: Components within a container

---

## Level 1: System Context Diagram

Shows the FinTrack system and its relationships with users and external systems.

```mermaid
C4Context
    title System Context Diagram - FinTrack

    Person(user, "User", "An adult (25-45 years old) who wants to track personal finances")

    System(fintrack, "FinTrack", "Personal finance tracking mobile application")

    System_Ext(device, "Mobile Device", "iOS or Android device with local storage")

    System_Ext(biometric, "Biometric Auth", "Face ID / Touch ID / Fingerprint")

    System_Ext(share, "Share Sheet", "System share sheet for exporting data")

    Rel(user, fintrack, "Uses", "Tracks income/expenses, manages budgets, views analytics")
    Rel(fintrack, device, "Stores data on", "All data stored locally")
    Rel(fintrack, biometric, "Uses", "For secure authentication")
    Rel(fintrack, share, "Exports via", "CSV export, backup files")

    UpdateElementStyle(user, $bgColor="#4CAF50", $fontColor="#FFFFFF")
    UpdateElementStyle(fintrack, $bgColor="#2196F3", $fontColor="#FFFFFF")
```

**Key Points:**

- FinTrack is a standalone mobile application with no cloud dependencies
- All data is stored locally on the device
- Uses system biometric authentication APIs
- Exports data via system share sheet

---

## Level 2: Container Diagram

Shows the high-level technical building blocks (containers) that make up the FinTrack application.

```mermaid
C4Container
    title Container Diagram - FinTrack Mobile Application

    Person(user, "User", "Personal finance tracker")

    Container_Boundary(mobile, "FinTrack Mobile App") {
        ContainerDb(local_db, "Realm Database", "RealmJS by MongoDB", "Stores all application data locally")
        Container(mobile_app, "React Native App", "React Native 0.83+ with New Architecture", "Provides UI and user interactions")
        Container(secure_storage, "Secure Storage", "Keychain (iOS) / Keystore (Android)", "Stores PIN and sensitive data")
    }

    System_Ext(biometric_api, "Biometric API", "iOS Face ID / Android Fingerprint")
    System_Ext(file_system, "File System", "iOS / Android file system")

    Rel(user, mobile_app, "Interacts with", "Touch, gestures")
    Rel(mobile_app, local_db, "Reads/Writes", "Transactions, Categories, Budgets")
    Rel(mobile_app, secure_storage, "Reads/Writes", "PIN, authentication tokens")
    Rel(mobile_app, biometric_api, "Uses", "Biometric authentication")
    Rel(mobile_app, file_system, "Exports to", "CSV files, backup JSON")

    UpdateElementStyle(user, $bgColor="#4CAF50", $fontColor="#FFFFFF")
    UpdateElementStyle(mobile_app, $bgColor="#2196F3", $fontColor="#FFFFFF")
    UpdateElementStyle(local_db, $bgColor="#FF9800", $fontColor="#FFFFFF")
    UpdateElementStyle(secure_storage, $bgColor="#9C27B0", $fontColor="#FFFFFF")
```

**Key Containers:**

- **React Native App**: Main application container with UI and business logic
- **Realm Database**: Local-first database for all application data
- **Secure Storage**: System-provided secure storage for authentication credentials

---

## Level 3: Component Diagram - React Native App

Shows the components within the React Native application container, organized by architectural layers.

```mermaid
C4Component
    title Component Diagram - React Native Application

    Container(mobile_app, "React Native App", "React Native 0.83+", "Main application container")

    Component(navigation, "Navigation", "React Navigation", "Navigation configuration")
    Component(screens, "Screens", "React Native", "Screen-level components")
    Component(hooks, "Custom Hooks", "React Hooks", "Business logic hooks")
    Component(components, "UI Components", "React Native", "Reusable presentation components")
    Component(utils, "Utilities", "TypeScript", "Pure utility functions")
    System_Ext(biometric_api, "Biometric API", "iOS Face ID / Android")
    Component(services, "Services", "TypeScript", "Business logic services")
    Component(assets, "Assets", "Static", "Images, fonts, SVG")
    Component(theme, "Theme", "TypeScript", "Design tokens")
    Component(db, "Database Layer", "RealmJS", "Database schemas and queries")
    Container(secure_storage, "Secure Storage", "Keychain/Keystore", "Stores PIN")
    Component(constants, "Constants", "TypeScript", "Application constants")
    ContainerDb(local_db, "Realm Database", "RealmJS", "Stores all data locally")
    Component(contexts, "Contexts", "React Context", "Global UI state")
    Component(localization, "Localization", "i18n", "Translations")


    Rel(screens, components, "Uses")
    Rel(screens, hooks, "Uses")
    Rel(screens, contexts, "Uses", "Global UI state (filters, settings)")
    Rel(navigation, screens, "Uses")
    Rel(components, theme, "Uses")
    Rel(components, constants, "Uses")
    Rel(components, utils, "Uses")
    Rel(components, assets, "Uses")
    Rel(components, contexts, "Uses", "Optional (prefer props)")
    Rel(hooks, services, "Uses")
    Rel(hooks, contexts, "Uses", "Combine with Realm data")
    Rel(services, db, "Uses")
    Rel(services, secure_storage, "Uses")
    Rel(hooks, biometric_api, "Uses")
    Rel(db, local_db, "Reads/Writes")
```

**Key Components:**

### Presentation Layer

- **Screens**: Screen-level components that compose UI and use hooks
- **Components**: Pure presentation components with zero dependencies on business logic
- **Navigation**: Navigation configuration

### Business Logic Layer

- **Hooks**: Custom React hooks encapsulating business logic (consumed only by screens)
- **Services**: Business logic services handling data operations

### Data Layer

- **State Management**: React Context for global UI state, Realm hooks for business data (see ADR-003)
- **Database Layer**: Realm schemas, models, and queries

### Infrastructure Layer

- **Utilities**: Pure utility functions
- **Theme**: Design tokens
- **Constants**: Application constants
- **Assets**: Static assets
- **Localization**: Translations

---

**Note**: For detailed component specifications, see [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md).

---

## Data Flow

For detailed data flow diagrams and sequence diagrams of key user flows, see [Data Flow Diagrams](./data-flow.md).

---

## Technology Stack

| Layer                | Technology                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Framework**        | React Native 0.83+ with New Architecture                                                                                |
| **Language**         | TypeScript (strict mode)                                                                                                |
| **Database**         | RealmJS by MongoDB                                                                                                      |
| **Navigation**       | React Navigation (`@react-navigation/native` with `@react-navigation/native-stack` and `@react-navigation/bottom-tabs`) |
| **State Management** | React Context + Realm hooks (`@realm/react`) - see ADR-003                                                              |
| **Testing**          | Jest, React Native Testing Library                                                                                      |
| **Crash Reporting**  | Sentry                                                                                                                  |
| **CI/CD**            | GitHub Actions                                                                                                          |

---

## Key Architectural Principles

1. **Layered Architecture**: Clear separation between Presentation, Business Logic, Data, and Infrastructure layers
2. **Dependency Rule**: Dependencies point inward - screens → components → hooks/services → db
3. **Zero Dependencies for Components**: Components have zero dependencies on business logic (hooks, services)
4. **Hooks Only in Screens**: Hooks are consumed only by screens, never by components
5. **Offline-First**: All data stored locally, no cloud dependencies
6. **Security**: PIN and biometric authentication, secure local storage

---

## References

- [ADR-001: Architectural Approach](../adr/ADR-001-high-level-architecture.md)
- [ADR-002: Project Structure](../adr/ADR-002-project-structure.md)
- [ADR-003: State Management](../adr/ADR-003-state-management.md)
- [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md)
- [C4 Model](https://c4model.com/)
