# Quality Tools Comparison

This document compares code quality and static analysis tools: SonarQube/SonarCloud, CodeClimate, and Codacy. It also discusses self-hosted vs SaaS deployment. It supports Phase 2 Quality Tools deliverables and the choice of SonarQube/SonarCloud with Quality Gate.

## Table of Contents

- [Overview](#overview)
- [Comparison Table](#comparison-table)
- [SonarQube / SonarCloud](#sonarqube--sonarcloud)
- [CodeClimate](#codeclimate)
- [Codacy](#codacy)
- [Self-hosted vs SaaS](#self-hosted-vs-saas)
- [Recommendation for FinTrack](#recommendation-for-fintrack)

## Overview

| Tool        | Hosting                | Primary focus                    | Quality Gate  |
| ----------- | ---------------------- | -------------------------------- | ------------- |
| SonarQube   | Self-hosted (or cloud) | Code quality, security, coverage | Yes           |
| SonarCloud  | SaaS (SonarSource)     | Same as SonarQube, GitHub/GitLab | Yes           |
| CodeClimate | SaaS                   | Automated code review, PR checks | Yes (Quality) |
| Codacy      | SaaS                   | Code review, quality, security   | Yes           |

All four provide:

- Static analysis (bugs, vulnerabilities, code smells)
- Integration with CI (e.g. GitHub Actions)
- Pull request / branch analysis
- Dashboards and metrics over time

Phase 2 requires **SonarQube/SonarCloud with Quality Gate**: the pipeline must fail if the Quality Gate does not pass (e.g. new issues, coverage drop).

## Comparison Table

| Criterion              | SonarQube (self-hosted)          | SonarCloud (SaaS)                                  | CodeClimate            | Codacy                     |
| ---------------------- | -------------------------------- | -------------------------------------------------- | ---------------------- | -------------------------- |
| **Hosting**            | Self-hosted                      | SaaS                                               | SaaS                   | SaaS                       |
| **Quality Gate**       | Yes (configurable)               | Yes (configurable)                                 | Yes (Quality)          | Yes                        |
| **Free tier**          | Community Edition free           | Free: public repos; private limited (e.g. 50k LOC) | Limited free / trial   | Limited free / trial       |
| **Languages**          | 30+ (JS/TS, Kotlin, Swift, etc.) | Same as SonarQube                                  | JS/TS, Ruby, PHP, etc. | 40+ (JS/TS, Kotlin, Swift) |
| **React Native / TS**  | Yes                              | Yes                                                | Yes                    | Yes                        |
| **GitHub integration** | Via CI                           | Native (GitHub login)                              | Native                 | Native                     |
| **CI integration**     | Scanner in CI                    | Scanner in CI                                      | Service + CI status    | Service + CI status        |
| **Security (SAST)**    | Yes                              | Yes                                                | Yes                    | Yes                        |
| **Coverage**           | Yes (import from Jest etc.)      | Yes                                                | Yes                    | Yes                        |
| **Secrets detection**  | Yes (SonarQube 9+)               | Yes                                                | Varies                 | Yes                        |
| **Config in repo**     | Yes (quality profiles)           | Yes                                                | Yes (optional)         | Yes (optional)             |
| **Open source**        | Community Edition                | No                                                 | No                     | No                         |

## SonarQube / SonarCloud

- **SonarQube**: Self-hosted server; you run the server and scanners. Community Edition is free; Developer/Enterprise add more languages and features.
- **SonarCloud**: Hosted by SonarSource; same analysis engine and Quality Gate, no server to maintain. Free for public repos; free tier for private repos (e.g. up to 50k lines, limited users).

**Pros**: Mature, widely used, strong Quality Gate (fail pipeline on quality regression). Good support for JavaScript/TypeScript and many languages. Security (SAST), coverage, code smells, duplications. Configurable rules and quality profiles. SonarCloud integrates natively with GitHub (login, PR decoration).

**Cons**: Self-hosted SonarQube requires maintenance and resources. SonarCloud free tier for private repos has limits (LOC, users).

**Best for**: Teams that want a strict Quality Gate in CI and are okay with SonarSource ecosystem (SonarQube/SonarCloud). FinTrack spec explicitly names SonarQube/SonarCloud.

## CodeClimate

- **CodeClimate**: SaaS; automated code review and maintainability metrics. Integrates with GitHub/GitLab; shows status on PRs. Quality (maintainability) and optional security/coverage.

**Pros**: Good UX, clear PR integration, maintainability focus. Can run engines (e.g. ESLint) in their cloud.

**Cons**: Pricing and free tier have changed over time; often limited free usage. Quality Gate is present but ecosystem is different from Sonar; less emphasis on a single “Quality Gate” fail/pass in the same way as Sonar.

**Best for**: Teams that want SaaS code review and maintainability metrics and are okay with CodeClimate’s pricing model.

## Codacy

- **Codacy**: SaaS; automated code review, quality, and security. Supports many languages; integrates with GitHub/GitLab/Bitbucket. Quality Gate and PR checks.

**Pros**: Broad language support, security (SAST), quality and style. Single dashboard for multiple repos. Customizable quality standards.

**Cons**: Separate service and billing; free tier is limited. Another vendor and UI to learn.

**Best for**: Teams that want a single SaaS tool for quality and security across many repos and languages.

## Self-hosted vs SaaS

| Aspect         | Self-hosted (e.g. SonarQube)      | SaaS (e.g. SonarCloud, CodeClimate, Codacy) |
| -------------- | --------------------------------- | ------------------------------------------- |
| **Setup**      | Install and maintain server       | Sign up, connect repo, add CI step          |
| **Cost**       | Infrastructure + time             | Per repo / LOC / users (free tiers exist)   |
| **Data**       | Data stays on your infrastructure | Data on vendor’s cloud                      |
| **Scaling**    | You scale hardware                | Vendor scales                               |
| **Updates**    | You upgrade                       | Vendor upgrades                             |
| **Compliance** | Easier to fit strict policies     | Depends on vendor and region                |
| **Free tier**  | Free software (Community Edition) | Often limited free (e.g. public repos, LOC) |

**When to choose self-hosted (e.g. SonarQube)**:

- Strict data residency or compliance (code must not leave your network).
- Many projects / high usage and you prefer CapEx and control over SaaS fees.
- You have capacity to run and upgrade the server.

**When to choose SaaS (e.g. SonarCloud)**:

- Want minimal ops: no server, no upgrades.
- Small/medium team or open-source; free tier (e.g. public repos, or limited private) is enough.
- Repo already on GitHub/GitLab; native integration and PR decoration are valuable.

For FinTrack (training project, GitHub, Phase 2): **SaaS (SonarCloud)** is the natural fit unless you have a requirement to keep analysis self-hosted.

## Recommendation for FinTrack

Phase 2 specifies **SonarQube/SonarCloud with Quality Gate**. Among the compared tools:

- **Primary choice**: **SonarCloud** (SaaS) — same engine and Quality Gate as SonarQube, no server to run, native GitHub integration, free for public repos and limited free tier for private. Add a Quality Gate that fails the CI when quality degrades (e.g. new issues, coverage below threshold).
- **Alternative**: **SonarQube** (self-hosted) — if you must keep analysis on-premise or already run SonarQube; same rules and Quality Gate, more setup and maintenance.
- **CodeClimate / Codacy**: Viable alternatives if the team prefers their UX or pricing; they would require an explicit decision to deviate from the spec’s “SonarQube/SonarCloud” and to map their “Quality”/gate concept to the pipeline.

Implementation: add a SonarCloud (or SonarQube) scanner step to the CI pipeline (e.g. GitHub Actions), configure the Quality Gate in the Sonar UI, and fail the job when the gate fails. See SonarSource documentation for GitHub Actions and Quality Gate setup.

## References

- [SonarCloud](https://sonarcloud.io/) — SaaS by SonarSource
- [SonarQube](https://www.sonarqube.org/) — self-hosted
- [CodeClimate](https://codeclimate.com/)
- [Codacy](https://www.codacy.com/)
- Project Specification: `fintrack-spec-en.md` — Phase 2: Quality Tools
