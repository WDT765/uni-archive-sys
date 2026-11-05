// 全局统一返回结果封装
// 统一JSON格式：{"code":200,"msg":"操作成功","data":{}}
// code 含义：200成功，400参数错误，401未登录，500服务器异常

function success(res, data = {}, msg = '操作成功') {
  res.json({ code: 200, msg, data });
}

function fail(res, msg = '操作失败', code = 400, data = {}) {
  res.json({ code, msg, data });
}

module.exports = { success, fail };
