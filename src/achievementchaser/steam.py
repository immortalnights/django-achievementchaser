"""Steam Interface layer"""

import logging
import os
from typing import Any, cast

import requests
from django.conf import settings
from loguru import logger

logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def mask_key(url: str):
    return url.replace(_get_api_key(), "################################") if not settings.DEBUG else url


def _request(url: str, *, params: dict[str, Any]) -> tuple[bool, dict | None]:
    """Internal request wrapper, used for test mocking"""
    assert settings.TESTING is False, "Cannot make Steam requests when testing"

    try:
        req = requests.get(url, params=params)

        content_length = req.headers.get("content-length", 0)
        content_type = req.headers.get("content-type", "")

        logger.debug(f"{req.request.method} {mask_key(req.url)} {req.status_code} {content_length}")

        if not req.ok:
            logger.error(f"Request failed: {req.url} {req.status_code} {req.text}")

        return req.ok, req.json() if "application/json" in content_type else None
    except requests.exceptions.SSLError as e:
        # Don't output the stack trace for known request exceptions
        logger.error(f"SSL error while making Steam API request: {e}")
    except requests.exceptions.RequestException as e:
        # Don't output the stack trace for known request exceptions
        logger.error(f"Request exception while making Steam API request: {e}")
    except Exception as e:
        raise e

    return False, None


def request(path: str, query: dict, response_data_key: str, key: bool = True) -> tuple[bool, dict | None]:
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
