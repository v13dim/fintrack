# CI/CD Best Practices for Mobile

This document describes best practices for CI/CD in mobile (React Native) development. It supports ADR-007 and the Phase 2 pipeline: PR → Lint → Type Check → Unit Tests → Build; Main → E2E → Build Release → Firebase App Distribution.

## Table of Contents

- [Pipeline Speed](#pipeline-speed)
- [Determinism and Reproducibility](#determinism-and-reproducibility)
- [Security and Secrets](#security-and-secrets)
- [Quality Gates](#quality-gates)
- [Artifacts and Release](#artifacts-and-release)
- [Notifications and Visibility](#notifications-and-visibility)
- [Documentation and Maintainability](#documentation-and-maintainability)
- [Resource Efficiency](#resource-efficiency)

## Pipeline Speed

- **Cache aggressively**: Cache `node_modules`, Gradle (`~/.gradle/caches`), CocoaPods, and (where useful) Xcode derived data. In GitHub Actions use `actions/cache` with stable keys (e.g. lockfile hash).
- **Split fast vs slow**: Run lint, typecheck, and unit tests first (fast). Run full build and E2E only when needed (e.g. on main or when paths change).
- **Parallelize**: Run independent jobs in parallel (e.g. Android build and iOS build; lint and tests).
- **Avoid full release on every commit**: Build release and distribute (e.g. Firebase) only on main/release branches or tags, not on every PR.

## Determinism and Reproducibility

- **Pin versions**: Use fixed Node (e.g. `.nvmrc`), JDK, Ruby (for Fastlane), Android SDK/build-tools, and Xcode version on macOS runners. Same versions locally and in CI.
- **Lockfiles**: Commit `package-lock.json` / `yarn.lock` and use them in CI for installs. Use Gradle wrapper and lock CocoaPods where possible.
- **Single source of truth**: One config (e.g. one workflow file or shared steps) so local “equivalent” commands match CI (e.g. same lint/test/build commands).

## Security and Secrets

- **No secrets in code**: Store keystores, certs, API keys, and Firebase config only in CI secrets (e.g. GitHub Secrets, environment variables). Never commit them.
- **Least privilege**: Restrict which branches or environments can use which secrets (e.g. production signing only from main).
- **Signing in CI**: Use CI secrets to provide keystore and provisioning profiles; document the process in the Certificate Management Guide.

## Quality Gates

- **Block merge on failure**: PR must pass lint, typecheck, and unit tests before merge. Enforce via branch protection (required status checks).
- **Consistent tooling**: Use same ESLint, Prettier, and TypeScript config in CI as locally. Run format check in CI (e.g. `prettier --check`).
- **Quality Gate (e.g. Sonar)**: Integrate SonarQube/SonarCloud and fail the pipeline if Quality Gate fails; do not merge when gate is red.

## Artifacts and Release

- **Keep only what’s needed**: Save built AAB/APK and IPA only for the branches you care about (e.g. main, release), with retention limits.
- **Naming**: Use predictable names (version, build number, branch) so artifacts are easy to find.
- **Distribution**: Use Firebase App Distribution (or similar) only after E2E pass and from a defined branch (e.g. main), as specified in the pipeline and ADR.

## Notifications and Visibility

- **Status in PR**: Ensure CI status appears on each PR (e.g. GitHub commit status). Consider a README badge for main branch.
- **Failures**: Optionally notify (e.g. Slack, email) on failure so the team can react quickly; avoid noise (e.g. only for main or after first failure).

## Documentation and Maintainability

- **Run locally like CI**: Document how to run the same steps locally (lint, test, build) so developers can reproduce CI.
- **Certificate and signing**: Maintain a Certificate Management Guide (keystore, profiles, rotation) and reference it from ADR and runbooks.
- **ADR**: Record the chosen CI/CD platform and main pipeline decisions in ADR-007; link to this document and the platforms comparison.

## Resource Efficiency

- **Cancel outdated runs**: On push, cancel in-progress workflows for older commits (e.g. GitHub Actions `concurrency` with `cancel-in-progress`) to save minutes.
- **Path filters**: Run heavy jobs (e.g. E2E, full build) only when relevant paths change (e.g. `paths` in workflow) where supported and maintainable.

---

These practices apply regardless of the specific platform; for FinTrack they are implemented with **GitHub Actions** as per [ADR-007: CI/CD Platform](../adr/ADR-007-ci-cd-platform.md). See also [CI/CD Platforms Comparison](./ci-cd-platforms-comparison.md).
