from django.db import models

# Create your models here.

#python manage.py makemigrations - on every change
#python manage.py migrate
class TodoItem(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)