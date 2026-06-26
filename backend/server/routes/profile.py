from flask import Blueprint, jsonify


profile_bp = Blueprint("profile", __name__)


@profile_bp.get("")
def profile_index():
	return jsonify({"message": "Profile routes ready"}), 200
