import os
import django
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from bs4 import BeautifulSoup
import requests
import time
from datetime import datetime, timedelta
from selenium.webdriver.chrome.options import Options

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from datascraper.models import DayEntry, DayEntryAsString


def init_driver():
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-webgl")
    chrome_options.add_argument("--disable-blink-features=CSSStyling")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")

    prefs = {
        "profile.managed_default_content_settings.images": 2,  # Disable images
        "profile.managed_default_content_settings.javascript": 2,  # Disable JavaScript
        "profile.default_content_setting_values.popups": 2,  # Block pop-ups
        "profile.default_content_setting_values.geolocation": 2,  # Disable geolocation
        "profile.default_content_setting_values.notifications": 2,  # Disable notifications
        "profile.password_manager_enabled": False,  # Disable password manager
        "credentials_enable_service": False,  # Disable credentials service
        "profile.content_settings.plugin_whitelist.adobe-flash-player": 0,  # Disable Flash
        "profile.content_settings.exceptions.plugins.*,*.per_resource.adobe-flash-player": 0
    }

    chrome_options.add_experimental_option("prefs", prefs)

    driver = webdriver.Chrome(options=chrome_options)
    return driver


def get_10_year_data(company_code):
    print("Thread started...")
    driver = init_driver()

    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company_code
    driver.get(url)

    years = 10
    end_date = datetime.now()
    start_date = end_date - timedelta(days=364)
    for i in range(years):
        search_company_year(driver, company_code, end_date.strftime('%d.%m.%Y'), start_date.strftime('%d.%m.%Y'))
        end_date = start_date - timedelta(days=1)
        start_date = end_date - timedelta(days=365)

    driver.quit()
    print("Thread finnished...")


def search_company_year(driver, company_code, to_date, from_date):
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company_code
    # driver.get(url)

    date_to = driver.find_element(By.ID, "ToDate")
    date_from = driver.find_element(By.ID, "FromDate")
    btn = driver.find_element(By.CLASS_NAME, "btn-primary-sm")

    new_data_to = to_date
    new_data_from = from_date

    # BEAUTIFUL SOUP
    response = requests.get(url)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    table = soup.find('table', id='resultsTable')

    driver.execute_script("arguments[0].value = arguments[1];", date_to, new_data_to)
    driver.execute_script("arguments[0].value = arguments[1];", date_from, new_data_from)
    btn.click()
    sleep(0.01)

    # scroll_container = driver.find_element(By.ID, "mCSB_1_container")
    # scroll_increment = -31
    NUMBER_OF_ITERATIONS = 1
    all_data = []
    # scrollHeight = 100

    # scroll_amount = 31*10
    # scroll_position = -scroll_amount
    # scroll_height = driver.execute_script("return arguments[0].scrollHeight", scroll_container)

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find('table', id='resultsTable')

    rows = None
    if table is not None:
        rows = table.find_all('tr')
    entries = []
    if rows is not None and len(rows) > 0:
        for row in rows:
            columns = row.find_all('td')
            if columns:
                # Parse each column and map it to the DayEntry fields
                # date = datetime.strptime(columns[0].text.strip(), '%d.%m.%Y').date()
                # last_transaction_price = float(columns[1].text.strip().replace(',', ''))
                #
                # max_price_text = columns[2].text.strip().replace('.', '').replace(',', '.')
                # max_price = float(max_price_text) if max_price_text else None
                #
                # min_price_text = columns[3].text.strip().replace(',', '')
                # min_price = float(min_price_text) if min_price_text else None
                #
                # avg_price_text = columns[4].text.strip().replace(',', '')
                # avg_price = float(avg_price_text) if avg_price_text else None
                #
                # percentage_text = columns[5].text.strip().replace('%', '').replace(',', '')
                # percentage = float(percentage_text) if percentage_text else None
                #
                # profit_text = columns[6].text.strip().replace('.', '')
                # profit = float(profit_text) if profit_text else None
                #
                # total_profit_text = columns[7].text.strip().replace('.', '')
                # total_profit = float(total_profit_text) if total_profit_text else None

                # columns_dict = {
                #     "date": columns[0].text.strip(),
                #     "last_transaction_price": columns[1].text.strip(),
                #     "max_price": columns[2].text.strip(),
                #     "min_price": columns[3].text.strip(),
                #     "avg_price": columns[4].text.strip(),
                #     "percentage": columns[5].text.strip(),
                #     "profit": columns[6].text.strip(),
                #     "total_profit": columns[7].text.strip(),
                #     "company_code": company_code
                # }

                # print(columns_dict)

                save_entry_as_string(columns, company_code)

                # entry = DayEntry(
                #     date=date,
                #     last_transaction_price=last_transaction_price,
                #     max_price=max_price,
                #     min_price=min_price,
                #     avg_price=avg_price,
                #     percentage=percentage,
                #     profit=profit,
                #     total_profit=total_profit,
                #     company_code=company_code
                # )
                #
                # entries.append(entry)

                # print(f"Saved entry for {entry.date} - {entry.company_code}")
                # print(f"Date: {date}, Last Transaction Price: {last_transaction_price}, Max Price: {max_price}, "
                #       f"Min Price: {min_price}, Average Price: {avg_price}, Percentage: {percentage}, "
                #       f"Profit: {profit}, Total Profit: {total_profit}")
    DayEntry.objects.bulk_create(entries)


