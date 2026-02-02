import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'rtl',
    environment: 'jsdom',
    include: ['tests/rtl/**/*.test.jsx'],
    setupFiles: ['./tests/setup/setup-tests.jsx'],
  },
});
