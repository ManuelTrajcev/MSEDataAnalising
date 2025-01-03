import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()

from services.datascraper.models import *
from services.datascraper.serializers import DayEntryAsStringSerializer, CompanySerializer
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import tensorflow as tf
from keras import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input


def create_combined_csv(script_dir):
    scalers_dir = os.path.join(script_dir, "scalers")
    company_data = Company.objects.all()
    serializer = CompanySerializer(company_data, many=True)

    os.makedirs(scalers_dir, exist_ok=True)

    combined_data = []

    for entry in serializer.data:
        code = entry['name']

        entries = DayEntryAsString.objects.filter(company_code=code)
        serializer = DayEntryAsStringSerializer(entries, many=True)

        data = serializer.data
        df = pd.DataFrame(data)

        if 'date' not in df.columns or 'last_transaction_price' not in df.columns:
            print(f"Skipping {code}: Missing required columns.")
        elif df['last_transaction_price'].isnull().all():
            print(f"Skipping {code}: No valid transaction prices.")
        else:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df.set_index('date', inplace=True)
            df = df.drop(columns=["id"])
            df['last_transaction_price'] = df['last_transaction_price'].str.replace('.', '')
            df['last_transaction_price'] = df['last_transaction_price'].str.replace(',', '.')
            df['last_transaction_price'] = pd.to_numeric(df['last_transaction_price'], errors='coerce')

            combined_data.append(df)

    combined_data = pd.concat(combined_data)

    # Scale the combined data
    scaler = MinMaxScaler(feature_range=(0, 1))
    combined_data['scaled'] = scaler.fit_transform(combined_data['last_transaction_price'].values.reshape(-1, 1))

    try:
        scaler_path = os.path.join(scalers_dir, "global_scaler.joblib")
        joblib.dump(scaler, scaler_path)
        print(f"Global scaler saved at: {scaler_path}")
    except Exception as e:
        print(f"Error saving global scaler: {e}")

    # Save the combined data to a CSV file
    combined_data_path = os.path.join(script_dir, "combined_company_data.csv")
    combined_data.to_csv(combined_data_path)
    print(f"Combined data saved at: {combined_data_path}")


def create_company_encoder(script_dir):
    company_data = Company.objects.all()
    serializer = CompanySerializer(company_data, many=True)
    codes = np.array([item['name'] for item in serializer.data])
    encoder = LabelEncoder()
    encoded = encoder.fit_transform(codes.reshape(-1, 1))

    encoder_path = os.path.join(script_dir, "label_encoder.joblib")

    joblib.dump(encoder, encoder_path)


def create_time_series_data(data, window_size=10):
    X, y = [], []

    if (len(data) < 2 * window_size):
        return [], []

    for i in range(window_size, len(data)):
        features = data.iloc[i - window_size:i][['company_code_encoded', 'scaled']].values
        target = data.iloc[i]['scaled']
        X.append(features)
        y.append(target)

    return np.array(X), np.array(y)


def create_model(combined_data, encoder):
    combined_data['date'] = pd.to_datetime(combined_data['date'], errors='coerce')
    combined_data['company_code_encoded'] = encoder.transform(combined_data['company_code'].values.reshape(-1, 1))
    combined_data.set_index(keys=["date"], inplace=True)

    grouped = combined_data.groupby('company_code_encoded')

    X_train_list, X_test_list, y_train_list, y_test_list = [], [], [], []

    window_size = 3

    for company_code, group in grouped:
        X_group, y_group = create_time_series_data(group, window_size)

        if len(X_group) > 0 and len(y_group) > 0:
            X_group_train, X_group_test, y_group_train, y_group_test = train_test_split(
                X_group, y_group, test_size=0.3, shuffle=False
            )

            X_train_list.append(X_group_train)
            X_test_list.append(X_group_test)
            y_train_list.append(y_group_train)
            y_test_list.append(y_group_test)

    X_train = np.concatenate(X_train_list, axis=0)
    X_test = np.concatenate(X_test_list, axis=0)
    y_train = np.concatenate(y_train_list, axis=0)
    y_test = np.concatenate(y_test_list, axis=0)

    # print("X_train shape:", X_train.shape)
    # print("X_test shape:", X_test.shape)
    # print("y_train shape:", y_train.shape)
    # print("y_test shape:", y_test.shape)

    model = Sequential([
        Input((X_train.shape[1], X_train.shape[2],)),
        LSTM(128, activation="relu", return_sequences=True),
        LSTM(64, activation="relu"),
        Dense(1, activation="linear")
    ])

    model.compile(optimizer='adam', loss='mean_squared_error', metrics=["mean_squared_error"])

    history = model.fit(
        X_train, y_train,
        epochs=64,
        validation_data=(X_test, y_test),
        # callbacks=[early_stopping]
    )

    model.save("my_model.keras")
