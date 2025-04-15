# from django.apps import AppConfig


# class ApiConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "api"

# from django.apps import AppConfig
# import logging

# logger = logging.getLogger(__name__)

# class ApiConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "api"

#     def ready(self): #ensures the scheduler starts when the Django app loads
#         """Start the scheduler when the app is ready."""
#         try:
#             from .scheduler import start_scheduler
#             start_scheduler() 
#             logger.info("Scheduler started successfully.")
#         except Exception as e:
#             logger.error(f"Error starting scheduler: {str(e)}")

from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        """App ready — no manual scheduler needed for Lambda."""
        logger.info("App is ready.")