DOCUMENT = """
query PlayerProfile($player: BigInt!) {
    player(id: $player) {
        id
        name
        avatarLargeUrl
        profileUrl
    }
}
"""
