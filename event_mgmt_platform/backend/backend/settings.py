# """
# Django settings for backend project.

# Generated by 'django-admin startproject' using Django 5.1.7.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.1/topics/settings/

# For the full list of settings and their values, see
# https://docs.djangoproject.com/en/5.1/ref/settings/
# """

from pathlib import Path
from datetime import timedelta
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-n6nbp6+7h_^@d5l5r+^@25coeg1ow#cu+11q6p@esy&j+k+*j%"

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = False
DEBUG = True

# ALLOWED_HOSTS = ['52.66.54.28', 'localhost', '127.0.0.1']
ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_simplejwt",
    "rest_framework",
    "api",
    "corsheaders",
    "storages",
]

INSTALLED_APPS += ["django_apscheduler"]

APSCHEDULER_DATETIME_FORMAT = "N j, Y, f:s a"


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ROOT_URLCONF = "backend.urls"
# BASE_URL = "http://127.0.0.1:8000"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Temporarily allow all origins (for testing)
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",  # Allow frontend
#     "http://localhost:3000",  # React frontend

# ]

AUTH_USER_MODEL = 'api.CustomUser'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'event_mgmt',
        'USER': 'EventMgmtDB',
        'PASSWORD': 'qwerty123456',
        'HOST': 'database-1.cnoq6ia2kp2s.ap-south-1.rds.amazonaws.com',
        'PORT': '5432',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'event_mgmt',
#         'USER': 'postgres',
#         'PASSWORD': '1234',
#         # 'HOST': 'localhost',
#         'HOST': 'host.docker.internal',
#         'PORT': '5432',
#     }
# }

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # Access token expires in 30 min
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh token expires in 7 days
    'ROTATE_REFRESH_TOKENS': True,  # Generates a new refresh token every time it's used
    'BLACKLIST_AFTER_ROTATION': True,  # Blacklist old refresh tokens after rotation
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,  # Uses Django's secret key
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "file": {
#             "level": "INFO",
#             "class": "logging.FileHandler",
#             "filename": "scheduler.log",
#         },
#     },
#     "loggers": {
#         "django": {
#             "handlers": ["file"],
#             "level": "INFO",
#             "propagate": True,
#         },
#     },
# }

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
    },
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "rajakunalpandit2@gmail.com"
EMAIL_HOST_PASSWORD = "dvqvkqdegcduljko"

# Frontend URL for redirection
FRONTEND_URL = "http://localhost:5173"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Expire reset token after 1 hour (default is 24 hours)
PASSWORD_RESET_TIMEOUT = 3600  # 3600 seconds = 1 hour


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

AUTHENTICATION_BACKENDS = [
    "api.authentication.EmailBackend",  
    "django.contrib.auth.backends.ModelBackend",  # Keep default username-based login
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

MEDIA_URL = "/media/"
# MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_ROOT = BASE_DIR / "media"

# STATIC_URL = "static/"
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# AWS_STORAGE_BUCKET_NAME = 'eventmgmteventimages'
# AWS_S3_REGION_NAME = 'ap-south-1'  

# AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
# AWS_S3_FILE_OVERWRITE = False
# AWS_DEFAULT_ACL = 'public-read'
# AWS_S3_SIGNATURE_VERSION = 's3v4'

# # Media files (User uploads)
# MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'



# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"