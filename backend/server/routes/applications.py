from flask import Blueprint, jsonify


applications_bp = Blueprint("applications", __name__)


@applications_bp.get("")
def applications_index():
	return jsonify({"message": "Application routes ready"}), 200
