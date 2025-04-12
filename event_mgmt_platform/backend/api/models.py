from django.db import models
from django.contrib.auth.models import User  # Import Django's User model
from django.contrib.auth.models import AbstractUser
from django.conf import settings  # Import settings to access AUTH_USER_MODEL

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(default="No description available")
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    hosted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hosted_events",
        default=1
    )
    
    image = models.ImageField(
        upload_to="event_images/",
        default="event_images/default_event.jpg",
        blank=True,
        null=True
    )
    reminder_sent = models.BooleanField(default=False)  
    premium_only = models.BooleanField(default=False) 


    def __str__(self):
        return self.title


class RSVP(models.Model):
    STATUS_CHOICES = [
        ('going', 'Going'),
        ('not_going', 'Not Going'),
        ('maybe', 'Maybe'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rsvps")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="rsvps")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="maybe")

    class Meta:
        unique_together = ('user', 'event')  # Ensures a user can RSVP only once per event

    def __str__(self):
        return f"{self.user.username} - {self.event.title} - {self.status}"

#CustomUser Model

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings  

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('guest', 'Guest'),
        ('premium_user', 'Premium User'),  # Added premium user role
    ]

    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='guest')

    invited_events = models.ManyToManyField('Event', related_name="invited_users", blank=True)
    rsvped_events = models.ManyToManyField('Event', related_name="rsvped_users", blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True
    )

    USERNAME_FIELD = 'email'  # Unique field to authenticate users
    REQUIRED_FIELDS = ["username", "role"]  

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"