from flask import Flask, request
from flask import current_app as app
from settings.constants import URI_PREFIX
from controllers import board


@app.route("{}/board".format(URI_PREFIX), methods=["GET", "PUT"])
def board_methods():
    if request.method == "GET":
        return board.get_board()
    elif request.method == "PUT":
        return board.update_board_with_delta()