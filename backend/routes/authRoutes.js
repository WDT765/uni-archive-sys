// 认证模块路由（前缀 /api/auth）
// 仅包含登录接口，token 有效期 10 分钟
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { success, fail } = require('../utils/result');
const { JWT_SECRET } = require('../middleware/auth');

// ==================== 登录 POST /api/auth/login ====================
// 不需要 token 鉴权
// 入参：username、password，成功返回 { token, id, username }，token 有效期 10 分钟
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // 参数校验
    if (!username || !password) {
      return fail(res, '用户名和密码不能为空', 400);
    }

    // 查询用户表验证账号密码（密码明文对比，方便调试，不使用 bcrypt）
    const [rows] = await query(
      'SELECT id, username, password FROM `user` WHERE username = ? LIMIT 1',
      [username]
    );

    const user = rows[0];
    if (!user || user.password !== String(password)) {
      return fail(res, '用户名或密码错误', 400);
    }

    // 签发 JWT，有效期 10 分钟
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '10m' }
    );

    return success(res, { token, id: user.id, username: user.username }, '登录成功');
  } catch (err) {
    // 捕获数据库等异常，统一返回
    console.error('登录异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

module.exports = router;
