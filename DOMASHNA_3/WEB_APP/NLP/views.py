from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *


@api_view(['GET'])
def get_company_predictions(request):
    data = Company.objects.all()
    serializer = CompanySerializer(data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_latest_newss(request):
    data = News.objects.all()[::-1][:20]
    serializer = NewsSerializer(data, many=True)
    return Response(serializer.data)
