# Product Backlog

This document contains the complete Product Backlog for FinTrack project with User Stories organized by phases.

For planning, estimation, and statistics, see [Project Estimation](./estimation.md).

## Table of Contents

- [Phase 0: Project Setup & Architecture](#phase-0-project-setup--architecture)
- [Phase 1: Infrastructure & Quality Gates](#phase-1-infrastructure--quality-gates)
- [Phase 2: Core Features](#phase-2-core-features)
- [Phase 3: Production Readiness](#phase-3-production-readiness)

## Phase 0: Project Setup & Architecture

**Total Story Points**: 21  
**Timeline**: Week 1 (Day 1-2)  
**Priority**: P0 (Critical)

See [Phase 0 Details](./product-backlog/phase-0-project-setup.md) for complete User Stories.

### EPIC: Project Foundation

- US-001: Project structure setup (5 points)
- US-002: ADR documents (8 points)
- US-003: C4 diagrams and navigation map (3 points)
- US-004: Test utilities setup (5 points)

## Phase 1: Infrastructure & Quality Gates

**Total Story Points**: 26  
**Timeline**: Week 1 (Day 3-5)  
**Priority**: P0 (Critical)

See [Phase 1 Details](./product-backlog/phase-1-infrastructure.md) for complete User Stories.

### EPIC: CI/CD Pipeline

- US-101: CI/CD pipeline (8 points)
- US-102: SonarQube integration (5 points)

### EPIC: Quality Tools

- US-103: Pre-commit hooks (3 points)
- US-104: Commitlint (2 points) - P1
- US-105: Sentry integration (5 points)
- US-106: Fastlane setup (3 points) - P1

## Phase 2: Core Features

**Total Story Points**: 112  
**Timeline**: Week 2-3  
**Priority**: Mix of P0, P1, P2

See [Phase 2 Details](./product-backlog/phase-2-core-features.md) for complete User Stories.

### EPIC: Authentication & Security

- US-201: Splash screen (2 points)
- US-202: Onboarding (5 points)
- US-203: PIN authentication (8 points)
- US-204: Biometric authentication (5 points) - P1
- US-205: Auto-lock (3 points) - P1
- US-206: Secure storage (3 points)

### EPIC: Transactions

- US-301: Create transaction (5 points)
- US-302: Transaction list with day grouping (5 points)
- US-303: Edit transaction (3 points)
- US-304: Delete transaction (2 points)
- US-305: Filter transactions (5 points) - P1
- US-306: Search transactions (3 points) - P1
- US-307: Swipe actions (5 points) - P1
- US-308: Pull-to-refresh (2 points) - P2
- US-309: Infinite scroll (3 points) - P2
- US-310: Realm persistence setup (3 points)

### EPIC: Categories

- US-401: Preset categories (3 points)
- US-402: Create custom category (5 points)
- US-403: Edit category (3 points)
- US-404: Delete category (5 points) - P1
- US-405: Drag & drop sorting (5 points) - P1

### EPIC: Budgets

- US-501: Set monthly budget (5 points)
- US-502: Budget progress bar (5 points)
- US-503: Edit/delete budget (3 points)
- US-504: Budget notifications (8 points) - P1

### EPIC: Analytics

- US-601: Pie chart by category (5 points)
- US-602: Line chart trends (5 points)
- US-603: Summary cards (3 points)
- US-604: Period comparison (5 points) - P1
- US-605: Efficient calculations setup (3 points)

### EPIC: Data Management

- US-701: Export to CSV (5 points) - P1
- US-702: Backup to JSON (5 points) - P1
- US-703: Restore from JSON (3 points) - P1
- US-704: Clear all data (2 points) - P2
- US-705: Jest coverage for services and utils (2 points) - P1

## Phase 3: Production Readiness

**Total Story Points**: 36  
**Timeline**: Week 4  
**Priority**: Mix of P0, P1

See [Phase 3 Details](./product-backlog/phase-3-production-readiness.md) for complete User Stories.

### EPIC: Performance & Optimization

- US-801: Performance profiling (3 points)
- US-802: List optimization (5 points)
- US-803: Memoization (3 points)
- US-804: Bundle size optimization (2 points) - P1

### EPIC: Accessibility

- US-901: Accessibility labels (5 points)
- US-902: Dynamic type (3 points) - P1
- US-903: Touch targets (2 points)
- US-904: Color contrast (2 points)
- US-905: Screen reader testing (3 points)

### EPIC: Security & Documentation

- US-1001: Security audit (5 points)
- US-1002: Incident simulation (3 points) - P1
- US-1003: Enable iOS build in main branch CI (2 points) - P1

## References

- [Project Estimation](./estimation.md) - Estimation process, roadmap, and statistics
- [Definition of Done](./definition-of-done.md) - Completion criteria for User Stories
- [Project Specification](../fintrack-spec-en.md) - Full project requirements
- [Product Requirements Document](../fintrack-prd-en.md) - Product requirements
- [Wireframes](../../wireframes/) - Design mockups for all screens (see [README](../../wireframes/README.md) for details)
