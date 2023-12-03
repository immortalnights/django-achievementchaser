"""Steam Interface layer"""
import os
from typing import Tuple, Union, Optional, Dict, cast
from urllib import request as urllib_request, parse, error
import json
from loguru import logger
from django.conf import settings

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


# urllib_response cannot be used as a type, but is also an expected input type
def _parse_response(resp: Union[error.HTTPError], cache: bool) -> Optional[Dict]:
    response_json = None

    if resp.headers.get_content_type() == "application/json":
        try:
            response_json = json.loads(resp.read().decode("utf8"))
        except json.JSONDecodeError:
            logger.exception("Failed to parse JSON response data")

    if cache and response_json is not None:
        file_name = parse.quote(resp.url, safe="")
        os.makedirs("_request_cache", exist_ok=True)
        with open(os.path.join("_request_cache", file_name + ".json"), "w") as f:
            f.write(json.dumps(response_json, indent=2))

    return response_json


def _request(url: str, *, cache: bool = False) -> Tuple[bool, Optional[dict]]:
    response_json = None
    ok = False

    assert settings.TESTING is False, "Cannot make Steam requests when testing"

    try:
        logger.debug(f"GET {url}")
        with urllib_request.urlopen(url) as resp:
            response_json = _parse_response(resp, cache)
            ok = True

    except error.HTTPError as err:
        response_json = _parse_response(err, cache)
    except error.URLError:
        logger.exception("Steam request failed (URL ERROR)")

    return ok, response_json


def request(path: str, query: dict, response_data_key: str) -> Tuple[bool, Optional[dict]]:
    # Always add the API key and response format
    query_parameters = {
        "key": _get_api_key(),
        "format": "json",
    }
    query_parameters.update(query)

    if "key" not in query_parameters or not query_parameters["key"]:
        raise KeyError("Steam API 'key' missing from query parameters")

    url = f"http://{STEAM_API_URL}/{path}?{parse.urlencode(query_parameters)}"
    ok, response_json = _request(url, cache=True)
    response_data = None

    if ok is True and response_json is not None:
        if response_data_key in response_json:
            if isinstance(response_json[response_data_key], dict):
                response_data = cast(dict, response_json[response_data_key])
            else:
                logger.error(f"Expected root object '{response_data_key}' is not a dictionary; {response_json}")
        else:
            logger.error(f"Expected root object '{response_data_key}' missing; {response_json}")
    else:
        logger.error(f"Request '{url}' failed")

    return ok, response_data


def is_player_id(identity: str):
    return False
