from django.contrib import admin
from django.urls import path
from api import views
from django.conf import settings
from django.conf.urls.static import static
# from views import CurrentUserView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For getting access & refresh tokens
    TokenRefreshView,  # For refreshing access token
    TokenVerifyView,  # To verify token validity
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.register_user, name="register"),
    path("api/login/", views.login_user, name="login"),
    path('api/current-user/',views.current_user, name='current-user'),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # path("api/reset-password/", views.reset_password, name="reset_password"),
    path("api/password-reset/", views.request_password_reset, name="password_reset"),
    path("api/password-reset/<uidb64>/<token>/", views.reset_password_confirm, name="password_reset_confirm"),
    path("api/event/create/", views.create_event, name="create_event"),
    path("api/my_events/", views.my_events, name="my_events"),
    path("api/events/", views.all_events, name="all_events"),
    path("api/event/update/<int:event_id>/", views.update_event, name="update_event"),
    path("api/event/delete/<int:event_id>/", views.delete_event, name="delete_event"),
    path("api/event/<int:event_id>/guest-list/", views.event_guest_list, name="event-guest-list"),
    path("api/my_rsvp_events/", views.my_rsvp_events, name="my_rsvp_events"),
    path("api/event/<int:event_id>/rsvp-users/", views.fetch_event_rsvp_users, name="fetch-event-rsvp-users"),  # Admin/Host only
    path("api/event/<int:event_id>/", views.event_detail, name="event_detail"),  
    path("api/event/<int:event_id>/rsvp/", views.rsvp_event, name="rsvp_event"),
    path("api/event/<int:event_id>/remove-rsvp/", views.delete_rsvp, name="delete-rsvp"),
    path("api/event/<int:event_id>/remove-user-rsvp/<int:user_id>/", views.remove_user_rsvp, name="remove-user-rsvp"),
    # path("api/event/<int:event_id>/rsvp/", views.rsvp_event, name="rsvp-event"),
    # path("api/event/<int:event_id>/remove-rsvp/", views.remove_rsvp, name="remove_rsvp"),
    # path("api/guest-lists/", views.guest_list_view, name="guest-list"),
    # path("api/guest-lists/<int:pk>/", views.guest_detail_view, name="guest-detail"),
]

# Serve media files in development
# if settings.DEBUG:
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)