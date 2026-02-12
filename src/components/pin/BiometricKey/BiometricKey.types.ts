export interface IBiometricKeyProps {
  /** Called when tappable and the key is pressed. */
  onPress?: () => void;
  /** Disables the key (only applies when tappable). */
  disabled?: boolean;
  /** Prefix for testID (e.g. "pin-keypad" → pin-keypad-key-biometric). */
  testID?: string;
  /** Accessibility label for the button (when tappable). */
  accessibilityLabel?: string;
}
