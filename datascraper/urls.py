from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("todos/", views.todos, name="ToDos"),
    path("datascraper/", views.StartScraper, name="Datascraper"),
]