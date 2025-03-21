from django import forms
from .models import CustomUser, Event

class CustomUserForm(forms.ModelForm):
    invited_events = forms.ModelMultipleChoiceField(
        queryset=Event.objects.all(), 
        widget=forms.CheckboxSelectMultiple,  
        required=False
    )
    rsvped_events = forms.ModelMultipleChoiceField(
        queryset=Event.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'invited_events', 'rsvped_events']  
