# Generated by Django 5.1.7 on 2025-04-02 13:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0015_remove_customuser_is_subscribed_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="premium_only",
            field=models.BooleanField(default=False),
        ),
    ]
