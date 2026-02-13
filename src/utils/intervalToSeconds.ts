/**
 * Converts an interval string (e.g. '30', '60', '300') to seconds.
 * Returns null for 'never' or invalid values.
 */
export function intervalToSeconds(interval: string): number | null {
  if (interval === 'never') return null;
  const n = Number.parseInt(interval, 10);
  return Number.isNaN(n) ? null : n;
}
