# ADR-006: Chart Library Selection

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a charting library for FinTrack. The application requires:

- **Pie charts**: For displaying expenses by category breakdown
- **Line charts**: For displaying spending trends over time
- **Customizable styling**: Colors, labels, and visual appearance
- **Smooth animations**: For better user experience
- **TypeScript support**: Full type safety required

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture enabled
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Smooth animations, fast rendering, minimal bundle size impact
- **Offline-first**: Library must work offline
- **Maintainability**: Active maintenance, good documentation, community support
- **Testability**: Library must be easily mockable for testing
- **Developer Experience**: Good TypeScript support, clear APIs, debugging tools

## Considered Options

### Option A: Victory Native (Selected)

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

### Option B: React Native Chart Kit

React Native Chart Kit is a simple charting library for React Native.

- ✅ Simple API, easy to use
- ✅ Small bundle size (~50kb)
- ✅ Good for basic charts
- ✅ Active maintenance
- ❌ Limited customization
- ❌ Fewer chart types
- ❌ Less flexible than Victory
- ❌ Weaker TypeScript support

### Option C: react-native-gifted-charts

A modern charting library with a focus on performance and customization.

- ✅ Good performance
- ✅ Modern API
- ✅ Customizable
- ✅ Active maintenance
- ❌ Smaller community
- ❌ Less mature
- ❌ Limited documentation

## Evaluation Matrix

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

## Decision

We will adopt **Victory Native** as the charting library for FinTrack.

## Rationale

Victory Native was selected for the following reasons:

1. **Comprehensive Chart Types**: Supports all required chart types (pie, line) with excellent quality
2. **High Customization**: Highly customizable colors, animations, and labels to match design requirements
3. **TypeScript Support**: Excellent TypeScript support ensures type safety
4. **Powerful Foundation**: Built on D3 provides powerful data visualization capabilities
5. **Active Maintenance**: Actively maintained with good documentation
6. **Smooth Animations**: Excellent animation support for better UX

While Victory Native has a larger bundle size (~200kb) and steeper learning curve, the flexibility, power, and comprehensive feature set justify the trade-off for a financial tracking application that requires rich data visualization.

**Note**: Victory Native requires peer dependencies:

- `react-native-svg` - for rendering SVG graphics
- `react-native-reanimated` - for animations
- `react-native-gesture-handler` - for gesture handling
- `@shopify/react-native-skia` - for high-performance rendering
- `react-native-worklets` - for worklet support (required by reanimated)

## Consequences

### Positive

1. **Rich Visualizations**: Comprehensive chart types with excellent customization
2. **Type Safety**: Excellent TypeScript support ensures type safety
3. **Flexibility**: Highly customizable to match design requirements
4. **Performance**: Smooth animations and fast rendering
5. **Maintenance**: Active maintenance with good documentation
6. **Future-proof**: Built on D3, a powerful and mature data visualization library

### Negative / Trade-offs

1. **Bundle Size**: Victory Native adds ~200kb to bundle size
   - **Mitigation**: Code splitting, lazy loading where possible
2. **Learning Curve**: Victory Native has a steeper learning curve
   - **Mitigation**: Good documentation, examples, team training
3. **Peer Dependencies**: Requires multiple peer dependencies
   - **Mitigation**: Document dependencies clearly, ensure compatibility

### Risks and Mitigations

| Risk                 | Impact | Mitigation                                                          |
| -------------------- | ------ | ------------------------------------------------------------------- |
| Bundle size increase | Medium | Monitor bundle size, use code splitting, optimize imports           |
| Learning curve       | Low    | Documentation, examples, code reviews, training sessions            |
| Dependency conflicts | Low    | Regular dependency updates, compatibility testing                   |
| Library maintenance  | Low    | Monitor library updates, have migration plan, consider alternatives |

## When to Revisit

This decision should be reconsidered if:

- Bundle size becomes a critical concern (e.g., >5MB increase) and cannot be mitigated
- Performance issues arise that cannot be solved
- Library becomes unmaintained or deprecated
- Better alternatives emerge that better fit the project's needs
- Project requirements change significantly (e.g., need for 3D charts, real-time updates)
- Team consistently struggles with Victory Native despite training

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-007: Form Library Selection](./ADR-007-form-library-selection.md) - Form library decision
- [ADR-008: Splash Screen Library Selection](./ADR-008-splash-screen-library-selection.md) - Splash screen library decision
- [Chart Library Implementation Guide](../guides/chart-library-implementation-guide.md) - Detailed implementation guide
- [Victory Native Documentation](https://formidable.com/open-source/victory/docs/native/) - Victory Native docs
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - Alternative charts library
- Project Specification: `fintrack-spec-en.md`
