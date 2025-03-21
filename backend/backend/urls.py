"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# mapping the URLs with view functions

from django.contrib import admin
from django.urls import path
from api import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For getting access & refresh tokens
    TokenRefreshView,  # For refreshing access token
    TokenVerifyView,  # To verify token validity
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.register_user, name="register"),
    path("api/login/", views.login_user, name="login"),
    path("api/reset-password/", views.reset_password, name="reset_password"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path("api/example-view",views.example_view,name="example-view")
]