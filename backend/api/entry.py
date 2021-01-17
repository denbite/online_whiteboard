from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from settings.constants import DB_URL, URL_PREFIX
from core import db


def create_app():
    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)
    cors = CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
    app.config[
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    ] = False  # silence the deprecation warning

    db.init_app(app)

    from settings import board_bp

    app.register_blueprint(board_bp, url_prefix=URL_PREFIX)

    with app.app_context():
        db.create_all()

        return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)