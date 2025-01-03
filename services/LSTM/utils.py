import os
import joblib
import pandas as pd
import tensorflow as tf
import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose
from datetime import datetime

from .oscillators.oscilators import RSIStrategy, StochKStrategy, CCIStrategy, MACDStrategy, ADXStrategy
from .moving_averages.moving_avgs import SMAStrategy, EMAStrategy, IchimokuBaselineStrategy

from services.datascraper.models import DayEntryAsString
from services.datascraper.serializers import DayEntryAsStringSerializer

WINDOW = 14
SMOOTH_WINDOW = None
SHORT_TERM_WINDOW = 50
LONG_TERM_WINDOW = 200
TOTAL_ENTRIES = 2520

# Factory for Indicator Strategies
class IndicatorStrategyFactory:
    @staticmethod
    def get_strategy(indicator):
        strategies = {
            'RSI': RSIStrategy(WINDOW),
            'stoch_k': StochKStrategy(WINDOW, SMOOTH_WINDOW),
            'cci': CCIStrategy(WINDOW),
            'macd': MACDStrategy(WINDOW),
            'adx': ADXStrategy(WINDOW),
            'SMA(50)': SMAStrategy(SHORT_TERM_WINDOW),
            'SMA(200)': SMAStrategy(LONG_TERM_WINDOW),
            'EMA(50)': EMAStrategy(SHORT_TERM_WINDOW),
            'EMA(200)': EMAStrategy(LONG_TERM_WINDOW),
            'Ichimoku_Baseline': IchimokuBaselineStrategy()
        }
        return strategies.get(indicator)


# Template Method for Processing
class DataProcessor:
    def __init__(self, indicators, freqs = ['1D', '1W', '1ME']):
        self.indicators = indicators
        self.freqs = freqs

    def process(self, company_code):
        entries = DayEntryAsString.objects.filter(company_code=company_code)
        serializer = DayEntryAsStringSerializer(entries, many=True)
        data = serializer.data

        df = pd.DataFrame(data)
        df = clean_data(df)

        missing_entries, missing_percentage = calculate_missing_entries(df)

        # print(f"Missing entries: {missing_entries}")
        # print(f"Missing percentage: {missing_percentage:.2f}%")

        if missing_percentage > 20:
            raise ValueError(f"Company {company_code} has too much missing data (over 20%). Skipping analysis.")

        results = {}

        for freq in self.freqs:
            resampled_data = resample_data(df, freq) if freq != '1D' else df

            for indicator in self.indicators:
                strategy = IndicatorStrategyFactory.get_strategy(indicator)
                if strategy:
                    resampled_data = strategy.calculate(resampled_data)
                    resampled_data = strategy.generate_signals(resampled_data)

            results[freq] = resampled_data

        return results

def clean_data(data):
    data['last_transaction_price'] = data['last_transaction_price'].str.replace('.', '').str.replace(',', '.')
    data['last_transaction_price'] = pd.to_numeric(data['last_transaction_price'], errors='coerce')
    data['max_price'] = data['max_price'].str.replace('.', '').str.replace(',', '.')
    data['max_price'] = pd.to_numeric(data['max_price'], errors='coerce')
    data['min_price'] = data['min_price'].str.replace('.', '').str.replace(',', '.')
    data['min_price'] = pd.to_numeric(data['min_price'], errors='coerce')
    data['date'] = pd.to_datetime(data['date'], errors='coerce')
    data = data.sort_values(by='date', ascending=True).reset_index(drop=True)
    data.set_index('date', inplace=True)
    data['max_price'] = data['max_price'].ffill()
    data['min_price'] = data['min_price'].ffill()
    return data


def resample_data(data, freq):
    resampled_data = data.resample(freq).agg({
        'last_transaction_price': 'mean',
        'max_price': 'max',
        'min_price': 'min'
    })

    if resampled_data['last_transaction_price'].isnull().any():
        resampled_data['last_transaction_price'] = resampled_data[
            'last_transaction_price'].ffill()
        print(f'null in last_tran in {freq}')
    if resampled_data['max_price'].isnull().any():
        resampled_data['max_price'] = resampled_data['max_price'].ffill()
        print(f'null in max in {freq}')
    if resampled_data['min_price'].isnull().any():
        resampled_data['min_price'] = resampled_data['min_price'].ffill()
        print(f'null in min in {freq}')

    return resampled_data


def calculate_missing_entries(df, total_entries=TOTAL_ENTRIES):
    actual_entries = len(df)
    missing_entries = total_entries - actual_entries
    missing_percentage = (missing_entries / total_entries) * 100

    return missing_entries, missing_percentage
