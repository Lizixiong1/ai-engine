CREATE DATABASE IF NOT EXISTS admin_api DEFAULT CHARACTER SET utf8mb4;
USE admin_api;
-- 删除
DROP TABLE IF EXISTS users;
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50),
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 初始化用户表数据
INSERT INTO users (username, password, email)
VALUES('admin', '123456', 'a@qq.com');