import os
import joblib
import pandas as pd
import tensorflow as tf
from statsmodels.tsa.seasonal import seasonal_decompose
from datetime import datetime
import numpy as np

from .utils import DataProcessor, clean_data

from services.datascraper.models import DayEntryAsString
from services.datascraper.serializers import DayEntryAsStringSerializer


def fetch_and_clean_data(company_code, start_date=None, end_date=None):
    if start_date and end_date:
        entries = DayEntryAsString.objects.filter(company_code=company_code, date__range=[start_date, end_date])
    else:
        entries = DayEntryAsString.objects.filter(company_code=company_code)

    serializer = DayEntryAsStringSerializer(entries, many=True)
    data = serializer.data

    df = pd.DataFrame(data)
    df = clean_data(df)

    return df


def get_lstm_predictions(company_code, window_size=3, prediction_steps=10):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    lstm_dir = os.path.join(script_dir, "lstm")  # Path to the lstm folder

    encoder_path = os.path.join(lstm_dir, "label_encoder.joblib")
    encoder = joblib.load(encoder_path)

    scaler_path = os.path.join(lstm_dir, "global_scaler.joblib")
    scaler = joblib.load(scaler_path)

    model_path = os.path.join(lstm_dir, "my_model.keras")
    model = tf.keras.models.load_model(model_path)

    df = fetch_and_clean_data(company_code)

    df['company_code_encoded'] = encoder.transform(df['company_code'].values.reshape(-1, 1))

    encoded_company_code = encoder.transform([company_code])[0]

    if len(df) < 2 * window_size:
        raise ValueError(f"Not enough data for company {company_code}. Requires at least {window_size} rows.")

    df['scaled'] = scaler.transform(df['last_transaction_price'].values.reshape(-1, 1))

    X = df.iloc[-window_size:][['company_code_encoded', 'scaled']].copy()
    X['company_code_encoded'] = encoded_company_code
    X = X.values.reshape(1, window_size, X.shape[1])

    predictions = []

    for _ in range(prediction_steps):
        next_pred_scaled = model.predict(X)[0, 0]
        predictions.append(next_pred_scaled)

        next_row = [encoded_company_code, next_pred_scaled]
        X = np.append(X[:, 1:, :], [[next_row]], axis=1)

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).reshape(1, -1)[0]
    last_date = pd.to_datetime(df.index[-1])
    prediction_dates = [last_date + pd.Timedelta(days=i + 1) for i in range(len(predictions))]

    # print(predictions)
    # print(prediction_dates)
    # print(cf)

    # Prepare the response data
    response_data = {
        "predictions": predictions.tolist(),
        "prediction_dates": [str(date) for date in prediction_dates],
        "company_data": df.to_dict(orient="records")
    }

    return response_data


def get_oscillator_signals(company_code):
    indicators = ['RSI', 'stoch_k', 'cci', 'macd', 'adx']
    processor = DataProcessor(indicators)
    processed_data = processor.process(company_code)

    # Prepare response
    response_data = {}
    for freq, data in processed_data.items():
        response_data[freq] = data.tail(1).to_dict(orient="records")

    return response_data


def get_moving_average_signals(company_code):
    indicators = ['SMA(50)', 'SMA(200)', 'EMA(50)', 'EMA(200)', 'Ichimoku_Baseline']
    processor = DataProcessor(indicators)
    processed_data = processor.process(company_code)

    # Prepare response
    response_data = {}
    for freq, data in processed_data.items():
        response_data[freq] = data.tail(1).to_dict(orient="records")

    return response_data


def perform_time_series_analysis(company_code, start_date, end_date):
    # Parse dates
    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

    df = fetch_and_clean_data(company_code, start_date, end_date)

    df = df.resample('D').last()
    df['last_transaction_price'] = df['last_transaction_price'].fillna(method='ffill')

    # Perform seasonal decomposition
    decomposition_A = seasonal_decompose(df['last_transaction_price'], model='additive')

    trend = decomposition_A.trend.dropna().tolist()
    seasonal = decomposition_A.seasonal.dropna().tolist()
    residual = decomposition_A.resid.dropna().tolist()

    response_data = {
        'trend': trend,
        'seasonal': seasonal,
        'residual': residual,
        'timestamp': df.index.strftime('%Y-%m-%d').tolist()
    }

    return response_data
