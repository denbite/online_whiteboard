from flask import Flask, request
from flask import current_app as app
from settings.constants import URI_PREFIX
from controllers import board


@app.route("{}/board".format(URI_PREFIX), methods=["GET", "PUT", "POST"])
def board_methods():
    if request.method == "GET":
        return board.get_board()
    elif request.method == "PUT":
        return board.update_board()
    elif request.method == "POST":
        return board.create_board()