from django.core.management.base import BaseCommand


class CommandOutput:
    cmd: BaseCommand

    def __init__(self, cmd: BaseCommand):
        self.cmd = cmd

    def debug(self, message: str) -> None:
        self.cmd.stdout.write(message)

    def info(self, message: str) -> None:
        self.cmd.stdout.write(message)

    def warning(self, message: str) -> None:
        self.cmd.stdout.write(message)

    def error(self, message: str) -> None:
        self.cmd.stderr.write(message)
