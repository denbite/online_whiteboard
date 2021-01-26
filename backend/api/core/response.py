from flask import jsonify, make_response

__all__ = ("send_error_response", "send_success_response")


def send_error_response(code, message):
    """
    Send error response for the received request.

    Args:
        code (int): Error code.
        message (str): Error message.

    Returns:
        JSON-data error flask.Response with such structure:
        {
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    """
    return _send_response(False, code=code, message=message)


def send_success_response(data={}, pagination=None):
    """
    Send success response for the received request.

    Args:
        data (dict, list, str): Response data. Defaults to {}.
        pagination (dict): Pagination data for cases of much
            data receiving. Defaults to None.

    Returns:
        JSON-data success flask.Response with such structure:
        {
            "success": True,
            "data": data,
            "pagination": pagination (if it's not None)
        }
    """
    return _send_response(True, data=data, pagination=pagination)


def _send_response(success, code=None, message=None, data={}, pagination=None):
    """
    Private function for sending response.

    Args:
        success (bool): Response success.
        code (int): Response code. Defaults to None.
        message (str): Response message. Uses if error. Defaults to None.
        data (dict, list, str): Response data. Defaults to {}.
        pagination (dict): Pagination data for cases of much
            data receiving. Defaults to None.

    Returns:
        flask.Response with JSON-data regardless of success

    """
    r = {"success": success}

    if not success and code is not None and message is not None:
        r["error"] = {"code": code, "message": message}

    if success and data is not None:
        r["data"] = data

    if success and pagination is not None:
        r["pagination"] = pagination

    return make_response(jsonify(r), 200 if success else code)
