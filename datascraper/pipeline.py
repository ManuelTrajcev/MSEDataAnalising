from .filters import filter_1, filter_2, filter_3

def process_data(input_data):
    data = input_data
    data = filter_1(data)
    data = filter_2(data)
    data = filter_3(data)
    return data