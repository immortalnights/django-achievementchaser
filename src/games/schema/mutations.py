import graphene
from loguru import logger
from ..tasks import resynchronize_game_task
from ..models import Game


class GameMinimalType(graphene.ObjectType):
    id = graphene.BigInt()
    name = graphene.String()
    resynchronized = graphene.String()


class ResynchronizeGame(graphene.Mutation):
    class Arguments:
        identifier = graphene.String(required=True)

    ok = graphene.Boolean()
    game = graphene.Field(GameMinimalType)
    error = graphene.String()

    @staticmethod
    def mutate(root, info, identifier):
        try:
            logger.info(f"Scheduling resynchronize_game_task for '{identifier}'")
            # FIXME support sync/async/
            task = resynchronize_game_task.delay(identifier)
            response = task.get(timeout=30)

        except Game.DoesNotExist as ex:
            response = {"ok": False, "error": ex.args[0]}

        return response
