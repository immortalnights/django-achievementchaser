from telnetlib import GA
from django.contrib import admin
from .models import Player, Friend

# Register your models here.
admin.site.register(Player)
admin.site.register(Friend)
