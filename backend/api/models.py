from django.db import models
from django.contrib.auth.models import AbstractUser


# Event Model 
class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name

#CustomUser Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('guest', 'Guest'),
    ]

    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

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
    REQUIRED_FIELDS = ["username", "phone_number", "role"] 

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"
