from datetime import datetime

class RequestValidator:
    @staticmethod
    def validate_date(date_str):
        if not date_str:  # Handle None or empty strings
            return None
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError("Invalid date format. Expected format: YYYY-MM-DD.")