# Generated by Django 4.2.2 on 2023-09-14 21:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("achievements", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="achievement",
            name="global_percentage",
            field=models.FloatField(default=0),
        ),
    ]
