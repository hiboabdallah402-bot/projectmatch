from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.collaboration import (
    Notification,
    ProjectAnnouncement,
    ProjectFile,
    ProjectMeeting,
    ProjectMessage,
    ProjectReport,
    ProjectTask,
    TeamMember,
)
from models.project import Project
from models.user import User
from utils.validators import parse_json_payload, parse_positive_int, validate_required_text


collaboration_bp = Blueprint("collaboration", __name__)

TEAM_ALLOWED_ROLES = {
    "Frontend Developer",
    "Backend Developer",
    "Designer",
    "Tester",
    "Project Manager",
    "Contributor",
}
TASK_ALLOWED_STATUSES = {"to_do", "in_progress", "completed"}


def _current_user_id():
    return int(get_jwt_identity())


def _serialize_user_min(user):
    if user is None:
        return None
    return {"id": user.id, "full_name": user.full_name, "email": user.email}


def _serialize_team_member(member):
    return {
        "id": member.id,
        "project_id": member.project_id,
        "user_id": member.user_id,
        "role": member.role,
        "is_leader": member.is_leader,
        "joined_at": member.joined_at.isoformat() if member.joined_at else None,
        "user": _serialize_user_min(member.user),
    }


def _serialize_task(task):
    return {
        "id": task.id,
        "project_id": task.project_id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "assigned_to_user_id": task.assigned_to_user_id,
        "due_at": task.due_at.isoformat() if task.due_at else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
        "assigned_to": _serialize_user_min(task.assigned_to),
    }


def _serialize_announcement(announcement):
    return {
        "id": announcement.id,
        "project_id": announcement.project_id,
        "content": announcement.content,
        "created_at": announcement.created_at.isoformat() if announcement.created_at else None,
        "created_by": _serialize_user_min(announcement.created_by),
    }


def _serialize_message(message):
    return {
        "id": message.id,
        "project_id": message.project_id,
        "message": message.message,
        "created_at": message.created_at.isoformat() if message.created_at else None,
        "sender": _serialize_user_min(message.sender),
    }


def _serialize_file(project_file):
    return {
        "id": project_file.id,
        "project_id": project_file.project_id,
        "file_name": project_file.file_name,
        "file_type": project_file.file_type,
        "file_url": project_file.file_url,
        "uploaded_at": project_file.uploaded_at.isoformat() if project_file.uploaded_at else None,
        "uploaded_by": _serialize_user_min(project_file.uploaded_by),
    }


def _serialize_meeting(meeting):
    return {
        "id": meeting.id,
        "project_id": meeting.project_id,
        "title": meeting.title,
        "scheduled_for": meeting.scheduled_for.isoformat() if meeting.scheduled_for else None,
        "location": meeting.location,
        "created_at": meeting.created_at.isoformat() if meeting.created_at else None,
        "created_by": _serialize_user_min(meeting.created_by),
    }


def _serialize_notification(notification):
    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "project_id": notification.project_id,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat() if notification.created_at else None,
    }


def _serialize_report(report):
    return {
        "id": report.id,
        "project_id": report.project_id,
        "report_type": report.report_type,
        "report_payload": report.report_payload,
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "generated_by": _serialize_user_min(report.generated_by),
    }


def _get_project_or_404(project_id):
    project = db.session.get(Project, project_id)
    if project is None:
        return None, (jsonify({"message": "Project not found"}), 404)
    return project, None


def _is_project_owner(project, user_id):
    return project.owner_id == user_id


def _is_team_member(project_id, user_id):
    return (
        TeamMember.query.filter_by(project_id=project_id, user_id=user_id).first()
        is not None
    )


def _is_team_leader(project_id, user_id):
    return (
        TeamMember.query.filter_by(
            project_id=project_id, user_id=user_id, is_leader=True
        ).first()
        is not None
    )


def _can_manage_project(project, user_id):
    return _is_project_owner(project, user_id) or _is_team_leader(project.id, user_id)


def _ensure_project_access(project, user_id):
    if _is_project_owner(project, user_id) or _is_team_member(project.id, user_id):
        return None
    return jsonify({"message": "You are not allowed to access this project collaboration space"}), 403


