from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('services.datascraper.urls')),
    path('lstm/', include('services.LSTM.urls')),
    path('nlp/', include('services.NLP.urls')),
]
