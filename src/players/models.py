import typing
import logging
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from games.models import Game
from achievements.models import Achievement
from .steam import load_player_summary
from .utils import parse_identity
from .responsedata import PlayerSummaryResponse


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
    def load(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
        # Attempt to identify the user from existing data
        # This may fail if the player has changed their persona name
        # or URL. In such a case, resolve the identity to attempt to
        # load by Player ID.
        return Player.find_existing(identity) or Player.from_identity(identity)

    @staticmethod
    def create_player(identity: typing.Union[str, int]):
        instance = None

        try:
            existing = Player.find_existing(identity)
            logging.error(f"Player {existing.id} already exists")
        except Player.DoesNotExist:
            player_id = parse_identity(identity)
            if player_id is not None:
                instance = Player(id=player_id)
                # resynchronize saves the Player
                instance.resynchronize()

        return instance

    @staticmethod
    def find_existing(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
        player_id = None
        try:
            player_id = int(identity)
        except ValueError:
            pass

        query = (
            models.Q(id=player_id)
            | models.Q(personaname__iexact=str(identity))
            | models.Q(profile_url__iexact=str(identity))
        )
        logging.debug(query)

        instance = None
        try:
            instance = Player.objects.get(query)
        except Player.DoesNotExist:
            logging.warning(f"Player {identity} does not exist")

        return instance

    @staticmethod
    def from_identity(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
        instance = None

        player_id = parse_identity(identity)

        if player_id is not None:
            try:
                instance = Player.objects.get(id=player_id)
            except Player.DoesNotExist:
                pass

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

    def resynchronize(self) -> bool:
        ok = False

        RATE_LIMIT = 60

        delta = (timezone.now() - self.resynchronized) if self.resynchronized is not None else -1
        if not self.resynchronization_required and delta.seconds < RATE_LIMIT:
            logging.error(
                f"Cannot resynchronize player {self.personaname} again for another {RATE_LIMIT - delta.seconds} seconds"
            )
        else:
            summary = load_player_summary(self.id)

            if summary is None:
                logging.error(f"Received no summary for player {self.id}")
            else:
                self._parse_summary(summary)
                self.resynchronization_required = False
                self.save()
                ok = True

        return ok

    def resynchronize_games():
        pass

    def resynchronize_achievements():
        pass

    def _parse_summary(self, summary_data) -> None:
        assert (
            int(summary_data["steamid"]) == self.id
        ), f"Steam ID {summary_data['steamid']} does not match model ID {self.id}"

        summary = PlayerSummaryResponse(**summary_data)
        self.personaname = summary.personaname
        self.profile_url = summary.profileurl
        self.avatar_small_url = summary.avatar
        self.avatar_medium_url = summary.avatarmedium
        self.avatar_large_url = summary.avatarfull
        self.resynchronized = timezone.now()


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
