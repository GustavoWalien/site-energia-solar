import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://localhost:3200", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: "npm run build && npx next start -p 3200",
    url: "http://localhost:3200/",
    reuseExistingServer: false,
    timeout: 240_000,
    env: { EMAIL_TRANSPORTE: "teste" },
  },
});
