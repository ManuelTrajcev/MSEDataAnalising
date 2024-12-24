from rest_framework import serializers
from .models import *


# class DayEntryAsStringSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DayEntryAsString
#         fields = '__all__'
#
# class CompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Company
#         fields = ['name']
#
#
# class TimeSeriesDataSerializer(serializers.ModelSerializer):
#     date = serializers.DateField()
#     total_profit = serializers.FloatField()
#
#     class Meta:
#         model = DayEntryAsString
#         fields = ['date', 'total_profit']
#
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#
#         raw_total_profit = str(instance.total_profit).replace(',', '.')
#
#         # Convert to float if it's a valid value
#         try:
#             representation['total_profit'] = float(raw_total_profit)
#         except ValueError:
#             representation['total_profit'] = None
#
#         return representation