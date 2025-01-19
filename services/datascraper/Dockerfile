FROM python:3.9
ENV TF_ENABLE_ONEDNN_OPTS=0

WORKDIR /app

COPY ./services /app/services
COPY ./MSEDataAnalising /app/MSEDataAnalising
COPY ./manage.py /app/manage.py

#RUN rm -rf /app/services/lstm
RUN pip install --no-cache-dir -r /app/services/datascraper/requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
