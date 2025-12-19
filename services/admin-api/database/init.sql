CREATE DATABASE IF NOT EXISTS admin_api DEFAULT CHARACTER SET utf8mb4;
USE admin_api;
-- 删除
-- DROP TABLE IF EXISTS users;
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50),
    org_id BIGINT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 组织表
CREATE TABLE IF NOT EXISTS org(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT NULL,
    org_name VARCHAR(50) NOT NULL
);
-- 创建会话表
CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('single', 'group') NOT NULL DEFAULT 'single',
    title VARCHAR(100) NULL,
    avatar VARCHAR(255) NULL,
    last_message_id BIGINT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 会话参与者
CREATE TABLE IF NOT EXISTS conversation_participants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    last_read_message_id BIGINT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type ENUM('text', 'image', 'file', 'system', 'custom') NOT NULL DEFAULT 'text',
    content TEXT NULL,
    extra JSON NULL,
    is_recalled BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 消息状态表
CREATE TABLE IF NOT EXISTS message_status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    -- 接收者（单聊 1 对 1；群聊 N 对 1）
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME NULL
);
-- 消息附件表
CREATE TABLE message_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    message_id BIGINT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'video', 'audio', 'file') NOT NULL,
    file_size BIGINT NULL,
    extra JSON NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);