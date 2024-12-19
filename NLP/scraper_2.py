import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from html.parser import HTMLParser
import re
import html
import requests
import pdfplumber
from io import BytesIO
parser = HTMLParser()

payload = {
    "issuerId": 10,
    "languageId": 1,
    "channelId": 1,
    "dateFrom": "2013-03-29T00:00:00",
    "dateTo": "2024-12-20T23:59:59",
    "isPushRequest": False,
    "page": 1
}
headers = {
    "Content-Type": "application/json",
}

url = "https://api.seinet.com.mk/public/documents"
response = requests.post(url, json=payload, headers=headers)
json_data = response.json()

# print(response.json())

for document in json_data['data']:
    issuer_code = document['issuer']['code']
    content = document['content']
    content = html.unescape(content)
    content = re.sub(r'<[^>]*>', '', content)
    published_date = document['publishedDate']
    display_name = document['issuer']['localizedTerms'][0]['displayName']

    attachments = document.get('attachments', [])

    attachment_id = attachments[0].get('attachmentId')
    file_name = attachments[0].get('fileName')

    if file_name.lower().endswith('.pdf'):
        attachment_url = "https://api.seinet.com.mk/public/documents/attachment/" + str(attachment_id)
        response = requests.get(attachment_url)
        if response.status_code == 200:
            pdf_file = BytesIO(response.content)

            with pdfplumber.open(pdf_file) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text()

            print(f"Issuer Code: {issuer_code}", flush=True)
            print(f"Content: {content}", flush=True)
            print(f"Published Date: {published_date}", flush=True)
            print(f"Display Name: {display_name}", flush=True)
            print(f"Attachment ID: {attachment_id}")
            print(f"File Name: {file_name}")
            print("Extracted Text:", text)

        else:
            print(f"Failed to download the file. HTTP Status Code: {response.status_code}")

    print(" ")