def _create_notification(user_id, title, message, notif_type, project_id=None):
    db.session.add(
        Notification(
            user_id=user_id,
            project_id=project_id,
            title=title,
            message=message,
            type=notif_type,
        )
    )


def _parse_iso_datetime(value, field_name):
    try:
        return datetime.fromisoformat(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be a valid ISO datetime string")


@collaboration_bp.get("/projects/<int:project_id>/team")
@jwt_required()
def list_team_members(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    members = TeamMember.query.filter_by(project_id=project_id).all()
    return jsonify({"team_members": [_serialize_team_member(member) for member in members]}), 200


@collaboration_bp.post("/projects/<int:project_id>/team")
@jwt_required()
def add_team_member(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can add team members"}), 403

    try:
        payload = parse_json_payload(request)
        user_id = parse_positive_int(payload.get("user_id"), "user_id")
        role = payload.get("role", "Contributor")
        is_leader = bool(payload.get("is_leader", False))
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    if role not in TEAM_ALLOWED_ROLES:
        return jsonify({"message": "Invalid role"}), 400

    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    existing = TeamMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if existing is not None:
        return jsonify({"message": "User is already in this team"}), 409

    member = TeamMember(
        project_id=project_id,
        user_id=user_id,
        role=role,
        is_leader=is_leader,
        added_by_id=current_user_id,
    )
    db.session.add(member)
    _create_notification(
        user_id=user_id,
        title="You were added to a project team",
        message=f"You were added to team for project '{project.title}'.",
        notif_type="team",
        project_id=project_id,
    )
    db.session.commit()
    return jsonify({"message": "Team member added", "team_member": _serialize_team_member(member)}), 201


@collaboration_bp.patch("/projects/<int:project_id>/team/<int:user_id>")
@jwt_required()
def update_team_member(project_id, user_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can update team members"}), 403

    member = TeamMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if member is None:
        return jsonify({"message": "Team member not found"}), 404

    try:
        payload = parse_json_payload(request)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    if "role" in payload:
        if payload["role"] not in TEAM_ALLOWED_ROLES:
            return jsonify({"message": "Invalid role"}), 400
        member.role = payload["role"]

    if "is_leader" in payload:
        member.is_leader = bool(payload["is_leader"])

    db.session.commit()
    return jsonify({"message": "Team member updated", "team_member": _serialize_team_member(member)}), 200


@collaboration_bp.delete("/projects/<int:project_id>/team/<int:user_id>")
@jwt_required()
def remove_team_member(project_id, user_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can remove members"}), 403

    member = TeamMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if member is None:
        return jsonify({"message": "Team member not found"}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Team member removed"}), 200


@collaboration_bp.get("/projects/<int:project_id>/tasks")
@jwt_required()
def list_tasks(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    tasks = ProjectTask.query.filter_by(project_id=project_id).order_by(ProjectTask.created_at.desc()).all()
    return jsonify({"tasks": [_serialize_task(task) for task in tasks]}), 200


@collaboration_bp.post("/projects/<int:project_id>/tasks")
@jwt_required()
def create_task(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can create tasks"}), 403

    try:
        payload = parse_json_payload(request)
        title = validate_required_text(payload.get("title"), "title", min_length=3, max_length=180)
        description = (payload.get("description") or "").strip() or None
        assigned_to_user_id = payload.get("assigned_to_user_id")
        due_at = payload.get("due_at")
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    assigned_to = None
    if assigned_to_user_id is not None:
        try:
            assigned_to_user_id = parse_positive_int(assigned_to_user_id, "assigned_to_user_id")
        except ValueError as exc:
            return jsonify({"message": str(exc)}), 400

        assigned_to = TeamMember.query.filter_by(project_id=project_id, user_id=assigned_to_user_id).first()
        if assigned_to is None:
            return jsonify({"message": "Assigned user must be a team member"}), 400

    parsed_due_at = None
    if due_at:
        try:
            parsed_due_at = _parse_iso_datetime(due_at, "due_at")
        except ValueError as exc:
            return jsonify({"message": str(exc)}), 400

    task = ProjectTask(
        project_id=project_id,
        title=title,
        description=description,
        assigned_to_user_id=assigned_to_user_id,
        due_at=parsed_due_at,
        created_by_id=current_user_id,
    )
    db.session.add(task)

    if assigned_to_user_id:
        _create_notification(
            user_id=assigned_to_user_id,
            title="New task assigned",
            message=f"Task '{title}' was assigned to you.",
            notif_type="task",
            project_id=project_id,
        )

    db.session.commit()
    return jsonify({"message": "Task created", "task": _serialize_task(task)}), 201


@collaboration_bp.patch("/tasks/<int:task_id>")
@jwt_required()
def update_task(task_id):
    task = db.session.get(ProjectTask, task_id)
    if task is None:
        return jsonify({"message": "Task not found"}), 404

    project = task.project
    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id) and task.assigned_to_user_id != current_user_id:
        return jsonify({"message": "You are not allowed to update this task"}), 403

    try:
        payload = parse_json_payload(request)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    if "title" in payload:
        try:
            task.title = validate_required_text(payload.get("title"), "title", min_length=3, max_length=180)
        except ValueError as exc:
            return jsonify({"message": str(exc)}), 400

    if "description" in payload:
        task.description = (payload.get("description") or "").strip() or None

    if "status" in payload:
        status = payload.get("status")
        if status not in TASK_ALLOWED_STATUSES:
            return jsonify({"message": "status must be one of to_do, in_progress, completed"}), 400
        task.status = status

    if "assigned_to_user_id" in payload:
        assigned_id = payload.get("assigned_to_user_id")
        if assigned_id is None:
            task.assigned_to_user_id = None
        else:
            try:
                assigned_id = parse_positive_int(assigned_id, "assigned_to_user_id")
            except ValueError as exc:
                return jsonify({"message": str(exc)}), 400
            member = TeamMember.query.filter_by(project_id=task.project_id, user_id=assigned_id).first()
            if member is None:
                return jsonify({"message": "Assigned user must be a team member"}), 400
            task.assigned_to_user_id = assigned_id

    if "due_at" in payload:
        due_at = payload.get("due_at")
        if due_at:
            try:
                task.due_at = _parse_iso_datetime(due_at, "due_at")
            except ValueError as exc:
                return jsonify({"message": str(exc)}), 400
        else:
            task.due_at = None

    db.session.commit()
    return jsonify({"message": "Task updated", "task": _serialize_task(task)}), 200


@collaboration_bp.delete("/tasks/<int:task_id>")
@jwt_required()
def delete_task(task_id):
    task = db.session.get(ProjectTask, task_id)
    if task is None:
        return jsonify({"message": "Task not found"}), 404

    if not _can_manage_project(task.project, _current_user_id()):
        return jsonify({"message": "Only the project owner or team leader can delete tasks"}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200


@collaboration_bp.get("/projects/<int:project_id>/announcements")
@jwt_required()
def list_announcements(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    announcements = (
        ProjectAnnouncement.query.filter_by(project_id=project_id)
        .order_by(ProjectAnnouncement.created_at.desc())
        .all()
    )
    return jsonify({"announcements": [_serialize_announcement(item) for item in announcements]}), 200


@collaboration_bp.post("/projects/<int:project_id>/announcements")
@jwt_required()
def create_announcement(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can post announcements"}), 403

    try:
        payload = parse_json_payload(request)
        content = validate_required_text(payload.get("content"), "content", min_length=3)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    announcement = ProjectAnnouncement(
        project_id=project_id,
        content=content,
        created_by_id=current_user_id,
    )
    db.session.add(announcement)

    members = TeamMember.query.filter_by(project_id=project_id).all()
    for member in members:
        _create_notification(
            user_id=member.user_id,
            title="New project announcement",
            message=content,
            notif_type="announcement",
            project_id=project_id,
        )

    db.session.commit()
    return jsonify({"message": "Announcement posted", "announcement": _serialize_announcement(announcement)}), 201


@collaboration_bp.get("/projects/<int:project_id>/messages")
@jwt_required()
def list_messages(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    messages = (
        ProjectMessage.query.filter_by(project_id=project_id)
        .order_by(ProjectMessage.created_at.asc())
        .all()
    )
    return jsonify({"messages": [_serialize_message(item) for item in messages]}), 200


@collaboration_bp.post("/projects/<int:project_id>/messages")
@jwt_required()
def post_message(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    access_error = _ensure_project_access(project, current_user_id)
    if access_error is not None:
        return access_error

    try:
        payload = parse_json_payload(request)
        message_text = validate_required_text(payload.get("message"), "message", min_length=1)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    message = ProjectMessage(project_id=project_id, sender_id=current_user_id, message=message_text)
    db.session.add(message)
    db.session.commit()
    return jsonify({"message": "Message posted", "chat_message": _serialize_message(message)}), 201


@collaboration_bp.get("/projects/<int:project_id>/files")
@jwt_required()
def list_files(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    files = ProjectFile.query.filter_by(project_id=project_id).order_by(ProjectFile.uploaded_at.desc()).all()
    return jsonify({"files": [_serialize_file(item) for item in files]}), 200


@collaboration_bp.post("/projects/<int:project_id>/files")
@jwt_required()
def add_file(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    access_error = _ensure_project_access(project, current_user_id)
    if access_error is not None:
        return access_error

    try:
        payload = parse_json_payload(request)
        file_name = validate_required_text(payload.get("file_name"), "file_name", min_length=2, max_length=255)
        file_type = validate_required_text(payload.get("file_type"), "file_type", min_length=2, max_length=40)
        file_url = validate_required_text(payload.get("file_url"), "file_url", min_length=5, max_length=800)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    project_file = ProjectFile(
        project_id=project_id,
        uploaded_by_id=current_user_id,
        file_name=file_name,
        file_type=file_type,
        file_url=file_url,
    )
    db.session.add(project_file)
    db.session.commit()
    return jsonify({"message": "File metadata saved", "file": _serialize_file(project_file)}), 201


@collaboration_bp.get("/projects/<int:project_id>/meetings")
@jwt_required()
def list_meetings(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    meetings = (
        ProjectMeeting.query.filter_by(project_id=project_id)
        .order_by(ProjectMeeting.scheduled_for.asc())
        .all()
    )
    return jsonify({"meetings": [_serialize_meeting(item) for item in meetings]}), 200


@collaboration_bp.post("/projects/<int:project_id>/meetings")
@jwt_required()
def schedule_meeting(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can schedule meetings"}), 403

    try:
        payload = parse_json_payload(request)
        title = validate_required_text(payload.get("title"), "title", min_length=3, max_length=180)
        scheduled_for = _parse_iso_datetime(payload.get("scheduled_for"), "scheduled_for")
        location = (payload.get("location") or "").strip() or None
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    meeting = ProjectMeeting(
        project_id=project_id,
        title=title,
        scheduled_for=scheduled_for,
        location=location,
        created_by_id=current_user_id,
    )
    db.session.add(meeting)

    members = TeamMember.query.filter_by(project_id=project_id).all()
    for member in members:
        _create_notification(
            user_id=member.user_id,
            title="Meeting scheduled",
            message=f"{title} at {scheduled_for.isoformat()}" + (f" ({location})" if location else ""),
            notif_type="meeting",
            project_id=project_id,
        )

    db.session.commit()
    return jsonify({"message": "Meeting scheduled", "meeting": _serialize_meeting(meeting)}), 201


@collaboration_bp.get("/notifications")
@jwt_required()
def list_notifications():
    current_user_id = _current_user_id()
    notifications = (
        Notification.query.filter_by(user_id=current_user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return jsonify({"notifications": [_serialize_notification(item) for item in notifications]}), 200


@collaboration_bp.patch("/notifications/<int:notification_id>/read")
@jwt_required()
def mark_notification_read(notification_id):
    notification = db.session.get(Notification, notification_id)
    if notification is None:
        return jsonify({"message": "Notification not found"}), 404

    if notification.user_id != _current_user_id():
        return jsonify({"message": "You are not allowed to update this notification"}), 403

    notification.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read", "notification": _serialize_notification(notification)}), 200


@collaboration_bp.get("/projects/<int:project_id>/progress")
@jwt_required()
def project_progress(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        return access_error

    total_tasks = ProjectTask.query.filter_by(project_id=project_id).count()
    completed_tasks = ProjectTask.query.filter_by(project_id=project_id, status="completed").count()
    in_progress_tasks = ProjectTask.query.filter_by(project_id=project_id, status="in_progress").count()
    to_do_tasks = ProjectTask.query.filter_by(project_id=project_id, status="to_do").count()

    progress_percent = int((completed_tasks / total_tasks) * 100) if total_tasks else 0
    return (
        jsonify(
            {
                "project_id": project_id,
                "project_status": project.status,
                "progress_percent": progress_percent,
                "tasks": {
                    "total": total_tasks,
                    "completed": completed_tasks,
                    "in_progress": in_progress_tasks,
                    "remaining": to_do_tasks,
                },
            }
        ),
        200,
    )


def _ensure_supervisor(user_id):
    user = db.session.get(User, user_id)
    if user is None or not user.is_supervisor:
        return None, (jsonify({"message": "Supervisor access required"}), 403)
    return user, None


@collaboration_bp.get("/supervisor/projects")
@jwt_required()
def supervisor_projects():
    _, error_response = _ensure_supervisor(_current_user_id())
    if error_response is not None:
        return error_response

    projects = Project.query.order_by(Project.created_at.desc()).all()
    return (
        jsonify(
            {
                "projects": [
                    {
                        "id": project.id,
                        "title": project.title,
                        "owner_id": project.owner_id,
                        "status": project.status,
                        "review_status": project.review_status,
                        "created_at": project.created_at.isoformat() if project.created_at else None,
                    }
                    for project in projects
                ]
            }
        ),
        200,
    )


@collaboration_bp.patch("/supervisor/projects/<int:project_id>/review")
@jwt_required()
def supervisor_review_project(project_id):
    _, error_response = _ensure_supervisor(_current_user_id())
    if error_response is not None:
        return error_response

    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    try:
        payload = parse_json_payload(request)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    decision = payload.get("decision")
    if decision not in ("approve", "reject"):
        return jsonify({"message": "decision must be approve or reject"}), 400

    if decision == "approve":
        project.review_status = "approved"
    else:
        project.review_status = "rejected"
        project.status = "closed"

    db.session.commit()
    return jsonify({"message": "Project review updated", "review_status": project.review_status}), 200


def _build_report_payload(project):
    team_members = TeamMember.query.filter_by(project_id=project.id).all()
    tasks = ProjectTask.query.filter_by(project_id=project.id).all()
    meetings = ProjectMeeting.query.filter_by(project_id=project.id).all()

    completed_tasks = [task for task in tasks if task.status == "completed"]
    in_progress_tasks = [task for task in tasks if task.status == "in_progress"]

    return {
        "project": {
            "id": project.id,
            "title": project.title,
            "status": project.status,
            "review_status": project.review_status,
        },
        "team_members": [
            {
                "user_id": member.user_id,
                "full_name": member.user.full_name if member.user else None,
                "role": member.role,
                "is_leader": member.is_leader,
            }
            for member in team_members
        ],
        "progress": {
            "total_tasks": len(tasks),
            "completed_tasks": len(completed_tasks),
            "in_progress_tasks": len(in_progress_tasks),
        },
        "meetings": [
            {
                "id": meeting.id,
                "title": meeting.title,
                "scheduled_for": meeting.scheduled_for.isoformat() if meeting.scheduled_for else None,
                "location": meeting.location,
            }
            for meeting in meetings
        ],
        "generated_at": datetime.utcnow().isoformat(),
    }


def _seed_team_members(project, current_user_id):
    created = 0

    existing_member = TeamMember.query.filter_by(project_id=project.id, user_id=current_user_id).first()
    if existing_member is None:
        db.session.add(
            TeamMember(
                project_id=project.id,
                user_id=current_user_id,
                role="Project Manager",
                is_leader=True,
                added_by_id=current_user_id,
            )
        )
        created += 1

    # Add up to 2 additional users if available so team tab has realistic sample records.
    candidates = (
        User.query.filter(User.id != current_user_id)
        .order_by(User.id.asc())
        .limit(2)
        .all()
    )
    candidate_roles = ["Backend Developer", "Frontend Developer"]

    for index, user in enumerate(candidates):
        existing = TeamMember.query.filter_by(project_id=project.id, user_id=user.id).first()
        if existing is None:
            db.session.add(
                TeamMember(
                    project_id=project.id,
                    user_id=user.id,
                    role=candidate_roles[index % len(candidate_roles)],
                    is_leader=False,
                    added_by_id=current_user_id,
                )
            )
            created += 1

    return created


def _seed_tasks(project, current_user_id):
    if ProjectTask.query.filter_by(project_id=project.id).first() is not None:
        return 0

    team_members = TeamMember.query.filter_by(project_id=project.id).order_by(TeamMember.id.asc()).all()
    assignees = [member.user_id for member in team_members] or [current_user_id]

    task_templates = [
        ("Build authentication middleware", "Implement JWT validation and permission checks.", "in_progress"),
        ("Design dashboard UI cards", "Create polished card views for project metrics.", "to_do"),
        ("Review API error handling", "Standardize backend error response structure.", "completed"),
    ]

    for index, (title, description, status) in enumerate(task_templates):
        db.session.add(
            ProjectTask(
                project_id=project.id,
                title=title,
                description=description,
                status=status,
                assigned_to_user_id=assignees[index % len(assignees)],
                created_by_id=current_user_id,
            )
        )

    return len(task_templates)


def _seed_announcements(project, current_user_id):
    if ProjectAnnouncement.query.filter_by(project_id=project.id).first() is not None:
        return 0

    templates = [
        "Sprint 2 starts Monday at 9:00 AM. Please update your task status today.",
        "API integration freeze on Friday 6:00 PM for testing and QA.",
    ]
    for content in templates:
        db.session.add(
            ProjectAnnouncement(project_id=project.id, content=content, created_by_id=current_user_id)
        )
    return len(templates)


def _seed_messages(project, current_user_id):
    if ProjectMessage.query.filter_by(project_id=project.id).first() is not None:
        return 0

    sender_ids = [
        member.user_id
        for member in TeamMember.query.filter_by(project_id=project.id).order_by(TeamMember.id.asc()).all()
    ] or [current_user_id]

    templates = [
        "Please prioritize login error handling before adding new dashboard widgets.",
        "Token validation fix is pushed. Please retest.",
        "I will update the UI state for failed login responses.",
    ]
    for index, text in enumerate(templates):
        db.session.add(
            ProjectMessage(
                project_id=project.id,
                sender_id=sender_ids[index % len(sender_ids)],
                message=text,
            )
        )
    return len(templates)


def _seed_files(project, current_user_id):
    if ProjectFile.query.filter_by(project_id=project.id).first() is not None:
        return 0

    templates = [
        ("api-contract-v2.pdf", "pdf", "https://example.com/files/api-contract-v2.pdf"),
        ("sprint-2-wireframes.fig", "fig", "https://example.com/files/sprint-2-wireframes.fig"),
    ]
    for file_name, file_type, file_url in templates:
        db.session.add(
            ProjectFile(
                project_id=project.id,
                uploaded_by_id=current_user_id,
                file_name=file_name,
                file_type=file_type,
                file_url=file_url,
            )
        )
    return len(templates)


def _seed_meetings(project, current_user_id):
    if ProjectMeeting.query.filter_by(project_id=project.id).first() is not None:
        return 0

    templates = [
        ("Daily Standup", datetime(2026, 7, 21, 9, 30), "Google Meet"),
        ("Sprint Planning", datetime(2026, 7, 22, 14, 0), "Room B2 / Zoom"),
    ]
    for title, scheduled_for, location in templates:
        db.session.add(
            ProjectMeeting(
                project_id=project.id,
                title=title,
                scheduled_for=scheduled_for,
                location=location,
                created_by_id=current_user_id,
            )
        )
    return len(templates)


def _seed_notifications(project, current_user_id):
    if Notification.query.filter_by(project_id=project.id, user_id=current_user_id).first() is not None:
        return 0

    templates = [
        (
            "Application update",
            "Your application shortlist was reviewed and moved to the next step.",
            "application",
        ),
        (
            "Task assigned",
            "You were assigned to Build authentication middleware.",
            "task",
        ),
        (
            "Announcement posted",
            "Sprint 2 starts Monday at 9:00 AM. Please update your task status today.",
            "announcement",
        ),
        (
            "Meeting scheduled",
            "Daily Standup was scheduled for 2026-07-21T09:30:00.",
            "meeting",
        ),
    ]

    for index, (title, message, notif_type) in enumerate(templates):
        db.session.add(
            Notification(
                user_id=current_user_id,
                project_id=project.id,
                title=title,
                message=message,
                type=notif_type,
                is_read=index == len(templates) - 1,
            )
        )

    return len(templates)


def _seed_reports(project, current_user_id):
    if ProjectReport.query.filter_by(project_id=project.id).first() is not None:
        return 0

    payload = _build_report_payload(project)
    db.session.add(
        ProjectReport(
            project_id=project.id,
            generated_by_id=current_user_id,
            report_type="summary_pdf",
            report_payload=payload,
        )
    )
    return 1


@collaboration_bp.post("/projects/<int:project_id>/seed-demo")
@jwt_required()
def seed_demo_data(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id):
        return jsonify({"message": "Only the project owner or team leader can seed demo data"}), 403

    created_counts = {
        "team_members": _seed_team_members(project, current_user_id),
    }

    created_counts["tasks"] = _seed_tasks(project, current_user_id)
    created_counts["announcements"] = _seed_announcements(project, current_user_id)
    created_counts["messages"] = _seed_messages(project, current_user_id)
    created_counts["files"] = _seed_files(project, current_user_id)
    created_counts["meetings"] = _seed_meetings(project, current_user_id)
    created_counts["reports"] = _seed_reports(project, current_user_id)
    created_counts["notifications"] = _seed_notifications(project, current_user_id)

    db.session.commit()
    return (
        jsonify(
            {
                "message": "Demo data loaded",
                "created": created_counts,
            }
        ),
        201,
    )


@collaboration_bp.post("/projects/<int:project_id>/reports")
@jwt_required()
def generate_report(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    current_user_id = _current_user_id()
    if not _can_manage_project(project, current_user_id) and not db.session.get(User, current_user_id).is_supervisor:
        return jsonify({"message": "Only project managers or supervisors can generate reports"}), 403

    data = request.get_json() or {}
    
    # Use provided report_type or default to custom
    report_type = data.get('report_type', 'Custom Report')
    
    # If report_payload provided, use it; otherwise generate from project
    if 'report_payload' in data:
        payload = data.get('report_payload', {})
    else:
        payload = _build_report_payload(project)
    
    report = ProjectReport(
        project_id=project.id,
        generated_by_id=current_user_id,
        report_type=report_type,
        report_payload=payload,
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({"message": "Report generated", "report": _serialize_report(report)}), 201


@collaboration_bp.get("/projects/<int:project_id>/reports")
@jwt_required()
def list_reports(project_id):
    project, error_response = _get_project_or_404(project_id)
    if error_response is not None:
        return error_response

    access_error = _ensure_project_access(project, _current_user_id())
    if access_error is not None:
        supervisor = db.session.get(User, _current_user_id())
        if supervisor is None or not supervisor.is_supervisor:
            return access_error

    reports = ProjectReport.query.filter_by(project_id=project_id).order_by(ProjectReport.created_at.desc()).all()
    return jsonify({"reports": [_serialize_report(report) for report in reports]}), 200
