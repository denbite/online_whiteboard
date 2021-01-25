from json import dumps, loads

import pytest
from flask.wrappers import Response
from settings.constants import URL_PREFIX

from . import client  # noqa

ROUTE_BOARD_API = f"{URL_PREFIX}/board"


def pytest_configure():
    # url of created board (necessary for test GET/UPDATE/DELETE REQUESTS)
    pytest.board_url = None


def _check_response_structure(
    response_bytes: bytes,
    status_code: int,
    expected_success: bool,
    expected_code: int,
) -> None:
    """
    Check if response structure is correct like below.

    success response: {
        'success': True,
        'data' : {...}
    }


    error response: {
        'success': False,
        'error': {
            'code': int,
            'message': str
        }
    }
    """

    try:
        response_data = loads(response_bytes)
    except Exception:
        assert False, "couldn't read response data, expected for JSON format"

    assert (
        "success" in response_data
    ), "invalid response structure, must be 'success' key"

    assert (
        response_data["success"] == expected_success
    ), "'success' must be {exp}, got {got}".format(
        got=response_data["success"], exp=expected_success
    )

    if expected_success:
        assert (
            "data" in response_data
        ), "invalid response structure, must be 'data' key"
    else:
        assert (
            "error" in response_data
        ), "invalid response structure, must be 'error' key"

        assert (
            "code" in response_data["error"]
        ), "invalid response structure, must be 'code' error key"

        assert (
            "message" in response_data["error"]
        ), "invalid response structure, must be 'message' error key"

        assert (
            response_data["error"]["code"] == status_code
        ), "status codes must be the same"

    assert (
        status_code == expected_code
    ), f"status code must be {expected_code}, got {status_code}"


def test_create(client):
    # test without body
    rv: Response = client.post(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # test with empty points, but not stringified
    rv: Response = client.post(ROUTE_BOARD_API, data={"points": {}})
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # test with stringified empty points
    rv: Response = client.post(ROUTE_BOARD_API, data={"points": dumps({})})
    _check_response_structure(rv.data, rv.status_code, True, 200)
    assert (
        "board_url" in loads(rv.data)["data"]
    ), "response data must contain key 'board_url'"
    # check length of created board_url identifier
    assert (
        len(loads(rv.data)["data"]["board_url"]) == 16
    ), "length of board_url must be 16 characters"

    # save url of board to global variable
    pytest.board_url = loads(rv.data)["data"]["board_url"]


def test_get(client):
    assert hasattr(pytest, "board_url"), "error when create board"

    rv: Response = client.get(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.get(ROUTE_BOARD_API, query_string={"board_url": ""})
    _check_response_structure(rv.data, rv.status_code, False, 404)

    rv: Response = client.get(
        ROUTE_BOARD_API, query_string={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)
    assert (
        "board_data" in loads(rv.data)["data"]
    ), "response data must contain key 'board_data'"
    assert (
        "board_url" in loads(rv.data)["data"]
    ), "response data must contain key 'board_url'"
    assert (
        loads(rv.data)["data"]["board_url"] == pytest.board_url
    ), "board_url must be equal in query and response"
    assert (
        loads(rv.data)["data"]["board_data"] == {}
    ), "board_data must be empty on this step"


def test_update(client):
    assert hasattr(pytest, "board_url"), "error when create board"

    rv: Response = client.put(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(ROUTE_BOARD_API, data={"action": ""})
    _check_response_structure(rv.data, rv.status_code, False, 400)

    """
    Test action BOARD_INIT_POINTS
    """
    # todo: test right here action BOARD_INIT_POINTS

    """
    Test action BOARD_ADD_PIC
    """

    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_ADD_PIC"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_ADD_PIC", "board_url": "5"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={"action": "BOARD_ADD_PIC", "board_url": "5", "data_delta": "{}"},
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_ADD_PIC",
            "board_url": "5",
            "data_delta": dumps([]),
            "key": "2212",
        },
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # no empty delta
    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_ADD_PIC",
            "board_url": "5",
            "data_delta": dumps([]),
            "key": "6.#bcabca",
        },
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_ADD_PIC",
            "board_url": "5",
            "data_delta": dumps([{"x": 255, "y": 271}, {"x": 281, "y": 372}]),
            "key": "6.#bcabca",
        },
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)

    # send correct data, test adding delta
    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_ADD_PIC",
            "board_url": pytest.board_url,
            "data_delta": dumps([{"x": 255, "y": 271}, {"x": 281, "y": 372}]),
            "key": "6.#bcabca",
        },
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)
    assert (
        "board_data" in loads(rv.data)["data"]
    ), "response data must contain key 'board_data'"
    assert (
        "board_url" in loads(rv.data)["data"]
    ), "response data must contain key 'board_url'"
    assert (
        loads(rv.data)["data"]["board_url"] == pytest.board_url
    ), "board_url must be equal in query and response"
    assert loads(rv.data)["data"]["board_data"] == {
        "6.#bcabca": [[{"x": 255, "y": 271}, {"x": 281, "y": 372}]]
    }, "board_data must contain only one pic on this step"

    """
    Test action BOARD_CLEAR
    """

    rv: Response = client.put(ROUTE_BOARD_API, data={"action": "BOARD_CLEAR"})
    _check_response_structure(rv.data, rv.status_code, False, 400)

    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_CLEAR", "board_url": "5"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)

    # send correct data, test adding delta
    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_CLEAR",
            "board_url": pytest.board_url,
        },
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)
    assert (
        "board_data" in loads(rv.data)["data"]
    ), "response data must contain key 'board_data'"
    assert (
        "board_url" in loads(rv.data)["data"]
    ), "response data must contain key 'board_url'"
    assert (
        loads(rv.data)["data"]["board_url"] == pytest.board_url
    ), "board_url must be equal in query and response"
    assert (
        loads(rv.data)["data"]["board_data"] == {}
    ), "board_data must be clear on this step"


def test_delete(client):
    assert hasattr(pytest, "board_url"), "error when create board"

    rv: Response = client.delete(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # invalid board_url
    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": f"{pytest.board_url}1"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)

    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)

    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)
