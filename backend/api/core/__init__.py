"""
Core module with base web-application functions.

Implements functions for interactions with
DataBase, models, requests and responses.

"""
from .db import db
from .model import BaseModel
from .parse_request import get_request_data
from .response import send_error_response, send_success_response
