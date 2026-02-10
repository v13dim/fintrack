# Technical Specification: "FinTrack" — Personal Finance Tracker

## Training Project for Middle → Senior React Native Developer Growth

**Duration:** 4-5 weeks (full-time) or 8-10 weeks (part-time)  
**Work Format:** Independent work + weekly artifact review with Resource Manager  
**Goal:** Gain practical experience in architectural decisions, CI/CD, quality management, incident response, and working with AI tools

---

## Process Overview

### Independent Work

You work autonomously, make decisions yourself, and document them. This is a key part of growth — seniors don't wait to be told what to do.

### Weekly Checkpoint (30-45 min)

Once a week — synchronous meeting with RM:

- You present the week's artifacts
- Defend your decisions
- Receive feedback
- Update the Skill Scorecard

### Weekly Status Update (async)

Every Friday, send a short status in this format:

```markdown
## Week N Status

### Progress

- What was done (with links to artifacts)

### Risks / Blockers

- What is blocking or might block progress

### Next Week

- Plan for the next week

### Asks

- Do you need help / input / decision from RM
```

**Quality Metric:** How many clarifying questions did RM have after reading. Target — zero.

---

## Skill Scorecard

The main tool for tracking progress. Updated every week at the checkpoint.

### Rating Scale (0-3)

| Level | Description                                                  |
| ----- | ------------------------------------------------------------ |
| 0     | No artifact or understanding                                 |
| 1     | Done, but superficially, without justification               |
| 2     | Done and justified trade-offs, understands alternatives      |
| 3     | Done, measured effect, documented as reusable standard/guide |

### Assessment Areas

| #   | Area                      | Artifacts                                       |
| --- | ------------------------- | ----------------------------------------------- |
| 1   | Architecture & ADR        | ADR documents, C4 diagrams, RFC                 |
| 2   | Testing Strategy          | Pyramid, coverage, e2e                          |
| 3   | CI/CD & Quality Gates     | Pipeline, Sonar, pre-commit                     |
| 4   | Observability & Incidents | Crash logging, incident playbook, postmortem    |
| 5   | Estimation & Planning     | Backlog, story points, accuracy                 |
| 6   | Communication             | Weekly updates, documentation quality           |
| 7   | Accessibility             | Audit, checklist, screen reader testing         |
| 8   | Performance               | Metrics, optimizations, budget                  |
| 9   | Library Selection         | Evaluation matrix, license/maintenance analysis |
| 10  | AI Usage                  | Policy doc, review quality, rejection rate      |

### Example Entry

```
Week 1:
- Architecture & ADR: 2 (ADRs written, trade-offs included)
- Testing Strategy: 1 (document exists but superficial)
- CI/CD: 0 (not started)
...
```

---

## Working with AI Tools

### Setup and Configuration

- Install Claude Code CLI or Cursor
- Create project configuration (`.cursorrules` / `CLAUDE.md`)

### AI Policy Document (required deliverable)

Write an "AI Usage Policy" document for the project:

```markdown
# AI Usage Policy

## Allowed

- Generating boilerplate code
- Writing tests
- Refactoring
- Documentation

## Not Allowed

- Inserting sensitive data into prompts
- Copying code without review
- Using for security-critical logic without verification

## AI Code Review Process

1. Generate
2. Read and understand every line
3. Check for security issues
4. Write tests
5. Only then commit

## Licenses

- Verify AI doesn't copy GPL code into MIT project
```

### AI Work Quality Metric

In every PR where AI was used, add a comment:

```markdown
## AI Assistance

- Tool: Claude Code
- What: Generated basic useTransactions hook
- My changes: Added error handling, rewrote types, removed unnecessary re-renders
- Rejected: Proposed caching approach (reason: ...)
```

---

## Decision Documentation

### ADR (Architecture Decision Record)

Document every significant decision:

```markdown
# ADR-XXX: Decision Title

## Status

Accepted | Under Review | Rejected

## Context

What problem are we solving? What constraints exist?

## Considered Options

### Option A: [Name]

- ✅ Pros
- ❌ Cons

### Option B: [Name]

- ✅ Pros
- ❌ Cons

## Decision

What was chosen and why?

## Consequences

What trade-offs are we accepting? What does this mean for the project?

## References

- Documentation
- Articles
- Examples
```

