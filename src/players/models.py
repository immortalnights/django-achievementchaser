import typing
import logging
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from games.models import Game
from achievements.models import Achievement
from .steam import load_player_summary, get_owned_games
from .utils import parse_identity


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

    def clean(self):
        if not self.profile_url:
            raise ValidationError("Cannot save a player without a profile URL")

    def resynchronize(self) -> bool:
        ok = self.resynchronize_profile()
        ok &= self.resynchronize_games()
        ok &= self.resynchronize_achievements()

        return ok

    def resynchronize_profile(self) -> bool:
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
                self._apply_player_summary(summary)
                self.resynchronization_required = False
                self.save()
                ok = True

        return ok

    def resynchronize_games(self):
        ok = False

        owned_games = get_owned_games(self.id)
        logging.info(f"Player {self.personaname} has {len(owned_games)} games")

        # Add / update the Game in the Game table
        for owned_game in owned_games:
            game_instance = Game(
                id=owned_game.appid,
                name=owned_game.name,
                img_icon_url=owned_game.img_icon_url,
            )
            game_instance.save()

            owned_game_instance = OwnedGame(
                game=game_instance, player=self, playtime_forever=owned_game.playtime_forever
            )
            owned_game_instance.save()

            if owned_game.playtime_2weeks is not None:
                owned_game_playtime = GamePlaytime(game=game_instance, player=self, playtime=owned_game.playtime_2weeks)
                owned_game_playtime.save()

        return ok

    def resynchronize_achievements(self):
        pass

    def _apply_player_summary(self, summary) -> None:
        assert int(summary.steamid) == self.id, f"Steam ID {summary.steamid} does not match model ID {self.id}"

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
    updated = models.DateTimeField(auto_now=True)
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
