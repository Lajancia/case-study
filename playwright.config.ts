import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100)
const baseURL = `http://localhost:${PORT}`

/**
 * These specs check behaviour that only exists in a real build: the static
 * CSP headers next.config.ts declares, and the route-scoped chunk loading
 * the case studies claim. Both are erased by `next dev`'s eager compilation,
 * so the suite runs against `next build && next start`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // `npm run build`, not `npx next build`: the prebuild hook copies the
    // self-hosted RDKit assets into public/, and the route-scoped specs fail
    // without them.
    command: `npm run build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
