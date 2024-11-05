from celery import Celery

# Configure Celery with Redis as the broker
celery_app = Celery('tasks',
                    broker='redis://localhost:6379/0',
                    backend='redis://localhost:6379/0')

celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json']
)