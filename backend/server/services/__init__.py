"""Service for creating activities and notifications in response to user actions."""

from extensions import db
from models.activity import Activity
from models.collaboration import Notification


def log_activity(
	actor_user_id: int,
	activity_type: str,
	description: str,
	target_user_id: int = None,
	project_id: int = None,
	application_id: int = None,
) -> Activity:
	"""
	Log a user activity to the database.

	Args:
		actor_user_id: User who performed the action
		activity_type: Type of activity (e.g., 'project_created')
		description: Human-readable description
		target_user_id: User affected by the action (optional)
		project_id: Associated project (optional)
		application_id: Associated application (optional)

	Returns:
		The created Activity object
	"""
	activity = Activity(
		type=activity_type,
		actor_user_id=actor_user_id,
		target_user_id=target_user_id,
		project_id=project_id,
		application_id=application_id,
		description=description,
	)
	db.session.add(activity)
	return activity


def create_notification(
	user_id: int,
	notification_type: str,
	title: str,
	message: str,
	priority: str = "normal",
	project_id: int = None,
	application_id: int = None,
) -> Notification:
	"""
	Create a notification for a user.

	Args:
		user_id: User who receives the notification
		notification_type: Type of notification
		title: Short title
		message: Full message
		priority: Notification priority (normal, high, urgent)
		project_id: Associated project (optional)
		application_id: Associated application (optional)

	Returns:
		The created Notification object
	"""
	notification = Notification(
		user_id=user_id,
		type=notification_type,
		title=title,
		message=message,
		priority=priority,
		project_id=project_id,
		application_id=application_id,
		is_read=False,
	)
	db.session.add(notification)
	return notification


def notify_project_owner_on_application(application) -> None:
	"""Notify project owner when someone applies to their project."""
	if application.project is None or application.user is None:
		return

	title = f"New application from {application.user.full_name}"
	message = f"{application.user.full_name} applied to your project '{application.project.title}'"

	create_notification(
		user_id=application.project.owner_id,
		notification_type="application_submitted",
		title=title,
		message=message,
		project_id=application.project_id,
	)


def notify_applicant_on_application_status_change(application, new_status: str) -> None:
	"""Notify applicant when their application status changes."""
	if application.project is None or application.user is None:
		return

	if new_status == "Accepted":
		title = f"Your application was accepted!"
		message = f"Great news! You've been accepted to '{application.project.title}'. You're now part of the team."
		notif_type = "application_accepted"
	elif new_status == "Rejected":
		title = f"Application update for '{application.project.title}'"
		message = f"Unfortunately, your application to '{application.project.title}' was not accepted at this time."
		notif_type = "application_rejected"
	else:
		return

	create_notification(
		user_id=application.user_id,
		notification_type=notif_type,
		title=title,
		message=message,
		project_id=application.project_id,
	)
