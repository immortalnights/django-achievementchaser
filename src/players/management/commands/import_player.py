import importlib
from django.core.management.base import BaseCommand, CommandError
from players.models import Player
from achievementchaser.management.lib.command_output import CommandOutput

# from ...steam import load_player_summary, get_owned_games


def import_player(logger: CommandOutput, identity: str):
    from pymongo.mongo_client import MongoClient
    from pymongo.errors import ConnectionFailure

    host = "localhost"
    port = 27017

    c = MongoClient(host, port)

    try:
        c.admin.command("ping")
        logger.info("Connected to mongodb")
    except ConnectionFailure:
        raise CommandError(f"Failed to connect to mongodb {host}:{port}")

    db = c["achievementchaser"]

    collection = db["players"]

    record = collection.find_one({"_id": identity})

    if record:
        logger.info(f"Importing data for player '{record['personaname']}'")

        # Check if the player exists
        # If so update the "added" time as all important data is from that date
        # Otherwise add the basic information, but assume a resync will occur later
        existing_record = None
        try:
            existing_record = Player.objects.get(id=identity)
            # date conversion?
            existing_record.added = record["added"]
            existing_record.save()
        except Player.DoesNotExist:
            new_record = Player(
                id=record["_id"],
                name=record["personaname"],
                profile_url=record["steam"]["profileurl"],
            )
            new_record.save()

            # The "added" field is automatically set on creation so it has to be updated separately
            new_record.added = record["added"]
            new_record.save()

    else:
        raise CommandError(f"Failed to find player with id {identity}")


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", nargs=1, type=str)

    def handle(self, *args, **options):
        logger = CommandOutput(self)

        if not importlib.find_loader("pymongo"):
            # logger.error("Module 'pymongo' must be installed for this command")
            raise CommandError("Module 'pymongo' must be installed for this command")

        identity = options["identity"][0]
        logger.info(f"import '{identity}'")
        r = import_player(logger, identity)

        logger.info(f"Result {r}")
