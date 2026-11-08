-- ============================================
-- 高校教学档案管理系统 建表SQL
-- 数据库：uni_archive_sys
-- ============================================

CREATE DATABASE IF NOT EXISTS uni_archive_sys DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE uni_archive_sys;

-- 表1：user 用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` VARCHAR(30) NOT NULL COMMENT '登录账号',
  `password` VARCHAR(60) NOT NULL COMMENT '密码',
  `real_name` VARCHAR(50) DEFAULT '' COMMENT '用户真实姓名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 表2：archive 教学档案表
DROP TABLE IF EXISTS `archive`;
CREATE TABLE `archive` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `archive_name` VARCHAR(100) NOT NULL COMMENT '档案名称',
  `archive_type` VARCHAR(40) NOT NULL COMMENT '档案类型',
  `manager` VARCHAR(50) NOT NULL COMMENT '负责人',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `remark` VARCHAR(200) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教学档案表';

-- 初始化测试账号（密码：123456，仅用于骨架自测）
INSERT INTO `user` (`username`, `password`, `real_name`)
VALUES ('admin', '123456', '系统管理员');
