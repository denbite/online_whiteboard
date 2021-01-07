from flask import Flask, request
from flask import current_app as app
from settings.constants import URI_PREFIX
from controllers import main


@app.route("/", methods=["GET"])
def index():
    if request.method == "GET":
        return main.index()