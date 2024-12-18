from django.db import models


class News(models.Model):
    date = models.DateField(null=True, blank=True)
    title = models.CharField(max_length=50, null=True, blank=True)
    link = models.CharField(max_length=500, null=True, blank=True)
    content = models.CharField(max_length=5000)

    def __str__(self):
        return f"{self.date} - {self.title}"

    class Meta:
        ordering = ['date']
        unique_together = ['title', 'date']