# 阶段1登录自动化测试（Playwright）使用说明

> 约束声明：本目录下脚本为**独立测试脚本**，仅位于 `test` 目录内，不修改前端源码、后端代码、SQL 文件；只验证阶段1登录跳转与路由守卫两个核心场景，不做档案相关操作。

## 一、覆盖场景

| 用例ID | 场景 | 断言要点 |
|---|---|---|
| TC-LOGIN-001 | 输入非空账号密码，登录成功跳转 | 登录后 URL 跳转到 `/archive`，页面无白屏 |
| TC-LOGIN-005 | 未登录直接访问 `/archive`，被路由守卫拦截 | URL 不停留在 `/archive`，回到登录页并展示登录表单 |

## 二、前置条件

1. 前端分支 `feature-wang-qing-frontend` 已启动：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   确认浏览器可访问 http://localhost:5173
2. 登录方式为模拟假登录（账号、密码非空即登录成功）。

## 三、安装（首次执行，在 test 目录内）

```bash
cd test
npm install            # 安装 @playwright/test 依赖
npx playwright install chromium   # 安装 Chromium 浏览器内核
```

## 四、运行

```bash
cd test
npm test               # 无头模式运行
npm run test:headed    # 有头模式（可视化浏览器执行，便于观察）
npm run report         # 运行结束后查看 HTML 测试报告
```

- 测试报告输出：`test/reports/html/`（该目录为测试产物，可加入忽略清单）
- 失败用例自动截图保存在报告内，便于提交 bug 时引用。

## 五、脚本说明

- 脚本位置：`test/tests/login.spec.js`
- 配置位置：`test/playwright.config.js`（`baseURL` 固定为 `http://localhost:5173`）
- **选择器兼容策略**：由于登录页由前端同学实现，具体 DOM 结构未定，脚本对账号输入框、密码输入框、登录按钮均写了多重备选选择器（placeholder 含"账号/用户名"、`input[type="password"]`、按钮文案"登录/登 录/Login"等），按顺序尝试取第一个可见元素。
- 若实际页面结构与备选选择器均不匹配导致用例失败，**只允许修改 `test/tests/login.spec.js` 中的选择器数组**，不改前端任何代码。

## 六、常见问题

| 现象 | 处理 |
|---|---|
| `ECONNREFUSED` 连接失败 | 确认前端 dev server 已启动且端口为 5173 |
| 场景1卡在"找不到账号输入框" | 登录页路由可能不是根路径，把 `page.goto('/')` 改为实际登录路由 |
| 场景2误报失败 | 确认路由守卫基于 localStorage/sessionStorage/cookie 判断登录态；若用其他机制（如内存变量），需联系前端说明守卫实现方式后调整脚本等待逻辑 |
| 浏览器内核下载慢 | 可设置镜像：`set PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright` 后重试安装 |
