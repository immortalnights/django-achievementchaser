"""Steam Interface layer"""
import os
import logging
import typing
import urllib
import json
from django.conf import settings

logger = logging.getLogger()

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def _request(url: str, *, cache: bool = False) -> typing.Union[dict, None]:
    response_json = None

    assert settings.TESTING is False, "Cannot make Steam requests when testing"

    try:
        logger.debug(f"GET {url}")
        with urllib.request.urlopen(url) as resp:
            try:
                response_json = json.loads(resp.read().decode("utf8"))

                if cache:
                    file_name = urllib.parse.quote(url, safe="")
                    os.makedirs("_request_cache", exist_ok=True)
                    with open(os.path.join("_request_cache", file_name + ".json"), "w") as f:
                        f.write(json.dumps(response_json, indent=2))
            except json.JSONDecodeError:
                logger.exception("Failed to parse response")
    except urllib.error.URLError:
        logger.exception("Steam request failed (URL ERROR)")
    except urllib.error.HTTPError:
        logger.exception("Steam request failed (HTTP ERROR)")

    return response_json


def request(path: str, query: typing.Dict, response_data_key: str):
    # Always add the API key and response format
    default_query_string = urllib.parse.urlencode(
        {
            "key": _get_api_key(),
            "format": "json",
        }
    )
    query_string = urllib.parse.urlencode(query)
    url = f"http://{STEAM_API_URL}/{path}?{default_query_string}&{query_string}"
    response_json = _request(url, cache=True)

    if response_data_key in response_json:
        response_data = response_json[response_data_key]
    else:
        raise ValueError(f"Expected root object '{response_data_key}' missing")

    return response_data


def is_player_id(identity: str):
    return False
