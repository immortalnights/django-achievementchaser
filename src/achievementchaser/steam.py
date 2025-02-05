"""Steam Interface layer"""

import os
from typing import Tuple, Optional, cast, Any
import requests
from requests import Response
from loguru import logger
from django.conf import settings

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def mask_key(url: str):
    return url.replace(_get_api_key(), "################################") if os.getenv("CI") == "true" else url


def _request(url: str, *, params: Any) -> Response:
    """Internal request wrapper, used for test mocking"""
    assert settings.TESTING is False, "Cannot make Steam requests when testing"
    return requests.get(url, params=params)


def request(path: str, query: dict, response_data_key: str) -> Tuple[bool, Optional[dict]]:
    # Always add the API key and response format
    query_parameters = {
        "key": _get_api_key(),
        "format": "json",
    }
    query_parameters.update(query)

    if "key" not in query_parameters or not query_parameters["key"]:
        raise KeyError("Steam API 'key' missing from query parameters")

    req = _request(f"https://{STEAM_API_URL}/{path}", params=query_parameters)
    logger.debug(f"{req.request.headers}; {req.headers}")
    logger.debug(f"Request {mask_key(req.url)}; Response: {req.status_code}, {req.text}")

    response_data = None

    if req.ok is True:
        response_json = req.json()
        if response_data_key in response_json:
            if isinstance(response_json[response_data_key], dict):
                response_data = cast(dict, response_json[response_data_key])
            else:
                logger.error(f"Expected root object '{response_data_key}' is not a dictionary; {response_json}")
        else:
            logger.error(f"Expected root object '{response_data_key}' missing in: {response_json}")
    else:
        logger.error(f"Request '{mask_key(req.url)}' failed")

    return (
        req.ok,
        response_data,
    )


def is_player_id(identity: str):
    return False
