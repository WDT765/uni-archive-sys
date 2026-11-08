// 用户模块路由
const express = require('express');
const router = express.Router();
const { success } = require('../utils/result');

// 1. 登录 POST /api/user/login
router.post('/login', (req, res) => {
  // TODO 业务逻辑待填充：
  // 1. 校验 username / password 参数（缺失返回400）
  // 2. 查询 user 表验证账号密码
  // 3. 验证通过返回用户信息（data中返回token或用户信息）
  success(res, {});
});

module.exports = router;
