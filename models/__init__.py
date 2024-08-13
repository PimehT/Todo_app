#!/usr/bin/python3
"""
initialize the models package
"""

from os import getenv, environ
from dotenv import load_dotenv

# load dotenv
load_dotenv()

TEST_PATH = '/tmp/test_file.json'

storage_t = getenv("TODO_TYPE_STORAGE")

from models.base_model import BaseModel, Base
from models.category import Category
from models.comment import Comment
from models.task import Task
from models.user import User

CLASSES = {"BaseModel": BaseModel, "User": User, "Task": Task,
           "Category": Category, "Comment": Comment}

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
