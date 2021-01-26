from core import BaseModel, db
from sqlalchemy.dialects.postgresql import JSON


class Board(BaseModel, db.Model):
    """
    ORM model for table "board" that include columns.

    Attributes:
        url (str): Unique identifier.
        data (dict): Arrays of points that uses for drawing board
        updated_at (int): Time when record was updated last time
        created_at (int): Time when record was created
        __table_args__ (tuple): Indexes for current table
    """

    __tablename__ = "board"

    url = db.Column(db.String, nullable=False, primary_key=True)

    data = db.Column(JSON, nullable=False, default={})

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        server_onupdate=db.func.now(),
    )
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    __table_args__ = (
        db.UniqueConstraint("url", name="unique-url"),
        db.PrimaryKeyConstraint("url", name="primary-url"),
    )

    def __repr__(self):
        return f"<Board -> {self.url}>"
