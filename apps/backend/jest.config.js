module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/test/**/*.{js,ts}'
  ],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  // Add configuration for test environment
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  // Add JWT secret for testing
  globals: {
    JWT_SECRET: 'test-secret'
  }
};
