# ADR-008: Splash Screen Library Selection

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a splash screen library for FinTrack. The application requires:

- **App launch screen**: Display splash screen on app launch
- **Branding**: Support for app branding and assets
- **Loading state**: Show splash screen during app initialization
- **Smooth transition**: Smooth transition from splash screen to app
- **Platform support**: Works with React Native 0.83+

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture enabled
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Fast, smooth splash screen experience
- **Offline-first**: Must work offline
- **Maintainability**: Active maintenance, good documentation, community support
- **Testability**: Library must be easily mockable for testing
- **Developer Experience**: Good TypeScript support, clear APIs

## Considered Options

### Option A: react-native-bootsplash (Selected)

react-native-bootsplash is a library to show a bootsplash on app launch.

- ✅ Native implementation (fast, smooth)
- ✅ Works with React Native 0.83+
- ✅ Good TypeScript support
- ✅ Active maintenance
- ✅ Good documentation
- ✅ Supports both iOS and Android
- ✅ Customizable (colors, logo)
- ✅ Lottie animations possible via integration (see example repository)
- ❌ Requires native code setup
- ❌ More setup complexity
- ❌ No direct GIF support (use Lottie instead)

### Option B: react-native-splash-screen

A simple splash screen library for React Native.

- ✅ Simple API
- ✅ Easy to use
- ❌ Less maintained
- ❌ Limited customization
- ❌ Older library (may have compatibility issues)
- ❌ Weaker TypeScript support

### Option C: Custom Implementation

Implementing splash screen manually using React Native components.

- ✅ Full control
- ✅ No dependencies
- ❌ More code to maintain
- ❌ May have timing issues
- ❌ More complex implementation
- ❌ Requires native code for full functionality

## Evaluation Matrix

| Criterion                 | react-native-bootsplash | react-native-splash-screen | Custom Implementation              |
| ------------------------- | ----------------------- | -------------------------- | ---------------------------------- |
| **License**               | MIT ✅                  | MIT ✅                     | N/A                                |
| **Last Release**          | 2 months ✅             | 6 months ⚠️                | N/A                                |
| **GitHub Stars**          | 3.2k ✅                 | 2.1k ✅                    | N/A                                |
| **Bundle Size**           | ~10kb ✅                | ~8kb ✅                    | Depends on implementation ⚠️       |
| **TypeScript Support**    | Good ✅                 | Limited ⚠️                 | Full control ✅                    |
| **New Arch Support**      | Yes ✅                  | Partial ⚠️                 | Yes ✅                             |
| **Documentation**         | Good ✅                 | Basic ⚠️                   | N/A                                |
| **Performance**           | Excellent ✅            | Good ✅                    | Depends ⚠️                         |
| **Customization**         | Good ✅                 | Limited ⚠️                 | Full ✅                            |
| **Setup Complexity**      | Medium ⚠️               | Low ✅                     | High ❌                            |
| **Maintenance**           | Active ✅               | Less Active ⚠️             | Self ✅                            |
| **Native Implementation** | Yes ✅                  | Yes ✅                     | Required for full functionality ⚠️ |
| **Decision**              | ✅ **Selected**         | ❌                         | ❌                                 |

## Decision

We will adopt **react-native-bootsplash** as the splash screen library for FinTrack.

## Rationale

react-native-bootsplash was selected for the following reasons:

1. **Native Implementation**: Native implementation ensures fast, smooth performance and proper integration with app lifecycle
2. **Active Maintenance**: Actively maintained with good documentation
3. **TypeScript Support**: Good TypeScript support ensures type safety
4. **Platform Support**: Supports both iOS and Android with React Native 0.83+
5. **Customization**: Customizable colors and logo to match branding
6. **Animation Support**: Lottie animations possible via integration (see example repository)
7. **New Architecture**: Supports React Native New Architecture

While react-native-bootsplash requires native code setup and has more setup complexity, the native implementation ensures smooth performance and proper integration with the app lifecycle, which is crucial for a good first impression of the app.

**Note**: react-native-bootsplash requires native setup for both iOS and Android platforms.

## Consequences

### Positive

1. **Performance**: Native implementation ensures fast, smooth splash screen
2. **Integration**: Proper integration with app lifecycle
3. **Type Safety**: Good TypeScript support ensures type safety
4. **Maintenance**: Actively maintained with good documentation
5. **Customization**: Customizable to match branding requirements
6. **Animation Support**: Lottie animations possible via integration
7. **Platform Support**: Supports both iOS and Android

### Negative / Trade-offs

1. **Setup Complexity**: Requires native code setup for both platforms
   - **Mitigation**: Clear documentation, setup scripts, code reviews
2. **No GIF Support**: No direct GIF support (use Lottie instead)
   - **Mitigation**: Use Lottie animations via integration example
3. **Bundle Size**: Adds ~10kb to bundle size
   - **Mitigation**: Acceptable trade-off for native implementation benefits

### Risks and Mitigations

| Risk                    | Impact | Mitigation                                                          |
| ----------------------- | ------ | ------------------------------------------------------------------- |
| Native setup complexity | Low    | Clear documentation, setup scripts, code reviews                    |
| Library maintenance     | Low    | Monitor library updates, have migration plan, consider alternatives |
| Animation limitations   | Low    | Use Lottie animations via integration example                       |

## When to Revisit

This decision should be reconsidered if:

- Performance issues arise that cannot be solved
- Library becomes unmaintained or deprecated
- Better alternatives emerge that better fit the project's needs
- Project requirements change significantly (e.g., need for complex animations, video splash)
- Native setup becomes unmanageable
- Team consistently struggles with react-native-bootsplash despite training

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-006: Chart Library Selection](./ADR-006-chart-library-selection.md) - Chart library decision
- [ADR-007: Form Library Selection](./ADR-007-form-library-selection.md) - Form library decision
- [Splash Screen Implementation Guide](../guides/splash-screen-implementation-guide.md) - Detailed implementation guide
- [react-native-bootsplash Documentation](https://github.com/zoontek/react-native-bootsplash) - Bootsplash docs
- [react-native-bootsplash Lottie Example](https://github.com/zoontek/react-native-bootsplash-lottie-example) - Lottie animation integration example
- [react-native-splash-screen](https://github.com/crazycodeboy/react-native-splash-screen) - Alternative splash screen library
- Project Specification: `fintrack-spec-en.md`
