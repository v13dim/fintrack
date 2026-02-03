# CI/CD Platforms Comparison

This document compares CI/CD platforms for mobile (React Native) development: GitHub Actions, GitLab CI, Bitrise, and CircleCI. It supports ADR-007 (CI/CD Platform) and Phase 2 deliverables.

## Table of Contents

- [Overview](#overview)
- [Comparison Table](#comparison-table)
- [GitHub Actions](#github-actions)
- [GitLab CI](#gitlab-ci)
- [Bitrise](#bitrise)
- [CircleCI](#circleci)
- [Selection Criteria for Mobile](#selection-criteria-for-mobile)
- [Recommendation for FinTrack](#recommendation-for-fintrack)

## Overview

| Platform       | Hosting           | Config location             | Primary focus    |
| -------------- | ----------------- | --------------------------- | ---------------- |
| GitHub Actions | SaaS (GitHub)     | `.github/workflows/*.yml`   | General / GitHub |
| GitLab CI      | SaaS or self-host | `.gitlab-ci.yml`            | General / GitLab |
| Bitrise        | SaaS              | Bitrise YAML (app-specific) | **Mobile**       |
| CircleCI       | SaaS or self-host | `.circleci/config.yml`      | General          |

## Comparison Table

| Criterion                  | GitHub Actions                        | GitLab CI           | Bitrise                 | CircleCI                  |
| -------------------------- | ------------------------------------- | ------------------- | ----------------------- | ------------------------- |
| **Hosting**                | SaaS (GitHub)                         | SaaS or self-hosted | SaaS (mobile-first)     | SaaS or self-hosted       |
| **Config**                 | YAML in repo                          | YAML in repo        | YAML (Bitrise-style)    | YAML in repo              |
| **Free tier**              | 2000 min/mo private, unlimited public | 400 min/mo (SaaS)   | Limited free            | 6000 min/mo               |
| **Mobile focus**           | General                               | General             | **Yes (iOS/Android)**   | General                   |
| **Caching**                | Manual (actions/cache)                | Built-in            | Built-in (mobile)       | Built-in                  |
| **Secrets**                | GitHub Secrets, envs                  | CI/CD variables     | Bitrise secrets         | Project/Context           |
| **Matrix builds**          | strategy.matrix                       | parallel: matrix    | Workflows/stacks        | Orbs + params             |
| **Repo integration**       | GitHub native                         | GitLab native       | GitHub/GitLab/Bitbucket | GitHub, GitLab, Bitbucket |
| **React Native**           | Manual setup                          | Manual setup        | Ready steps (RN, Expo)  | Orbs (e.g. RN)            |
| **Firebase App Dist.**     | Scripts/actions                       | Scripts             | Ready steps             | Scripts/orbs              |
| **Build speed (mobile)**   | Medium (caching key)                  | Depends on runner   | High (optimized)        | High (cache, Docker)      |
| **Documentation (mobile)** | General + community                   | General             | **Strong**              | Good, orbs                |

## GitHub Actions

- **Pros**: Native to GitHub, config in repo, free tier for public/small private, large marketplace, single ecosystem.
- **Cons**: Mobile stack (Node, JDK, Xcode, cache) must be configured manually; cold starts without cache.
- **Best for**: Repos on GitHub; teams that want code and CI in one place; projects that accept some setup effort.

## GitLab CI

- **Pros**: Powerful pipelines (stages, DAG, matrix), self-hosted option (no minute limits), good caching.
- **Cons**: Repo on GitHub requires mirror or move to GitLab; extra tool and context for GitHub-centric projects.
- **Best for**: Repos on GitLab; teams that need self-hosted or advanced pipeline features.

## Bitrise

- **Pros**: Mobile-first (iOS/Android/RN), ready steps for RN, CocoaPods, Gradle, code signing, Firebase; optimized stacks; strong mobile docs.
- **Cons**: Separate service and billing; limited free tier; not the platform specified in FinTrack Phase 2.
- **Best for**: Teams that prioritize “mobile out of the box” and are willing to add a second platform.

## CircleCI

- **Pros**: Fast builds, good cache, orbs for React Native; generous free tier; supports GitHub.
- **Cons**: Separate service; not the platform specified in the spec.
- **Best for**: Teams that want fast, flexible CI and are okay with another tool in the stack.

## Selection Criteria for Mobile

When choosing a CI/CD platform for React Native / mobile:

1. **Code host**: Repo on GitHub → GitHub Actions is the natural fit; on GitLab → GitLab CI.
2. **Pipeline needs**: Lint, typecheck, unit tests, build (Android/iOS); optionally E2E; release build; distribution (e.g. Firebase). All four can do this; Bitrise/CircleCI often need less custom config.
3. **React Native support**: Node, JDK, Android SDK, Xcode (for iOS), caching (node_modules, Gradle, CocoaPods). Bitrise and CircleCI typically offer faster path; GitHub Actions and GitLab CI require explicit setup.
4. **Cost and limits**: Free tier and minute limits for private repos; public repos often get more free minutes on GitHub Actions.
5. **Secrets and signing**: Keystore (Android), certs/profiles (iOS), Firebase, API keys. All support secrets; process and documentation matter as much as the platform.
6. **Feedback time**: Target &lt;15–20 min for PR checks; caching and parallel jobs are important on any platform.
7. **Extensibility**: E2E on emulators/simulators, staging builds, store deployment. Check that the platform supports matrices, artifacts, and dependencies between jobs.
8. **Org standards**: If the organization standardizes on one platform (e.g. “only GitHub”), that can override pure feature comparison.

## Recommendation for FinTrack

For FinTrack (repo on GitHub, Phase 2 specifying GitHub Actions):

- **Primary choice**: **GitHub Actions** — aligns with spec, single ecosystem, free tier, and sufficient for the required pipeline (see [ADR-007](../adr/ADR-007-ci-cd-platform.md)).
- **Alternatives**: **Bitrise** if “mobile out of the box” and build speed become top priorities; **CircleCI** if speed and orbs are preferred and adding another platform is acceptable.

See [CI/CD Best Practices for Mobile](./ci-cd-best-practices-mobile.md) for implementation guidance and [ADR-007: CI/CD Platform](../adr/ADR-007-ci-cd-platform.md) for the formal decision.
