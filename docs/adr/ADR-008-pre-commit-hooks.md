# ADR-008: Pre-commit Hooks

## Status

Accepted

## Context

Following Phase 2 of the FinTrack specification, we need to implement pre-commit hooks for quality gates:

- **Pre-commit**: Run ESLint (with fix), Prettier (format), TypeScript check, and tests before each commit so broken or unformatted code is not committed.
- **Commit message**: Enforce Conventional Commits (Commitlint) so commit history is consistent and suitable for changelogs and automation.

The spec asks to choose among: **husky** vs **lefthook** vs **lint-staged**.

Clarification:

- **Husky** and **Lefthook** are **Git hook managers**: they install and run scripts on Git events (e.g. `pre-commit`, `commit-msg`).
- **lint-staged** is a **companion tool**: it runs linters/formatters only on **staged files**. It is typically used **with** Husky or Lefthook, not as a replacement. So the real choice is: (1) which hook manager to use; (2) whether to add lint-staged for faster pre-commit by checking only staged files.

Key requirements:

- Run type-check, lint, format, and tests on pre-commit.
- Run Commitlint on commit message (conventional commits).
- Simple setup, minimal friction for developers.
- Config as code in the repo; no external service.

## Considered Options

### Option A: Husky (Selected)

Husky is a popular Git hooks manager for Node projects. Hooks are shell scripts in `.husky/`; `husky` installs them into `.git/hooks` via the `prepare` script.

- ✅ Widely adopted, well documented, large community
- ✅ Simple model: one script per hook (e.g. `.husky/pre-commit`, `.husky/commit-msg`)
- ✅ Already in use in the project (pre-commit, commit-msg)
- ✅ No extra config format: plain shell + npm scripts
- ✅ Works with Commitlint via `commit-msg` hook
- ✅ `prepare` script ensures hooks are installed after `npm install`
- ❌ Pre-commit runs on full project by default (type-check, lint, format, test) — can be slow on large repos without lint-staged
- ❌ No built-in “run only on staged files”; that requires adding lint-staged

### Option B: Lefthook

Lefthook is a Git hooks manager with a single YAML config file. It can run commands only on staged files and supports parallel execution.

- ✅ Single config file (e.g. `lefthook.yml`) — all hooks in one place
- ✅ Built-in support for running commands only on staged files (no separate lint-staged)
- ✅ Parallel execution of tasks
- ✅ Cross-platform (Go binary)
- ❌ Less widely used than Husky in the Node/React Native ecosystem
- ❌ Would require replacing existing Husky setup and migrating team familiarity
- ❌ Extra dependency and config format to maintain
- ❌ Not yet used in the project — migration cost

### Option C: lint-staged (as the only tool)

lint-staged runs configured commands only on staged files. It does **not** manage Git hooks by itself; it is invoked from a hook (e.g. from Husky or Lefthook).

- ✅ Faster pre-commit when repo grows (only staged files are linted/formatted)
- ✅ Often used with Husky; integrates via one line in `.husky/pre-commit`
- ❌ Does not replace a hook manager — we would still need Husky or Lefthook for `pre-commit` and `commit-msg`
- ❌ “lint-staged only” is not a complete choice; it is an addition to a hook manager

So we treat lint-staged as an **optional addition** to the chosen hook manager, not as an alternative to Husky/Lefthook.

## Evaluation Matrix

| Criterion              | Husky              | Lefthook      | lint-staged (add-on)            |
| ---------------------- | ------------------ | ------------- | ------------------------------- |
| **Hook management**    | ✅ Yes             | ✅ Yes        | ❌ No (use with Husky/Lefthook) |
| **Already in use**     | ✅ Yes             | ❌ No         | ❌ No                           |
| **Commit message**     | ✅ commit-msg      | ✅ Supported  | N/A                             |
| **Run on staged only** | ⚠️ Via lint-staged | ✅ Built-in   | ✅ Purpose                      |
| **Config style**       | Shell scripts      | YAML          | package.json / config file      |
| **Community (Node)**   | ✅ Large           | ⚠️ Smaller    | ✅ Large                        |
| **Migration cost**     | None               | Replace Husky | Add to existing                 |
| **Decision**           | ✅ **Selected**    | ❌            | Optional later                  |

## Decision: Husky

**Hook manager: Husky.** Commit message checks: Commitlint via Husky `commit-msg` hook.

**Rationale:**

1. **Already in place**: The project already uses Husky with `pre-commit` (type-check, lint:fix, format, test) and `commit-msg` (Commitlint). No migration.
2. **Spec alignment**: Phase 2 requires pre-commit hooks and Commitlint; both are satisfied with the current setup.
3. **Simplicity**: One hook manager, shell scripts in `.husky/`, no extra config format. Easy to read and change.
4. **Ecosystem**: Husky is the de facto standard in many Node/React Native projects; documentation and examples are easy to find.
5. **lint-staged**: Not required for the current project size. Can be introduced later (e.g. in `package.json` + one line in `.husky/pre-commit`) if pre-commit time becomes an issue.

**Current implementation (as of this ADR):**

- **`.husky/pre-commit`**: runs `npm run type-check`, `npm run lint:fix`, `npm run format`, `npm run test`, then `git add -A` so formatted files are included in the commit.
- **`.husky/commit-msg`**: runs `npx commitlint --edit $1` to validate the commit message against Conventional Commits (config in `commitlint.config.js` with `@commitlint/config-conventional` and project-specific rules).

**Lefthook** was not chosen to avoid replacing a working Husky setup and to avoid introducing a less common tool in this ecosystem. **lint-staged** remains an optional future improvement for faster pre-commit on larger codebases.

## Consequences

### Positive

1. Pre-commit enforces type-check, lint, format, and tests before every commit.
2. Commit messages follow Conventional Commits via Commitlint (consistent history, changelog-friendly).
3. Single, well-known hook manager (Husky); no extra services or config formats.
4. Hooks are versioned in `.husky/` and run automatically after `npm install` via `prepare`.

### Negative / Trade-offs

1. **Full-project checks on pre-commit**: Lint and format run on the whole project, not only staged files. For current repo size this is acceptable; if it becomes slow, adding lint-staged is a small change.
2. **`git add -A` in pre-commit**: Re-stages all files after format/lint:fix so that formatting changes are committed. Developers must be aware that the commit may include more files than originally staged (by design).

### Risks and Mitigations

| Risk                          | Impact     | Mitigation                                      |
| ----------------------------- | ---------- | ----------------------------------------------- |
| Slow pre-commit as repo grows | Low–Medium | Add lint-staged later; run only on staged files |
| Confusion about re-staging    | Low        | Document in README or Contribution guide        |

## When to Revisit

This decision should be reconsidered if:

- Pre-commit regularly takes too long and lint-staged does not sufficiently help.
- The team adopts a different standard (e.g. organization mandates Lefthook or another manager).
- A different hook manager provides a clear benefit (e.g. centralised config, staged-only runs) that justifies migrating from Husky.

## References

- [ADR-007: CI/CD Platform](./ADR-007-ci-cd-platform.md)
- [CI/CD Best Practices for Mobile](../research/ci-cd-best-practices-mobile.md)
- Project Specification: `fintrack-spec-en.md` — Phase 2: Quality Tools
- [Husky](https://github.com/typicode/husky)
- [Commitlint](https://commitlint.js.org/)
- [Lefthook](https://github.com/evilmartians/lefthook)
- [lint-staged](https://github.com/okonet/lint-staged)
