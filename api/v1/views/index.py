#!/usr/bin/python3
""" index module for the API """
from api.v1.views import app_views
from flask import jsonify


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def get_status():
    return jsonify({"status": "OK"})


@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def get_stats():
    from models import storage
    from models.task import Task
    from models.comment import Comment
    from models.category import Category
    from models.user import User

    classes = {
        'task': Task,
        'comment': Comment,
        'category': Category,
        'users': User
    }
    stats = {}
    for key, value in classes.items():
        stats[key] = storage.count(value)
    return jsonify(stats)
