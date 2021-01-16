from .parse_request import get_request_data
from core.response import send_error_response, send_success_response
from models import Board
from sqlalchemy.orm.exc import NoResultFound
from json import loads
from copy import deepcopy
from hashlib import md5
from time import time
from random import randint
import logging

logging.basicConfig(level=logging.INFO)

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


def update_board():

    data = get_request_data()

    if "action" not in data.keys():
        err = "No 'action' specified"
        return send_error_response(400, err)

    action = data["action"]

    if action == "BOARD_ADD_PIC":
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

    elif action == "BOARD_CLEAR":

        for required_field in ["board_url"]:
            if required_field not in data.keys():
                err = "No '{field}' specified".format(field=required_field)
                return send_error_response(400, err)

        try:
            board_url = str(data["board_url"])
        except Exception as err:
            return send_error_response(400, str(err))

        try:
            Board.query.filter_by(url=board_url).one()
        except NoResultFound:
            err = "Didn't found board with url '{}'".format(board_url)
            return send_error_response(404, err)

        try:
            updated_obj = Board.update({"url": board_url}, **{"data": {}})
        except Exception as err:
            return send_error_response(400, str(err))

    elif action == "BOARD_INIT_POINTS":
        pass

    else:
        err = "Invalid action type, choose from ['BOARD_ADD_PIC', 'BOARD_CLEAR', 'BOARD_INIT_POINTS']"
        return send_error_response(400, err)

    updated_record = {
        k: v for k, v in updated_obj.__dict__.items() if k in ["url", "data"]
    }

    return send_success_response(updated_record)


def create_board():
    data = get_request_data()

    for required_field in ["points"]:
        if required_field not in data.keys():
            err = "No '{field}' specified".format(field=required_field)
            return send_error_response(400, err)

    try:
        points = loads(data["points"])
    except Exception as err:
        return send_error_response(400, str(err))

    # todo: how to validate input points for correct structure?

    # generate new board_url
    first = md5(str(time()).encode()).hexdigest()
    second = md5(str(randint(0, 2 ** 16)).encode()).hexdigest()

    board_url = "{}{}{}".format(first[:4], second[:8], first[-4:])
    logging.info("final: {}".format(board_url))

    try:
        obj = Board.create(**{"data": points, "url": board_url})
    except Exception as err:
        return send_error_response(400, str(err))

    return send_success_response({"board_url": obj.url})


def delete_board():
    data = get_request_data()

    for required_field in ["board_url"]:
        if required_field not in data.keys():
            err = "No '{field}' specified".format(field=required_field)
            return send_error_response(400, err)

    try:
        board_url = str(data["board_url"])
    except Exception as err:
        return send_error_response(400, str(err))

    logging.info(board_url)

    try:
        if not Board.delete({"url": board_url}):
            err = "Didn't found board with url '{}'".format(board_url)
            return send_error_response(400, err)
    except Exception as err:
        return send_error_response(400, str(err))

    return send_success_response()