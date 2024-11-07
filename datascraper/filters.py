import requests
from bs4 import BeautifulSoup
import time
from datascraper.tasks import start_scrapper
from utils import get_10_year_data, get_data_from_day
from databaseTesting import get_last_date


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
    task_results = []

    for company in companies_last_dates:
        if (company[1] is None):
            get_10_year_data(company)
        else:
            get_data_from_day(company[1])
        # result = start_scrapper.delay(company)
        # task_results.append(result)

    # for result in task_results:
    #     result.wait()


# async
# def filter_2(companies):
#     task_results = [start_scrapper.delay(company) for company in companies]
#     for result in task_results:
#         if result.ready():
#             print(f"Task {result.id} completed successfully.")
#         else:
#             print(f"Task {result.id} is still processing.")


if __name__ == '__main__':
    start_time = time.time()
    companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    filter_2(companies)
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")
