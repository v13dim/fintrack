# ADR-006: Library Selection

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select key libraries for FinTrack. The application requires libraries for:

- **Charts**: Pie charts (expenses by category), line charts (spending trends over time)
- **Forms**: Transaction forms, category forms, budget forms with validation
- **Splash Screen**: App launch screen with branding, loading state

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture enabled
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Smooth animations, fast rendering, minimal bundle size impact
- **Offline-first**: All libraries must work offline
- **Maintainability**: Active maintenance, good documentation, community support
- **Testability**: Libraries must be easily mockable for testing
- **Developer Experience**: Good TypeScript support, clear APIs, debugging tools

## Library 1: Charts

### Requirements

- Pie charts for category breakdown
- Line charts for spending trends
- Customizable colors and styling
- Smooth animations
- TypeScript support
- React Native compatible

### Considered Options

#### Option A: Victory Native (Selected)

Victory Native is a React Native charting library built on D3 and React Native SVG.

- ✅ Comprehensive chart types (pie, line, bar, area)
- ✅ Highly customizable (colors, animations, labels)
- ✅ Built on D3 (powerful data visualization)
- ✅ Good TypeScript support
- ✅ Active maintenance
- ✅ Good documentation
- ✅ Smooth animations
- ❌ Larger bundle size (~200kb)
- ❌ Steeper learning curve
- ❌ More complex API

#### Option B: React Native Chart Kit

React Native Chart Kit is a simple charting library for React Native.

- ✅ Simple API, easy to use
- ✅ Small bundle size (~50kb)
- ✅ Good for basic charts
- ✅ Active maintenance
- ❌ Limited customization
- ❌ Fewer chart types
- ❌ Less flexible than Victory
- ❌ Weaker TypeScript support

#### Option C: react-native-gifted-charts

A modern charting library with a focus on performance and customization.

- ✅ Good performance
- ✅ Modern API
- ✅ Customizable
- ✅ Active maintenance
- ❌ Smaller community
- ❌ Less mature
- ❌ Limited documentation

### Evaluation Matrix - Charts

| Criterion              | Victory Native  | React Native Chart Kit | react-native-gifted-charts |
| ---------------------- | --------------- | ---------------------- | -------------------------- |
| **License**            | MIT ✅          | MIT ✅                 | MIT ✅                     |
| **Last Release**       | 1 month ✅      | 2 months ✅            | 1 week ✅                  |
| **GitHub Stars**       | 2.1k ✅         | 6.5k ✅                | 2.8k ✅                    |
| **Bundle Size**        | ~200kb ⚠️       | ~50kb ✅               | ~80kb ✅                   |
| **TypeScript Support** | Excellent ✅    | Good ✅                | Good ✅                    |
| **New Arch Support**   | Yes ✅          | Yes ✅                 | Yes ✅                     |
| **Documentation**      | Excellent ✅    | Good ✅                | Good ⚠️                    |
| **Pie Charts**         | Excellent ✅    | Good ✅                | Good ✅                    |
| **Line Charts**        | Excellent ✅    | Good ✅                | Excellent ✅               |
| **Customization**      | Excellent ✅    | Limited ⚠️             | Good ✅                    |
| **Animations**         | Excellent ✅    | Good ✅                | Excellent ✅               |
| **Performance**        | Excellent ✅    | Good ✅                | Excellent ✅               |
| **Learning Curve**     | Medium ⚠️       | Low ✅                 | Medium ⚠️                  |
| **Community**          | Medium ⚠️       | Large ✅               | Small ⚠️                   |
| **Maintenance**        | Active ✅       | Active ✅              | Active ✅                  |
| **Decision**           | ✅ **Selected** | ❌                     | ❌                         |

### Decision: Victory Native

Victory Native was selected for its comprehensive chart types, high customization, and excellent TypeScript support. While it has a larger bundle size, the flexibility and power justify the trade-off.

**Note**: Victory Native requires peer dependencies:
- `react-native-svg` - for rendering SVG graphics
- `react-native-reanimated` - for animations
- `react-native-gesture-handler` - for gesture handling
- `@shopify/react-native-skia` - for high-performance rendering
- `react-native-worklets` - for worklet support (required by reanimated)

