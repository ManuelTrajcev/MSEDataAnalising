import requests
from bs4 import BeautifulSoup
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

def filter_2(data):
    #for item in data:

    return data.lower()

def filter_3(data):

    return ''.join(filter(str.isalnum, data))

if __name__ == '__main__':
    filter_1()