def get_data_from_day(company, date_from):
    date_from = datetime.strptime(date_from, '%d.%m.%Y').date()
    driver = webdriver.Chrome()
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company.company_code
    # driver.get(url)

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
    entries = []
    if rows is not None and len(rows) > 0:
        for row in rows:
            columns = row.find_all('td')
            if columns:
                save_entry_as_string(columns, company.company_code)
                # Parse each column and map it to the DayEntry fields
                # date = datetime.strptime(columns[0].text.strip(), '%d.%m.%Y').date()
                # last_transaction_price = float(columns[1].text.strip().replace(',', ''))
                #
                # max_price_text = columns[2].text.strip().replace('.', '').replace(',', '.')
                # max_price = float(max_price_text) if max_price_text else None
                #
                # min_price_text = columns[3].text.strip().replace(',', '')
                # min_price = float(min_price_text) if min_price_text else None
                #
                # avg_price_text = columns[4].text.strip().replace(',', '')
                # avg_price = float(avg_price_text) if avg_price_text else None
                #
                # percentage_text = columns[5].text.strip().replace('%', '').replace(',', '')
                # percentage = float(percentage_text) if percentage_text else None
                #
                # profit_text = columns[6].text.strip().replace('.', '')
                # profit = float(profit_text) if profit_text else None
                #
                # total_profit_text = columns[7].text.strip().replace('.', '')
                # total_profit = float(total_profit_text) if total_profit_text else None

                # columns_dict = {
                #     "date": columns[0].text.strip(),
                #     "last_transaction_price": columns[1].text.strip(),
                #     "max_price": columns[2].text.strip(),
                #     "min_price": columns[3].text.strip(),
                #     "avg_price": columns[4].text.strip(),
                #     "percentage": columns[5].text.strip(),
                #     "profit": columns[6].text.strip(),
                #     "total_profit": columns[7].text.strip(),
                #     "company_code": company.company_code
                # }

                # print(columns_dict)

                # entry = DayEntry(
                #     date=date,
                #     last_transaction_price=last_transaction_price,
                #     max_price=max_price,
                #     min_price=min_price,
                #     avg_price=avg_price,
                #     percentage=percentage,
                #     profit=profit,
                #     total_profit=total_profit,
                #     company_code=company_code
                # )
                #
                # entries.append(entry)

                # print(f"Saved entry for {entry.date} - {entry.company_code}")
                # print(f"Date: {date}, Last Transaction Price: {last_transaction_price}, Max Price: {max_price}, "
                #       f"Min Price: {min_price}, Average Price: {avg_price}, Percentage: {percentage}, "
                #       f"Profit: {profit}, Total Profit: {total_profit}")
    # DayEntry.objects.bulk_create(entries)


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
        entry.save()
        print(f"New entry created for {company_code} on {date}.")

    # if not DayEntryAsString.objects.filter(company_code=company_code, date=date).exists():
    #     entry.save()
    #     print(f"New entry created for {company_code} on {date}.")
    # else:
    #     print(f"Entry with company_code {company_code} and date {date} already exists, skipping save.")




if __name__ == '__main__':
    start_time = time.time()
    get_10_year_data("KMB")
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")
