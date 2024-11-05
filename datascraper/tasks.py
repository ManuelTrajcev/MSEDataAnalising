from celery_app import celery_app
from utils import get_10_year_data
@celery_app.task
def start_scrapper(company):
    try:
        print(f"Fetching data for {company}")
        get_10_year_data(company)
        print(f"Data for {company} retrieved")
    except Exception as e:
        print(f"Error fetching data for {company}: {e}")
        raise e  #
