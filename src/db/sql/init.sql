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

-- INSERT INTO user_table(username, password) VALUE ('user1', 'compass1');
-- test env
-- Create DB
CREATE DATABASE IF NOT EXISTS LoginTestDB;
-- Use DB
USE LoginTestDB;

DROP TABLE IF EXISTS user_table;
-- task schema
CREATE TABLE IF NOT EXISTS user_table(
    username varchar(50) NOT NULL,
    password varchar(250) NOT NULL,
    login_count int DEFAULT 0,
    last_attempt DATETIME DEFAULT NOW(),
    CONSTRAINT PRIMARY KEY (username)
);

-- create user: {username: user1, password: compass1.}
INSERT INTO user_table(username, password) VALUE ('user1', '$2b$12$ZVj50TJL56q0d0dJvogK2.8btFgBKz9Zdi69lsiB8pf0kGyO6Kvm2');
