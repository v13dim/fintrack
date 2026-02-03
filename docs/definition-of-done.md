# Definition of Done (DoD)

This document defines the criteria that must be met for a User Story or task to be considered complete in the FinTrack project.

## Purpose

The Definition of Done ensures:

- **Consistency**: All tasks meet the same quality standards
- **Transparency**: Clear understanding of what "done" means
- **Quality**: Prevents incomplete work from being marked as finished
- **Team Alignment**: Everyone understands completion criteria

## Checklist

A User Story or task is considered **Done** when all of the following criteria are met:

### 1. Code Quality

- [ ] **No TypeScript errors**: All TypeScript compilation errors resolved
- [ ] **Linter clean**: ESLint passes with no errors or warnings
- [ ] **Code formatted**: Code follows Prettier formatting rules
- [ ] **Type safety**: All code is properly typed (strict mode enabled)

### 2. Testing

- [ ] **Unit tests passing**: All unit tests pass (components, hooks, services, utils)
- [ ] **Integration tests** (if applicable): Integration tests pass for feature flows
- [ ] **Test coverage**: New code meets coverage thresholds (see [ADR-005: Testing Strategy](./adr/ADR-005-testing-strategy.md))
  - Overall: >70%
  - Business logic (hooks, services, utils): >80%
- [ ] **Tests written**: Tests are written for all new functionality

### 3. Manual Testing

- [ ] **Manual smoke test on iOS**: Feature works correctly on iOS device/simulator
- [ ] **Manual smoke test on Android**: Feature works correctly on Android device/emulator
- [ ] **User flow verified**: Complete user flow tested end-to-end
- [ ] **Edge cases tested**: Error scenarios and edge cases verified

### 4. Code Review

- [ ] **Self-review completed**: Code reviewed by author before submission
- [ ] **Architecture compliance**: Code follows layered architecture (see [ADR-001](./adr/ADR-001-high-level-architecture.md))
- [ ] **Naming conventions**: Follows project naming conventions (see [ADR-002](./adr/ADR-002-project-structure.md))
- [ ] **No hardcoded values**: Uses constants, theme, and localization

### 5. Documentation

- [ ] **Code documented**: Complex logic has inline comments
- [ ] **API documented**: Public APIs have JSDoc comments (if applicable)
- [ ] **README updated**: README updated if project setup changed
- [ ] **ADR updated**: ADR documents updated if architectural decisions changed

### 6. Integration

- [ ] **CI/CD passing**: All CI/CD pipeline checks pass
- [ ] **No merge conflicts**: Branch is up-to-date with main branch
- [ ] **Dependencies updated**: New dependencies added to `package.json` (if applicable)
- [ ] **Build successful**: Project builds successfully on both platforms

### 7. Performance

- [ ] **Performance acceptable**: Feature meets performance requirements (see [PRD](../fintrack-prd-en.md))
  - Transaction entry: <500ms
  - List loading: <300ms
  - Scroll FPS: ≥55 FPS
- [ ] **No memory leaks**: No obvious memory leaks introduced
- [ ] **Bundle size**: Bundle size impact is acceptable

### 8. Accessibility

- [ ] **Accessibility labels**: Interactive elements have accessibility labels (if applicable)
- [ ] **Touch targets**: Touch targets meet minimum size (44x44 pt)
- [ ] **Screen reader**: Feature works with screen reader (if applicable)

### 9. Security

- [ ] **No sensitive data in logs**: No sensitive data logged in production
- [ ] **Secure storage**: Sensitive data stored in secure storage (Keychain/Keystore)
- [ ] **Input validation**: User inputs are validated and sanitized

### 10. Platform Compatibility

- [ ] **iOS compatibility**: Feature works on iOS 14+
- [ ] **Android compatibility**: Feature works on Android API 21+
- [ ] **New Architecture**: Feature works with React Native New Architecture

## Special Cases

### Infrastructure Tasks

For infrastructure tasks (CI/CD, tooling, setup), the following additional criteria apply:

- [ ] **Documentation updated**: Setup/configuration documented
- [ ] **Team notified**: Team informed of changes (if applicable)
- [ ] **Verification**: Infrastructure changes verified in CI/CD

### Bug Fixes

For bug fixes, the following additional criteria apply:

- [ ] **Root cause identified**: Root cause of bug documented
- [ ] **Regression test**: Test added to prevent regression
- [ ] **Bug verified fixed**: Bug verified as fixed on both platforms

### Refactoring

For refactoring tasks, the following additional criteria apply:

- [ ] **Functionality preserved**: All existing functionality works after refactoring
- [ ] **Tests updated**: Tests updated to reflect refactored code
- [ ] **No performance regression**: Performance not degraded

## Definition of Done Levels

### Story Level (User Story)

A User Story is **Done** when:

- All checklist items above are met
- Feature is fully implemented and tested
- Feature works on both iOS and Android
- All acceptance criteria from Product Backlog are met

### Sprint Level

A Sprint is **Done** when:

- All User Stories in the sprint meet Definition of Done
- Sprint goals are achieved
- No critical bugs remain
- Demo-ready state achieved

### Release Level

A Release is **Done** when:

- All P0 User Stories completed
- All critical bugs fixed
- Performance requirements met
- Security audit passed
- Documentation complete
- Production deployment successful

## Exceptions

In exceptional circumstances, a task may be marked as **Done** with exceptions if:

- Exception is documented with rationale
- Exception is approved by team/project lead
- Plan exists to address exception in future sprint

## References

- [ADR-001: Architectural Approach](./adr/ADR-001-high-level-architecture.md) - Architecture guidelines
- [ADR-002: Project Structure](./adr/ADR-002-project-structure.md) - Project structure and naming conventions
- [ADR-005: Testing Strategy](./adr/ADR-005-testing-strategy.md) - Testing requirements and coverage
- [Product Backlog](./product-backlog.md) - User Stories and acceptance criteria
- [Estimation](./estimation.md) - Project estimation and roadmap
