export interface IFullScreenLoaderProps {
  /** When true, the loader overlay is visible. */
  visible: boolean;
  /** Optional message below the spinner (e.g. "Processing..."). */
  message?: string;
  testID?: string;
}
