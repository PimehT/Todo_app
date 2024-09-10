#!/usr/bin/python3
""" tasks module for the API """
from api.v1.auth import verify_firebase_token
from api.v1.views import FILTER_PARAMS, app_views, implement_args
from flask import jsonify, request
from models import storage
from models.task import Task, ALLOWED_STATUS_VALUES, datetime_format
from datetime import datetime
from models.engine.search import search


# Search tasks `POST /api/v1/tasks/search`
@app_views.route('/tasks/search', methods=['POST'])
@verify_firebase_token
def search_tasks():
    user = request.user
    if not user:
        return jsonify({"error": "Unauthorized: Login required"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    filters = data.get("filters", {})
    # add user to filters
    filters['user'] = request.user

    results, error = search(filters,Task)
    if error:
        return jsonify(error), 400

    return jsonify(results), 200

# Create Task: `POST /api/tasks`
@app_views.route('/tasks', methods=['POST'])
@verify_firebase_token
def create_task():
    user = request.user
    if not user:
        return jsonify({"error": "Unauthorized: Login required"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    # attach a user
    data["user_id"] = user.id

    required = [
        "title", "description", "status", "deadline"
    ]
    for attr in required:
        if attr not in data:
            return jsonify({"error": f"Missing {attr}"}), 400

    # strip title
    data['title'] = data['title'].strip()

    # ensure no duplicate
    if data['title'].lower() in (obj.title.lower() for obj in storage.all(Task).values()):
        return jsonify({"error": "task title already exists"}), 400

    # validate format of deadline
    try:
        this_date = datetime.strptime(data['deadline'], datetime_format)
        # valid_deadline = datetime.strptime(data['deadline'], datetime_format_H_M)
    except ValueError:
        return jsonify({'error': "deadline '%Y-%m-%dT%H:%M:%S'"}), 400
        # return jsonify({'error': "deadline '%Y-%m-%dT%H:%M'"}), 400

    # ensure deadline is in the future
    if this_date < datetime.now():
        return jsonify({'error': "deadline cannot be in the past"}), 400

    # validate status
    if data['status'] not in ALLOWED_STATUS_VALUES:
        return jsonify({
            'error': f"status allowed values {ALLOWED_STATUS_VALUES}"}
                       ), 400

    task = Task(**data)
    task.save()
    return jsonify({'task_id': task.id}), 201


# Get Tasks by Status: `GET /api/tasks?status={status}`
# Get All Tasks: `GET /api/tasks`
@app_views.route('/tasks', methods=['GET'])
@verify_firebase_token
def get_tasks():
    user = request.user
    if not user:
        return jsonify({"error": "Unauthorized: Login required"}), 401

    tasks = []
    # organize params
    params_list = request.args.items()
    filters = {p[0]: p[1] for p in params_list if hasattr(Task, p[0])}
    if filters:
        for task_obj in user.tasks:
            if all(list(map(lambda kv: getattr(task_obj, kv[0])==kv[1], filters.items()))):
                tasks.append(task_obj.to_dict())
    else:
        for task_obj in user.tasks:
            tasks.append(task_obj.to_dict())

    # implement params if any e.g ?sort=asc
    tasks = implement_args(tasks)
    return jsonify(tasks), 200


# Get Task by ID: `GET /api/tasks/{task_id}`
@app_views.route('/tasks/<task_id>', methods=['GET'])
@verify_firebase_token
def get_task_by_id(task_id):
    user = request.user
    if not user:
        print('Error: login')
        return jsonify({"error": "Unauthorized: Login required"}), 401

    # task = storage.get(Task, task_id)
    task = None
    for t in user.tasks:
        if t.id == task_id:
            task = t
            break

    if not task:
        return jsonify({'error': 'Not found'}), 400
    return jsonify(task.to_dict()), 200

# Update Task: `PUT /api/tasks/{task_id}`
@app_views.route('/tasks/<task_id>', methods=['PUT'])
@verify_firebase_token
def update_task(task_id):
    user = request.user
    if not user:
        print('Error: login')
        return jsonify({"error": "Unauthorized: Login required"}), 401

    acceptable_attrs = [
        "description", "status", "deadline"
    ]

    # task = storage.get(Task, task_id)
    task = None
    for t in user.tasks:
        if t.id == task_id:
            task = t
            break

    if task is None:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    # validate format of deadline
    try:
        datetime.strptime(data['deadline'], datetime_format)
    except KeyError:
        pass
    except ValueError:
        return jsonify({'error': "deadline '%Y-%m-%dT%H:%M:%S'"}), 400

    # validate status
    if data.get('status') not in ALLOWED_STATUS_VALUES:
        return jsonify({'error': f"status allowed values {ALLOWED_STATUS_VALUES}"}), 400
    if task.status == data.get('status'):
        return jsonify({}), 304  # Not modified

    for key, value in data.items():
        if key in acceptable_attrs:
            setattr(task, key, value)

    task.save()
    return jsonify({"task_id": task.id}), 200

# Delete Task: `DELETE /api/tasks/{task_id}`
@app_views.route('/tasks/<task_id>', methods=['DELETE'])
@verify_firebase_token
def delete_task(task_id):
    user = request.user
    if not user:
        print('Error: login')
        return jsonify({"error": "Unauthorized: Login required"}), 401

    # task = storage.get(Task, task_id)
    task = None
    for t in user.tasks:
        if t.id == task_id:
            task = t
            break

    if not task:
        return jsonify({"error": "Not found"}), 404
    storage.delete(task)
    storage.save()
    return jsonify({'status': 'OK'}), 200
