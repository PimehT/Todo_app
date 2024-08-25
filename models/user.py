#!/usr/bin/python3
"""This module defines a class User"""
import models
from models.base_model import BaseModel, Base
from models.comment import Comment
from models.task import Task
from os import getenv
import sqlalchemy
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """This class defines a user by various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'users'


        uid = Column(String(60), nullable=False)
        username = Column(String(60), nullable=False)
        first_name = Column(String(128), nullable=False)
        last_name = Column(String(128), nullable=False)
        email = Column(String(128), nullable=False)
        password = Column(String(128), nullable=False)
        tasks = relationship('Task', backref='user',
                             cascade='all, delete-orphan')
        comments = relationship('Comment', backref='user',
                                cascade='all, delete-orphan')
    else:
        name = ''
        email = ''
        password = ''

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    if models.storage_t != 'db':
        @property
        def tasks(self):
            """getter for tasks"""
            tasks = []
            for task in models.storage.all(Task).values():
                if task.user_id == self.id:
                    tasks.append(task)
            return tasks

        @property
        def comments(self):
            """getter for comments"""
            comments = []
            for comment in models.storage.all(Comment).values():
                if comment.user_id == self.id:
                    comments.append(comment)
            return comments
