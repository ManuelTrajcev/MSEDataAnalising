import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from datascraper.models import DayEntry

last_entry = DayEntry.objects.filter(company_code="ALK").order_by('-date').last()
print(last_entry)