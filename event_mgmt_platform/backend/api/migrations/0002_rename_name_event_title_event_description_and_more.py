# Generated by Django 5.1.7 on 2025-03-24 06:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name="event",
            old_name="name",
            new_name="title",
        ),
        migrations.AddField(
            model_name="event",
            name="description",
            field=models.TextField(default="No description available"),
        ),
        migrations.AddField(
            model_name="event",
            name="hosted_by",
            field=models.ManyToManyField(
                related_name="hosted_events", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
