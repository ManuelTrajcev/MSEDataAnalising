import os
import django
import pandas as pd
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
import pandas as pd


def get_10_year_data_list(company_code):
    data = []
    print("Thread started...")
    start_time = time.time()

    years = 10
    end_date = datetime.now()
    start_date = end_date - timedelta(days=364)
    for i in range(years):
        data.extend(search_company_year_list(company_code, end_date.strftime('%d.%m.%Y'),
                                             start_date.strftime('%d.%m.%Y')))
        end_date = start_date - timedelta(days=1)
        start_date = end_date - timedelta(days=365)

    # driver.quit()

    end_time = time.time()
    execution_time = end_time - start_time
    print("Thread finnished in {} seconds".format(execution_time))
    df = pd.DataFrame(data)
    df.to_csv(f'all_data/{company_code}.csv', index=False)


def get_missing_data_list(company_code, date):
    data = []
    date = datetime.strptime(date, '%d.%m.%Y').date()
    base_url = "https://www.mse.mk/mk/stats/symbolhistory/"
    url = base_url + company_code

    to_date = datetime.now()
    from_date = date

    while True:
        if (to_date - from_date).days >= 364:
            from_date = to_date - timedelta(days=364)
            data.extend(search_company_year_list(company_code, to_date, from_date))
        else:
            from_date = date
            data.extend(search_company_year_list(company_code, to_date, from_date))
            break

    df = pd.DataFrame(data)
    old_data = pd.read_csv(f'all_data/{company_code}.csv')
    df.extend(old_data)
    df.to_csv(f'all_data/{company_code}.csv', index=False)


def search_company_year_list(company_code, to_date, from_date):
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

    if rows is not None and len(rows) > 0:
        for row in rows:
            columns = row.find_all('td')
            if columns:
                columns_dict = {
                    "date": columns[0].text.strip(),
                    "last_transaction_price": columns[1].text.strip(),
                    "max_price": columns[2].text.strip(),
                    "min_price": columns[3].text.strip(),
                    "avg_price": columns[4].text.strip(),
                    "percentage": columns[5].text.strip(),
                    "profit": columns[6].text.strip(),
                    "total_profit": columns[7].text.strip(),
                    "company_code": company_code
                }
                data.append(columns_dict)
    return data


def get_last_date(company_code):
    file_path = f'all_data/{company_code}.csv'

    # Check if the file exists
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        return company_code, df.iloc[0]["date"]
    else:
        return company_code, None


if __name__ == "__main__":
    start_time = time.time()
    data = get_10_year_data_list("KMB")
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")
    df = pd.DataFrame(data)
    # df.to_csv("data.csv")
    print(data)
    # print(get_last_date("KMB"))