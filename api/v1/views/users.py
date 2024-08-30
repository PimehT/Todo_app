#!/usr/bin/python3
""" users module for the API """
from api.v1.views import app_views
from flask import jsonify, request
from models import storage
from models.user import User
from api.v1.auth import verify_firebase_token
import logging

logger = logging.getLogger(__name__)

# from flask_jwt_extended import (
#     create_access_token,
#     jwt_required,
#     get_jwt_identity
# )
# from werkzeug.security import generate_password_hash, check_password_hash


# Register User
@app_views.route('/users/register', methods=['POST'])
def register_user():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        logger.warning("Not an instance of dictionary")
        return jsonify({"error": "Not a JSON"}), 400

    required = [
        "uid", "email", "password", "first_name", "last_name"
    ]
    for attr in required:
        if attr not in data:
            logger.debug("Missing attributes")
            return jsonify({"error": f"Missing {attr}"}), 400

    # Ensure that the uid and email are unique
    if storage.get_user(email=data.get('email', None)):
        return jsonify({'error': "email exists"}), 400
    if storage.get_user(uid=data.get('uid', None)):
        return jsonify({'error': "user already exists exists"}), 400

    # store the password hash and not the actual password
    # hashed_password = generate_password_hash(data['password'],
    #                                          method="pbkdf2:sha1:1000",
    #                                          salt_length=8)
    # data['password'] = hashed_password

    try:
        user = User(**data)
        user.save()
    except Exception as e:
        return jsonify({"Error saving user data": e})
    return jsonify({'Success': "User has been registered successfully"}), 201


# login user
"""@app_views.route('/login', strict_slashes=False, methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400
    required = [
        "username", "password"
    ]
    for attr in required:
        if attr not in data:
            return jsonify({"error": f"Missing {attr}"}), 400

    user = storage.get_user(username=data.get('username'))
    print(type(user))
    if user is None:
        return jsonify({'Error': 'unknown username and/or password'}), 401
    if user.password != data.get('password'):
        return jsonify({'Error': 'unknown username and/or password'}), 401
    # if not check_password_hash(user.password, data.get('password')):
    #     return jsonify({'Error': 'unknown username and/or password'}), 401

    # access_token = create_access_token(identity=user.id)

    # return jsonify({'access_token': access_token, 'user_id': user.id}), 200
    return jsonify({'user_id': user.id}), 200
"""

# TODO: Logout user


# Get User Profile
@app_views.route('/users_profile', methods=['GET'])
@verify_firebase_token
def get_user_profile():
    user = request.user
    if user is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user.to_dict()), 200


# Delete User Account
@app_views.route('/delete_user', methods=['DELETE'])
@verify_firebase_token
def delete_user():
    user = request.user
    if user is None:
        return jsonify({"error": "Not found"}), 404
    storage.delete(user)
    storage.save()
    return jsonify({}), 200


# Update user profile
@app_views.route('/update_user', methods=['PUT'])
@verify_firebase_token
def update_user():
    acceptable_attrs = [
        "email", "password",  # "first_name", "last_name"
    ]
    user = request.user
    if user is None:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Not a JSON"}), 400

    for key, value in data.items():
        if key in acceptable_attrs:
            setattr(user, key, value)
    user.save()
    return jsonify({"user_id": user.id}), 200


# Get user tasks: `GET /api/v1/users/<user_id>/tasks`
@app_views.route('/users/tasks', methods=['GET'])
@verify_firebase_token
def get_user_tasks():
    user = request.user
    if user is None:
        return jsonify({"error": "Not found"}), 404
    tasks = [task_obj.to_dict() for task_obj in user.tasks]
    return jsonify(tasks), 200


# @app_views.route('/protected', strict_slashes=False, methods=['GET'])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     data = {
#         'logged_in_as': current_user,
#     }
#     return jsonify(data), 200
