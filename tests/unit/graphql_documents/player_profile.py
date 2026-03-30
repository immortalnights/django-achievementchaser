from datetime import date

DOCUMENT = f"""
query PlayerProfile($player: BigInt!, $year: Int = {date.today().year}) {{
    player(id: $player) {{
        id
        name
        avatarLargeUrl
        profileUrl
        profile {{
            ownedGames
            perfectGames
            playedGames
            totalPlaytime
            lockedAchievements
            unlockedAchievements
            unlockedAchievementForYear(year: $year)
            perfectGamesForYear(year: $year)
        }}
    }}
}}
"""