### Library Evaluation Matrix

Use a structured approach for library selection:

| Criterion        | Library A   | Library B | Library C |
| ---------------- | ----------- | --------- | --------- |
| License          | MIT ✅      | GPL ❌    | Apache ✅ |
| Last Release     | 2 wks ✅    | 8 mos ⚠️  | 1 mo ✅   |
| GitHub Stars     | 15k         | 3k        | 8k        |
| Open Issues      | 45          | 230       | 89        |
| Bundle Size      | 12kb ✅     | 45kb ❌   | 18kb ✅   |
| New Arch Support | Yes ✅      | No ❌     | Yes ✅    |
| Documentation    | Excellent   | Poor      | Good      |
| **Decision**     | ✅ Selected | ❌        | Backup    |

---

## Phase 0: Preparation (Days 1-2)

### Tasks

1. **Set up environment**

   - React Native 0.76+ with New Architecture
   - TypeScript strict mode
   - AI assistant with project configuration

2. **Create basic structure**

   - Define architectural approach
   - Set up folder structure
   - Initialize Git with proper .gitignore

3. **AI Policy**
   - Write AI usage policy document for the project

### Deliverables

- [ ] GitHub repository
- [ ] **ADR-001**: Architectural approach
- [ ] **ADR-002**: Project structure
- [ ] **Document**: AI Usage Policy
- [ ] AI assistant configuration
- [ ] Working "Hello World" with New Architecture

---

## Phase 1: Architecture and Planning (Days 3-5)

### Tasks

#### 1. System Design

- C4 diagrams (Context, Container, Component)
- Data flow diagram
- Navigation map

#### 2. Technology Selection

For each area — ADR with Library Evaluation Matrix:

| Area             | Options to Analyze                      |
| ---------------- | --------------------------------------- |
| State Management | Redux Toolkit, Zustand, MobX, Jotai     |
| Local Database   | MMKV, WatermelonDB, Realm               |
| Forms            | React Hook Form, Formik                 |
| Charts           | Victory Native, React Native Charts Kit |

#### 3. Estimation

- Break down into User Stories
- Estimate in story points (Fibonacci)
- Create roadmap
- **Document the process**: which technique you chose, why, what difficulties arose

**Study and describe** (separate document):

- Planning Poker, T-shirt sizes, Bucket System
- Story Points vs hours
- Pros/cons of each approach
- Which approach would you choose for a team of 5 and why

#### 4. Testing Strategy

- Test pyramid for the project
- What to cover at each level
- TDD vs test-after — justify your choice
- FIRST principles

### Deliverables

- [ ] C4 diagrams
- [ ] Navigation map
- [ ] **ADR-003**: State Management (with evaluation matrix)
- [ ] **ADR-004**: Data Persistence (with evaluation matrix)
- [ ] **ADR-005**: Testing Strategy
- [ ] **ADR-006**: Library Selection (minimum 3 libraries)
- [ ] Product Backlog with story points
- [ ] **Document**: Estimation Techniques
- [ ] **Document**: Testing Strategy

### Week 1 Status Update

Send your first weekly status in Progress/Risks/Next/Asks format.

---

## Phase 2: Infrastructure & Quality Gates (Days 6-10)

### Tasks

#### 1. CI/CD Pipeline (GitHub Actions)

```
PR → Lint → Type Check → Unit Tests → Build
                                        ↓
Main → + E2E Tests → Build Release → Firebase App Distribution
```

**Study and describe:**

- Comparison: GitHub Actions vs GitLab CI vs Bitrise vs CircleCI
- Selection criteria for mobile development
- Best practices

#### 2. Quality Tools

- ESLint + Prettier
- Pre-commit hooks (choice: husky vs lefthook vs lint-staged → ADR)
- Commitlint (conventional commits)
- SonarQube/SonarCloud with Quality Gate

**Study and describe:**

- Comparison: SonarQube vs CodeClimate vs Codacy
- Self-hosted vs SaaS

#### 3. Crash Reporting

- Sentry integration
- Source maps in CI
- Performance monitoring
- Test crash

**Study and describe:**

- Comparison: Sentry vs Crashlytics vs Bugsnag
- Security and privacy considerations

#### 4. Certificate Management

- Fastlane setup
- Keystore management (Android)
- Process documentation

### Deliverables

