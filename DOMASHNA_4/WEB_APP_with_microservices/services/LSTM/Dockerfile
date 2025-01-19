FROM python:3.9

ENV TF_ENABLE_ONEDNN_OPTS=0

WORKDIR /app

COPY ./services /app/services
COPY ./MSEDataAnalising /app/MSEDataAnalising
COPY ./manage.py /app/manage.py
COPY ./db.sqlite3 /app/db.sqlite3

RUN pip install --no-cache-dir -r /app/services/datascraper/requirements.txt

RUN apt-get update && apt-get install -y openssh-server && \
    mkdir /var/run/sshd && \
    echo 'root:Docker!' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "UseDNS no" >> /etc/ssh/sshd_config

EXPOSE 8002 2224

CMD ["sh", "-c", "service ssh start && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8001 --app=lstm"]


