// 档案模块路由
const express = require('express');
const router = express.Router();
const { success } = require('../utils/result');

// 2. 新增档案 POST /api/archive/add
router.post('/add', (req, res) => {
  // TODO 业务逻辑待填充：
  // 1. 校验 archive_name / archive_type / manager 必填参数（缺失返回400）
  // 2. 插入 archive 表
  success(res, {});
});

// 3. 查询档案 GET /api/archive/list
router.get('/list', (req, res) => {
  // TODO 业务逻辑待填充：
  // 1. 支持按 archive_name / archive_type 模糊查询（可选）
  // 2. 查询 archive 表返回列表
  success(res, {});
});

// 4. 修改档案 PUT /api/archive/update
router.put('/update', (req, res) => {
  // TODO 业务逻辑待填充：
  // 1. 校验 id 必传，校验其他参数
  // 2. 更新 archive 表
  success(res, {});
});

// 5. 删除档案 DELETE /api/archive/delete
router.delete('/delete', (req, res) => {
  // TODO 业务逻辑待填充：
  // 1. 校验 id 必传（从 req.query 或 req.body 获取）
  // 2. 删除 archive 表对应记录
  success(res, {});
});

module.exports = router;
