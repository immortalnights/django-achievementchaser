"""Steam Interface layer"""
import os
import logging
from textwrap import indent
import typing
import urllib
import json
from urllib import response

logger = logging.getLogger()

STEAM_API_URL = "api.steampowered.com"


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def request(path: str, query: typing.Dict, response_data_key: str):
    response = None

    # Always add the API key and response format
    default_query_string = urllib.parse.urlencode(
        {
            "key": _get_api_key(),
            "format": "json",
        }
    )
    query_string = urllib.parse.urlencode(query)
    url = f"http://{STEAM_API_URL}/{path}?{default_query_string}&{query_string}"
    logger.debug(f"GET {url}")
    try:
        with urllib.request.urlopen(url) as resp:
            try:
                resp_json = json.loads(resp.read().decode("utf8"))
                # logging.info(resp_json)

                file_name = urllib.parse.quote(url, safe="")
                os.makedirs("_request_cache", exist_ok=True)
                with open(os.path.join("_request_cache", file_name + ".json"), "w") as f:
                    f.write(json.dumps(resp_json, indent=2))

                if response_data_key in resp_json:
                    response = resp_json[response_data_key]
                else:
                    raise ValueError(f"Expected root object {response_data_key} missing")
            except json.JSONDecodeError as e:
                logger.exception("Failed to parse response")
    except urllib.error.URLError as e:
        logger.exception("Steam request failed")
    except urllib.error.HTTPError as e:
        logger.exception("Steam request failed")

    return response


def is_player_id(identity: str):
    return False
