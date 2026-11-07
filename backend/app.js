// 高校教学档案管理系统 后端入口
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const { fail } = require('./utils/result');

const app = express();

// ---------- 全局中间件 ----------
// 跨域配置：允许前端开发地址跨域访问
app.use(cors());

// 解析JSON与表单请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- 路由注册 ----------
// 登录接口（无需鉴权）
app.use('/api', authRoutes);

// 档案 CRUD 接口（内部含 JWT 鉴权与角色校验中间件）
app.use('/api/archive', archiveRoutes);

// 404 兜底
app.use((req, res) => {
  fail(res, '接口不存在', 404);
});

// 全局异常处理，统一返回500
app.use((err, req, res, next) => {
  console.error('服务器异常:', err);
  fail(res, '服务器异常', 500);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`);
});
