from datetime import datetime
from datascraper.models import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from collections import Counter

from .serializers import CompanySerializer


@api_view(['GET'])
def get_company_predictions(request):
    data = Company.objects.all()
    serializer = CompanySerializer(data, many=True)
    return Response(serializer.data)
