from django.shortcuts import render, HttpResponse
from .models import TodoItem, DayEntry
# Create your views here.
def home(request):
    return render(request, 'home.html')

def todos(request):
    items = TodoItem.objects.all()
    return render(request, 'todos.html', {"todos": items})

def StartScraper(request):
    DayEntries = DayEntry.objects.all()
    return render(request, 'datascraper.html')
