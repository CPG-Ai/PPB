FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt update && apt install -y \
    tesseract-ocr \
    libglib2.0-0 \
    && apt clean

# Copy files
COPY . /app

# Install Python packages
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
