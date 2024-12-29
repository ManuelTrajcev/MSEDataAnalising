# Create your views here.
# views.py (Django)

from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import joblib
import pandas as pd
import tensorflow as tf
from .lstm.lstm import predictions
from .oscillators.oscilators import process_company_data, clean_data
from .moving_averages.moving_avgs import process_company_data2
from datascraper.serializers import DayEntryAsStringSerializer
from datascraper.models import *
from statsmodels.tsa.seasonal import seasonal_decompose
from datetime import datetime

@api_view(['GET'])
def get_prediction_data(request):
    company_code = request.query_params.get('company_code')

    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        lstm_dir = os.path.join(script_dir, "lstm")  # Path to the lstm folder

        # Load necessary files
        combined_data_path = os.path.join(lstm_dir, "combined_company_data.csv")
        combined_data = pd.read_csv(combined_data_path)

        encoder_path = os.path.join(lstm_dir, "label_encoder.joblib")
        encoder = joblib.load(encoder_path)

        scaler_path = os.path.join(lstm_dir, "global_scaler.joblib")
        scaler = joblib.load(scaler_path)

        model_path = os.path.join(lstm_dir, "my_model.keras")
        model = tf.keras.models.load_model(model_path)

        predictions_data, prediction_dates, company_data = predictions(
            combined_data, company_code, encoder, model, scaler, prediction_steps=10)

        # Prepare the response data
        response_data = {
            "predictions": predictions_data.tolist(),
            "prediction_dates": [str(date) for date in prediction_dates],
            "company_data": company_data.to_dict(orient="records")
        }

        return Response(response_data)

    except ValueError as e:
        return Response({"error": str(e)})

@api_view(['GET'])
def oscillator_signals(request):
    company_code = request.query_params.get('company_code')

    try:
        results = process_company_data(company_code)

        # Prepare response
        response_data = {}
        for freq, data in results.items():
            response_data[freq] = data.tail(1).to_dict(orient="records")

        return Response(response_data)
    except ValueError as e:
        return Response({"error": str(e)})
    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)})


@api_view(['GET'])
def moving_average_signals(request):
    company_code = request.query_params.get('company_code')

    try:
        results = process_company_data2(company_code)

        response_data = {}
        for freq, data in results.items():
            response_data[freq] = data.tail(1).to_dict(orient="records")

        return Response(response_data)
    except ValueError as e:
        return Response({"error": str(e)})
    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)})


@api_view(['GET'])
def time_series_analysis(request):
    company_code = request.query_params.get('company_code')
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid start date format. Please use YYYY-MM-DD."}, status=400)

    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid end date format. Please use YYYY-MM-DD."}, status=400)

    entries = DayEntryAsString.objects.filter(company_code=company_code, date__range=[start_date, end_date])
    serializer = DayEntryAsStringSerializer(entries, many=True)
    data = serializer.data

    df = pd.DataFrame(data)

    df = clean_data(df)
    df = df.resample('D').last()
    df['last_transaction_price'] = df['last_transaction_price'].fillna(
        method='ffill')

    decomposition_A = seasonal_decompose(df['last_transaction_price'], model='additive')

    trend = decomposition_A.trend.dropna().tolist()
    seasonal = decomposition_A.seasonal.dropna().tolist()
    residual = decomposition_A.resid.dropna().tolist()

    response_data = {
        'trend': trend,
        'seasonal': seasonal,
        'residual': residual,
        'timestamp': df.index
    }

    return Response(response_data)