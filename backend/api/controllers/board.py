from .parse_request import get_request_data
from core.response import send_error_response, send_success_response
from models import Board
from sqlalchemy.orm.exc import NoResultFound
from json import loads
from copy import deepcopy

# {
#         "2.#55faab": [[{"x": 271, "y": 272}, {"x": 325, "y": 295}, {"x": 371, "y": 145}], [{"x": 271, "y": 171}, {"x": 310, "y": 259}, {"x": 371, "y": 145}]],
#         "6.#bcc721": [[{"x": 211, "y": 222}, {"x": 332, "y": 276}, {"x": 354, "y": 140}]],
#     }


def get_board():

    data = get_request_data()

    for required_field in ["board_url"]:
        if required_field not in data.keys():
            err = "No '{field}' specified".format(field=required_field)
            return send_error_response(400, err)

    try:
        board_url = str(data["board_url"])
    except Exception as err:
        return send_error_response(400, str(err))

    try:
        board_obj = Board.query.filter_by(url=board_url).one()
    except NoResultFound:
        err = "Didn't found board with url '{}'".format(board_url)
        return send_error_response(404, err)

    board = {"board_url": board_obj.url, "board_data": board_obj.data}

    return send_success_response(board)


def update_board_with_delta():

    data = get_request_data()

    for required_field in ["board_url", "data_delta", "key"]:
        if required_field not in data.keys():
            err = "No '{field}' specified".format(field=required_field)
            return send_error_response(400, err)

    try:
        board_url = str(data["board_url"])
        data_delta = loads(data["data_delta"])
        key = str(data["key"])
    except Exception as err:
        return send_error_response(400, str(err))

    # todo: could add regex for check key correct or no
    if len(key) != 9:
        err = "Invalid key given"
        return send_error_response(400, err)

    if not data_delta:
        err = "No empty delta allowed"
        return send_error_response(400, err)

    # todo: how to validate input delta for correct structure?

    try:
        board_obj = Board.query.filter_by(url=board_url).one()
    except NoResultFound:
        err = "Didn't found board with url '{}'".format(board_url)
        return send_error_response(404, err)

    new_data: dict = deepcopy(board_obj.data)

    # assume key is correct
    if key not in new_data:
        new_data[key] = []

    new_data[key].append(data_delta)

    try:
        updated_obj = Board.update({"url": board_url}, **{"data": new_data})
    except Exception as err:
        return send_error_response(400, str(err))

    updated_record = {
        k: v for k, v in updated_obj.__dict__.items() if k in ["url", "data"]
    }

    return send_success_response(updated_record)
