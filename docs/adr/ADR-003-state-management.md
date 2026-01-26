# ADR-003: State Management

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a state management solution for FinTrack.

After careful analysis, we identified that FinTrack's state management needs are relatively simple:

- **Business Data**: Transactions, categories, budgets (stored in Realm database)
- **Application State**: User authentication status, app settings
- **UI State**: Modals, filters, form inputs
- **Derived State**: Analytics calculations, filtered views

Key requirements:

- **Performance**: Fast state updates (<500ms for transaction entry), minimal re-renders
- **Offline-first**: State must work entirely offline (no cloud sync)
- **Testability**: State management must be easily testable
- **Simplicity**: Prefer built-in solutions over external dependencies when possible

## Considered Options

### Option A: React Context (Selected)

Using React's built-in Context API for global UI state and Realm hooks for business data.

- ✅ No external dependencies for state management
- ✅ Built into React
- ✅ Realm hooks provide automatic reactivity
- ✅ Simple mental model
- ✅ Excellent TypeScript support
- ✅ No synchronization issues (Realm is source of truth)
- ✅ Minimal bundle size impact
- ✅ Easy to test
- ❌ No built-in debugging tools (but React DevTools works)
- ❌ Context can cause re-renders if not optimized

### Option B: Redux Toolkit

Redux Toolkit (RTK) is the official, opinionated toolset for Redux development.

- ✅ Industry standard, widely adopted
- ✅ Excellent TypeScript support
- ✅ Redux DevTools integration
- ✅ Predictable state updates
- ✅ Large ecosystem
- ❌ More boilerplate than needed
- ❌ Larger bundle size (~13kb gzipped)
- ❌ Requires synchronization with Realm (complexity)
- ❌ Over-engineered for this application's needs
- ❌ Steeper learning curve

### Option C: Zustand

Zustand is a small, fast state management solution.

- ✅ Very small bundle size (~1kb gzipped)
- ✅ Minimal boilerplate
- ✅ Simple API
- ❌ Still requires synchronization with Realm
- ❌ Not needed for this application's scope
- ❌ Limited debugging tools

### Option D: MobX

MobX is a battle-tested reactive state management library.

- ✅ Automatic reactivity
- ✅ Simple API
- ❌ Less predictable (mutable state)
- ❌ Harder to debug
- ❌ Conflicts with Realm's reactivity model
- ❌ Not needed for this application

### Option E: Jotai

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

## Library Evaluation Matrix

| Criterion              | React Context     | Redux Toolkit | Zustand      | MobX         | Jotai        |
| ---------------------- | ----------------- | ------------- | ------------ | ------------ | ------------ |
| **License**            | MIT (built-in) ✅ | MIT ✅        | MIT ✅       | MIT ✅       | MIT ✅       |
| **Last Release**       | N/A (React)       | 1 month ✅    | 1 week ✅    | 4 months ✅  | 1 week ✅    |
| **GitHub Stars**       | N/A               | 11.2k ✅      | 56.6k ✅     | 28k ✅       | 20.9k ✅     |
| **Bundle Size**        | 0kb ✅            | ~13kb ⚠️      | ~1kb ✅      | ~15kb ⚠️     | ~3kb ✅      |
| **TypeScript Support** | Excellent ✅      | Excellent ✅  | Good ✅      | Good ✅      | Good ✅      |
| **New Arch Support**   | Yes ✅            | Yes ✅        | Yes ✅       | Yes ✅       | Yes ✅       |
| **Documentation**      | Excellent ✅      | Excellent ✅  | Good ✅      | Good ✅      | Good ✅      |
| **DevTools**           | React DevTools ✅ | Excellent ✅  | Limited ⚠️   | Good ✅      | Limited ⚠️   |
| **Learning Curve**     | Low ✅            | Medium ⚠️     | Low ✅       | Medium ⚠️    | Medium ⚠️    |
| **Team Familiarity**   | High ✅           | High ✅       | Medium ⚠️    | Medium ⚠️    | Low ❌       |
| **Scalability**        | Good ✅           | Excellent ✅  | Good ✅      | Excellent ✅ | Good ✅      |
| **Testability**        | Good ✅           | Excellent ✅  | Good ✅      | Good ✅      | Good ✅      |
| **Ecosystem**          | N/A               | Large ✅      | Medium ⚠️    | Medium ⚠️    | Small ❌     |
| **Predictability**     | Good ✅           | Excellent ✅  | Good ✅      | Poor ❌      | Good ✅      |
| **Performance**        | Excellent ✅      | Excellent ✅  | Excellent ✅ | Excellent ✅ | Excellent ✅ |
| ---------------------- | ---------------   | ------------- | ------------ | ------------ | ------------ |
| **Decision**           | ✅ **Selected**   | ❌            | ❌           | ❌           | ❌           |

