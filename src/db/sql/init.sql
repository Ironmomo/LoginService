-- Create DB
CREATE DATABASE IF NOT EXISTS LoginDB;
-- Use DB
USE LoginDB;

-- task schema
CREATE TABLE IF NOT EXISTS user_table(
    username varchar(50) NOT NULL,
    password varchar(250) NOT NULL,
    login_count int DEFAULT 0,
    last_attempt DATETIME DEFAULT NOW(),
    CONSTRAINT PRIMARY KEY (username)
);

-- test env
-- task schema
CREATE TABLE IF NOT EXISTS test_table(
    username varchar(50) NOT NULL,
    password varchar(250) NOT NULL,
    login_count int DEFAULT 0,
    last_attempt DATETIME DEFAULT NOW(),
    CONSTRAINT PRIMARY KEY (username)
);

-- Default users for testing
INSERT INTO test_table(username, password) VALUE ('user1', 'compass1');