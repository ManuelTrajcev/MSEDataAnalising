import os
from django.urls import path, include

TARGET_APP = os.environ.get("DJANGO_TARGET_APP")

app_urls = {
    "datascraper": "services.datascraper.urls",
    "lstm": "services.LSTM.urls",
    "nlp": "services.NLP.urls",
}

if TARGET_APP and TARGET_APP in app_urls:
    urlpatterns = [
        path(f'{TARGET_APP}/', include(app_urls[TARGET_APP]))
    ]
else:
    urlpatterns = [
        path('datascraper/', include('services.datascraper.urls')),
        path('lstm/', include('services.LSTM.urls')),
        path('nlp/', include('services.NLP.urls')),
    ]
