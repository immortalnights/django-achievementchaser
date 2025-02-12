"""Steam Interface layer"""

import os
from typing import Tuple, Optional, cast, Any
import requests
from requests import Response
from loguru import logger
from django.conf import settings
import logging

logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def mask_key(url: str):
    return url.replace(_get_api_key(), "################################") if not settings.DEBUG else url


def _request(url: str, *, params: Any) -> Response:
    """Internal request wrapper, used for test mocking"""
    assert settings.TESTING is False, "Cannot make Steam requests when testing"
    req = requests.get(url, params=params)
    logger.debug(f"{req.request.method} {mask_key(req.url)} {req.status_code} {req.headers["content-length"]}")

    if not req.ok:
        logger.error(f"Request failed: {req.url} {req.status_code} {req.text}")

    return req.ok, req.json() if "application/json" in req.headers["Content-Type"] else None


def request(path: str, query: dict, response_data_key: str, key: bool = True) -> Tuple[bool, Optional[dict]]:
    query_parameters = {**({"key": _get_api_key()} if key else {}), "format": "json", **query}

    ok, response_json = _request(f"https://{STEAM_API_URL}/{path}", params=query_parameters)

    response_data = None

    if ok and response_json:
        if response_data_key in response_json:
            if isinstance(response_json[response_data_key], dict):
                response_data = cast(dict, response_json[response_data_key])
            else:
                logger.error(f"Expected root object '{response_data_key}' is not a dictionary; {response_json}")
        else:
            logger.error(f"Expected root object '{response_data_key}' missing in: {response_json}")

    return (
        ok,
        response_data,
    )


def is_player_id(identity: str):
    return False
