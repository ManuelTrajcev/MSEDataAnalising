import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta


def get_page_count():
    url = "https://www.mse.mk/en/news/latest/1"

    response = requests.get(url)

    last_page_number = -1

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")

        links = soup.findAll('a')

        for link in links:
            if link.text.strip() == 'Last':
                last_page_number = int(link['href'].split('/')[-1])
    else:
        print("Failed to fetch the page.")

    return last_page_number


def get_page_links(last_page_number):
    base_url = "https://www.mse.mk/en/news/latest/"
    all_news_links = []

    today = datetime.today()

    stop_processing = False

    for page in range(1, last_page_number):
        if stop_processing:
            break

        url = f"{base_url}{page}"
        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            rows = soup.findAll('div', class_='row')
            for row in rows:
                if row.find('a') is not None:
                    news_date_str = row.find('a').text.strip()
                    try:
                        news_date = datetime.strptime(news_date_str, "%m/%d/%Y")
                    except ValueError:
                        print(f"Could not parse date: {news_date_str}")
                        continue

                    if today - news_date <= timedelta(weeks=2):
                        print(f"News date: {news_date_str}")
                        print(f"News link: {row.find('a')['href']}")
                        title = row.find(class_='col-md-11').find('a').text.strip()
                        link = f"https://www.mse.mk{row.find(class_='col-md-1').find('a')['href']}"
                        print(title)
                        print(link)
                        content = get_news_content(link)
                        all_news_links.append({'date': news_date, 'title': title, 'link': link , 'content': content})
                    else:
                        print(f"Found news older than 2 weeks: {news_date_str}")
                        stop_processing = True  # TODO STOP CONDITION
                        break
        else:
            print(f"Failed to fetch page {page}")

    return all_news_links


def get_news_content(url):
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        content_div = soup.find('div', id='content')

        if content_div:
            paragraphs = content_div.find_all('p')
            content = [paragraph.text.strip() for paragraph in paragraphs]

            print(f"News from {url}:")
            for paragraph in content:
                print(paragraph)
            print("\n" + "-" * 50 + "\n")

            return content
        else:
            print(f"No content found on {url}")
            return None
    else:
        print(f"Failed to fetch the page {url}")
        return None


if __name__ == "__main__":
    page_count = get_page_count()
    get_page_links(last_page_number=page_count)
    print("")
