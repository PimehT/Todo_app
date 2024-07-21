#!/usr/bin/python3
"""
initialize the models package
"""

from os import getenv, environ


TEST_PATH = '/tmp/test_file.json'

storage_t = getenv("TODO_TYPE_STORAGE")

# set storage type
if getenv('TODO_ENV') is not None:
    from models.engine.file_storage import FileStorage
    FileStorage._FileStorage__file_path = TEST_PATH
    environ['TODO_MYSQL_DB'] = 'todo_test_db'

if storage_t == "db":
    from models.engine.db_storage import DBStorage
    storage = DBStorage()
else:
    from models.engine.file_storage import FileStorage
    storage = FileStorage()
storage.reload()
