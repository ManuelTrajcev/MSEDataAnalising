from celery import Celery
#docker run -d -p 6379:6379 --name redis redis
#celery -A celery_app worker --loglevel=info --concurrency=3
# Configure Celery with Redis as the broker
celery_app = Celery('celery_app',
                    broker='redis://localhost:6379/0',
                    backend='redis://localhost:6379/0')

celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json']
)