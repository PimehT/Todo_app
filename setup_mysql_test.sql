-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS todo_test_db;
CREATE USER IF NOT EXISTS 'todo_test'@'localhost' IDENTIFIED BY 'todo_test_pwd';
GRANT ALL PRIVILEGES ON `todo_test_db`.* TO 'todo_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'todo_test'@'localhost';
FLUSH PRIVILEGES;


-- export TODO_ENV="{environment}" TODO_MYSQL_USER="{mysql_username}" TODO_MYSQL_PWD="{mysql_password}" TODO_MYSQL_HOST="{mysql_hostname}" TODO_MYSQL_DB="{mysql_dbname}" TODO_TYPE_STORAGE="{storage_type}"
