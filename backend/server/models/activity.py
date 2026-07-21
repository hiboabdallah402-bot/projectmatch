from datetime import datetime

from extensions import db


class Activity(db.Model):
	__tablename__ = "activities"

	id = db.Column(db.Integer, primary_key=True)
	type = db.Column(db.String(50), nullable=False, index=True)
	actor_user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	target_user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
		index=True,
	)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=True,
		index=True,
	)
	application_id = db.Column(
		db.Integer,
		db.ForeignKey("applications.id", ondelete="CASCADE"),
		nullable=True,
		index=True,
	)
	description = db.Column(db.Text, nullable=False)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

	actor = db.relationship("User", foreign_keys=[actor_user_id])
	target_user = db.relationship("User", foreign_keys=[target_user_id])
	project = db.relationship("Project")
	application = db.relationship("Application")

	__table_args__ = (
		db.CheckConstraint(
			"type IN ("
			"'project_created', "
			"'project_submitted_for_review', "
			"'project_approved', "
			"'project_rejected', "
			"'project_changes_requested', "
			"'application_submitted', "
			"'application_accepted', "
			"'application_rejected', "
			"'team_member_added', "
			"'team_member_removed', "
			"'profile_updated', "
			"'task_created', "
			"'task_completed', "
			"'announcement_posted'"
			")",
			name="ck_activities_type_valid",
		),
	)

	def __repr__(self) -> str:
		return f"<Activity id={self.id} type={self.type} actor_id={self.actor_user_id}>"
