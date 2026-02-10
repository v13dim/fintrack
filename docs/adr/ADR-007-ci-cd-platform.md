# ADR-007: CI/CD Platform

## Status

Accepted

## Context

Following Phase 2 of the FinTrack specification, we need to select a CI/CD platform to implement the pipeline:

```
PR → Lint → Type Check → Unit Tests → Build
                                        ↓
Main → + E2E Tests → Build Release → Firebase App Distribution
```

Key requirements and constraints:

- **Repository**: Hosted on GitHub
- **Stack**: React Native 0.83+ (TypeScript, Jest, ESLint, Prettier)
- **Target flow**: PR checks (lint, typecheck, unit tests, build); main branch adds E2E, release build, Firebase App Distribution
- **Cost**: Prefer free or low-cost tier for training/small team
- **Mobile specifics**: Node, JDK, Android SDK, Xcode (for iOS) — caching and setup matter for build speed
- **Deliverables**: Working pipeline, documentation, alignment with spec (Phase 2)

We need a single platform that supports the full pipeline, integrates with GitHub, and is maintainable for a React Native project.

## Considered Options

### Option A: GitHub Actions (Selected)

GitHub Actions is the native CI/CD solution for GitHub repositories. Workflows are defined in YAML under `.github/workflows/`.

- ✅ Native integration with GitHub (same ecosystem, no extra service)
- ✅ Spec explicitly references "CI/CD Pipeline (GitHub Actions)"
- ✅ Free tier: 2000 min/month for private repos; unlimited for public
- ✅ Config as code in repo (`.github/workflows/`)
- ✅ Secrets, environments, matrix builds supported
- ✅ Large marketplace of actions (lint, test, build, deploy)
- ✅ Good documentation and community for React Native
- ❌ Mobile setup (Node, JDK, Xcode, cache) must be configured manually
- ❌ Cold starts can slow first runs; caching is important
- ❌ No built-in mobile-specific steps (unlike Bitrise)

### Option B: GitLab CI

GitLab CI/CD is GitLab's built-in CI. Can be used with GitHub via GitLab.com mirror or self-hosted runner.

- ✅ Powerful pipeline model (stages, DAG, matrix)
- ✅ Self-hosted option (full control, no minute limits)
- ✅ Good caching and artifacts
- ❌ Repository is on GitHub — would require mirror or moving to GitLab
- ❌ Extra tool and context for a GitHub-centric project
- ❌ Not aligned with spec (spec names GitHub Actions)

### Option C: Bitrise

Bitrise is a CI/CD platform focused on mobile (iOS, Android, React Native, Flutter).

- ✅ Mobile-first: ready-made steps for RN, CocoaPods, Gradle, code signing, Firebase
- ✅ Fast mobile builds (optimized stacks, caching)
- ✅ Good documentation for React Native
- ❌ Separate service and billing; free tier limited
- ❌ Another tool to learn and maintain
- ❌ Spec specifies GitHub Actions; would require explicit change of decision
- ❌ Less flexibility for non-mobile steps if needed later

### Option D: CircleCI

CircleCI provides cloud and self-hosted CI with strong caching and orbs (reusable config).

- ✅ Fast builds, good cache, orbs for React Native
- ✅ 6000 min/month on free plan
- ✅ GitHub integration
- ❌ Separate service and billing
- ❌ Spec specifies GitHub Actions
- ❌ Additional platform to maintain

## Evaluation Matrix

| Criterion                | GitHub Actions                                        | GitLab CI  | Bitrise    | CircleCI |
| ------------------------ | ----------------------------------------------------- | ---------- | ---------- | -------- |
| **Spec alignment**       | ✅ Explicit                                           | ❌         | ❌         | ❌       |
| **GitHub integration**   | ✅ Native                                             | ⚠️ Mirror  | ✅         | ✅       |
| **Config in repo**       | ✅                                                    | ✅         | ✅         | ✅       |
| **Free tier (public)**   | ✅ Generous                                           | ⚠️ Limited | ⚠️ Limited | ✅       |
| **React Native support** | ✅ Manual                                             | ✅ Manual  | ✅ Ready   | ✅ Orbs  |
| **Setup effort**         | Medium                                                | High\*     | Low        | Medium   |
| **Single ecosystem**     | ✅                                                    | ❌         | ❌         | ❌       |
| **Firebase / deploy**    | ✅ Scripts                                            | ✅         | ✅ Steps   | ✅       |
| **Documentation**        | [Research](../research/ci-cd-platforms-comparison.md) | —          | —          | —        |

