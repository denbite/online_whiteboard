from json import dumps, loads

import pytest
from flask.wrappers import Response
from settings.constants import URL_PREFIX

from . import client  # noqa

ROUTE_BOARD_API = f"{URL_PREFIX}/board"


def pytest_configure():
    """Create global variable for testing board controller."""
    # url of created board (necessary for test GET/UPDATE/DELETE requests)
    pytest.board_url = None


def _check_response_structure(
    response_bytes, status_code, expected_success, expected_code
):
    """
    Check if response structure is correct like below.

    success response expect:
    {
        'success': True,
        'data' : data
    }

    error response expect:
    {
        'success': False,
        'error': {
            'code': code,
            'message': message
        }
    }

    Args:
        response_bytes (bytes): Response from test app.
        status_code (int): Response code from test app.
        expected_success (bool): Expected success status
            for this response.
        expected_code (int): Expected code for this response.

    Raises:
        AssertionError: If structure is invalid or
            if expected response doesn't match given

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
    """
    Testing create records through POST request.

    Main goal of this function is to check how controller reacts
    for requests with empty body, invalid body and suitable body

    Args:
        client (werkzeug.test.Client): Test app client from pytest fixture.

    Raises:
        AssertionError: If structure is invalid or
            if expected response doesn't match given or
            if response data is invalid

    """
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
    """
    Testing get record through GET request.

    Main goal of this function is to check how controller reacts
    for requests with empty, invalid and suitable query

    Args:
        client (werkzeug.test.Client): Test app client from pytest fixture.

    Raises:
        AssertionError: If structure is invalid or
            if expected response doesn't match given or
            if response data is invalid

    """
    # check if exists global variable with 'board_url'
    assert hasattr(pytest, "board_url"), "error when create board"

    # without query
    rv: Response = client.get(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # query with invalid 'board_url'
    rv: Response = client.get(ROUTE_BOARD_API, query_string={"board_url": ""})
    _check_response_structure(rv.data, rv.status_code, False, 404)

    # query with correct 'board_url'
    rv: Response = client.get(
        ROUTE_BOARD_API, query_string={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)

    # validate response data
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
    """
    Testing update record through PUT request.

    Main goal of this function is to check how controller reacts
    for requests with different body parameters

    Args:
        client (werkzeug.test.Client): Test app client from pytest fixture.

    Raises:
        AssertionError: If structure is invalid or
            if expected response doesn't match given or
            if response data is invalid

    """
    # check if exists global variable with 'board_url'
    assert hasattr(pytest, "board_url"), "error when create board"

    # without body
    rv: Response = client.put(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid 'action' in body
    rv: Response = client.put(ROUTE_BOARD_API, data={"action": ""})
    _check_response_structure(rv.data, rv.status_code, False, 400)

    """
    Test action BOARD_INIT_POINTS (next action is correct).
    """
    # todo: test right here action BOARD_INIT_POINTS

    """
    Test action BOARD_ADD_PIC (next action is correct).
    """
    # without other body
    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_ADD_PIC"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid other body
    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_ADD_PIC", "board_url": "5"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid 'data_delta' parameter (it must be dict)
    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={"action": "BOARD_ADD_PIC", "board_url": "5", "data_delta": "{}"},
    )
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid 'key'
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

    # with empty 'data_delta'
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

    # with nonexistent 'board_url'
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

    # with correct body
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

    # validate response data
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
    Test action BOARD_CLEAR (next action is correct).
    """
    # without other body
    rv: Response = client.put(ROUTE_BOARD_API, data={"action": "BOARD_CLEAR"})
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid 'board_url'
    rv: Response = client.put(
        ROUTE_BOARD_API, data={"action": "BOARD_CLEAR", "board_url": "5"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)

    # with correct data
    rv: Response = client.put(
        ROUTE_BOARD_API,
        data={
            "action": "BOARD_CLEAR",
            "board_url": pytest.board_url,
        },
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)

    # validate response data
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
    """
    Testing delete record through DELETE request.

    Main goal of this function is to check how controller reacts
    for requests with empty, suitable body
    and also with nonexistent record

    Args:
        client (werkzeug.test.Client): Test app client from pytest fixture.

    Raises:
        AssertionError: If structure is invalid or
            if expected response doesn't match given or
            if response data is invalid

    """
    # check if exists global variable with 'board_url'
    assert hasattr(pytest, "board_url"), "error when create board"

    # without body
    rv: Response = client.delete(ROUTE_BOARD_API)
    _check_response_structure(rv.data, rv.status_code, False, 400)

    # with invalid 'board_url'
    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": f"{pytest.board_url}1"}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)

    # with correct data
    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, True, 200)

    # with nonexistent record
    rv: Response = client.delete(
        ROUTE_BOARD_API, data={"board_url": pytest.board_url}
    )
    _check_response_structure(rv.data, rv.status_code, False, 404)
