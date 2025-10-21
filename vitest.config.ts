import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.test.*', 'src/tests/**/*.spec.*'],
    exclude: ['e2e/**', 'node_modules']
  }
})
