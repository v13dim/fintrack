module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'import',
    'simple-import-sort',
  ],
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          constants: './src/constants',
          contexts: './src/contexts',
          db: './src/db',
          hooks: './src/hooks',
          localization: './src/localization',
          navigation: './src/navigation',
          screens: './src/screens',
          services: './src/services',
          store: './src/store',
          testUtils: './src/testUtils',
          theme: './src/theme',
          utils: './src/utils',
        },
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-empty-function': 'warn',

    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'warn',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Native rules
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off', // Can be too strict
    'react-native/sort-styles': 'off', // Prettier handles formatting

    // Import/Export rules
    'import/no-unresolved': ['error', { ignore: ['^react-native$'] }],
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'off', // Can cause issues with some external modules
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'off', // Can be slow

    // Simple Import Sort - порядок импортов согласно документации проекта
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // 0. Mock files first (must load before tested modules)
          ['^.*__mocks__.*$'],
          // 1. External dependencies (React, React Native, third-party)
          [
            '^react$',
            '^react-native$',
            '^react',
            '^@react',
            '^@react-native',
            '^@?\\w', // Other external packages
          ],
          // 2. Internal absolute imports (by layer, alphabetical order)
          // Navigation
          ['^navigation(/.*|$)'],
          // Components
          ['^components(/.*|$)'],
          // Hooks
          ['^hooks(/.*|$)'],
          // Services
          ['^services(/.*|$)'],
          // Utils
          ['^utils(/.*|$)'],
          // Theme
          ['^theme(/.*|$)'],
          // Constants
          ['^constants(/.*|$)'],
          // Localization
          ['^localization(/.*|$)'],
          // Other internal absolute imports (assets, db, store, testUtils)
          ['^(assets|db|store|testUtils)(/.*|$)'],
          // 3. Relative imports
          ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Using @typescript-eslint/no-unused-vars instead
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx', '__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
