# Generated by Django 3.1.3 on 2025-01-18 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datascraper', '0009_alter_company_options_rename_code_company_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='dayentry',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='dayentryasstring',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]