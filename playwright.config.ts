import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'screenshotTest',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: false,
    viewport: { width: 500, height: 500 },
    actionTimeout: 5000
  },
  webServer: {
    command: 'bun run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 500, height: 500 } } }
  ]
});
