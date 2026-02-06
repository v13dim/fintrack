# ADR-009: Crash Reporting

## Status

Accepted

## Context

Following Phase 2 of the FinTrack specification, we need to implement crash reporting and observability:

- **Crash reporting**: Capture unhandled exceptions and native crashes so we can diagnose and fix issues in production.
- **Source maps**: Upload source maps from CI so stack traces in the crash tool show original source (e.g. TypeScript) rather than minified/bundled code.
- **Test crash**: Ability to trigger a test crash to verify integration end-to-end.
- **Performance monitoring** (optional): Basic tracing for key flows, as needed.

The spec asks to compare **Sentry** vs **Firebase Crashlytics** vs **Bugsnag** and to consider **security and privacy**.

Key requirements and constraints:

- **Stack**: React Native 0.83+ with Hermes, TypeScript, New Architecture.
- **Offline-first**: All app data is local; no cloud sync. Crash reports are the main telemetry we send.
- **Privacy**: App handles financial data; we must avoid sending PII or sensitive data in crash reports.
- **CI**: GitHub Actions (see [ADR-007](./ADR-007-ci-cd-platform.md)); source map upload should fit into the existing or planned release workflow.
- **Cost**: Prefer free or low-cost tier for a training/small team project.

We need a single crash-reporting solution that supports React Native (including Hermes), source maps, and fits our privacy and CI setup.

## Considered Options

### Option A: Sentry (Selected)

Sentry provides error monitoring, performance tracing, and release management. The React Native SDK (`@sentry/react-native`) supports JS and native crashes, Hermes source maps, and integrates with Gradle (Android) and Xcode (iOS) for automatic source map upload during build.

