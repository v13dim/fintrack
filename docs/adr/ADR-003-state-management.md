# ADR-003: State Management

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a state management solution for FinTrack. The application requires state management for:

- **Application State**: User authentication status, app settings, UI state (modals, filters)
- **Business Data**: Transactions, categories, budgets (though primary storage is Realm database)
- **Derived State**: Analytics calculations, filtered views, computed values
- **Cross-Component Communication**: Sharing state between screens and components

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Fast state updates (<500ms for transaction entry), minimal re-renders
- **Offline-first**: State must work entirely offline (no cloud sync)
- **Testability**: State management must be easily testable
- **Developer Experience**: Good TypeScript support, clear patterns, debugging tools
- **Team Readiness**: Solution should scale as team grows
- **Learning Value**: As a training project, solution should demonstrate industry-standard patterns

The application needs to handle:

- Complex state updates (transactions, categories, budgets)
- State synchronization with local database (Realm)
- Time-travel debugging for development
- Predictable state updates
- Middleware support (for logging, persistence, etc.)

## Considered Options

### Option A: Redux Toolkit (Selected)

Redux Toolkit (RTK) is the official, opinionated, batteries-included toolset for efficient Redux development. It includes utilities to simplify common Redux use cases.

- ✅ Industry standard, widely adopted
- ✅ Excellent TypeScript support with strong typing
- ✅ Redux DevTools integration (time-travel debugging)
- ✅ Built-in middleware (thunk, RTK Query)
- ✅ Predictable state updates (immutability)
- ✅ Large ecosystem and community
- ✅ Excellent documentation and learning resources
- ✅ Scales well for team development
- ✅ Testable (pure reducers, easy to mock)
- ✅ Redux Toolkit reduces boilerplate significantly
- ✅ Works well with React Native
- ❌ More boilerplate than lighter solutions (even with RTK)
- ❌ Steeper learning curve for beginners
- ❌ Larger bundle size (~13kb gzipped)
- ❌ Requires understanding of Redux concepts (actions, reducers, store)

### Option B: Zustand

Zustand is a small, fast, and scalable state management solution with a minimal API.

- ✅ Very small bundle size (~1kb gzipped)
- ✅ Minimal boilerplate
- ✅ Simple API, easy to learn
- ✅ Good TypeScript support
- ✅ No Provider needed (can be used without context)
- ✅ Works well with React Native
- ❌ Smaller ecosystem and community
- ❌ Less mature than Redux
- ❌ Limited debugging tools compared to Redux
- ❌ May be less familiar to team members
- ❌ Less structured patterns (can lead to inconsistent code)

### Option C: MobX

MobX is a battle-tested library that makes state management simple and scalable by transparently applying functional reactive programming.

- ✅ Very simple API
- ✅ Minimal boilerplate
- ✅ Automatic reactivity
- ✅ Good performance with large state trees
- ✅ Works well with React Native
- ❌ Less predictable (mutable state)
- ❌ Harder to debug (less transparent)
- ❌ Smaller community than Redux
- ❌ TypeScript support is good but not as strong as Redux
- ❌ Less familiar to most React developers
- ❌ May conflict with React's immutable patterns

### Option D: Jotai

Jotai is a primitive and flexible state management library for React built on atomic principles.

- ✅ Very small bundle size (~3kb gzipped)
- ✅ Atomic model (fine-grained reactivity)
- ✅ No Provider needed
- ✅ Good TypeScript support
- ✅ Minimal boilerplate
- ❌ Very new library (less mature)
- ❌ Smaller ecosystem
- ❌ Less familiar patterns (atomic model)
- ❌ Limited debugging tools
- ❌ May be overkill for this project's needs
- ❌ Learning curve for atomic model concepts

### Option E: React Context + useReducer

Using React's built-in Context API with useReducer hook.

- ✅ No external dependencies
- ✅ Built into React
- ✅ Simple for small state
- ✅ TypeScript support
- ❌ Performance issues with frequent updates
- ❌ No built-in debugging tools
- ❌ Can cause unnecessary re-renders
- ❌ Not scalable for complex state
- ❌ No middleware support
- ❌ Requires manual optimization

## Library Evaluation Matrix

