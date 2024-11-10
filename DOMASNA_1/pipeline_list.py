from filters_list import filter_1, filter_2, filter_3

def process_data(input_data):
    data = filter_1(input_data)
    print(data)
    data = filter_2(data)
    print(data)
    data = filter_3(data)


if __name__ == "__main__":
    process_data("https://www.mse.mk/mk/stats/symbolhistory/KMB")