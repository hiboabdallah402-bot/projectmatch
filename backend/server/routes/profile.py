from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.profile import Profile
from utils.validators import parse_json_payload

profile_bp = Blueprint("profile", __name__)


@profile_bp.get("")
def profile_index():
	return jsonify({"message": "Profile routes ready"}), 200


def _serialize_profile(profile):
	return {
		"id": profile.id,
		"bio": profile.bio,
		"skills": profile.skills,
		"profile_image": profile.profile_image,
		"user_id": profile.user_id,
	}


@profile_bp.get("/me")
@jwt_required()
def get_my_profile():
	user_id = int(get_jwt_identity())
	profile = Profile.query.filter_by(user_id=user_id).first()

	if profile is None:
		return jsonify({"message": "Profile not found"}), 404

	return jsonify({"profile": _serialize_profile(profile)}), 200


@profile_bp.put("/me")
@jwt_required()
def upsert_my_profile():
	try:
		payload = parse_json_payload(request)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	user_id = int(get_jwt_identity())
	profile = Profile.query.filter_by(user_id=user_id).first()
	if profile is None:
		profile = Profile(user_id=user_id)
		db.session.add(profile)

	if "bio" in payload:
		bio_value = payload.get("bio")
		if bio_value is not None and not isinstance(bio_value, str):
			return jsonify({"message": "bio must be a string or null"}), 400
		profile.bio = bio_value.strip() if isinstance(bio_value, str) else None

	if "skills" in payload:
		skills_value = payload.get("skills")
		if skills_value is not None and not isinstance(skills_value, str):
			return jsonify({"message": "skills must be a string or null"}), 400
		profile.skills = skills_value.strip() if isinstance(skills_value, str) else None

	if "profile_image" in payload:
		image_value = payload.get("profile_image")
		if image_value is not None and not isinstance(image_value, str):
			return jsonify({"message": "profile_image must be a string or null"}), 400
		profile.profile_image = image_value.strip() if isinstance(image_value, str) else None

	db.session.commit()

	return jsonify({"message": "Profile saved", "profile": _serialize_profile(profile)}), 200


@profile_bp.delete("/me")
@jwt_required()
def delete_my_profile():
	user_id = int(get_jwt_identity())
	profile = Profile.query.filter_by(user_id=user_id).first()

	if profile is None:
		return jsonify({"message": "Profile not found"}), 404

	db.session.delete(profile)
	db.session.commit()

	return jsonify({"message": "Profile deleted"}), 200
