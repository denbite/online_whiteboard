from flask import Flask, request, Blueprint
from controllers import board

board_bp = Blueprint("board_blueprint", __name__)


@board_bp.route("/board", methods=("GET", "PUT", "POST", "DELETE"))
def board_methods():
    if request.method == "GET":
        return board.get_board()
    elif request.method == "PUT":
        return board.update_board()
    elif request.method == "POST":
        return board.create_board()
    elif request.method == "DELETE":
        return board.delete_board()