from datetime import datetime

class RequestValidator:
    @staticmethod
    def validate_date(date_str):
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return None
