import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Resolves the "@/*" paths from tsconfig.json. Vite does this natively now,
  // so the vite-tsconfig-paths plugin the Next guide suggests is not needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    // e2e/ belongs to Playwright, and .kilo holds nested agent worktrees of
    // this same repo — picking either up would run the suite twice.
    exclude: ['node_modules/**', 'e2e/**', '.kilo/**', '.next/**'],
  },
})
