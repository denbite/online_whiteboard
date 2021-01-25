import logging

from flask import request

logging.basicConfig(level=logging.INFO)


def get_request_data() -> dict:
    """
    Get keys & values from request
    (Note that this method should parse requests with
    content type "application/x-www-form-urlencoded")
    """

    logging.info("received request: {}".format(dict(request.values)))

    data = dict(request.values)

    return data
