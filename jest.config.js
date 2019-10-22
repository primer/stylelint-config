module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', 'plugins/**/*.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/utils/setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '__tests__/utils']
}