- ✅ Explicitly named in the FinTrack spec for Phase 2 (Sentry integration, source maps in CI, test crash, performance monitoring).
- ✅ First-class React Native SDK with Hermes support and official source map docs (JS + Hermes).
- ✅ Source maps can be uploaded via Gradle/Xcode build steps or via Sentry CLI in CI; fits GitHub Actions.
- ✅ Performance/tracing (tracesSampleRate, profiling) available in the same SDK.
- ✅ Strong documentation, active maintenance, and widely used in React Native projects.
- ✅ Free tier: 5K errors/month; sufficient for development and small production usage.
- ✅ Data residency and privacy controls; sendDefaultPII can be disabled; [Security & PII docs](https://docs.sentry.io/security-legal-pii/) available.
- ❌ Another external service and account to maintain.
- ❌ DSN and Auth Token must be kept secret (env vars / GitHub Secrets); misconfiguration can leak in builds.

### Option B: Firebase Crashlytics

Firebase Crashlytics is Google’s crash reporting solution, part of Firebase. It integrates with Android and iOS natively and has a React Native integration (e.g. `@react-native-firebase/crashlytics`).

- ✅ No extra vendor if the project already uses Firebase (e.g. App Distribution).
- ✅ Free tier; no per-error limits in the same way as Sentry.
- ✅ Good native crash support and symbol upload for Android/iOS.
- ❌ Spec explicitly asks for “Sentry integration”; choosing Crashlytics would deviate without strong justification.
- ❌ React Native integration is community/third-party (React Native Firebase); Hermes source map story is less documented than Sentry’s.
- ❌ Tied to Google/Firebase ecosystem; less flexibility for performance/tracing compared to Sentry’s unified SDK.
- ❌ Separate dashboard and concepts from the rest of Firebase; still “another tool” for crash analysis.

### Option C: Bugsnag

Bugsnag offers error monitoring and stability metrics with a React Native SDK and support for source maps.

- ✅ Good React Native and source map support; clear documentation.
- ✅ Privacy-focused options (e.g. redaction, not sending PII by default in some setups).
- ✅ Free tier available (limited events/month).
- ❌ Spec asks for Sentry; Bugsnag would require explicit decision to switch.
- ❌ Less commonly referenced in the React Native ecosystem than Sentry; smaller community and fewer examples.
- ❌ Performance/tracing story is less prominent than Sentry’s in the same SDK.

## Evaluation Matrix

| Criterion                  | Sentry                       | Firebase Crashlytics  | Bugsnag               |
| -------------------------- | ---------------------------- | --------------------- | --------------------- |
| **Spec alignment**         | ✅ Explicit (Sentry)         | ❌ Different tool     | ❌ Different tool     |
| **React Native + Hermes**  | ✅ Official, well documented | ⚠️ Via RN Firebase    | ✅ Supported          |
| **Source maps (CI/build)** | ✅ Gradle, Xcode, CLI        | ⚠️ Possible, less doc | ✅ Supported          |
| **Performance / tracing**  | ✅ Built-in (same SDK)       | ❌ Separate (Perf)    | ⚠️ Available          |
| **Free tier**              | ✅ 5K errors/mo              | ✅ Generous           | ✅ Limited            |
| **Privacy / PII controls** | ✅ Documented, configurable  | ✅ Configurable       | ✅ Redaction, options |
| **Documentation (RN)**     | ✅ Strong                    | ⚠️ Via RN Firebase    | ✅ Good               |
| **Ecosystem / adoption**   | ✅ High                      | ✅ High (Firebase)    | ⚠️ Smaller            |
| **Decision**               | ✅ **Selected**              | ❌                    | ❌                    |

## Security and Privacy Considerations

- **No sensitive data in events**: We will not log or attach PINs, account balances, transaction details, or other PII to crash events. Error messages and breadcrumbs must be reviewed to avoid leaking user data.
- **sendDefaultPii**: Set to `false` in production so Sentry does not add IP, user agent, or similar by default. Enable only if explicitly needed and compliant with policy.
- **DSN**: The DSN is public (intended for client-side use) but should be supplied via environment variables (e.g. `SENTRY_DSN`) so it can differ per environment and is not hardcoded in repo.
- **Auth Token**: Used only in CI (or local release builds) for uploading source maps and debug symbols. Stored in GitHub Secrets (e.g. `SENTRY_AUTH_TOKEN`); never committed. `sentry.properties` (or equivalent) should not contain secrets in version control; use env vars or CI-injected values.
- **Scope of data**: We use Sentry for errors and optional performance traces only. We do not enable session replay or other high-detail features without a separate privacy/legal review.
- **References**: [Sentry — Security, Legal, & PII](https://docs.sentry.io/security-legal-pii/), [Data Management (React Native)](https://docs.sentry.io/platforms/react-native/data-management/).

## Decision: Sentry

**Crash reporting and optional performance monitoring: Sentry** (`@sentry/react-native`), with source maps uploaded from CI (or via Gradle/Xcode build steps).

**Rationale:**

1. **Spec alignment**: Phase 2 explicitly requires Sentry integration, source maps in CI, a test crash, and optionally performance monitoring. Sentry satisfies all in one product.
2. **React Native and Hermes**: Official SDK and documented flow for Hermes source maps; matches our stack (RN 0.83, Hermes enabled).
3. **Single tool**: Errors and basic performance (tracesSampleRate, optional profiling) in one SDK and dashboard; simpler than combining Crashlytics + another APM.
4. **CI integration**: Fits GitHub Actions via Sentry CLI or Gradle/Xcode integration; no need to introduce another CI system.
5. **Privacy**: Configurable PII (sendDefaultPii: false), no sensitive data in payloads by design, and clear documentation for security and compliance.
6. **Cost**: Free tier is sufficient for this project’s scale.

**Alternatives not chosen:**

- **Crashlytics**: Would be reconsidered if the project standardizes exclusively on Firebase and drops the requirement for Sentry; currently the spec and single-vendor (Sentry) story favor Sentry.
- **Bugsnag**: Would be reconsidered if Sentry’s pricing or terms become unsuitable and we need a dedicated error-only tool with strong privacy defaults.

## Consequences

### Positive

1. **Observability**: Unhandled JS and native crashes are reported to Sentry with stack traces; with source maps, we see original TypeScript/JS and file:line.
2. **Faster debugging**: Test crash and verification flow confirm the pipeline; releases can upload source maps so every version is debuggable in Sentry.
3. **Optional performance**: Basic tracing (e.g. tracesSampleRate) can be enabled without adding another SDK.
4. **Alignment with Phase 2**: Delivers the required crash reporting deliverable and supports the “Observability & Incidents” area in the Skill Scorecard (e.g. incident triage, postmortem with real crash data).

### Negative / Trade-offs

1. **External dependency**: Sentry is a third-party service; availability and pricing depend on the vendor. Mitigation: use env-based config and document how to disable or switch if needed.
2. **Secrets and config**: DSN and Auth Token must be managed securely (env, GitHub Secrets) and not committed. Mitigation: document in Certificate Management / CI docs; use `.env.example` with placeholder keys.
3. **Build and CI**: Source map upload adds a small build step (Gradle/Xcode or CLI). Mitigation: integrate into the existing release workflow (e.g. on main after release build) so PR builds stay unchanged if desired.

### Risks and Mitigations

| Risk                             | Impact | Mitigation                                                                           |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| PII or sensitive data in events  | High   | sendDefaultPii: false; review breadcrumbs and error messages; no logs of PIN/amounts |
| Leaked Auth Token or DSN in repo | High   | Secrets only in env and GitHub Secrets; sentry.properties without secrets            |
| Source maps not uploaded in CI   | Medium | Document upload step; add to release workflow; verify in Sentry after release        |
| Sentry outage or rate limits     | Low    | App continues to work; crashes are not sent until service is back; monitor quota     |

## When to Revisit

This decision should be reconsidered if:

- The spec or organization mandates a different crash reporting tool (e.g. Crashlytics or Bugsnag).
- Sentry’s free tier or pricing becomes insufficient and alternatives offer clearly better value.
- Privacy or compliance requirements cannot be met with Sentry’s data handling (e.g. strict on-prem-only telemetry).
- We need features Sentry does not provide (e.g. deep Firebase-only integration) and are willing to maintain two systems.

## References

- [ADR-007: CI/CD Platform](./ADR-007-ci-cd-platform.md)
- Project Specification: `fintrack-spec-en.md` — Phase 2: Crash Reporting (Sentry, source maps, test crash, performance)
- [Sentry for React Native](https://docs.sentry.io/platforms/react-native/)
- [Sentry React Native — Source Maps](https://docs.sentry.io/platforms/react-native/sourcemaps/)
- [Sentry — Security, Legal, & PII](https://docs.sentry.io/security-legal-pii/)
- [Sentry React Native — Data Management](https://docs.sentry.io/platforms/react-native/data-management/)