- [ ] Working CI/CD pipeline
- [ ] **ADR-007**: CI/CD Platform
- [ ] **ADR-008**: Pre-commit hooks
- [ ] **ADR-009**: Crash reporting
- [ ] SonarQube dashboard (passing Quality Gate)
- [ ] Sentry with test crash
- [ ] **Document**: CI/CD Platforms Comparison
- [ ] **Document**: CI/CD Best Practices for Mobile
- [ ] **Document**: Certificate Management Guide
- [ ] **Document**: Quality Tools Comparison

---

## Phase 3: Core Features (Days 11-20)

### Features

#### Feature 1: Authentication & Security

- Splash screen
- Onboarding (3 screens)
- PIN + Biometrics
- Secure storage
- Auto-lock

#### Feature 2: Transactions

- CRUD operations
- List with day grouping
- Filters and search
- Swipe actions
- Pull-to-refresh, infinite scroll

#### Feature 3: Categories

- Preset + custom
- Icons and colors
- Drag & drop sorting

#### Feature 4: Budgets

- Monthly budget per category
- Progress bar
- Notifications at 80% and 100%

#### Feature 5: Analytics

- Pie chart by category
- Line chart trends
- Summary cards
- Comparison with previous period

#### Feature 6: Data Management

- Export CSV
- Backup/Restore JSON
- Clear all data

### Code Requirements

#### Design Patterns (apply and document)

| Pattern                  | Where to Apply          |
| ------------------------ | ----------------------- |
| Container / Presentation | Logic and UI separation |
| Custom Hooks             | Business logic          |
| Compound Components      | Forms or lists          |
| Render Props or HOC      | Minimum 1 example       |
| Provider Pattern         | Theme, Auth             |

#### Principles

- **SOLID** — examples of each principle
- **KISS** — where you consciously simplified
- **YAGNI** — what you decided NOT to do
- **DRY** — how you avoided duplication

#### Testing

| Type                          | Coverage Target |
| ----------------------------- | --------------- |
| Unit (hooks, utils, reducers) | >80%            |
| Integration (forms, flows)    | >60%            |
| E2E (Detox)                   | 3-5 happy paths |

### Deliverables

- [ ] Working features (video demo)
- [ ] **ADR-010**: Authentication approach
- [ ] **ADR-011**: Offline-first strategy
- [ ] **Document**: Design Patterns in This Project
- [ ] **Document**: Custom Hooks Best Practices
- [ ] **Document**: SOLID Principles Examples
- [ ] Test coverage >70%
- [ ] E2E tests in CI

### Design Review (self-conducted)

In week 3, record a **design review video** (15-20 min) of one feature:

**Structure:**

1. Problem we're solving (2 min)
2. Considered options (5 min)
3. Chosen solution (5 min)
4. Risks and mitigation (3 min)
5. Questions for discussion (2 min)

This video is an artifact for RM review. Imagine you're explaining the decision to the team.

---

## Phase 4: Production Readiness (Days 21-25)

### Tasks

#### 1. Performance Optimization

- Profiling (Flipper)
- List optimization (FlashList vs FlatList)
- Memoization where needed
- Bundle size analysis
- Hermes verification

**Document before/after metrics.**

#### 2. Accessibility

- accessibilityLabel, accessibilityRole, accessibilityHint
- Dynamic Type / Font Scaling
- Touch targets ≥44x44
- Contrast ≥4.5:1
- Testing with VoiceOver and TalkBack

**Record a video** of the main flow with screen reader.

#### 3. New Architecture

- Verify Fabric is working
- Study: Codegen, TurboModules, JSI
- Document experience and issues

#### 4. Security Audit

- Check sensitive data storage
- Ensure no data in logs
- ProGuard/R8 for Android

**Describe theoretically** (even if not implemented):

- SSL Pinning
- Root/Jailbreak detection
- Code obfuscation

### Incident Simulation

**Scenario:** After releasing v1.2.0, crash rate increased from 0.5% to 3.2%. Users are complaining about crashes when adding transactions.

**Your task — write a complete incident response:**

#### 1. Triage Document

```markdown
# Incident: Elevated Crash Rate v1.2.0

## Severity: P1 / P2 / P3

[Determine and justify]

## Impact

- Affected users: X%
- Affected functionality: ...
- Business impact: ...

## Timeline

- [time] — v1.2.0 release
- [time] — first reports
- [time] — incident declared

## Initial Hypotheses

1. [Hypothesis] — how to verify
2. [Hypothesis] — how to verify
3. [Hypothesis] — how to verify
```

