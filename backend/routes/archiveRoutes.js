// 教学档案模块路由：分页查询 / 新增 / 修改 / 删除
const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { success, fail } = require('../utils/result');
const { authenticate, requireRole } = require('../middleware/auth');

// 所有档案接口都需要先登录
router.use(authenticate);

// 1. 分页查询 GET /api/archive?page=1&size=10
// user 只能看自己的数据（manager = 当前用户名），admin 查看全部
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);   // 页码，最小为1
    const size = Math.max(parseInt(req.query.size) || 10, 1);  // 每页条数，最小为1
    const offset = (page - 1) * size;

    // admin 查全部，user 只查自己负责的档案
    const isAdmin = req.user.role === 'admin';
    const whereSql = isAdmin ? '' : 'WHERE manager = ?';
    const params = isAdmin ? [] : [req.user.username];

    // 查询总数，用于前端分页
    const [countRows] = await query(
      `SELECT COUNT(*) AS total FROM archive ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    // 查询当前页数据
    const [rows] = await query(
      `SELECT * FROM archive ${whereSql} ORDER BY create_time DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    return success(res, { list: rows, total, page, size });
  } catch (err) {
    console.error('查询档案异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// 2. 新增档案 POST /api/archive —— 仅 admin
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { archive_name, archive_type, manager, remark } = req.body || {};

    // 必填参数校验
    if (!archive_name || !archive_type || !manager) {
      return fail(res, 'archive_name、archive_type、manager 为必填项', 400);
    }

    // 插入数据（create_time 由数据库默认填充）
    const [result] = await query(
      'INSERT INTO archive (archive_name, archive_type, manager, remark) VALUES (?, ?, ?, ?)',
      [archive_name, archive_type, manager, remark || '']
    );

    return success(res, { id: result.insertId }, '新增成功');
  } catch (err) {
    console.error('新增档案异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// 3. 修改档案 PUT /api/archive/:id —— 仅 admin
router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { archive_name, archive_type, manager, remark } = req.body || {};

    if (!id) {
      return fail(res, '缺少档案 id', 400);
    }

    // 检查档案是否存在
    const [rows] = await query('SELECT id FROM archive WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return fail(res, '档案不存在', 404);
    }

    // 只更新传入的字段
    const fields = [];
    const params = [];
    if (archive_name !== undefined) { fields.push('archive_name = ?'); params.push(archive_name); }
    if (archive_type !== undefined) { fields.push('archive_type = ?'); params.push(archive_type); }
    if (manager !== undefined) { fields.push('manager = ?'); params.push(manager); }
    if (remark !== undefined) { fields.push('remark = ?'); params.push(remark); }

    if (fields.length === 0) {
      return fail(res, '没有需要更新的字段', 400);
    }

    params.push(id);
    await query(`UPDATE archive SET ${fields.join(', ')} WHERE id = ?`, params);

    return success(res, { id: Number(id) }, '修改成功');
  } catch (err) {
    console.error('修改档案异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

// 4. 删除档案 DELETE /api/archive/:id —— 仅 admin
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return fail(res, '缺少档案 id', 400);
    }

    const [result] = await query('DELETE FROM archive WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return fail(res, '档案不存在', 404);
    }

    return success(res, { id: Number(id) }, '删除成功');
  } catch (err) {
    console.error('删除档案异常:', err);
    return fail(res, '服务器异常', 500);
  }
});

module.exports = router;
