#!/usr/bin/python3
"""This module defines a class Category"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Category(BaseModel, Base):
    """This class defines a category by various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'categories'
        name = Column(String(128), nullable=False)
        description = Column(String(1024))
        task_categories = relationship('TaskCategory', backref='category',
                                       cascade='all, delete-orphan')
    else:
        id = ''
        name = ''
        description = ''
    
    if models.storage_t != 'db':
        @property
        def tasks(self):
            """getter for tasks"""
            tasks = []
            for task in models.storage.all(models.task.Task).values():
                if task.category_id == self.id:
                    tasks.append(task)
            return tasks
        
        @property
        def users(self):
            """getter for users"""
            users = []
            for user in models.storage.all(models.user.User).values():
                if user.category_id == self.id:
                    users.append(user)
            return users
