from .parse_request import get_request_data
from core.response import send_error_response, send_success_response
from models import Board
from sqlalchemy.orm.exc import NoResultFound

# {
#         "2.#55faab": [[{"x": 271, "y": 272}, {"x": 325, "y": 295}, {"x": 371, "y": 145}], [{"x": 271, "y": 171}, {"x": 310, "y": 259}, {"x": 371, "y": 145}]],
#         "6.#bcc721": [[{"x": 211, "y": 222}, {"x": 332, "y": 276}, {"x": 354, "y": 140}]],
#     }


def get_board_by_url():

    data = get_request_data()
    print("received request: ", data)

    if "board_url" not in data.keys():
        err = "No 'board_url' specified"
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
