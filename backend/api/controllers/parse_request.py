from flask import request


def get_request_data() -> dict:
    """
    Get keys & values from request (Note that this method should parse requests with content type "application/x-www-form-urlencoded")
    """

    data = dict(request.values)

    return data