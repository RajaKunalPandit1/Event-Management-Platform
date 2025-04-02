from rest_framework import serializers
from .models import Event, RSVP

class EventSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)  # Ensure image field is handled properly

    class Meta:
        model = Event
        fields = "__all__"

class RSVPSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show user's username
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = RSVP
        fields = "__all__" # Includes all fields in the model