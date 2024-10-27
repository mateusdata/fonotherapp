module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  };
  