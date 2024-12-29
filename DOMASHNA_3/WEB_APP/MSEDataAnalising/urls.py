from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('datascraper.urls')),
    path('lstm/', include('LSTM.urls')),
    path('nlp/', include('NLP.urls')),
]
