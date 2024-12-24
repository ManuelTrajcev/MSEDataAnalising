import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import django
from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Process
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MSEDataAnalising.settings')
django.setup()
from NLP.models import *

device = "cuda" if torch.cuda.is_available() else "cpu"

model_path = "trained_models/fine_tuned_financial_sentiment_model_5"
model = AutoModelForSequenceClassification.from_pretrained(model_path).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_path)


def predict(text):
    inputs = tokenizer(text, truncation=True, padding="max_length", max_length=128, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    predicted_class = torch.argmax(logits, dim=-1).item()

    labels = ["negative", "positive", "neutral"]
    predicted_label = labels[predicted_class]

    return predicted_label


def process_news_entry(newsEntry):
    try:
        sentiment = predict(newsEntry.content)
        print(f"Document id: {newsEntry.document_id}, Prediction: {sentiment}")
        newsEntry.sentiment = sentiment
        newsEntry.save()
    except Exception as e:
        print(f"Error processing entry ID {newsEntry.document_id}: {e}")
        try:
            newsEntry.delete()
            print(f"Entry ID {newsEntry.document_id} deleted due to an error.")
        except Exception as delete_error:
            print(f"Failed to delete entry ID {newsEntry.document_id}: {delete_error}")


def process_news_entries(news_entries, num_threads):
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        executor.map(process_news_entry, news_entries)


if __name__ == "__main__":
    start_time = time.time()
    all_news_entries = News.objects.all()
    num_threads = os.cpu_count()

    process_news_entries(all_news_entries, num_threads)

    end_time = time.time()
    print(f"Total execution time: {end_time - start_time:.2f} seconds")
    print("Processing complete.")
