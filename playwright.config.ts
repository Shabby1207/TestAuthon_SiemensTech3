import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests_Plawright',
  reporter: 'html',
  use: {
    headless: false,
    trace: 'on-first-retry',
     video: 'retain-on-failure',
  },


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox',
      }
    }

  ],
  workers: 2
});
