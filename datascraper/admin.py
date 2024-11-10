from django.contrib import admin
from .models import TodoItem, DayEntry, DayEntryAsString

# Register your models here.
admin.site.register(TodoItem)
admin.site.register(DayEntry)
admin.site.register(DayEntryAsString)