## Library 2: Forms

### Requirements

- Form validation
- Error handling
- TypeScript support
- Performance (fast validation)
- Easy integration with React Native components
- Minimal re-renders

### Considered Options

#### Option A: React Hook Form (Selected)

React Hook Form is a performant, flexible, and extensible forms library with easy-to-use validation.

- ✅ Excellent performance (uncontrolled components, minimal re-renders)
- ✅ Small bundle size (~9kb)
- ✅ Excellent TypeScript support
- ✅ Flexible validation (built-in, Zod, custom) - we use Zod for validation
- ✅ Large community and ecosystem
- ✅ Great documentation
- ✅ Easy to test
- ✅ Works well with React Native
- ❌ Requires understanding of uncontrolled components
- ❌ Less opinionated (more setup)

**Note**: React Hook Form requires peer dependencies for validation:
- `@hookform/resolvers` - for Zod integration
- `zod` - for schema validation

#### Option B: Formik

Formik is a popular form library that makes form handling easy and straightforward.

- ✅ Simple API, easy to learn
- ✅ Good documentation
- ✅ Large community
- ✅ Good TypeScript support
- ❌ Larger bundle size (~15kb)
- ❌ More re-renders (controlled components)
- ❌ Performance concerns with large forms
- ❌ Less performant than React Hook Form

### Evaluation Matrix - Forms

| Criterion                | React Hook Form | Formik        |
| ------------------------ | --------------- | ------------- |
| **License**              | MIT ✅          | Apache 2.0 ✅ |
| **Last Release**         | 1 week ✅       | 1 month ✅    |
| **GitHub Stars**         | 40.5k ✅        | 35.2k ✅      |
| **Bundle Size**          | ~9kb ✅         | ~15kb ⚠️      |
| **TypeScript Support**   | Excellent ✅    | Good ✅       |
| **New Arch Support**     | Yes ✅          | Yes ✅        |
| **Documentation**        | Excellent ✅    | Good ✅       |
| **Performance**          | Excellent ✅    | Good ⚠️       |
| **Validation**           | Excellent ✅    | Good ✅       |
| **Learning Curve**       | Medium ⚠️       | Low ✅        |
| **Community**            | Large ✅        | Large ✅      |
| **Maintenance**          | Very Active ✅  | Active ✅     |
| **React Native Support** | Excellent ✅    | Good ✅       |
| **Testability**          | Excellent ✅    | Good ✅       |
| **Decision**             | ✅ **Selected** | ❌            |

### Decision: React Hook Form

React Hook Form was selected for its excellent performance, small bundle size, and strong TypeScript support. The performance benefits (minimal re-renders) are crucial for mobile applications.

## Library 3: Splash Screen

### Requirements

- Show splash screen on app launch
- Hide after app initialization
- Support for branding/assets
- Smooth transition to app
- Works with React Native 0.83+

### Considered Options

#### Option A: react-native-bootsplash (Selected)

react-native-bootsplash is a library to show a bootsplash on app launch.

- ✅ Native implementation (fast, smooth)
- ✅ Works with React Native 0.83+
- ✅ Good TypeScript support
- ✅ Active maintenance
- ✅ Good documentation
- ✅ Supports both iOS and Android
- ✅ Customizable (colors, logo)
- ❌ Requires native code setup
- ❌ More setup complexity

#### Option B: react-native-splash-screen

A simple splash screen library for React Native.

- ✅ Simple API
- ✅ Easy to use
- ❌ Less maintained
- ❌ Limited customization
- ❌ Older library (may have compatibility issues)
- ❌ Weaker TypeScript support

#### Option C: Custom Implementation

Implementing splash screen manually using React Native components.

- ✅ Full control
- ✅ No dependencies
- ❌ More code to maintain
- ❌ May have timing issues
- ❌ More complex implementation

### Evaluation Matrix - Splash Screen

