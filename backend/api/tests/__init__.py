from . import *
import os, tempfile, pytest
from werkzeug.test import Client

from entry import create_app


@pytest.fixture
def client() -> Client:
    app = create_app()
    db_fd, app.config["DATABASE"] = tempfile.mkstemp()
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(app.config["DATABASE"])