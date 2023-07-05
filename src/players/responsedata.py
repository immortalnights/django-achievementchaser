from dataclasses import dataclass
from typing import Optional


@dataclass
class VanityResponse:
    steamid: str
    success: int


@dataclass
class PlayerSummaryResponse:
    steamid: str
    communityvisibilitystate: int
    profilestate: int
    personaname: str
    profileurl: str
    avatar: str
    avatarmedium: str
    avatarfull: str
    avatarhash: str
    personastate: int
    lastlogoff: int
    realname: Optional[str] = None
    primaryclanid: Optional[int] = None
    timecreated: Optional[int] = None
    personastateflags: Optional[int] = None
    loccountrycode: Optional[str] = None
    locstatecode: Optional[str] = None
    loccityid: Optional[int] = None
    gameid: Optional[str] = None
    gameextrainfo: Optional[str] = None
    gameserverip: Optional[str] = None


@dataclass
class PlayerOwnedGame:
    appid: int
    name: str
    playtime_forever: int
    img_icon_url: str
    playtime_windows_forever: int
    playtime_mac_forever: int
    playtime_linux_forever: int
    rtime_last_played: int
    playtime_disconnected: int
    playtime_2weeks: Optional[int] = None
    has_community_visible_stats: Optional[bool] = None
