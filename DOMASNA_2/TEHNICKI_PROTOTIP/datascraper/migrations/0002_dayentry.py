# Generated by Django 4.1 on 2024-11-05 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datascraper', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DayEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('last_transaction_price', models.FloatField(blank=True, null=True)),
                ('max_price', models.FloatField(blank=True, null=True)),
                ('min_price', models.FloatField(blank=True, null=True)),
                ('avg_price', models.FloatField(blank=True, null=True)),
                ('percentage', models.FloatField(blank=True, null=True)),
                ('profit', models.FloatField(blank=True, null=True)),
                ('total_profit', models.FloatField(blank=True, null=True)),
                ('company_code', models.CharField(max_length=50)),
            ],
            options={
                'ordering': ['date'],
            },
        ),
    ]