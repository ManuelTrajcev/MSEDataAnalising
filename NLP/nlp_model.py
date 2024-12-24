import torch
from datasets import load_dataset
from torch.utils.data import DataLoader
from transformers import DataCollatorWithPadding
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import get_scheduler
from tqdm import tqdm
from sklearn.metrics import classification_report

device = "cuda" if torch.cuda.is_available() else "cpu"

ds = load_dataset("zeroshot/twitter-financial-news-sentiment")

# tokenizer = AutoTokenizer.from_pretrained("AnkitAI/distilbert-base-uncased-financial-news-sentiment-analysis")
tokenizer = AutoTokenizer.from_pretrained("trained_models/fine_tuned_financial_sentiment_model")


def preprocess_function(examples):
    inputs = tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)
    inputs["labels"] = examples["label"]
    return inputs

encoded_dataset = ds.map(preprocess_function, batched=True)

encoded_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# print(encoded_dataset["train"][0])

train_dataset = encoded_dataset["train"]
valid_dataset = encoded_dataset["validation"]

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
train_loader = DataLoader(train_dataset, shuffle=True, batch_size=16, collate_fn=data_collator)
valid_loader = DataLoader(valid_dataset, batch_size=16, collate_fn=data_collator)

# model = AutoModelForSequenceClassification.from_pretrained(       #NEW MODEL
#     "AnkitAI/distilbert-base-uncased-financial-news-sentiment-analysis",
#     num_labels=3  # Three labels: 1=positive, 0=negatice, 2=neutral
# ).to(device)
model = AutoModelForSequenceClassification.from_pretrained(     #TRAINED MODEL
    "trained_models/fine_tuned_financial_sentiment_model",
    num_labels=3
).to(device)

optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
num_training_steps = 3 * len(train_loader)  # 3 epochs
lr_scheduler = get_scheduler("linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)


model.train()
epochs = 3

for epoch in range(epochs):
    loop = tqdm(train_loader, leave=True)
    for batch in loop:
        batch = {k: v.to(device) for k, v in batch.items()}

        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()

        loop.set_description(f"Epoch {epoch}")
        loop.set_postfix(loss=loss.item())

model.eval()
predictions, true_labels = [], []

with torch.no_grad():
    for batch in valid_loader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        logits = outputs.logits
        predictions.extend(torch.argmax(logits, axis=1).cpu().numpy())
        true_labels.extend(batch["labels"].cpu().numpy())


print(classification_report(true_labels, predictions, target_names=["negative", "positive", "neutral"]))


model.save_pretrained("trained_models/fine_tuned_financial_sentiment_model_5")
tokenizer.save_pretrained("trained_models/fine_tuned_financial_sentiment_model_5")
