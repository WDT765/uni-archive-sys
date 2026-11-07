// 认证模块路由：登录接口
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { success, fail } = require('../utils/result');
const { JWT_SECRET } = require('../middleware/auth');

// 登录接口 POST /api/login
// 入参：{ username, password }，返回：{ token, role }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // 1. 参数校验
    if (!username || !password) {
      return fail(res, '用户名和密码不能为空', 400);
    }

    // 2. 查询用户表验证账号密码
    // 说明：init.sql 中密码为明文存储（测试数据），这里直接比对
    const [rows] = await query(
      'SELECT id, username, password, real_name FROM `user` WHERE username = ? LIMIT 1',
      [username]
    );

    const user = rows[0];
    if (!user || user.password !== String(password)) {
      return fail(res, '用户名或密码错误', 400);
    }

    // 3. 确定角色：用户表无角色字段，约定 username 为 admin 即管理员，其余为普通用户
    const role = user.username === 'admin' ? 'admin' : 'user';

    // 4. 签发 JWT（有效期 24 小时）
    const token = jwt.sign(
      { id: user.id, username: user.username, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return success(res, { token, role }, '登录成功');
  } catch (err) {
    console.error('登录异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

module.exports = router;
