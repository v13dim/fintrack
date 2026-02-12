import React from 'react';

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

const asyncStorageMock: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(asyncStorageMock[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    asyncStorageMock[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete asyncStorageMock[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(asyncStorageMock).forEach(k => delete asyncStorageMock[k]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(asyncStorageMock))),
  multiGet: jest.fn((keys: string[]) =>
    Promise.resolve(keys.map(key => [key, asyncStorageMock[key] ?? null])),
  ),
  multiSet: jest.fn((pairs: [string, string][]) => {
    pairs.forEach(([k, v]) => {
      asyncStorageMock[k] = v;
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach(k => delete asyncStorageMock[k]);
    return Promise.resolve();
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts?.seconds !== undefined ? `${key} ${opts.seconds}` : key,
    i18n: {},
  }),
}));

jest.mock('react-native-get-random-values', () => ({}));

jest.mock('react-native-svg', () => {
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => mockCreateReactElement('Svg', props),
    G: (props: Record<string, unknown>) => mockCreateReactElement('G', props),
    Path: (props: Record<string, unknown>) => mockCreateReactElement('Path', props),
    Circle: (props: Record<string, unknown>) => mockCreateReactElement('Circle', props),
    Rect: (props: Record<string, unknown>) => mockCreateReactElement('Rect', props),
    Svg: (props: Record<string, unknown>) => mockCreateReactElement('Svg', props),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
}));
