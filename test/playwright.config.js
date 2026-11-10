// Playwright 配置：阶段1登录与路由守卫测试
// 本配置文件位于 test 目录内，独立运行，不改动前端/后端任何代码
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // 用例所在目录
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5 * 1000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'reports/html', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