## Decision

We will **NOT use a global state management library**. Instead, we will use:

1. **Realm Hooks** (`@realm/react`) for all business data (transactions, categories, budgets)
2. **React Context** for global UI state (filters, settings) when needed
3. **Local State** (`useState`, `useReducer`) for component-specific UI state
4. **useMemo** for derived/computed values

## Rationale

This approach was selected for the following reasons:

1. **Realm is Reactive**: Realm database with `@realm/react` provides `useQuery` and `useObject` hooks that automatically update components when data changes. No need for a separate state layer.
2. **Simplicity**: Using built-in React features (Context, useState) reduces complexity and learning curve.
3. **No Synchronization Issues**: Realm is the single source of truth. No need to sync between Redux and Realm, eliminating a major source of bugs.
4. **Bundle Size**: No additional dependencies for state management reduces bundle size (~13kb saved vs Redux).
5. **Sufficient for Requirements**: The application's state management needs are simple enough that Context + Realm hooks handle all cases. We don't need:
   - Optimistic updates with rollback
   - Undo/redo functionality
   - Complex state synchronization
   - Time-travel debugging
   - Middleware for logging/analytics
6. **YAGNI Principle**: We don't need the complexity of Redux until we actually need it.

## Consequences

### Positive

1. **Simplicity**: No complex state management library to learn or maintain
2. **Performance**: Realm hooks are optimized, Context can be optimized by splitting
3. **Bundle Size**: No additional dependencies (~13kb saved vs Redux)
4. **No Synchronization Issues**: Realm is single source of truth
5. **Easier Testing**: Testing hooks and Context is straightforward
6. **Type Safety**: Full TypeScript support with Realm and React
7. **Developer Experience**: Simpler mental model, less boilerplate

### Negative / Trade-offs

1. **No Time-Travel Debugging**: No Redux DevTools

   - **Mitigation**: React DevTools provides component inspection. Realm has its own debugging tools.

2. **Context Re-renders**: Context can cause unnecessary re-renders if not optimized

   - **Mitigation**: Split contexts by concern. Use `useMemo` for context values. Only put frequently changing state in Context when necessary.

3. **Less Structured Patterns**: No enforced patterns like Redux slices

   - **Mitigation**: Establish clear conventions in documentation. Code reviews ensure consistency.

4. **Learning Curve for Realm**: Team needs to learn Realm hooks

   - **Mitigation**: Realm hooks are simple and well-documented. Similar to React hooks.

### Risks and Mitigations

| Risk                          | Impact | Mitigation                                                                                    |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Context causing re-renders    | Medium | Split contexts by concern, use useMemo for context values, only use Context when truly needed |
| Over-using Context            | Low    | Clear guidelines: use Context only for global UI state, use local state for component state   |
| Realm hooks performance       | Low    | Realm is optimized for performance. Use filtered queries efficiently.                         |
| Team unfamiliarity with Realm | Low    | Documentation, examples, code reviews                                                         |
| Need for global state later   | Low    | Can add Redux/Zustand later if truly needed. YAGNI principle - don't add until needed.        |

## When to Revisit

This decision should be reconsidered if:

- Application requirements change significantly and we need:
  - Optimistic updates with rollback
  - Undo/redo functionality
  - Complex state synchronization
  - Time-travel debugging becomes critical
  - Middleware for logging/analytics becomes necessary
- Context performance becomes a bottleneck that can't be optimized
- Team consistently struggles with the current approach
- Application grows significantly and state management becomes complex

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-004: Data Persistence](./ADR-004-data-persistence.md) - Realm database decision
- [State Management Implementation Guide](../guides/state-management-implementation-guide.md) - Detailed implementation guide
- [Realm React Hooks Documentation](https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/) - Realm React hooks
- [React Context API](https://react.dev/reference/react/useContext) - React Context documentation
