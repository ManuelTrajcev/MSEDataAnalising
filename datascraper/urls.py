from django.urls import path
from .views import my_function, get_data, get_company_codes

urlpatterns = [
    path('api/my-function/', my_function, name='my-function'),
    path('api/get-data/', get_data, name='get-data'),
    path('api/get-company-codes/', get_company_codes, name='get-data'),]
