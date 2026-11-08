// MySQL 数据库连接配置
const mysql = require('mysql2/promise');

// 连接池配置（按本机实际情况修改密码）
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'uni_archive_sys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 统一执行SQL的方法，业务代码中直接调用 query(sql, params)
function query(sql, params = []) {
  return pool.execute(sql, params);
}

module.exports = { pool, query };
