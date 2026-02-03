# Certificate Management Guide

This guide describes how FinTrack manages signing certificates and keystores for Android and iOS builds. It supports [ADR-007: CI/CD Platform](../adr/ADR-007-ci-cd-platform.md) and the [CI/CD Best Practices](../research/ci-cd-best-practices-mobile.md). **Never commit keystores, certificates, or passwords to the repository.**

## Table of Contents

- [Overview](#overview)
- [Fastlane Setup](#fastlane-setup)
- [Android Keystore](#android-keystore)
- [iOS Certificates and Profiles](#ios-certificates-and-profiles)
- [CI Secrets](#ci-secrets)
- [Security and Rotation](#security-and-rotation)
- [References](#references)

## Overview

| Platform    | Current use                          | For Firebase App Distribution | For store release                         |
| ----------- | ------------------------------------ | ----------------------------- | ----------------------------------------- |
| **Android** | Debug keystore for release build     | ✅ Sufficient                 | ❌ Need dedicated release keystore        |
| **iOS**     | Not used for distribution in Phase 2 | N/A (Android-only upload)     | Certificates + Ad Hoc / App Store profile |

- **Secrets**: Keystores, `.p12` certificates, provisioning profiles, and passwords are stored only in secure storage (local safe place, CI secrets). They are never committed.
- **Fastlane**: Build and distribution automation lives in the project root (`fastlane/`). Run from project root with `bundle exec fastlane <platform> <lane>`.

## Fastlane Setup

### Location and dependencies

- **Path**: `fastlane/` at the project root (not inside `ios/` or `android/`).
- **Ruby**: Use the root `Gemfile`; Fastlane is included. Install with:
  ```bash
  bundle install
  ```
- **Run from**: Always the **project root** (where `package.json` and `fastlane/` are).

### Available lanes

From the project root:

| Command                                  | Description                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `bundle exec fastlane android build`     | Build Android release **AAB** (for Play Store / Firebase App Distribution) |
| `bundle exec fastlane android build_apk` | Build Android release **APK**                                              |
| `bundle exec fastlane ios build`         | Build iOS app (requires Apple signing setup)                               |

### Configuration files

- **`fastlane/Fastfile`** — Defines lanes for Android and iOS.
- **`fastlane/Appfile`** — App identifiers (optional; iOS `app_identifier`, `apple_id`, `team_id` can be uncommented when Apple Developer is configured).

## Android Keystore

### Current state

- **Debug**: `android/app/debug.keystore` is used for debug builds (committed in the repo by default in React Native).
- **Release**: The release build type currently uses the **same debug signing config** (see `android/app/build.gradle`). This is acceptable for:
  - Local testing and Firebase App Distribution in Phase 2.
- **Google Play**: For production Play Store release you must use a **dedicated release keystore** (see below). Do not use the debug keystore for store builds.

### Creating a release keystore (for Play Store or strict signing)

Run once; keep the keystore and passwords in a safe place and **do not commit** the file.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore fintrack-release.keystore \
  -alias fintrack \
  -keyalg RSA -keysize 2048 -validity 10000
```

- You will be prompted for: keystore password, key password, name, organization, etc.
- **Back up** the `.keystore` file and passwords securely. Loss means you cannot update the app on Play Store with the same key.

### Where to store the keystore

- **Locally**: Outside the repo (e.g. secure folder, password manager attachment). Add `*.keystore` (or exclude only `debug.keystore` from ignore) in `.gitignore` so release keystores are never committed.
- **CI**: Store the keystore (e.g. base64-encoded) and credentials in GitHub Secrets; decode and write to a temporary file during the build, then use env-based signing in Gradle (see [CI Secrets](#ci-secrets)).

### Using release keystore in Gradle (optional, for store builds)

When you switch release builds to the dedicated keystore:

1. **Do not** put the keystore file or passwords in the repo.
2. Use **environment variables** or a **`keystore.properties`** file (add `keystore.properties` to `.gitignore`).
3. In `android/app/build.gradle`, define a `release` signing config that reads from env or `keystore.properties`, and set `buildTypes.release.signingConfig` to it.

Example pattern (env-based):

```groovy
signingConfigs {
    release {
        if (System.getenv("ANDROID_KEYSTORE_PATH")) {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release ?: signingConfigs.debug
        // ...
    }
}
```

In CI, set the env vars (and write the keystore file from the secret) before running the build.

## iOS Certificates and Profiles

Required when you need to distribute iOS builds (e.g. TestFlight, Firebase App Distribution for iOS, or Ad Hoc).

### Prerequisites

- **Apple Developer account** (enrolled).
- **App ID**: Create in [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources) with bundle ID `com.fintrack` (or the one used in Xcode).

### Certificates

- **Development**: For running on your own device from Xcode (Apple Development certificate).
- **Distribution**: For TestFlight / App Store or Ad Hoc (Apple Distribution certificate).  
  Create a Certificate Signing Request (CSR) in **Keychain Access** on Mac, then create the certificate in the Apple Developer portal and install the `.cer` in Keychain.

### Provisioning profiles

- **Development**: Tied to your Development certificate and devices; Xcode can manage it automatically.
- **Ad Hoc**: For distributing IPA to testers (e.g. Firebase App Distribution). Register testers’ device UDIDs in **Devices**, then create an **Ad Hoc** profile for the App ID and Distribution certificate, and select the devices.
- **App Store**: For TestFlight and App Store submission (created when you set up the app in App Store Connect).

### Fastlane and Xcode

- In **Xcode**: Target → Signing & Capabilities → select your Team; for Release, choose the appropriate Distribution profile (Ad Hoc or App Store).
- In **Fastlane**: The `ios build` lane uses `gym` with `workspace: 'ios/fintrack.xcworkspace'`, `scheme: 'fintrack'`. For distribution to testers, use `export_method: 'ad-hoc'`; for TestFlight/App Store use `'app-store'`.
- **Match** (optional): [fastlane match](https://docs.fastlane.tools/actions/match/) stores certificates and profiles in a private repo (or S3), so the team and CI use the same credentials without committing them. Recommended for teams and CI.

### CI (when you add iOS distribution)

- Store the Distribution certificate (exported as `.p12`) and the Ad Hoc (or App Store) provisioning profile in GitHub Secrets.
- In the workflow (macOS runner): import the `.p12` into the keychain and set the profile path; then run `bundle exec fastlane ios build` so `gym` can sign the IPA.

## CI Secrets

Use GitHub Actions secrets (or your CI’s secret store) for all sensitive data.

### Android (when using release keystore in CI)

| Secret name                 | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `ANDROID_KEYSTORE_BASE64`   | Content of the release keystore file, base64-encoded |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password                                    |
| `ANDROID_KEY_ALIAS`         | Key alias (e.g. `fintrack`)                          |
| `ANDROID_KEY_PASSWORD`      | Key password                                         |

In the workflow: decode the keystore to a file (e.g. in `android/app/` or a temp path), set the env vars above (and `ANDROID_KEYSTORE_PATH` if your Gradle reads it), then run the Android build. Do not commit the decoded file.

### iOS (when you add iOS signing in CI)

| Secret name                     | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| `IOS_DISTRIBUTION_P12_BASE64`   | Exported Distribution certificate (`.p12`), base64-encoded   |
| `IOS_DISTRIBUTION_P12_PASSWORD` | Password for the `.p12`                                      |
| `IOS_ADHOC_PROFILE` or path     | Ad Hoc provisioning profile (content or path after decoding) |

Import the `.p12` into the keychain on the runner and provide the profile to the build step.

### Firebase App Distribution (when used)

| Secret name                                            | Description                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `FIREBASE_CI_TOKEN` or `FIREBASE_SERVICE_ACCOUNT_JSON` | Token or service account JSON for Firebase CLI / Fastlane plugin |

Use these only in jobs that upload to Firebase; do not log or expose them.

## Security and Rotation

- **Never commit** keystores, `.p12` files, provisioning profiles, or passwords.
- **Restrict secrets in CI**: Use signing secrets only in the main/release workflow and only for the jobs that need them (e.g. release build + Firebase upload).
- **Backup**: Keep a secure backup of the Android release keystore and the iOS Distribution certificate; losing them can block store updates.
- **Rotation**: If a key or certificate is compromised, create a new one in the respective portal (Play Console / Apple Developer), update CI secrets, and follow store procedures for key/certificate rotation.
- **Least privilege**: Prefer separate CI tokens or service accounts for Firebase/Play/App Store with minimal required permissions.

## References

- [ADR-007: CI/CD Platform](../adr/ADR-007-ci-cd-platform.md)
- [CI/CD Best Practices for Mobile](../research/ci-cd-best-practices-mobile.md)
- [React Native: Signed APK (Android)](https://reactnative.dev/docs/signed-apk-android)
- [Fastlane documentation](https://docs.fastlane.tools/)
- [Fastlane match](https://docs.fastlane.tools/actions/match/)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
