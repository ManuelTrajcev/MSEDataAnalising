from django.shortcuts import render

# Create your views here.
# views.py (Django)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import joblib
import pandas as pd
import tensorflow as tf
from .lstm.lstm import predictions
from .oscillators.oscilators import process_company_data
from .moving_averages.moving_avgs import process_company_data2


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
