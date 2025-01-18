import os
import django
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
from bs4 import BeautifulSoup
import requests
import time
from datetime import datetime, timedelta
from django.db import IntegrityError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from services.datascraper.models import DayEntryAsString, Company


def save_company(company_code):
    existing_company = Company.objects.filter(name=company_code).first()
    if existing_company:
        print(f"Company '{company_code}' already exists with ID: {existing_company.id}")
    else:
        c = Company.objects.create(name=company_code)
        c.save()


def get_missing_data(company_code, date):
    data = []
    again = True
    timeout_time = time.time() + 30

    if isinstance(date, str):
        date = datetime.strptime(date, '%d.%m.%Y').date()
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company_code
    to_date = datetime.now().date()
    from_date = date
    while again and time.time() < timeout_time:
        if (to_date - from_date).days >= 364:
            from_date = to_date - timedelta(days=364)

            to_date_str = to_date.strftime('%Y-%m-%d')
            from_date_str = from_date.strftime('%Y-%m-%d')
            search_company_year(company_code, to_date_str, from_date_str)
        else:
            from_date = date
            to_date_str = to_date.strftime('%Y-%m-%d')
            from_date_str = from_date.strftime('%Y-%m-%d')
            search_company_year(company_code, to_date_str, from_date_str)
            again = False

    if again:
        print(f"Timeout reached while processing {company_code}")

def get_10_year_data(company_code):
    years = 10
    end_date = datetime.now()
    start_date = end_date - timedelta(days=364)
    for i in range(years):
        search_company_year(company_code, end_date.strftime('%d.%m.%Y'),
                            start_date.strftime('%d.%m.%Y'))
        end_date = start_date - timedelta(days=1)
        start_date = end_date - timedelta(days=365)


def search_company_year(company_code, to_date, from_date):
    data = []
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company_code

    json_payload = {
        "FromDate": from_date,
        "ToDate": to_date,
        "Code": company_code,
    }

    response = requests.get(url, json=json_payload)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    table = soup.find('table', id='resultsTable')

    sleep(0.01)

    rows = None
    if table is not None:
        rows = table.find_all('tr')

    rows = None
    if table is not None:
        rows = table.find_all('tr')
    entries = []
    if rows is not None and len(rows) > 0:
        for row in rows:
            columns = row.find_all('td')
            if columns:
                # print(columns_dict)

                save_entry_as_string(columns, company_code)


def get_data_from_day(company, date_from):
    date_from = datetime.strptime(date_from, '%d.%m.%Y').date()
    driver = webdriver.Chrome()
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company.company_code

    date_to = driver.find_element(By.ID, "ToDate")
    date_from = driver.find_element(By.ID, "FromDate")
    btn = driver.find_element(By.CLASS_NAME, "btn-primary-sm")

    new_data_to = datetime.now()
    new_data_from = date_from

    # BEAUTIFUL SOUP
    response = requests.get(url)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    table = soup.find('table', id='resultsTable')

    driver.execute_script("arguments[0].value = arguments[1];", date_to, new_data_to)
    driver.execute_script("arguments[0].value = arguments[1];", date_from, new_data_from)
    btn.click()
    sleep(0.01)

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find('table', id='resultsTable')

    rows = None
    if table is not None:
        rows = table.find_all('tr')

    if rows is not None and len(rows) > 0:
        for row in rows:
            columns = row.find_all('td')
            if columns:
                save_entry_as_string(columns, company.company_code)

def save_entry_as_string(columns, company_code):
    date = datetime.strptime(columns[0].text.strip(), '%d.%m.%Y').date()
    date_string = columns[0].text.strip()
    last_transaction_price = columns[1].text.strip()
    max_price_text = columns[2].text.strip()
    min_price_text = columns[3].text.strip()
    avg_price_text = columns[4].text.strip()
    percentage_text = columns[5].text.strip()
    profit_text = columns[6].text.strip()
    total_profit_text = columns[7].text.strip()

    if (max_price_text != "") and (min_price_text != ""):
        entry = DayEntryAsString(
            date=date,
            date_string=date_string,
            last_transaction_price=last_transaction_price,
            max_price=max_price_text,
            min_price=min_price_text,
            avg_price=avg_price_text,
            percentage=percentage_text,
            profit=profit_text,
            total_profit=total_profit_text,
            company_code=company_code
        )
        try:
            entry.save()
            print(f"New entry created for {company_code} on {date}.")
        except IntegrityError as e:
            print(f"Entry for {company_code} on {date} already exists. Skipping...")

def get_last_date_string(company_code):
    last_entry = DayEntryAsString.objects.filter(company_code=company_code).order_by('-date').first()
    if (last_entry):
        return company_code, last_entry.date
    else:
        return company_code, None


if __name__ == '__main__':
    #TESTING
    start_time = time.time()
    get_10_year_data("KMB")
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")
