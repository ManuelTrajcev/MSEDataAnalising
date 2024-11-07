import requests
from bs4 import BeautifulSoup
import time
from datascraper.tasks import start_scrapper

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
    task_results = []

    for company in companies:
        result = start_scrapper.delay(company)
        task_results.append(result)

    for result in task_results:
        result.wait()

#async
# def filter_2(companies):
#     task_results = [start_scrapper.delay(company) for company in companies]
#     for result in task_results:
#         if result.ready():
#             print(f"Task {result.id} completed successfully.")
#         else:
#             print(f"Task {result.id} is still processing.")

def filter_3(last_dates):
    print("Fileter 3")


if __name__ == '__main__':
    start_time = time.time()
    companies = filter_1("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    filter_2(companies)
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Total execution time: {execution_time:.2f} seconds")