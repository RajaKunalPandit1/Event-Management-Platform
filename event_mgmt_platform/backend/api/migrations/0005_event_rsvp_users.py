# Generated by Django 5.1.7 on 2025-03-26 08:51

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_remove_event_hosted_by_event_hosted_by"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="rsvp_users",
            field=models.ManyToManyField(
                blank=True, related_name="rsvp_events", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
