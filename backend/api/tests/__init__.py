"""Implement controller testing."""
import os
import tempfile

import pytest
from entry import create_app


@pytest.fixture()
def client():
    """
    Create pytest fixture with test client instance.

    Yields:
        werkzeug.test.Client: Test app client.

    """
    app = create_app()
    db_fd, app.config["DATABASE"] = tempfile.mkstemp()
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(app.config["DATABASE"])
