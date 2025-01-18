import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class ExceptionLoggingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.error(f"Error occurred during request: {request.path} - {str(exception)}")
