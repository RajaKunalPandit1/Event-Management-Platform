# from django.contrib import admin
# from django.urls import path
# from django.http import HttpResponse
# from api import views

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,  # Obtain access & refresh tokens
#     TokenRefreshView,  # Refresh access token
#     TokenVerifyView,  # Verify token validity
# )

# def home(request):
#     return HttpResponse("Welcome to the Event Management Platform!")

# urlpatterns = [
#     path("admin/", admin.site.urls),

#     # Default Home Route
#     path("", home, name="home"),

#     # Authentication Endpoints
#     path("api/register/", views.register_user, name="register"),
#     path("api/login/", views.login_user, name="login"),
#     path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
#     path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),

#     # Password Reset
#     path("api/reset-password/", views.reset_password, name="reset_password"),

#     # Protected API Endpoint
# ]

from django.contrib import admin
from django.urls import path
from api import views
# from .views import register_admin

from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For getting access & refresh tokens
    TokenRefreshView,  # For refreshing access token
    TokenVerifyView,  # To verify token validity
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.register_user, name="register"),
    path("api/login/", views.login_user, name="login"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/reset-password/", views.reset_password, name="reset_password"),
    # path("api/reset-password-confirm/<int:user_id>/<str:token>/", views.reset_password_confirm, name="reset_password_confirm"),
    # path("api/user/events/", views.get_user_events, name="get_user_events"),
    path("api/event/create/", views.create_event, name="create_event"),
    path("api/event/update/<int:event_id>/", views.update_event, name="update_event"),
    path("api/event/delete/<int:event_id>/", views.delete_event, name="delete_event"),
    # path("register-admin/", views.register_admin, name="register-admin"),
    # path("api/protected/", views.protected_view, name="protected_view"),
]