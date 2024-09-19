-- prepares a MySQL server for the project

DROP DATABASE IF EXISTS todo_dev_db;

CREATE DATABASE IF NOT EXISTS todo_dev_db;
CREATE USER IF NOT EXISTS 'todo_dev'@'localhost' IDENTIFIED BY 'todo_dev_pwd';
GRANT ALL PRIVILEGES ON `todo_dev_db`.* TO 'todo_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'todo_dev'@'localhost';
FLUSH PRIVILEGES;
