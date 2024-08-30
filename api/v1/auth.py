from functools import wraps
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import auth, credentials
from models.user import User
from models import storage
import logging

app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('fire_key.json')
firebase_admin.initialize_app(cred)
logger = logging.getLogger(__name__)

def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info("Authentication started")

        auth_header = request.headers.get('Authorization')
        logger.info("Received token", auth_header)
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        # Expecting 'Authorization: Bearer <token>'
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({"error": "Invalid token format"}), 401

        id_token = parts[1]  # The actual token part

        logger.debug("Finalized token", id_token)

        try:
            # Verify the token and decode it
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token["uid"]
            logger.info("Received uid", uid)

            try:
                user = storage.get_user(uid=uid)  # Corrected syntax
                if not user:
                    return jsonify({"error": "User does not exist"}), 404
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        except Exception as e:
            print(f'Error verifying token: {e}')
            return jsonify({"error": "Invalid or expired token"}), 401

        # Attach the user info to the request
        request.user = user

        return f(*args, **kwargs)

    return decorated_function

