from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Process, Manager
from datetime import date
import os
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
from utils import get_10_year_data_list, get_missing_data_list, search_company_year_list, get_last_date

def worker(companies_subset, shared_data, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for company in companies_subset:
            executor.submit(process_company, company, shared_data)

def process_company(company, shared_data):
    print("Thread started...")
    print(f"Processing company: {company[0]}")
    start_time = time.time()

    if company[1] is None:
        shared_data.append(get_10_year_data_list(company[0]))
    elif company[1] != date.today():
        get_missing_data_list(company[0], company[1])

    end_time = time.time()
    execution_time = end_time - start_time
    print("Thread finished in {} seconds".format(execution_time))

def filter_1(url):
    response = requests.get(url)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    select_menu = soup.find('select', class_='form-control')
    options = [option.get_text(strip=True) for option in select_menu.find_all('option')]
    filtered_options = [option for option in options if option.isalpha()]
    return filtered_options

def filter_1_corrected(url):
    response = requests.get(url)
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")

    tbodies = soup.find_all('tbody')
    filtered_options = []

    for tbody in tbodies:
        for row in tbody.find_all('tr'):
            symbol_tag = row.find('a')
            if symbol_tag:
                symbol = symbol_tag.get_text(strip=True)
                if symbol.isalpha() and symbol not in filtered_options:
                    filtered_options.append(symbol)

    return filtered_options

def filter_2(companies):
    companies_last_dates = [get_last_date(company) for company in companies]
    return companies_last_dates

def filter_3(companies_last_dates):
    num_cores = os.cpu_count()
    max_workers = num_cores

    with Manager() as manager:
        shared_data = manager.list()
        os.makedirs('all_data', exist_ok=True)
        start_time = time.time()
        print("Starting scraping data from MSE...")

        chunk_size = len(companies_last_dates) // num_cores
        company_chunks = [companies_last_dates[i:i + chunk_size] for i in range(0, len(companies_last_dates), chunk_size)]

        processes = []
        for chunk in company_chunks:
            p = Process(target=worker, args=(chunk, shared_data, max_workers))
            processes.append(p)
            p.start()

        for p in processes:
            p.join()

        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Total execution time: {execution_time:.2f} seconds")

        return list(shared_data)


if __name__ == '__main__':
    companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    # for c in companies:
    #     print(c)
    url_corrected = "https://www.mse.mk/en/stats/current-schedule"
    companies_corrected = filter_1_corrected(url_corrected)
    print(len(companies_corrected))
    print(len(companies))
    # for c in companies_corrected:
    #     print(c)
    #
    # print(f"Total execution time: {execution_time:.2f} seconds")
    # data = []
    # os.makedirs('all_data', exist_ok=True)
    # start_time = time.time()
    # companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    #
    # def process_company(company):
    #     print(company)
    #     get_10_year_data_list(company)
    #
    # with ThreadPoolExecutor(max_workers=6) as executor:
    #     executor.map(process_company, companies)
    #
    # end_time = time.time()
    # execution_time = end_time - start_time
    # df = pd.DataFrame(data)
    # print(df)
    # print(f"Total execution time: {execution_time:.2f} seconds")
    # print("Total execution time {} seconds".format(execution_time))
    # print(f"Total data scraped: {len(data)} ")