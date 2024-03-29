mock_game_schema = {
    "game": {
        "gameName": "The Room",
        "gameVersion": "8",
        "availableGameStats": {
            "achievements": [
                {
                    "name": "ACHIEVE_CHAP_1_COMPLETE",
                    "defaultvalue": 0,
                    "displayName": "Safe Cracker",
                    "hidden": 0,
                    "description": "Complete Chapter 1",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/2a98f529948f54b9deed720a7e80b931952c4537.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/2ae641a786270a41a947ccab7a624cda0bc7427c.jpg",
                },
                {
                    "name": "ACHIEVE_CHAP_2_COMPLETE",
                    "defaultvalue": 0,
                    "displayName": "Time Keeper",
                    "hidden": 0,
                    "description": "Complete Chapter 2",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/b55ebdadba065fbb46fb412ad8190b91b23068ee.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/c8897acd2e304b4718c6ba1b880df31cfa35d228.jpg",
                },
                {
                    "name": "ACHIEVE_CHAP_3_COMPLETE",
                    "defaultvalue": 0,
                    "displayName": "Stargazer",
                    "hidden": 0,
                    "description": "Complete Chapter 3",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/7f8a24466b0ceefb294c52e044d79cdf49ecc94b.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/d53028954507841439978bdb73f6c483415d64a1.jpg",
                },
                {
                    "name": "ACHIEVE_CHAP_4_COMPLETE",
                    "defaultvalue": 0,
                    "displayName": "High Priest",
                    "hidden": 0,
                    "description": "Complete Chapter 4",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/5de54ec9a65c07b144a682043ee53e39f5494577.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/e288b28b9313465c9ce09222d59d459e58289bf3.jpg",
                },
                {
                    "name": "ACHIEVE_CHAP_5_COMPLETE",
                    "defaultvalue": 0,
                    "displayName": "Prot\u00e9g\u00e9",
                    "hidden": 0,
                    "description": "Complete The Room",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/d5a150e1c91182a2a96ad9f926bf77a22159bdaa.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/288160/aa09fed9e0642be93aff047f19ff4473128de2f7.jpg",
                },
            ]
        },
    }
}

mock_game_schema_no_available_game_stats = {
    "game": {
        "gameName": "Fake Game",
        "gameVersion": "1",
    }
}

mock_game_schema_empty_available_game_stats = {
    "game": {
        "gameName": "Fake Game",
        "gameVersion": "1",
        "availableGameStats": {},
    }
}

mock_game_schema_no_achievements = {
    "game": {
        "gameName": "Fake Game",
        "gameVersion": "1",
        "availableGameStats": {"stats": []},
    }
}

mock_game_schema_no_stats = {
    "game": {
        "gameName": "Fake Game",
        "gameVersion": "1",
        "availableGameStats": {"achievements": []},
    }
}
