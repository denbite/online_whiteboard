import logging

from flask import request

logging.basicConfig(level=logging.INFO)


def get_request_data() -> dict:
    """
    Get keys & values from request.

    (Note that this method parse requests with
    content type "application/x-www-form-urlencoded")

    """
    data = dict(request.values)

    logging.info(f"received request: {data}")

    return data
