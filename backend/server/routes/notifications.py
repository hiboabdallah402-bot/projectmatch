"""Notifications API routes."""

from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from extensions import db
from models.collaboration import Notification

notifications_bp = Blueprint("notifications", __name__)


def _current_user_id():
	return int(get_jwt_identity())


def _serialize_notification(notification):
	return {
		"id": notification.id,
		"type": notification.type,
		"title": notification.title,
		"message": notification.message,
		"priority": notification.priority,
		"is_read": notification.is_read,
		"project_id": notification.project_id,
		"application_id": notification.application_id,
		"created_at": notification.created_at.isoformat() if notification.created_at else None,
	}


@notifications_bp.get("")
@jwt_required()
def list_notifications():
	"""Get all notifications for the current user, ordered by newest first."""
	current_user_id = _current_user_id()
	notifications = (
		Notification.query.filter_by(user_id=current_user_id)
		.order_by(Notification.created_at.desc())
		.all()
	)
	return jsonify({"notifications": [_serialize_notification(n) for n in notifications]}), 200


@notifications_bp.get("/stats")
@jwt_required()
def get_notification_stats():
	"""Get notification statistics for the current user."""
	current_user_id = _current_user_id()

	# Total notifications
	total = db.session.query(func.count(Notification.id)).filter_by(user_id=current_user_id).scalar() or 0

	# Unread notifications
	unread = (
		db.session.query(func.count(Notification.id))
		.filter_by(user_id=current_user_id, is_read=False)
		.scalar()
		or 0
	)

	# Read today (notifications marked as read today)
	today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
	read_today = (
		db.session.query(func.count(Notification.id))
		.filter(
			Notification.user_id == current_user_id,
			Notification.is_read == True,
			Notification.created_at >= today_start,
		)
		.scalar()
		or 0
	)

	# High priority notifications
	high_priority = (
		db.session.query(func.count(Notification.id))
		.filter(
			Notification.user_id == current_user_id,
			Notification.priority.in_(["high", "urgent"]),
		)
		.scalar()
		or 0
	)

	return jsonify(
		{
			"total": total,
			"unread": unread,
			"read_today": read_today,
			"high_priority": high_priority,
		}
	), 200


@notifications_bp.patch("/<int:notification_id>/read")
@jwt_required()
def mark_notification_read(notification_id):
	"""Mark a single notification as read."""
	current_user_id = _current_user_id()
	notification = db.session.get(Notification, notification_id)

	if notification is None:
		return jsonify({"message": "Notification not found"}), 404

	if notification.user_id != current_user_id:
		return jsonify({"message": "You are not allowed to update this notification"}), 403

	notification.is_read = True
	db.session.commit()

	return jsonify(
		{"message": "Notification marked as read", "notification": _serialize_notification(notification)}
	), 200


@notifications_bp.patch("/read-all")
@jwt_required()
def mark_all_notifications_read():
	"""Mark all unread notifications as read for the current user."""
	current_user_id = _current_user_id()

	# Update all unread notifications
	db.session.query(Notification).filter_by(user_id=current_user_id, is_read=False).update(
		{"is_read": True}
	)
	db.session.commit()

	return jsonify({"message": "All notifications marked as read"}), 200


@notifications_bp.delete("/<int:notification_id>")
@jwt_required()
def delete_notification(notification_id):
	"""Delete a notification."""
	current_user_id = _current_user_id()
	notification = db.session.get(Notification, notification_id)

	if notification is None:
		return jsonify({"message": "Notification not found"}), 404

	if notification.user_id != current_user_id:
		return jsonify({"message": "You are not allowed to delete this notification"}), 403

	db.session.delete(notification)
	db.session.commit()

	return jsonify({"message": "Notification deleted"}), 200
