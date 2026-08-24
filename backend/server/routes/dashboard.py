from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func, and_
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta

from extensions import db
from models.activity import Activity
from models.application import Application
from models.collaboration import ProjectTask, TeamMember
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


def _get_applications_over_time(applications):
	"""
	Aggregate applications by week over the last 30 days (4 weeks).
	Returns a list of dicts with week label and count.
	"""
	if not applications:
		return []
	
	# Get the last 30 days of data (4 weeks)
	today = datetime.utcnow().date()
	start_date = today - timedelta(days=29)  # 30 days total
	
	# Create a dict to count applications per week
	# Week 1: Days 0-6, Week 2: Days 7-13, Week 3: Days 14-20, Week 4: Days 21-29
	week_counts = {
		"Week 1": 0,
		"Week 2": 0,
		"Week 3": 0,
		"Week 4": 0,
	}
	
	# Count applications by week
	for app in applications:
		if app.applied_at:
			app_date = app.applied_at.date()
			# Check if application is within the last 30 days
			if start_date <= app_date <= today:
				days_ago = (today - app_date).days
				if days_ago < 7:
					week_counts["Week 1"] += 1
				elif days_ago < 14:
					week_counts["Week 2"] += 1
				elif days_ago < 21:
					week_counts["Week 3"] += 1
				else:
					week_counts["Week 4"] += 1
	
	# Convert to list format for chart (in chronological order: Week 4 is oldest)
	result = [
		{"period": "Week 4", "count": week_counts["Week 4"]},
		{"period": "Week 3", "count": week_counts["Week 3"]},
		{"period": "Week 2", "count": week_counts["Week 2"]},
		{"period": "Week 1", "count": week_counts["Week 1"]},
	]
	
	return result


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
			"applications_over_time": _get_applications_over_time(all_applications),
			"recent_activities": [_serialize_activity(a) for a in recent_activities],
			# Include full project and application details for analytics
			"projects": [_serialize_project_full(p) for p in owned_projects],
			"applications": [_serialize_application(a) for a in all_applications],
		}
	), 200


def _is_supervisor(user_id):
	"""Check if user is a supervisor."""
	user = db.session.get(User, user_id)
	return user is not None and user.is_supervisor


def _get_accessible_projects(user_id):
	"""
	Get projects accessible to the user based on authorization rules.
	
	Supervisors: All projects
	Normal users: Projects they own or have an accepted application to (are team members of)
	"""
	is_supervisor = _is_supervisor(user_id)
	
	if is_supervisor:
		# Supervisors can see all projects
		projects = Project.query.all()
	else:
		# Normal users: owned projects + projects where they are team members
		owned_projects = Project.query.filter_by(owner_id=user_id).all()
		
		# Get projects where user is a team member (has accepted application)
		team_projects = (
			Project.query.join(TeamMember)
			.filter(TeamMember.user_id == user_id)
			.all()
		)
		
		# Combine and deduplicate
		projects = list({p.id: p for p in owned_projects + team_projects}.values())
	
	return projects


@dashboard_bp.get("/project-progress")
@jwt_required()
def get_project_progress():
	"""Get project progress data for accessible projects."""
	current_user_id = int(get_jwt_identity())
	
	# Get accessible projects
	projects = _get_accessible_projects(current_user_id)
	
	# Calculate progress for each project
	project_progress_list = []
	for project in projects:
		# Count tasks by status (only "completed" status tasks count)
		total_tasks = ProjectTask.query.filter_by(project_id=project.id).count()
		completed_tasks = ProjectTask.query.filter_by(
			project_id=project.id,
			status="completed"
		).count()
		
		# Calculate task progress percentage (0-100% based on completed tasks)
		if total_tasks > 0:
			task_progress_percent = int((completed_tasks / total_tasks) * 100)
		else:
			task_progress_percent = 0
		
		# Determine if project is officially completed
		# Project is complete only when status is "completed" or "closed"
		is_project_officially_complete = project.status in ["completed", "closed"]
		
		# Final progress to display:
		# - If project is officially complete: 100% with "Project Completed" label
		# - If project is open/in_progress: show task-based progress (0-100%)
		#   even if all tasks are done, project must be officially marked as complete
		if is_project_officially_complete:
			progress_percent = 100
		else:
			progress_percent = task_progress_percent
		
		project_progress_list.append({
			"id": project.id,
			"title": project.title,
			"status": project.status,
			"total_tasks": total_tasks,
			"completed_tasks": completed_tasks,
			"progress_percent": progress_percent,
			"is_officially_complete": is_project_officially_complete,
			"task_progress_percent": task_progress_percent,
		})
	
	# Sort by progress descending (highest progress first)
	project_progress_list.sort(key=lambda p: p["progress_percent"], reverse=True)
	
	return jsonify({
		"projects": project_progress_list
	}), 200
