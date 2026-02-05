Development environment

Supported and CI-tested versions for FinTrack.

## Node.js

- **Version**: 22 (LTS)
- Set in CI via `env.NODE_VERSION` in [.github/workflows/pr.yml](../.github/workflows/pr.yml)
- Local: use [nodejs.org](https://nodejs.org/) or a version manager (nvm, fnm). `package.json` → `engines` specifies `>=20`

## iOS (macOS only)

- **Xcode**: 26.2 (pinned in CI for reproducible builds; matches current Apple toolchain and iOS 26 SDK)
- **Runner**: CI uses `macos-26` (GitHub Actions) so builds target **iOS 26** SDK
- **CocoaPods**: Version from `Gemfile` / `Gemfile.lock`. Run `bundle exec pod install` from `ios/` (or use Fastlane lanes)

## Android

- **JDK**: 17 (CI)
- **Android SDK**: As required by the project (see React Native docs)

## Fastlane

Build steps (including CI) are in [fastlane/Fastfile](../fastlane/Fastfile). From project root:

```bash
bundle exec fastlane <platform> <lane>
```