| Criterion              | Redux Toolkit   | Zustand      | MobX         | Jotai        | Context + useReducer |
| ---------------------- | --------------- | ------------ | ------------ | ------------ | -------------------- |
| **License**            | MIT ✅          | MIT ✅       | MIT ✅       | MIT ✅       | MIT (built-in) ✅    |
| **Last Release**       | 1 month ✅      | 1 week ✅    | 4 month ✅   | 1 weeks ✅   | N/A (React)          |
| **GitHub Stars**       | 11.2k ✅        | 56.6k ✅     | 28k ✅       | 20.9k ✅     | N/A                  |
| **Bundle Size**        | ~13kb ⚠️        | ~1kb ✅      | ~15kb ⚠️     | ~3kb ✅      | 0kb ✅               |
| **TypeScript Support** | Excellent ✅    | Good ✅      | Good ✅      | Good ✅      | Good ✅              |
| **New Arch Support**   | Yes ✅          | Yes ✅       | Yes ✅       | Yes ✅       | Yes ✅               |
| **Documentation**      | Excellent ✅    | Good ✅      | Good ✅      | Good ✅      | Good ✅              |
| **DevTools**           | Excellent ✅    | Limited ⚠️   | Good ✅      | Limited ⚠️   | None ❌              |
| **Learning Curve**     | Medium ⚠️       | Low ✅       | Medium ⚠️    | Medium ⚠️    | Low ✅               |
| **Team Familiarity**   | High ✅         | Medium ⚠️    | Medium ⚠️    | Low ❌       | High ✅              |
| **Scalability**        | Excellent ✅    | Good ✅      | Excellent ✅ | Good ✅      | Poor ❌              |
| **Testability**        | Excellent ✅    | Good ✅      | Good ✅      | Good ✅      | Good ✅              |
| **Ecosystem**          | Large ✅        | Medium ⚠️    | Medium ⚠️    | Small ❌     | N/A                  |
| **Predictability**     | Excellent ✅    | Good ✅      | Poor ❌      | Good ✅      | Good ✅              |
| **Performance**        | Excellent ✅    | Excellent ✅ | Excellent ✅ | Excellent ✅ | Poor ❌              |
| ---------------------- | --------------- | ------------ | ------------ | ------------ | -------------------- |
| **Decision**           | ✅ **Selected** | ❌           | ❌           | ❌           | ❌                   |

## Decision

We will adopt **Redux Toolkit (RTK)** for state management in FinTrack.

## Rationale

Redux Toolkit was selected for the following reasons:

1. **Industry Standard**: Redux is the most widely adopted state management solution in React/React Native ecosystem, making it valuable for learning and team collaboration
2. **Training Value**: As a training project, Redux provides excellent learning opportunities for industry-standard patterns
3. **TypeScript Excellence**: Redux Toolkit has outstanding TypeScript support with strong typing throughout
4. **Developer Experience**: Redux DevTools provides excellent debugging capabilities with time-travel debugging
5. **Scalability**: Proven to scale well in large applications and teams
6. **Predictability**: Immutable state updates make state changes predictable and easier to reason about
7. **Ecosystem**: Large ecosystem of middleware, tools, and community support
8. **Documentation**: Comprehensive, well-maintained documentation
9. **Team Readiness**: Most React developers are familiar with Redux patterns
10. **Redux Toolkit Benefits**: RTK significantly reduces boilerplate compared to traditional Redux while maintaining all benefits

While Redux Toolkit has a larger bundle size and more boilerplate than lighter solutions, these trade-offs are acceptable given:

- The learning value for a training project
- The need for predictable, testable state management
- The requirement for excellent debugging tools
- The importance of team familiarity and scalability

## Implementation Plan

### Store Structure

```
src/store/
  ├── index.ts              # Store configuration and root reducer
  ├── hooks.ts              # Typed hooks (useAppDispatch, useAppSelector)
  ├── rootReducer.ts        # Root reducer combining all feature reducers
  ├── middleware.ts         # Custom middleware configuration
  ├── slices/
  │   ├── auth/
  │   │   ├── authSlice.ts
  │   │   ├── auth.types.ts
  │   │   └── auth.selectors.ts
  │   ├── transactions/
  │   │   ├── transactionsSlice.ts
  │   │   ├── transactions.types.ts
  │   │   └── transactions.selectors.ts
  │   ├── categories/
  │   │   ├── categoriesSlice.ts
  │   │   ├── categories.types.ts
  │   │   └── categories.selectors.ts
  │   └── budgets/
  │       ├── budgetsSlice.ts
  │       ├── budgets.types.ts
  │       └── budgets.selectors.ts
  └── __tests__/           # Store tests
```

