export const neverPlayedOwnedGame = {
    player: {
        id: "76561197993451745",
        name: "ImmortalNights",
        avatarSmallUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
        avatarMediumUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    },
    lastPlayed: null,
    playtimeForever: 0,
    unlockedAchievementCount: 0,
    completed: null,
} satisfies PlayerOwnedGame

export const perfectPlayerOwnedGame = {
    player: {
        id: "76561197993451745",
        name: "ImmortalNights",
        avatarSmallUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
        avatarMediumUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    },
    lastPlayed: "2015-03-09T01:18:04+00:00",
    playtimeForever: 2007,
    unlockedAchievementCount: 27,
    completed: "2015-03-09T01:17:41+00:00",
} satisfies PlayerOwnedGame

export const playedPlayerOwnedGame = {
    player: {
        id: "76561197993451745",
        name: "ImmortalNights",
        avatarSmallUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
        avatarMediumUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    },
    lastPlayed: "2024-02-11T00:00:00+00:00",
    playtimeForever: 466,
    unlockedAchievementCount: 23,
    completed: null,
} satisfies PlayerOwnedGame

export const gameWithAchievements = {
    id: "206440",
    name: "To the Moon",
    difficultyPercentage: 28.399999618530273,
    achievementCount: 1,
    owners: {
        edges: [],
    },
    achievements: [
        {
            id: "ACH_DEBUG_MOON",
            displayName: '"Wish Granted"',
            description: "",
            hidden: true,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/206440/45f30af066061beda28b04d10400ea550416193c.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/206440/e9690592d6392489585fd2731661c417af47f573.jpg",
            globalPercentage: 28.399999618530273,
        },
    ],
} satisfies Game

export const gameWithoutAchievements = {
    id: "8500",
    name: "EVE Online",
    difficultyPercentage: 0.0,
    achievementCount: 0,
    owners: {
        edges: [],
    },
    achievements: [],
} satisfies Game

export const achievement = {
    id: "LegendaryWarMage",
    displayName: "Legendary War Mage",
    iconUrl:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/102600/e6241e91c24d64c878fbcc339cd542e1c7216d0d.jpg",
    iconGrayUrl:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/102600/da371af592225df340dee76602a585d282197bc7.jpg",
} satisfies Achievement
