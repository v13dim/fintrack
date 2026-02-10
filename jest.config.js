module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'index\\.(ts|tsx|js|jsx)$',
    '/testUtils/',
    '/assets/',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Business logic layer - higher thresholds
    'src/hooks/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // TODO(US-705): Add coverage for services and utils when they are implemented
    // 'src/services/**/*.ts': {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
    // 'src/utils/**/*.ts': {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
  },
};
