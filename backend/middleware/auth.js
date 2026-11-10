// JWT 鉴权中间件
const jwt = require('jsonwebtoken');
const { fail } = require('../utils/result');

// JWT 签名密钥（生产环境建议放到环境变量中）
const JWT_SECRET = 'uni_archive_sys_secret';

// 鉴权中间件：校验请求头中的 token，解析出用户信息挂到 req.user 上
function authenticate(req, res, next) {
  // 从 Authorization: Bearer <token> 中提取 token
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return fail(res, '未登录，请先登录', 401);
  }

  try {
    // 校验并解析 token，得到 { id, username, role }
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return fail(res, 'token 无效或已过期', 401);
  }
}

// 角色权限中间件工厂：只允许指定角色访问，例如 requireRole('admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, '无权限执行该操作', 403);
    }
    next();
  };
}

module.exports = { authenticate, requireRole, JWT_SECRET };
