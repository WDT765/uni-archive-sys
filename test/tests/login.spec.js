// 阶段1登录与路由守卫自动化测试
// 场景1：输入非空账号密码，登录成功跳转到档案页
// 场景2：未登录直接访问 /archive，被路由守卫拦截跳回登录页
// 说明：当前前端为模拟假登录（账号密码非空即登录成功），未对接后端接口。
// 选择器采用"多重备选"写法，兼容常见的登录页实现（placeholder / type / 按钮文案），
// 如与实际页面不一致，请按实际 DOM 微调选择器即可，无需改动前端代码。

const { test, expect } = require('@playwright/test');

// 常见的账号输入框备选选择器
const accountInputLocators = [
  'input[placeholder*="账号"]',
  'input[placeholder*="用户名"]',
  'input[placeholder*="username" i]',
  'input[type="text"]',
];
// 常见的密码输入框备选选择器
const passwordInputLocators = [
  'input[placeholder*="密码"]',
  'input[placeholder*="password" i]',
  'input[type="password"]',
];
// 常见的登录按钮备选选择器
const loginButtonLocators = [
  'button:has-text("登录")',
  'button:has-text("登 录")',
  'button:has-text("Login")',
  '[class*="login"] button',
];

/** 依次尝试备选选择器，返回第一个可见的元素 locator */
async function pickVisible(page, locatorStrings) {
  for (const sel of locatorStrings) {
    const loc = page.locator(sel).first();
    if (await loc.isVisible().catch(() => false)) return loc;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 场景1：正向登录（对应测试用例 TC-LOGIN-001）
// ─────────────────────────────────────────────────────────────
test('TC-LOGIN-001: 输入非空账号密码，登录成功跳转到档案页', async ({ page }) => {
  // 1. 打开登录页
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. 输入非空账号
  const accountInput = await pickVisible(page, accountInputLocators);
  expect(accountInput, '页面上应能找到账号输入框').toBeTruthy();
  await accountInput.fill('admin');

  // 3. 输入非空密码
  const passwordInput = await pickVisible(page, passwordInputLocators);
  expect(passwordInput, '页面上应能找到密码输入框').toBeTruthy();
  await passwordInput.fill('123456');

  // 4. 点击登录按钮
  const loginButton = await pickVisible(page, loginButtonLocators);
  expect(loginButton, '页面上应能找到登录按钮').toBeTruthy();
  await loginButton.click();

  // 5. 预期：登录成功，跳转到档案页（hash 或 history 两种路由模式均兼容）
  await page.waitForURL(/archive/i, { timeout: 10 * 1000 });
  expect(page.url()).toMatch(/archive/i);

  // 6. 档案页无白屏：页面主体内容可见
  await expect(page.locator('body')).toBeVisible();
});

// ─────────────────────────────────────────────────────────────
// 场景2：路由守卫拦截（对应测试用例 TC-LOGIN-005）
// ─────────────────────────────────────────────────────────────
test('TC-LOGIN-005: 未登录直接访问 /archive，被路由守卫拦截跳回登录页', async ({ page }) => {
  // 1. 确保未登录：清空所有本地存储（隐身式全新会话）
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  // 2. 未登录状态下直接访问 /archive
  await page.goto('/archive');
  await page.waitForLoadState('domcontentloaded');

  // 3. 预期：被路由守卫重定向回登录页（URL 不再是 /archive，回到登录页路径或根路径）
  await page.waitForTimeout(1000); // 等待路由守卫完成重定向
  expect(page.url(), '未登录访问 /archive 应被重定向，URL 不应停留在 /archive').not.toMatch(/archive/i);

  // 4. 预期：页面上重新出现登录表单（账号/密码输入框或登录按钮）
  const accountInput = await pickVisible(page, accountInputLocators);
  const passwordInput = await pickVisible(page, passwordInputLocators);
  const loginButton = await pickVisible(page, loginButtonLocators);
  const onLoginForm = Boolean(accountInput || passwordInput || loginButton);
  expect(onLoginForm, '重定向后应展示登录页元素（输入框或登录按钮）').toBe(true);
});