#### 2. Mitigation Plan

```markdown
## Immediate Actions

- [ ] Rollback? (yes/no, why)
- [ ] Feature flag?
- [ ] Hotfix?

## Investigation Steps

1. ...
2. ...
3. ...

## Communication

- Who to notify
- What to tell users
```

#### 3. Postmortem

```markdown
# Postmortem: Crash Rate Incident v1.2.0

## Summary

One sentence: what happened and what was the impact.

## Root Cause

What exactly broke and why wasn't it caught earlier.

## Timeline

Detailed chronology with minute precision.

## What Went Well

- ...

## What Went Wrong

- ...

## Action Items

| Action                | Owner | Priority | Deadline |
| --------------------- | ----- | -------- | -------- |
| Add test for...       | ...   | P1       | ...      |
| Improve monitoring... | ...   | P2       | ...      |

## Lessons Learned

...
```

### Deliverables

- [ ] **Document**: Performance Optimization Report (before/after)
- [ ] **Document**: Accessibility Audit (WCAG Level A checklist)
- [ ] Video: testing with screen reader
- [ ] **Document**: New Architecture Experience
- [ ] **Document**: Security Checklist
- [ ] **ADR-012**: Performance optimizations
- [ ] **Incident Simulation**: Triage + Mitigation Plan + Postmortem

---

## Phase 5: Release & Documentation (Days 26-30)

### Tasks

#### 1. Deployment

- Firebase App Distribution (Android + iOS if Apple Developer available)
- Release notes
- For iOS without account: documentation + local release build

#### 2. Documentation

```
/docs
  ├── architecture/
  │   ├── ADR-001...ADR-012.md
  │   ├── c4-diagrams/
  │   └── navigation-map.md
  ├── guides/
  │   ├── getting-started.md
  │   ├── development-workflow.md
  │   ├── testing-guide.md
  │   ├── deployment-guide.md
  │   └── certificate-management.md
  ├── research/
  │   ├── ci-cd-comparison.md
  │   ├── estimation-techniques.md
  │   ├── quality-tools-comparison.md
  │   └── accessibility-guidelines.md
  ├── incidents/
  │   └── simulation-crash-rate.md
  └── reports/
      ├── performance-optimization.md
      ├── accessibility-audit.md
      └── security-checklist.md

README.md
CONTRIBUTING.md
CHANGELOG.md
AI-POLICY.md
```

#### 3. Retrospective

**Document "Project Retrospective":**

1. **For each Skill Scorecard area:**

   - Level before project (0-3)
   - What was done
   - Level after (0-3)
   - What helped most

2. **Working with AI:**

   - Where AI helped most
   - Where AI gave bad advice (examples)
   - % of code that needed significant rework
   - How your approach to working with AI changed

3. **Estimation accuracy:**

   - Planned vs Actual for each feature
   - Where you were most off and why
   - How to improve estimates in the future

4. **What would you do differently**

#### 4. Final Presentation

Record a video (15-20 min) — final project presentation:

1. **App demo** (5 min)
2. **Architectural decisions** — 3 most important ADRs (5 min)
3. **Key learnings** (5 min)
4. **What would you do differently** (3 min)

This video can be used as a portfolio piece.

### Deliverables

- [ ] App in Firebase App Distribution
- [ ] Complete documentation in `/docs`
- [ ] Professional quality README.md
- [ ] CONTRIBUTING.md
- [ ] **Document**: Project Retrospective
- [ ] **Video**: Final Presentation (15-20 min)
- [ ] **Video**: App Demo (2-3 min)

---

## Weekly Checkpoints

### Week 1 (Phases 0-1)

**Deliverables:**

- [ ] Repository + structure
- [ ] AI Policy
- [ ] C4 diagrams
- [ ] ADR-001 — ADR-006
- [ ] Backlog with estimates
- [ ] Estimation Techniques doc
- [ ] Testing Strategy doc
- [ ] Weekly Status #1

**Skill Scorecard focus:**

- Architecture & ADR
- Estimation & Planning

---

### Week 2 (Phase 2)

**Deliverables:**

