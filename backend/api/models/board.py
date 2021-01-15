from core import db
from .base import Model
from sqlalchemy.dialects.postgresql import JSON


class Board(Model, db.Model):
    __tablename__ = "board"

    url = db.Column(db.String, nullable=False, primary_key=True)

    data = db.Column(JSON, nullable=False, default={})

    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now()
    )
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    __table_args__ = (
        db.UniqueConstraint("url", name="unique-url"),
        db.PrimaryKeyConstraint("url", name="primary-url"),
    )

    def __repr__(self):
        return "<Board -> {}>".format(self.url)