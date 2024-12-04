from rest_framework import serializers
from .models import DayEntryAsString

class DayEntryAsStringSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayEntryAsString
        fields = '__all__'