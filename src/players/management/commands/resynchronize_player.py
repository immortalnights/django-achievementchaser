from django.core.management.base import BaseCommand
from players.models import Player, OwnedGame
from players.steam import load_player_summary, get_owned_games
from games.models import Game
from management.lib.command_logger import CommandLogger

# from players.tasks import resynchronize_player


def resynchronize_player(logger: CommandLogger, identity):
    """
    :param logger: logger instance of command logger wrapper
    """
    ok = True
    try:
        player_instance = Player.objects.get(id=int(identity))
        logger.info(f"Beginning resynchronization of Player {player_instance.personaname} {identity}")

        # TODO update player summary data and make sure the profile is still public
        summary = load_player_summary(identity)  # noqa F841
        games = get_owned_games(identity)

        for game in games:
            logger.debug(f"Add / update game {game['name']} ({game['appid']})")
            game_instance = Game(
                id=game["appid"],
                name=game["name"],
                img_icon_url=game["img_icon_url"],
                img_logo_url=game["img_logo_url"],
                resynchronization_required=True,
            )
            game_instance.save()

            # class OwnedGame(models.Model):
            #     game = models.ForeignKey(Game, on_delete=models.CASCADE)
            #     player = models.ForeignKey(Player, on_delete=models.CASCADE)
            #     added = models.DateTimeField(auto_now_add=True)
            #     updated = models.DateTimeField(auto_now_add=True)
            #     playtime_forever = models.PositiveIntegerField()

            logger.debug(
                f"Add / update game {game_instance.name} ({game_instance.id}) "
                f"for {player_instance.personaname} ({player_instance.id})"
            )
            OwnedGame(
                game=game_instance,
                player=player_instance,
                playtime_forever=game["playtime_forever"],
            ).save()

    except Player.DoesNotExist:
        logger.error("Player {identity} does not exist")

    logger.info("done")
    return ok


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", nargs=1, type=str)

    def handle(self, *args, **options):
        logger = CommandLogger(self)
        identity = options["identity"][0]
        logger.info(f"resynchronize '{identity}'")
        # r = resynchronize_player.delay(identity)
        r = resynchronize_player(logger, identity)

        # TODO handle celery.exceptions.TimeoutError
        logger.info(f"Result {r}")
