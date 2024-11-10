from concurrent.futures import ThreadPoolExecutor
from datetime import date
import os
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
from utils_lists import get_10_year_data_list, get_missing_data_list, search_company_year_list, get_last_date

def filter_1(url):
    response = requests.get(url)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    select_menu = soup.find('select', class_='form-control')
    options = [option.get_text(strip=True) for option in select_menu.find_all('option')]
    filtered_options = []
    for option in options:
        if option.isalpha():
            filtered_options.append(option)

    return filtered_options

def filter_2(companies):
    companies_last_dates = []
    for company in companies:
        companies_last_dates.append(get_last_date(company))

    return companies_last_dates

def filter_3(companies_last_dates):
    data = []
    os.makedirs('all_data', exist_ok=True)
    start_time = time.time()
    print(f"Starting scraping data from MSE...")

    def process_company(company):
        print("Thread started...")
        print(f"Processing company: {company[0]}")
        start_time = time.time()

        if company[1] is None:
            data.append(get_10_year_data_list(company[0]))
        elif company[1] != date.today():
            get_missing_data_list(company[0], company[1])

        end_time = time.time()
        execution_time = end_time - start_time
        print("Thread finished in {} seconds".format(execution_time))

    with ThreadPoolExecutor(max_workers=4) as executor:
        executor.map(process_company, companies_last_dates)

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")

    return data

if __name__ == '__main__':
    # companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    # for c in companies:
    #     get_10_year_data_list(c)
    #
    # print(f"Total execution time: {execution_time:.2f} seconds")
    data = []
    os.makedirs('all_data', exist_ok=True)
    start_time = time.time()
    companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")

    def process_company(company):
        print(company)
        get_10_year_data_list(company)

    with ThreadPoolExecutor(max_workers=6) as executor:
        executor.map(process_company, companies)

    end_time = time.time()
    execution_time = end_time - start_time
    df = pd.DataFrame(data)
    print(df)
    print(f"Total execution time: {execution_time:.2f} seconds")
    print("Total execution time {} seconds".format(execution_time))
    print(f"Total data scraped: {len(data)} ")