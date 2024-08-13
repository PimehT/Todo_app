#!/usr/bin/python3
""" categories module for the API """
from api.v1.views import FILTER_PARAMS, app_views, implement_args
from flask import jsonify, request
from models import storage
from models.category import Category
from datetime import datetime

# Create category: `POST /api/categories`
@app_views.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    required = [
        "name", "description"
    ]
    for attr in required:
        if attr not in data:
            return jsonify({"error": f"Missing {attr}"}), 400

    # strip name
    data['name'] = data['name'].strip()

    # ensure no duplicate
    if data['name'].lower() in (obj.name.lower() for obj in storage.all(Category).values()):
        return jsonify({"error": "category name already exists"}), 400

    category = category(**data)
    category.save()
    return jsonify({'category_id': category.id}), 201


# Get All categories: `GET /api/categories`
@app_views.route('/categories', methods=['GET'])
def get_categories():
    categories = []
    for category_obj in storage.all(Category).values():
        categories.append(category_obj.to_dict())

    # implement params if any e.g ?sort=asc
    categories = implement_args(categories)
    return jsonify(categories), 200


# Get category by ID: `GET /api/categories/{category_id}`
@app_views.route('/categories/<category_id>', methods=['GET'])
def get_category_by_id(category_id):
    category = storage.get(Category, category_id)
    if not category:
        return jsonify({'error': 'Not found'}), 400
    return jsonify(category.to_dict()), 200


# Update category: `PUT /api/categories/{category_id}`
@app_views.route('/categories/<category_id>', methods=['PUT'])
def update_category(category_id):
    acceptable_attrs = [
        "description"
    ]

    category = storage.get(Category, category_id)
    if category is None:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    for key, value in data.items():
        if key in acceptable_attrs:
            setattr(category, key, value)

    category.save()
    return jsonify({"category_id": category.id}), 200


# Delete category: `DELETE /api/categories/{category_id}`
@app_views.route('/categories/<category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = storage.get(Category, category_id)
    if not category:
        return jsonify({"error": "Not found"}), 404
    storage.delete(category)
    storage.save()
    return jsonify({'status': 'OK'}), 200

# Get Tasks by Category: `GET /api/categories/{category_id}/tasks`
@app_views.route('/categories/<category_id>/tasks')
def get_tasks_by_category(category_id):
    category = storage.get(Category, category_id)
    if not category:
        return jsonify({"error": "Not found"}), 404
    tasks = [task_obj.to_dict() for task_obj in category.tasks]

    return jsonify(tasks), 200
