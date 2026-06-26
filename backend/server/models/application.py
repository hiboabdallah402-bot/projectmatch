from datetime import datetime

from extensions import db


class Application(db.Model):
	__tablename__ = "applications"

	id = db.Column(db.Integer, primary_key=True)
	status = db.Column(db.String(20), nullable=False, default="Pending")
	applied_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)
	project_id = db.Column(
		db.Integer,
		db.ForeignKey("projects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)

	user = db.relationship("User", back_populates="applications")
	project = db.relationship("Project", back_populates="applications")

	__table_args__ = (
		db.CheckConstraint(
			"status IN ('Pending', 'Accepted', 'Rejected')",
			name="ck_applications_status_valid",
		),
		db.UniqueConstraint("user_id", "project_id", name="uq_user_project_application"),
	)

	def __repr__(self) -> str:
		return (
			f"<Application id={self.id} user_id={self.user_id} "
			f"project_id={self.project_id} status={self.status}>"
		)
