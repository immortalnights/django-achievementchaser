DOCUMENT = """
query Search($name: String!) {
    player(name: $name) {
        id
        name
        avatarMediumUrl
    }
}
"""
