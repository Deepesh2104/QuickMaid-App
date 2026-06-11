/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(expo-crypto|expo-modules-core)/)'],
};
