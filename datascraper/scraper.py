from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from bs4 import BeautifulSoup
import requests
from datetime import datetime, timedelta


def set_date_range(driver, start_date, end_date):
    # Locate the date input fields and set the dates
    from_date = driver.find_element(By.ID, 'FromDate')
    to_date = driver.find_element(By.ID, 'ToDate')
    from_date.clear()
    from_date.send_keys(start_date.strftime('%d.%m.%Y'))
    to_date.clear()
    to_date.send_keys(end_date.strftime('%d.%m.%Y'))


def get_10_year_data(company_code):
    driver = webdriver.Chrome()  # Initialize the driver once
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

    # Use JavaScript to modify the 'top' property for scrolling
    for i in range(NUMBER_OF_ITERATIONS):
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find('table', id='resultsTable')

        # scroll_script = f"arguments[0].style.top = '{scroll_position}px';"
        # driver.execute_script(scroll_script, scroll_container)
        rows = table.find_all('tr')
        for row in rows:
            columns = row.find_all('td')
            row_data = [column.text.strip() for column in columns]  # Extract and clean text from each column
            if row_data:
                all_data.append(row_data)

        # scroll_position -= scroll_amount
        # if scroll_position < -6147:
        #     break

    # Wait a bit to observe the scroll

    # Print or process the collected data
    for row in all_data:
        print(row)

    print(len(all_data))
    # Close the driver after finishing


if __name__ == '__main__':
    get_10_year_data("KMB")
