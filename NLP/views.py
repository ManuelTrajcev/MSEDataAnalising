from datetime import datetime
from datascraper.models import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from collections import Counter
# from serializers import

# Create your views here.

@api_view(['GET'])
def get_company_predictions(request):
    company_codes = request.query_params.get('company_codes')
    print(company_codes)

    if company_codes:
        company_codes = company_codes.split(',')
    else:
        return Response({"error": "No company_codes parameter provided"}, status=400)

    data = News.objects.filter(company_code__in=company_codes)

    company_sentiments = {}

    grouped_by_company = data.values('company_code', 'sentiment')

    for entry in grouped_by_company:
        company_code = entry['company_code']
        sentiment = entry['sentiment']

        if company_code not in company_sentiments:
            company_sentiments[company_code] = []

        company_sentiments[company_code].append(sentiment)

    most_common_sentiments = {}

    for company_code, sentiments in company_sentiments.items():
        sentiment_counts = Counter(sentiments)
        most_common_sentiment = sentiment_counts.most_common(1)[0][0]
        most_common_sentiments[company_code] = most_common_sentiment

    return Response(most_common_sentiments)
