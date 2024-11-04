from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from bs4 import BeautifulSoup
import requests

def set_date_range(driver, start_date, end_date):
    # Locate the date input fields and set the dates
    from_date = driver.find_element(By.ID, 'FromDate')
    to_date = driver.find_element(By.ID, 'ToDate')
    from_date.clear()
    from_date.send_keys(start_date.strftime('%d.%m.%Y'))
    to_date.clear()
    to_date.send_keys(end_date.strftime('%d.%m.%Y'))


#TODO MAIN

# Initialize the WebDriver (using Chrome in this example)
driver = webdriver.Chrome()  # Or specify the path: webdriver.Chrome(executable_path='path_to_chromedriver')

# Open the target URL
url = "https://www.mse.mk/mk/stats/symbolhistory/KMB"  # Replace with your actual URL
driver.get(url)

date_to = driver.find_element(By.ID, "ToDate")
date_from = driver.find_element(By.ID, "FromDate")
btn = driver.find_element(By.CLASS_NAME, "btn-primary-sm")



#BEAUTIFUL SOUP
response = requests.get(url)
raw_html = response.text
soup = BeautifulSoup(raw_html, "html.parser")
table = soup.find('table', id='resultsTable')


#sleep(3)
driver.execute_script("arguments[0].value = arguments[1];", date_to, "04.11.2024")
driver.execute_script("arguments[0].value = arguments[1];", date_from, "05.11.2023")
btn.click()
sleep(1)

scroll_container = driver.find_element(By.ID, "mCSB_1_container")
scroll_increment = -31
NUMBER_OF_ITERATIONS = 5
all_data = []
scrollHeight = 100

# Locate the scrolling container
# Define the amount to scroll
scroll_amount = 31*10  # Adjust this value as needed (negative for down, positive for up)
scroll_position = -scroll_amount
scroll_height = driver.execute_script("return arguments[0].scrollHeight", scroll_container)

# Use JavaScript to modify the 'top' property for scrolling
for i in range(NUMBER_OF_ITERATIONS):
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find('table', id='resultsTable')

    scroll_script = f"arguments[0].style.top = '{scroll_position}px';"
    driver.execute_script(scroll_script, scroll_container)
    rows = table.find_all('tr')
    for row in rows:
        columns = row.find_all('td')
        row_data = [column.text.strip() for column in columns]  # Extract and clean text from each column
        if row_data:
            all_data.append(row_data)

    scroll_position -= scroll_amount
    if scroll_position < -6147:
        break

# Wait a bit to observe the scroll

# Print or process the collected data
for row in all_data:
    print(row)

print(len(all_data))
# Close the driver after finishing
driver.quit()
