import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    root: '.',
    include: ['test/**/*.jsx', 'src/**/*.test.jsx', 'src/**/*.spec.jsx'],
  },
});
