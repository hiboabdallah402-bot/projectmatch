from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import joinedload

from extensions import db
from models.application import Application
from models.project import Project
from utils.validators import parse_json_payload, parse_positive_int


applications_bp = Blueprint("applications", __name__)


@applications_bp.get("")
@jwt_required()
def applications_index():
	current_user_id = int(get_jwt_identity())
	scope = request.args.get("scope", "submitted")

	if scope not in ("submitted", "received"):
		return jsonify({"message": "scope must be submitted or received"}), 400

	query = Application.query.options(
		joinedload(Application.user),
		joinedload(Application.project),
	)
	if scope == "submitted":
		query = query.filter_by(user_id=current_user_id)
	else:
		query = query.join(Project).filter(Project.owner_id == current_user_id)

	applications = query.order_by(Application.applied_at.desc()).all()
	return jsonify({"applications": [_serialize_application(application) for application in applications]}), 200


def _serialize_application(application):
	return {
		"id": application.id,
		"status": application.status,
		"applied_at": application.applied_at.isoformat() if application.applied_at else None,
		"user_id": application.user_id,
		"project_id": application.project_id,
		"user": _serialize_user(application.user),
		"project": _serialize_project(application.project),
	}


def _serialize_user(user):
	if user is None:
		return None
	return {
		"id": user.id,
		"full_name": user.full_name,
		"email": user.email,
	}


def _serialize_project(project):
	if project is None:
		return None
	return {
		"id": project.id,
		"title": project.title,
		"status": project.status,
		"owner_id": project.owner_id,
	}


def _get_application_or_404(application_id):
	application = db.session.get(Application, application_id)
	if application is None:
		return None, (jsonify({"message": "Application not found"}), 404)
	return application, None


def _is_project_owner(application, user_id):
	return application.project is not None and application.project.owner_id == user_id


@applications_bp.get("/<int:application_id>")
@jwt_required()
def get_application(application_id):
	application, error_response = _get_application_or_404(application_id)
	if error_response is not None:
		return error_response

	current_user_id = int(get_jwt_identity())
	if application.user_id != current_user_id and not _is_project_owner(application, current_user_id):
		return jsonify({"message": "You are not allowed to view this application"}), 403

	return jsonify({"application": _serialize_application(application)}), 200


@applications_bp.post("")
@jwt_required()
def create_application():
	try:
		payload = parse_json_payload(request)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	try:
		project_id = parse_positive_int(payload.get("project_id"), "project_id")
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	project = db.session.get(Project, project_id)
	if project is None:
		return jsonify({"message": "Project not found"}), 404

	current_user_id = int(get_jwt_identity())
	if project.owner_id == current_user_id:
		return jsonify({"message": "You cannot apply to your own project"}), 403

	if project.status != "open":
		return jsonify({"message": "Applications are only allowed when the project status is open"}), 400

	existing_application = Application.query.filter_by(
		user_id=current_user_id, project_id=project.id
	).first()
	if existing_application is not None:
		return jsonify({"message": "You have already applied to this project"}), 409

	application = Application(user_id=current_user_id, project_id=project.id, status="Pending")
	db.session.add(application)
	db.session.commit()

	return jsonify({"message": "Application submitted", "application": _serialize_application(application)}), 201


@applications_bp.patch("/<int:application_id>")
@jwt_required()
def update_application(application_id):
	application, error_response = _get_application_or_404(application_id)
	if error_response is not None:
		return error_response

	current_user_id = int(get_jwt_identity())
	if not _is_project_owner(application, current_user_id):
		return jsonify({"message": "Only the project owner can accept or reject applications"}), 403

	try:
		payload = parse_json_payload(request)
	except ValueError as exc:
		return jsonify({"message": str(exc)}), 400

	status = payload.get("status")
	if status not in ("Accepted", "Rejected"):
		return jsonify({"message": "status must be Accepted or Rejected"}), 400

	application.status = status
	db.session.commit()

	return jsonify({"message": "Application updated", "application": _serialize_application(application)}), 200


@applications_bp.delete("/<int:application_id>")
@jwt_required()
def delete_application(application_id):
	application, error_response = _get_application_or_404(application_id)
	if error_response is not None:
		return error_response

	current_user_id = int(get_jwt_identity())
	if application.user_id != current_user_id and not _is_project_owner(application, current_user_id):
		return jsonify({"message": "You are not allowed to delete this application"}), 403

	if application.status == "Accepted" and application.user_id == current_user_id:
		return jsonify({"message": "Accepted applications cannot be withdrawn by the applicant"}), 400

	db.session.delete(application)
	db.session.commit()

	return jsonify({"message": "Application deleted"}), 200
