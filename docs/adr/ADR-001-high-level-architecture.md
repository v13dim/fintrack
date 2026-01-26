# ADR-001: Architectural Approach

## Status

Accepted

## Context

FinTrack is a personal finance tracking mobile application built with React Native. The project serves as a training exercise to develop skills in architectural decision-making, clean code practices, and production-ready mobile development.

Key requirements and constraints:

- **Platform**: React Native 0.76+ with New Architecture enabled
- **Language**: TypeScript with strict mode
- **Data Privacy**: All data stored locally on device only (no cloud sync)
- **Performance**: Fast transaction entry (<500ms), smooth scrolling (≥55 FPS)
- **Offline-first**: Application must work entirely offline
- **Security**: PIN/biometric authentication, secure local storage
- **Maintainability**: Code must be well-organized, testable, and documented
- **Team Size**: Solo developer initially, but code should be team-ready

The application needs to handle:

- User authentication (PIN/biometrics)
- Transaction CRUD operations
- Category management
- Budget tracking
- Analytics and reporting
- Data export/import

## Considered Options

### Option A: Monolithic Component Architecture

- ✅ Simple to start
- ✅ Fast initial development
- ❌ Difficult to scale
- ❌ Hard to test individual pieces
- ❌ Poor code reusability
- ❌ Violates separation of concerns

### Option B: Feature-Based Architecture

```
src/
  features/
    transactions/
      components/
      hooks/
      services/
      types/
    categories/
      ...
```

- ✅ Clear feature boundaries
- ✅ Good for large teams
- ✅ Features are self-contained
- ❌ Potential code duplication across features
- ❌ May be overkill for a solo project
- ❌ Harder to share common components

### Option C: Layered Architecture with Atomic Design

```
src/
  components/ (Atomic Design: atoms, molecules, organisms)
  screens/
  navigation/
  hooks/
  services/
  store/
  db/
  utils/
  theme/
  constants/
```

- ✅ Clear separation of concerns
- ✅ Reusable component hierarchy
- ✅ Easy to test each layer independently
- ✅ Scales well as project grows
- ✅ Aligns with React Native best practices
- ✅ Component reusability through Atomic Design
- ❌ Requires discipline to maintain boundaries
- ❌ Slightly more initial setup
- ❌ Every new component requires classification
- ❌ Team members need to understand Atomic Design

### Option D: Domain-Driven Design (DDD)

- ✅ Excellent for complex business logic
- ✅ Clear domain boundaries
- ❌ Over-engineered for this project scope
- ❌ Steeper learning curve
- ❌ More ceremony than needed

### Option E: Layered Architecture (without Atomic Design) (Selected)

```
src/
  components/        # All UI components (flexible organization)
  screens/
  navigation/
  contexts/          # React Context providers (Theme, Auth, etc.)
  hooks/
  services/
  store/
  db/
  utils/
  theme/
  constants/
```

- ✅ Clear separation of concerns
- ✅ Simpler mental model - no need to decide atom/molecule/organism
- ✅ Faster component placement decisions
- ✅ Less cognitive overhead
- ✅ Still maintains layered boundaries
- ✅ Easier onboarding for developers unfamiliar with Atomic Design
- ✅ Flexible component organization (can group by feature or type)
- ❌ Less structured component hierarchy
- ❌ May need more discipline to avoid creating overly complex components
- ❌ No enforced dependency rules between component levels

## Decision

We will adopt **Layered Architecture without Atomic Design** (Option E).

## Rationale

After evaluating both approaches, Option E was selected for the following reasons:

1. **Reduced Cognitive Load**: No need to classify components as atoms/molecules/organisms, eliminating decision fatigue when creating new components
2. **Faster Development**: Less time spent on organizational decisions, allowing focus on feature implementation
3. **Flexibility**: Components can be organized by feature, type, or complexity as needed (e.g., `components/common/`, `components/forms/`, `components/cards/`)
4. **Sufficient Structure**: Layered architecture alone provides adequate separation of concerns without the added complexity of Atomic Design
5. **Easier Learning**: Focus on architectural principles rather than component classification patterns
6. **Project Context**: As a solo developer training exercise, the simpler structure better supports learning clean architecture principles

The layered architecture provides all essential benefits:

- Clear separation of concerns (presentation → business logic → data)
- Testability through layer isolation
- Maintainability through organized structure
- Scalability through clear boundaries
- Component reusability through developer discipline and good practices

## Consequences

### Positive

1. **Maintainability**: Clear structure makes it easy to find and modify code. New developers can understand the codebase quickly.
2. **Testability**: Each layer can be tested independently. Business logic is separated from UI.
3. **Reusability**: Flexible component organization allows natural reuse patterns. Shared utilities reduce duplication.
4. **Scalability**: Easy to add new features without restructuring. Clear boundaries prevent coupling.
5. **Team Readiness**: Structure supports multiple developers. Clear conventions reduce conflicts.
6. **Development Speed**: Faster component placement decisions without classification overhead.

### Negative / Trade-offs

1. **Initial Overhead**: More files and folders to navigate. Requires discipline to maintain boundaries. **Mitigation**: Clear documentation and examples (see [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md)).
2. **Potential Over-Engineering**: Some simple features might feel over-structured. **Mitigation**: YAGNI principle - don't create abstractions until needed.
3. **File Navigation**: More files to navigate. **Mitigation**: Good IDE support, clear naming conventions.
4. **Component Organization Decisions**: Need to decide how to organize components (by type, feature, or common). **Mitigation**: Start with simple structure, refactor as patterns emerge.
5. **Less Structured Component Hierarchy**: No enforced dependency rules between component levels. **Mitigation**: Code reviews and documentation to maintain good practices.

### Risks and Mitigations

| Risk                  | Impact | Mitigation                                 |
| --------------------- | ------ | ------------------------------------------ |
| Boundary violations   | Medium | Linting rules, code reviews, documentation |
| Over-abstraction      | Low    | Apply YAGNI, refactor when needed          |
| Inconsistent patterns | Medium | Establish conventions early, use examples  |

## References

- [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md) - Detailed architecture implementation guide
- [React Native Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Design Patterns](https://refine.dev/blog/react-design-patterns/)
- [ADR GitHub](https://adr.github.io/)
- Project Specification: `fintrack-spec-en.md`
- Project PRD: `fintrack-prd-en.md`
