from django.urls import path
from .views import my_function, get_data

urlpatterns = [
    path('api/my-function/', my_function, name='my-function'),
    path('api/get-data/', get_data, name='get-data'),

]
