# ADR-002: Project Structure

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture without Atomic Design, we need to define a consistent project structure. This structure must:

- Support the architectural layers defined in ADR-001
- Enable easy navigation and code discovery
- Facilitate team collaboration
- Make testing straightforward
- Scale as the project grows
- Follow React Native and TypeScript best practices

The structure should be intuitive enough that developers can quickly find where to add new code without extensive documentation lookup.

## Considered Options

### Option A: Flat Structure

```
src/
  components.tsx
  screens.tsx
  hooks.ts
  services.ts
  ...
```

- ✅ Minimal nesting
- ❌ Files become unmanageably large
- ❌ No organization for related code
- ❌ Poor scalability

### Option B: Feature-Based Structure

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
  shared/
    components/
    utils/
```

- ✅ Clear feature boundaries
- ✅ Good for large teams
- ❌ Code duplication risk
- ❌ Harder to share common code
- ❌ Overkill for current project scope

### Option C: Layered Structure with Flexible Component Organization (Selected)

```
src/
  components/ (organized by type, feature, or common/shared)
  screens/
  navigation/
  hooks/
  services/
  store/
  db/
  utils/
  theme/
  constants/
  assets/
  localization/
  testUtils/
```

- ✅ Aligns with ADR-001 architecture
- ✅ Clear separation of concerns
- ✅ Easy to locate code by type
- ✅ Promotes reusability
- ✅ Scales well
- ✅ Flexible organization without strict hierarchy
- ❌ Requires discipline to maintain boundaries

## Decision

We will adopt **Option C: Layered Structure with Flexible Component Organization**. This aligns with ADR-001's decision to use Layered Architecture without Atomic Design, providing flexibility in component organization while maintaining clear architectural boundaries.

For detailed folder structure, naming conventions, and implementation guidelines, see the [Project Structure Guide](../guides/project-structure-guide.md).

## Rationale

Option C was selected for the following reasons:

1. **Architectural Alignment**: Directly supports the layered architecture from ADR-001, with each layer having a dedicated directory
2. **Discoverability**: Developers can quickly locate code by its type (component, hook, service, etc.)
3. **Flexibility**: Components can be organized by type, feature, or common/shared as needed, without strict hierarchy
4. **Scalability**: Structure supports growth without requiring major refactoring
5. **Reusability**: Clear separation makes it easy to identify and reuse shared code
6. **Testing**: Co-located tests and mocks make testing straightforward
7. **Team Collaboration**: Consistent structure reduces merge conflicts and onboarding time

## Consequences

### Positive

1. **Discoverability**: Developers can quickly find where code belongs
2. **Maintainability**: Clear separation makes refactoring easier
3. **Scalability**: Structure supports growth without major restructuring
4. **Team Collaboration**: Reduces merge conflicts and onboarding time
5. **Testing**: Test files co-located with source code

### Negative / Trade-offs

1. **File Count**: More files to navigate
   - **Mitigation**: Good IDE support, search functionality, path aliases
2. **Initial Setup**: More boilerplate for new components
   - **Mitigation**: Code snippets/templates, consistent patterns
3. **Discipline Required**: Must follow structure consistently
   - **Mitigation**: Linting rules, code reviews, documentation
4. **Import Paths**: Longer import paths
   - **Mitigation**: Path aliases configured in `tsconfig.json`, index files for clean exports

## When to Revisit

This decision should be reconsidered if:

- Project grows significantly and feature-based organization becomes more beneficial
- Team size increases substantially (10+ developers) and feature boundaries become critical
- Component organization becomes confusing or inconsistent despite guidelines
- Testing strategy changes significantly requiring different file organization
- New architectural patterns emerge that better fit the project's needs

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [Project Structure Guide](../guides/project-structure-guide.md) - Detailed structure implementation guide
- [Layered Architecture Implementation Guide](../guides/layered-architecture-implementation.md) - Architecture implementation details
- [React Native Project Structure](https://reactnative.dev/docs/contributing)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- Project Specification: `fintrack-spec-en.md`
