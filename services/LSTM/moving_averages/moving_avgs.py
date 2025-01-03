from services.LSTM.base_ta import IndicatorStrategy

# Simple Moving Average (SMA) Strategy
class SMAStrategy(IndicatorStrategy):
    def __init__(self, window, threshold=0.1):
        self.window = window
        self.threshold = threshold

    def calculate(self, data):
        if len(data) >= self.window:
            data[f'SMA({self.window})'] = data['last_transaction_price'].rolling(window=self.window).mean()
        else:
            small_window = int(len(data) * 0.9)
            data[f'SMA({self.window})'] = data['last_transaction_price'].rolling(window=small_window).mean()
        return data

    def generate_signals(self, data):
        signal_column = f'Signal_SMA({self.window})'
        data[signal_column] = 'Hold'

        buy_condition = data['last_transaction_price'] > (1 + self.threshold) * data[f'SMA({self.window})']
        sell_condition = data['last_transaction_price'] < (1 - self.threshold) * data[f'SMA({self.window})']

        data.loc[buy_condition, signal_column] = 'Buy'
        data.loc[sell_condition, signal_column] = 'Sell'
        return data


# Exponential Moving Average (EMA) Strategy
class EMAStrategy(IndicatorStrategy):
    def __init__(self, span, threshold=0.1):
        self.span = span
        self.threshold = threshold

    def calculate(self, data):
        if len(data) >= self.span:
            data[f'EMA({self.span})'] = data['last_transaction_price'].ewm(span=self.span, adjust=False).mean()
        else:
            small_window = int(len(data) * 0.9)
            data[f'EMA({self.span})'] = data['last_transaction_price'].rolling(window=small_window).mean()
        return data

    def generate_signals(self, data):
        signal_column = f'Signal_EMA({self.span})'
        data[signal_column] = 'Hold'

        buy_condition = data['last_transaction_price'] > (1 + self.threshold) * data[f'EMA({self.span})']
        sell_condition = data['last_transaction_price'] < (1 - self.threshold) * data[f'EMA({self.span})']

        data.loc[buy_condition, signal_column] = 'Buy'
        data.loc[sell_condition, signal_column] = 'Sell'
        return data


# Ichimoku Baseline Strategy
class IchimokuBaselineStrategy(IndicatorStrategy):
    def __init__(self, threshold=0.1):
        self.threshold = threshold

    def calculate(self, data):
        data['Ichimoku_Baseline'] = (
                                            data['max_price'].rolling(window=26).max() +
                                            data['min_price'].rolling(window=26).min()
                                    ) / 2
        return data

    def generate_signals(self, data):
        signal_column = 'Signal_Ichimoku_Baseline'
        data[signal_column] = 'Hold'

        buy_condition = data['last_transaction_price'] > (1 + self.threshold) * data['Ichimoku_Baseline']
        sell_condition = data['last_transaction_price'] < (1 - self.threshold) * data['Ichimoku_Baseline']

        data.loc[buy_condition, signal_column] = 'Buy'
        data.loc[sell_condition, signal_column] = 'Sell'
        return data


# Factory to get the correct Indicator Strategy based on the indicator name
class IndicatorStrategyFactory:
    @staticmethod
    def get_strategy(indicator):
        strategies = {
            'SMA(50)': SMAStrategy(50),
            'SMA(100)': SMAStrategy(100),
            'EMA(50)': EMAStrategy(50),
            'EMA(100)': EMAStrategy(100),
            'Ichimoku_Baseline': IchimokuBaselineStrategy()
        }
        return strategies.get(indicator)
