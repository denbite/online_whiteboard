from __future__ import annotations

from flask import Response, jsonify, make_response

__all__ = ("send_error_response", "send_success_response")


def send_error_response(
    code: int, message: str, data: dict = None
) -> Response:
    return __send_response(False, code=code, message=message, data=data)


def send_success_response(
    data: [dict, list, str] = {}, pagination: dict = None
) -> Response:
    return __send_response(True, data=data, pagination=pagination)


def __send_response(
    success: bool,
    code: int = None,
    message: str = None,
    data=None,
    pagination=None,
) -> Response:
    r = {"success": success}

    if code is not None and message is not None:
        r["error"] = {"code": code, "message": message}

    if data is not None:
        r["data"] = data

    if pagination is not None:
        r["pagination"] = pagination

    return make_response(jsonify(r), code)
