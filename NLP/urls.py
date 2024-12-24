from django.urls import path
from .views import *

urlpatterns = [
    path('api/get-company-predictions/', get_company_predictions, name='my-function'),
]