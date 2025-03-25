from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Event

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'phone_number', 'role', 'is_active')
    search_fields = ('email', 'username', 'phone_number')
    list_filter = ('role', 'is_active', 'date_joined')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('role', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'phone_number', 'role', 'password1', 'password2'),
        }),
    )

    ordering = ('email',)

# Event Admin
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location')
    search_fields = ('title', 'location')
    list_filter = ('date',)

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Event, EventAdmin)
