from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models.user import User
from utils.validators import (
	normalize_email,
	parse_json_payload,
	validate_email,
	validate_password,
	validate_required_text,
)


auth_bp = Blueprint("auth", __name__)


def _serialize_user(user):
	return {
		"id": user.id,
		"full_name": user.full_name,
		"email": user.email,
		"is_supervisor": bool(user.is_supervisor),
		"created_at": user.created_at.isoformat() if user.created_at else None,
	}


@auth_bp.get("")
def auth_index():
	return jsonify({"message": "Auth routes ready"}), 200


@auth_bp.post("/register")
def register():
	try:
		payload = parse_json_payload(request)
		full_name = validate_required_text(
			payload.get("full_name"), "full_name", min_length=2, max_length=120
		)
		email = normalize_email(payload.get("email"))
		validate_email(email)
		password = payload.get("password", "")
		validate_password(password)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

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
	try:
		payload = parse_json_payload(request)
		email = normalize_email(payload.get("email"))
		validate_email(email)
		password = payload.get("password", "")
		validate_password(password)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

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
	user = db.session.get(User, int(user_id))

	if user is None:
		return jsonify({"message": "User not found"}), 404

	return jsonify({"user": _serialize_user(user)}), 200
