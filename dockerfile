FROM python:3.10-slim

WORKDIR /app
COPY . /app

RUN apt update && apt install -y tesseract-ocr libglib2.0-0 && apt clean

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
