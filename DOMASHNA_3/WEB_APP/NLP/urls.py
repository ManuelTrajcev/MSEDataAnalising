from django.urls import path
from .views import *

urlpatterns = [
    path('api/get-company-predictions/', get_company_predictions, name='company-predictions'),
    path('api/get-latest-newss/', get_latest_newss, name='test-newss'),
]