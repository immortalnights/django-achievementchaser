# Generated by Django 4.2.2 on 2023-07-23 23:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="difficulty_percentage",
            field=models.PositiveIntegerField(null=True),
        ),
    ]