from datetime import datetime

from extensions import db


class User(db.Model):
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	full_name = db.Column(db.String(120), nullable=False)
	email = db.Column(db.String(255), unique=True, nullable=False, index=True)
	password_hash = db.Column(db.String(255), nullable=False)
	is_supervisor = db.Column(db.Boolean, nullable=False, default=False)
	created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	profile = db.relationship(
		"Profile",
		back_populates="user",
		uselist=False,
		cascade="all, delete-orphan",
	)
	projects = db.relationship(
		"Project",
		back_populates="owner",
		cascade="all, delete-orphan",
		lazy=True,
	)
	applications = db.relationship(
		"Application",
		back_populates="user",
		cascade="all, delete-orphan",
		lazy=True,
	)
	team_memberships = db.relationship(
		"TeamMember",
		foreign_keys="TeamMember.user_id",
		back_populates="user",
		cascade="all, delete-orphan",
		lazy=True,
	)
	assigned_tasks = db.relationship(
		"ProjectTask",
		foreign_keys="ProjectTask.assigned_to_user_id",
		back_populates="assigned_to",
		lazy=True,
	)
	messages = db.relationship(
		"ProjectMessage",
		back_populates="sender",
		cascade="all, delete-orphan",
		lazy=True,
	)
	notifications = db.relationship(
		"Notification",
		back_populates="user",
		cascade="all, delete-orphan",
		lazy=True,
	)

	def __repr__(self) -> str:
		return f"<User id={self.id} email={self.email}>"
