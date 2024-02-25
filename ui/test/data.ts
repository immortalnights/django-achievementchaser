export const neverPlayedOwnedGame = {
    // player: {
    //     id: "76561197993451745",
    //     name: "ImmortalNights",
    //     avatarSmallUrl:
    //         "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
    //     avatarMediumUrl:
    //         "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    // },
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
    // player: {
    //     id: "76561197993451745",
    //     name: "ImmortalNights",
    //     avatarSmallUrl:
    //         "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
    //     avatarMediumUrl:
    //         "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
    // },
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

export const antenna = {
    id: "443580",
    name: "Antenna",
    imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
    achievementCount: 5,
    difficultyPercentage: 18.5,
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
                    lastPlayed: "2018-04-19T22:14:53+00:00",
                    playtimeForever: 56,
                    unlockedAchievementCount: 5,
                    completed: "2018-04-19T21:13:26+00:00",
                },
            },
        ],
    } as Connection<PlayerOwnedGameWithPlayer>,
    achievements: [
        {
            id: "first_signal",
            displayName: "First Signal",
            description: "AP > STA ANonce < PTK > STA",
            hidden: false,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/3b231aab2b1b451f6e3d9b9aa52a1f21b0979fdc.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
            globalPercentage: 89.80000305175781,
        },
        {
            id: "second_signal",
            displayName: "Second Signal",
            description: "STA > SNounce + MIC (MAIC) > AP",
            hidden: false,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/11cf92761718289f791aecfdb85b9519b4e04cf4.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
            globalPercentage: 55.20000076293945,
        },
        {
            id: "third_signal",
            displayName: "Third Signal",
            description: "AP > GTK + MIC > STA",
            hidden: false,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/d6b9e85afefc7ed6187815baed3cb67fe7c2bb29.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
            globalPercentage: 49.900001525878906,
        },
        {
            id: "fourth_signal",
            displayName: "Fourth Signal",
            description: "STA > AP",
            hidden: false,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/ac6e7919c606f5aa207b706d5b650c422343321f.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
            globalPercentage: 33.70000076293945,
        },
        {
            id: "uvb76",
            displayName: "uvb76",
            description: "",
            hidden: true,
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/2c1e76dd53e27210439c0914138891606d609d35.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/4f9e84c3c49e11c519f88799427e665176455938.jpg",
            globalPercentage: 18.5,
        },
    ],
} satisfies Game

export const antennaMultipleOwners = { ...antenna }
antennaMultipleOwners.owners.edges.push({
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
        playtimeForever: 0,
        unlockedAchievementCount: 0,
        completed: null,
    },
})

export const antennaPlayerCompleted = [
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0Njk=",
        datetime: "2018-04-19T21:13:26+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "fourth_signal",
            displayName: "Fourth Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/ac6e7919c606f5aa207b706d5b650c422343321f.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0NjU=",
        datetime: "2018-04-19T21:04:27+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "uvb76",
            displayName: "uvb76",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/2c1e76dd53e27210439c0914138891606d609d35.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/4f9e84c3c49e11c519f88799427e665176455938.jpg",
        },
    },
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0Njg=",
        datetime: "2016-04-09T11:05:02+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "third_signal",
            displayName: "Third Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/d6b9e85afefc7ed6187815baed3cb67fe7c2bb29.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0Njc=",
        datetime: "2016-04-09T11:00:28+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "second_signal",
            displayName: "Second Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/11cf92761718289f791aecfdb85b9519b4e04cf4.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0NjY=",
        datetime: "2016-04-09T10:51:45+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "first_signal",
            displayName: "First Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/3b231aab2b1b451f6e3d9b9aa52a1f21b0979fdc.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
] satisfies PlayerUnlockedAchievement[]

export const antennaPlayerPartial = [
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0Njk=",
        datetime: "2018-04-19T21:13:26+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "fourth_signal",
            displayName: "Fourth Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/ac6e7919c606f5aa207b706d5b650c422343321f.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
    {
        id: "UGxheWVyVW5sb2NrZWRBY2hpZXZlbWVudE5vZGU6MTU0NjY=",
        datetime: "2016-04-09T10:51:45+00:00",
        game: {
            id: "443580",
            name: "Antenna",
            imgIconUrl: "26b470dcd32bbeb0a8383f18c0fa2c0b56926b44",
        },
        achievement: {
            id: "first_signal",
            displayName: "First Signal",
            iconUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/3b231aab2b1b451f6e3d9b9aa52a1f21b0979fdc.jpg",
            iconGrayUrl:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/443580/b9efc871c5db122c036879f6ab875bd879bf9118.jpg",
        },
    },
] satisfies PlayerUnlockedAchievement[]
