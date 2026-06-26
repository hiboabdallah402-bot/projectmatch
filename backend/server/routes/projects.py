from flask import Blueprint, jsonify


projects_bp = Blueprint("projects", __name__)


@projects_bp.get("")
def projects_index():
	return jsonify({"message": "Project routes ready"}), 200
