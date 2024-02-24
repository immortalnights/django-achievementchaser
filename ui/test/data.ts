export const neverPlayedOwnedGame = {
    player: {
        id: "76561197993451745",
        name: "ImmortalNights",
        avatarSmallUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
        avatarMediumUrl:
            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    },
    game: {
        id: "8500",
        name: "EVE Online",
        imgIconUrl: "884d8c6482487e74b18ceef872ee9543a1c5828d",
        achievementCount: 0,
        difficultyPercentage: 0.0,
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
    game: {
        name: "Orcs Must Die!",
        id: "102600",
        imgIconUrl: "0d14a70abb580146741de26bbad46d0ad81a67c7",
        achievementCount: 27,
        difficultyPercentage: 3.200000047683716,
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
    game: {
        id: "262280",
        name: "Dungeons 2",
        imgIconUrl: "429544f4c7680d781477059d59e5314974574db3",
        achievementCount: 25,
        difficultyPercentage: 2.0,
    },
    lastPlayed: "2024-02-11T00:00:00+00:00",
    playtimeForever: 466,
    unlockedAchievementCount: 23,
    completed: null,
} satisfies PlayerOwnedGame

export const gameWithAchievements = {
    id: "206440",
    name: "To the Moon",
    imgIconUrl: "6e29eb4076a6253fdbccb987a2a21746d2df54d7",
    achievementCount: 1,
    difficultyPercentage: 28.399999618530273,
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
    imgIconUrl: "884d8c6482487e74b18ceef872ee9543a1c5828d",
    achievementCount: 0,
    difficultyPercentage: 0.0,
    owners: {
        edges: [
            {
                node: {
                    player: {
                        id: "76561197993451745",
                        name: "ImmortalNights",
                        avatarSmallUrl:
                            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
                        avatarMediumUrl:
                            "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
                    },
                    lastPlayed: "2024-01-21T19:50:33+00:00",
                    playtimeForever: 127368,
                    unlockedAchievementCount: 0,
                    completed: null,
                },
            },
            {
                node: {
                    player: {
                        id: "76561198013854782",
                        name: "Darabel",
                        avatarSmallUrl:
                            "https://avatars.steamstatic.com/0a91dcdfc53ba8d0758f000b05946fb5c4324324.jpg",
                        avatarMediumUrl:
                            "https://avatars.steamstatic.com/0a91dcdfc53ba8d0758f000b05946fb5c4324324_medium.jpg",
                    },
                    lastPlayed: null,
                    playtimeForever: 34,
                    unlockedAchievementCount: 0,
                    completed: null,
                },
            },
        ],
    },
    achievements: [],
} satisfies Game

export const achievement = {
    id: "LegendaryWarMage",
    displayName: "Legendary War Mage",
    description: "Complete Act 3 on Nightmare mode",
    hidden: false,
    iconUrl:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/102600/e6241e91c24d64c878fbcc339cd542e1c7216d0d.jpg",
    iconGrayUrl:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/102600/da371af592225df340dee76602a585d282197bc7.jpg",
    globalPercentage: 3.200000047683716,
} satisfies Achievement
