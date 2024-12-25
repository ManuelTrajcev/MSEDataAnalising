from django.urls import path
from .views import get_prediction_data, oscillator_signals, moving_average_signals

urlpatterns = [
    path('api/lstm-predictions/', get_prediction_data, name='lstm-predictions'),
    path('api/oscillator_signals/', oscillator_signals, name='oscillator-signals'),
    path('api/moving_average_signals/', moving_average_signals, name='moving_average_signals')
]
