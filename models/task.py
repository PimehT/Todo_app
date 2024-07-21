#!/usr/bin/python3
"""This module defines a class Task"""
import models
from models.base_model import BaseModel, Base
from models.comment import Comment
from models.task_category import TaskCategory
from os import getenv
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Task(BaseModel, Base):
    """This class defines a task with various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'tasks'
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        title = Column(String(128), nullable=False)
        description = Column(String(1024))
        status = Column(String(60), nullable=False)
        deadline = Column(DateTime, nullable=False)
        comments = relationship('Comment', backref='task',
                                cascade='all, delete-orphan')
        task_categories = relationship('TaskCategory',
                                       backref='task',
                                       cascade='all, delete-orphan')
    else:
        id = ''
        user_id = ''
        title = ''
        description = ''
        status = ''
        deadline = ''

    if models.storage_t != 'db':
        @property
        def comments(self):
            """getter for comments"""
            comments = []
            for comment in models.storage.all(Comment).values():
                if comment.task_id == self.id:
                    comments.append(comment)
            return comments

        @property
        def task_categories(self):
            """getter for task_categories"""
            task_categories = []
            for task_category in (models.storage
                                  .all(TaskCategory)
                                  .values()):
                if task_category.task_id == self.id:
                    task_categories.append(task_category)
            return task_categories
