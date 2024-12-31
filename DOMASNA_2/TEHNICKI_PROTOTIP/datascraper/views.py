from datetime import datetime
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DayEntryAsStringSerializer, CompanySerializer


def my_function(request):
    if request.method == 'GET':

        return JsonResponse({'message': 'Function called successfully!'})


@api_view(['GET'])
def get_data(request):
    company_code = request.query_params.get('company_code')
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid start date format. Please use YYYY-MM-DD."}, status=400)

    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid end date format. Please use YYYY-MM-DD."}, status=400)

    if company_code and start_date and end_date:
        data = DayEntryAsString.objects.filter(company_code=company_code, date__range=[start_date, end_date])
    elif company_code:
        data = DayEntryAsString.objects.filter(company_code=company_code)
    elif start_date and end_date:
        data = DayEntryAsString.objects.filter(date__range=[start_date, end_date])
    else:
        data = DayEntryAsString.objects.all()


    serializer = DayEntryAsStringSerializer(data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_company_codes(request):
    company_codes = Company.objects.all()
    serializer = CompanySerializer(company_codes, many=True)
    return Response(serializer.data)


