#!/usr/bin/python3
"""This module defines a class TaskCategory"""
import models
from models.base_model import BaseModel, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey


class TaskCategory(BaseModel, Base):
    """This class defines a task category with various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'task_categories'
        task_id = Column(String(60), ForeignKey('tasks.id'), nullable=False,
                         primary_key=True)
        category_id = Column(String(60), ForeignKey('categories.id'),
                             nullable=False, primary_key=True)
    else:
        task_id = ''
        category_id = ''
