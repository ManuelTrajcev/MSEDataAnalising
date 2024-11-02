from .filters import filter_1, filter_2, filter_3

def process_data(input_data):
    # Initialize data with input
    data = input_data
    # Pass data through filters
    data = filter_1(data)
    data = filter_2(data)
    data = filter_3(data)
    return data