# Generated by Django 5.1.7 on 2025-03-31 07:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0010_guest_remove_rsvp_created_at_rsvp_status_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="event",
            name="rsvp_users",
        ),
        migrations.AlterField(
            model_name="rsvp",
            name="status",
            field=models.CharField(
                choices=[
                    ("going", "Going"),
                    ("not_going", "Not Going"),
                    ("maybe", "Maybe"),
                ],
                default="maybe",
                max_length=10,
            ),
        ),
    ]