### Key Patterns

1. **Slices**: Use `createSlice` from Redux Toolkit for feature-based state management
2. **Typed Hooks**: Create typed `useAppDispatch` and `useAppSelector` hooks
3. **Async Actions**: Use `createAsyncThunk` for async operations (database operations)
4. **Middleware**: Configure Redux Thunk and Redux DevTools
5. **State Normalization**: Normalize complex nested state where appropriate
6. **Selectors**: Extract selectors into separate files (`*.selectors.ts`) for better organization, reusability, and testability

### Integration with Database

- Redux store will hold in-memory state for UI and derived data
- Realm database remains the source of truth for persistent data
- Services will sync between Redux state and Realm database
- Redux state will be hydrated from Realm on app startup

## Consequences

### Positive

1. **Predictable State**: Immutable state updates make state changes predictable and easier to debug
2. **Developer Tools**: Redux DevTools provides excellent debugging with time-travel
3. **Type Safety**: Strong TypeScript support throughout the Redux flow
4. **Testability**: Pure reducers and actions are easy to test in isolation
5. **Scalability**: Proven patterns that scale well as the application grows
6. **Team Collaboration**: Well-known patterns reduce onboarding time
7. **Learning Value**: Industry-standard solution provides valuable learning experience
8. **Ecosystem**: Large ecosystem of tools, middleware, and community support
9. **Documentation**: Comprehensive documentation and learning resources
10. **Maintainability**: Clear patterns make code easier to maintain

### Negative / Trade-offs

1. **Bundle Size**: Larger bundle size (~13kb gzipped) compared to lighter solutions
   - **Mitigation**: Bundle size is acceptable for the benefits provided. Can optimize later if needed.
2. **Boilerplate**: More boilerplate than lighter solutions (even with RTK)
   - **Mitigation**: Redux Toolkit significantly reduces boilerplate. Use code generation tools if needed.
3. **Learning Curve**: Steeper learning curve for developers new to Redux
   - **Mitigation**: Comprehensive documentation, examples, and team training
4. **Initial Setup**: More initial setup required compared to simpler solutions
   - **Mitigation**: Setup is one-time. Redux Toolkit simplifies setup significantly.
5. **Over-Engineering Risk**: May be over-engineered for very simple state
   - **Mitigation**: Use React local state for truly local component state. Only use Redux for shared state.

### Risks and Mitigations

| Risk                                | Impact | Mitigation                                                                                  |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Over-using Redux for local state    | Medium | Clear guidelines: use Redux only for shared state, local state for component-specific state |
| Boilerplate accumulation            | Low    | Use Redux Toolkit patterns, code generation if needed, regular refactoring                  |
| Performance issues with large state | Low    | Normalize state, use selectors efficiently, memoization where needed                        |
| Team unfamiliarity                  | Low    | Documentation, examples, code reviews, training sessions                                    |
| Bundle size concerns                | Low    | Monitor bundle size, optimize if needed, consider code splitting                            |

## When to Revisit

This decision should be reconsidered if:

- Bundle size becomes a critical concern and lighter solutions are needed
- Team consistently struggles with Redux patterns despite training
- Application state becomes too simple to justify Redux overhead
- Performance issues arise that cannot be solved with Redux optimizations
- A better state management solution emerges that better fits the project's needs
- Project requirements change significantly (e.g., real-time sync, complex offline sync)

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/) - Official Redux Toolkit documentation
- [Redux Toolkit TypeScript Guide](https://redux-toolkit.js.org/usage/usage-with-typescript) - TypeScript integration guide
- [React Redux Documentation](https://react-redux.js.org/) - React bindings for Redux
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - Redux debugging tools
- [Redux Style Guide](https://redux.js.org/style-guide/) - Redux best practices
- [React Native Redux Integration](https://react-redux.js.org/introduction/getting-started) - React Native setup
