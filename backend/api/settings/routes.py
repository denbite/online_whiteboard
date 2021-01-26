from controllers import board
from core import get_request_data
from flask import Blueprint, request

board_bp = Blueprint("board_blueprint", __name__)


@board_bp.route("/board", methods=["GET", "PUT", "POST", "DELETE"])
def board_methods():
    """
    Route incoming request with prefix /board.

    Route incoming request to the responible controller
    depending on request method

    Returns:
        flask.Response

    Raises:
        MethodNotAllowed: if request method not in [GET, PUT, POST, DELETE]
    """
    data = get_request_data()

    if request.method == "GET":
        return board.get_board(data)
    elif request.method == "PUT":
        return board.update_board(data)
    elif request.method == "POST":
        return board.create_board(data)
    elif request.method == "DELETE":
        return board.delete_board(data)
