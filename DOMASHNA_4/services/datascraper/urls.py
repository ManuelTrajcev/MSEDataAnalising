from django.urls import path
from .views import *

urlpatterns = [
    path('api/get-data/', get_data, name='get-data'),
    path('api/get-company-codes/', get_company_codes, name='get-company-codes'),
    path('api/get-last-day-data/', get_last_day_data, name='get-last-day-data'),
]
