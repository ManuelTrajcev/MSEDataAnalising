from .serializers import CompanySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DayEntryAsStringSerializer
from .services import get_day_entries, get_companies, get_last_day_entries
from .validators import RequestValidator


@api_view(['GET'])
def get_data(request):
    company_code = request.query_params.get('company_code')
    start_date = RequestValidator.validate_date(request.query_params.get('start_date'))
    end_date = RequestValidator.validate_date(request.query_params.get('end_date'))

    if request.query_params.get('start_date') and not start_date:
        return Response({"error": "Invalid start date format. Please use YYYY-MM-DD."}, status=400)

    if request.query_params.get('end_date') and not end_date:
        return Response({"error": "Invalid end date format. Please use YYYY-MM-DD."}, status=400)

    data = get_day_entries(company_code, start_date, end_date)
    serializer = DayEntryAsStringSerializer(data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_company_codes(request):
    company_codes = get_companies()
    serializer = CompanySerializer(company_codes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_last_day_data(request):
    company_codes = request.query_params.get('company_codes')
    if not company_codes:
        return Response({"error": "company_codes query parameter is required."}, status=400)

    company_codes = company_codes.split(',')
    data = get_last_day_entries(company_codes)

    if not data:
        return Response({"error": "No data found for the given company codes."}, status=404)

    serializer = DayEntryAsStringSerializer(data, many=True)
    return Response(serializer.data)
