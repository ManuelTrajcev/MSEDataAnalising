import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time

def filter_1():
    response = requests.get("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    raw_html = response.text
    soup = BeautifulSoup(raw_html, "html.parser")
    select_menu = soup.find('select', class_='form-control')
    options = [option.get_text(strip=True) for option in select_menu.find_all('option')]
    filtered_options = []
    for option in options:
        if option.isalpha():
            filtered_options.append(option)

    return filtered_options

def initialize_driver():
    # Initialize the Selenium WebDriver (assuming Chrome here, adjust as needed)
    driver = webdriver.Chrome()
    driver.get("https://www.mse.mk/mk/stats/symbolhistory/KMB")
    return driver

def set_date_range(driver, start_date, end_date):
    # Locate the date input fields and set the dates
    from_date = driver.find_element(By.ID, 'FromDate')
    to_date = driver.find_element(By.ID, 'ToDate')
    from_date.clear()
    from_date.send_keys(start_date.strftime('%d.%m.%Y'))
    to_date.clear()
    to_date.send_keys(end_date.strftime('%d.%m.%Y'))


def select_issuer_code(driver, code):
    # Locate the issuer code dropdown and select the appropriate option
    select = Select(driver.find_element(By.ID, 'Code'))
    select.select_by_value(code)

def fetch_data(driver):
    # Click the "Прикажи" button to display the data
    show_button = driver.find_element(By.XPATH, '//input[@value="Прикажи"]')
    show_button.click()
    time.sleep(10)  # Wait for data to load; adjust as needed

    # Parse data from the resulting table
    # table = driver.find_element(By.TAG_NAME, 'table')
    # rows = table.find_elements(By.TAG_NAME, 'tr')
    # data = []
    # for row in rows:
    #     cols = row.find_elements(By.TAG_NAME, 'td')
    #     data.append([col.text for col in cols])
    #
    # return data

def fetch_data_last_10_years(driver, issuer_code):
    end_date = datetime.today()
    start_date = end_date - timedelta(days=365)

    # Divide the last 10 years into 365-day intervals
    for _ in range(10):
        set_date_range(driver, start_date, end_date)
        select_issuer_code(driver, issuer_code)
        fetch_data(driver)

        # Process and save data as needed
        # print(data)

        # Move to the previous interval
        end_date = start_date - timedelta(days=1)
        start_date = end_date - timedelta(days=365)

def filter_2(data):
    #for item in data:

    conn = sqlite3.connect('../db.sqlite3')
    cursor = conn.cursor()

    driver = initialize_driver()

    issuer_last_dates = {}

    for issuer in data[:10]: # remove [:10] only for testing
        cursor.execute("SELECT MAX(date) FROM transactions WHERE issuer = ?", (issuer,))
        result = cursor.fetchone()

        if result[0] is not None:
            last_date = result[0]
            issuer_last_dates[issuer] = last_date
        else:
            print(f"Issuer: {issuer} does not exist in the database. Fetching data for the last 10 years...")
            fetch_data_last_10_years(driver, issuer)

    cursor.close()
    conn.close()

    return issuer_last_dates

def filter_3(data):

    return ''.join(filter(str.isalnum, data))

def create_table():
    # Connect to the SQLite database
    conn = sqlite3.connect('../db.sqlite3')  # Adjust path as needed
    cursor = conn.cursor()

    # Define the SQL command to create the table
    create_table_sql = '''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        issuer TEXT,
        date TEXT,
        last_transaction_price REAL,
        max_price REAL,
        min_price REAL,
        average_price REAL,
        percent_change REAL,
        quantity INTEGER,
        turnover_in_best REAL,
        total_turnover REAL
    );
    '''

    # Execute the SQL command to create the table
    cursor.execute(create_table_sql)

    # Commit the changes
    conn.commit()

    # Close the connection
    cursor.close()
    conn.close()

def check_table_exists(table_name):
    # Connect to the SQLite database
    conn = sqlite3.connect('../db.sqlite3')  # Adjust path as needed
    cursor = conn.cursor()

    # Execute a query to get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()  # Fetch all results

    # Extract table names from the fetched results
    existing_tables = [table[0] for table in tables]

    # Check if the specified table exists
    if table_name in existing_tables:
        print(f"The table '{table_name}' exists.")
    else:
        print(f"The table '{table_name}' does not exist.")

    # Close the cursor and connection
    cursor.close()
    conn.close()

def drop_transactions_table():
    # Connect to the SQLite database
    conn = sqlite3.connect('../db.sqlite3')  # Adjust path as needed
    cursor = conn.cursor()

    # Execute the DROP TABLE statement
    cursor.execute("DROP TABLE IF EXISTS transactions;")

    # Commit the changes and close the connection
    conn.commit()
    cursor.close()
    conn.close()
    print("The 'transactions' table has been dropped.")

if __name__ == '__main__':
    # create_table();
    # drop_transactions_table()
    # check_table_exists('transactions')
    issuers = filter_1()
    filter_2(issuers)
    # print(results)