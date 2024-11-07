from django.db import models
# Create your models here.

#python manage.py makemigrations - on every change
#python manage.py migrate

class DayEntry(models.Model):
    date = models.DateField(null=True, blank=True)
    last_transaction_price = models.FloatField(null=True, blank=True)
    max_price = models.FloatField(null=True, blank=True)
    min_price = models.FloatField(null=True, blank=True)
    avg_price = models.FloatField(null=True, blank=True)
    percentage = models.FloatField(null=True, blank=True)
    profit = models.FloatField(null=True, blank=True)
    total_profit = models.FloatField(null=True, blank=True)
    company_code = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.date} - {self.company_code}"

    class Meta:
        ordering = ['date']
        app_label = 'datascraper'
        #
        # TODO:
        # 1. null, blank
        # 2.

class TodoItem(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    class Meta:
        app_label = 'datascraper'