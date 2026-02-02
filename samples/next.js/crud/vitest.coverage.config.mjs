import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js', 'tests/rtl/**/*.test.jsx'],
    setupFiles: ['./tests/setup/setup-tests.jsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.jsx', 'lib/**/*.js'],
      exclude: ['tests/**', '**/*.test.*'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
