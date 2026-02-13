jest.mock('react-native-get-random-values', () => ({}));

jest.mock('bcryptjs', () => ({
  setRandomFallback: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

import { initBcryptRandomFallback } from '../initBcryptRandomFallback';

const mockSetRandomFallback = (bcrypt as unknown as { setRandomFallback: jest.Mock })
  .setRandomFallback;

describe('initBcryptRandomFallback', () => {
  const mockGetRandomValues = jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = i % 256;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as { crypto?: { getRandomValues: (a: Uint8Array) => void } }).crypto = {
      getRandomValues: mockGetRandomValues,
    };
  });

  afterEach(() => {
    delete (globalThis as { crypto?: unknown }).crypto;
  });

  it('calls bcrypt.setRandomFallback when crypto.getRandomValues is available', () => {
    initBcryptRandomFallback();

    expect(mockSetRandomFallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('sets a fallback that returns array of requested length filled via getRandomValues', () => {
    initBcryptRandomFallback();

    const fallback = mockSetRandomFallback.mock.calls[0][0] as (len: number) => number[];

    const result = fallback(32);

    expect(result).toHaveLength(32);
    expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
    expect(mockGetRandomValues.mock.calls[0][0]).toHaveLength(32);
    expect(result).toEqual(Array.from({ length: 32 }, (_, i) => i % 256));
  });

  it('does not call setRandomFallback when crypto is missing', () => {
    delete (globalThis as { crypto?: unknown }).crypto;

    initBcryptRandomFallback();

    expect(mockSetRandomFallback).not.toHaveBeenCalled();
  });

  it('does not throw when setRandomFallback is not a function', () => {
    mockSetRandomFallback.mockReset();
    Object.defineProperty(bcrypt, 'setRandomFallback', { value: undefined, configurable: true });
    expect(() => initBcryptRandomFallback()).not.toThrow();
  });
});
