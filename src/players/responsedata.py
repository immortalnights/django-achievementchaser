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
