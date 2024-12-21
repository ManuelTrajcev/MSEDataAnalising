from django.db import models


class News(models.Model):
    document_id = models.IntegerField(unique=True, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    company_code = models.CharField(max_length=20, null=True, blank=True)
    company_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.document_id} - {self.date}"

    class Meta:
        ordering = ['date']