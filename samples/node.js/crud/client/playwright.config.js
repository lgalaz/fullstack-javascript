import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry"
  },
  webServer: process.env.E2E_WEB_SERVER
    ? {
        command: process.env.E2E_WEB_SERVER,
        url: process.env.E2E_BASE_URL || "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120000
      }
    : undefined
});
