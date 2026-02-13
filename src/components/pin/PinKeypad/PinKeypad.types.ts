export interface IPinKeypadProps {
  /** Called when user taps a digit (0–9). */
  onDigit: (digit: string) => void;
  /** Called when user taps backspace. */
  onBackspace: () => void;
  /** Disable all keys (e.g. during lockout). */
  disabled?: boolean;
  /** If true, show biometric placeholder (🔐) in the bottom-left cell. */
  showBiometricPlaceholder?: boolean;
  /** When set with showBiometricPlaceholder, the 🔐 cell is tappable and calls this (e.g. trigger Face ID). */
  onBiometricPress?: () => void;
  /** Prefix for testID of keys (e.g. "pin-input" → pin-input-key-1). */
  testID?: string;
}
