import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()
from .models import DayEntryAsString, Company
from .query_factory import day_entry_query_factory

def get_day_entries(company_code=None, start_date=None, end_date=None):
    date_range = [start_date, end_date] if start_date and end_date else None
    return day_entry_query_factory(company_code, date_range)

def get_companies():
    return Company.objects.all()

def get_last_day_entries(company_codes):
    results = []
    for code in company_codes:
        per_company = DayEntryAsString.objects.filter(company_code=code)
        if per_company.exists():
            results.append(per_company.last())
    return results
