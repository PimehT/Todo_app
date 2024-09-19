#!/usr/bin/python3
"""This module defines a class Comment"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Comment(BaseModel, Base):
    """This class defines a comment by various attributes"""
    if models.storage_t == 'db':
        __tablename__ = 'comments'
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        task_id = Column(String(60), ForeignKey('tasks.id'), nullable=False)
        content = Column(String(1024), nullable=False)
    else:
        id = ''
        user_id = ''
        task_id = ''
        content = ''
        created_at = ''
