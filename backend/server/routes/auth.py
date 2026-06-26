from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models.user import User


auth_bp = Blueprint("auth", __name__)


def _serialize_user(user):
	return {
		"id": user.id,
		"full_name": user.full_name,
		"email": user.email,
		"created_at": user.created_at.isoformat() if user.created_at else None,
	}


@auth_bp.get("")
def auth_index():
	return jsonify({"message": "Auth routes ready"}), 200


@auth_bp.post("/register")
def register():
	payload = request.get_json(silent=True) or {}
	full_name = payload.get("full_name", "").strip()
	email = payload.get("email", "").strip().lower()
	password = payload.get("password", "")

	if not full_name or not email or not password:
		return jsonify({"message": "full_name, email, and password are required"}), 400

	if User.query.filter_by(email=email).first() is not None:
		return jsonify({"message": "Email already exists"}), 409

	user = User(
		full_name=full_name,
		email=email,
		password_hash=generate_password_hash(password),
	)
	db.session.add(user)
	db.session.commit()

	access_token = create_access_token(identity=user.id)

	return (
		jsonify(
			{
				"message": "User registered successfully",
				"access_token": access_token,
				"user": _serialize_user(user),
			}
		),
		201,
	)


@auth_bp.post("/login")
def login():
	payload = request.get_json(silent=True) or {}
	email = payload.get("email", "").strip().lower()
	password = payload.get("password", "")

	if not email or not password:
		return jsonify({"message": "email and password are required"}), 400

	user = User.query.filter_by(email=email).first()
	if user is None or not check_password_hash(user.password_hash, password):
		return jsonify({"message": "Invalid email or password"}), 401

	access_token = create_access_token(identity=user.id)

	return jsonify(
		{
			"message": "Login successful",
			"access_token": access_token,
			"user": _serialize_user(user),
		}
	), 200


@auth_bp.get("/me")
@jwt_required()
def me():
	user_id = get_jwt_identity()
	user = User.query.get(user_id)

	if user is None:
		return jsonify({"message": "User not found"}), 404

	return jsonify({"user": _serialize_user(user)}), 200
