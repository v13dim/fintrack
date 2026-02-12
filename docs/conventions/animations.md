# Animation Conventions

All animations in FinTrack use **react-native-reanimated**. We do not use React Native's built-in `Animated` API.

## Why Reanimated

- Runs on the **UI thread** (better performance, no JS thread blocking).
- Rich API: `withTiming`, `withSpring`, layout animations, gestures.
- Same mental model as RN Animated but with better defaults and fewer limitations.

## Standard pattern

1. **Shared values** — `useSharedValue(initialValue)` for any value that drives an animation (opacity, translateX, etc.).
2. **Animated style** — `useAnimatedStyle(() => ({ ... }))` that reads shared values and returns a style object. Pass the result to `Animated.View` (or other `Animated.*` from reanimated).
3. **Trigger** — Update shared values (e.g. in `useEffect` when state changes), using `withTiming` or `withSpring` for smooth transitions.

```typescript
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// In component:
const opacity = useSharedValue(1);
const translateX = useSharedValue(0);

useEffect(() => {
  opacity.value = 0;
  translateX.value = 50;
  opacity.value = withTiming(1, { duration: 250 });
  translateX.value = withTiming(0, { duration: 250 });
}, [someDependency]);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateX: translateX.value }],
}));

return <Animated.View style={[styles.box, animatedStyle]} />;
```

## Imports

- Use `Animated` (default) and named exports from `react-native-reanimated`: `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`, etc.
- Do **not** import `Animated` from `react-native` for new animation code.

## Testing

- In tests, mock `react-native-reanimated` (e.g. in the screen's `__mocks__/*.module-mocks.ts`) so that `useSharedValue`, `useAnimatedStyle`, `withTiming`, and `Animated.View` are available without the native module. Example: `useSharedValue(initial)` returns `{ value: initial }`, `useAnimatedStyle(fn)` returns `fn()`, `Animated.View` can be replaced with `View` from `react-native`.

## References

- [Reanimated docs](https://docs.swmansion.com/react-native-reanimated)
- `.cursorrules` — "Animations" subsection
- Example: `src/screens/OnboardingScreen/OnboardingScreen.tsx`
