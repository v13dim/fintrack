export interface IPinInputProps {
  /** Current PIN digits (0–4 characters). */
  value: string;
  /** Called when user taps a digit (0–9). */
  onDigit: (digit: string) => void;
  /** Called when user taps backspace. */
  onBackspace: () => void;
  /** Disable keypad (e.g. during lockout). */
  disabled?: boolean;
  /** Title above the dots. */
  title?: string;
  /** Optional subtitle. */
  subtitle?: string;
  /** Error message below title (e.g. "PINs don't match"). */
  errorMessage?: string;
  /** If true, show biometric placeholder (🔐) instead of empty cell in bottom-left. */
  showBiometricPlaceholder?: boolean;
  /** When set with showBiometricPlaceholder, the 🔐 cell is tappable and calls this (e.g. trigger Face ID). */
  onBiometricPress?: () => void;
  testID?: string;
}
