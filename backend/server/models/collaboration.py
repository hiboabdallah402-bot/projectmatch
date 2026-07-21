from datetime import datetime

from extensions import db


class TeamMember(db.Model):
	__tablename__ = "team_members"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	added_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	role = db.Column(db.String(64), nullable=False, default="Contributor")
	is_leader = db.Column(db.Boolean, nullable=False, default=False)
	joined_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="team_members")
	user = db.relationship("User", foreign_keys=[user_id], back_populates="team_memberships")
	added_by = db.relationship("User", foreign_keys=[added_by_id])

	__table_args__ = (
		db.UniqueConstraint("project_id", "user_id", name="uq_team_member_per_project"),
	)


class ProjectTask(db.Model):
	__tablename__ = "project_tasks"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	title = db.Column(db.String(180), nullable=False)
	description = db.Column(db.Text, nullable=True)
	status = db.Column(db.String(20), nullable=False, default="to_do")
	assigned_to_user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
		index=True,
	)
	created_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	due_at = db.Column(db.DateTime, nullable=True)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	updated_at = db.Column(
		db.DateTime,
		nullable=False,
		default=datetime.utcnow,
		onupdate=datetime.utcnow,
	)

	project = db.relationship("Project", back_populates="tasks")
	assigned_to = db.relationship("User", foreign_keys=[assigned_to_user_id], back_populates="assigned_tasks")
	created_by = db.relationship("User", foreign_keys=[created_by_id])

	__table_args__ = (
		db.CheckConstraint(
			"status IN ('to_do', 'in_progress', 'completed')",
			name="ck_project_tasks_status_valid",
		),
	)


class ProjectAnnouncement(db.Model):
	__tablename__ = "project_announcements"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	content = db.Column(db.Text, nullable=False)
	created_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="announcements")
	created_by = db.relationship("User")


class ProjectMessage(db.Model):
	__tablename__ = "project_messages"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	sender_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
		index=True,
	)
	message = db.Column(db.Text, nullable=False)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="messages")
	sender = db.relationship("User", back_populates="messages")


class ProjectFile(db.Model):
	__tablename__ = "project_files"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	uploaded_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	file_name = db.Column(db.String(255), nullable=False)
	file_type = db.Column(db.String(40), nullable=False)
	file_url = db.Column(db.String(800), nullable=False)
	uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="files")
	uploaded_by = db.relationship("User")


class ProjectMeeting(db.Model):
	__tablename__ = "project_meetings"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	title = db.Column(db.String(180), nullable=False)
	scheduled_for = db.Column(db.DateTime, nullable=False)
	location = db.Column(db.String(180), nullable=True)
	created_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="meetings")
	created_by = db.relationship("User")


class Notification(db.Model):
	__tablename__ = "notifications"

	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="CASCADE"),
		nullable=False,
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
	type = db.Column(db.String(50), nullable=False)
	title = db.Column(db.String(180), nullable=False)
	message = db.Column(db.Text, nullable=False)
	priority = db.Column(db.String(20), nullable=False, default="normal")  # normal, high, urgent
	is_read = db.Column(db.Boolean, nullable=False, default=False)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	user = db.relationship("User", back_populates="notifications")
	project = db.relationship("Project")
	application = db.relationship("Application")


class ProjectReport(db.Model):
	__tablename__ = "project_reports"

	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	generated_by_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="SET NULL"),
		nullable=True,
	)
	report_type = db.Column(db.String(50), nullable=False, default="summary_pdf")
	report_payload = db.Column(db.JSON, nullable=False)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	project = db.relationship("Project", back_populates="reports")
	generated_by = db.relationship("User")