\* High for this project because repo is on GitHub.

## Decision: GitHub Actions

GitHub Actions is selected as the CI/CD platform for FinTrack.

**Rationale:**

1. **Spec alignment**: Phase 2 explicitly defines the pipeline with GitHub Actions; no need to justify a different choice.
2. **Single ecosystem**: Code and CI in one place (GitHub) — fewer accounts, permissions, and contexts.
3. **Cost**: Free tier is sufficient for a public or small private React Native project.
4. **Config as code**: Workflows live in `.github/workflows/`, versioned with the repo and reviewable in PRs.
5. **Sufficient for pipeline**: Lint, typecheck, unit tests, build, E2E, release build, and Firebase App Distribution are all achievable with Actions and scripts (Fastlane where needed).
6. **Trade-off accepted**: Mobile-specific setup (Node, JDK, cache) requires explicit configuration; we document it and reuse patterns from the research and best-practices docs.

**Alternatives not chosen:**

- **Bitrise**: Would be reconsidered if build speed or mobile-specific steps became a bottleneck and team is willing to adopt a second platform.
- **CircleCI**: Would be reconsidered if we needed more minutes or advanced caching and wanted to stay in a single CI tool (but not GitHub).

## Consequences

### Positive

1. One platform for code and CI; no extra sign-up or billing for basic usage.
2. Pipeline definition is in the repo and auditable.
3. Aligns with Phase 2 deliverables and future documentation (e.g. Certificate Management, Fastlane).
4. Easy to extend with more jobs (e.g. SonarCloud, Sentry) in the same workflows.

### Negative / Trade-offs

1. **Mobile setup**: Node, JDK, Android SDK, Xcode (for iOS) and caches must be configured in YAML.
   - **Mitigation**: Use [CI/CD Best Practices for Mobile](../research/ci-cd-best-practices-mobile.md) and shared setup steps; cache `node_modules`, Gradle, CocoaPods.
2. **Build time**: Without careful caching, builds can be slower than Bitrise/CircleCI.
   - **Mitigation**: Implement caching from day one; revisit if feedback time becomes an issue.

### Risks and Mitigations

| Risk                    | Impact | Mitigation                                                   |
| ----------------------- | ------ | ------------------------------------------------------------ |
| Slow PR feedback        | Medium | Caching, parallel jobs, path filters; consider Bitrise later |
| Complex workflow config | Low    | Split into reusable workflows; document in repo and research |
| Free tier limits        | Low    | Monitor usage; optimize parallelization; use path filters    |

## When to Revisit

This decision should be reconsidered if:

- Build times consistently exceed acceptable limits (>20 min for PR checks) despite caching and optimization.
- Team decides to move the repository to GitLab (then evaluate GitLab CI).
- Organization mandates a different CI platform.
- Need for mobile-specific features (e.g. device farms, code signing UI) outweighs keeping a single ecosystem.

## References

- [ADR-001: High-level Architecture](./ADR-001-high-level-architecture.md)
- [ADR-002: Project Structure](./ADR-002-project-structure.md)
- [CI/CD Platforms Comparison](../research/ci-cd-platforms-comparison.md)
- [CI/CD Best Practices for Mobile](../research/ci-cd-best-practices-mobile.md)
- [Certificate Management Guide](../guides/certificate-management-guide.md) — Keystore, signing, and CI secrets
- Project Specification: `fintrack-spec-en.md` — Phase 2: Infrastructure & Quality Gates
