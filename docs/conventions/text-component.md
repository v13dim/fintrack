# Text Component Convention

## Rule

**All user-facing and UI text in the app must use the shared `Text` component from `components/common/Text`** (import from `components` or `components/common`). Do not use React Native’s built-in `Text` for app UI.

## Why

- **Consistency**: Single place for typography (variants, colors) and theme integration.
- **Accessibility**: Central place to add accessibility props and behavior.
- **Theme**: Text uses theme typography and colors via `createStyles` and ThemeContext.
- **Maintainability**: Changing styles or behavior is done in one component.

## Usage

- **Import**: `import { Text } from 'components';` or `import { Text } from 'components/common';`
- **Compound syntax**: Always use the compound components for the variant: `Text.H1`, `Text.H2`, `Text.H3`, `Text.H4`, `Text.Body`, `Text.BodySmall`, `Text.Caption`, `Text.Label`, `Text.Button`. Do not use `<Text variant="…">`; use `<Text.H2>`, `<Text.Body>`, etc. instead.
- **Colors**: Use the `color` prop: `primary`, `secondary`, `tertiary`, `accentDark`, `accentMedium`, `white`, `inverse`.
- **Overrides**: Pass `style` when you need to override (e.g. error color, custom fontSize). Prefer theme colors via `color` when possible.

## Examples

```tsx
// Heading
<Text.H2 color="primary">Title</Text.H2>

// Body with center align
<Text.Body color="secondary" center>{description}</Text.Body>

// With custom style (e.g. error message)
<Text.BodySmall style={styles.error}>Invalid PIN</Text.BodySmall>

// Button label (inside Button component)
<Text.Button style={styles.label}>{children}</Text.Button>
```

## Exceptions

- **Test files**: Using React Native’s `Text` (or a simple node) in tests is fine when testing theme/context or when the test does not render the app’s `Text` component.
- **Third-party components**: When a library renders text internally, we don’t replace it; prefer components that allow custom render or styling when possible.

## References

- Implementation: `src/components/common/Text/`
- Theme typography: `src/theme/theme.types.ts` (`TypographyKey`), `src/theme/typography.ts`
- Theme colors: `src/theme/theme.types.ts` (`TextColorVariant` in `Text.types.ts`)
