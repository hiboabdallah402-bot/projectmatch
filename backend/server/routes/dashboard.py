from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func, and_
from sqlalchemy.orm import joinedload

from extensions import db
from models.activity import Activity
from models.application import Application
from models.project import Project
from models.user import User

dashboard_bp = Blueprint("dashboard", __name__)


def _serialize_user_min(user):
	if user is None:
		return None
	return {"id": user.id, "full_name": user.full_name, "email": user.email}


def _serialize_project_min(project):
	if project is None:
		return None
	return {"id": project.id, "title": project.title, "status": project.status}


def _serialize_project_full(project):
	if project is None:
		return None
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


def _serialize_application(application):
	return {
		"id": application.id,
		"status": application.status,
		"applied_at": application.applied_at.isoformat() if application.applied_at else None,
		"user_id": application.user_id,
		"project_id": application.project_id,
		"user": _serialize_user_min(application.user),
		"project": _serialize_project_min(application.project),
	}


def _serialize_activity(activity):
	return {
		"id": activity.id,
		"type": activity.type,
		"description": activity.description,
		"created_at": activity.created_at.isoformat() if activity.created_at else None,
		"actor": _serialize_user_min(activity.actor),
		"target_user": _serialize_user_min(activity.target_user),
		"project": _serialize_project_min(activity.project),
	}


@dashboard_bp.get("/stats")
@jwt_required()
def dashboard_stats():
	"""Get dashboard statistics for the current user."""
	current_user_id = int(get_jwt_identity())

	# User's projects
	projects_owned = db.session.query(func.count(Project.id)).filter_by(owner_id=current_user_id).scalar() or 0

	# Get all owned projects for details
	owned_projects = (
		Project.query.filter_by(owner_id=current_user_id).order_by(Project.created_at.desc()).all()
	)

	# Applications stats
	applications_submitted = (
		db.session.query(func.count(Application.id)).filter_by(user_id=current_user_id).scalar() or 0
	)
	applications_accepted = (
		db.session.query(func.count(Application.id))
		.filter(Application.user_id == current_user_id, Application.status == "Accepted")
		.scalar()
		or 0
	)
	applications_pending = (
		db.session.query(func.count(Application.id))
		.filter(Application.user_id == current_user_id, Application.status == "Pending")
		.scalar()
		or 0
	)
	applications_rejected = (
		db.session.query(func.count(Application.id))
		.filter(Application.user_id == current_user_id, Application.status == "Rejected")
		.scalar()
		or 0
	)

	# Received applications (for projects owned by user)
	applications_received = (
		db.session.query(func.count(Application.id))
		.join(Project)
		.filter(Project.owner_id == current_user_id)
		.scalar()
		or 0
	)

	# Get all applications (submitted and received) for analytics
	submitted_applications = (
		Application.query.options(
			joinedload(Application.user),
			joinedload(Application.project),
		)
		.filter_by(user_id=current_user_id)
		.order_by(Application.applied_at.desc())
		.all()
	)

	received_applications = (
		Application.query.options(
			joinedload(Application.user),
			joinedload(Application.project),
		)
		.join(Project)
		.filter(Project.owner_id == current_user_id)
		.order_by(Application.applied_at.desc())
		.all()
	)

	all_applications = submitted_applications + received_applications

	# Application status distribution
	status_distribution = (
		db.session.query(Application.status, func.count(Application.id))
		.join(Project)
		.filter(Project.owner_id == current_user_id)
		.group_by(Application.status)
		.all()
	)
	application_status_dist = {status: count for status, count in status_distribution}

	# Project status distribution
	project_status_dist_query = (
		db.session.query(Project.status, func.count(Project.id))
		.filter_by(owner_id=current_user_id)
		.group_by(Project.status)
		.all()
	)
	project_status_dist = {status: count for status, count in project_status_dist_query}

	# Recent activities (limit 10)
	recent_activities = (
		db.session.query(Activity)
		.filter(
			(Activity.actor_user_id == current_user_id)
			| (Activity.target_user_id == current_user_id)
			| (Activity.project_id.in_(db.session.query(Project.id).filter_by(owner_id=current_user_id)))
		)
		.order_by(Activity.created_at.desc())
		.limit(10)
		.all()
	)

	return jsonify(
		{
			"projects_owned": projects_owned,
			"applications_submitted": applications_submitted,
			"applications_received": applications_received,
			"applications_accepted": applications_accepted,
			"applications_pending": applications_pending,
			"applications_rejected": applications_rejected,
			"application_status_distribution": application_status_dist,
			"project_status_distribution": project_status_dist,
			"recent_activities": [_serialize_activity(a) for a in recent_activities],
			# Include full project and application details for analytics
			"projects": [_serialize_project_full(p) for p in owned_projects],
			"applications": [_serialize_application(a) for a in all_applications],
		}
	), 200
