from .parse_request import get_request_data
from core.response import send_error_response, send_success_response

# open main page
def index():
    return send_success_response()
