from datetime import datetime

from extensions import db


class Project(db.Model):
	__tablename__ = "projects"

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(150), nullable=False)
	description = db.Column(db.Text, nullable=False)
	required_skills = db.Column(db.Text, nullable=False)
	team_size = db.Column(db.Integer, nullable=False)
	status = db.Column(db.String(20), nullable=False, default="open")
	review_status = db.Column(db.String(20), nullable=False, default="pending")
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

	owner = db.relationship("User", back_populates="projects")
	applications = db.relationship(
		"Application",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	team_members = db.relationship(
		"TeamMember",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	tasks = db.relationship(
		"ProjectTask",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	announcements = db.relationship(
		"ProjectAnnouncement",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	messages = db.relationship(
		"ProjectMessage",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	files = db.relationship(
		"ProjectFile",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	meetings = db.relationship(
		"ProjectMeeting",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)
	reports = db.relationship(
		"ProjectReport",
		back_populates="project",
		cascade="all, delete-orphan",
		lazy=True,
	)

	__table_args__ = (
		db.CheckConstraint(
			"status IN ('open', 'in_progress', 'completed', 'closed')",
			name="ck_projects_status_valid",
		),
		db.CheckConstraint(
			"review_status IN ('pending', 'approved', 'rejected')",
			name="ck_projects_review_status_valid",
		),
		db.CheckConstraint("team_size > 0", name="ck_projects_team_size_positive"),
	)

	def __repr__(self) -> str:
		return f"<Project id={self.id} title={self.title}>"
