import typing
from .steam import resolve_vanity_url


def parse_identity(identity: typing.Union[str, int]) -> typing.Optional[int]:
    player_id = None
    resolved_identity = None

    if identity.startswith("https"):
        url = identity if not identity.endswith("/") else identity[:-1]
        parts = url.split("/")

        if len(parts) != 5:
            raise RuntimeError(f"Invalid URL provided '{url}', expected four parts (got {len(parts)})")
        elif parts[2] != "steamcommunity.com":
            raise RuntimeError(f"Invalid URL provided '{url}', expected steamcommunity.com domain")
        elif parts[3] == "id":
            # https://steamcommunity.com/id/nnnnnnnnnnnnnnn/
            resolved_identity = parts[4]
        elif parts[3] == "profiles":
            # https://steamcommunity.com/profiles/00000000000000000/
            resolved_identity = parts[4]
        else:
            raise RuntimeError(f"Invalid URL provided '{url}'")
    else:
        resolved_identity = identity

    try:
        player_id = int(resolved_identity)
    except ValueError:
        # logging.debug(f"Could not convert identity '{resolved_identity}' to Steam ID")
        player_id = resolve_vanity_url(resolved_identity)

    return player_id
