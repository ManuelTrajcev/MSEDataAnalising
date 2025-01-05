from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .services import *

@api_view(['GET'])
def get_company_predictions(request):
    data = get_all_predictions()
    serializer = CompanySerializer(data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_latest_newss(request):
    data = get_last_newss(3)
    serializer = NewsSerializer(data, many=True)
    return Response(serializer.data)
