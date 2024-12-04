from django.shortcuts import render, HttpResponse
from datascraper.models import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DayEntryAsStringSerializer

def my_function(request):
    if request.method == 'GET':
        # Perform some action or return data
        return JsonResponse({'message': 'Function called successfully!'})


@api_view(['GET'])
def get_data(request):
    company_code = request.query_params.get('company_code')  # Fetch company_code from query params
    if company_code:  # If company_code is provided, filter the data
        data = DayEntryAsString.objects.filter(company_code=company_code)
    else:
        data = DayEntryAsString.objects.all()  # Return all data if no company_code is provided

    serializer = DayEntryAsStringSerializer(data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_company_codes(request):
    unique_filtered_values = DayEntryAsString.objects.filter(active=True).values_list('company_code', flat=True).distinct()

    serializer = DayEntryAsStringSerializer(unique_filtered_values, many=True)
    return Response(serializer.data)

if __name__ == '__main__':
    companies = Company.objects.all()

