import logging
import graphene
from ..tasks import resynchronize_player_task, resynchronize_player_game_task
from ..models import Player
from ..service import find_existing_player


class PlayerMinimalType(graphene.ObjectType):
    id = graphene.BigInt()
    name = graphene.String()
    resynchronized = graphene.String()


class OwnedGameMinimalType(graphene.ObjectType):
    id = graphene.BigInt()
    name = graphene.String()
    resynchronized = graphene.String()


class ResynchronizePlayer(graphene.Mutation):
    class Arguments:
        identifier = graphene.String(required=True)

    ok = graphene.Boolean()
    player = graphene.Field(PlayerMinimalType)
    error = graphene.String()

    @staticmethod
    def mutate(root, info, identifier):
        try:
            logging.info(f"Scheduling resynchronize_player_task for '{identifier}'")
            # FIXME support sync/async/
            task = resynchronize_player_task.delay(identifier)
            result = task.get(timeout=30)

            response = {"ok": result}
            if result is True:
                player = find_existing_player(identifier)
                response["player"] = {"id": player.id, "name": player.name}
                response["resynchronized"] = player.resynchronized

        except Player.DoesNotExist as ex:
            response = {"ok": False, "error": ex.args[0]}

        return response


class ResynchronizePlayerGame(graphene.Mutation):
    class Arguments:
        player = graphene.String(required=True)
        game = graphene.String(required=True)

    ok = graphene.Boolean()
    player = graphene.Field(PlayerMinimalType)
    owned_game = graphene.Field(OwnedGameMinimalType)
    error = graphene.String()

    @staticmethod
    def mutate(root, info, player, game):
        logging.info(f"Scheduling resynchronize_player_game_task for '{player}' '{game}'")
        task = resynchronize_player_game_task.delay(player, game)
        return task.get(timeout=30)
