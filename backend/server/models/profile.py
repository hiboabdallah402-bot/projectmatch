from extensions import db


class Profile(db.Model):
	__tablename__ = "profiles"

	id = db.Column(db.Integer, primary_key=True)
	bio = db.Column(db.Text, nullable=True)
	skills = db.Column(db.Text, nullable=True)
	profile_image = db.Column(db.String(500), nullable=True)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey("users.id", ondelete="CASCADE"),
		nullable=False,
		unique=True,
		index=True,
	)

	user = db.relationship("User", back_populates="profile")

	def __repr__(self) -> str:
		return f"<Profile id={self.id} user_id={self.user_id}>"