| Criterion                 | react-native-bootsplash | react-native-splash-screen | Custom Implementation |
| ------------------------- | ----------------------- | -------------------------- | --------------------- |
| **License**               | MIT ✅                  | MIT ✅                     | N/A                   |
| **Last Release**          | 2 months ✅             | 6 months ⚠️                | N/A                   |
| **GitHub Stars**          | 3.2k ✅                 | 2.1k ✅                    | N/A                   |
| **Bundle Size**           | ~10kb ✅                | ~8kb ✅                    | 0kb ✅                |
| **TypeScript Support**    | Good ✅                 | Limited ⚠️                 | Full control ✅       |
| **New Arch Support**      | Yes ✅                  | Partial ⚠️                 | Yes ✅                |
| **Documentation**         | Good ✅                 | Basic ⚠️                   | N/A                   |
| **Performance**           | Excellent ✅            | Good ✅                    | Depends ⚠️            |
| **Customization**         | Good ✅                 | Limited ⚠️                 | Full ✅               |
| **Setup Complexity**      | Medium ⚠️               | Low ✅                     | High ❌               |
| **Maintenance**           | Active ✅               | Less Active ⚠️             | Self ✅               |
| **Native Implementation** | Yes ✅                  | Yes ✅                     | No ❌                 |
| **Decision**              | ✅ **Selected**         | ❌                         | ❌                    |

### Decision: react-native-bootsplash

react-native-bootsplash was selected for its native implementation, active maintenance, and good TypeScript support. The native implementation ensures smooth performance and proper integration with the app lifecycle.

**Note**: react-native-bootsplash requires native setup for both iOS and Android platforms.

## Summary

| Library Category  | Selected Library        | Rationale                                                                   |
| ----------------- | ----------------------- | --------------------------------------------------------------------------- |
| **Charts**        | Victory Native          | Comprehensive chart types, high customization, excellent TypeScript support |
| **Forms**         | React Hook Form         | Excellent performance, small bundle size, strong TypeScript support         |
| **Splash Screen** | react-native-bootsplash | Native implementation, active maintenance, good TypeScript support          |

## Consequences

### Positive

1. **Charts**: Victory Native provides comprehensive charting capabilities with excellent customization
2. **Forms**: React Hook Form ensures fast, performant forms with minimal re-renders
3. **Splash Screen**: react-native-bootsplash provides smooth, native splash screen experience
4. **TypeScript**: All selected libraries have good TypeScript support
5. **Maintenance**: All libraries are actively maintained
6. **Performance**: All libraries are optimized for React Native

### Negative / Trade-offs

1. **Bundle Size**: Victory Native adds ~200kb to bundle size
   - **Mitigation**: Code splitting, lazy loading where possible
2. **Learning Curve**: Victory Native has a steeper learning curve
   - **Mitigation**: Good documentation, examples, team training
3. **Setup Complexity**: react-native-bootsplash requires native setup
   - **Mitigation**: Clear documentation, setup scripts

### Risks and Mitigations

| Risk                       | Impact | Mitigation                                                          |
| -------------------------- | ------ | ------------------------------------------------------------------- |
| Bundle size increase       | Medium | Monitor bundle size, use code splitting, optimize imports           |
| Learning curve             | Low    | Documentation, examples, code reviews, training sessions            |
| Native setup complexity    | Low    | Clear documentation, setup scripts, code reviews                    |
| Library maintenance issues | Low    | Monitor library updates, have migration plan, consider alternatives |

## When to Revisit

This decision should be reconsidered if:

- Bundle size becomes a critical concern
- Performance issues arise that cannot be solved
- Libraries become unmaintained or deprecated
- Better alternatives emerge that better fit the project's needs
- Project requirements change significantly
- Team consistently struggles with selected libraries despite training

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [Library Implementation Guide](../guides/library-implementation-guide.md) - Detailed implementation guide
- [Victory Native Documentation](https://formidable.com/open-source/victory/docs/native/) - Victory Native docs
- [React Hook Form Documentation](https://react-hook-form.com/) - React Hook Form docs
- [react-native-bootsplash Documentation](https://github.com/zoontek/react-native-bootsplash) - Bootsplash docs
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - Alternative charts library
- [Formik Documentation](https://formik.org/) - Alternative forms library
- Project Specification: `fintrack-spec-en.md`
