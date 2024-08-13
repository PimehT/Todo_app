#!/usr/bin/python3
"""This module defines a class Task"""
import models
from models.base_model import BaseModel, Base
from models.comment import Comment
from os import getenv
from sqlalchemy import (
    Column, String, ForeignKey, DateTime, Table, CheckConstraint
)
from sqlalchemy.orm import relationship

ALLOWED_STATUS_VALUES = ('Complete', 'Pending')

if models.storage_t == 'db':
    task_category = Table(
        'task_category', Base.metadata,
        Column(
            'task_id',
            String(60),
            ForeignKey('tasks.id', onupdate='CASCADE', ondelete='CASCADE')),
        Column(
            'category_id',
            String(60),
            ForeignKey('categories.id', onupdate='CASCADE', ondelete='CASCADE'))
    )


class Task(BaseModel, Base):
    """This class defines a task with various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'tasks'
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        title = Column(String(128), nullable=False)
        description = Column(String(1024))
        status = Column(
            String(60),
            CheckConstraint(f"status IN {ALLOWED_STATUS_VALUES}"),
            nullable=False,
            )
        deadline = Column(DateTime, nullable=False)
        comments = relationship('Comment', backref='task',
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

        # @property
        # def task_categories(self):
        #     """getter for task_categories"""
        #     task_categories = []
        #     for task_category in (models.storage
        #                           .all(TaskCategory)
        #                           .values()):
        #         if task_category.task_id == self.id:
        #             task_categories.append(task_category)
        #     return task_categories
