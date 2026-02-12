export interface IPageIndicatorProps {
  /** Current step index (0-based). */
  currentIndex: number;
  /** Total number of steps (dots). */
  totalCount: number;
  /** Optional testID prefix for dots (e.g. "page-dot" → "page-dot-0", "page-dot-active" for active). */
  testID?: string;
}
