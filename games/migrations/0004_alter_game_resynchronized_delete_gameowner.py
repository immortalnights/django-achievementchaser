# Generated by Django 4.0.2 on 2022-02-28 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0003_alter_gameowner_added'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='resynchronized',
            field=models.DateTimeField(null=True),
        ),
        migrations.DeleteModel(
            name='GameOwner',
        ),
    ]
