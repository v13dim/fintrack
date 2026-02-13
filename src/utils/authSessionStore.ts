/**
 * In-memory session flag for the current app process.
 * Survives React tree remounts (e.g. error boundary) but resets on cold start.
 * Used by AuthProvider to restore isAuthenticated after remount.
 */

let sessionActive = false;

export function getSession(): boolean {
  return sessionActive;
}

export function setSession(value: boolean): void {
  sessionActive = value;
}
