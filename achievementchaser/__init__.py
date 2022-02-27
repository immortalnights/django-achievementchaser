# monkeypath django for graphene-django
# https://github.com/graphql-python/graphene-django/issues/1284#issuecomment-1019998091
import django
from django.utils.encoding import force_str
django.utils.encoding.force_text = force_str
from .celery import app as celery_app

__all__ = ('celery_app',)