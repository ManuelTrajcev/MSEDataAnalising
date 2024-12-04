from rest_framework import serializers
from .models import DayEntryAsString, Company


class DayEntryAsStringSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayEntryAsString
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name']