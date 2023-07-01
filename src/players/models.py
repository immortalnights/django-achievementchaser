import logging
import typing
from django.db import models
from django.core.exceptions import ValidationError
from players.steam import resolve_vanity_url
from games.models import Game
from achievements.models import Achievement


class Player(models.Model):
    # Steam fields
    id = models.PositiveBigIntegerField(primary_key=True)
    personaname = models.CharField(max_length=255)
    profile_url = models.CharField(default="", max_length=255)
    avatar_small_url = models.CharField(default="", max_length=255)
    avatar_medium_url = models.CharField(default="", max_length=255)
    avatar_large_url = models.CharField(default="", max_length=255)
    created = models.IntegerField(default=0)
    # End steam
    added = models.DateTimeField(auto_now_add=True)
    # Why updated and resynchronized?
    updated = models.DateTimeField(auto_now_add=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)

    @staticmethod
    def parse_identity(identity: typing.Union[str, int]) -> typing.Union[int, None]:
        player_id = None
        resolved_identity = None

        if identity.startswith("https"):
            url = identity if not identity.endswith("/") else identity[:-1]
            parts = url.split("/")

            if len(parts) != 5:
                raise RuntimeError(f"Invalid URL provided '{url}', expected four parts (got {len(parts)})")
            elif parts[2] != "steamcommunity.com":
                raise RuntimeError(f"Invalid URL provided '{url}', expected steamcommunity.com domain")
            elif parts[3] == "id":
                # https://steamcommunity.com/id/nnnnnnnnnnnnnnn/
                resolved_identity = parts[4]
            elif parts[3] == "profiles":
                # https://steamcommunity.com/profiles/00000000000000000/
                resolved_identity = parts[4]
            else:
                raise RuntimeError(f"Invalid URL provided '{url}'")
        else:
            resolved_identity = identity

        try:
            player_id = int(resolved_identity)
        except ValueError:
            # logging.debug(f"Could not convert identity '{resolved_identity}' to Steam ID")
            player_id = resolve_vanity_url(resolved_identity)

        return player_id

    @staticmethod
    def from_identity(identity: typing.Union[str, int]) -> typing.Union["Player", None]:
        instance = None

        player_id = Player.parse_identity(identity)

        if player_id is not None:
            try:
                instance = Player.objects.get(id=player_id)
            except Player.DoesNotExist:
                instance = Player(id=player_id)
                instance.save()

        return instance

        # # TODO update player summary data and make sure the profile is still public
        # summary = load_player_summary(player_id)  # noqa F841
        # games = get_owned_games(player_id)

        # logger.debug(f"Player {player_instance.personaname} has {len(games)} games")
        # for game in games:
        #     logger.debug(f"Add / update game {game['name']} ({game['appid']})")
        #     game_instance = Game(
        #         id=game["appid"],
        #         name=game["name"],
        #         img_icon_url=game["img_icon_url"],
        #         img_logo_url=game["img_logo_url"],
        #         resynchronization_required=True,
        #     )
        #     game_instance.save()

        #     # class OwnedGame(models.Model):
        #     #     game = models.ForeignKey(Game, on_delete=models.CASCADE)
        #     #     player = models.ForeignKey(Player, on_delete=models.CASCADE)
        #     #     added = models.DateTimeField(auto_now_add=True)
        #     #     updated = models.DateTimeField(auto_now_add=True)
        #     #     playtime_forever = models.PositiveIntegerField()

        #     logger.debug(
        #         f"Add / update game {game_instance.name} ({game_instance.id}) "
        #         f"for {player_instance.personaname} ({player_instance.id})"
        #     )
        #     OwnedGame(
        #         game=game_instance,
        #         player=player_instance,
        #         playtime_forever=game["playtime_forever"],
        #     ).save()

    def clean(self):
        if not self.profile_url:
            raise ValidationError("Cannot save a player without a profile URL")


class OwnedGame(models.Model):
    class Meta:
        unique_together = (("game", "player"),)

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    playtime_forever = models.PositiveIntegerField()


class GamePlaytime(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)
    playtime = models.PositiveIntegerField()


class AchievementAchieved(models.Model):
    class Meta:
        unique_together = (("achievement", "player"),)

    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)


class Friend(models.Model):
    class Meta:
        unique_together = (("player", "friend"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="player_to_player")
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friends")
