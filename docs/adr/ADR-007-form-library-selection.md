# ADR-007: Form Library Selection

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a form library for FinTrack. The application requires:

- **Transaction forms**: Create and edit transactions with validation
- **Category forms**: Create and edit categories with validation
- **Budget forms**: Create and edit budgets with validation
- **Form validation**: Comprehensive validation with error handling
- **TypeScript support**: Full type safety required

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture enabled
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Fast validation, minimal re-renders
- **Offline-first**: Library must work offline
- **Maintainability**: Active maintenance, good documentation, community support
- **Testability**: Library must be easily mockable for testing
- **Developer Experience**: Good TypeScript support, clear APIs, debugging tools
- **Integration**: Easy integration with React Native components

## Considered Options

### Option A: React Hook Form (Selected)

React Hook Form is a performant, flexible, and extensible forms library with easy-to-use validation.

- ✅ Excellent performance (uncontrolled components by default, minimal re-renders)
- ✅ Small bundle size (~9kb)
- ✅ Excellent TypeScript support
- ✅ Flexible validation (built-in, Zod, custom) - we use Zod for validation
- ✅ Large community and ecosystem
- ✅ Great documentation
- ✅ Easy to test
- ✅ Works well with React Native
- ❌ Requires understanding of uncontrolled components (default) or Controller wrapper for controlled components
- ❌ Less opinionated (more setup)

**Note**: React Hook Form supports multiple validation approaches:

- Built-in validation rules (no dependencies required)
- Zod schema validation (requires `@hookform/resolvers` and `zod` peer dependencies)
- Custom validation functions (no dependencies required)

### Option B: Formik

Formik is a popular form library that makes form handling easy and straightforward.

- ✅ Simple API, easy to learn
- ✅ Good documentation
- ✅ Large community
- ✅ Good TypeScript support
- ❌ Larger bundle size (~15kb)
- ❌ More re-renders (controlled components)
- ❌ Performance concerns with large forms
- ❌ Less performant than React Hook Form

## Evaluation Matrix

| Criterion                | React Hook Form | Formik        |
| ------------------------ | --------------- | ------------- |
| **License**              | MIT ✅          | Apache 2.0 ✅ |
| **Last Release**         | 1 week ✅       | 1 month ✅    |
| **GitHub Stars**         | 40.5k ✅        | 35.2k ✅      |
| **Bundle Size**          | ~9kb ✅         | ~15kb ⚠️      |
| **TypeScript Support**   | Excellent ✅    | Good ✅       |
| **New Arch Support**     | Yes ✅          | Yes ✅        |
| **Documentation**        | Excellent ✅    | Good ✅       |
| **Performance**          | Excellent ✅    | Good ⚠️       |
| **Validation**           | Excellent ✅    | Good ✅       |
| **Learning Curve**       | Medium ⚠️       | Low ✅        |
| **Community**            | Large ✅        | Large ✅      |
| **Maintenance**          | Very Active ✅  | Active ✅     |
| **React Native Support** | Excellent ✅    | Good ✅       |
| **Testability**          | Excellent ✅    | Good ✅       |
| **Decision**             | ✅ **Selected** | ❌            |

## Decision

We will adopt **React Hook Form** as the form library for FinTrack.

## Rationale

React Hook Form was selected for the following reasons:

1. **Performance**: Excellent performance with uncontrolled components by default, resulting in minimal re-renders - crucial for mobile applications
2. **Bundle Size**: Small bundle size (~9kb) compared to alternatives
3. **TypeScript Support**: Excellent TypeScript support ensures type safety
4. **Flexible Validation**: Supports multiple validation approaches (built-in, Zod, custom) without forcing dependencies
5. **React Native Support**: Works excellently with React Native components
6. **Community**: Large community with extensive ecosystem
7. **Testability**: Easy to test and mock
8. **Active Maintenance**: Very actively maintained with excellent documentation

While React Hook Form requires understanding of uncontrolled components (or Controller wrapper for controlled components) and is less opinionated (requiring more setup), the performance benefits and flexibility justify the trade-off for a mobile application with multiple forms.

## Consequences

### Positive

1. **Performance**: Minimal re-renders ensure fast, responsive forms
2. **Type Safety**: Excellent TypeScript support ensures type safety
3. **Flexibility**: Multiple validation approaches without forcing dependencies
4. **Bundle Size**: Small bundle size minimizes impact on app size
5. **React Native**: Excellent React Native support and integration
6. **Testability**: Easy to test and mock for unit tests
7. **Maintenance**: Very actively maintained with excellent documentation

### Negative / Trade-offs

1. **Learning Curve**: Requires understanding of uncontrolled components or Controller wrapper
   - **Mitigation**: Documentation, examples, team training
2. **Setup**: Less opinionated, requiring more initial setup
   - **Mitigation**: Create reusable form patterns and utilities
3. **Validation Dependencies**: Zod validation requires peer dependencies (optional)
   - **Mitigation**: Use built-in or custom validation when dependencies are not desired

### Risks and Mitigations

| Risk                    | Impact | Mitigation                                                          |
| ----------------------- | ------ | ------------------------------------------------------------------- |
| Learning curve          | Low    | Documentation, examples, code reviews, training sessions            |
| Setup complexity        | Low    | Create reusable form patterns, utilities, and examples              |
| Validation dependencies | Low    | Use built-in or custom validation when dependencies are not desired |
| Library maintenance     | Low    | Monitor library updates, have migration plan, consider alternatives |

## When to Revisit

This decision should be reconsidered if:

- Performance issues arise that cannot be solved
- Library becomes unmaintained or deprecated
- Better alternatives emerge that better fit the project's needs
- Project requirements change significantly (e.g., complex dynamic forms, real-time validation)
- Team consistently struggles with React Hook Form despite training
- Bundle size becomes a critical concern (unlikely given small size)

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-006: Chart Library Selection](./ADR-006-chart-library-selection.md) - Chart library decision
- [ADR-008: Splash Screen Library Selection](./ADR-008-splash-screen-library-selection.md) - Splash screen library decision
- [Form Library Implementation Guide](../guides/form-library-implementation-guide.md) - Detailed implementation guide
- [React Hook Form Documentation](https://react-hook-form.com/) - React Hook Form docs
- [Formik Documentation](https://formik.org/) - Alternative forms library
- Project Specification: `fintrack-spec-en.md`
