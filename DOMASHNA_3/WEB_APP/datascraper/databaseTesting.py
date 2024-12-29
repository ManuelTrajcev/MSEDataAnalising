import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from datascraper.models import DayEntry, DayEntryAsString


def get_last_date(company_code):
    last_entry = DayEntry.objects.filter(company_code=company_code).order_by('-date').last()
    return company_code, last_entry.date

def get_last_date_string(company_code):
    last_entry = DayEntryAsString.objects.filter(company_code=company_code).order_by('-date').first()
    if (last_entry):
        return company_code, last_entry.date
    else:
        return company_code, None


last_entry = DayEntryAsString.objects.filter(company_code="TNB").order_by('-date')
for e in last_entry:
    print(e.date)
