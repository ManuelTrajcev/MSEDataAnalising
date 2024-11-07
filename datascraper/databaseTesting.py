import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from datascraper.models import DayEntry

def get_last_date(company_code):
    last_entry = DayEntry.objects.filter(company_code=company_code).order_by('-date').last()
    return company_code, last_entry.date

last_entry = DayEntry.objects.filter(company_code="sda").order_by('-date').last()
print(last_entry)
