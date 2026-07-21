from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.project import Project
from services import log_activity
from utils.validators import (
	parse_json_payload,
	parse_positive_int,
	validate_project_status,
	validate_required_text,
)

projects_bp = Blueprint("projects", __name__)


@projects_bp.get("")
def projects_index():
	status = request.args.get("status", type=str)
	query = Project.query
	if status:
		if status not in ("open", "in_progress", "completed", "closed"):
			return jsonify({"message": "Invalid status filter"}), 400
		query = query.filter_by(status=status)

	projects = query.order_by(Project.created_at.desc()).all()
	return jsonify({"projects": [_serialize_project(project) for project in projects]}), 200


def _get_project_or_404(project_id):
	project = db.session.get(Project, project_id)
	if project is None:
		return None, (jsonify({"message": "Project not found"}), 404)
	return project, None


def _serialize_project(project):
	return {
		"id": project.id,
		"title": project.title,
		"description": project.description,
		"required_skills": project.required_skills,
		"team_size": project.team_size,
		"status": project.status,
		"review_status": project.review_status,
		"created_at": project.created_at.isoformat() if project.created_at else None,
		"owner_id": project.owner_id,
	}


@projects_bp.get("/<int:project_id>")
def get_project(project_id):
	project, error_response = _get_project_or_404(project_id)
	if error_response is not None:
		return error_response

	return jsonify({"project": _serialize_project(project)}), 200


@projects_bp.post("")
@jwt_required()
def create_project():
	try:
		payload = parse_json_payload(request)
		title = validate_required_text(payload.get("title"), "title", min_length=3, max_length=150)
		description = validate_required_text(
			payload.get("description"), "description", min_length=10
		)
		required_skills = validate_required_text(
			payload.get("required_skills"), "required_skills", min_length=2
		)
		team_size = parse_positive_int(payload.get("team_size"), "team_size")
		status = payload.get("status", "open")
		validate_project_status(status)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	project = Project(
		title=title,
		description=description,
		required_skills=required_skills,
		team_size=team_size,
		status=status,
		owner_id=int(get_jwt_identity()),
	)
	db.session.add(project)
	db.session.flush()  # Flush to get project.id before commit

	# Log the activity
	log_activity(
		actor_user_id=int(get_jwt_identity()),
		activity_type="project_created",
		description=f"Created project '{title}'",
		project_id=project.id,
	)

	db.session.commit()

	return jsonify({"message": "Project created", "project": _serialize_project(project)}), 201


@projects_bp.patch("/<int:project_id>")
@projects_bp.put("/<int:project_id>")
@jwt_required()
def update_project(project_id):
	project, error_response = _get_project_or_404(project_id)
	if error_response is not None:
		return error_response

	if project.owner_id != int(get_jwt_identity()):
		return jsonify({"message": "You can only update your own projects"}), 403

	try:
		payload = parse_json_payload(request)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	try:
		if "title" in payload:
			project.title = validate_required_text(payload.get("title"), "title", min_length=3, max_length=150)
		if "description" in payload:
			project.description = validate_required_text(payload.get("description"), "description", min_length=10)
		if "required_skills" in payload:
			project.required_skills = validate_required_text(
				payload.get("required_skills"), "required_skills", min_length=2
			)
		if "team_size" in payload:
			project.team_size = parse_positive_int(payload.get("team_size"), "team_size")
		if "status" in payload:
			validate_project_status(payload.get("status"))
			project.status = payload.get("status")
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	db.session.commit()

	return jsonify({"message": "Project updated", "project": _serialize_project(project)}), 200


@projects_bp.delete("/<int:project_id>")
@jwt_required()
def delete_project(project_id):
	project, error_response = _get_project_or_404(project_id)
	if error_response is not None:
		return error_response

	if project.owner_id != int(get_jwt_identity()):
		return jsonify({"message": "You can only delete your own projects"}), 403

	db.session.delete(project)
	db.session.commit()

	return jsonify({"message": "Project deleted"}), 200
