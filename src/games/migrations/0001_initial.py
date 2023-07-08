# Generated by Django 4.2.2 on 2023-07-08 23:32

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                ("id", models.PositiveIntegerField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("img_icon_url", models.CharField(max_length=255)),
                ("added", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now_add=True)),
                ("resynchronized", models.DateTimeField(null=True)),
                ("resynchronization_required", models.BooleanField(default=True)),
            ],
        ),
    ]
