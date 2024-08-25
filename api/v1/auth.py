from functools import wraps
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import auth, credentials

app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('fire_key.json')
firebase_admin.initialize_app(cred)

def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        # Expecting 'Authorization: Bearer <token>'
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({"error": "Invalid token format"}), 401

        id_token = parts[1]  # The actual token part

        try:
            # Verify the token and decode it
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Attach the user info to the request
        except Exception as e:
            print(f'Error verifying token: {e}')
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_function

