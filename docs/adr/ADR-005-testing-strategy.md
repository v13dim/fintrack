# ADR-005: Testing Strategy

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to define a comprehensive testing strategy for FinTrack. The application requires testing for:

- **Components**: UI components, screens, forms
- **Hooks**: Custom React hooks with business logic
- **Services**: Business logic services, data operations
- **Utils**: Pure utility functions
- **Contexts**: React Context providers for global UI state
- **Database**: Realm operations (through services)

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture
- **TypeScript**: Strict mode enabled, full type safety in tests
- **Test Coverage**:
  - Overall target: >70%
  - Business logic layer (hooks, services, utils): >80%
- **Test Isolation**: Tests must be isolated, no shared state between tests
- **Mocking Strategy**: Comprehensive mocking to avoid real dependencies (except E2E tests)
- **Performance**:
  - Unit and Integration tests: <30s for full suite
  - E2E tests: Separate execution, no time constraint (infrastructure setup required)
- **Developer Experience**: Clear patterns, good error messages, fast feedback

The testing strategy must support:

- Unit tests for isolated functions, hooks, services
- Component tests for UI components and screens
- Integration tests for feature flows
- E2E tests for critical user paths
- Fast feedback during development
- CI/CD integration

## Considered Options

### Option A: Comprehensive Mocking Strategy (Selected)

A strategy that emphasizes maximum isolation through comprehensive mocking:

- ✅ Maximum test isolation (no real dependencies)
- ✅ Fast test execution (no real network, database, or native modules)
- ✅ Predictable test behavior (no external factors)
- ✅ Easy to test edge cases and error conditions
- ✅ Tests remain stable when dependencies change
- ✅ Clear separation between test and production code
- ❌ More setup required for mocks
- ❌ Mocks may drift from real implementations
- ❌ Requires discipline to maintain mocks

### Option B: Minimal Mocking Strategy

A strategy that uses real implementations where possible:

- ✅ Tests closer to production behavior
- ✅ Less mock maintenance
- ✅ Catches integration issues earlier
- ❌ Slower test execution
- ❌ Tests may be flaky (network, timing)
- ❌ Harder to test error conditions
- ❌ Tests may break when dependencies change
- ❌ Requires real database, network, native modules

### Option C: Hybrid Strategy

A strategy that mocks external dependencies but uses real internal code:

- ✅ Balance between isolation and realism
- ✅ Faster than minimal mocking
- ✅ More realistic than comprehensive mocking
- ❌ Unclear boundaries (what to mock?)
- ❌ Inconsistent patterns across codebase
- ❌ Harder to maintain consistency

## Decision

We will adopt **Option A: Comprehensive Mocking Strategy** with the following principles:

1. **Test Organization**: All tests in `__tests__/` folders co-located with source
2. **Mock Organization**: All mocks in `__mocks__/` folders co-located with source
3. **Shared Test Utils**: Common test utilities in `src/testUtils/`
4. **Global Mocks**: Global mocks in `__mocks__/` at project root
5. **Mock Everything**: Mock all dependencies except the unit under test
6. **No require/requireActual/requireMock**: Use Jest's automatic mocking and manual mocks
7. **Exclusions**: Do not test `src/assets/` and global configuration files

## Rationale

The comprehensive mocking strategy was selected for the following reasons:

1. **Isolation**: Tests are completely isolated from external dependencies, ensuring predictable behavior
2. **Speed**: Tests run fast without real network calls, database operations, or native modules
3. **Reliability**: Tests don't fail due to external factors (network issues, database state)
4. **Error Testing**: Easy to test error conditions and edge cases by controlling mock behavior
5. **Maintainability**: Clear patterns make it easy to write and maintain tests
6. **CI/CD**: Fast, reliable tests are essential for CI/CD pipelines
7. **Developer Experience**: Fast feedback during development improves productivity

While comprehensive mocking requires more setup and maintenance, these trade-offs are acceptable given:

- The need for fast, reliable tests in CI/CD
- The importance of testing error conditions
- The complexity of React Native's native dependencies
- The need for consistent, maintainable test patterns

## Testing Pyramid

Our testing strategy follows the testing pyramid:

```
        /\
       /  \  E2E Tests (3-5 critical paths)
      /____\
     /      \  Integration Tests (feature flows)
    /________\
   /          \  Unit Tests (components, hooks, services, utils)
  /____________\
```

### Unit Tests (Base - Most Tests)

