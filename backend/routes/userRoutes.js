// 用户管理模块路由（前缀 /api/user）
// 包含：新增 / 查询列表 / 修改 / 删除，全部需要 token 鉴权
const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { success, fail } = require('../utils/result');
const { authenticate } = require('../middleware/auth');

// 所有用户管理接口统一挂载鉴权中间件
router.use(authenticate);

// ==================== 新增用户 POST /api/user ====================
// 入参：username、password、nickname、phone，username 不能重复，返回数据剔除 password
router.post('/', async (req, res) => {
  try {
    const { username, password, nickname, phone } = req.body || {};

    // 必填参数校验
    if (!username || !password) {
      return fail(res, 'username 和 password 为必填项', 400);
    }

    // 校验 username 不能重复
    const [exist] = await query(
      'SELECT id FROM `user` WHERE username = ? LIMIT 1',
      [username]
    );
    if (exist.length > 0) {
      return fail(res, '用户名已存在', 400);
    }

    // 插入新用户
    const [result] = await query(
      'INSERT INTO `user` (username, password, nickname, phone) VALUES (?, ?, ?, ?)',
      [username, String(password), nickname || '', phone || '']
    );

    // 返回数据剔除 password 字段
    return success(res, {
      id: result.insertId,
      username,
      nickname: nickname || '',
      phone: phone || ''
    }, '新增用户成功');
  } catch (err) {
    console.error('新增用户异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// ==================== 查询用户列表 GET /api/user ====================
// 返回全部用户列表，结果中不返回 password
router.get('/', async (req, res) => {
  try {
    // 只查询需要的字段，password 不返回
    const [rows] = await query(
      'SELECT id, username, nickname, phone FROM `user` ORDER BY id ASC'
    );

    return success(res, { list: rows, total: rows.length });
  } catch (err) {
    console.error('查询用户列表异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// ==================== 修改用户 PUT /api/user/:id ====================
// 入参：nickname、phone，支持只传其中一项局部更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, phone } = req.body || {};

    // 检查用户是否存在
    const [exist] = await query('SELECT id FROM `user` WHERE id = ? LIMIT 1', [id]);
    if (exist.length === 0) {
      return fail(res, '用户不存在', 404);
    }

    // 拼接需要更新的字段，支持只传其中一项
    const fields = [];
    const params = [];
    if (nickname !== undefined) { fields.push('nickname = ?'); params.push(nickname); }
    if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }

    if (fields.length === 0) {
      return fail(res, 'nickname 和 phone 至少传一个', 400);
    }

    params.push(id);
    await query(`UPDATE \`user\` SET ${fields.join(', ')} WHERE id = ?`, params);

    // 返回更新后的用户信息（剔除 password）
    const [rows] = await query(
      'SELECT id, username, nickname, phone FROM `user` WHERE id = ? LIMIT 1',
      [id]
    );

    return success(res, rows[0], '修改成功');
  } catch (err) {
    console.error('修改用户异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// ==================== 删除用户 DELETE /api/user/:id ====================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await query('DELETE FROM `user` WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return fail(res, '用户不存在', 404);
    }

    return success(res, { id: Number(id) }, '删除成功');
  } catch (err) {
    console.error('删除用户异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

module.exports = router;
