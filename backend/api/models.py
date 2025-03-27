from django.db import models
from django.contrib.auth.models import User  # Import Django's User model
from django.contrib.auth.models import AbstractUser
from django.conf import settings  # Import settings to access AUTH_USER_MODEL


# # Event Model 
# class Event(models.Model):
#     name = models.CharField(max_length=255)
#     date = models.DateTimeField()
#     location = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name

# Event Model
class Event(models.Model):
    title = models.CharField(max_length=255)  # Event title
    description = models.TextField(default="No description available")
    date = models.DateTimeField()  # Event date and time
    location = models.CharField(max_length=255)  # Event location
    # hosted_by = models.ManyToManyField(User, related_name="hosted_events")  # Multiple hosts
    # hosted_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="hosted_events")
    rsvp_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="rsvp_events", blank=True)
    hosted_by = models.ForeignKey(
    settings.AUTH_USER_MODEL, 
    on_delete=models.CASCADE, 
    related_name="hosted_events",
    default=1 )


    def __str__(self):
        return self.title

class RSVP(models.Model):
    # STATUS_CHOICES = [
    #     ('going', 'Going'),
    #     ('maybe', 'Maybe'),
    #     ('not_going', 'Not Going'),
    # ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rsvps")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="rsvps")
    # status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="going")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'event']  # A user can RSVP only once per event

    def __str__(self):
        return f"{self.user.email} - {self.event.title} ({self.status})"

#CustomUser Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('guest', 'Guest'),
    ]

    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')
    # is_active = models.BooleanField(default=True)
    # date_joined = models.DateTimeField(auto_now_add=True)

    invited_events = models.ManyToManyField(Event, related_name="invited_users", blank=True)
    rsvped_events = models.ManyToManyField(Event, related_name="rsvped_users", blank=True)

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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username", "role"] 
    # REQUIRED_FIELDS = [] 

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"
