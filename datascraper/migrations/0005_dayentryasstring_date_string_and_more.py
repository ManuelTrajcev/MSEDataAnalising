# Generated by Django 4.1 on 2024-11-07 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datascraper', '0004_alter_dayentryasstring_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dayentryasstring',
            name='date_string',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='dayentryasstring',
            name='date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
