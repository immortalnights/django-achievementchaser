"""Steam Interface layer"""
import os
import logging
from typing import Tuple, Union
from urllib import request as urllib_request, parse, error
import json
from django.conf import settings

logger = logging.getLogger()

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def _request(url: str, *, cache: bool = False) -> Tuple[bool, Union[dict, None]]:
    response_json: Union[dict, None] = None
    ok: bool = False

    assert settings.TESTING is False, "Cannot make Steam requests when testing"

    try:
        logger.debug(f"GET {url}")
        with urllib_request.urlopen(url) as resp:
            try:
                if resp.headers.get_content_type() == "application/json":
                    response_json = json.loads(resp.read().decode("utf8"))
                    ok = True

                if cache and response_json is not None:
                    file_name = parse.quote(url, safe="")
                    os.makedirs("_request_cache", exist_ok=True)
                    with open(os.path.join("_request_cache", file_name + ".json"), "w") as f:
                        f.write(json.dumps(response_json, indent=2))
            except json.JSONDecodeError:
                logger.exception("Failed to parse response")
    except error.HTTPError as err:
        # logger.exception("Steam request failed (HTTP ERROR)")
        logging.warning(f"HTTP {err.code}")
        if err.headers.get_content_type() == "application/json":
            response_json = json.loads(err.read().decode("utf8"))
    except error.URLError:
        logger.exception("Steam request failed (URL ERROR)")

    return ok, response_json


def request(path: str, query: dict, response_data_key: str) -> Tuple[bool, dict]:
    # Always add the API key and response format
    default_query_string = parse.urlencode(
        {
            "key": _get_api_key(),
            "format": "json",
        }
    )
    query_string = parse.urlencode(query)
    url = f"http://{STEAM_API_URL}/{path}?{default_query_string}&{query_string}"
    ok, response_json = _request(url, cache=True)

    if response_json is not None and response_data_key in response_json:
        response_data = response_json[response_data_key]
    else:
        raise ValueError(f"Expected root object '{response_data_key}' missing")

    return ok, response_data


def is_player_id(identity: str):
    return False
