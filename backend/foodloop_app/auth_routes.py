# backend/foodloop_app/auth_routes.py

from flask import Blueprint, request, jsonify, current_app
from flask_security.utils import hash_password, verify_password, login_user, logout_user
from flask_jwt_extended import create_access_token
from flask_security import roles_accepted, roles_required

# Import db and user_datastore initialized in __init__.py
from . import db, user_datastore

# Import models
from .models import User, Role

auth_bp = Blueprint("auth", __name__, url_prefix="/")


@auth_bp.route("/sign-up", methods=["POST"])
def sign_up():
    data = request.get_json()
    if not data or not all(
        key in data
        for key in ["email", "password", "city", "pincode", "contact", "role"]
    ):
        return jsonify({"error": "Missing required fields"}), 400

    email = data["email"].strip()
    password = data["password"]
    city = data["city"].strip()
    pincode = data["pincode"].strip()
    contact = data["contact"].strip()
    role_name = data["role"].strip().capitalize()

    if user_datastore.find_user(email=email):
        return jsonify({"error": "Email address is already registered"}), 409

    valid_roles = ["Retailer", "NGO", "Farmer", "Admin"]
    if role_name not in valid_roles:
        return jsonify({"error": f"Invalid role: {role_name}"}), 400

    role = user_datastore.find_role(role_name)
    if not role:
        return jsonify({"error": f"Role '{role_name}' not found"}), 400

    try:
        user = user_datastore.create_user(
            email=email,
            password=hash_password(password),
            active=True,
            city=city,
            pincode=pincode,
            contact=contact,
        )
        user_datastore.add_role_to_user(user, role)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"User creation failed: {e}")
        return jsonify({"error": "An error occurred during registration"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not all(key in data for key in ["email", "password"]):
        return jsonify({"error": "Email and password are required"}), 400

    email = data["email"].strip()
    password = data["password"]

    user = user_datastore.find_user(email=email)

    if user and verify_password(password, user.password):
        login_user(user)
        access_token = create_access_token(identity=email)
        user_data = {
            "id": user.id,
            "email": user.email,
            "city": user.city,
            "pincode": user.pincode,
            "contact": user.contact,
            "roles": [role.name for role in user.roles],
        }
        return jsonify(
            {"message": "Login successful", "token": access_token, "user": user_data}
        ), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200