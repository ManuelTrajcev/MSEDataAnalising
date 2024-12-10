import pandas as pd
from filters import filter_1, filter_2, filter_3, filter_1_corrected

def process_data(input_data):
    # data = filter_1(input_data)
    data = filter_1_corrected(input_data)
    print(data)
    data = filter_2(data)
    print(data)
    data = filter_3(data)
    return data

if __name__ == "__main__":
    url_ = "https://www.mse.mk/mk/stats/symbolhistory/KMB"  #Input for option 1
    url_corrected = "https://www.mse.mk/en/stats/current-schedule"  #Input for option 2
    # data = process_data(url)  #OPTON 1
    data = process_data(url_corrected)    #OPTION 2

    print(f"Total number of new companies: {len(data)}")
    total_data = 0
    for company_code, data_per_company in data:
        total_data += len(data_per_company)
        df = pd.DataFrame(data_per_company)
        df.to_csv(f'all_data/{company_code}.csv', index=False)

    print(f"Total number of new data scraped: {total_data} (rows)")