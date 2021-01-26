import logging
from copy import deepcopy
from hashlib import sha256
from json import loads
from time import time

from core.response import send_error_response, send_success_response
from models import Board
from sqlalchemy.orm.exc import NoResultFound

logging.basicConfig(level=logging.INFO)


def get_board(data):
    """
    Try to get data about the board by parameter 'board_url'.

    Function is called upon GET request, checks request
    parameters and get data from DB if record exists

    Args:
        data (dict): Parameters from request query and body

    Returns:
        flask.Response with JSON-data regardless of success

    """
    # validate all required fields exists
    for required_field in ["board_url"]:
        if required_field not in data.keys():
            err = f"No '{required_field}' specified"
            return send_error_response(400, err)

    try:
        board_url = str(data["board_url"])
    except Exception as err:
        return send_error_response(400, str(err))

    try:
        board_obj = Board.query.filter_by(url=board_url).one()
    except NoResultFound:
        err = f"Didn't find board with url '{board_url}'"
        return send_error_response(404, err)

    board = {"board_url": board_obj.url, "board_data": board_obj.data}

    return send_success_response(board)


def update_board(data):
    """
    Try to update board data in DB.

    Function is called upon PUT request, checks request
    parameters for required fields and current action,
    validate data for correct structure and
    then update data in DB if such record exists

    Args:
        data (dict): Parameters from request query and body

    Returns:
        flask.Response with JSON-data regardless of success

    """
    if "action" not in data.keys():
        err = "No 'action' specified"
        return send_error_response(400, err)

    action = data["action"]

    if action == "BOARD_ADD_PIC":
        # validate all required fields exists for this action
        for required_field in ["board_url", "data_delta", "key"]:
            if required_field not in data.keys():
                err = f"No '{required_field}' specified"
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
            err = f"Didn't find board with url '{board_url}'"
            return send_error_response(404, err)

        new_data: dict = deepcopy(board_obj.data)

        # assume key is correct
        if key not in new_data:
            new_data[key] = []

        new_data[key].append(data_delta)

        try:
            updated_obj = Board.update(
                {"url": board_url}, **{"data": new_data}
            )
        except Exception as err:
            return send_error_response(400, str(err))

    elif action == "BOARD_CLEAR":
        # validate all required fields exists for this action
        for required_field in ["board_url"]:
            if required_field not in data.keys():
                err = f"No '{required_field}' specified"
                return send_error_response(400, err)

        try:
            board_url = str(data["board_url"])
        except Exception as err:
            return send_error_response(400, str(err))

        try:
            Board.query.filter_by(url=board_url).one()
        except NoResultFound:
            err = f"Didn't find board with url '{board_url}'"
            return send_error_response(404, err)

        try:
            updated_obj = Board.update({"url": board_url}, **{"data": {}})
        except Exception as err:
            return send_error_response(400, str(err))

    elif action == "BOARD_INIT_POINTS":
        pass

    else:
        err = (
            "Invalid action type, choose from "
            + "['BOARD_ADD_PIC', 'BOARD_CLEAR', 'BOARD_INIT_POINTS']"
        )

        return send_error_response(400, err)

    return send_success_response(
        {"board_url": updated_obj.url, "board_data": updated_obj.data}
    )


def create_board(data):
    """
    Try to create board record in DB.

    Function is called upon POST request, checks request
    parameters for required fields,
    generates a new 'board_url' using sha256 algorithm
    according to the current time and the received data,
    then create record in DB

    Args:
        data (dict): Parameters from request query and body

    Returns:
        flask.Response with JSON-data regardless of success

    """
    # validate all required fields exists
    for required_field in ["points"]:
        if required_field not in data.keys():
            err = f"No '{required_field}' specified"
            return send_error_response(400, err)

    try:
        points = loads(data["points"])
    except Exception as err:
        return send_error_response(400, str(err))

    # todo: how to validate input points for correct structure?

    # todo: fix case when generating 'board_url'
    # at the same time and with empty data

    # generate new board_url
    first = sha256(str(time()).encode()).hexdigest()
    second = sha256(str(data).encode()).hexdigest()
    board_url = f"{first[:4]}{second[:8]}{first[-4:]}"

    try:
        obj = Board.create(**{"data": points, "url": board_url})
    except Exception as err:
        return send_error_response(400, str(err))

    return send_success_response({"board_url": obj.url})


def delete_board(data: dict):
    """
    Try to delete board record from DB.

    Function is called upon DELETE request, checks request
    parameters for required fields, then delete record
    from DB if it exists

    Args:
        data (dict): Parameters from request query and body

    Returns:
        flask.Response with JSON-data regardless of success

    """
    # validate all required fields exists
    for required_field in ["board_url"]:
        if required_field not in data.keys():
            err = f"No '{required_field}' specified"
            return send_error_response(400, err)

    try:
        board_url = str(data["board_url"])
    except Exception as err:
        return send_error_response(400, str(err))

    try:
        # checks if record with such 'board_url' exists in DB
        if not Board.delete({"url": board_url}):
            err = f"Didn't find board with url '{board_url}'"
            return send_error_response(404, err)
    except Exception as err:
        return send_error_response(400, str(err))

    return send_success_response()
