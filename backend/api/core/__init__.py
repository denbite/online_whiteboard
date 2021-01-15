from . import *
from .response import send_error_response, send_success_response
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from settings.constants import DB_URL


db: SQLAlchemy = SQLAlchemy()


def create_app():
    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)
    cors = CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
    app.config[
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    ] = False  # silence the deprecation warning

    db.init_app(app)

    with app.app_context():
        # Imports
        from . import routes

        # Create tables for our models
        db.create_all()

        return app