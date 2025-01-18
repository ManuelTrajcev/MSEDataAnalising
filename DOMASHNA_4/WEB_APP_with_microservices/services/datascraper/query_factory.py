from .models import DayEntryAsString

def day_entry_query_factory(company_code=None, date_range=None):
    query = DayEntryAsString.objects.all()
    if company_code:
        query = query.filter(company_code=company_code)
    if date_range:
        query = query.filter(date__range=date_range)
    return query