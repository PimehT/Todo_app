#!/usr/bin/python3
""" users module for the API """
from api.v1.views import app_views
from flask import jsonify, request
from models import storage
from models.task import Task

# Create Task: `POST /api/tasks`
@app_views.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    required = [

    ]
# Get All Tasks: `GET /api/tasks`
# Get Task by ID: `GET /api/tasks/{task_id}`
# Update Task: `PUT /api/tasks/{task_id}`
# Delete Task: `DELETE /api/tasks/{task_id}`
# Get Tasks by Category: `GET /api/categories/{category_id}/tasks`
# Get Tasks by Status: `GET /api/tasks?status={status}`
