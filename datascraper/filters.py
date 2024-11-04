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



def set_date_range(driver, start_date, end_date):
    # Locate the date input fields and set the dates
    from_date = driver.find_element(By.ID, 'FromDate')
    to_date = driver.find_element(By.ID, 'ToDate')
    from_date.clear()
    from_date.send_keys(start_date.strftime('%d.%m.%Y'))
    to_date.clear()
    to_date.send_keys(end_date.strftime('%d.%m.%Y'))



def convert_price_format(price_str):
    # Remove thousands separator (.)
    price_str = price_str.replace('.', '').replace(',', '.')
    # Convert the cleaned string to a float
    return float(price_str)

def fetch_data(driver):
    # Click the "Прикажи" button to display the data
    show_button = driver.find_element(By.XPATH, '//input[@value="Прикажи"]')
    show_button.click()
    time.sleep(3)  # Wait for data to load; adjust as needed

    table = driver.find_element(By.ID, 'resultsTable')

    # scroll_to_bottom(driver)

    rows = table.find_elements(By.TAG_NAME, 'tr')

    data = []
    for row in rows[1:]: # Skip the header row
        # time.sleep(1)
        cols = row.find_elements(By.TAG_NAME, 'td')
        if cols:  # Check if row has any data
            # Extract the relevant data
            date = cols[0].text
            last_transaction_price = convert_price_format(cols[1].text.strip()) if cols[1].text.strip() else None
            max_price = convert_price_format(cols[2].text.strip()) if cols[2].text.strip() else None
            min_price = convert_price_format(cols[3].text.strip()) if cols[3].text.strip() else None
            average_price = convert_price_format(cols[4].text.strip()) if cols[4].text.strip() else None
            percent_change = convert_price_format(cols[5].text.strip()) if cols[5].text.strip() else None
            quantity = int(cols[6].text.strip()) if cols[6].text.strip() else None
            turnover_in_best = convert_price_format(cols[7].text.strip()) if cols[7].text.strip() else None
            total_turnover = convert_price_format(cols[8].text.strip()) if cols[8].text.strip() else None

            # Append to the data list
            data.append((date, float(last_transaction_price) if last_transaction_price else None, float(max_price) if max_price else None,
                         float(min_price) if min_price else None, float(average_price) if average_price else None,
                         float(percent_change) if percent_change else None, quantity if quantity else None,
                         float(turnover_in_best) if turnover_in_best else None,
                         float(total_turnover) if total_turnover else None))

    return data # none for all other entries except the first 11 entries


def filter_2(companies):
    for company in companies:


def filter_3(last_dates):
    conn = sqlite3.connect('../db.sqlite3')  # Adjust path as needed
    cursor = conn.cursor()

    driver = initialize_driver()  # Initialize the Selenium driver

    for issuer, last_date in last_dates.items():
        # Convert last_date to datetime object
        last_date_dt = datetime.strptime(last_date, '%d.%m.%Y')

        # Set the date range for fetching new data
        start_date = last_date_dt + timedelta(days=1)
        end_date = datetime.today()

        while start_date < end_date:
            next_end_date = min(end_date, start_date + timedelta(days=365))

            set_date_range(driver, start_date, next_end_date)
            select_issuer_code(driver, issuer)
            new_data = fetch_data(driver)

            if new_data:
                save_data_to_db(new_data, issuer)

            start_date = next_end_date

    cursor.close()
    conn.close()
    driver.quit()

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

def check_table_population():
    conn = sqlite3.connect('../db.sqlite3')  # Adjust path as needed
    cursor = conn.cursor()

    # Query to select all data from the transactions table
    cursor.execute('SELECT * FROM transactions')

    # Fetch all rows from the query result
    rows = cursor.fetchall()

    # Print the results
    for row in rows:
        print(row)

    cursor.close()
    conn.close()

if __name__ == '__main__':
    companies = filter_1()
    filter_2(companies)