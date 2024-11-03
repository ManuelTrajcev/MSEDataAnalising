from django.db import models
# Create your models here.

#python manage.py makemigrations - on every change
#python manage.py migrate
class TodoItem(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

class DayEntry(models.Model):
    date = models.DateField()
    last_transaction_price = models.FloatField()
    max_price = models.FloatField()
    min_price = models.FloatField()
    avg_price = models.FloatField()
    percentage = models.FloatField()
    profit = models.FloatField()
    total_profit = models.FloatField()
    company_code = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.date} - {self.code}"

    class Meta:
        ordering = ['date']