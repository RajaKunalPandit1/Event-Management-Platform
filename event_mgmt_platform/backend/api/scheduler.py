# from django.conf import settings
# from django.core.mail import send_mail
# from django_apscheduler.jobstores import DjangoJobStore
# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import timedelta
# from django.utils.timezone import now
# from django.utils.timezone import localtime
# from django.db.models import Q

# scheduler = BackgroundScheduler()
# scheduler.add_jobstore(DjangoJobStore(), "default")

# def send_rsvp_notifications(event):
#     """Sends reminders to RSVP'd users and marks event as 'reminder_sent=True'."""
#     rsvp_users = event.rsvps.filter(status="going").values_list("user__email", flat=True)

#     if rsvp_users:
#         # Convert to local time and format the date
#         formatted_date = localtime(event.date).strftime("%A, %B %d, %Y at %I:%M %p")

#         subject = f"Reminder: Event '{event.title}' is happening tomorrow!"
#         message = f"Hello,\n\nThis is a reminder that '{event.title}' is scheduled for {formatted_date}. We hope to see you there!"
        
#         send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, list(rsvp_users))

#         #  Mark the event as having its reminder sent
#         event.reminder_sent = True
#         event.save(update_fields=["reminder_sent"])

# def fetch_and_notify_rsvp_users():
#     """Fetches upcoming events and sends reminders if not sent yet."""
#     from api.models import Event  # Import inside function

#     # Fetch events happening tomorrow where reminder has NOT been sent
#     upcoming_events = Event.objects.filter(
#         date__date=now().date() + timedelta(days=1),
#         reminder_sent=False  # Only select events where reminder hasn't been sent
#     )

#     for event in upcoming_events:
#         send_rsvp_notifications(event)

# def start_scheduler():
#     """Starts the APScheduler to run every 12 hours."""
#     # scheduler.add_job(fetch_and_notify_rsvp_users, "interval", seconds=30, id="fetch_rsvp_notifications", replace_existing=True)
#     scheduler.add_job(fetch_and_notify_rsvp_users, "interval", hours=12, id="fetch_rsvp_notifications", replace_existing=True)
#     scheduler.start()
#     print("Scheduler started successfully!")  # Print to console for debugging

import os
import django
from datetime import timedelta
from django.utils.timezone import now, localtime
from django.conf import settings
from django.core.mail import send_mail

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  
django.setup()

def send_rsvp_notifications(event):
    """Sends reminders to RSVP'd users and marks event as 'reminder_sent=True'."""
    rsvp_users = event.rsvps.filter(status="going").values_list("user__email", flat=True)

    if rsvp_users:
        # Convert to local time and format the date
        formatted_date = localtime(event.date).strftime("%A, %B %d, %Y at %I:%M %p")

        subject = f"Reminder: Event '{event.title}' is happening tomorrow!"
        message = f"Hello,\n\nThis is a reminder that '{event.title}' is scheduled for {formatted_date}. We hope to see you there!"

        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, list(rsvp_users))

        # Mark the event as having its reminder sent
        event.reminder_sent = True
        event.save(update_fields=["reminder_sent"])

def fetch_and_notify_rsvp_users():
    """Fetches upcoming events and sends reminders if not sent yet."""
    from api.models import Event  # Import inside function

    # Fetch events happening tomorrow where reminder has NOT been sent
    upcoming_events = Event.objects.filter(
        date__date=now().date() + timedelta(days=1),
        # reminder_sent=False
    )

    for event in upcoming_events:
        print(f"Processing event: {event.title}")
        send_rsvp_notifications(event)

def lambda_handler(event, context):
    """AWS Lambda entry point."""
    print("Lambda function triggered: Checking for upcoming events...")

    try:
        fetch_and_notify_rsvp_users()
        print("Event check and notifications completed.")
        return {"statusCode": 200, "body": "Reminders sent successfully!"}
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}