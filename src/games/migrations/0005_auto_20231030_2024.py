# Generated by Django 4.2.2 on 2023-10-30 20:24

from django.db import migrations


def migrate_achievements(apps, schema_editor):
    Achievement = apps.get_model("achievements", "Achievement")
    GameAchievement = apps.get_model("games", "Achievement")

    original_achievements = Achievement.objects.all()
    for achievement in original_achievements:
        GameAchievement.objects.create(
            name=achievement.name,
            game=achievement.game,
            default_value=achievement.default_value,
            display_name=achievement.display_name,
            hidden=achievement.hidden,
            description=achievement.description,
            icon_url=achievement.icon_url,
            icon_gray_url=achievement.icon_gray_url,
            global_percentage=achievement.global_percentage,
            added=achievement.added,
            updated=achievement.updated,
        )


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0004_achievement"),
    ]

    operations = [
        migrations.RunPython(migrate_achievements, migrations.RunPython.noop),
    ]