- [ ] CI/CD pipeline working
- [ ] SonarQube Quality Gate: Pass
- [ ] Sentry integrated
- [ ] ADR-007 — ADR-009
- [ ] CI/CD Comparison doc
- [ ] Quality Tools Comparison doc
- [ ] Certificate Management Guide
- [ ] Weekly Status #2

**Skill Scorecard focus:**

- CI/CD & Quality Gates
- Observability

---

### Week 3 (Phase 3 — Part 1)

**Deliverables:**

- [ ] Auth flow complete
- [ ] Transactions CRUD complete
- [ ] Categories complete
- [ ] Unit tests written
- [ ] ADR-010, ADR-011
- [ ] Design Patterns doc
- [ ] **Video: Design Review** of one feature
- [ ] Weekly Status #3

**Skill Scorecard focus:**

- Testing Strategy (practice)
- AI Usage (review quality)

---

### Week 4 (Phase 3 — Part 2 + Phase 4)

**Deliverables:**

- [ ] All features complete
- [ ] E2E tests working
- [ ] Performance Optimization Report
- [ ] Accessibility Audit + video
- [ ] **Incident Simulation** (complete package)
- [ ] Security Checklist
- [ ] Weekly Status #4

**Skill Scorecard focus:**

- Accessibility
- Performance
- Observability & Incidents

---

### Week 5 (Phase 5)

**Deliverables:**

- [ ] Firebase App Distribution deploy
- [ ] Complete documentation
- [ ] Project Retrospective
- [ ] **Video: Final Presentation**
- [ ] Final Skill Scorecard

---

## Templates

### PR Template

```markdown
## Description

[What this PR does]

## Type

- [ ] Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Lint passes
- [ ] Self-review completed

## AI Assistance

- Tool used: [Claude Code / Cursor / None]
- What AI helped with: [...]
- What I changed/rejected: [...]

## Screenshots/Video

[If UI changes]
```

### Weekly Status Template

```markdown
## Week N Status — [Name]

**Dates:** [dd.mm] — [dd.mm]

### ✅ Progress

- [What was done, with links to PRs/documents]

### ⚠️ Risks / Blockers

- [What is blocking or might block]

### 📋 Next Week

- [Plan, priorities]

### 🙋 Asks

- [Need help, input, decision]

### 📊 Skill Scorecard Update

| Area         | Last Week | This Week | Notes                     |
| ------------ | --------- | --------- | ------------------------- |
| Architecture | 1         | 2         | Wrote ADR with trade-offs |
| ...          | ...       | ...       | ...                       |
```

---

## Success Metrics

### Quantitative

| Metric                 | Target                                  |
| ---------------------- | --------------------------------------- |
| ADR documents          | ≥12                                     |
| Research documents     | ≥8                                      |
| Test coverage          | ≥70%                                    |
| SonarQube Quality Gate | Pass                                    |
| E2E tests              | ≥3                                      |
| Weekly statuses        | 5 (no missed)                           |
| Video artifacts        | 3 (design review, accessibility, final) |

### Qualitative (Skill Scorecard)

**Minimum success:** All areas ≥1, at least 5 areas ≥2

**Good result:** All areas ≥2, at least 3 areas = 3

**Excellent result:** At least 7 areas = 3

---

## After Leaving the Bench

If the project isn't complete or you want to continue development:

### Maintenance Mode (2-4 hours per week)

- 1 ADR or documentation improvement
- 1 improvement in tests/CI/quality
- Bi-weekly short status

### What Can Be Added

- New features (recurring transactions, multiple accounts)
- Improve test coverage to 90%
- Accessibility Level AA
- Real deployment to App Store / Google Play

---

## Resources

### Architecture

- [React Design Patterns](https://refine.dev/blog/react-design-patterns/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [ADR GitHub](https://adr.github.io/)

### Testing

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox](https://wix.github.io/Detox/)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

### CI/CD

- [GitHub Actions](https://docs.github.com/en/actions)
- [Fastlane](https://docs.fastlane.tools/)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)

### Incidents

- [PagerDuty Incident Response](https://response.pagerduty.com/)
- [Google SRE Book — Postmortems](https://sre.google/sre-book/postmortem-culture/)

### Accessibility

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

### New Architecture

- [React Native New Arch](https://reactnative.dev/docs/the-new-architecture/landing-page)
