/**
 * Ensures bcrypt has a secure random source in React Native, where neither
 * WebCryptoAPI nor Node's crypto is available. Call once before using bcrypt
 * (e.g. hashSync). Depends on react-native-get-random-values polyfill.
 */
import * as bcrypt from 'bcryptjs';

import 'react-native-get-random-values';

export function initBcryptRandomFallback(): void {
  const crypto = (globalThis as { crypto?: { getRandomValues: (a: Uint8Array) => void } }).crypto;
  if (
    typeof (bcrypt as { setRandomFallback?: (fn: (len: number) => number[]) => void })
      .setRandomFallback === 'function' &&
    crypto?.getRandomValues
  ) {
    (bcrypt as { setRandomFallback: (fn: (len: number) => number[]) => void }).setRandomFallback(
      (len: number) => {
        const arr = new Uint8Array(len);
        crypto.getRandomValues(arr);
        return Array.from(arr);
      },
    );
  }
}
