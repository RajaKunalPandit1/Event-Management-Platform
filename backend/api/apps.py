# from django.apps import AppConfig


# class ApiConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "api"

# from django.apps import AppConfig
# import logging
# import threading

# logger = logging.getLogger(__name__)

# class ApiConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "api"

#     def ready(self):
#         """Start the scheduler only when Django is fully initialized."""
#         if not threading.current_thread().name == "MainThread":
#             return  # Prevent scheduler from running multiple times in Django's autoreload mode
        
#         try:
#             from django.db.utils import OperationalError
#             from django.core.management import call_command

#             # Ensure all migrations are applied before starting the scheduler
#             try:
#                 call_command("migrate")
#             except OperationalError:
#                 logger.error("Database is not ready yet. Skipping scheduler startup.")
#                 return  # Exit if DB is not ready

#             from .scheduler import start_scheduler  # ✅ Import inside the function to avoid issues
#             start_scheduler()  # Start the scheduler
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
        """Start the scheduler when the app is ready."""
        try:
            from .scheduler import start_scheduler
            start_scheduler() 
            logger.info("Scheduler started successfully.")
        except Exception as e:
            logger.error(f"Error starting scheduler: {str(e)}")