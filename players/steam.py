import typing
import urllib
import os
import json
import logging
from urllib import response


_STEAM_API = "api.steampowered.com"
logger = logging.getLogger()


def _get_api_key():
    return os.environ["STEAM_API_KEY"] if "STEAM_API_KEY" in os.environ else ""


def _request(path: str, query: typing.Dict, response_data_key: str):
    response = None

    # Always add the API key and response format
    default_query_string = urllib.parse.urlencode({
        "key": _get_api_key(),
        "format": "json",
    })
    query_string = urllib.parse.urlencode(query)
    url = f"http://{_STEAM_API}/{path}?{default_query_string}&{query_string}"
    logger.debug(f"GET {url}")
    try:
        with urllib.request.urlopen(url) as resp:
            try:
                resp_json = json.loads(resp.read().decode("utf8"))
                # logging.info(resp_json)

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


def resolve_vanity_url(name: str):
    steam_id = None
    try:
        response = _request("ISteamUser/ResolveVanityURL/v0001", {
            "vanityurl": name,
        }, "response")

        if "success" in response and response["success"] == 1:
            steam_id = response["steamid"]
            logger.info(f"Successfully resolved name {name} to steam id {steam_id}")
        else:
            message = response["message"] if "message" in response else "Unspecified"
            logger.error(f"Failed to resolve name: {message}")
    except Exception as e:
        logger.exception("Failed to resolve vanity name")

    return steam_id


def load_player_summary(steam_id: str):
    summary = None
    try:
        response = _request("ISteamUser/GetPlayerSummaries/v0002/", {
            "steamids": steam_id,
        }, "response")

        if response and "players" in response and len(response["players"]) == 1:
            summary = response["players"][0]
            logger.info(summary)
            # TODO check the profile is visible
    except Exception as e:
        logger.exception("Failed to load player summary")

    return summary