from .celery import app as celery_app  # no E402

__all__ = ("celery_app",)
