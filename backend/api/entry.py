from os import getenv

from core import db
from flask import Flask
from flask_cors import CORS
from settings import DB_URL, URL_PREFIX


def create_app():
    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)
    CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
    app.config[
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    ] = False  # silence the deprecation warning

    app.secret_key = getenv("FLASK_SECRET_KEY")

    db.init_app(app)

    from settings import board_bp

    app.register_blueprint(board_bp, url_prefix=URL_PREFIX)

    with app.app_context():
        db.create_all()

        return app


if __name__ == "__main__":

    mode = getenv("FLASK_ENV", "development")

    app = create_app()

    if mode == "production":
        from waitress import serve

        serve(app, host="0.0.0.0", port=8000)  # noqa
    else:
        app.run(host="127.0.0.1", port=8000)
