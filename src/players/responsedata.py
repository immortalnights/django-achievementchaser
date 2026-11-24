from dataclasses import dataclass


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
    realname: str | None = None
    primaryclanid: int | None = None
    timecreated: int | None = None
    personastateflags: int | None = None
    loccountrycode: str | None = None
    locstatecode: str | None = None
    loccityid: int | None = None
    gameid: str | None = None
    lobbysteamid: str | None = None
    gameextrainfo: str | None = None
    gameserverip: str | None = None


@dataclass
class PlayerOwnedGameResponse:
    appid: int
    name: str
    playtime_forever: int
    img_icon_url: str
    playtime_windows_forever: int = 0
    playtime_mac_forever: int = 0
    playtime_linux_forever: int = 0
    playtime_deck_forever: int = 0
    rtime_last_played: int | None = None
    playtime_disconnected: int = 0
    has_leaderboards: bool | None = None
    playtime_2weeks: int | None = None
    has_community_visible_stats: bool | None = None
    content_descriptorids: list[int] | None = None


@dataclass
class PlayerUnlockedAchievementResponse:
    achieved: int
    apiname: str
    unlocktime: int