- **Components**: Test rendering, user interactions, props
- **Hooks**: Test logic, state changes, side effects
- **Services**: Test business logic, data transformations
- **Utils**: Test pure functions, edge cases
- **Contexts**: Test context providers and consumers
- **Target Coverage**: >80% for business logic

### Integration Tests (Middle)

- **Feature Flows**: Test complete user flows (e.g., create transaction)
- **Service Integration**: Test services with mocked database
- **Context Integration**: Test context providers with components
- **Target Coverage**: >60% for features

### E2E Tests (Top - Few Tests)

- **Critical Paths**: Test 3-5 most critical user journeys
- **Platform**: Use Detox for React Native E2E testing
- **Target**: 3-5 critical paths
- **No Mocks**: E2E tests use real implementations (database, services, components) to test end-to-end system behavior

## Mocking Principles

1. **Mock All Dependencies**: Mock everything except the unit under test (applies to unit and integration tests only)
2. **E2E Tests**: No mocks - use real implementations to test full system behavior
3. **Co-located Mocks**: Mocks live next to the code they mock
4. **Shared Test Utils**: Common mocking utilities in `testUtils/`
5. **Global Mocks**: Platform-level mocks in root `__mocks__/`
6. **No require/requireActual/requireMock**: Use Jest's automatic mocking
7. **Type Safety**: Mocks maintain TypeScript types
8. **Realistic Mocks**: Mocks should behave like real implementations

## Exclusions

We do not test:

- `src/assets/` - Static assets (images, fonts, SVG)
- Global configuration files (e.g., `index.js`, `App.tsx` root)
- Third-party library internals
- Generated code

## Consequences

### Positive

1. **Fast Tests**: Tests run quickly without real dependencies
2. **Reliable Tests**: Tests don't fail due to external factors
3. **Isolation**: Tests are completely isolated and predictable
4. **Error Testing**: Easy to test error conditions
5. **Maintainability**: Clear patterns make tests easy to maintain
6. **CI/CD**: Fast, reliable tests enable efficient CI/CD
7. **Developer Experience**: Fast feedback improves productivity

### Negative / Trade-offs

1. **Mock Maintenance**: Mocks need to be updated when dependencies change
   - **Mitigation**: Use TypeScript types, keep mocks simple, document mock behavior
2. **Mock Drift**: Mocks may not match real implementations
   - **Mitigation**: Regular review of mocks, integration tests catch drift
3. **Setup Overhead**: More initial setup required for mocks
   - **Mitigation**: Shared test utils, templates, documentation
4. **Less Realistic**: Tests may not catch integration issues
   - **Mitigation**: Integration and E2E tests cover integration scenarios

### Risks and Mitigations

| Risk                    | Impact | Mitigation                                                                |
| ----------------------- | ------ | ------------------------------------------------------------------------- |
| Mock maintenance burden | Medium | Use shared test utils, keep mocks simple, document patterns, code reviews |
| Mock drift              | Medium | Regular mock review, integration tests, type safety, documentation        |
| Test complexity         | Low    | Clear patterns, examples, documentation, code reviews                     |
| Coverage gaps           | Low    | Coverage thresholds, regular reviews, CI enforcement                      |
| Slow test suite         | Low    | Monitor test execution time, optimize slow tests, parallel execution      |

## When to Revisit

This decision should be reconsidered if:

- Test execution time becomes unacceptable despite optimizations
- Mock maintenance becomes unmanageable
- Test reliability issues persist despite comprehensive mocking
- Integration issues are consistently missed by unit tests
- Team consistently struggles with mocking patterns despite training
- A better testing strategy emerges that better fits the project's needs
- Project requirements change significantly (e.g., real-time features, complex integrations)

## Implementation Details

For detailed implementation guidelines (test naming conventions, patterns, examples), see [Testing Strategy Guide](../guides/testing-guide.md).

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-003: State Management](./ADR-003-state-management.md) - State management decision
- [ADR-004: Data Persistence](./ADR-004-data-persistence.md) - Data persistence decision
- [Testing Strategy Guide](../guides/testing-guide.md) - Detailed testing implementation guide
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) - Component testing
- [Jest Documentation](https://jestjs.io/docs/getting-started) - JavaScript testing framework
- [Detox Documentation](https://wix.github.io/Detox/) - E2E testing for React Native
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) - Testing philosophy
- Project Specification: `fintrack-spec-en.md`
